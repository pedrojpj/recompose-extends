import React from 'react';
import { compose, withState, pure } from 'recompose';
import { withForm } from '../src/index';

const WithForm = ({ submitForm, updateForm, form, formError, submit }) => (
  <form>
    {formError && (
      <div className="alert alert-danger" role="alert">
        All fields is required
      </div>
    )}
    {submit && (
      <div className="alert alert-success" role="alert">
        The form has been sent correctly
      </div>
    )}
    <div className="form-group">
      <label htmlFor="email">
        Email
        <input
          type="email"
          className="form-control"
          name="email"
          value={form.email}
          onChange={updateForm}
          id="email"
          placeholder="Enter your email"
        />
      </label>
    </div>
    <div className="form-group">
      <label htmlFor="name">
        Name
        <input
          type="text"
          className="form-control"
          name="name"
          value={form.name}
          onChange={updateForm}
          id="name"
          placeholder="Enter your name"
        />
      </label>
    </div>
    <button type="submit" className="btn btn-primary" onClick={submitForm}>
      Submit
    </button>
  </form>
);

export default compose(
  withState('submit', 'setSubmit', false),
  withForm(
    {
      name: { value: '', required: true },
      email: { value: '', required: true }
    },
    props => () => {
      props.setSubmit(true);
      props.resetForm();
    }
  ),
  pure
)(WithForm);
