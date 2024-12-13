
# Gerenciamento de Itens - API

API RESTful para gerenciamento de itens e autenticação de usuários, desenvolvida com Node.js e SQLite. Oferece suporte a autenticação via JWT e documentação interativa utilizando Swagger.

## Funcionalidades

- Autenticação de usuários com JWT.
- CRUD de itens pertencentes a usuários autenticados.
- Documentação interativa com Swagger.

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **SQLite**
- **JWT para autenticação**
- **Swagger para documentação**

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Prof-Karan-Luciano/gerenciamento-itens-api.git
   ```
2. Acesse o diretório do projeto:
   ```bash
   cd gerenciamento-itens-api
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure o arquivo `.env`:
   ```env
   SECRET_KEY=sua_chave_secreta
   ```
5. Inicie o servidor:
   ```bash
   npm start
   ```

## Endpoints Principais

### Usuários
- **Registrar um novo usuário:** `POST /users/register`
- **Autenticar usuário:** `POST /users/login`

### Itens
- **Listar itens do usuário autenticado:** `GET /items`
- **Obter um item pelo ID:** `GET /items/:id`
- **Criar um novo item:** `POST /items`
- **Atualizar um item existente:** `PUT /items/:id`
- **Deletar um item:** `DELETE /items/:id`

## Documentação Interativa

Após iniciar o servidor, a documentação Swagger estará disponível em:
```
http://localhost:3000/api-docs
```

## Estrutura do Projeto

```
/routes
  ├── items.js    # Rotas relacionadas aos itens
  ├── users.js    # Rotas relacionadas aos usuários
/models
  ├── db.js       # Configuração e conexão do banco de dados
/middlewares
  ├── auth.js     # Middleware de autenticação JWT
```

## Como Contribuir

1. Faça um fork do projeto.
2. Crie um branch para sua feature:
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Commit suas mudanças:
   ```bash
   git commit -m "Descrição clara da feature"
   ```
4. Envie para o seu fork:
   ```bash
   git push origin feature/nova-feature
   ```
5. Abra um Pull Request.

---

**Desenvolvido por [Prof. Karan Luciano](https://github.com/Prof-Karan-Luciano).**
