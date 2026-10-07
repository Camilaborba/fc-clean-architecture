import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";


describe("Busca por produto cadastrado", () => {
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

  it("Busca por produto cadastrado", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    const product = new Product("1", "Shampoo", 20.0);
    await productRepository.create(product);

    const input = {
      id: "1",
    };

    const output = {
      id: "1",
      name: "Shampoo",
      price: 20.0,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

  it("Busca por produto não cadastrado", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    const input = {
      id: "123",
    };

    await expect(usecase.execute(input)).rejects.toThrow("Product not found");
  });
});
