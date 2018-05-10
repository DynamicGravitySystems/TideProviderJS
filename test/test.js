const assert = require('assert');
const fs = require('fs');
const fsp = require('../models/fsprovider');


const expected = {a: 1, b: 2, c: 3};

describe('FSprovider', function() {
    describe('#save()', function(){
        it('should resolve if the data is saved', function(){
            return fsp.save(expected);
        })
    });
    describe('#load()', function () {
        it('should load an object from a file', function(done){
            fsp.load().then((value) => {
                assert.deepEqual(value, expected);
                done();
            }).catch((err) => {done(err)});
        })
    });

    after(function cleanup() {
        fs.unlink(fsp.file(), (err) => {
            if (err) throw err;
            console.log(`${fsp.file()} was deleted.`);
        });
    })
});
