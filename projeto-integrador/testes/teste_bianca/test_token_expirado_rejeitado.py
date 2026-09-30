import unittest
import time


def token_esta_valido(token, agora=None):
    """
    Reimplementação da checagem de expiração feita pelo jwt.verify() por
    trás dos panos. `agora` é opcional só pra facilitar os testes (permite
    "congelar" o relógio em vez de depender do tempo real do computador).
    """
    if agora is None:
        agora = time.time()

    if token is None or "exp" not in token:
        return {"valido": False, "erro": "token invalido ou expirado."}

    if token["exp"] <= agora:
        return {"valido": False, "erro": "token invalido ou expirado."}

    return {"valido": True}


def token_esta_na_blacklist(token, blacklist):
    """Simula a checagem de logout: um token 'colocado na lista negra'
    deve ser tratado como inválido, mesmo que ainda não tenha vencido."""
    return token.get("id") in blacklist


class TestExpiracaoPorTempo(unittest.TestCase):

    def test_token_com_expiracao_no_futuro_e_valido(self):
        agora = 1000.0
        token = {
            "nome": "Bianca",
            "role": "responsavel",
            "exp": agora + 7200,
        }  # expira em 2h
        resultado = token_esta_valido(token, agora=agora)
        self.assertTrue(resultado["valido"])

    def test_token_com_expiracao_no_passado_e_rejeitado(self):
        agora = 1000.0
        token = {
            "nome": "Bianca",
            "role": "responsavel",
            "exp": agora - 1,
        }  # expirou há 1 segundo
        resultado = token_esta_valido(token, agora=agora)
        self.assertFalse(resultado["valido"])
        self.assertEqual(resultado["erro"], "token invalido ou expirado.")

    def test_token_expirando_no_exato_instante_e_tratado_como_expirado(self):
        agora = 1000.0
        token = {"nome": "Bianca", "role": "responsavel", "exp": agora}  # exp == agora
        resultado = token_esta_valido(token, agora=agora)
        self.assertFalse(resultado["valido"])

    def test_token_sem_campo_exp_e_rejeitado(self):
        token_malformado = {"nome": "Bianca", "role": "responsavel"}  # sem "exp"
        resultado = token_esta_valido(token_malformado, agora=1000.0)
        self.assertFalse(resultado["valido"])

    def test_token_none_e_rejeitado(self):
        resultado = token_esta_valido(None, agora=1000.0)
        self.assertFalse(resultado["valido"])

    def test_token_valido_minutos_antes_de_expirar_ainda_passa(self):
        agora = 1000.0
        token = {
            "nome": "Bianca",
            "exp": agora + 60,
        }  # expira em 1 minuto, mas ainda não expirou
        resultado = token_esta_valido(token, agora=agora)
        self.assertTrue(resultado["valido"])


class TestLogoutInvalidaToken(unittest.TestCase):
    """Simula a regra: 'expirar imediatamente caso o usuário faça logout'."""

    def test_token_na_blacklist_e_considerado_invalido_mesmo_sem_vencer(self):
        blacklist = {"token_id_123"}  # tokens que já fizeram logout
        token = {"id": "token_id_123", "exp": 9999999999}  # ainda não venceu pelo tempo

        self.assertTrue(token_esta_na_blacklist(token, blacklist))

    def test_token_fora_da_blacklist_nao_e_afetado(self):
        blacklist = {"token_id_123"}
        outro_token = {"id": "token_id_456", "exp": 9999999999}

        self.assertFalse(token_esta_na_blacklist(outro_token, blacklist))


if __name__ == "__main__":
    unittest.main()
