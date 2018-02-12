import { Component, createFactory } from 'react';

const waitFor = input => BaseComponent => {
  const factory = createFactory(BaseComponent);
  class WaitFor extends Component {
    constructor(props) {
      super(props);

      this.state = {
        loadResolve: false
      };
    }

    componentDidMount() {
      if (input instanceof Array) {
        const array = [];
        input.map(item => array.push(this.props[item]()));

        Promise.all(array).then(() => {
          this.setState({
            loadResolve: true
          });
        });
      } else {
        Promise.resolve(this.props[input]())
          .then(() => {
            console.log('loaded');
            this.setState({
              loadResolve: true
            });
          })
          .catch(error => {
            throw error;
          });
      }
    }

    render() {
      return this.state.loadResolve
        ? factory({
            ...this.props
          })
        : null;
    }
  }

  return WaitFor;
};

export default waitFor;
