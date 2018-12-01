import React, { Component } from "react";
import PleaseSignIn from "../components/PleaseSignIn";
import Permissions from '../components/Permissions';

export default props => {
    return (
        <PleaseSignIn>
            <Permissions/>
        </PleaseSignIn>
    );
};
