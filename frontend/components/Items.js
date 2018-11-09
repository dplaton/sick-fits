import React, {Component} from 'react';
import gql from 'graphql-tag';

import {Query} from 'react-apollo';
import styled from 'styled-components';

import Item from './Item';
import PriceTag from './styles/PriceTag';
import DeleteItem from './DeleteItem';
import Pagination from './Pagination';
import {perPage} from '../config'

export const ALL_ITEMS_QUERY = gql `
    query ALL_ITEMS_QUERY($skip: Int=0, $first: Int=${perPage}) {
        items(skip: $skip, first: $first, orderBy: createdAt_DESC){
            id
            title
            price
            description
            image
            largeImage
        }
    }
`;

const Center = styled.div `
    text-align: center;
`;

const ItemList = styled.div `
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
`;

class Items extends Component {
    render() {
        return (
            <Center>
                <Pagination page={this.props.page}/>
                <Query
                    fetchPolicy="network-only"
                    query={ALL_ITEMS_QUERY}
                    variables={{
                    skip: this.props.page * perPage - perPage
                }}>
                    {({data, error, loading}) => {
                        if (loading) 
                            return <p>Loading...</p>;
                        if (error) 
                            return <p>Error! {error}</p>;
                        
                        return (
                            <ItemList>
                                {data
                                    .items
                                    .map(item => (<Item key={item.id} item={item}/>))}
                            </ItemList>
                        );
                    }}
                </Query>
                <Pagination page={this.props.page}/>
            </Center>
        );
    }
}

export default Items;
