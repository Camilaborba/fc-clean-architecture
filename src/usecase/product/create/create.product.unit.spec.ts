import CreateProductUseCase from "./create.product.usecase";
const input = {
    name: "Shampoo",
    price: 100,
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Teste unitario de produto", () => {
    it("Valida a criação de um produto", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const output = await productCreateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
        expect(productRepository.create).toHaveBeenCalledTimes(1);
    });

    it("Não deve criar um produto sem nome", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        await expect(
            productCreateUseCase.execute({ ...input, name: "" })
        ).rejects.toThrow("Name is required");
        expect(productRepository.create).not.toHaveBeenCalled();
    });

    it("Não deve criar um produto com preço negativo", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        await expect(
            productCreateUseCase.execute({ ...input, price: -1 })
        ).rejects.toThrow("Price must be greater than zero");
        expect(productRepository.create).not.toHaveBeenCalled();
    });
});
