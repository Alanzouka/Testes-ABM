import unittest
 
 
def permitir_apenas(token, roles_permitidas):
    """
    Reimplementação em Python do middleware permitirApenas().
    `token` aqui é um dicionário simulando o payload já decodificado do JWT,
    ou None simulando a ausência de token (equivalente a não mandar o
    cabeçalho "Authorization" na requisição).
    """
    if token is None:
        return {"status": 401, "erro": "token nao fornecido."}
 
    if token.get("role") not in roles_permitidas:
        return {"status": 403, "erro": "acesso negado para essa role."}
 
    return {"status": 200, "acesso": "liberado"}
 
 
class TestPermitirApenas(unittest.TestCase):
 
    def setUp(self):
        self.token_pedagogia = {"nome": "Secretaria", "role": "pedagogia"}
        self.token_responsavel = {"nome": "Bianca", "role": "responsavel"}
 
    def test_sem_token_e_bloqueado(self):
        resultado = permitir_apenas(None, ["pedagogia"])
        self.assertEqual(resultado["status"], 401)
        self.assertEqual(resultado["erro"], "token nao fornecido.")
 
    def test_role_fora_da_lista_e_bloqueada(self):
       
        resultado = permitir_apenas(self.token_responsavel, ["pedagogia"])
        self.assertEqual(resultado["status"], 403)
        self.assertEqual(resultado["erro"], "acesso negado para essa role.")
 
    def test_role_pedagogia_acessa_rota_exclusiva_dela(self):
        resultado = permitir_apenas(self.token_pedagogia, ["pedagogia"])
        self.assertEqual(resultado["status"], 200)
        self.assertEqual(resultado["acesso"], "liberado")
 
    def test_rota_com_duas_roles_permitidas_libera_responsavel(self):
      
        resultado = permitir_apenas(self.token_responsavel, ["responsavel", "pedagogia"])
        self.assertEqual(resultado["status"], 200)
 
    def test_rota_com_duas_roles_permitidas_libera_pedagogia_tambem(self):
        resultado = permitir_apenas(self.token_pedagogia, ["responsavel", "pedagogia"])
        self.assertEqual(resultado["status"], 200)
 
    def test_role_inexistente_ou_vazia_e_bloqueada(self):
      
        token_sem_role = {"nome": "Fantasma"}
        resultado = permitir_apenas(token_sem_role, ["pedagogia"])
        self.assertEqual(resultado["status"], 403)
 
 
if __name__ == "__main__":
    unittest.main()