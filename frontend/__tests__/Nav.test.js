import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import Nav from "../components/Nav";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser } from "../lib/testUtils";
import Signout from "../components/Signout";
import Signin from "../components/Signin";

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

describe("<Nav/>", () => {
    it("shows the required options when the user is logged in", async () => {
        
        const wrapper = mount(
            <MockedProvider mocks={signedInMocks}>
                <Nav />
            </MockedProvider>
        );

        await wait();
        wrapper.update()
        const nav = wrapper.find('[data-test="nav"]');
        expect(nav.contains(<Signout/>)).toBe(true);
    });

    it('shows the sign-in option when the user is not logged in', async () => {
 
        const wrapper = mount(
            <MockedProvider mocks={notSignedInMocks}>
                <Nav />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        const nav = wrapper.find('[data-test="nav"]');
        expect(toJSON(nav)).toMatchSnapshot();
    });
});
