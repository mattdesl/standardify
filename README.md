# standardify

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A browserify plugin to force [standard](http://npmjs.com/package/standard) linting at bundle time, printing errors in DevTools console and optionally rendering them to the DOM.

It would typically be combined with [watchify](https://www.npmjs.com/package/watchify), [budo](https://www.npmjs.com/package/budo), [hihat](https://www.npmjs.com/package/hihat), or a similar tool.

Example, where `--plugin` is a browserify option.

```sh
budo index.js --live -- --plugin standardify
```

Now, when you open `localhost:9966` and make changes to `index.js` that fail the linter, they appear in the browser.

![screen](http://i.imgur.com/KfZ4Pz3.png)

__This is an experiment / proof of concept.__ Other ideas:

- allow/document custom styling of errors
- allow the build to continue even in the case of lint errors
  - e.g. printing to console, but still running the app
- modularize some of the code here for other linters

## Usage

[![NPM](https://nodei.co/npm/standardify.png)](https://www.npmjs.com/package/standardify)

WIP

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/standardify/blob/master/LICENSE.md) for details.
