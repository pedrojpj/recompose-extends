import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import removeProp from '.';

Enzyme.configure({ adapter: new Adapter() });

describe('Remove Props', () => {
  let ComponentMock;

  beforeAll(() => {
    ComponentMock = ({ title }) => <div>{title}</div>;
  });

  it('remove prop title of the component', () => {
    const Component = removeProp('title')(ComponentMock);
    const wrapper = shallow(<Component title="Prueba" />).dive();

    console.log(wrapper.props());

    expect(wrapper.props().children).toBeUndefined();
  });

  it('should not remove prop title of the component', () => {
    const Component = removeProp('name')(ComponentMock);
    const wrapper = shallow(<Component title="Prueba" />).dive();

    console.log(wrapper.props());

    expect(wrapper.props().children).toBeDefined();
  });
});
