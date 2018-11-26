import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
            id
            email
            name
        }
    }
`;

class Signin extends Component {
    state = {
        email: "",
        password: ""
    };

    saveToState = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <Mutation
                mutation={SIGNIN_MUTATION}
                variables={this.state}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(signUp, { error, loading }) => {
                    return (
                        <Form
                            method="POST"
                            onSubmit={async e => {
                                e.preventDefault();
                                await signUp();
                                this.setState({
                                    name: "",
                                    email: "",
                                    password: ""
                                });
                            }}
                        >
                            <fieldset disabled={loading} aria-busy={loading}>
                                <Error error={error} />
                                <h2>Sign in to your account</h2>
                                <label htmlFor="email">
                                    Email
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your email"
                                        value={this.state.email}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <label htmlFor="password">
                                    Password
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Your password"
                                        value={this.state.password}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <button type="submit">Signin</button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }
}

export default Signin;
