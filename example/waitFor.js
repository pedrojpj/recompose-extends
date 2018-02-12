import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { waitFor } from '../src/index';

const WaitFor = ({ items }) => (
  <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
);

export default compose(
  withState('items', 'setItems', []),
  withHandlers({
    loadContent: ({ setItems }) => () =>
      new Promise(
        resolve =>
          setTimeout(() => {
            const items = ['Cat', 'Dog'];
            setItems(items);
            resolve(true);
          }),
        300
      )
  }),
  waitFor('loadContent'),
  pure
)(WaitFor);
