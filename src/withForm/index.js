import { createFactory, Component } from 'react';

const withForm = (input, handlers) => BaseComponent => {
  const factory = createFactory(BaseComponent);

  class WithForm extends Component {
    constructor(props) {
      super(props);

      this.input = typeof input === 'function' ? input(props) : input;

      const form = {};
      Object.keys(this.input).forEach(key => {
        form[key] = this.input[key].value;
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

    addError = (name, callback) => {
      this.setState(
        prevState => ({
          formFieldsWithErrors: prevState.formFieldsWithErrors.includes(name)
            ? prevState.formFieldsWithErrors
            : [...prevState.formFieldsWithErrors, name]
        }),
        callback && callback()
      );
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

      Object.keys(this.input).forEach(key => {
        const element = this.input[key];

        if (element.required) {
          if (this.state.form[key] instanceof Array) {
            if (!this.state.form[key].length) {
              this.addError(key);
              error = true;
            } else {
              this.removeError(key);
            }
          } else if (!this.state.form[key]) {
            this.addError(key);
            error = true;
          } else {
            this.removeError(key);
          }
        }
        if (element.pattern && this.state.form[key]) {
          const pattern = new RegExp(element.pattern);
          if (!pattern.test(this.state.form[key])) {
            this.addError(key);
            error = true;
          } else {
            this.removeError(key);
          }
        }
        if (element.type === 'email') {
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
      let newValue;

      if (name in this.state.form) {
        if (this.state.form[name] instanceof Array) {
          if (this.state.form[name].includes(value)) {
            newValue = this.state.form[name].filter(item => item !== value);
          } else {
            newValue = [...this.state.form[name], value];
          }
        } else {
          newValue = value;
        }

        const customField = { [name]: newValue };

        this.setState(
          prevState => ({
            form: { ...prevState.form, ...customField }
          }),
          () => {
            this.validateForm();
          }
        );
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
      } else if (type === 'select-multiple') {
        field[name] = [];

        [...target.selectedOptions].map(element =>
          field[name].push(element.value)
        );
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

    clearCustomError = callback => {
      const newErrors = this.state.formFieldsWithErrors.filter(
        r => Object.keys(this.input).indexOf(r) > -1
      );

      if (newErrors.length) {
        this.setState(
          () => ({
            formFieldsWithErrors: newErrors
          }),
          callback && callback()
        );
      } else {
        callback();
      }
    };

    submitForm = event => {
      let error = false;

      this.clearCustomError(() => {
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
      });

      if (event) event.preventDefault();
    };

    resetForm = () => {
      const form = {};
      Object.keys(this.input).forEach(key => {
        form[key] = this.input[key].value;
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
