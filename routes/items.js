// routes/items.js

const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticateToken = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: API para gerenciar itens
 */

// Aplica o middleware de autenticação a todas as rotas abaixo
router.use(authenticateToken);

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retorna uma lista de itens do usuário autenticado
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de itens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', (req, res) => {
    const sql = 'SELECT id, name FROM items WHERE user_id = ?';
    const userId = req.user.id;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Erro ao consultar itens:', err.message);
            res.status(500).json({error: err.message});
        } else {
            res.json(rows);
        }
    });
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Retorna um item pelo ID, se pertence ao usuário autenticado
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do item
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Um objeto item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Item não encontrado ou não pertence ao usuário
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', (req, res) => {
    const sql = 'SELECT id, name FROM items WHERE id = ? AND user_id = ?';
    const id = req.params.id;
    const userId = req.user.id;
    db.get(sql, [id, userId], (err, row) => {
        if (err) {
            console.error('Erro ao consultar item:', err.message);
            res.status(500).json({error: err.message});
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({message: 'Item não encontrado ou não pertence ao usuário'});
        }
    });
});

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Cria um novo item para o usuário autenticado
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Objeto do item a ser criado
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Item Exemplo"
 *     responses:
 *       201:
 *         description: Item criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       400:
 *         description: Entrada inválida
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', (req, res) => {
    const name = req.body.name;
    const userId = req.user.id;
    if (!name) {
        res.status(400).json({error: 'O campo "name" é obrigatório'});
        return;
    }
    const sql = 'INSERT INTO items (name, user_id) VALUES (?, ?)';
    db.run(sql, [name, userId], function (err) {
        if (err) {
            console.error('Erro ao inserir item:', err.message);
            res.status(500).json({error: err.message});
        } else {
            res.status(201).json({id: this.lastID, name});
        }
    });
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Atualiza um item existente do usuário autenticado
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do item a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Objeto do item atualizado
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nome Atualizado"
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       400:
 *         description: Entrada inválida
 *       404:
 *         description: Item não encontrado ou não pertence ao usuário
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const userId = req.user.id;
    if (!name) {
        res.status(400).json({error: 'O campo "name" é obrigatório'});
        return;
    }
    const sql = 'UPDATE items SET name = ? WHERE id = ? AND user_id = ?';
    db.run(sql, [name, id, userId], function (err) {
        if (err) {
            console.error('Erro ao atualizar item:', err.message);
            res.status(500).json({error: err.message});
        } else if (this.changes === 0) {
            res.status(404).json({message: 'Item não encontrado ou não pertence ao usuário'});
        } else {
            res.json({id: Number(id), name});
        }
    });
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Remove um item do usuário autenticado
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do item a ser removido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removido com sucesso
 *       404:
 *         description: Item não encontrado ou não pertence ao usuário
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    const sql = 'DELETE FROM items WHERE id = ? AND user_id = ?';
    db.run(sql, [id, userId], function (err) {
        if (err) {
            console.error('Erro ao deletar item:', err.message);
            res.status(500).json({error: err.message});
        } else if (this.changes === 0) {
            res.status(404).json({message: 'Item não encontrado ou não pertence ao usuário'});
        } else {
            res.json({message: 'Item removido com sucesso'});
        }
    });
});

module.exports = router;
