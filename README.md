# @retailmenot/roux-resolver-webpack-plugin

Webpack resolver plugin for resolving entrypoints within a
roux pantry.

[![Build Status](https://travis-ci.org/RetailMeNotSandbox/roux-resolver-webpack-plugin.svg?branch=master)](https://travis-ci.org/RetailMeNotSandbox/roux-resolver-webpack-plugin)

## Installation

```sh
npm install @retailmenot/roux-resolver-webpack-plugin
```

## Usage

Add the following to your webpack config.

```
var RouxResolverWebpackPlugin = require( '@retailmenot/roux-resolver-webpack-plugin' );
{
    // rest of webpack config
    plugins: [
        new webpack.ResolverPlugin( [
            new RouxResolverWebpackPlugin()
        ] )
    ]
}
```

This should enable you to `require` files within roux pantries using their ingredient name. e.g. `require('@namespace/pantry/path/to/ingredient')` will get you the JS entrypoint for the ingredient named by
`@namespace/pantry/path/to/ingredient`.

You can add a query string to your require statements to resolve filetypes other than the js entrypoint. e.g.
`require('@namespace/pantry/path/to/ingredient?entry=sass')` will get you the
scss entrypoint for the ingredient named by
`@namespace/pantry/path/to/ingredient`.

## Tests

Run unit tests with `npm run test`
