import { createFactory, Component } from 'react';

const withForm = (input, handlers) => BaseComponent => {
  const factory = createFactory(BaseComponent);

  class WithForm extends Component {
    constructor(props) {
      super(props);

      const form = {};
      Object.keys(input).forEach(key => {
        form[key] = input[key].value;
      });

      this.state = {
        form,
        formFieldsWithErrors: [],
        formError: false
      };
    }

    setError = name => {
      this.addError(name);
      this.setState(() => ({
        formError: true
      }));
    };

    clearError = () => {
      this.setState(() => ({
        formFieldsWithErrors: [],
        formError: false
      }));
    };

    addError = name => {
      this.setState(prevState => ({
        formFieldsWithErrors: prevState.formFieldsWithErrors.includes(name)
          ? prevState.formFieldsWithErrors
          : [...prevState.formFieldsWithErrors, name]
      }));
    };

    removeError = name => {
      this.setState(prevState => ({
        formFieldsWithErrors: prevState.formFieldsWithErrors.filter(
          item => item !== name
        )
      }));
    };

    validateForm = () => {
      let error = false;

      Object.keys(input).forEach(key => {
        if (input[key].required) {
          if (!this.state.form[key]) {
            this.addError(key);
            error = true;
          } else {
            this.removeError(key);
          }
        }

        if (input[key].pattern) {
          const pattern = new RegExp(input[key].pattern);
          if (!pattern.test(this.state.form[key])) {
            this.addError(key);
            error = true;
          } else {
            this.removeError(key);
          }
        }

        if (input[key].type === 'email') {
          const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!re.test(String(this.state.form[key]).toLowerCase())) {
            this.addError(key);
            error = true;
          } else {
            this.removeError(key);
          }
        }
      });

      return error;
    };

    updateField = (name, value) => {
      const customField = { [name]: value };

      if (name in this.state.form) {
        this.setState(prevState => ({
          form: { ...prevState.form, ...customField }
        }));
      } else {
        console.warn('This field is not defined in the form');
      }
    };

    updateForm = ({ target }) => {
      const { name, value, type, checked } = target;
      const field = {};

      if (!name) {
        console.warn(
          'The name attribute is required to be able to update the value'
        );
      }

      if (type === 'checkbox') {
        if (
          value === 'false' ||
          value === 'true' ||
          value === false ||
          value === true
        ) {
          field[name] = checked;
        } else if (checked) {
          field[name] = value;
        } else {
          field[name] = '';
        }
      } else {
        field[name] = value;
      }

      this.setState(
        prevState => ({
          form: { ...prevState.form, ...field }
        }),
        () => {
          this.validateForm();
        }
      );
    };

    submitForm = event => {
      let error = false;

      if (this.validateForm()) {
        error = true;
      }

      if (this.state.formFieldsWithErrors.length) {
        error = true;
      }

      if (!error) {
        if (handlers) {
          this.handlers(this.state.form);
        }
        this.setState(() => ({
          formError: false
        }));
      } else {
        this.setState(() => ({
          formError: true
        }));
      }

      event.preventDefault();
    };

    resetForm = () => {
      const form = {};
      Object.keys(input).forEach(key => {
        form[key] = input[key].value;
      });

      this.setState(() => ({
        form,
        formError: false
      }));
    };

    render() {
      const { form, formError, formFieldsWithErrors } = this.state;
      const props = {
        ...this.props,
        form,
        formError,
        formSetError: this.setError,
        formClearErrors: this.clearError,
        formFieldsWithErrors,
        updateField: this.updateField,
        updateForm: this.updateForm,
        submitForm: this.submitForm,
        resetForm: this.resetForm
      };

      if (handlers) {
        this.handlers =
          typeof handlers === 'function' ? handlers(props) : handlers;
      }

      return factory({
        ...props
      });
    }
  }
  return WithForm;
};

export default withForm;
