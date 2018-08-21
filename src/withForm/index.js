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

      this.originalForm = form;

      this.state = {
        form,
        formFieldsWithErrors: [],
        formError: false,
        formIsChanged: false
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

    updateAll = (form, callback) => {
      this.setState(
        () => ({
          form
        }),
        () => {
          this.validateForm();
          this.checkIfIsChanged();
          if (callback) callback();
        }
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

        const errorArray = [];

        if (element.required) {
          if (this.state.form[key] instanceof Array) {
            if (!this.state.form[key].length) {
              errorArray.push('required');
            }
          } else if (!this.state.form[key]) {
            errorArray.push('required');
          }
        }

        if (element.match) {
          if (this.state.form[key] !== this.state.form[element.match]) {
            errorArray.push('match');
          }
        }

        if (element.pattern && this.state.form[key]) {
          const pattern = new RegExp(element.pattern);
          if (!pattern.test(this.state.form[key])) {
            errorArray.push('pattern');
          }
        }

        if (element.type === 'email') {
          const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!re.test(String(this.state.form[key]).toLowerCase())) {
            errorArray.push('email');
          }
        }

        if (errorArray.length > 0) {
          this.addError(key);
          error = true;
        } else {
          this.removeError(key);
        }
      });

      return error;
    };

    updateField = (name, value, callback) => {
      let newValue;

      if (name in this.state.form) {
        if (this.state.form[name] instanceof Array) {
          if (this.state.form[name].includes(value)) {
            if (Object.values(this.state.form[name])[0] instanceof Object) {
              newValue = this.state.form[name].filter(
                item => Object.values(item)[0] === Object.valies(value)[0]
              );
            } else {
              newValue = this.state.form[name].filter(item => item !== value);
            }
          } else {
            newValue = [...this.state.form[name], value];
          }

          if (Object.values(this.state.form[name])[0] instanceof Object) {
            const checkIfExistValue = this.state.form[name].find(
              item => Object.values(item)[0] === Object.values(value)[0]
            );

            if (checkIfExistValue) {
              newValue = this.state.form[name].map(
                item =>
                  Object.values(item)[0] === Object.values(value)[0]
                    ? value
                    : item
              );
            } else {
              newValue = [...this.state.form[name], value];
            }
          }
        } else {
          newValue = value;
        }

        let customField;

        if (this.input[name].copyTo) {
          customField = {
            [name]: newValue,
            [this.input[name].copyTo]: newValue
          };
        } else {
          customField = { [name]: newValue };
        }

        this.setState(
          prevState => ({
            form: { ...prevState.form, ...customField }
          }),
          () => {
            this.validateForm();
            this.checkIfIsChanged();
            if (callback) callback();
          }
        );
      } else {
        console.warn('This field is not defined in the form');
      }
    };

    updateForm = ({ target }) => {
      const { name, value, type, checked } = target;
      let field = {};

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
      } else if (this.input[name]) {
        if (this.input[name].copyTo) {
          field = {
            [name]: value,
            [this.input[name].copyTo]: value
          };
        } else {
          field = { [name]: value };
        }
      }

      this.setState(
        prevState => ({
          form: { ...prevState.form, ...field }
        }),
        () => {
          this.validateForm();
          this.checkIfIsChanged();
        }
      );
    };

    checkIfIsChanged = () => {
      let isChanged = false;
      if (
        JSON.stringify(this.state.form) !== JSON.stringify(this.originalForm)
      ) {
        isChanged = true;
      }

      this.setState(() => ({
        formIsChanged: isChanged
      }));
    };

    clearCustomError = callback => {
      const newErrors = this.state.formFieldsWithErrors.filter(
        r => !Object.keys(this.input).includes(r)
      );

      if (newErrors.length) {
        this.setState(
          prevState => ({
            formFieldsWithErrors: prevState.formFieldsWithErrors.filter(
              error => !newErrors.includes(error)
            )
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
      const {
        form,
        formError,
        formFieldsWithErrors,
        formIsChanged
      } = this.state;
      const props = {
        ...this.props,
        form,
        formError,
        formIsChanged,
        formSetError: this.setError,
        formClearErrors: this.clearError,
        formFieldsWithErrors,
        updateField: this.updateField,
        updateForm: this.updateForm,
        updateAllForm: this.updateAll,
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
