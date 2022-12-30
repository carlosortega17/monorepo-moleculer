const os = require('os');
const crypto = require('crypto');

const sha256 = (str) => crypto.createHash('sha256').update(str, 'binary').digest('hex');

const getUniqId = () => {
  const interfaces = os.networkInterfaces();
  let mac = os.hostname();

  if (interfaces.en0 && Array.isArray(interfaces.en0) && interfaces.en0.length > 0) {
    mac = interfaces.en0.filter((i) => i.family === 'IPv4')[0].mac;
  }

  return sha256(mac);
};
const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

function validURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' // protocol
      + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
      + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
      + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
      + '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

module.exports = {
  isObjectId,
  validURL,
  strip_html_tags: (str) => {
    if (str === null || str === '') return false;
    str = str.toString();
    return str.replace(/<[^>]*>/g, '');
  },
  cleanExtraSpacing: (string) => string
    && String(string || '')
      .trim()
      .replace(/\s+/g, ' '),
  resp: (res, body, statusCode = 200, headers = {}) => {
    headers = {
      ...headers,
      'Content-Type': 'application/json charset=utf-8',
    };

    for (const h in headers) res.setHeader(h, headers[h]);
    res.writeHead(statusCode);
    res.end(JSON.stringify(body));
  },
  sha256,
  getUniqId,
  checkIfValidMD5Hash: (str) => {
    // Regular expression to check if string is a MD5 hash
    const regexExp = /^[a-f0-9]{40}$/gi;

    return regexExp.test(str);
  },
};
