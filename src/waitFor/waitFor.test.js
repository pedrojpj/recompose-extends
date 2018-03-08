import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { compose } from 'recompose';
import Adapter from 'enzyme-adapter-react-16';

import waitFor from '.';

jest.useFakeTimers();

Enzyme.configure({ adapter: new Adapter() });

const loadContentPromise = () => () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 200);
  });

describe('Wait For', () => {
  it('should render with promise resolve true', async () => {
    jest.runAllTimers();
    const Component = () => <div>loaded</div>;
    const EnhanceComponent = compose(waitFor('loadContent'))(Component);

    const wrapper = mount(
      <EnhanceComponent loadContent={loadContentPromise} />
    );

    await loadContentPromise();

    expect(wrapper.text()).toBe('loaded');
  });

  it('should render with multiple promise resolve true', async () => {
    jest.runAllTimers();
    const Component = () => <div>loaded</div>;
    const EnhanceComponent = compose(
      waitFor(['loadContent', 'loadOtherContent'])
    )(Component);

    const wrapper = mount(
      <EnhanceComponent
        loadContent={loadContentPromise}
        loadOtherContent={loadContentPromise}
      />
    );

    await loadContentPromise();
    await loadContentPromise();

    expect(wrapper.text()).toBe('loaded');
  });

  it('should not render because the promise not loaded', done => {
    jest.runAllTimers();
    const Component = () => <div>Loaded</div>;
    const EnhanceComponent = compose(waitFor('loadContent'))(Component);

    const wrapper = mount(
      <EnhanceComponent loadContent={loadContentPromise} />
    );

    expect(wrapper.html()).toBeNull();
    done();
  });
});
