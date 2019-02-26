import React, {Component} from 'react'
import gql from 'graphql-tag'
import {Query} from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link'

import PaginationStyles from './styles/PaginationStyles'
import {perPage} from '../config'

export const PAGINATION_QUERY = gql `
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`

const Pagination = (props) => (
    <Query query={PAGINATION_QUERY}>
        {({data, loading, error}) => {
            if (loading) return <p>Loading...</p>;
            const itemsCount = data.itemsConnection.aggregate.count
            const numPages = Math.ceil(itemsCount / perPage);
            const {page} = props;
            return (
                <PaginationStyles data-test="pagination">
                    <Head>
                        <title>Sick Fits | page {page}
                            of {numPages}</title>
                    </Head>
                    <Link
                        href={{
                        pathname: 'items',
                        query: {
                            page: page - 1
                        }
                    }}>
                        <a className='prev' aria-disabled={page <= 1}>Prev</a>
                    </Link>
                    <p>{page}&nbsp; of <span className="total-pages">{numPages}</span></p>
                    <p>{itemsCount}&nbsp; items total</p>
                    <Link
                        href={{
                        pathname: 'items',
                        query: {
                            page: page + 1
                        }
                    }}>
                        <a className='next' aria-disabled={page >= numPages}>Next</a>
                    </Link>
                </PaginationStyles>
            )
        }}
    </Query>
)

export default Pagination
