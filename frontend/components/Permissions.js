import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

import Table from "./styles/Table";
import SickButton from "./styles/SickButton";

import Error from "./ErrorMessage";

const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_PERMISSIONS_MUTATION(
        $permissions: [Permission]
        $userId: String!
    ) {
        updatePermissions(permissions: $permissions, userId: $userId) {
            id
            name
            email
            permissions
        }
    }
`;

const allPermissions = [
    "ADMIN",
    "USER",
    "ITEMCREATE",
    "ITEMUPDATE",
    "ITEMDELETE",
    "PERMISSIONUPDATE"
];

const Permissions = props => (
    <Query query={ALL_USERS_QUERY}>
        {({ data, loading, error }) => (
            <div>
                <Error error={error} />
                <div>
                    <h2>Manage permissions</h2>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {allPermissions.map(permission => (
                                    <th key={permission}>{permission}</th>
                                ))}
                                <th>👇</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user => (
                                <UserPermissions key={user.id} user={user} />
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        )}
    </Query>
);

class UserPermissions extends Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            permissions: PropTypes.array.isRequired
        }).isRequired
    };
    state = {
        permissions: this.props.user.permissions
    };
    handlePermissionChange = e => {
        const checkbox = e.target;
        // take a copy of the current permissions
        let updatedPermissions = [...this.state.permissions];
        if (checkbox.checked) {
            updatedPermissions.push(checkbox.value);
        } else {
            updatedPermissions = updatedPermissions.filter(
                p => p !== checkbox.value
            );
        }
        this.setState({ permissions: updatedPermissions });
    };
    render() {
        const { user } = this.props;
        return (
            <Mutation
                mutation={UPDATE_PERMISSIONS_MUTATION}
                variables={{
                    permissions: this.state.permissions,
                    userId: user.id
                }}
            >
                {(updatePermission, { error, loading }) => (
                    <>
                        {error && (
                            <tr>
                                <td colSpan="9">
                                    <Error error={error} />
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            {allPermissions.map(permission => (
                                <td key={permission}>
                                    <label
                                        htmlFor={`${
                                            user.id
                                        }-permission-${permission}`}
                                    >
                                        <input
                                            id={`${
                                                user.id
                                            }-permission-${permission}`}
                                            type="checkbox"
                                            checked={this.state.permissions.includes(
                                                permission
                                            )}
                                            value={permission}
                                            onChange={
                                                this.handlePermissionChange
                                            }
                                        />
                                    </label>
                                </td>
                            ))}
                            <td>
                                <SickButton
                                    type="button"
                                    disabled={loading}
                                    onClick={updatePermission}
                                >
                                    Updat{loading ? "ing" : "e"}
                                </SickButton>
                            </td>
                        </tr>
                    </>
                )}
            </Mutation>
        );
    }
}

export default Permissions;
