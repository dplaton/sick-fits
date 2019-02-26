import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import Router from "next/router";

import Pagination, { PAGINATION_QUERY } from "../components/Pagination";

// mock the router
Router.router = {
    push() { },
    prefetch() { }
}

const mockZeroElements = [
    {
        request: { query: PAGINATION_QUERY },
        result: { data: { itemsConnection: { aggregate: { count: 0 } } } }
    }
];

function makeMocksFor(count) {
    return [
        {
            request: {
                query: PAGINATION_QUERY
            },
            result: {
                data: {
                    itemsConnection: {
                        __typename: "aggregate",
                        aggregate: { 
                            __typename: "count", 
                            count 
                        }
                    }
                }
            }
        }
    ];
}

describe("<Pagination />", () => {
    if ("displays a loading message", async ()=> {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(1)}>
                <Pagination page={1}/>
            </MockedProvider>
        );
        expect(wrapper.text()).toContain('Loading...');
    });

    it("shows a single item when there are 18 elements", async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={1}/>
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        expect(wrapper.find('.total-pages').text()).toEqual('5');
        const pagination = wrapper.find('div[data-test="pagination"]');
        expect(toJSON(pagination)).toMatchSnapshot();
    });

    it("disables the 'Next' button at last page", async() => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={5}/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        const prevLink = wrapper.find('a.prev');
        const nextLink = wrapper.find('a.next')
        expect(nextLink.prop("aria-disabled")).toBe(true);
        expect(prevLink.prop("aria-disabled")).toBe(false);
    });

    it("disables the 'Prev' button at first page", async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={1}/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        const prevLink = wrapper.find('a.prev');
        const nextLink = wrapper.find('a.next')
        expect(prevLink.prop("aria-disabled")).toBe(true);
        expect(nextLink.prop("aria-disabled")).toBe(false);
    });

    it("enables both 'Prev' and 'Next' buttons at a middle page", async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={3}/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        const prevLink = wrapper.find('a.prev');
        const nextLink = wrapper.find('a.next')
        expect(prevLink.prop("aria-disabled")).toBe(false);
        expect(nextLink.prop("aria-disabled")).toBe(false);
    });
});
