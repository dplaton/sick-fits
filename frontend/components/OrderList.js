import React, { Component } from 'react'
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import Link from 'next/link';
import {formatDistance} from 'date-fns';

import formatMoney from '../lib/formatMoney.js';
import Error from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';
import styled from 'styled-components';

const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY {
        orders(orderBy: createdAt_DESC) {
            id
            total
            createdAt
            items {
                id
                title
                price
                description
                quantity
                image
            }
        }
    }
`;
const OrderUl = styled.ul`
    display:grid;
    grid-gap: 4rem;
    
`;
export default class OrderList extends Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {
            ({data: {orders},loading,error})=>{
                if (loading) return <p>Loading...</p>;
                if (error) return <Error error={error} />;
                return(
                    <div>
                        <h2>You have {orders.length} order{orders.length === 1 ? '':'s'}</h2>
                        <OrderUl>
                        { orders.map(order => (
                            <OrderItemStyles key={order.id}>
                                <Link href={{
                                    pathname:'/order',
                                    query: {orderId: order.id}}}>
                                    <a>
                                        <div className="order-meta">
                                            <p>{order.items.reduce((a,b)=>a+b.quantity, 0)} items</p>
                                            <p>{order.items.length} products</p>
                                            <p>{formatDistance(order.createdAt, new Date())} ago</p>
                                            <p>{formatMoney(order.total)}</p>
                                        </div>
                                        <div className="images">
                                        {order.items.map(item=> (
                                            <img src={item.image} alt={item.title} key={item.id}/>
                                        ))}
                                        </div>
                                    </a>
                                </Link>
                            </OrderItemStyles>
                            ))
                        }
                        </OrderUl>
                    </div>
                )}
        }
      </Query>
    )
  }
}
