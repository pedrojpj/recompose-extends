import React, { createFactory, Component } from 'react';

const style = {
  title: {
    color: 'Crimson',
    fontSize: '18px',
    lineHeight: '22px',
    textAlign: 'center',
    margin: '0 0 5px 0',
    padding: '0'
  },
  button: {
    border: '0',
    background: 'transparent',
    fontWeight: 'bold',
    color: 'Crimson',
    textDecoration: 'underline',
    outline: '0',
    marginBottom: '5px'
  },
  subtitle: {
    color: 'Black',
    fontSize: '14px',
    lineHeight: '16px',
    textAlign: 'center',
    margin: '0 0 10px 0',
    padding: '0'
  },
  content: {
    color: 'Crimson',
    fontSize: '12px',
    lineHeight: '14px',
    fontWeight: 'light',
    textAlign: 'left',
    padding: '10px'
  },
  container: {
    background: 'GhostWhite',
    padding: 0,
    borderRadius: '5px',
    position: 'relative',
    overflow: 'hidden',
    maxHeight: '0',
    transition: 'all 500ms ease'
  },
  containerActive: {
    background: 'GhostWhite',
    padding: 0,
    borderRadius: '5px',
    position: 'relative',
    overflow: 'hidden',
    maxHeight: '500px',
    transition: 'all 500ms ease'
  }
};

const ErrorComponent = ({ error, title, onToggle, show, debug }) => (
  <div>
    <h3 style={style.title}>There was a mistake!</h3>
    {debug ? (
      <div>
        <h4 style={style.subtitle}>{title}</h4>
        <button style={style.button} onClick={onToggle}>
          {show ? 'See less' : 'See more'}
        </button>
        <div style={show ? style.containerActive : style.container}>
          <div
            style={style.content}
            dangerouslySetInnerHTML={{ __html: error }}
          />
        </div>
      </div>
    ) : (
      false
    )}
  </div>
);

const withErrors = (input = {}, component) => BaseComponent => {
  const factoryError = createFactory(component);
  const factory = createFactory(BaseComponent);

  class withErrorClass extends Component {
    constructor() {
      super();

      this.state = {
        hasError: false,
        errorTitle: null,
        errorInfo: null,
        showInfo: false,
        debug: Object.prototype.hasOwnProperty.call(input, 'debug')
          ? input.debug
          : process.env.NODE_ENV === 'development'
      };
    }

    onToggle = () => {
      this.setState(prevState => ({
        showInfo: !prevState.showInfo
      }));
    };

    componentDidCatch(error, info) {
      this.setState({
        hasError: true,
        errorTitle: `${error.name}: ${error.message}`,
        errorInfo: error.stack.replace(/(?:\r\n|\r|\n)/g, '<br />')
      });

      if (input.callback) input.callback(error, info);
    }

    render() {
      const { errorTitle, errorInfo, showInfo, debug } = this.state;

      if (this.state.hasError) {
        if (component) {
          return factoryError({
            ...this.props,
            error: errorInfo,
            title: errorTitle,
            debug
          });
        }
        return (
          <ErrorComponent
            title={errorTitle}
            error={errorInfo}
            show={showInfo}
            onToggle={this.onToggle}
            debug={debug}
          />
        );
      }
      return factory({
        ...this.props,
        ...this.handlers
      });
    }
  }

  return withErrorClass;
};

export default withErrors;
