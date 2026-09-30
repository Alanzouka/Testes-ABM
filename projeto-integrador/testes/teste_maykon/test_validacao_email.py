import unittest
 
 
def validar(usuarios, nome):
    """Reimplementação em Python da função validar() do projeto."""
    usuario = next((u for u in usuarios if u["nome"] == nome), None)
 
    if usuario is None:
        return "usuario nao encontrado."
 
    usuario["validado"] = True
    return "conta validada."
 
 
class TestValidacao(unittest.TestCase):
 
    def setUp(self):
        self.usuarios = [
            {"nome": "Bianca", "role": "responsavel", "validado": False},
            {"nome": "Allan", "role": "responsavel", "validado": False},
            {"nome": "Secretaria", "role": "pedagogia", "validado": False},
        ]
 
    def test_nome_inexistente_devolve_erro(self):
        resultado = validar(self.usuarios, "NomeQueNaoExiste")
        self.assertEqual(resultado, "usuario nao encontrado.")
 
    def test_nome_inexistente_nao_altera_ninguem(self):
        validar(self.usuarios, "NomeQueNaoExiste")
        
        self.assertTrue(all(u["validado"] is False for u in self.usuarios))
 
    def test_nome_valido_marca_validado_true(self):
        resultado = validar(self.usuarios, "Bianca")
        self.assertEqual(resultado, "conta validada.")
 
        bianca = next(u for u in self.usuarios if u["nome"] == "Bianca")
        self.assertTrue(bianca["validado"])
 
    def test_validar_um_nao_afeta_os_outros(self):
        validar(self.usuarios, "Bianca")
 
        allan = next(u for u in self.usuarios if u["nome"] == "Allan")
        secretaria = next(u for u in self.usuarios if u["nome"] == "Secretaria")
 
        self.assertFalse(allan["validado"])       
        self.assertFalse(secretaria["validado"])  
 
    def test_validar_duas_vezes_nao_da_erro(self):
        primeiro_resultado = validar(self.usuarios, "Bianca")
        segundo_resultado = validar(self.usuarios, "Bianca")
 
        self.assertEqual(primeiro_resultado, "conta validada.")
        self.assertEqual(segundo_resultado, "conta validada.")  
 
 
if __name__ == "__main__":
    unittest.main()