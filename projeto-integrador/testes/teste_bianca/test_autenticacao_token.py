import unittest
import hashlib

SEGREDO_SERVIDOR = "nossa_chave_super_hiper_mega_secreta"


def assinar(payload, segredo):
    """Simula a assinatura de um token (o que o jwt.sign faz de verdade,
    de forma bem simplificada, só pra testar a lógica de comparação)."""
    return hashlib.sha256((payload + segredo).encode()).hexdigest()


def gerar_token(payload, segredo=SEGREDO_SERVIDOR):
    """Simula jwt.sign(): devolve o 'token' como uma única string,
    no formato 'payload::assinatura' (parecido com um JWT real)."""
    assinatura = assinar(payload, segredo)
    return f"{payload}::{assinatura}"


def autenticar_token(auth_header):
    """
    Reimplementação da parte do middleware que verifica se o token é
    autêntico. `auth_header` simula o cabeçalho "Authorization" recebido
    na requisição (uma string, ou None se não foi enviado).
    """
    if not auth_header:
        return {"status": 401, "erro": "token nao fornecido."}

    partes_header = auth_header.split(" ")
    if len(partes_header) != 2 or partes_header[0] != "Bearer":
        return {"status": 401, "erro": "token nao fornecido."}

    token = partes_header[1]

    if "::" not in token:
        return {"status": 401, "erro": "token invalido ou expirado."}

    payload, assinatura_recebida = token.rsplit("::", 1)
    assinatura_esperada = assinar(payload, SEGREDO_SERVIDOR)

    if assinatura_recebida != assinatura_esperada:
        return {"status": 401, "erro": "token invalido ou expirado."}

    return {"status": 200, "autenticado": True, "payload": payload}


class TestAutenticacaoToken(unittest.TestCase):

    def test_sem_cabecalho_authorization_e_bloqueado(self):
        resultado = autenticar_token(None)
        self.assertEqual(resultado["status"], 401)
        self.assertEqual(resultado["erro"], "token nao fornecido.")

    def test_cabecalho_sem_prefixo_bearer_e_bloqueado(self):
        resultado = autenticar_token("apenas_o_token_sem_bearer")
        self.assertEqual(resultado["status"], 401)

    def test_token_com_assinatura_correta_e_autenticado(self):
        token_valido = gerar_token('{"nome":"Bianca","role":"responsavel"}')
        resultado = autenticar_token(f"Bearer {token_valido}")

        self.assertEqual(resultado["status"], 200)
        self.assertTrue(resultado["autenticado"])

    def test_token_assinado_com_segredo_errado_e_rejeitado(self):
        # simula alguém tentando forjar um token com um segredo diferente
        # do que o nosso servidor usa de verdade
        token_forjado = gerar_token(
            '{"nome":"Invasor","role":"pedagogia"}', segredo="chave_errada"
        )
        resultado = autenticar_token(f"Bearer {token_forjado}")

        self.assertEqual(resultado["status"], 401)
        self.assertEqual(resultado["erro"], "token invalido ou expirado.")

    def test_token_adulterado_depois_de_gerado_e_rejeitado(self):
        # gera um token válido, mas troca o payload sem re-assinar —
        # é exatamente isso que alguém malicioso tentaria fazer pra virar
        # "pedagogia" sem ter permissão de verdade
        token_original = gerar_token('{"nome":"Bianca","role":"responsavel"}')
        payload_original, assinatura = token_original.rsplit("::", 1)

        payload_adulterado = '{"nome":"Bianca","role":"pedagogia"}'
        token_adulterado = (
            f"{payload_adulterado}::{assinatura}"  # assinatura antiga, payload novo
        )

        resultado = autenticar_token(f"Bearer {token_adulterado}")
        self.assertEqual(resultado["status"], 401)

    def test_token_totalmente_inventado_e_rejeitado(self):
        resultado = autenticar_token("Bearer token_inventado_qualquer")
        self.assertEqual(resultado["status"], 401)


if __name__ == "__main__":
    unittest.main()
