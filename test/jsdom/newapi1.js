"use strict";
const jsdom = require("../../lib/newapi1");

// Basic functionality

exports["should have a window and a document"] = t => {
  const dom = jsdom();

  t.ok(dom.window);
  t.ok(dom.window.document);
  t.done();
};

exports["should have a document with documentElement HTML when no arguments are passed"] = t => {
  const document = jsdom().window.document;

  t.strictEqual(document.documentElement.nodeName, "HTML");
  t.done();
};

// Test first argument

exports["should populate the resulting document with the given HTML"] = t => {
  const document = jsdom(`<a id="test" href="#test">`).window.document;

  t.strictEqual(document.getElementById("test").getAttribute("href"), "#test");
  t.done();
};

exports["should give the same document innerHTML for empty and blank and omitted strings"] = t => {
  const document1 = jsdom().window.document;
  const document2 = jsdom(``).window.document;
  const document3 = jsdom(` `).window.document;

  t.strictEqual(document1.innerHTML, document2.innerHTML);
  t.strictEqual(document2.innerHTML, document3.innerHTML);
  t.done();
};

// Test options

// referrer option

exports["should allow customizing document.referrer via the referrer option"] = t => {
  const document = jsdom(``, { referrer: "http://example.com/" }).window.document;

  t.strictEqual(document.referrer, "http://example.com/");
  t.done();
};

exports["should throw an error when passing an invalid absolute URL for referrer"] = t => {
  t.throws(() => jsdom(``, { referrer: "asdf" }));
  t.done();
};

exports["should canonicalize referrer URLs"] = t => {
  const document = jsdom(``, { referrer: "http:example.com" }).window.document;

  t.strictEqual(document.referrer, "http://example.com/");
  t.done();
};

exports["should have a default referrer URL of about:blank"] = t => {
  const document = jsdom().window.document;

  t.strictEqual(document.referrer, "about:blank");
  t.done();
};

// url option

exports["should allow customizing document URL via the url option"] = t => {
  const document = jsdom(``, { url: "http://example.com/" }).window.document;

  t.strictEqual(document.URL, "http://example.com/");
  t.strictEqual(document.documentURI, "http://example.com/");
  t.done();
};

exports["should throw an error when passing an invalid absolute URL for url"] = t => {
  t.throws(() => jsdom(``, { url: "asdf" }));
  t.done();
};

exports["should canonicalize document URLs"] = t => {
  const document = jsdom(``, { url: "http:example.com" }).window.document;

  t.strictEqual(document.URL, "http://example.com/");
  t.strictEqual(document.documentURI, "http://example.com/");
  t.done();
};

exports["should have a default document URL of about:blank"] = t => {
  const document = jsdom().window.document;

  t.strictEqual(document.URL, "about:blank");
  t.strictEqual(document.documentURI, "about:blank");
  t.done();
};

// contentType option

exports["should allow customizing document content type via the contentType option"] = t => {
  const document = jsdom(``, { contentType: "text/html+funstuff" }).window.document;

  t.strictEqual(document.contentType, "text/html+funstuff");
  t.done();
};

exports["should have a default content type of text/html"] = t => {
  const document = jsdom().window.document;

  t.strictEqual(document.contentType, "text/html");
  t.done();
};

exports["should have a default content type of text/html with parsingMode html"] = t => {
  const document = jsdom(``, { parsingMode: "html" }).window.document;

  t.strictEqual(document.contentType, "text/html");
  t.done();
};

exports["should be able to override the content type for parsingMode html documents"] = t => {
  const document = jsdom(``, { parsingMode: "html", contentType: "text/html+awesomesauce" }).window.document;

  t.strictEqual(document.contentType, "text/html+awesomesauce");
  t.done();
};

exports["should be able to override the content type for parsingMode xml documents"] = t => {
  const document = jsdom(``, { parsingMode: "xml", contentType: "application/xhtml+xml" }).window.document;

  t.strictEqual(document.contentType, "application/xhtml+xml");
  t.done();
};
