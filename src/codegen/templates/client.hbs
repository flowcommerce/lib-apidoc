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
  constructor(opts = {}) {
    super();
    this.serviceName = opts.serviceName;
    this.auth = opts.auth;
    this.host = opts.host;
    this.headers = opts.headers || {};

    // Convert auth if provided in constructor
    if (this.auth) {
      this.auth = this.possiblyConvertAuthorizationHeader(this.auth);
    }
  }

  logRequest(opts) {
    this.emit('request', opts);
  }

  logResponse(response) {
    this.emit('response', response);
  }

  withAuth(auth) {
    this.auth = this.possiblyConvertAuthorizationHeader(auth);
    return this;
  }

  withHeaders(headers) {
    this.headers = Object.assign({}, this.headers, headers);
    return this;
  }

  validateAuth(auth) {
    // string type === default to Basic auth.
    if (typeof auth === 'undefined' || typeof auth === 'string') {
      return;
    }

    if (Object.keys(auth).length !== 2
        || (!auth.hasOwnProperty('type') || !auth.hasOwnProperty('value'))) {
      // eslint-disable-next-line max-len
      throw new Error('Expected auth to be either a string or a valid auth object. Example: { type: "jwt", value: "<jwtToken>" } -- Valid types are: basic, bearer and jwt');
    }

    const validTypes = ['basic', 'bearer', 'jwt'];
    if (!validTypes.includes(auth.type)) {
      throw new Error('Auth type must be one of: basic, bearer, jwt');
    }
  }

  getBasicAuthHeaderValue(auth) {
    return `Basic ${new Buffer(auth).toString('base64')}`;
  }

  possiblyConvertAuthorizationHeader(auth) {
    this.validateAuth(auth);

    if (typeof auth === 'string') {
      return this.getBasicAuthHeaderValue(auth);
    }

    if (auth.type === 'basic') {
      return this.getBasicAuthHeaderValue(auth.value);
    }

    if (auth.type === 'bearer' || auth.type === 'jwt') {
      return `Bearer ${auth.value}`;
    }

    throw new Error(`Cannot create authorization header of type[${auth.type}]`);
  }

  getFinalUrl(url, opts) {
    const queryStr = querystring.stringify(opts.params);
    const paramString = queryStr ? `?${queryStr}` : '';
    return `${url}${paramString}`;
  }

  calculateFinalHeaders(opts) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (this.auth) {
      headers.Authorization = this.auth;
    }

    return Object.assign(headers, opts.headers);
  }

  makeRequest(url, opts = {}) {
    const startTimeMs = new Date().getTime();
    const finalUrl = this.getFinalUrl(url, opts);
    const requestId = crypto.randomBytes(20).toString('hex');
    const headers = this.calculateFinalHeaders(opts);
    const options = Object.assign(
      {
        credentials: 'same-origin',
        requestId,
      },
      opts,
      {
        headers,
      }
    );

    function handleResponse(response, time, logger) {
      return new Promise((resolve, reject) => {
        response.text().then((text) => {
          let result = text;

          logger({ status: response.status, body: result, requestId, time });

          try {
            if (text.length > 0) {
              result = JSON.parse(text);
            }
          } catch (ex) {
            // do nothing, let it be plain text.
          }

          const envelope = {
            status: response.status,
            result,
          };

          resolve(envelope);
        }).catch((err) => reject(err));
      });
    }

    this.logRequest(Object.assign({}, options, { url }));
    const logResponse = this.logResponse.bind(this);

    return fetch(finalUrl, options)
    .then((response) => {
      const endTimeMs = new Date().getTime();
      const roundTripMs = endTimeMs - startTimeMs;

      if (response.ok || response.status < 500) {
        return handleResponse(response, roundTripMs, logResponse);
      }

      return response.text().then((text) =>
        Promise.reject({
          status: response.status,
          error: new Error(`Request to url[${finalUrl}] failed with status[${response.status}].`),
          result: text,
        }));
    });
  }
}
