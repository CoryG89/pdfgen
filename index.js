'use strict';

var util = require('util');
var phantomjs = require('phantomjs');
var nodePhantom = require('node-phantom');

var phantom;
var page;

var paperSize = { format: 'Letter', orientation: 'portrait', margin: '1cm' };

var phantomErrorMsg = 'pdfgen: error creating PhantomJS instance:\n\n\t%s\n';
var pageErrorMsg = 'pdfgen: error creating page:\n\n\t%s\n';
var typeErrorMsg = 'pdfgen: expects parameters (html, path, callback)';
var paperSizeErrorMsg = 'pdfgen: Error setting paper size:\n\n\t%s\n';
var contentErrorMsg = 'pdfgen: Error setting content:\n\n\t%s\n';
var renderErrorMsg = 'pdfgen: Error rendering PDF \'%s\': %s';
var renderMsg = 'pdfgen: Successfully rendered PDF \'%s\'';
var initMsg = 'pdfgen: Successfully initialized';

module.exports = {
    init: function (callback) {
        if (typeof phantom === 'undefined' || typeof page === 'undefined') {
            nodePhantom.create(onPhantomCreated, {
                phantomPath: phantomjs.path
            });
        }

        var handleError = callback || function () {
            var args = Array.prototype.slice.call(arguments);
            console.log.apply(console, args);
        };

        function onPhantomCreated (err, ph) {
            if (err) {
                handleError(phantomErrorMsg, err);
                return;
            }
            phantom = ph;
            phantom.createPage(function (err, pg) {
                if (err) {
                    handleError(pageErrorMsg, err);
                    return;
                }
                page = pg;
                page.set('paperSize', paperSize, function (err) {
                    if (err) {
                        handleError(paperSizeErrorMsg, err);
                        return;
                    }
                    if (typeof callback === 'function') {
                        callback(null, initMsg);
                    }
                });
            });
        }
    },

    render: function render (html, path, callback) {
        if (typeof html !== 'string' || typeof path !== 'string') {
            if (typeof callback === 'function') callback(typeErrorMsg);
            else console.log(typeErrorMsg);
            return;
        }

        var handleError = callback || function () {
            var args = Array.prototype.slice.call(arguments);
            console.log.apply(console, args);
        };

        var successMsg = util.format(renderMsg, path);
        page.set('content', html, function (err) {
            if (err) {
                handleError(contentErrorMsg, err);
                return;
            }
            page.render(path, function (err) {
                if (err) {
                    handleError(renderErrorMsg, path, err);
                    return;
                }
                if (typeof callback === 'function') {
                    callback(undefined, successMsg);
                }
            });
        });
    }
};
