/* eslint-disable no-console */
export default class {
  constructor(dirRoot) {
    this.path = dirRoot
      .replace(process.cwd(), '')
      .replace(/\//g, '.');

    if (this.path.startsWith('.')) {
      this.path = this.path.slice(1);
    }

    this.debugEnabled =
      process.env.NODE_DEBUG ?
      process.env.NODE_DEBUG.indexOf('node-sdk') !== -1 :
      false;
  }

  format(message) {
    return `[apidoc:${this.path}] ${message}`;
  }

  debug(message, ...other) {
    if (!this.debugEnabled) return;
    console.info(this.format(message), ...other);
  }

  info(message, ...other) {
    console.info(this.format(message), ...other);
  }

  warn(message, ...other) {
    console.warn(this.format(message), ...other);
  }

  error(message, ...other) {
    console.error(this.format(message), ...other);
  }
}
