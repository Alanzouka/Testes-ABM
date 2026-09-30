import unittest


def cadastrar(usuarios, nome, email, senha, confirmarsenha):
    """
    Versão corrigida da função cadastrar(), que usa nome.strip() antes de
    checar se o campo está vazio — assim, um nome só de espaços é tratado
    como vazio de verdade.
    """
    if not isinstance(nome, str):
        return "o campo 'nome' deve ser um texto."

    nome_limpo = nome.strip()

    if not nome_limpo or not email or not senha or not confirmarsenha:
        return "preencha todos os campos."

    if senha != confirmarsenha:
        return "as senhas nao coincidem."

    existe = any(u["nome"] == nome_limpo or u["email"] == email for u in usuarios)
    if existe:
        return "usuarios ja cadastrado."

    usuarios.append({"nome": nome_limpo, "email": email, "senha": senha})
    return "cadastro realizado com sucesso."


class TestNomeVazioOuEspacos(unittest.TestCase):

    def setUp(self):
        self.usuarios = []

    def test_nome_vazio_e_rejeitado(self):
        resultado = cadastrar(self.usuarios, "", "email@teste.com", "123", "123")
        self.assertEqual(resultado, "preencha todos os campos.")
        self.assertEqual(len(self.usuarios), 0)

    def test_nome_so_com_espacos_e_rejeitado(self):
        resultado = cadastrar(self.usuarios, "   ", "email@teste.com", "123", "123")
        self.assertEqual(resultado, "preencha todos os campos.")
        self.assertEqual(len(self.usuarios), 0)

    def test_nome_com_um_unico_espaco_e_rejeitado(self):
        resultado = cadastrar(self.usuarios, " ", "email@teste.com", "123", "123")
        self.assertEqual(resultado, "preencha todos os campos.")

    def test_nome_com_tab_e_quebra_de_linha_e_rejeitado(self):
        # \t é uma tabulação, \n é uma quebra de linha — ambos "parecem"
        # vazios visualmente, mas tecnicamente não são strings vazias
        resultado = cadastrar(
            self.usuarios, "\t\n  \t", "email@teste.com", "123", "123"
        )
        self.assertEqual(resultado, "preencha todos os campos.")

    def test_nome_com_espacos_nas_pontas_mas_com_conteudo_e_aceito(self):
        resultado = cadastrar(
            self.usuarios, "  Bianca  ", "bianca@gmail.com", "123", "123"
        )
        self.assertEqual(resultado, "cadastro realizado com sucesso.")

        # o nome salvo deve estar limpo, sem os espaços extras
        self.assertEqual(self.usuarios[0]["nome"], "Bianca")

    def test_nome_normal_e_aceito(self):
        resultado = cadastrar(self.usuarios, "Bianca", "bianca@gmail.com", "123", "123")
        self.assertEqual(resultado, "cadastro realizado com sucesso.")
        self.assertEqual(len(self.usuarios), 1)

    def test_nome_como_tipo_errado_e_rejeitado_sem_quebrar(self):
        # bônus: garante que passar um tipo errado (não-string) também não
        # quebra essa função com um erro feio, e sim com mensagem clara
        resultado = cadastrar(self.usuarios, 12345, "email@teste.com", "123", "123")
        self.assertEqual(resultado, "o campo 'nome' deve ser um texto.")


if __name__ == "__main__":
    unittest.main()
