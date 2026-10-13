import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

describe("Teste de integração de atualização de produto", () => {
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

  it("Valida a atualização de um produto", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    await productRepository.create(new Product("1", "Shampoo", 100));

    const input = {
      id: "1",
      name: "Shampoo Updated",
      price: 150,
    };

    const output = await usecase.execute(input);

    expect(output).toEqual(input);

    const productModel = await ProductModel.findOne({ where: { id: "1" } });

    expect(productModel.toJSON()).toStrictEqual({
      id: "1",
      name: "Shampoo Updated",
      price: 150,
    });
  });

  it("Não deve atualizar um produto sem nome", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    await productRepository.create(new Product("1", "Shampoo", 100));

    const input = {
      id: "1",
      name: "",
      price: 150,
    };

    await expect(usecase.execute(input)).rejects.toThrow("Name is required");

    const productModel = await ProductModel.findOne({ where: { id: "1" } });

    expect(productModel.toJSON()).toStrictEqual({
      id: "1",
      name: "Shampoo",
      price: 100,
    });
  });

  it("Não deve atualizar um produto com preço negativo", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    await productRepository.create(new Product("1", "Shampoo", 100));

    const input = {
      id: "1",
      name: "Shampoo Updated",
      price: -1,
    };

    await expect(usecase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );

    const productModel = await ProductModel.findOne({ where: { id: "1" } });

    expect(productModel.toJSON()).toStrictEqual({
      id: "1",
      name: "Shampoo",
      price: 100,
    });
  });

  it("Não deve atualizar um produto não cadastrado", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "Shampoo Updated",
      price: 150,
    };

    await expect(usecase.execute(input)).rejects.toThrow("Product not found");
  });
});
