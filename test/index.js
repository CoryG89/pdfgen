'use strict';

var fs = require('fs');
var util = require('util');
var chai = require('chai');
var pdfgen = require('..');

var should = chai.should();

var html = [
    '<!DOCTYPE html><html><head><title>My Webpage</title></head><body>',
    '<h2>Some Awesome HTML</h2><ul><p>I mean really awesome</p></body></html>'
].join('');


describe('pdfgen', function () {

    it('should be initialized successfully', function (done) {
        var expectedSuccess = 'pdfgen: Successfully initialized';
        pdfgen.init(function (err, success) {
            should.not.exist(err);
            should.exist(success);
            success.should.equal(expectedSuccess);
            done();
        });
    });

    var expectedTypeError = 'pdfgen: expects parameters (html, path, callback)';
    var renderMsg = 'pdfgen: Successfully rendered PDF \'%s\'';

    it('should return error when given invalid html parameter', function (done) {
        pdfgen.render(null, 'output.pdf', function (err, success) {
            should.exist(err);
            should.not.exist(success);
            err.should.equal(expectedTypeError);
            done();
        });
    });

    it('should return error when given invalid path parameter', function (done) {
        pdfgen.render(html, null, function (err, success) {
            should.exist(err);
            should.not.exist(success);
            err.should.equal(expectedTypeError);
            done();
        });
    });

    it('should render HTML successfully', function (done) {
        var outputFilename = 'output.pdf';
        var expectedSuccess = util.format(renderMsg, outputFilename);
        pdfgen.render(html, 'output.pdf', function (err, success) {
            should.not.exist(err);
            should.exist(success);
            success.should.equal(expectedSuccess);
            fs.exists(outputFilename, function (exists) {
                exists.should.equal(true);
            });
            done();
        });
    });
});
