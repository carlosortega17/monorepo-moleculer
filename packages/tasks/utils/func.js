const os = require('os');
const crypto = require('crypto');

const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const localizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Los_Angeles');

const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

const toDeepObjectId = (json) => {
  if (typeof json === 'string') return isObjectId(json) ? ObjectId(json) : json;

  const newJson = json;
  for (const key in newJson) {
    if (typeof newJson[key] === 'string' && isObjectId(newJson[key])) newJson[key] = ObjectId(newJson[key]);
    else if (typeof newJson[key] === 'object') {
      newJson[key] = toDeepObjectId(newJson[key]);
    } else if (Array.isArray(newJson[key])) {
      newJson[key] = newJson[key].map((r) => toDeepObjectId(r));
    }
  }

  return newJson;
};

const toDeepDate = (json) => {
  if (typeof json === 'string') {
    return dayjs(json).isValid() && isNaN(json) ? dayjs(json).toDate() : json;
  }

  const newJson = json;
  for (const key in newJson) {
    if (typeof newJson[key] === 'string') newJson[key] = toDeepDate(newJson[key]);
    else if (typeof newJson[key] === 'object') {
      newJson[key] = toDeepDate(newJson[key]);
    } else if (Array.isArray(newJson[key])) {
      newJson[key] = newJson[key].map((r) => toDeepDate(r));
    }
  }

  return newJson;
};

const sha256 = (str) => crypto.createHash('sha256').update(str, 'binary').digest('hex');

exports.getUniqId = () => {
  const interfaces = os.networkInterfaces();
  let mac = os.hostname();

  if (interfaces.en0 && Array.isArray(interfaces.en0) && interfaces.en0.length > 0) {
    mac = interfaces.en0.filter((i) => i.family === 'IPv4')[0].mac;
  }

  return sha256(mac);
};

exports.addressToStr = (objAddress = {}, separator = ' ') => {
  const strAddress = [];

  if (objAddress.name) strAddress.push(objAddress.name);
  if (objAddress.address1 || objAddress.address2) strAddress.push(`${objAddress.address1} ${objAddress.address2}`.trim());
  strAddress.push(`${objAddress.city} ${objAddress.state}, ${objAddress.postalCode}`.trim());
  if (objAddress.country) strAddress.push(objAddress.country);

  return strAddress.join(separator);
};

exports.date = (strDate) => dayjs(strDate);

exports.dateIsGreater = (date1, date2) => {
  if (!date1 || !date2) return false;

  const dateX = dayjs(date1);
  const dateY = dayjs(date2);
  const diff = dateX.diff(dateY);

  if (dateX.isSame(dateY)) return false;
  return diff <= 1;
};

exports.sha256 = sha256;
exports.isObjectId = isObjectId;
exports.toDeepObjectId = toDeepObjectId;
exports.toDeepDate = toDeepDate;

exports.aeach = async (array, callback) => {
  const results = [];
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await callback(array[index], index, array));
  }

  return results;
};
