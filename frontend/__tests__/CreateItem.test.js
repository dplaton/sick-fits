import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import Router from "next/router";

import CreateItem, { CREATE_ITEM_MUTATION } from "../components/CreateItem";
import { fakeItem } from "../utils/testUtils";
import { resetIdCounter } from "downshift";

const MOCK_DOG_IMAGE = "https://www.dogs.com/dog.jpg";

// mock the global fetch library
global.fetch = jest.fn().mockResolvedValue({
    json: () => ({
        secure_url: MOCK_DOG_IMAGE,
        eager: [{ secure_url: MOCK_DOG_IMAGE }]
    })
});

describe("<CreateItem />", () => {
    it("renders and matches snapshot", async () => {
        const wrapper = mount(
            <MockedProvider>
                <CreateItem />
            </MockedProvider>
        );

        expect(
            toJSON(wrapper.find("form[data-test='createItemForm']"))
        ).toMatchSnapshot();
    });

    it("uploads a file when changed", async () => {
        const wrapper = mount(
            <MockedProvider>
                <CreateItem />
            </MockedProvider>
        );

        const input = wrapper.find("input[type='file']");
        // simulate an upload
        input.simulate("change", { target: { files: ["fakedog.jpg"] } });
        await wait();
        wrapper.update();

        // grab an instance of the component to check the state
        const component = wrapper.find("CreateItem").instance();

        expect(global.fetch).toHaveBeenCalled();
        expect(component.state.image).toEqual(MOCK_DOG_IMAGE);
        expect(component.state.largeImage).toEqual(MOCK_DOG_IMAGE);

        // clean-up
        global.fetch.mockReset();
    });

    it("handles state updating", async () => {
        const wrapper = mount(
            <MockedProvider>
                <CreateItem />
            </MockedProvider>
        );

        const expectedState = {
            title: "Shoes",
            price: 20,
            description: "Cool shoes"
        };

        // simulate input in the fields
        wrapper
            .find("#title")
            .simulate("change", {
                target: { name: "title", value: expectedState.title }
            });
        wrapper
            .find("#price")
            .simulate("change", {
                target: { name: "price", value: expectedState.price }
            });
        wrapper
            .find("#description")
            .simulate("change", {
                target: {
                    name: "description",
                    value: expectedState.description
                }
            });

        await wait();
        wrapper.update();

        const component = wrapper.find("CreateItem").instance();
        expect(component.state).toMatchObject(expectedState);
    });

    it("creates  an item when the form is submitted", async () => {
        const item = fakeItem();
        const mocks = [{
            request: {
                query: CREATE_ITEM_MUTATION,
                variables: {
                    title:item.title,
                    description: item.description,
                    price: item.price,
                    image:"",
                    largeImage:""
                }
            },
            result: {
                data: {
                    createItem: {
                        ...item,
                        id:'abd123',
                        __typename: "Item"
                    }
                }
            }
        }];
      
        // mock the router
        
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <CreateItem />
            </MockedProvider>
        )
        
        // simulate input in the fields
        wrapper
        .find("#title")
        .simulate("change", {
            target: { name: "title", value: item.title }
        });
        wrapper
        .find("#price")
        .simulate("change", {
            target: { name: "price", value: item.price }
        });
        wrapper
        .find("#description")
        .simulate("change", {
            target: {
                name: "description",
                value: item.description
            }
        });
        
        Router.router = { push: jest.fn()};
        wrapper.find('form').simulate("submit");

        await wait(50);
        wrapper.update();
        expect(Router.router.push).toHaveBeenCalled();
        expect(Router.router.push).toHaveBeenCalledWith({"pathname": "/item", "query": {"id": "abd123"}});

    });
});
