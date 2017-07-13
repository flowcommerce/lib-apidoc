import validateModel from '../../utilities/validate-model';
import isPrimative from '../../utilities/is-primative';
import validateType from '../../utilities/validate-apidoc-type';
import { genericError } from '../../utilities/validation-error';
<% imports.forEach(i => { %>
import <%=i.variableName %> from '<%=i.path %>';<% }) %>

// eslint-disable-next-line quotes,key-spacing,comma-spacing,max-len,quote-props,object-curly-spacing
const spec = <%= JSON.stringify(spec) %>;

const validator = (field, value) => {
  if (value && isPrimative(field.type)) {
    return { [field.name]: validateType(field.type, value) };
  }

  if (value) {
    switch (field.type) {<% validatorCases.forEach(c => { %>
    case '<%=c.type %>':
      return { [field.name]: <% if (c.isArray) { %>validateArray(<%=c.functionName %>(value))<%} else {%><%=c.functionName %>(value)<%}%> };<% }) %>
    default:
      // eslint-disable-next-line prefer-template
      return { [field.name]: genericError(value, 'Unhandled field type[' + field.type + ']') };
    }
  }

  return { [field.name]: undefined };
};

const validate = validateModel(spec, validator);

export default validate;
