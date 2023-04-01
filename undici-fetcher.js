const undici = require('undici');

module.exports = (url, opts) => {
  return undici.request(url, {
    method: 'GET',
    bodyTimeout: opts.timeout,
    headers: opts.authHeaderValue ? {
      Authorization: opts.authHeaderValue,
    } : undefined,
    headersTimeout: opts.timeout,
  }).then(res => ({ status: res.statusCode, ...res }));
}