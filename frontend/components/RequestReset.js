import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!) {
        requestReset(email: $email) {
            message
        }
    }
`;

class ResetPassword extends Component {
    state = {
        email: ""
    };

    saveToState = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
                {(requestReset, { error, loading, called }) => {
                    return (
                        <Form
                            method="POST"
                            onSubmit={async e => {
                                e.preventDefault();
                                await requestReset();
                            }}
                        >
                            {!error && !loading && called && (
                                <p>
                                    Success! Check your e-mail for the reset
                                    link
                                </p>
                            )}
                            <fieldset disabled={loading} aria-busy={loading}>
                                <Error error={error} />
                                <h2>Reset your password</h2>
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
                                <button type="submit">
                                    Request password reset
                                </button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }
}

export default ResetPassword;
