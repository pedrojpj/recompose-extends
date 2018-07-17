import { Component, createFactory } from 'react';

class RefsStore {
  store(name, value) {
    this[name] = value;
  }

  get(name) {
    return this[name];
  }
}

const withRefs = () => BaseComponent => {
  const factory = createFactory(BaseComponent);

  class WithRefs extends Component {
    constructor() {
      super();

      this.refsStore = new RefsStore();
    }

    setRef = (name, element) => {
      this.refsStore.store(name, element);
    };

    getRef = name => this.refsStore.get(name);

    render() {
      const props = {
        ...this.props,
        setRef: this.setRef,
        getRef: this.getRef
      };

      return factory({
        ...props
      });
    }
  }

  return WithRefs;
};

export default withRefs;
