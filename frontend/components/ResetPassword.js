import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from './User'

const RESET_PASSWORD_MUTATION = gql`
    mutation RESET_PASSWORD_MUTATION(
        $resetToken: String!
        $password: String!
        $confirmPassword: String!
    ) {
        resetPassword(
            resetToken: $resetToken
            password: $password
            confirmPassword: $confirmPassword
        ) {
            id
            password
            name
        }
    }
`;

class ResetPassword extends Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired
    };
    state = {
        password: "",
        confirmPassword: ""
    };

    saveToState = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <Mutation
                mutation={RESET_PASSWORD_MUTATION}
                variables={{
                    resetToken: this.props.resetToken,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword
                }}
                refetchQueries={[{
                    query: CURRENT_USER_QUERY
                }]}
            >
                {(resetPassword, { error, loading, called }) => {
                    return (
                        <Form
                            method="POST"
                            onSubmit={async e => {
                                e.preventDefault();
                                await resetPassword();
                                this.setState({password:'', confirmPassword:''});
                            }}
                        >
                            <fieldset disabled={loading} aria-busy={loading}>
                                <Error error={error} />
                                <h2>Reset your password</h2>
                                <label htmlFor="password">
                                    New password
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Your password"
                                        value={this.state.password}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <label htmlFor="confirmPassword">
                                    Confirm new password
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm password"
                                        value={this.state.confirmPassword}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <button type="submit">
                                    Reset password
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
