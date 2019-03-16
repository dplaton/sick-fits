
import { mount } from 'enzyme';
import toJson  from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import SingleItem, {SINGLE_ITEM_QUERY} from '../components/SingleItem';

import { fakeItem } from '../utils/testUtils'; 

describe('<SingleItem />', () => {
    it('renders the data properly', async () => {
        const mocks = [{
            request: { query: SINGLE_ITEM_QUERY, variables: {id: '123'}},
            result:  { data: { item: fakeItem() } }
        }];

        const wrapper = mount(
            <MockedProvider mocks={mocks}> 
                <SingleItem id='123'/>
            </MockedProvider>
        );
        expect(wrapper.text()).toContain('Loading...');
        await wait(0);
        wrapper.update();
        expect(toJson(wrapper.find('h2'))).toMatchSnapshot();
        expect(toJson(wrapper.find('p'))).toMatchSnapshot();
        expect(toJson(wrapper.find('img'))).toMatchSnapshot();
    });

    it ('renders error when the item is missing', async() => {

        const mocks = [{
            request: { query: SINGLE_ITEM_QUERY, variables: {id: '123'}},
            result: {
                errors:[{
                    message: "Item not found"
                }]
            }
        }];

        const wrapper = mount(<MockedProvider mocks={mocks}>
            <SingleItem id='123'/>
        </MockedProvider>)

        await wait(0);
        wrapper.update();
        const errorMessage = wrapper.find('[data-test="graphql-error"]');
        expect(toJson(errorMessage)).toMatchSnapshot();
    })
})