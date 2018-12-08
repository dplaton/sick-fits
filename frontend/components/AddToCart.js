import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Error from './ErrorMessage';

const ADD_TO_CART_MUTATION = gql`
    mutation addToCart($id: ID!) {
        addToCart(id: $id) {
            id
            quantity
        }
    }
`;

class AddToCart extends React.Component {
    render() {
        const { id } = this.props;

        return (
            <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ id }}>
                {(addToCart, {error})=>(
                    <button onClick={addToCart}>Add to cart 🛒</button>
                )}
            </Mutation>
        );
    }
}

export default AddToCart;
