// models/db.js

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./banco_de_dados.sqlite', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');

        // Habilita chaves estrangeiras
        db.run('PRAGMA foreign_keys = ON');

        // Cria a tabela 'items' se não existir, com a coluna 'user_id'
        db.run(
            `CREATE TABLE IF NOT EXISTS items
             (
                 id      INTEGER PRIMARY KEY AUTOINCREMENT,
                 name    TEXT    NOT NULL,
                 user_id INTEGER NOT NULL,
                 FOREIGN KEY (user_id) REFERENCES users (id)
             )`,
            (err) => {
                if (err) {
                    console.error('Erro ao criar tabela items:', err.message);
                } else {
                    console.log('Tabela "items" pronta para uso.');
                }
            }
        );

        // Cria a tabela 'users' se não existir
        db.run(
            `CREATE TABLE IF NOT EXISTS users
             (
                 id       INTEGER PRIMARY KEY AUTOINCREMENT,
                 username TEXT NOT NULL UNIQUE,
                 password TEXT NOT NULL
             )`,
            (err) => {
                if (err) {
                    console.error('Erro ao criar tabela users:', err.message);
                } else {
                    console.log('Tabela "users" pronta para uso.');
                }
            }
        );
    }
});

module.exports = db;

