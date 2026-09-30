import unittest

MINIMO_CARACTERES = 10
MAXIMO_CARACTERES = 1000


def validar_texto(texto):
    """
    Reimplementação da validação de tamanho de texto (usada tanto no
    feedback quanto poderia ser usada nos avisos da pedagogia).
    """
    if not texto or not isinstance(texto, str):
        return {"ok": False, "erro": "Texto é obrigatório."}

    texto_limpo = texto.strip()

    if len(texto_limpo) == 0:
        return {"ok": False, "erro": "Texto é obrigatório."}

    if len(texto_limpo) < MINIMO_CARACTERES:
        return {
            "ok": False,
            "erro": f"Texto muito curto (mínimo {MINIMO_CARACTERES} caracteres).",
        }

    if len(texto_limpo) > MAXIMO_CARACTERES:
        return {
            "ok": False,
            "erro": f"Texto muito longo (máximo {MAXIMO_CARACTERES} caracteres).",
        }

    return {"ok": True}


class TestLimiteCaracteres(unittest.TestCase):

    def test_texto_vazio_e_rejeitado(self):
        resultado = validar_texto("")
        self.assertFalse(resultado["ok"])
        self.assertEqual(resultado["erro"], "Texto é obrigatório.")

    def test_texto_so_com_espacos_e_rejeitado(self):
        resultado = validar_texto("     ")
        self.assertFalse(resultado["ok"])
        self.assertEqual(resultado["erro"], "Texto é obrigatório.")

    def test_texto_abaixo_do_minimo_e_rejeitado(self):
        resultado = validar_texto("oi")  # só 2 caracteres, mínimo é 10
        self.assertFalse(resultado["ok"])
        self.assertIn("mínimo", resultado["erro"])

    def test_texto_exatamente_no_minimo_e_aceito(self):
        texto_com_10_caracteres = "a" * MINIMO_CARACTERES
        resultado = validar_texto(texto_com_10_caracteres)
        self.assertTrue(resultado["ok"])

    def test_texto_normal_dentro_da_faixa_e_aceito(self):
        resultado = validar_texto(
            "Este é um feedback de tamanho razoável para o sistema."
        )
        self.assertTrue(resultado["ok"])

    def test_texto_acima_do_maximo_e_rejeitado(self):
        texto_gigante = "a" * (MAXIMO_CARACTERES + 1)  # 1 a mais que o permitido
        resultado = validar_texto(texto_gigante)
        self.assertFalse(resultado["ok"])
        self.assertIn("máximo", resultado["erro"])

    def test_texto_exatamente_no_maximo_e_aceito(self):
        texto_no_limite = "a" * MAXIMO_CARACTERES
        resultado = validar_texto(texto_no_limite)
        self.assertTrue(resultado["ok"])

    def test_espacos_nas_pontas_nao_contam_para_o_limite(self):
        # um texto com espaços sobrando não deve ser penalizado nem
        # beneficiado por causa desses espaços extras
        texto = "   " + ("a" * MINIMO_CARACTERES) + "   "
        resultado = validar_texto(texto)
        self.assertTrue(resultado["ok"])


if __name__ == "__main__":
    unittest.main()
