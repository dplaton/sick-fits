import React from "react";
import gql from "graphql-tag";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";

import User, { CURRENT_USER_QUERY } from "./User";
import calcTotalPrice from "../utils/calcTotalPrice";

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($token: String!) {
        createOrder(token: $token) {
            id
            charge
            total
            items {
                id
                title
            }
        }
    }
`;

function totalItems(cart) {
    return cart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
}

class TakeMyMoney extends React.Component {
    onToken = async (res, createOrder) => {
        NProgress.start();
        const order = await createOrder({
            variables: {
                token: res.id
            }
        }).catch(err => {
            alert(err.message);
        });
        Router.push({
            pathname: "/order",
            query: { orderId: order.data.createOrder.id }
        });
    };

    render() {
        return (
            <User>
                {({ data: { me }, loading}) => {
                    if (loading) return null;
                    return (
                        <Mutation
                            mutation={CREATE_ORDER_MUTATION}
                            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
                        >
                            {createOrder => (
                                <StripeCheckout
                                    amount={calcTotalPrice(me.cart)}
                                    name="Sick Fits"
                                    description={`Order of ${totalItems(
                                        me.cart
                                    )} items`}
                                    image={
                                        me.cart[0] &&
                                        me.cart[0].item &&
                                        me.cart[0].item.image
                                    }
                                    currency="USD"
                                    email={me.email}
                                    stripeKey="pk_test_8GKQkRDEKKRdgd1JJXh7782x"
                                    token={res =>
                                        this.onToken(res, createOrder)
                                    }
                                >
                                    {this.props.children}
                                </StripeCheckout>
                            )}
                        </Mutation>
                    );
                }}
            </User>
        );
    }
}
export { CREATE_ORDER_MUTATION };
export default TakeMyMoney;
