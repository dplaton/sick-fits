import React from 'react';
import CartStyles from './styles/CartStyles';
import SickButton from './styles/SickButton';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';

const Cart = () => {
    return(
        <CartStyles open>
            <header>
                <CloseButton title="close">&times;</CloseButton>
                <Supreme>Your shopping cart</Supreme>
                <p>You have __ items in cart</p>
            </header>
            <footer>
                <p>$10.10</p>
                <SickButton>Checkout</SickButton>
            </footer>
        </CartStyles>
    )
}

export default Cart;