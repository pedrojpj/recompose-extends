import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import withErrors from '.';

Enzyme.configure({ adapter: new Adapter() });

describe('With Errors', () => {
  it('render with debug mode', () => {
    const Component = withErrors({ debug: true })('div');
    const wrapper = mount(<Component />);

    expect(wrapper.state().debug).toBe(true);
  });

  it('render with error', () => {
    const ErrorTemplate = example => <div>{example()}</div>;

    const Component = withErrors()(ErrorTemplate);
    const wrapper = mount(<Component />);

    expect(wrapper.state().hasError).toBeTruthy();
  });

  it('render with custom component', () => {
    const ErrorTemplate = example => <div>{example()}</div>;
    const CustomComponent = () => <p>Error</p>;
    const Component = withErrors({}, CustomComponent)(ErrorTemplate);
    const wrapper = mount(<Component />);

    expect(wrapper.state().hasError).toBeTruthy();
    expect(wrapper.find('p').text()).toBe('Error');
  });
});
