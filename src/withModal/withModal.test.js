import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { compose, withProps } from 'recompose';
import Adapter from 'enzyme-adapter-react-16';

import withModal from '.';

Enzyme.configure({ adapter: new Adapter() });

describe('With Modals', () => {
  it('render with content', () => {
    const Modal = () => <div>Modal</div>;
    const Content = () => <div>Content</div>;

    const Component = compose(withModal(({ isCheck }) => isCheck, Modal))(
      Content
    );
    const wrapper = mount(<Component isCheck={false} />);

    expect(wrapper.text()).toBe('Content');
  });

  it('render with modal', () => {
    const Modal = () => <div>Modal</div>;
    const Content = () => <div>Content</div>;

    const Component = compose(withModal(({ isCheck }) => isCheck, Modal))(
      Content
    );
    const wrapper = mount(<Component isCheck />);

    expect(wrapper.text()).toBe('Modal');
  });

  it('should render modal without props', () => {
    const Modal = () => <div>Modal</div>;
    const Content = () => <div>Content</div>;

    const Component = compose(
      withProps({ extraProp: true }),
      withModal(({ isCheck }) => isCheck, Modal, null, { includeProps: false })
    )(Content);

    const wrapper = mount(<Component isCheck />);
    expect(wrapper.find(Modal).props().extraProp).toBeUndefined();
  });

  it('should render modal with props', () => {
    const Modal = () => <div>Modal</div>;
    const Content = () => <div>Content</div>;

    const Component = compose(
      withProps({ extraProp: true }),
      withModal(({ isCheck }) => isCheck, Modal)
    )(Content);

    const wrapper = mount(<Component isCheck />);
    expect(wrapper.find(Modal).props().extraProp).toBeDefined();
  });
});
