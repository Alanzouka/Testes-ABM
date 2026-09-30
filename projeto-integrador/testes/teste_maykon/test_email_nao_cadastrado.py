import unittest
 
 
def login(usuarios, email, senha):
    """Reimplementação em Python da função login() do projeto."""
    usuario = next((u for u in usuarios if u["email"] == email), None)
 
    if usuario is None:
        return {"erro": "usuario ou senha incorretos."}
 
    if usuario["senha"] != senha:
        return {"erro": "usuario ou senha incorretos."}
 
    if not usuario["validado"]:
        return {"erro": "conta ainda nao validada."}
 
    return {"mensagem": "login realizado com sucesso!", "role": usuario["role"]}
 
 
class TestLoginEmailNaoCadastrado(unittest.TestCase):
 
    def setUp(self):
        self.usuarios = [
            {
                "nome": "Bianca",
                "email": "bianca@gmail.com",
                "senha": "123456",
                "role": "responsavel",
                "validado": True
            }
        ]
 
    def test_login_com_banco_vazio_e_bloqueado(self):
        usuarios_vazio = []
        resultado = login(usuarios_vazio, "qualquer@gmail.com", "123456")
        self.assertEqual(resultado, {"erro": "usuario ou senha incorretos."})
 
    def test_email_nao_cadastrado_e_bloqueado(self):
        resultado = login(self.usuarios, "naoexiste@gmail.com", "123456")
        self.assertEqual(resultado, {"erro": "usuario ou senha incorretos."})
 
    def test_email_parecido_mas_diferente_nao_e_confundido(self):
      
        resultado = login(self.usuarios, "bianca@gmail.co", "123456")
        self.assertEqual(resultado, {"erro": "usuario ou senha incorretos."})
 
    def test_email_com_maiuscula_diferente_nao_e_encontrado(self):
       
        resultado = login(self.usuarios, "BIANCA@GMAIL.COM", "123456")
        self.assertEqual(resultado, {"erro": "usuario ou senha incorretos."})
 
    def test_mensagem_de_erro_e_igual_para_email_inexistente_e_senha_errada(self):
        resultado_email_errado = login(self.usuarios, "naoexiste@gmail.com", "123456")
        resultado_senha_errada = login(self.usuarios, "bianca@gmail.com", "senhaerrada")
 
      
        self.assertEqual(resultado_email_errado, resultado_senha_errada)
 
    def test_email_cadastrado_passa_dessa_etapa(self):
        resultado = login(self.usuarios, "bianca@gmail.com", "123456")
     
        self.assertNotEqual(resultado.get("erro"), "usuario ou senha incorretos.")
        self.assertEqual(resultado["mensagem"], "login realizado com sucesso!")
 
 
if __name__ == "__main__":
    unittest.main()