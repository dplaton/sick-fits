import React from "react";
import StripeCheckout from 'react-stripe-checkout';
import User from "./User";
import calcTotalPrice from '../lib/calcTotalPrice';

function totalItems(cart) {
    return cart.reduce((acc, cartItem) => (acc+cartItem.quantity),0);
}

class TakeMyMoney extends React.Component {

    onToken = (res) => {
        console.log(res);
    }

    render() {
        return (
            <User>{({ data: { me } }) => (
                <StripeCheckout 
                    amount={calcTotalPrice(me.cart)}
                    name='Sick Fits'
                    description={`Order of ${totalItems(me.cart)} items`}
                    image={me.cart[0].item && me.cart[0].item.image}
                    currency='USD'
                    email={me.email}
                    stripeKey="pk_test_8GKQkRDEKKRdgd1JJXh7782x"
                    token={res => this.onToken(res)}
                    >
                    {this.props.children}
                </StripeCheckout>)}
            </User>
        );
    }
}

export default TakeMyMoney;
