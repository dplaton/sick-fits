import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import Nav from "../components/Nav";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser, fakeCartItem } from "../utils/testUtils";

const notSignedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: null } }
    }
];

const signedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: fakeUser() } }
    }
];

const signedInWithCartEntriesMock = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()]
                }
            }
        }
    }
];

describe("<Nav/>", () => {
    it("shows the required options when the user is logged in", async () => {
        const wrapper = mount(
            <MockedProvider mocks={signedInMocks}>
                <Nav />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        const nav = wrapper.find('ul[data-test="nav"]');
        expect(nav.children().length).toBe(6);
        expect(nav.text()).toContain("Sign out!");
    });

    it("shows the sign-in option when the user is not logged in", async () => {
        const wrapper = mount(
            <MockedProvider mocks={notSignedInMocks}>
                <Nav />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        const nav = wrapper.find('ul[data-test="nav"]');
        expect(toJSON(nav)).toMatchSnapshot();
    });

    it("shows the correct number of cart entries", async () => {
        const wrapper = mount(<MockedProvider mocks={signedInWithCartEntriesMock}>
            <Nav/>
        </MockedProvider>);
        await wait();
        wrapper.update();

        const cartCount = wrapper.find('ul[data-test="nav"] div.count');
        expect(toJSON(cartCount)).toMatchSnapshot();
    });
});
