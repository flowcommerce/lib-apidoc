import crypto from 'crypto';
import EventEmitter from 'events';
import querystring from 'querystring';

/**
 * Use the right implementation of fetch depending on the execution environment
 */
let fetch;
if (process.browser) {
  fetch = window.fetch;
} else {
  fetch = require('node-fetch'); // eslint-disable-line global-require
}

export default class Client extends EventEmitter {
  static validateAuth(auth) {
    // string type === default to Basic auth.
    if (typeof auth === 'undefined' || typeof auth === 'string') {
      return;
    }

    if (Object.keys(auth).length !== 2
       || (!Object.prototype.hasOwnProperty.call(auth, 'type')
          || !Object.prototype.hasOwnProperty.call(auth, 'value'))) {
      // eslint-disable-next-line max-len
      throw new Error('Expected auth to be either a string or a valid auth object. Example: { type: "jwt", value: "<jwtToken>" } -- Valid types are: basic, bearer and jwt');
    }

    const validTypes = ['basic', 'bearer', 'jwt'];
    if (!validTypes.includes(auth.type)) {
      throw new Error('Auth type must be one of: basic, bearer, jwt');
    }
  }

  static getBasicAuthHeaderValue(auth) {
    return `Basic ${new Buffer(auth).toString('base64')}`;
  }

  static getFinalUrl(url, opts) {
    const queryStr = querystring.stringify(opts.params);
    const paramString = queryStr ? `?${queryStr}` : '';
    return `${url}${paramString}`;
  }

  static possiblyConvertAuthorizationHeader(auth) {
    Client.validateAuth(auth);

    if (typeof auth === 'string') {
      return Client.getBasicAuthHeaderValue(auth);
    }

    if (auth.type === 'basic') {
      return Client.getBasicAuthHeaderValue(auth.value);
    }

    if (auth.type === 'bearer' || auth.type === 'jwt') {
      return `Bearer ${auth.value}`;
    }

    throw new Error(`Cannot create authorization header of type[${auth.type}]`);
  }

  constructor(opts = {}) {
    super();
    this.serviceName = opts.serviceName;
    this.auth = opts.auth;
    this.host = opts.host;
    this.headers = opts.headers || {};

    // Convert auth if provided in constructor
    if (this.auth) {
      this.auth = Client.possiblyConvertAuthorizationHeader(this.auth);
    }
  }

  logRequest(opts) {
    this.emit('request', opts);
  }

  logResponse(response) {
    this.emit('response', response);
  }

  withAuth(auth) {
    if (auth) {
      this.auth = Client.possiblyConvertAuthorizationHeader(auth);
    }

    return this;
  }

  withHeaders(headers) {
    if (headers) {
      this.headers = { ...this.headers, ...headers };
    }

    return this;
  }

  calculateFinalHeaders(opts) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (this.auth) {
      headers.Authorization = this.auth;
    }

    return { ...headers, ...this.headers, ...opts.headers };
  }

  makeRequest(url, opts = {}) {
    const startTimeMs = new Date().getTime();
    const finalUrl = Client.getFinalUrl(url, opts);
    const requestId = crypto.randomBytes(20).toString('hex');
    const headers = this.calculateFinalHeaders(opts);
    const body = opts.body && typeof opts.body !== 'string' ? JSON.stringify(opts.body) : opts.body;
    const options = {
      credentials: 'same-origin',
      requestId,
      ...opts,
      headers,
      body,
    };

    this.logRequest({ ...options, url });

    return fetch(finalUrl, options)
    .then((response) => {
      const endTimeMs = new Date().getTime();
      const roundTripMs = endTimeMs - startTimeMs;

      return new Promise((resolve, reject) => {
        response.text().then((text) => {
          let result = text;

          this.logResponse({ status: response.status, body: result, requestId, time: roundTripMs });

          // Return JSON if text can parse as such
          try {
            if (text.length > 0) {
              result = JSON.parse(text);
            }
          } catch (ex) {
            // do nothing, let it be plain text.
          }

          const envelope = {
            ok: response.ok,
            result,
            status: response.status,
          };

          resolve(envelope);
        })
        .catch(err => reject(err)); // Only reject on implementation error, not response
      });
    });
  }
}
