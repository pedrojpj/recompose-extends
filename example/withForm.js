import React from 'react';
import { compose, withState, withProps, pure } from 'recompose';
import { withForm } from '../src/index';

const WithForm = ({
  submitForm,
  updateForm,
  form,
  formError,
  submit,
  formFieldsWithErrors
}) => (
  <form className={formError ? 'was-validated' : null}>
    {formError && (
      <div className="alert alert-danger" role="alert">
        All fields is required
      </div>
    )}
    {submit && (
      <div className="alert alert-success" role="alert">
        The form has been sent correctly with this values:{' '}
        {JSON.stringify(form)}
      </div>
    )}
    <div className="form-group">
      <label htmlFor="email">
        Email
        <input
          type="email"
          className="form-control"
          name="email"
          required="true"
          value={form.email}
          onChange={updateForm}
          id="email"
          placeholder="Enter your email"
        />
      </label>
      {formFieldsWithErrors.includes('email') && (
        <div className="invalid-feedback" style={{ display: 'block' }}>
          Invalid Email
        </div>
      )}
    </div>
    <div className="form-group">
      <label htmlFor="name">
        Name
        <input
          type="text"
          className="form-control"
          name="name"
          required="true"
          value={form.name}
          onChange={updateForm}
          id="name"
          placeholder="Enter your name"
        />
      </label>
      {formFieldsWithErrors.includes('name') && (
        <div className="invalid-feedback" style={{ display: 'block' }}>
          This field is required
        </div>
      )}
    </div>
    <div className="form-group">
      <label htmlFor="password">
        Password
        <input
          type="password"
          className="form-control"
          name="password"
          required="true"
          value={form.password}
          onChange={updateForm}
          id="password"
          placeholder="Enter your password"
        />
      </label>
      {formFieldsWithErrors.includes('password') && (
        <div className="invalid-feedback" style={{ display: 'block' }}>
          This field is required
        </div>
      )}
    </div>

    <div className="form-group">
      <label htmlFor="interests">
        Interests
        <select
          name="interests"
          onChange={updateForm}
          multiple
          value={form.interests}
          className="form-control"
          id="interests"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>
      {formFieldsWithErrors.includes('interests') && (
        <div className="invalid-feedback" style={{ display: 'block' }}>
          This field is required
        </div>
      )}
    </div>

    <div className="form-check">
      <label className="form-check-label" htmlFor="exampleCheck1">
        <input
          type="checkbox"
          className="form-check-input"
          id="conditions"
          name="conditions"
          value={form.conditions}
          onChange={updateForm}
        />
        Check me out
      </label>
      {formFieldsWithErrors.includes('conditions') && (
        <div className="invalid-feedback" style={{ display: 'block' }}>
          This field is required
        </div>
      )}
    </div>
    <button type="submit" className="btn btn-primary" onClick={submitForm}>
      Submit
    </button>
  </form>
);

export default compose(
  withState('submit', 'setSubmit', false),
  withProps({
    name: '',
    email: ''
  }),
  withForm(
    ({ name, email }) => ({
      name: { value: name, required: true },
      email: { value: email, required: true, type: 'email' },
      password: {
        value: '',
        pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).*$'
      },
      conditions: { value: false, required: true },
      interests: { value: [], required: true }
    }),
    props => () => {
      props.setSubmit(true);
    }
  ),
  pure
)(WithForm);
