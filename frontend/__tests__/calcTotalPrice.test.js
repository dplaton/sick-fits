import calcTotalPrice from "../utils/calcTotalPrice";

describe("The caclTotalPrice utility", () => {
    it("should return the correct total for a properly defined cart", () => {
        const cart = [
            {
                item: {
                    price: 2000
                },
                quantity: 1
            },
            {
                item: { price: 2000 },
                quantity: 2
            }
        ];

        expect(calcTotalPrice(cart)).toEqual(6000);
    });
});
