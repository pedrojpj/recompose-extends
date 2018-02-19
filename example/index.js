import React from 'react';
import { render } from 'react-dom';

import WithErrors from './withErrors';
import WithModal from './withModal';
import WaitFor from './waitFor';
import WithActions from './withActions';

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
  </div>
);

render(App, document.getElementById('app'));
