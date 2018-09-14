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
      withForm({ elements: { value: [], required: true } })(Button)
    );

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

  it('should add with updateField a element to array of objects', () => {
    const Form = ({ form }) => (
      <div>{form.elements[2] && form.elements[2].value}</div>
    );

    const Component = compose(
      withForm({
        elements: {
          value: [{ id: 1, value: 1 }, { id: 2, value: 2 }],
          required: true
        }
      }),
      withHandlers({
        updateFieldObject: ({ updateField }) => () => {
          updateField('elements', { id: 3, value: 4 });
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

    expect(wrapper.find('div').html()).toContain('4');
  });

  it('should test that the form has changed', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input name="name" value={form.name} onChange={updateForm} />
        <button type="submit" onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withForm({ name: { value: 'Peter', required: true } }),
      withHandlers({
        checkChanged: ({ formIsChanged }) => () => formIsChanged
      })
    )(Form);

    const wrapper = mount(<Component />);
    const event = { target: { name: 'name', value: 'Thomas' } };
    expect(wrapper.find(Form).props().formIsChanged).toBeFalsy();
    wrapper.find('input').simulate('change', event);
    expect(wrapper.find(Form).props().formIsChanged).toBeTruthy();
    const newEvent = { target: { name: 'name', value: 'Peter' } };
    wrapper.find('input').simulate('change', newEvent);
    expect(wrapper.find(Form).props().formIsChanged).toBeFalsy();
  });

  it('should match the value of the two fields', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input name="password" value={form.password} onChange={updateForm} />
        <input
          name="repeatPassword"
          value={form.repeatPassword}
          onChange={updateForm}
        />
        <button type="submit" onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withForm({
        password: { value: '', required: true, match: 'repeatPassword' },
        repeatPassword: { value: '', required: true, match: 'password' }
      }),
      withHandlers({
        checkChanged: ({ formIsChanged }) => () => formIsChanged
      })
    )(Form);

    let event;

    const wrapper = mount(<Component />);
    event = { target: { name: 'password', value: '1234' } };
    wrapper.find('input[name="password"]').simulate('change', event);
    expect(wrapper.find(Form).props().formFieldsWithErrors).toHaveLength(2);
    event = { target: { name: 'repeatPassword', value: '1234' } };
    wrapper.find('input[name="repeatPassword"]').simulate('change', event);
    expect(wrapper.find(Form).props().formFieldsWithErrors).toHaveLength(0);
    event = { target: { name: 'password', value: '123' } };
    wrapper.find('input[name="password"]').simulate('change', event);
    expect(wrapper.find(Form).props().formFieldsWithErrors).toHaveLength(2);
  });

  it('should copy the value from one input to another', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input name="name" value={form.name} onChange={updateForm} />
        <input name="copyName" value={form.copyName} onChange={updateForm} />
        <button type="submit" onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withForm({
        name: { value: '', required: true, copyTo: 'copyName' },
        copyName: { value: '', required: true }
      })
    )(Form);

    let event;

    const wrapper = mount(<Component />);
    event = { target: { name: 'name', value: 'Example' } };
    wrapper.find('input[name="name"]').simulate('change', event);
    expect(wrapper.find(Form).props().form.name).toBe('Example');
    expect(wrapper.find(Form).props().form.copyName).toBe('Example');
    event = { target: { name: 'copyName', value: 'Example2' } };
    wrapper.find('input[name="copyName"]').simulate('change', event);
    expect(wrapper.find(Form).props().form.name).toBe('Example');
    expect(wrapper.find(Form).props().form.copyName).toBe('Example2');
  });

  it('should update all form', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input name="name" value={form.name} onChange={updateForm} />
        <input name="email" value={form.email} onChange={updateForm} />
        <button type="submit" onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withForm({
        name: { value: 'example', required: true },
        email: { value: 'example@example.com', required: true }
      }),
      withHandlers({
        update: ({ updateAllForm }) => () => {
          const form = {
            name: 'not-example',
            email: 'not-email@email.com'
          };

          updateAllForm(form);
        }
      })
    )(Form);

    const wrapper = mount(<Component />);

    expect(wrapper.find(Form).props().form.name).toBe('example');
    expect(wrapper.find(Form).props().form.email).toBe('example@example.com');

    wrapper
      .find(Form)
      .props()
      .update();

    wrapper.update();

    expect(wrapper.find(Form).props().form.name).toBe('not-example');
    expect(wrapper.find(Form).props().form.email).toBe('not-email@email.com');
  });

  it('should emit event error', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input name="name" value={form.name} onChange={updateForm} />
        <input name="email" value={form.email} onChange={updateForm} />
        <button type="submit" onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withState('error', 'setError', false),
      withForm(
        {
          name: { value: '', required: true },
          email: { value: '', required: true }
        },
        () => {},
        props => () => {
          props.setError(true);
        }
      )
    )(Form);

    const wrapper = mount(<Component />);

    const event = { target: { name: 'name', value: 'Example' } };
    wrapper.find('input[name="name"]').simulate('change', event);

    expect(wrapper.find(Form).props().error).toBeFalsy();
    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(wrapper.find(Form).props().error).toBeTruthy();
  });

  it('should be able to change dynamically whether a field is required or not', () => {
    const Form = ({ form, updateForm, submitForm }) => (
      <form>
        <input name="name" value={form.name} onChange={updateForm} />
        <button type="submit" onClick={submitForm} />
      </form>
    );

    const Component = compose(
      withForm({
        name: { value: '', required: true }
      }),
      withHandlers({
        isNotRequired: ({ updateRequired }) => () => {
          updateRequired('name', false);
        }
      })
    )(Form);

    const wrapper = mount(<Component />);

    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(wrapper.find(Form).props().formError).toBeTruthy();
    wrapper
      .find(Form)
      .props()
      .isNotRequired();
    wrapper.update();
    wrapper.find('button').simulate('click');
    wrapper.update();

    expect(wrapper.find(Form).props().formError).toBeFalsy();
  });
});
