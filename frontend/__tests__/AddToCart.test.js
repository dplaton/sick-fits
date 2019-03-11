import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { ApolloConsumer } from "react-apollo";
import AddToCart, { ADD_TO_CART_MUTATION } from "../components/AddToCart";
import { fakeUser, fakeCartItem } from "../lib/testUtils";
import { CURRENT_USER_QUERY } from "../components/User";

const mocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [],
                }
            }
        }
    },
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [fakeCartItem()]
                }
            }
        }
    },
    {
        request: { query: ADD_TO_CART_MUTATION, variables: { id: "abc123" } },
        result: {
            data: {
                addToCart: {
                    ...fakeCartItem(),
                    quantity: 1
                }
            }
        }
    }
];

describe("<AddToCart/>", () => {
    it("renders and matches snapshot", async () => {
        const wrapper = mount(
            <MockedProvider>
                <AddToCart />
            </MockedProvider>
        );

        expect(toJSON(wrapper.find("button"))).toMatchSnapshot();
    });

    it("calls the mutation properly", async () => {
        let apolloClient;
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloConsumer>
                    {client => {
                        apolloClient = client;
                        return <AddToCart id={"abc123"} />;
                    }}
                </ApolloConsumer>
            </MockedProvider>
        );
        
        await wait();
        wrapper.update();
        
        let res = await apolloClient.query({ query: CURRENT_USER_QUERY });
        expect(res.data.me.cart).toHaveLength(0);
        
        wrapper.find("button").simulate("click");
        await wait(50);
        
        res = await apolloClient.query({ query: CURRENT_USER_QUERY });
        const meAfterAddToCart = res.data.me;
        
        expect(meAfterAddToCart.cart).toHaveLength(1);
        expect(meAfterAddToCart.cart[0].id).toEqual("omg123");
    });
    
    it('updates the label after clicking the button', async() => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                    <AddToCart id={"abc123"} />;
            </MockedProvider>
        );

        const button = wrapper.find("button")
        expect(button.text()).toContain("Add to cart");
        button.simulate('click');
        expect(button.text()).toContain("Adding to cart");
    })
});
