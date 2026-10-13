import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";


// montar o nosso mock
const product = new Product("1", "Shampoo", 20.0);
const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};


describe("Valide os fluxos do caso de uso", () => {
  it("Produto cadastrado", async () => {
    const productRepository = MockRepository();
    const usecase = new FindProductUseCase(productRepository);

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
    expect(productRepository.find).toHaveBeenCalledWith("1");
  });

  it("Produto não cadastrado", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockRejectedValue(new Error("Product not found"));
    const usecase = new FindProductUseCase(productRepository);

    const input = {
      id: "123",
    };

    await expect(usecase.execute(input)).rejects.toThrow("Product not found");
    expect(productRepository.find).toHaveBeenCalledWith("123");
  });
});
