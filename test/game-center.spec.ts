import { verify } from '../lib/index';

// a real token is used to check caching behavior
// but sharing it should have no security consequences
const testToken = {
  playerId: 'G:1965586982',
  publicKeyUrl: 'https://static.gc.apple.com/public-key/gc-prod-4.cer',
  timestamp: 1565257031287,
  signature:
    'uqLBTr9Uex8zCpc1UQ1MIDMitb+HUat2Mah4Kw6AVLSGe0gGNJXlih2i5X+0Z' +
    'wVY0S9zY2NHWi2gFjmhjt/4kxWGMkupqXX5H/qhE2m7hzox6lZJpH98ZEUbouWRfZX2ZhU' +
    'lCkAX09oRNi7fI7mWL1/o88MaI/y6k6tLr14JTzmlxgdyhw+QRLxRPA6NuvUlRSJpyJ4aG' +
    'tNH5/wHdKQWL8nUnFYiYmaY8R7IjzNxPfy8UJTUWmeZvMSgND4u8EjADPsz7ZtZyWAPi8kY' +
    'cAb6M8k0jwLD3vrYCB8XXyO2RQb/FY2TM4zJuI7PzLlvvgOJXbbfVtHx7Evnm5NYoyzgzw==',
  salt: 'DzqqrQ==',
  bundleId: 'cloud.xtralife.gamecenterauth',
};

it('should validate', done => {
  function callback(error: any, data: string) {
    if (error) {
      done(error);
      return;
    }
    try {
      expect(data).toBeDefined();
      done();
    } catch (error) {
      done(error);
    }
  }

  verify(testToken, callback);
});
