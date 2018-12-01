import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Table from "./styles/Table";
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
                                    <th>{permission}</th>
                                ))}
                                <th>👇</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user => (
                                <User user={user} />
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        )}
    </Query>
);

class User extends Component {
    render() {
        const { user } = this.props;
        return (
            <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
            </tr>
        );
    }
}

export default Permissions;
