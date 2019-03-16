import formatMoney from '../utils/formatMoney';

describe('The formatMoney utility', () => {
    

    it('should return the properly formatted amount', () => {
        const VALUE_IN_CENTS=1234;    
        const formattedMoneyValue=formatMoney(VALUE_IN_CENTS);

        expect(formattedMoneyValue).toEqual('$12.34');
    });

    it('should leave out the decimals for fixed amount', () => {
        const VALUE_IN_CENTS=1200;
        const formattedMoneyValue = formatMoney(VALUE_IN_CENTS);

        expect(formattedMoneyValue).toEqual('$12');
    });

    it('should work with a fraction of the dollar', () => {
        const VALUE_IN_CENTS=12;
        const formattedMoneyValue = formatMoney(VALUE_IN_CENTS);

        expect(formattedMoneyValue).toEqual('$0.12'); 
    })
})