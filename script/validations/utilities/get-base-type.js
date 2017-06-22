const APIDOC_MAP_ARRAY_REGEX = /\[([\w-]+)\]/;

export const getArrayType = (type) => {
  const exec = /^\[(.+)\]$/.exec(type);
  return exec && exec[1] ? exec[1] : type;
};

export const getBaseType = (type) => {
  if (/^map/.test(type)) {
    return type.replace('map[', '').replace(']', '');
  }

  const match = APIDOC_MAP_ARRAY_REGEX.exec(type);

  if (match) {
    return match[1];
  }

  return type;
};

export default getBaseType;
