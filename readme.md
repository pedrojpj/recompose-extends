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

To use with the component withReducer, you can create props as curry functions that receive the dispatch and status by default. Similar to Redux's connect

### `withErrors()`

Adds an error handler in the component allowing you to visualize the chain of errors in debug mode or prevent the rendering of other components from failing. Similar to the componctDidCatch of React

### `withModal()`

High order component used to render another component in portal mode next to our base component. Useful for manners or tooltips






