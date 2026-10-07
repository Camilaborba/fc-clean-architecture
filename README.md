# Clean Architecture: Use Cases para a Entidade Product

Desafio do curso [Full Cycle](https://fullcycle.com.br), desenvolvido a partir do código base obrigatório disponibilizado pelo curso: [devfullcycle/fc-clean-architecture](https://github.com/devfullcycle/fc-clean-architecture).

## Objetivo

Seguindo o padrão apresentado nas aulas para a entidade `Customer`, replicar a arquitetura para a entidade `Product`: implementar os casos de uso das operações básicas (CRUD) e garantir a confiabilidade com testes de unidade e de integração.

## Requisitos

Use Cases da entidade `Product`, cada um isolado por DTOs de input e output:

| Use Case | Descrição                          |
| -------- | ---------------------------------- |
| Create   | Criação de um produto              |
| Find     | Busca de um produto por ID         |
| List     | Listagem de todos os produtos      |
| Update   | Atualização dos dados de um produto |

Para **cada** Use Case:

- **Teste de unidade**: valida a lógica do caso de uso isolada, com o repositório mockado.
- **Teste de integração**: valida o fluxo completo com o banco de dados (SQLite em memória, via Sequelize).

## Tecnologias

- TypeScript
- Clean Architecture (Use Cases e DTOs)
- Sequelize + SQLite
- Jest

## Estrutura

Cada caso de uso fica em sua própria pasta em `src/usecase/product/`:

```
src/usecase/product/<operacao>/
├── <operacao>.product.dto.ts               # DTOs de input e output
├── <operacao>.product.usecase.ts           # caso de uso
├── <operacao>.product.unit.spec.ts         # teste de unidade (mock)
└── <operacao>.product.integration.spec.ts  # teste de integração (banco)
```

## Como rodar os testes

Pré-requisito: Node.js e npm instalados.

Instale as dependências:

```bash
npm install
```

Rode todos os testes do projeto (checagem de tipos com `tsc` + Jest):

```bash
npm test
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
