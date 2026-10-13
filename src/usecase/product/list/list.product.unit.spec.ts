import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product("1", "Shampoo", 100);
const product2 = new Product("2", "Sabonete", 200);

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
  };
};

describe("Teste unitario de listagem de produtos", () => {
  it("Valida a listagem de produtos", async () => {
    const repository = MockRepository();
    const useCase = new ListProductUseCase(repository);

    const output = await useCase.execute({});

    expect(output).toEqual({
      products: [
        { id: "1", name: "Shampoo", price: 100 },
        { id: "2", name: "Sabonete", price: 200 },
      ],
    });
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it("Retorna uma lista vazia quando não há produtos cadastrados", async () => {
    const repository = MockRepository();
    repository.findAll.mockResolvedValue([]);
    const useCase = new ListProductUseCase(repository);

    const output = await useCase.execute({});

    expect(output).toEqual({ products: [] });
  });
});
