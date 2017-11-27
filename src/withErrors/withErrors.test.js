import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import withErrors from '.';

Enzyme.configure({ adapter: new Adapter() });

describe('With Errors', () => {
  it('render with crashing', () => {
    const Component = withErrors();
    const wrapper = shallow(<Component />);
  });

  it('render with debug mode', () => {
    const Component = withErrors({ debug: true })('div');
    const wrapper = mount(<Component />);

    expect(wrapper.state().debug).toBe(true);
  });

  it('render with error', () => {
    const Component = withErrors()('<div>{example}</div>');
    const wrapper = mount(<Component />);

    expect(wrapper.state().hasError).toBeTruthy();
  });
});
