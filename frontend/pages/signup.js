import React, {Component} from 'react'
import styled from 'styled-components'

import Signup from '../components/Signup';
import Signin from '../components/Signin';
import ResetPassword from '../components/ResetPassword'

const Columns = styled.div`
    display:grid;
    grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));
    grid-gap:20px;
`;

const SignupPage = (props) => {
    return (
        <Columns>
            <Signup/>
            <Signin/>
            <ResetPassword/>
        </Columns>
    )
}

export default SignupPage;