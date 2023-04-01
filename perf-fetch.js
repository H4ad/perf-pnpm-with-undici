const fetch = require('@pnpm/fetch');
const resolverFactory = require('@pnpm/npm-resolver');
const { join } = require('path');
const { rmSync, mkdirSync } = require('fs');

rmSync(join(__dirname, 'cache'), { recursive: true, force: true });
mkdirSync(join(__dirname, 'cache'));

const registry = 'https://registry.npmjs.org/';

// comment this line to use the default fetcher
// const selectedFetcher = fetch.createFetchFromRegistry({});
// or use this one to try with undici-fetcher
const selectedFetcher = require('./undici-fetcher');

const auth = () => undefined;
const resolver = resolverFactory.createNpmResolver(selectedFetcher, auth, {
  cacheDir: join(__dirname, 'cache'),
  offline: false,
  preferOffline: false,
});

const packages = [
  { alias: 'react', pref: '16.8.6' },
  { alias: 'typescript', pref: '5.0.3' },
  { alias: 'lodash', pref: '4.17.21' },
  { alias: 'react-dom', pref: '16.8.6' },
  { alias: 'react-router-dom', pref: '5.2.0' },
  { alias: 'react-router', pref: '5.2.0' },
  { alias: 'react-redux', pref: '7.2.4' },
  { alias: 'redux', pref: '4.1.0' },
  { alias: 'redux-thunk', pref: '2.3.0' },
  { alias: 'redux-logger', pref: '3.0.6' },
  { alias: 'redux-devtools-extension', pref: '2.13.9' },
  { alias: 'redux-devtools', pref: '3.7.0' },
  { alias: 'redux-saga', pref: '1.1.3' },
  { alias: 'redux-persist', pref: '6.0.0' },
  { alias: 'react-router-redux', pref: '5.0.0-alpha.9' },
  { alias: 'react-router-config', pref: '5.1.1' },
];



(async () => {
  for (const package of packages) {
    await resolver(package, { registry })
  }
})();
