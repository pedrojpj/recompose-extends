import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { compose, withStateHandlers } from 'recompose';
import Adapter from 'enzyme-adapter-react-16';

import withRefs from '.';

Enzyme.configure({ adapter: new Adapter() });

describe('With Refs', () => {
  it('render with content', () => {
    const Content = ({ setRef, onClick }) => (
      <div>
        <div ref={e => setRef('div', e)}>Content</div>
        <button onClick={() => onClick('div')}>Click</button>
      </div>
    );

    const Component = compose(
      withRefs(),
      withStateHandlers(
        { exists: false },
        {
          onClick: ({ exists }, { getRef }) => value => {
            console.log(exists);
            if (getRef(value)) {
              return { exists: true };
            }

            return { exists: false };
          }
        }
      )
    )(Content);
    const wrapper = mount(<Component />);

    wrapper.find(Content);
    wrapper.find('button').simulate('click');

    expect(wrapper.find(Content).props().exists).toBeTruthy();
  });
});
