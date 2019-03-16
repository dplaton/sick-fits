import React, { Component } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { format } from "date-fns";
import formatMoney from "../utils/formatMoney";

import OrderStyles from "./styles/OrderStyles";
import Error from "./ErrorMessage";
import OrderItem from "./OrderItem";

const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!) {
        order(id: $id) {
            id
            charge
            total
            createdAt
            user {
                id
            }
            items {
                id
                title
                description
                image
                quantity
                price
            }
        }
    }
`;

class Order extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    };
    render() {
        return (
            <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
                {({ data, error, loading }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <Error error={error} />;
                    const order = data.order;
                    return (
                        <OrderStyles data-test="order">
                            <p>
                                <span>ID</span>
                                <span>{order.id}</span>
                            </p>
                            <p>
                                <span>Charge</span>
                                <span>{order.charge}</span>
                            </p>
                            <p>
                                <span>Date</span>
                                <span>
                                    {format(
                                        order.createdAt,
                                        "MMMM d, YYYY h:mm a"
                                    )}
                                </span>
                            </p>
                            <p>
                                <span>Total</span>
                                <span>{formatMoney(order.total)}</span>
                            </p>
                            <p>
                                <span>Items count</span>
                                <span>{order.items.length}</span>
                            </p>
                            <div className="items">
                                {data.order.items.map(orderItem => (
                                    <OrderItem
                                        key={orderItem.id}
                                        item={orderItem}
                                    />
                                ))}
                            </div>
                        </OrderStyles>
                    );
                }}
            </Query>
        );
    }
}

export {SINGLE_ORDER_QUERY};
export default Order;
