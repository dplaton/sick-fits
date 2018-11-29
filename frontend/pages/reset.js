import React, {Component} from 'react'
import CreateItem from '../components/CreateItem';
import ResetPassword from '../components/ResetPassword';

export default (props) => {
    return <ResetPassword resetToken={props.query.resetToken}/>
}