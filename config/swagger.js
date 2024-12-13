// config/swagger.js

const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Simples',
            version: '1.0.0',
            description: 'Uma API simples com operações CRUD básicas e autenticação de usuários',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{bearerAuth: []}],
    },
    apis: ['./routes/*.js'], // Inclui todas as rotas na pasta routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
