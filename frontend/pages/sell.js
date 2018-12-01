import React, { Component } from "react";
import CreateItem from "../components/CreateItem";
import PleaseSignIn from "../components/PleaseSignIn";

export default props => {
    return (
        <PleaseSignIn>
            <CreateItem />
        </PleaseSignIn>
    );
};
