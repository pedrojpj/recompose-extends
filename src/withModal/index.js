import { Component, createFactory } from 'react';
import { createPortal } from 'react-dom';
import { mapProps } from 'recompose';

const withModal = (
  input,
  component,
  extraProps,
  options = { includeProps: true }
) => BaseComponent => {
  const hoc = mapProps(props => {
    if (typeof extraProps === 'function') {
      return Object.assign({}, props, extraProps(props));
    }
    return Object.assign({}, props, extraProps);
  });

  const factory = createFactory(BaseComponent);
  const factoryModel = hoc(createFactory(component));

  if (!document.getElementById('modal')) {
    const modalDiv = document.createElement('div');
    modalDiv.setAttribute('id', 'modal');
    document.body.appendChild(modalDiv);
  }

  const modalRoot = document.getElementById('modal');

  class WithModal extends Component {
    constructor(props) {
      super(props);
      this.el = document.createElement('div');
    }
    componentDidMount() {
      modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
      modalRoot.removeChild(this.el);
    }
    render() {
      if (input(this.props)) {
        let model;

        console.log(options.includeProps);

        if (options.includeProps) {
          model = factoryModel(this.props);
        } else {
          model = factoryModel();
        }

        return [
          createPortal(model, this.el),
          factory({
            ...this.props,
            key: 'content'
          })
        ];
      }
      return factory({
        ...this.props
      });
    }
  }

  return WithModal;
};

export default withModal;
