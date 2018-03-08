import React from 'react';
import { compose, pure } from 'recompose';
import { withErrors } from '../src/index';

const WithErrors = ({ example }) => <div>{example()}</div>;

const CustomError = () => (
  <div className="alert alert-danger" role="alert">
    <strong>Oh snap!</strong> Change a few things up and try submitting again.
  </div>
);

export default compose(withErrors({ debug: true }, CustomError), pure)(
  WithErrors
);
