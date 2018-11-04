import React, {Component} from 'react'
import gql from 'graphql-tag'
import {Mutation} from 'react-apollo'
import Router from 'next/router'

import formatMoney from '../lib/formatMoney'
import Form from './styles/Form'
import Error from './ErrorMessage'

export const CREATE_ITEM_MUTATION = gql `
    mutation CREATE_ITEM_MUTATION(
        $title:String!
        $description:String!
        $price:Int!
        $image:String
        $largeImage:String
    ){
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

export default class CreateItem extends Component {

    state = {
        title: 'Test',
        price: 3,
        description: 'Test',
        image: 'test.jpg',
        largeImage: 'test-large.jpg'
    }

    handleChange = (e) => {
        const {name, type, value} = e.target;
        const val = type === 'number'
            ? parseFloat(value)
            : value;

        this.setState({[name]: val});
    }

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, {loading, error, data}) => (
                    <Form
                        onSubmit={async e => {
                        e.preventDefault();
                        const res = await createItem();
                        console.log(res);
                        Router.push({
                            pathname: '/item',
                            query: {
                                id: res.data.createItem.id
                            }
                        })
                    }}>
                        <Error error={error}/>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="title">Title
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="title"
                                    required
                                    value={this.state.title}
                                    onChange={this.handleChange}/>
                            </label>
                            <label htmlFor="price">Price
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    placeholder="price"
                                    required
                                    value={this.state.price}
                                    onChange={this.handleChange}/>
                            </label>
                            <label htmlFor="description">Description
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter a description"
                                    required
                                    value={this.state.description}
                                    onChange={this.handleChange}/>
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        )
    }
}
