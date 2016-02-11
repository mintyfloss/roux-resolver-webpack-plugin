'use strict';
var mockfs = require('mock-fs');
var tap = require('tap');
var path = require('path');
var assert = require('assert');
var RouxResolverWebpackPlugin = require('..');

var method = getResolverMethodFromWebpackPlugin({
	pantrySearchPaths: [path.resolve()]
});

tap.test('Resolves js entrypoints properly', function (t) {
	mockThePantry();
	method({
		request: '@namespace/path/to/ingredient'
	}, function (err, resolved) {
		t.ok(
			resolved.path ===
			path.resolve('@namespace/path/to/ingredient/index.js'),
			'Finds the proper index.js file'
		);
		mockfs.restore();
		t.end();
	});
});

tap.test('Resolves scss entrypoints properly', function (t) {
	mockThePantry();
	method({
		request: '@namespace/path/to/ingredient',
		query: '?entry=sass'
	}, function (err, resolved) {
		t.ok(
			resolved.path ===
			path.resolve('@namespace/path/to/ingredient/index.scss'),
			'Finds the proper index.scss file'
		);
		mockfs.restore();
		t.end();
	});
});

tap.test('Resolves handlebars entrypoints properly', function (t) {
	mockThePantry();
	method({
		request: '@namespace/path/to/ingredient',
		query: '?entry=handlebars'
	}, function (err, resolved) {
		t.ok(
			resolved.path ===
			path.resolve('@namespace/path/to/ingredient/index.hbs'),
			'Finds the proper index.hbs file'
		);
		mockfs.restore();
		t.end();
	});
});

tap.test(
	'Falls back to webpack file resolution if pantry does not exist',
	function (t) {
		method({
			request: '@namespace/not-a-pantry/atoms/ingredient',
			query: '?entry=handlebars'
		}, function (err, resolved) {
			t.ok(
				typeof resolved === 'undefined',
				'Falls back to webpack file resolution if pantry does not' +
				' exist.'
			);
			t.end();
		});
	}
);

function getResolverMethodFromWebpackPlugin(config) {
	config = config || {};
	var pluginInstance = new RouxResolverWebpackPlugin(config);
	var pluginMethod;
	var resolverStub = {
		plugin: function (pluginType, method) {
			assert(
				typeof method === 'function',
				'Expected function to be passed to plugin.'
			);
			assert(
				pluginType === 'module',
				'Expected first argument to resolve from the plugin\'s apply' +
				' method to be \'module\'. Got: ' +
				pluginType
			);
			pluginMethod = method;
		}
	};
	pluginInstance.apply(resolverStub);
	assert(typeof pluginMethod !== 'undefined', 'pluginMethod must not be' +
		' undefined at this point.');
	return pluginMethod;
}

function mockThePantry() {
	mockfs({
		'@namespace': {
			path: {
				to: {
					ingredient: {
						'ingredient.md': '',
						'index.js': '',
						'index.scss': '',
						'index.hbs': ''
					}
				}
			}
		}
	});
}
