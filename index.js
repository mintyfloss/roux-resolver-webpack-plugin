'use strict';

var roux = require('@retailmenot/roux');
var querystring = require('querystring');
var debug = require('debug')('roux:resolver-webpack-plugin');

function getResolveComponent(config) {
	return function (request, callback) {
		var parsedPath = roux.parseIngredientPath(request.request);

		debug('attempting to resolve ' + request);

		// Parsed path is not even potentially an ingredient
		if (!parsedPath) {
			debug('no path parsed from ' + request.request);
			return callback();
		}

		debug('parsed path: ', parsedPath);

		var entry = 'javaScript';
		if (request.query) {
			var query = request.query.slice(1);
			var parsedQuery = querystring.parse(query);
			if (parsedQuery.entry) {
				entry = parsedQuery.entry;
			}
			debug('parsed query', parsedQuery);
		}

		// Attempt to resolve to an ingredient
		/* eslint consistent-return: 0 */
		roux.resolve(
			parsedPath.pantry,
			parsedPath.ingredient,
			entry,
			config
		)
			.then(function (resolvedPath) {
				debug('resolved path: ' + resolvedPath);
				if (!resolvedPath) {
				// No ingredient found
					return callback();
				}

				// A matching entrypoint was found
				return callback(null, {
					path: resolvedPath
				});
			})
			.catch(function (e) {
			// Allow for PantryDoesNotExistError or IngredientDoesNotExistError
			// because there's a chance the file being required has a pantry-like
			// path, but does not live in a pantry. In these cases, we want to
			// fall back to webpack's normal file resolution.
				if (
					e instanceof roux.errors.PantryDoesNotExistError ||
					e instanceof roux.errors.IngredientDoesNotExistError
				) {
					return callback();
				}
				debug('an error occured trying to resolve ' + request.request, e);
				return callback(e);
			});
	};
}

function RouxResolverWebpackPlugin(config) {
	this.config = roux.normalizeConfig(config);
	debug(this.config);
}

RouxResolverWebpackPlugin.prototype.apply = function (resolver) {
	debug('Initializing the resolver plugin');
	resolver.plugin('module', getResolveComponent(this.config));
};

module.exports = RouxResolverWebpackPlugin;
