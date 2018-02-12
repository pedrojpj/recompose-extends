import { Component, createFactory } from 'react';
import { createPortal } from 'react-dom';
import { mapProps } from 'recompose';

const withModal = (input, component, extraProps) => BaseComponent => {
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
        return [
          createPortal(factoryModel(this.props), this.el),
          factory({
            ...this.props,
            ...this.handlers,
            key: 'content'
          })
        ];
      }
      return factory({
        ...this.props,
        ...this.handlers
      });
    }
  }

  return WithModal;
};

export default withModal;
