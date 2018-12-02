import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id: ID!) {
        deleteItem(id: $id) {
            id
        }
    }
`;

class DeleteItem extends Component {
    update = (cache, payload) => {
        // manually update the cache on the client instead of re-fetching everything

        // 1. Read the items from the cache
        const data = cache.readQuery({ query: ALL_ITEMS_QUERY });

        // 2. Filter the deleted item
        data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
        cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
    };

    render() {
        return (
            // relevant docs: https://www.apollographql.com/docs/react/essentials/mutations.html
            // the "udpdate" prop specifies a function to be used as a 'callback' after the mutation was executed
            <Mutation mutation={DELETE_ITEM_MUTATION} variables={{ id: this.props.id }} update={this.update}>
                {(deleteItem, { error }) => (
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this item?')) {
                                deleteItem()
                                    .catch(err => { alert(err.message) });
                            }
                        }}>
                        {this.props.children}
                    </button>
                )}
            </Mutation>
        );
    }
}

export default DeleteItem;
