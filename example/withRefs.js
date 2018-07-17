import React from 'react';
import { compose, pure, lifecycle } from 'recompose';

import { withRefs } from '../src/index';

const WithRefs = ({ setRef }) => (
  <button className="btn btn-primary" ref={r => setRef('button', r)}>
    Example
  </button>
);

export default compose(
  withRefs(),
  lifecycle({
    componentDidMount() {
      console.log(this.props.getRef('button'));
    }
  }),
  pure
)(WithRefs);
