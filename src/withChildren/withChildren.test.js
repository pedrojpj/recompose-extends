import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { compose, setDisplayName, pure } from 'recompose';
import Adapter from 'enzyme-adapter-react-16';

import withChildren from '.';

Enzyme.configure({ adapter: new Adapter() });

describe('With Children', () => {
  it('should create a node prop associated with the selected component', () => {
    const Content = () => (
      <div>
        <button />
      </div>
    );

    const Component = compose(withChildren(['button']))(Content);

    const wrapper = mount(
      <Component>
        <button />
        <div />
      </Component>
    );

    expect(wrapper.find(Content).props().ComponentButton).toBeDefined();
  });

  it('should create a node prop associated with the two selected components', () => {
    const Content = () => (
      <div>
        <button />
      </div>
    );

    const Component = compose(withChildren(['button', 'div']))(Content);

    const wrapper = mount(
      <Component>
        <button />
        <div />
      </Component>
    );

    expect(wrapper.find(Content).props().ComponentButton).toBeDefined();
    expect(wrapper.find(Content).props().ComponentDiv).toBeDefined();
  });

  it('should discard the buttons', () => {
    const Content = () => (
      <div>
        <button />
      </div>
    );

    const Component = compose(withChildren(['div']))(Content);

    const wrapper = mount(
      <Component>
        <button />
        <div />
      </Component>
    );

    expect(wrapper.find(Content).props().ComponentButton).toBeUndefined();
    expect(wrapper.find(Content).props().ComponentDiv).toBeDefined();
  });

  it('should select several components of the same type in array format', () => {
    const Content = () => (
      <div>
        <button />
      </div>
    );

    const Component = compose(withChildren(['button']))(Content);

    const wrapper = mount(
      <Component>
        <button />
        <button />
        <button />
      </Component>
    );

    expect(wrapper.find(Content).props().ComponentButton).toBeDefined();
    expect(wrapper.find(Content).props().ComponentButton).toHaveLength(3);
  });

  it('should filter a custom component', () => {
    const Content = ({ customComponent }) => <div>{customComponent}</div>;
    const CustomComponent = () => <div>hello</div>;
    const Component = compose(withChildren([CustomComponent]))(Content);
    const wrapper = mount(
      <Component>
        <CustomComponent />
      </Component>
    );

    expect(
      wrapper.find(Content).props().ComponentCustomComponent
    ).toBeDefined();
  });

  it('should not receive any component prop or children', () => {
    const Content = () => <div />;
    const Component = compose(withChildren(['button']))(Content);
    const wrapper = mount(<Component />);
    expect(wrapper.find(Content).props().ComponentButton).toBeUndefined();
  });

  it('should assign the displayName', () => {
    const Content = () => <div />;
    const CustomComponent = () => <div>Hello</div>;
    const CustomComponentEnhance = compose(setDisplayName('enhance'), pure)(
      CustomComponent
    );

    const Component = compose(withChildren([CustomComponentEnhance]))(Content);
    const wrapper = mount(
      <Component>
        <CustomComponentEnhance />
      </Component>
    );

    expect(wrapper.find(Content).props().ComponentEnhance).toBeDefined();
  });
});
