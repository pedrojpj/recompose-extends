import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import { compose, withReducer, flattenProp } from 'recompose';
import Adapter from 'enzyme-adapter-react-16';

import withActions from '.';

const SET_COUNTER = 'SET_COUNTER';

Enzyme.configure({ adapter: new Adapter() });

describe('With Actions', () => {
  it('should add the actions as props', () => {
    const Content = () => <div>Content</div>;

    const increment = dispatch => () => dispatch({ type: 'action' });

    const initialState = { counter: 0 };
    const reducer = (state, action) =>
      action.type === SET_COUNTER ? { counter: action.payload } : state;

    const Component = compose(
      withReducer('state', 'dispatch', reducer, initialState),
      withActions({ increment }),
      flattenProp('state')
    )(Content);

    const wrapper = shallow(<Component />).dive();

    expect(wrapper.props().increment).toBeDefined();
  });

  it('should emit action and update state', () => {
    const Content = ({ increment, counter }) => (
      <div>
        <button onClick={() => increment(1)}>increment</button>
        <p>{counter}</p>
      </div>
    );

    const increment = dispatch => counter =>
      dispatch({ type: SET_COUNTER, payload: counter });

    const initialState = { counter: 0 };
    const reducer = (state, action) =>
      action.type === SET_COUNTER ? { counter: action.payload } : state;

    const Component = compose(
      withReducer('state', 'dispatch', reducer, initialState),
      withActions({ increment }),
      flattenProp('state')
    )(Content);

    const wrapper = mount(<Component />);

    wrapper.find('button').simulate('click');
    expect(wrapper.find('p').text()).toBe('1');
  });
});
