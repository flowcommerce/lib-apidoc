import validateUnion from '../../utilities/validate-union';
<% imports.forEach(i => { %>
import <%=i.variableName %> from '<%=i.path %>';<% }) %>

// eslint-disable-next-line quotes,key-spacing,comma-spacing,max-len,quote-props,object-curly-spacing
const spec = <%= JSON.stringify(spec) %>;
const validators = {<% validators.forEach(v => { %>
  <%=v.type %>: <%=v.variableName %>,<% }) %>
};

const validate = validateUnion(spec, validators);

export default validate;
