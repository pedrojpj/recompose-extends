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

    updateForm = ({ target }) => {
      const { name, value } = target;

      if (!name) {
        console.warn(
          'The name attribute is required to be able to update the value'
        );
      }

      this.setState(
        prevState => ({
          form: { ...prevState.form, [name]: value }
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
        formFieldsWithErrors,
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