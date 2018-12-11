import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import formatMoney from '../lib/formatMoney';

import User from "./User";
import CartStyles from "./styles/CartStyles";
import SickButton from "./styles/SickButton";
import CloseButton from "./styles/CloseButton";
import Supreme from "./styles/Supreme";
import CartItem from "./CartItem";

export const LOCAL_STATE_QUERY = gql`
    query {
        cartOpen @client
    }
`;

export const TOGGLE_CART_MUTATION = gql`
    mutation {
        toggleCart @client
    }
`;
const Cart = () => {
    return (
        <User>
            {({ data: { me } }) => {
                if (!me) return null;
                return (
                    <Mutation mutation={TOGGLE_CART_MUTATION}>
                        {toggleCart => (
                            <Query query={LOCAL_STATE_QUERY}>
                                {({ data }) => (
                                    <CartStyles open={data.cartOpen}>
                                        <header>
                                            <CloseButton
                                                title="close"
                                                onClick={toggleCart}
                                            >
                                                &times;
                                            </CloseButton>
                                            <Supreme>
                                               {me.name}'s cart
                                            </Supreme>
                                            <p>You have {me.cart.length} item{me.cart.length === 1 ? '':'s'} in cart</p>
                                        </header>
                                        <ul>
                                        {me.cart.map(item => {
                                            return (<CartItem key={item.id} cartItem={item}/>)
                                        })}
                                        </ul>
                                        <footer>
                                            <p>{formatMoney(me.cart.reduce((acc, cartItem) => (acc += cartItem.quantity * cartItem.item.price),0))}</p>
                                            <SickButton>Checkout</SickButton>
                                        </footer>
                                    </CartStyles>
                                )}
                            </Query>
                        )}
                    </Mutation>
                );
            }}
        </User>
    );
};

export default Cart;
