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

export default class Client {
  constructor(opts) {
    this.serviceName = opts.serviceName;
  }

  makeRequest(url, opts = {}) {
    const startTimeMs = new Date().getTime();
    const queryStr = querystring.stringify(opts.params);
    const paramString = queryStr ? `?${queryStr}` : '';
    const finalUrl = `${url}${paramString}`;

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
      },
      opts,
      {
        headers: finalHeaders,
      }
    );

    function handleResponse(response) {
      return new Promise((resolve, reject) => {
        response.text().then((text) => {
          let result = text;

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

    return fetch(finalUrl, options)
    .then((response) => {
      const endTimeMs = new Date().getTime();
      const roundTripMs = endTimeMs - startTimeMs;

      log.debug(`${finalUrl} responded, status[${response.status}], time[${roundTripMs} ms]`);

      if (response.ok || response.status < 500) {
        return handleResponse(response);
      }

      return Promise.reject({
        status: response.status,
        error: new Error('Request Failed'),
        result: response.text(),
      });
    });
  }
}
