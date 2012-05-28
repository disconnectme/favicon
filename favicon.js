/**
 * A class for finding a website’s favicon URL, if any. Requires a context, like
 * a browser extension, that allows cross-origin requests.
 * <br />
 * <br />
 * Copyright 2012 Disconnect, Inc.
 * <br />
 * <br />
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * <br />
 * <br />
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the <a
 * href="https://www.gnu.org/licenses/gpl.html">GNU General Public License</a>
 * for more details.
 * <br />
 * @constructor
 * @param {string} [alternate=""] A default favicon URL, absolute or relative.
 * @author <a href="https://github.com/byoogle">Brian Kennish</a>
 */
function Favicon(alternate) {
  /**
   * Fetches the default favicon URL.
   * @return {string} An absolute or relative URL.
   */
  this.getAlternate = function() { return alternate; };

  /**
   * Mungs the default favicon URL.
   * @param  {string}  alternate An absolute or relative URL.
   * @return {Favicon}           The favicon object.
   */
  this.setAlternate = function(newAlternate) {
    alternate = newAlternate;
    return this;
  };

  /**
   * Finds a favicon URL.
   * @param  {string}           url        A website’s hostname or absolute URL.
   * @param  {function(string)} [callback] A continuation, to execute when the
   *                                       method completes.
   * @return {Favicon|string}              The favicon object, if a continuation
   *                                       is given, or a URL, if not.
   */
  this.get = function(url, callback) {
    var that = this;

    var id = setInterval(function() {
      if (typeof jQuery != undeclared) {
        clearInterval(id);

        if (url.indexOf('/') + 1) {
          anchor.href = url;
          url = anchor.hostname;
        }

        var domain = url.split('.', 2)[1];
        var favicon = that.getAlternate();

        tests:
        for (var i = 0; i < protocolCount; i++) {
          for (var j = -1; j < subdomainCount; j++) {
            for (var k = 0; k < pathCount; k++) {
              var test =
                  protocols[i] + '//' +
                      (j + 1 ? subdomains[j] + '.' + domain : url) + paths[k];
              xhr = jQuery.ajax(test, {async: false});
              var type = xhr.getResponseHeader('Content-Type');

              if (
                xhr.status == 200 && type && type.indexOf('image/') + 1 &&
                    xhr.responseText
              ) {
                favicon = test;
                break tests;
              }
            }
          }
        }

        favicon && callback(favicon);
      }
    }, 100);

    return this;
  };

  var version = '1.0.0';
  var protocols = ['http:', 'https:'];
  var subdomains = ['www'];
  var paths = ['/favicon.ico'];
  var protocolCount = protocols.length;
  var subdomainCount = subdomains.length;
  var pathCount = paths.length;
  var anchor = document.createElement('a');
  var undeclared = 'undefined';
  if (typeof alternate == undeclared) alternate = '';

  if (typeof jQuery == undeclared) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'vendor/jquery-1.7.2.min.js');
    script.onload = function() { jQuery.noConflict(); };
    document.head.appendChild(script);
  }

  return this;
}
