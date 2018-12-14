import React from "react";
import Downshift from "downshift";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";

import {
    DropDown,
    DropDownItem,
    Styles,
    SearchStyles
} from "./styles/DropDown";
import Router from "next/router";

const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchTerm: String!) {
        items(
            where: {
                OR: [
                    { title_contains: $searchTerm }
                    { description_contains: $searchTerm }
                ]
            }
        ) {
            id
            image
            title
        }
    }
`;

function routeToItem(item) {
    Router.push({
        pathname: "/item",
        query: {
            id: item.id
        }
    });
}

class AutoComplete extends React.Component {
    state = {
        items: [],
        loading: false
    };

    /**
     * This function fires when the input changes. Since we don't need to query on every input (it we are to type 'coat' it would
     * make four queries) we wrap it in a debounce function which waits for a number of ms before actually firing the event (360 in our case)
     */
    onChange = debounce(async (e, client) => {
        //1. Set the state to 'loading'
        this.setState({ loading: true });

        // 2. Perform the query using the Apollo Client directly
        const res = await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: {
                searchTerm: e.target.value
            }
        });
        // 3. Put the results into the state
        this.setState({
            items: res.data.items,
            loading: false
        });
    }, 360);

    /**
     * We use downshift to handle the autocomplete. This gives us some interesting things such as select handlers for the items in the dropdown, key navigation etc.
     */
    render() {
        return (
            <SearchStyles>
                <Downshift
                    onChange={routeToItem}
                    itemToString={item => (item === null ? "" : item.title)}
                >
                    {({
                        getInputProps,
                        getItemProps,
                        isOpen,
                        inputValue,
                        highlightedIndex
                    }) => (
                        <div>
                            <ApolloConsumer>
                                {client => (
                                    <input
                                        {...getInputProps({
                                            type: "search",
                                            onChange: e => {
                                                e.persist();
                                                this.onChange(e, client);
                                            },
                                            className: this.state.loading
                                                ? "loading"
                                                : "",
                                            id: "search",
                                            placeholder: "Search for products"
                                        })}
                                    />
                                )}
                            </ApolloConsumer>
                            {
                                // if the dropdown is open we display dropdown items
                                isOpen && (
                                <DropDown>
                                    {this.state.items.map((item, idx) => (
                                        <DropDownItem
                                            {...getItemProps({ item })}
                                            key={item.id}
                                            highlighted={
                                                idx === highlightedIndex
                                            }>
                                            <img
                                                width="50"
                                                src={item.image}
                                                alt="{item.title}"
                                            />
                                            >{item.title}
                                        </DropDownItem>
                                    ))}
                                    {
                                        // if there are no results...
                                        !this.state.items.length &&
                                        !this.state.loading && (
                                            <DropDownItem>
                                                Nothing found for {inputValue}
                                            </DropDownItem>
                                        )}
                                </DropDown>
                            )}
                        </div>
                    )}
                </Downshift>
            </SearchStyles>
        );
    }
}

export default AutoComplete;
