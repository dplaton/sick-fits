import React, { Component } from 'react';
import UpdateItem from '../components/UpdateItem';

export default props => {
    return <UpdateItem id={props.query.id} />;
};
