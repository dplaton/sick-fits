import React, { Component } from "react";
import PleaseSignIn from "../components/PleaseSignIn";
import Order from "../components/Order";

export default props => {
    return (
        <PleaseSignIn>
            <Order id={props.query.orderId} />
        </PleaseSignIn>
    );
};
