import React from "react";
import formatMoney from "../lib/formatMoney";

import OrderItemStyles from "./styles/OrderItemStyles";

const OrderItem = props => {
    const { title, image, description, quantity, price } = props.item;
    return (
        <div className="order-item">
            <img src={image} alt={title} />
            <div className="item-details">
                <h2>{title}</h2>
                <p>Qty: {quantity}</p>
                <p>Price: {formatMoney(price)}</p>
                <p>Subtotal: {formatMoney(price*quantity)}</p>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default OrderItem;
