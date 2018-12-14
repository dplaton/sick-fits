import withApollo from "next-with-apollo";
import ApolloClient from "apollo-boost";
import { endpoint } from "../config";
import { LOCAL_STATE_QUERY } from "../components/Cart";

function createClient({ headers }) {
    return new ApolloClient({
        uri: process.env.NODE_ENV === "development" ? endpoint : endpoint,

        request: operation => {
            operation.setContext({
                fetchOptions: {
                    credentials: "include"
                },
                headers
            });
        },
        // local state (data)
        // ApolloClient can be used to manipulate local state, just like Redux
        clientState: {
            resolvers: {
                Mutation: {
                    toggleCart(_, variables, client) {
                        //read the cartOpen value from the cache
                        const cache = client.cache;
                        const { cartOpen } = cache.readQuery({
                            query: LOCAL_STATE_QUERY
                        });
                        console.log(cartOpen);

                        //write the cart state to the opposite
                        const data = {
                            data: { cartOpen: !cartOpen }
                        };

                        cache.writeData(data);

                        return data;
                    }
                }
            },
            defaults: {
                cartOpen: false
            }
        }
    });
}

export default withApollo(createClient);
