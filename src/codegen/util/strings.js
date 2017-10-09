export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toCamelCase(string) {
  const parts = string
    .split(/(-|_)/)
    .filter(p => p !== '-' && p !== '_');
  const capitalized = parts.map((part, idx) => {
    if (idx > 0) {
      return capitalizeFirstLetter(part);
    }

    return part;
  });

  return capitalized.join('');
}

export function alphaNumOnly(string) {
  return string.replace(/[^a-zA-Z0-9]/gi, '');
}

export function slug(string) {
  return string
    .replace(/[^a-zA-Z0-9\-_\s]/gi, '')
    .replace(/(\s+|_)/gi, '-')
    .toLowerCase();
}

export default {
  toCamelCase, capitalizeFirstLetter, alphaNumOnly, slug,
};
