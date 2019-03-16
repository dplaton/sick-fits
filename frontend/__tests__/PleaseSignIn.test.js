import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import PleaseSignIn from "../components/PleaseSignIn";
import { CURRENT_USER_QUERY } from "../components/User";

import { fakeUser } from "../utils/testUtils";

const notSignedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: null} }
    }
];

const signedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: fakeUser()} }
    }
]

describe("<PleaseSignIn />", () => {
    const wrapper = mount(
        <MockedProvider mocks={notSignedInMocks}>
            <PleaseSignIn>
                <p>Signed in</p>
            </PleaseSignIn>
        </MockedProvider>
    );
    it("shows the sign in message if the user is not signed in", async () => {

        await wait(0);
        wrapper.update();
        expect(toJson(wrapper.find('Signin'))).toMatchSnapshot();
    });

    it('renders the component if the user is signed in', async () => {
        const SignedIn = () => <p>Signed in!</p>
        const wrapper = mount(
            <MockedProvider mocks={signedInMocks}>
                <PleaseSignIn>
                    <SignedIn/>
                </PleaseSignIn>
            </MockedProvider>
        );

        await wait(0);
        wrapper.update();
        expect(wrapper.contains(<SignedIn/>)).toBe(true);
    })
});
