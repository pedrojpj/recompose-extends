import React from 'react';
import {
  compose,
  withStateHandlers,
  withProps,
  withHandlers,
  pure
} from 'recompose';
import { withForm } from '../src/index';

const WithFormArray = ({
  form,
  formError,
  submit,
  addProduct,
  updateNewProduct,
  newProduct,
  deleteProduct
}) => (
  <form className={formError ? 'was-validated' : null}>
    {formError && (
      <div className="alert alert-danger" role="alert">
        All fields is required
      </div>
    )}
    {submit && (
      <div className="alert alert-success" role="alert">
        The form has been sent correctly with this values:{' '}
        {JSON.stringify(form)}
      </div>
    )}

    <ul className="list-group">
      {form.products.map(item => (
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          {item.name}{' '}
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => deleteProduct(item)}
          >
            Delete product
          </button>
        </li>
      ))}
    </ul>

    <br />

    <h2>Add product</h2>

    <div className="form-group">
      <label htmlFor="product">
        Product
        <input
          type="product"
          className="form-control"
          name="product"
          required="true"
          value={newProduct}
          onChange={updateNewProduct}
          id="product"
          placeholder="product"
        />
      </label>
    </div>
    <button type="button" className="btn btn-primary" onClick={addProduct}>
      Add
    </button>
  </form>
);

export default compose(
  withStateHandlers(
    {
      newProduct: ''
    },
    {
      updateNewProduct: () => event => ({ newProduct: event.target.value }),
      clearNewProduct: () => () => ({ newProduct: '' })
    }
  ),
  withProps({
    products: [{ id: 1, name: 'Switch' }, { id: 2, name: 'Playstation 4' }]
  }),
  withForm(
    ({ products }) => ({
      products: { value: products }
    }),
    props => () => {
      props.setSubmit(true);
    }
  ),
  withHandlers({
    addProduct: ({ updateField, newProduct, clearNewProduct }) => () => {
      updateField('products', { id: 3, name: newProduct });
      clearNewProduct();
    },
    deleteProduct: ({ updateField }) => product => {
      console.log(product);
      updateField('products', product);
    }
  }),
  pure
)(WithFormArray);
