import express from 'express'//pra conecta no servidor "api"
import fs from 'fs'//negocio de armazenar arquivos 
import path, { dirname } from 'path' //alguma coisa sobre se necessitar de um caminho absoluto pra url do banco
import { fileURLToPath } from 'url'//o import usando o "path" comando de cima
 
const __filename = fileURLToPath(import.meta.url)// algo sobre importar do "meta url" o nome de algum arquivo
const __dirname = path.dirname(__filename)// recebe o import de cima

const app = express();//acho q define q o app ta no servidor
const PORT = 3000;

const dadosfilepath = path.join(dirname, 'dados.json'); //ele conecta os caminhos do database com os dados pra conseguir gerenciar

app.use(express.json());//pra conseguir ver os dados na tela?
app.use(express.static('public'));//ele consegue manipular os dados publicos dentro de qualquer area do projeto
app.listen(PORT, ()=>{
    console.log('servidor rodando em http://localhost:${PORT}')
})