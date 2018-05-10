// const debug = require('debug')('tideprovider:fs');
const fs = require('fs');

const file = "./tide.dat";

exports.file = function(){
    return file;
};

exports.load = function(){
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) return reject(err);
            else return resolve(JSON.parse(data));
        })
    });
};

exports.save = function(data){
    return new Promise((resolve, reject) => {
        fs.writeFile(file, JSON.stringify(data), 'utf8', (err) => {
            if (err) return reject(err);
            else return resolve(true);
        })
    })
};
