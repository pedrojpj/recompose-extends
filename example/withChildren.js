import React from 'react';
import { compose, pure } from 'recompose';

import { withChildren } from '../src';

const View = ({ ComponentButton }) => <div>{ComponentButton}</div>;

export default compose(withChildren(['button']), pure)(View);
