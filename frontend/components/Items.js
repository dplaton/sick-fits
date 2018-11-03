import React, {Component} from 'react'
import gql from 'graphql-tag'
import {Query} from 'react-apollo'

const ALL_ITEMS_QUERY = gql `
    query ALL_ITEMS_QUERY {
        items {
            id
            title
            price
            description
            image
            largeImage
        }
    }
`;

class Items extends Component {
    render() {
        return (
            <div>
                <Query query={ALL_ITEMS_QUERY}>
                    {
                        ({data, error, loading}) => {
                            if (loading) return <p>Loading...</p>
                            if (error) return <p>Error! {error}</p>

                            return <p>Hey, I found {data.items.length}</p>;
                        }
                    } 
                </Query>
            </div>
        )
    }
}

export default Items