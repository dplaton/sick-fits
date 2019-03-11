import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { ApolloConsumer } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";

import TakeMyMoney, { CREATE_ORDER_MUTATION } from "../components/TakeMyMoney";
import { fakeUser, fakeCartItem } from "../lib/testUtils";
import { CURRENT_USER_QUERY } from "../components/User";

Router.router = { push: jest.fn() };

const mocks = [
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
    }
];

describe("<TakeMyMoney/>", () => {
    it("renders and matches snapshot", async () => {
        let apolloClient;
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <TakeMyMoney />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        const checkoutButton = wrapper.find("ReactStripeCheckout");
        expect(toJSON(checkoutButton)).toMatchSnapshot();
    });

    it("creates an order on token", async () => {
        const createOrderMock = jest.fn().mockResolvedValue({
            data: {
                createOrder: {
                    id: "xyz123"
                }
            }
        });

        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <TakeMyMoney />
            </MockedProvider>
        );

        const component = wrapper.find("TakeMyMoney").instance();
        component.onToken({ id: "abc123" }, createOrderMock);
        expect(createOrderMock).toHaveBeenCalled();
        expect(createOrderMock).toHaveBeenCalledWith({
            variables: { token: "abc123" }
        });
    });

    it("turns the progress bar on before routing", async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <TakeMyMoney />
            </MockedProvider>
        );

        NProgress.start = jest.fn();
        const createOrderMock = jest.fn().mockResolvedValue({
            data: {
                createOrder: {
                    id: "xyz123"
                }
            }
        });
        const component = wrapper.find("TakeMyMoney").instance();
        component.onToken({ id: "abc123" }, createOrderMock);

        expect(NProgress.start).toHaveBeenCalled();
    });

    it("routes to the order page when completed", async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <TakeMyMoney />
            </MockedProvider>
        );

        NProgress.start = jest.fn();
        const createOrderMock = jest.fn().mockResolvedValue({
            data: {
                createOrder: {
                    id: "xyz123"
                }
            }
        });
        const component = wrapper.find("TakeMyMoney").instance();
        component.onToken({ id: "abc123" }, createOrderMock);

        expect(Router.router.push).toHaveBeenCalled();
        expect(Router.router.push).toHaveBeenCalledWith({
            pathname: "/order",
            query: { orderId: "xyz123" }
        });
    });
});
