import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

describe("Teste de integração de listagem de produtos", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Valida a listagem de produtos", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    await productRepository.create(new Product("1", "Shampoo", 100));
    await productRepository.create(new Product("2", "Sabonete", 200));

    const output = await usecase.execute({});

    expect(output).toEqual({
      products: [
        { id: "1", name: "Shampoo", price: 100 },
        { id: "2", name: "Sabonete", price: 200 },
      ],
    });
  });

  it("Retorna uma lista vazia quando não há produtos cadastrados", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const output = await usecase.execute({});

    expect(output).toEqual({ products: [] });
  });
});
