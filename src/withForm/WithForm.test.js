import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { compose, withState, withHandlers } from 'recompose';

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

    const Component = withForm({ namae: { value: '' } })(Form);
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
      ),
      withHandlers({
        addError: ({ formSetError }) => () => {
          formSetError('name');
        },
        checkErrors: ({ formFieldsWithErrors }) => () => formFieldsWithErrors
      })
    )(Form);

    const wrapper = mount(<Component />);

    wrapper.find('input').simulate('change', {
      target: { value: 'text', name: 'name' }
    });

    wrapper.find('button').simulate('click');

    expect(wrapper.find(Form).props().formError).toBe(false);
    wrapper
      .find(Form)
      .props()
      .addError();
    expect(
      wrapper
        .find(Form)
        .props()
        .checkErrors()
    ).toContain('name');
  });

  it('should check the input checkbox and marked value as true', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input
          type="checkbox"
          name="check"
          value={form.check}
          onChange={updateForm}
        />
        <button onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withForm({ check: { value: false, required: true } })
    )(Form);

    const wrapper = mount(<Component />);

    wrapper.find('input').simulate('change', {
      target: { name: 'check', type: 'checkbox', checked: true, value: 'false' }
    });

    expect(wrapper.find(Form).props().form.check).toBe(true);
  });

  it('should check the input checkbox and marked value as the assign value', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input
          type="checkbox"
          name="check"
          value={form.check}
          onChange={updateForm}
        />
        <button onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withForm({ check: { value: 'example', required: true } })
    )(Form);

    const wrapper = mount(<Component />);

    wrapper.find('input').simulate('change', {
      target: {
        name: 'check',
        type: 'checkbox',
        checked: false,
        value: 'example'
      }
    });

    expect(wrapper.find(Form).props().form.check).toBe('');

    wrapper.find('input').simulate('change', {
      target: {
        name: 'check',
        type: 'checkbox',
        checked: true,
        value: 'example'
      }
    });

    expect(wrapper.find(Form).props().form.check).toBe('example');
  });

  it('should update value of a field with updateField func', () => {
    const Form = ({ form, updateForm, updateField }) => (
      <form>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={updateForm}
        />
        <button type="button" onClick={() => updateField('name', 'example')} />
      </form>
    );

    const Component = compose(
      withForm({ name: { value: '', required: true } })
    )(Form);

    const wrapper = mount(<Component />);
    wrapper.find('button').simulate('click');

    expect(wrapper.find(Form).props().form.name).toBe('example');
  });

  it('should not maintain any fields since they do not exist in the form', () => {
    const Form = ({ form, updateForm, updateField }) => (
      <form>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={updateForm}
        />
        <button type="button" onClick={() => updateField('email', 'example')} />
      </form>
    );

    const Component = compose(
      withForm({ name: { value: '', required: true } })
    )(Form);

    const wrapper = mount(<Component />);
    wrapper.find('button').simulate('click');

    expect(wrapper.find(Form).props().form.name).toBe('');
  });

  it('should add values to an array type field', () => {
    const Button = ({ updateField }) => (
      <button onClick={() => updateField('elements', 1)} />
    );

    const Component = compose(withForm({ elements: { value: [] } }))(Button);
    const wrapper = mount(<Component />);
    wrapper.find('button').simulate('click');
    expect(wrapper.find(Button).props().form.elements).toContain(1);
  });

  it('should remove values to an array type field', () => {
    const Button = ({ updateField }) => (
      <button onClick={() => updateField('elements', 1)} />
    );

    const Component = compose(withForm({ elements: { value: [1] } }))(Button);
    const wrapper = mount(<Component />);
    wrapper.find('button').simulate('click');
    expect(wrapper.find(Button).props().form.elements).toHaveLength(0);
  });

  it('should invalidate form with fields with value array empty', () => {
    const Button = ({ submitForm }) => <button onClick={submitForm} />;

    const Component = compose(
      withForm({ elements: { value: [], required: true } })
    )(Button);

    const wrapper = mount(<Component />);
    wrapper.find('button').simulate('click');
    expect(wrapper.find(Button).props().formError).toBeTruthy();
  });

  it('should test select multiple', () => {
    const Form = ({ form, updateForm }) => (
      <form>
        <select
          multiple
          name="elements"
          value={form.elements}
          onChange={updateForm}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
      </form>
    );

    const Component = compose(
      withForm({ elements: { value: [], required: true } })
    )(Form);

    const wrapper = mount(<Component />);

    wrapper
      .find(Form)
      .find('select')
      .simulate('change', {
        target: {
          type: 'select-multiple',
          value: 1,
          name: 'elements',
          selectedOptions: [{ value: 1 }]
        }
      });

    expect(wrapper.find(Form).props().form.elements).toContain(1);
  });

  it('should add a custom error and then remove it when submitting form', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input name="name" value={form.name} onChange={updateForm} />
        <button type="submit" onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withForm({ elements: { value: [], required: true } }),
      withHandlers({
        addCustomError: ({ formSetError }) => () => {
          formSetError('invalid');
        },
        checkError: ({ formFieldsWithErrors }) => () => formFieldsWithErrors
      })
    )(Form);

    const wrapper = mount(<Component />);

    wrapper
      .find(Form)
      .props()
      .addCustomError();

    expect(
      wrapper
        .find(Form)
        .props()
        .checkError()
    ).toContain('invalid');

    wrapper
      .find(Form)
      .props()
      .submitForm();

    expect(
      wrapper
        .find(Form)
        .props()
        .checkError()
    ).toContain('elements');
  });

  it('should update with updateField array of objects', () => {
    const Form = ({ form }) => <div>{form.elements[0].value}</div>;

    const Component = compose(
      withForm({
        elements: {
          value: [{ id: 1, value: 1 }, { id: 2, value: 2 }],
          required: true
        }
      }),
      withHandlers({
        updateFieldObject: ({ updateField }) => () => {
          updateField('elements', { id: 1, value: 3 });
        },
        submit: ({ submitForm }) => () => {
          submitForm();
        }
      })
    )(Form);

    const wrapper = mount(<Component />);

    wrapper
      .find(Form)
      .props()
      .updateFieldObject();

    wrapper
      .find(Form)
      .props()
      .submit();

    expect(wrapper.find('div').html()).toContain('3');
  });
});
