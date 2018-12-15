import React from "react";
import { Query, Mutation } from "react-apollo";
import {adopt} from "react-adopt";
import gql from "graphql-tag";
import formatMoney from "../lib/formatMoney";

import User from "./User";
import CartStyles from "./styles/CartStyles";
import SickButton from "./styles/SickButton";
import CloseButton from "./styles/CloseButton";
import Supreme from "./styles/Supreme";
import CartItem from "./CartItem";
import TakeMyMoney from "./TakeMyMoney";

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

/*
 * Down below we have a complete mess with render props and queries and mutations and whatnot.
 *  We use react-adopt (https://github.com/pedronauck/react-adopt) to compose these render prop components
 * This is basically an object which maps the render prop components. We use that weird way with arrow functions
 * because otherwise react complains that the components are missing the required children.
 */
const Composed = adopt({
    user: ({ render }) => <User>{render}</User>,
    toggleCart: ({ render }) => (
        <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
    ),
    localState: ({ render }) => (
        <Query query={LOCAL_STATE_QUERY}>{render}</Query>
    )
});

const Cart = () => {
    return (
        <Composed>
            {({user, toggleCart, localState}) => {
                const me  = user.data.me;
                if (!me) return null;
                const cartCount = me.cart.reduce(
                    (acc, cartItem) => (acc += cartItem.quantity),
                    0
                );
                return (
                    <CartStyles open={localState.data.cartOpen}>
                        <header>
                            <CloseButton title="close" onClick={toggleCart}>
                                &times;
                            </CloseButton>
                            <Supreme>{me.name}'s cart</Supreme>
                            <p>
                                You have {cartCount === 0 ? "no" : cartCount}{" "}
                                item{cartCount === 1 ? "" : "s"} in cart
                            </p>
                        </header>
                        <ul>
                            {me.cart.map(item => {
                                return (
                                    <CartItem key={item.id} cartItem={item} />
                                );
                            })}
                        </ul>
                        <footer>
                            <p>
                                {formatMoney(
                                    me.cart.reduce((acc, cartItem) => {
                                        if (!cartItem.item) return acc;
                                        return (
                                            acc +
                                            cartItem.quantity *
                                                cartItem.item.price
                                        );
                                    }, 0)
                                )}
                            </p>
                            <TakeMyMoney>
                                <SickButton>Checkout</SickButton>
                            </TakeMyMoney>
                        </footer>
                    </CartStyles>
                );
            }}
        </Composed>
    );
};

export default Cart;
