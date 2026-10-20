# Clean Architecture: Entidade Product

Desafios do curso [Full Cycle](https://fullcycle.com.br), desenvolvidos a partir do código base obrigatório disponibilizado pelo curso: [devfullcycle/fc-clean-architecture](https://github.com/devfullcycle/fc-clean-architecture).

Este repositório reúne duas etapas:

1. **Use Cases**: casos de uso de `Product` (Create, Find, List e Update) com testes de unidade e de integração.
2. **API de Listagem de Produtos**: camada Web (Express) que expõe o caso de uso `ListProduct` via HTTP, com teste End-to-End.

## Tecnologias

- TypeScript
- Clean Architecture (Use Cases, DTOs e Presenters)
- Express
- Sequelize + SQLite (em memória)
- Jest + Supertest

## Pré-requisitos

Node.js e npm instalados. Instale as dependências:

```bash
npm install
```

---

## API de Listagem de Produtos

### Objetivo

Seguindo o padrão apresentado em aula para a entidade `Customer`, expor o caso de uso de listagem de produtos através de um endpoint HTTP.

### Endpoints

| Método | Rota       | Descrição                                   | Status |
| ------ | ---------- | ------------------------------------------- | ------ |
| POST   | `/product` | Cria um produto (`{ "name", "price" }`)     | 200    |
| GET    | `/product` | Lista todos os produtos (`ListProduct`)     | 200    |

O `GET /product` responde em **JSON** por padrão e em **XML** quando a requisição envia o header `Accept: application/xml`.

### Estrutura

```text
src/infrastructure/api/
├── express.ts                      # app Express + Sequelize (models registrados)
├── server.ts                       # sobe o servidor HTTP
├── routes/product.route.ts         # rotas POST e GET /product
├── presenters/product.presenter.ts # conversão da lista para XML
└── __tests__/product.e2e.spec.ts   # teste End-to-End
```

### Como rodar a API

```bash
npm run dev
```

O servidor sobe em `http://localhost:3000` (a porta pode ser alterada pela variável de ambiente `PORT`).

> O banco é SQLite em memória: os dados existem apenas enquanto o servidor está rodando.

Exemplos de uso:

```bash
# Cadastrar um produto
curl -X POST http://localhost:3000/product \
  -H "Content-Type: application/json" \
  -d '{"name": "Product 1", "price": 100}'

# Listar produtos (JSON)
curl http://localhost:3000/product

# Listar produtos (XML)
curl -H "Accept: application/xml" http://localhost:3000/product
```

Resposta JSON esperada:

```json
{
  "products": [
    { "id": "…", "name": "Product 1", "price": 100 }
  ]
}
```

### Como rodar os testes E2E

```bash
npx jest src/infrastructure/api/__tests__/product.e2e.spec.ts
```

O teste faz requisições HTTP reais ao app Express (via Supertest) e valida:

- status code `200`;
- lista vazia quando não há produtos;
- corpo JSON com os produtos cadastrados;
- corpo XML com os produtos cadastrados.

---

## Use Cases da entidade Product

Use Cases da entidade `Product`, cada um isolado por DTOs de input e output:

| Use Case | Descrição                           |
| -------- | ----------------------------------- |
| Create   | Criação de um produto               |
| Find     | Busca de um produto por ID          |
| List     | Listagem de todos os produtos       |
| Update   | Atualização dos dados de um produto |

Para **cada** Use Case:

- **Teste de unidade**: valida a lógica do caso de uso isolada, com o repositório mockado.
- **Teste de integração**: valida o fluxo completo com o banco de dados (SQLite em memória, via Sequelize).

Cada caso de uso fica em sua própria pasta em `src/usecase/product/`:

```text
src/usecase/product/<operacao>/
├── <operacao>.product.dto.ts               # DTOs de input e output
├── <operacao>.product.usecase.ts           # caso de uso
├── <operacao>.product.unit.spec.ts         # teste de unidade (mock)
└── <operacao>.product.integration.spec.ts  # teste de integração (banco)
```

Rode apenas os testes dos Use Cases de Product:

```bash
npx jest src/usecase/product
```

Rode apenas os testes de unidade ou apenas os de integração:

```bash
npx jest "usecase/product/.*unit"
npx jest "usecase/product/.*integration"
```

---

## Rodar todos os testes

Checagem de tipos com `tsc` + todos os testes do Jest (unidade, integração e E2E):

```bash
npm test
```
