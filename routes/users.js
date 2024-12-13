// routes/users.js

const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY; // Obtém a chave secreta das variáveis de ambiente

if (!SECRET_KEY) {
  console.error('Falta a variável de ambiente SECRET_KEY');
  process.exit(1); // Encerra a aplicação se a chave secreta não estiver definida
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gerenciar usuários
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       description: Objeto do usuário a ser criado
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: usuario_exemplo
 *               password:
 *                 type: string
 *                 example: senha_segura
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Entrada inválida
 *       409:
 *         description: Nome de usuário já existe
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Campos "username" e "password" são obrigatórios' });
    return;
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.run(sql, [username, hash], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(409).json({ error: 'Nome de usuário já existe' });
        } else {
          console.error('Erro ao registrar usuário:', err.message);
          res.status(500).json({ error: err.message });
        }
      } else {
        res.status(201).json({ message: 'Usuário criado com sucesso' });
      }
    });
  } catch (err) {
    console.error('Erro ao hashear a senha:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Users]
 *     requestBody:
 *       description: Credenciais do usuário
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: usuario_exemplo
 *               password:
 *                 type: string
 *                 example: senha_segura
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Entrada inválida
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Campos "username" e "password" são obrigatórios' });
    return;
  }
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], async (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err.message);
      res.status(500).json({ error: err.message });
    } else if (!user) {
      res.status(401).json({ error: 'Credenciais inválidas' });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
      }
    }
  });
});

module.exports = router;
