import { mapProps } from 'recompose';

const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);

const withChildren = input =>
  mapProps(({ children, ...rest }) => {
    if (!children) {
      return { ...rest };
    }

    const componentProps = {};
    const selectChildren = Array.isArray(children) ? children : [children];

    input.map(item => {
      const elements = selectChildren.filter(i => i.type === item);
      let componentName;
      if (item instanceof Function) {
        componentName = item.displayName ? item.displayName : item.name;
      } else {
        componentName = item;
      }

      const name = `Component${capitalizeFirstLetter(componentName)}`;

      if (elements.length > 1) {
        componentProps[name] = elements;
      } else {
        const element = elements[0];
        componentProps[name] = element;
      }
      return item;
    });

    return {
      ...componentProps,
      ...rest
    };
  });

export default withChildren;
