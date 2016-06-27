import crypto from 'crypto';
import EventEmitter from 'events';
import querystring from 'querystring';
import Logger from './logger';

const log = new Logger(__dirname);

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
  constructor(opts) {
    super();
    this.serviceName = opts.serviceName;
  }

  logRequest(opts) {
    this.emit('request', opts);
  }

  logResponse(response) {
    this.emit('response', response);
  }

  makeRequest(url, opts = {}) {
    const startTimeMs = new Date().getTime();
    const queryStr = querystring.stringify(opts.params);
    const paramString = queryStr ? `?${queryStr}` : '';
    const finalUrl = `${url}${paramString}`;
    const requestId = crypto.randomBytes(20).toString('hex');
    const finalHeaders = Object.assign(
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      opts.headers
    );

    const options = Object.assign(
      {
        credentials: 'same-origin',
        requestId,
      },
      opts,
      {
        headers: finalHeaders,
      }
    );

    function handleResponse(response, logger) {
      return new Promise((resolve, reject) => {
        response.text().then((text) => {
          let result = text;

          logger({ status: response.status, body: result, requestId });

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

    log.debug(`Making request to ${finalUrl} with options`, options);

    this.logRequest(Object.assign({}, options, { url }));
    const logResponse = this.logResponse.bind(this);

    return fetch(finalUrl, options)
    .then((response) => {
      const endTimeMs = new Date().getTime();
      const roundTripMs = endTimeMs - startTimeMs;

      log.debug(`${finalUrl} responded, status[${response.status}], time[${roundTripMs} ms]`);

      if (response.ok || response.status < 500) {
        return handleResponse(response, logResponse);
      }

      return Promise.reject({
        status: response.status,
        error: new Error('Request Failed'),
        result: response.text(),
      });
    });
  }
}
