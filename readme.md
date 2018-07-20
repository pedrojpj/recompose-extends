## Recompose Extends
-----


[![build status](https://img.shields.io/travis/pedrojpj/recompose-extends/master.svg?style=flat-square)](https://travis-ci.org/pedrojpj/recompose-extends)
[![coverage](https://img.shields.io/codecov/c/github/pedrojpj/recompose-extends.svg?style=flat-square)](https://codecov.io/github/pedrojpj/recompose-extends)
[![code climate](https://img.shields.io/codeclimate/github/pedrojpj/recompose-extends.svg?style=flat-square)](https://codeclimate.com/github/pedrojpj/recompose-extends)
[![npm version](https://img.shields.io/npm/v/recompose-extends.svg?style=flat-square)](https://www.npmjs.com/package/recompose-extends)
[![npm downloads](https://img.shields.io/npm/dm/recompose-extends.svg?style=flat-square)](https://www.npmjs.com/package/recompose-extends)

Recompose Extends is a set of utilities that extends the functionality of the Recompose library

```
npm install recompose-extends --save
```

## Demo

You can see examples of the library at the following url:

https://pedrojpj.github.io/recompose-extends/


## Higher-order components
### `removeProp()`

```js
const enhance = compose(withProps({ counter: 0 }), removeProp('counter'))
const Counter = enhance(({ counter }) =>
  <div>
    Count: {counter}
  </div>
)
```

Eliminates props that are not going to be used by the inferior components


### `waitFor()`

```js

const View = () => <div>Loaded</div>;

const loadPromise = () => new Promise(resolve => {
  setTimeout => (() => resolve(true), 3000)
})

const enhance = compose(
  withProps({ promise: loadPromise()}),
  waitFor(['promise']))
  (View)
```

Wait for one or more promises before rendering the component

### `withActions()`

```js

export default compose(
  withReducer('state', 'dispatch', reducer, initialState),
  withActions({ increment, decrement }),
  pure
)(View);

```

To use with the component withReducer, you can create props as curry functions that receive the dispatch and status by default. Similar to Redux's connect

### `withErrors()`

```js

const WithErrors = ({ example }) => <div>{example()}</div>;

export default compose(withErrors({ debug: true }), pure)(WithErrors);

```

Adds an error handler in the component allowing you to visualize the chain of errors in debug mode or prevent the rendering of other components from failing. Similar to the componctDidCatch of React

### `withModal()`

```js

export default compose(
  withState('modal', 'setModal', false),
  withModal(({ modal }) => modal, Modal, ({ setModal }) => ({
    onClose: () => setModal(false)
  })),
  pure
)(WithModal);

```

High order component used to render another component in portal mode next to our base component. Useful for manners or tooltips

### `withForm()`

```js

const Form = ({ form, updateForm, submitForm }) => (
  <form>
    <input type="text" name="name" value={form.name} onChange={updateForm} />
    <button type="submit" onClick={submitForm}>
      Send
    </button>
  </form>
);

const enhance = compose(
  withForm(
    {
      name: { value: '', required: true }
    },
    () => () => {
      console.log('form submitted');
    }
  )
)(Form);

```

High order component that allows to manage a form, includes validation of required fields

### `withRefs()`

```js

const WithRefs = ({ setRef }) => (
  <button className="btn btn-primary" ref={r => setRef('button', r)}>
    Example
  </button>
);

export default compose(
  withRefs(),
  lifecycle({
    componentDidMount() {
      console.log(this.props.getRef('button'));
    }
  }),
  pure
)(WithRefs);


```

High order component for easy access to React refs using recompose

### `withChildren()`

```js

const Component = ({ ComponentButton }) => <div>{ComponentButton}</div>;


const WithChildren = compose(
  withChildren(['button]),
)(Component);


<WithChildren><button>Example</button><div /></WithChildren>


```

High order component for to filter and select children, destroy the children by building a prop for each of the selected children to place them in the parent as you wish







