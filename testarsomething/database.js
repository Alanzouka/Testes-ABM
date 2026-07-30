import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
const PORT = 3000;

const dadosfilepath = path.join(__dirname, 'dados.json'); 

app.use(express.json());
app.use(express.static('public'));

