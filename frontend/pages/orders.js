
import React, { Component } from "react";
import PleaseSignIn from "../components/PleaseSignIn";
import OrderList from "../components/OrderList";

export default props => {
    return (
        <PleaseSignIn>
            <OrderList />
        </PleaseSignIn>
    );
};
