import ItemComponent from '../components/Item';
import {shallow} from 'enzyme'
import toJSON from 'enzyme-to-json';

const fakeItem = {
    id: 'ABC123',
    title: 'A fake item',
    price: 1000,
    description: 'This is a fake item',
    image:'shoe.jpg',
    largeImage:'a_larger_shoe.jpg'
}

describe('<Item/>', () => {

    it('renders a component that matches the snapshot', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem}/>);
        expect(toJSON(wrapper)).toMatchSnapshot();
    });
    /* 
    it('renders the image properly', () => {
        const wrapper = shallow(<Item item={fakeItem}/>);

        const img = wrapper.find('img');
        expect(img.props().src).toBe(fakeItem.image);
        expect(img.props().alt).toBe(fakeItem.title);
    })

    it('renders the metadata properly', () => {
        const wrapper = shallow(<Item item={fakeItem}/>);

        const PriceTag = wrapper.find('PriceTag');
        expect(PriceTag.children().text()).toBe('$10');
        expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
        expect(wrapper.find('p').text()).toBe(fakeItem.description);        
    });

    it('renders the buttons properly', ()=>{
        const wrapper = shallow(<Item item={fakeItem}/>);
        
        const ButtonList = wrapper.find('.buttonList');
        expect(ButtonList.children()).toHaveLength(3);
        expect(ButtonList.find('Link').exists()).toBe(true);
        expect(ButtonList.find('AddToCart').exists()).toBe(true);
        expect(ButtonList.find('DeleteItem').exists()).toBe(true);
    })
    */
})