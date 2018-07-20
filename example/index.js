import React from 'react';
import { render } from 'react-dom';

import WithErrors from './withErrors';
import WithCustomErrors from './withCustomError';
import WithModal from './withModal';
import WaitFor from './waitFor';
import WithActions from './withActions';
import WithForm from './withForm';
import WithRefs from './withRefs';
import WithChildren from './withChildren';

const Card = ({ title, children }) => (
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <div className="card-text">{children}</div>
    </div>
  </div>
);

const App = (
  <div className="container">
    <Card title="With Errors">
      <WithErrors />
    </Card>
    <br />
    <Card title="With Errors with custom component">
      <WithCustomErrors />
    </Card>
    <br />
    <Card title="With Modal">
      <WithModal />
    </Card>
    <br />
    <Card title="Wait for">
      <WaitFor />
    </Card>
    <br />
    <Card title="With Actions">
      <WithActions />
    </Card>
    <br />
    <Card title="With Form">
      <WithForm />
    </Card>
    <br />
    <Card title="With Refs">
      <WithRefs />
    </Card>
    <br />
    <Card title="With Children">
      <WithChildren>
        <button className="btn btn-primary">Button</button>
        <div>1</div>
      </WithChildren>
    </Card>
    <br />
  </div>
);

render(App, document.getElementById('app'));
