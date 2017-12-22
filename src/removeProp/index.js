import { createFactory } from 'react';

const deleteProps = (obj, props) => {
  const res = Object.assign({}, props);
  delete res[obj];
  return res;
};

const removeProp = propName => BaseComponent => {
  const factory = createFactory(BaseComponent);

  const RemoveProp = props =>
    factory({
      ...deleteProps(propName, props)
    });
  return RemoveProp;
};

export default removeProp;
