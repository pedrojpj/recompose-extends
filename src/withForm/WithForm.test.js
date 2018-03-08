import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { compose, withState } from 'recompose';

import withForm from '.';

Enzyme.configure({ adapter: new Adapter() });

describe('With Form', () => {
  it('should change the value of a form field', () => {
    const Form = ({ form, updateForm }) => (
      <form>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={updateForm}
        />{' '}
      </form>
    );

    const Component = withForm({ name: { value: '' } })(Form);
    const wrapper = mount(<Component />);

    wrapper
      .find('input')
      .simulate('change', { target: { value: 'text', name: 'name' } });

    expect(wrapper.find(Form).props().form.name).toBe('text');
  });

  it('should not change the value of the input when the name attribute is missing', () => {
    const Form = ({ form, updateForm }) => (
      <form>
        <input type="text" value={form.name} onChange={updateForm} />
      </form>
    );

    const Component = withForm({ name: { value: '' } })(Form);
    const wrapper = mount(<Component />);

    wrapper.find('input').simulate('change', { target: { value: 'text' } });

    expect(wrapper.find(Form).props().form.name).toBe('');
  });

  it('Should not be valid if you do not send the required fields', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={updateForm}
        />
        <button onClick={submitForm} />
      </form>
    );

    const Component = withForm({ name: { value: '', required: true } })(Form);
    const wrapper = mount(<Component />);

    expect(wrapper.find(Form).props().formError).toBeFalsy();
    wrapper.find('button').simulate('click');
    expect(wrapper.find(Form).props().formError).toBeTruthy();
  });

  it('Should submit the form and dispatch the handler', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={updateForm}
        />
        <button onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withState('submit', 'setSubmit', false),
      withForm({ name: { value: '' } }, ({ setSubmit }) => () => {
        setSubmit(true);
      })
    )(Form);

    const wrapper = mount(<Component />);
    wrapper
      .find('input')
      .simulate('change', { target: { value: 'text', name: 'name' } });
    wrapper.find('button').simulate('click');

    expect(wrapper.find(Form).props().submit).toBeTruthy();
  });

  it('should reset the values of the form', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={updateForm}
        />
        <button onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withState('submit', 'setSubmit', false),
      withForm({ name: { value: '' } }, ({ setSubmit, resetForm }) => () => {
        setSubmit(true);
        resetForm();
      })
    )(Form);

    const wrapper = mount(<Component />);
    wrapper
      .find('input')
      .simulate('change', { target: { value: 'text', name: 'name' } });

    expect(wrapper.find(Form).props().form.name).toBe('text');
    wrapper.find('button').simulate('click');
    expect(wrapper.find(Form).props().form.name).toBe('');
  });

  it('should validate the form when I add a password field with a pattern', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={updateForm}
        />
        <button onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withState('submit', 'setSubmit', false),
      withForm(
        {
          password: {
            value: '',
            pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).*$'
          }
        },
        ({ setSubmit, resetForm }) => () => {
          setSubmit(true);
          resetForm();
        }
      )
    )(Form);

    const wrapper = mount(<Component />);

    wrapper.find('input').simulate('change', {
      target: { value: 'example', name: 'password' }
    });

    expect(wrapper.find(Form).props().form.password).toBe('example');
    wrapper.find('button').simulate('click');
    expect(wrapper.find(Form).props().formFieldsWithErrors).toContain(
      'password'
    );

    wrapper.find('input').simulate('change', {
      target: { value: 'examplePass12', name: 'password' }
    });

    wrapper.find('button').simulate('click');

    expect(wrapper.find(Form).props().formFieldsWithErrors).toHaveLength(0);
  });

  it('should invalidate the form when adding an email field without email formatting', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={updateForm}
        />
        <button onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withState('submit', 'setSubmit', false),
      withForm(
        { email: { value: '', type: 'email' } },
        ({ setSubmit, resetForm }) => () => {
          setSubmit(true);
          resetForm();
        }
      )
    )(Form);

    const wrapper = mount(<Component />);

    wrapper.find('input').simulate('change', {
      target: { value: 'text', name: 'email', type: 'email' }
    });

    expect(wrapper.find(Form).props().form.email).toBe('text');
    wrapper.find('button').simulate('click');
    expect(wrapper.find(Form).props().formFieldsWithErrors).toContain('email');
  });

  it('should be able to add an error from the component', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={updateForm}
        />
        <button onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withState('submit', 'setSubmit', false),
      withForm(
        { name: { value: '', required: true } },
        ({ formSetError }) => () => {
          formSetError('name');
        }
      )
    )(Form);

    const wrapper = mount(<Component />);

    wrapper.find('input').simulate('change', {
      target: { value: 'text', name: 'name' }
    });

    wrapper.find('button').simulate('click');

    expect(wrapper.find(Form).props().formError).toBe(false);
    wrapper.find('button').simulate('click');
    expect(wrapper.find(Form).props().formError).toBe(true);
  });
});
