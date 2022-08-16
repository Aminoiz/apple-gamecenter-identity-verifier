import { createVerify } from 'crypto';
import * as url from 'url';
import * as https from 'https';

import { Token } from './types/token';

const cache: any = {}; // (publicKey -> cert) cache

export function verify(idToken: Token, callback: Function) {
  getAppleCertificate(idToken.publicKeyUrl, (err: any, publicKey: string) => {
    if (!err) {
      try {
        verifySignature(publicKey, idToken);
        callback(null, idToken);
      } catch (e) {
        callback(e, null);
      }
    } else {
      callback(err, null);
    }
  });
}

function verifyPublicKeyUrl(publicKeyUrl: string): boolean {
  const parsedUrl = url.parse(publicKeyUrl);
  if (parsedUrl.protocol !== 'https:') {
    return false;
  }
  if (parsedUrl.hostname == null) {
    return false;
  }

  const hostnameParts = parsedUrl.hostname.split('.');
  const length = hostnameParts.length;
  const domainParts = hostnameParts.slice(length - 2, length);
  const domain = domainParts.join('.');
  if (domain !== 'apple.com') {
    return false;
  }

  return true;
}

function getAppleCertificate(publicKeyUrl: string, callback: Function) {
  if (!verifyPublicKeyUrl(publicKeyUrl)) {
    callback(new Error('Invalid publicKeyUrl'), null);
    return;
  }

  if (cache[publicKeyUrl]) {
    return callback(null, cache[publicKeyUrl]);
  }

  https
    .get(publicKeyUrl, (res) => {
      var data = '';
      res.on('data', (chunk) => {
        data += chunk.toString('base64');
      });
      res.on('end', () => {
        var cert = convertX509CertToPEM(data);

        if (res.headers['cache-control']) {
          // if there's a cache-control header
          var expire = res.headers['cache-control'].match(/max-age=([0-9]+)/);
          if (expire) {
            // if we got max-age
            cache[publicKeyUrl] = cert; // save in cache
            // we'll expire the cache entry later, as per max-age
            setTimeout(() => {
              delete cache[publicKeyUrl];
            }, parseInt(expire[1], 10) * 1000);
          }
        }
        callback(null, cert);
      });
    })
    .on('error', (e) => {
      callback(e);
    });
}

function convertX509CertToPEM(X509Cert: string) {
  var pemPreFix = '-----BEGIN CERTIFICATE-----\n';
  var pemPostFix = '-----END CERTIFICATE-----';

  var base64 = X509Cert;
  var certBody = base64.match(new RegExp('.{0,64}', 'g'))?.join('\n');

  return pemPreFix + certBody + pemPostFix;
}

function convertTimestampToBigEndian(timestamp: number) {
  // The timestamp parameter in Big-Endian UInt-64 format
  const buffer = Buffer.alloc(8);
  buffer.fill(0);

  const high = ~~(timestamp / 0xffffffff);
  const low = timestamp % (0xffffffff + 0x1);

  buffer.writeUInt32BE(high, 0);
  buffer.writeUInt32BE(low, 4);

  return buffer;
}

function verifySignature(publicKey: string, idToken: Token) {
  var verifier = createVerify('sha256');
  verifier.update(idToken.playerId, 'utf8');
  verifier.update(idToken.bundleId, 'utf8');
  verifier.update(convertTimestampToBigEndian(idToken.timestamp));
  verifier.update(idToken.salt, 'base64');

  if (!verifier.verify(publicKey, idToken.signature, 'base64')) {
    throw new Error('Invalid Signature');
  }
}
