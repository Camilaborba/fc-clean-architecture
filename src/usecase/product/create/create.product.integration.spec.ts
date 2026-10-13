import { Sequelize } from "sequelize-typescript";
import CreateProductUseCase from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

describe("Teste de integração de criação de produto", () => {
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

  it("Valida a criação de um produto", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: "Shampoo",
      price: 20.0,
    };

    const output = await usecase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: "Shampoo",
      price: 20.0,
    });

    const productModel = await ProductModel.findOne({
      where: { id: output.id },
    });

    expect(productModel.toJSON()).toStrictEqual({
      id: output.id,
      name: "Shampoo",
      price: 20.0,
    });
  });

  it("Não deve salvar um produto sem nome", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: "",
      price: 20.0,
    };

    await expect(usecase.execute(input)).rejects.toThrow("Name is required");
    expect(await ProductModel.count()).toBe(0);
  });

  it("Não deve salvar um produto com preço negativo", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: "Shampoo",
      price: -1,
    };

    await expect(usecase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
    expect(await ProductModel.count()).toBe(0);
  });
});
