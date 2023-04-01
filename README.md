# PNPM with Undici

This repo contains just a proof of concept of PNPM using Undici to fetch package metadata and download the tarball files.

## How to Use

First, install all the dependencies:

```
npm install
```

### Profiling Fetch

Run the `perf-fetch.js` to perform some profiling over the fetch metadata of the packages from NPM.

```
node perf-fetch.js
```

It will create some json files inside `cache` folder.

To switch implementations, just change this line:

```js
// comment this line to use the default fetcher
// const selectedFetcher = fetch.createFetchFromRegistry({});
// or use this one to try with undici-fetcher
const selectedFetcher = require('./undici-fetcher');
```

### Profiling Tarball

First, make sure you have run `perf-fetch.js` because to download tarballs we will need some metadata from the previous script.

Then, just run `node perf-tarball.js`.

```js
// comment this line to use the default fetcher
// const selectedFetcher = fetch.createFetchFromRegistry({});
// or use this one to try with undici-fetcher
const selectedFetcher = require('./undici-fetcher');
```

## What I currently found

Well, for fetch I didn't see any noticeable performance improvement, but for tarball I think I found something.

Running `node perf-tarball.js` three times with `default fetcher`, the time to download all lodash versions was:

- 2m05s
- 1m50s
- 14s

The final run was a little weird, `default fetcher` is sometimes faster and most of the time slower.

With `undici`, the time is always consistent:

- 14s
- 16s
- 14s

So I don't know if I did something wrong in the `default fetcher` configuration or if I'm missing something with `undici`.

That's why I created this repository, just to share what I found to see if anyone can confirm or deny what I found.

### Edit

After more runs, `default fetcher` start to perform equal to `undici`, so I think we have no advantage using `undici`.
