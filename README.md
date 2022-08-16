## Overview

This is library to validate a apple's gamecenter identity of localplayer for consuming it in [node.js][node] backend server.

## Installation

```bash
npm install apple-gamecenter-identity-verifier --save
```

## Usage

```js
var verifier = require('apple-gamecenter-identity-verifier');


// identity from client.
// Reference:  https://developer.apple.com/library/ios/documentation/GameKit/Reference/GKLocalPlayer_Ref/index.html#//apple_ref/occ/instm/GKLocalPlayer/generateIdentityVerificationSignatureWithCompletionHandler

var identity = {
  publicKeyUrl: 'https://valid.apple.com/public/timeout.cer',
  timestamp: 1460981421303,
  signature: 'PoDwf39DCN464B49jJCU0d9Y0J',
  salt: 'saltST==',
  playerId: 'G:1111111',
  bundleId: 'com.valid.app'
};

verifier.verify(identity, function (err, token) {
  if (!err) {
    // use token in here.
    console.log(token);
  }
});
```

```ts
import { verify } from 'apple-gamecenter-identity-verifier';


// identity from client.
// Reference:  https://developer.apple.com/library/ios/documentation/GameKit/Reference/GKLocalPlayer_Ref/index.html#//apple_ref/occ/instm/GKLocalPlayer/generateIdentityVerificationSignatureWithCompletionHandler

var identity = {
  publicKeyUrl: 'https://valid.apple.com/public/timeout.cer',
  timestamp: 1460981421303,
  signature: 'PoDwf39DCN464B49jJCU0d9Y0J',
  salt: 'saltST==',
  playerId: 'G:1111111',
  bundleId: 'com.valid.app'
};

verify(identity, function (err, token) {
  if (!err) {
    // use token in here.
    console.log(token);
  }
});
```

## Tests

```bash
npm test
```
or
```bash
npm prepare
```

## Contributing

Take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Inspired by

* apple's api document - https://developer.apple.com/library/ios/documentation/GameKit/Reference/GKLocalPlayer_Ref/index.html#//apple_ref/occ/instm/GKLocalPlayer/generateIdentityVerificationSignatureWithCompletionHandler
* stackoverflow - http://stackoverflow.com/questions/17408729/how-to-authenticate-the-gklocalplayer-on-my-third-party-server

## Release History

* 1.0.0 Initial release

[node]: http://nodejs.org/
