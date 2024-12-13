// app.js

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors'); /*CORS (Cross-Origin Resource Sharing)*/
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
app.use('/items', itemsRouter);
app.use('/users', usersRouter);

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger disponível em http://localhost:${port}/api-docs`);
});
