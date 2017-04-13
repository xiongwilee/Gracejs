'use strict';

var parse = require('co-body');
var copy = require('copy-to');

module.exports = function(opts) {
  opts = opts || {};

  // enable types
  var enableTypes = opts.enableTypes || ['json', 'form'];
  var enableForm = checkEnable(enableTypes, 'form');
  var enableJson = checkEnable(enableTypes, 'json');
  var enableText = checkEnable(enableTypes, 'text');

  // default onerror
  var onerror = opts.onerror;
  opts.onerror = undefined;

  // default json types
  var jsonTypes = [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report',
  ];

  // default form types
  var formTypes = [
    'application/x-www-form-urlencoded',
  ];

  // default text types
  var textTypes = [
    'text/plain',
  ];

  // default limit
  opts.jsonLimit = opts.jsonLimit || '5mb';
  opts.formLimit = opts.formLimit || '2mb';
  opts.textLimit = opts.textLimit || '5mb';

  var jsonOpts = formatOptions(opts, 'json');
  var formOpts = formatOptions(opts, 'form');
  var textOpts = formatOptions(opts, 'text');

  var extendTypes = opts.extendTypes || {};
  extendType(jsonTypes, extendTypes.json);
  extendType(formTypes, extendTypes.form);
  extendType(textTypes, extendTypes.text);

  return async function body(ctx, next) {
    if (ctx.request.body !== undefined) return await next();

    try {
      ctx.request.body = await parseBody(ctx);
    } catch (err) {
      if (onerror) {
        onerror(err, ctx);
      } else {
        throw err;
      }
    }
    await next();
  };

  async function parseBody(ctx) {
    if (enableJson && ctx.request.is(jsonTypes)) {
      return await parse.json(ctx, jsonOpts);
    }
    if (enableForm && ctx.request.is(formTypes)) {
      return await parse.form(ctx, formOpts);
    }
    if (enableText && ctx.request.is(textTypes)) {
      return await parse.text(ctx, textOpts) || '';
    }

    return {};
  }
};

function formatOptions(opts, type) {
  var res = {};
  copy(opts).to(res);
  res.limit = opts[type + 'Limit'];
  return res;
}

function extendType(original, extend) {
  if (extend) {
    if (!Array.isArray(extend)) {
      extend = [extend];
    }
    extend.forEach(function(extend) {
      original.push(extend);
    });
  }
}

function checkEnable(types, type) {
  return types.indexOf(type) >= 0;
}
