const fetch = require('@pnpm/fetch');
const { join } = require('path');
const { rmSync, mkdirSync, readFileSync } = require('fs');

const { createTarballFetcher } = require('@pnpm/tarball-fetcher');
const { createCafsStore } = require('@pnpm/create-cafs-store');

rmSync(join(__dirname, 'cache_tarball'), { recursive: true, force: true });
mkdirSync(join(__dirname, 'cache_tarball'));

// comment this line to use the default fetcher
// const selectedFetcher = fetch.createFetchFromRegistry({});
// or use this one to try with undici-fetcher
const selectedFetcher = require('./undici-fetcher');

const auth = () => undefined;
const tarballFetcher = createTarballFetcher(selectedFetcher, auth, {
  rawConfig: {},
  retry: {
    maxTimeout: 100,
    minTimeout: 0,
    retries: 1,
  },
});

const cafs = createCafsStore(join(__dirname, 'cache_tarball'));

const tarballs = (() => {
  const files = ['lodash.json']; 
  // if you want to download all, is very slow: readdirSync(join(__dirname, 'cache', 'metadata', 'registry.npmjs.org'));

  return files.flatMap(file => {
    const jsonContent = readFileSync(join(__dirname, 'cache', 'metadata', 'registry.npmjs.org', file), 'utf8');
    const parsedContent = JSON.parse(jsonContent);

    const versions = Object.keys(parsedContent.versions);

    return versions.map(v => ({
      integrity: parsedContent.versions[v].dist.integrity,
      tarball: parsedContent.versions[v].dist.tarball,
    }));
  });
})();

(async () => {
  for (const tarball of tarballs) {
    await tarballFetcher.remoteTarball(cafs, tarball, {
      lockfileDir: process.cwd(),
    });
  }
})();
