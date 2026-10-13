import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

const input = {
  id: "1",
  name: "Shampoo Updated",
  price: 150,
};

const MockRepository = () => {
  const product = new Product("1", "Shampoo", 100);

  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
  };
};

describe("Teste unitario de atualização de produto", () => {
  it("Valida a atualização de um produto", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
    expect(productRepository.find).toHaveBeenCalledWith("1");
    expect(productRepository.update).toHaveBeenCalledTimes(1);
  });

  it("Não deve atualizar um produto sem nome", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    await expect(
      productUpdateUseCase.execute({ ...input, name: "" })
    ).rejects.toThrow("Name is required");
    expect(productRepository.update).not.toHaveBeenCalled();
  });

  it("Não deve atualizar um produto com preço negativo", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    await expect(
      productUpdateUseCase.execute({ ...input, price: -1 })
    ).rejects.toThrow("Price must be greater than zero");
    expect(productRepository.update).not.toHaveBeenCalled();
  });
});
