import includes from 'lodash/fp/includes';

const PRIMATIVES = [
  'boolean',
  'date-iso8601',
  'date-time-iso8601',
  'decimal',
  'double',
  'integer',
  'long',
  'object',
  'string',
  'unit',
  'uuid',
];

const APIDOC_MAP_ARRAY_REGEX = /\[([\w-]+)\]/;

export default function isPrimative(type) {
  const mapOrArray = APIDOC_MAP_ARRAY_REGEX.exec(type);

  if (mapOrArray) {
    return includes(mapOrArray[1], PRIMATIVES);
  }

  return includes(type, PRIMATIVES);
}
