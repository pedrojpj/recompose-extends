import { mapProps } from 'recompose';

const withActions = handlers =>
  mapProps(({ dispatch, state, ...rest }) => {
    const actions = {};
    if (!dispatch && !state) {
      throw new Error('state and dispatch props are required');
    }

    Object.keys(handlers).forEach(key => {
      actions[key] =
        typeof handlers[key] === 'function'
          ? handlers[key](dispatch, state)
          : handlers[key];
    });

    return {
      dispatch,
      state,
      ...actions,
      ...rest
    };
  });

export default withActions;
