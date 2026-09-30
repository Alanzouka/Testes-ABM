 
import unittest
 
 
def normalizar_email(email):
    """Deixa o email em minúsculas e sem espaços nas pontas, pra comparação."""
    return email.strip().lower()
 
 
def email_ja_cadastrado(usuarios, email):
    """Reimplementação da checagem de duplicidade, usando email normalizado."""
    email_normalizado = normalizar_email(email)
    return any(normalizar_email(u["email"]) == email_normalizado for u in usuarios)
 
 
def cadastrar(usuarios, nome, email, senha, confirmarsenha):
    """
    Versão da função cadastrar() com a checagem de email já usando
    normalização (maiúscula/minúscula e espaços não enganam mais a regra).
    """
    if not nome or not email or not senha or not confirmarsenha:
        return "preencha todos os campos."
 
    if senha != confirmarsenha:
        return "as senhas nao coincidem."
 
    if email_ja_cadastrado(usuarios, email):
        return "usuarios ja cadastrado."
 
    usuarios.append({
        "nome": nome,
        "email": email.strip(),
        "senha": senha,
        "validado": False
    })
 
    return "cadastro realizado com sucesso."
 
 
class TestEmailUnico(unittest.TestCase):
 
    def setUp(self):
        self.usuarios = []
 
    def test_primeiro_cadastro_com_email_e_aceito(self):
        resultado = cadastrar(self.usuarios, "Bianca", "bianca@gmail.com", "123", "123")
        self.assertEqual(resultado, "cadastro realizado com sucesso.")
        self.assertEqual(len(self.usuarios), 1)
 
    def test_segundo_cadastro_com_mesmo_email_e_bloqueado(self):
        cadastrar(self.usuarios, "Bianca", "bianca@gmail.com", "123", "123")
       
        resultado = cadastrar(self.usuarios, "Bianca da Silva", "bianca@gmail.com", "456", "456")
 
        self.assertEqual(resultado, "usuarios ja cadastrado.")
        self.assertEqual(len(self.usuarios), 1)
 
    def test_email_com_maiuscula_diferente_e_bloqueado(self):
        cadastrar(self.usuarios, "Bianca", "bianca@gmail.com", "123", "123")
       
        resultado = cadastrar(self.usuarios, "Outra Bianca", "Bianca@Gmail.com", "456", "456")
 
        self.assertEqual(resultado, "usuarios ja cadastrado.")
        self.assertEqual(len(self.usuarios), 1)
 
    def test_email_com_espacos_sobrando_e_bloqueado(self):
        cadastrar(self.usuarios, "Bianca", "bianca@gmail.com", "123", "123")
 
        resultado = cadastrar(self.usuarios, "Outra Bianca", "  bianca@gmail.com", "456", "456")
 
        self.assertEqual(resultado, "usuarios ja cadastrado.")
        self.assertEqual(len(self.usuarios), 1)
 
    def test_emails_diferentes_sao_ambos_aceitos(self):
        resultado1 = cadastrar(self.usuarios, "Bianca", "bianca@gmail.com", "123", "123")
        resultado2 = cadastrar(self.usuarios, "Allan", "allan@gmail.com", "456", "456")
 
        self.assertEqual(resultado1, "cadastro realizado com sucesso.")
        self.assertEqual(resultado2, "cadastro realizado com sucesso.")
        self.assertEqual(len(self.usuarios), 2)
 
    def test_email_ja_cadastrado_funcao_isolada(self):
        
        self.usuarios.append({"nome": "Bianca", "email": "bianca@gmail.com"})
 
        self.assertTrue(email_ja_cadastrado(self.usuarios, "bianca@gmail.com"))
        self.assertTrue(email_ja_cadastrado(self.usuarios, "BIANCA@GMAIL.COM"))
        self.assertFalse(email_ja_cadastrado(self.usuarios, "outraperson@gmail.com"))
 
 
if __name__ == "__main__":
    unittest.main()