import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import submitHandler from './api/submit.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // sirve index.html

// Ruta del API (simula la Serverless Function de Vercel)
app.post('/api/submit', (req, res) => {
  submitHandler(req, res);
});

app.listen(PORT, () => {
  console.log(`\nServidor corriendo en http://localhost:${PORT}`);
});