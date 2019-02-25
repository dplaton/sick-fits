import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Head from 'next/head';

import Error from './ErrorMessage';

const SingleItemStyles = styled.div`
    max-width: 1280px;
    margin: 2rem auto;
    box-shadow: ${props => props.theme.bs};
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    min-height: 800px;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .details {
        margin: 3rem;
        font-size: 2rem;
    }
`;

export const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            title
            description
            price
            largeImage
            image
        }
    }
`;

class SingleItem extends Component {
    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
                {({ data, error, loading }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <Error error={error} />;
                    if (!data.item) return <p>No data found for item {this.props.id}</p>;
                    const item = data.item;
                    return (
                        <SingleItemStyles>
                            <Head>
                                <title>Sick Fits | {item.title}</title>
                            </Head>
                            <img src={data.item.largeImage} alt={data.item.title} />
                            <div className="details">
                                <h2>Viewing: {item.title}</h2>
                                <p>{item.description}</p>
                            </div>
                        </SingleItemStyles>
                    );
                }}
            </Query>
        );
    }
}

export default SingleItem;
