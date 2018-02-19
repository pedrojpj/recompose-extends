import React from 'react';
import { compose, pure, withReducer } from 'recompose';

import { withActions } from '../src';

const View = ({ state, increment, decrement }) => (
  <div>
    <div className="btn-group">
      <button className="btn btn-primary" onClick={increment}>
        Increment
      </button>
      <button className="btn btn-primary" onClick={decrement}>
        Decrement
      </button>
    </div>
    <div>Counter: {state.counter}</div>
  </div>
);

const initialState = {
  counter: 0
};

const reducer = (state = initialState, action) => {
  const { type, counter } = action;

  switch (type) {
    case 'INCREMENT':
      return {
        ...state,
        counter
      };
    case 'DECREMENT':
      return {
        ...state,
        counter
      };

    default:
      return state;
  }
};

const increment = (dispatch, state) => () => {
  dispatch({ type: 'INCREMENT', counter: state.counter + 1 });
};

const decrement = (dispatch, state) => () => {
  dispatch({ type: 'DECREMENT', counter: state.counter - 1 });
};

export default compose(
  withReducer('state', 'dispatch', reducer, initialState),
  withActions({ increment, decrement }),
  pure
)(View);
