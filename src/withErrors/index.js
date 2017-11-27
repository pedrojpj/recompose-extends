import React, { createFactory, Component } from 'react';
import { Title, Subtitle, Content, Container, Button } from './style';

const ErrorComponent = ({ error, title, onToggle, show, debug }) => (
  <div>
    <Title>¡Hubo un error!</Title>
    {debug ? (
      <div>
        <Subtitle>{title}</Subtitle>
        <Button onClick={onToggle}>{show ? 'Ver menos' : 'Ver más'}</Button>
        <Container active={show}>
          <Content dangerouslySetInnerHTML={{ __html: error }} />
        </Container>
      </div>
    ) : (
      false
    )}
  </div>
);

const withErrors = (input = {}) => BaseComponent => {
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
