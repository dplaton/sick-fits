import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import { ApolloConsumer } from "react-apollo";

import Signup, { SIGNUP_MUTATION } from "../components/Signup";
import { fakeUser } from "../lib/testUtils";
import { CURRENT_USER_QUERY } from "../components/User";

const me = fakeUser();
const mocks = [
    // signup mock query
    {
        request: {
            query: SIGNUP_MUTATION,
            variables: {
                name: me.name,
                email: me.email,
                password: "done"
            }
        },
        result: {
            data: {
                signUp: {
                    __typename: "User",
                    id: "abc123",
                    email: me.email,
                    name: me.name
                }
            }
        }
    },
    // user query mock
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me
            }
        }
    }
];

function type(wrapper, name, value) {
    wrapper.find(`input[name="${name}"]`).simulate("change", {
        target: {
            name,
            value
        }
    });
}

describe("<Signup/>", () => {
    it("renders and matches snapshot", () => {
        const wrapper = mount(
            <MockedProvider>
                <Signup />
            </MockedProvider>
        );

        expect(toJSON(wrapper.find("form"))).toMatchSnapshot();
    });

    it("executes the mutation properly", async () => {
        let apolloClient;
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloConsumer>
                    {client => {
                        apolloClient = client;
                        return <Signup />;
                    }}
                </ApolloConsumer>
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        type(wrapper, "email", me.email);
        type(wrapper, "password", "done");
        type(wrapper, "name", me.name);

        wrapper.find("form").simulate("submit");
        await wait();

        const result = await apolloClient.query({ query: CURRENT_USER_QUERY });
        expect(result.data.me).toMatchObject(me);
    });
});
