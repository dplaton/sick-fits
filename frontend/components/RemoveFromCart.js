import React from "react";
import { Mutation } from "react-apollo";
import PropTypes from "prop-types";
import styled from "styled-components";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
    mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`;

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;
    &:hover {
        color: ${props => props.theme.red};
        cursor: pointer;
    }
`;

class RemoveFromCart extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    };

    /**
     * Runs immediately after the response from the query comes back from the server.
     * @param {Object} cache - the Apollo Cache
     * @param {Object} payload - the data returned from the server.
     * 
     * Example payload here:
     * {data: {
     *      removeFromCart: {
     *          id: id
     *       }
     *   }
     * }
     */
    updateCache = (cache, payload) => {
        console.log("Updating cache...");
        const data = cache.readQuery({ query: CURRENT_USER_QUERY });

        data.me.cart = data.me.cart.filter(
            cartItem => cartItem.id !== payload.data.removeFromCart.id
        );

        cache.writeQuery({
            query: CURRENT_USER_QUERY,
            data
        });
    };

    /* concepts used here:
        1. Update - automatically runs a fn after the response comes back from the server
        2. Optimistic response - we don't wait for the server to respond, we assume that the response was sent already and we pass the 
                                response that we're waiting for.
    */
    render() {
        const { id } = this.props;
        return (
            <Mutation
                mutation={REMOVE_FROM_CART_MUTATION}
                variables={{ id }}
                update={this.updateCache}
                optimisticResponse={{
                    __typename: 'Mutation',
                    removeFromCart: {
                        __typename:'CartItem',
                        id: this.props.id
                    }
                }}
            >
                {(removeFromCart, { loading, error }) => (
                    <BigButton
                        title="DeleteItem"
                        disabled={loading}
                        onClick={() => {
                            removeFromCart().catch(err => alert(err.message));
                        }}
                    >
                        &times;
                    </BigButton>
                )}
            </Mutation>
        );
    }
}

export default RemoveFromCart;
