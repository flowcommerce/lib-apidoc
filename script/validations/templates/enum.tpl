import validateEnum from '../../utilities/validate-enum';

// eslint-disable-next-line quotes,key-spacing,comma-spacing,max-len,quote-props,object-curly-spacing
const spec = <%= JSON.stringify(spec) %>;

const validate = validateEnum(spec);

export default validate;
