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
        formError: false
      };
    }

    updateForm = ({ target }) => {
      const { name, value } = target;

      if (!name) {
        console.warn(
          'The name attribute is required to be able to update the value'
        );
      }

      this.setState(prevState => ({
        form: { ...prevState.form, [name]: value }
      }));
    };

    submitForm = event => {
      let error = false;

      Object.keys(input).forEach(key => {
        if (input[key].required) {
          if (!this.state.form[key]) {
            error = true;
          }
        }
      });

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
      const { form, formError } = this.state;
      const props = {
        ...this.props,
        form,
        formError,
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
