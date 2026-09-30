import unittest
 
 
def cadastrar(usuarios, nome, email, senha, confirmarsenha):
    """
    Versão da função cadastrar() com validação de tipo. Antes de checar se
    os campos estão vazios ou se as senhas batem, ela confirma que todos os
    campos são realmente texto (string).
    """
    campos = {
        "nome": nome,
        "email": email,
        "senha": senha,
        "confirmarsenha": confirmarsenha,
    }
 
    for nome_campo, valor in campos.items():
        if not isinstance(valor, str):
            return f"o campo '{nome_campo}' deve ser um texto."
 
    if not nome or not email or not senha or not confirmarsenha:
        return "preencha todos os campos."
 
    if senha != confirmarsenha:
        return "as senhas nao coincidem."
 
    usuarios.append({"nome": nome.strip(), "email": email.strip(), "senha": senha})
    return "cadastro realizado com sucesso."
 
 
class TestTiposErrados(unittest.TestCase):
 
    def setUp(self):
        self.usuarios = []
 
    def test_nome_como_numero_inteiro_e_rejeitado(self):
        resultado = cadastrar(self.usuarios, 12345, "email@teste.com", "123", "123")
        self.assertEqual(resultado, "o campo 'nome' deve ser um texto.")
        self.assertEqual(len(self.usuarios), 0)
 
    def test_nome_como_numero_decimal_e_rejeitado(self):
        resultado = cadastrar(self.usuarios, 12.5, "email@teste.com", "123", "123")
        self.assertEqual(resultado, "o campo 'nome' deve ser um texto.")
 
    def test_email_como_numero_e_rejeitado(self):
        resultado = cadastrar(self.usuarios, "Bianca", 999999, "123", "123")
        self.assertEqual(resultado, "o campo 'email' deve ser um texto.")
 
    def test_senha_como_numero_e_rejeitada(self):
     
        resultado = cadastrar(self.usuarios, "Bianca", "bianca@gmail.com", 123456, "123456")
        self.assertEqual(resultado, "o campo 'senha' deve ser um texto.")
 
    def test_confirmarsenha_como_numero_e_rejeitada(self):
        resultado = cadastrar(self.usuarios, "Bianca", "bianca@gmail.com", "123456", 123456)
        self.assertEqual(resultado, "o campo 'confirmarsenha' deve ser um texto.")
 
    def test_campo_como_lista_e_rejeitado(self):
        resultado = cadastrar(self.usuarios, ["Bianca"], "bianca@gmail.com", "123", "123")
        self.assertEqual(resultado, "o campo 'nome' deve ser um texto.")
 
    def test_campo_como_booleano_e_rejeitado(self):
      
        resultado = cadastrar(self.usuarios, True, "bianca@gmail.com", "123", "123")
        self.assertEqual(resultado, "o campo 'nome' deve ser um texto.")
 
    def test_campo_como_none_e_rejeitado(self):
        resultado = cadastrar(self.usuarios, None, "bianca@gmail.com", "123", "123")
        self.assertEqual(resultado, "o campo 'nome' deve ser um texto.")
 
    def test_todos_os_campos_como_texto_sao_aceitos_normalmente(self):
        resultado = cadastrar(self.usuarios, "Bianca", "bianca@gmail.com", "123", "123")
        self.assertEqual(resultado, "cadastro realizado com sucesso.")
        self.assertEqual(len(self.usuarios), 1)
 
    def test_tipo_errado_nao_adiciona_nada_na_lista(self):
        cadastrar(self.usuarios, 12345, "email@teste.com", "123", "123")
        cadastrar(self.usuarios, "Bianca", 999999, "123", "123")
      
        self.assertEqual(len(self.usuarios), 0)
 
 
if __name__ == "__main__":
    unittest.main()