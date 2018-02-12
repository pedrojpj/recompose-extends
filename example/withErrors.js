import React from 'react';
import { compose, pure } from 'recompose';
import { withErrors } from '../src/index';

const WithErrors = ({ example }) => <div>{example()}</div>;

export default compose(withErrors({ debug: true }), pure)(WithErrors);
