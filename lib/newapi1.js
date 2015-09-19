"use strict";
const CookieJar = require("tough-cookie").CookieJar;
const URL = require("./jsdom/utils").URL;
const VirtualConsole = require("./jsdom/virtual-console");
const Window = require("./jsdom/browser/Window");
const locationInfo = require("./jsdom/living/helpers/internal-constants").locationInfo;
const domToHtml = require("./jsdom/browser/domtohtml").domToHtml;

// This file is an experimental new API for jsdom. You can use it via `require("jsdom/lib/newapi1")` as a replacement
// for `require("jsdom")`, to test and give us feedback.

// For the duration of the 6.x series, and possibly beyond, it will not change in backward-incompatible ways. However,
// in some future major release, it will either be removed entirely, or it will become the new jsdom API, taking over
// `require("jsdom")` and this file disappearing.

const window = Symbol("window");

class JSDOM {
  constructor(html, options) {
    options = normalizeOptions(options);
    html = normalizeHTML(html);

    this[window] = new Window({
      contentType: options.contentType,
      cookieJar: options.cookieJar,
      parsingMode: options.parsingMode,
      referrer: options.referrer,
      resourceLoader: options.resourceLoader, // TODO NEWAPI resource loader formats are incompatible right now
      url: options.url,
      virtualConsole: options.virtualConsole
    });

    // TODO NEWAPI: this is still pretty hacky. It's also different than jsdom.jsdom. Does it work? Can it be better?
    const document = this[window]._document;
    document._htmlToDom.appendHtmlToDocument(html, document);
    document.close();
  }

  get window() {
    return this[window];
  }

  get virtualConsole() {
    return this[window]._virtualConsole;
  }

  get cookieJar() {
    // TODO NEWAPI move this to window probably
    return this[window]._document._cookieJar;
  }

  serialize() {
    return domToHtml([this[window]._document]);
  }

  nodeLocation(node) {
    return node[locationInfo];
  }

  reconfigureWindow(newProps) {
    if ("top" in newProps) {
      this[window]._top = newProps.top;
    }
  }
}

function jsdom(html, options) {
  // TODO NEWAPI allow jsdom(options) only for default HTML?
  return new JSDOM(html, options);
}

const defaultResourceLoader = {
  allowed: []
  // fetch will never be called since no resources are allowed to be loaded
};

function normalizeOptions(options) {
  const normalized = {};

  if (options === undefined) {
    options = {};
  }

  normalized.parsingMode = options.parsingMode === undefined ? "html" : options.parsingMode;
  if (normalized.parsingMode !== "html" && normalized.parsingMode !== "xml") {
    throw new RangeError(`parsingMode must be "html" or "xml"`);
  }

  normalized.contentType = options.contentType === undefined ?
                           getDefaultContentType(normalized.parsingMode) :
                           String(options.contentType);

  normalized.url = options.url === undefined ? "about:blank" : (new URL(options.url)).href;

  normalized.referrer = options.referrer === undefined ? "about:blank" : (new URL(options.referrer)).href;

  normalized.cookieJar = options.cookieJar === undefined ? new CookieJar() : options.cookieJar;

  normalized.virtualConsole = options.virtualConsole === undefined ? new VirtualConsole() : options.virtualConsole;

  normalized.resourceLoader = options.resourceLoader === undefined ? defaultResourceLoader : options.resourceLoader;

  // Cookie? Or have them set up their own cookie jar first?

  // concurrentNodeIterators?? deferClose?? parser??

  // created/loaded/done? probably subsumed by promises... maybe not created though. onCreated or some other name?

  return normalized;
}

function normalizeHTML(html) {
  if (html === undefined) {
    return "";
  }
  return String(html);
}

function getDefaultContentType(parsingMode) {
  return parsingMode === "xml" ? "application/xml" : "text/html";
}

module.exports = jsdom;

module.exports.JSDOM = JSDOM;
module.exports.VirtualConsole = VirtualConsole;
module.exports.CookieJar = CookieJar;
