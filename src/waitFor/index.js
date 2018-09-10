import { Component, createFactory } from 'react';

const waitFor = (input, loadingComponent) => BaseComponent => {
  const factory = createFactory(BaseComponent);
  const factoryLoading = createFactory(loadingComponent);

  class WaitFor extends Component {
    constructor(props) {
      super(props);

      this.state = {
        loadResolve: false
      };
    }

    componentWillMount() {
      this.loadFunction();
    }

    loadFunction = () => {
      if (input instanceof Array) {
        const array = [];
        input.map(item => array.push(this.props[item]()));

        Promise.all(array).then(() => {
          this.setState(() => ({
            loadResolve: true
          }));
        });
      } else {
        Promise.resolve(this.props[input]())
          .then(() => {
            this.setState(() => ({
              loadResolve: true
            }));
          })
          .catch(error => {
            throw error;
          });
      }
    };

    render() {
      if (!this.state.loadResolve && loadingComponent) {
        return factoryLoading();
      }

      return this.state.loadResolve
        ? factory({
            ...this.props,
            waitForIsLoad: this.state.loadResolve
          })
        : null;
    }
  }

  return WaitFor;
};

export default waitFor;
