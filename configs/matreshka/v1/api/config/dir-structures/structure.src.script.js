const path = require('path');
const _ = require('lodash');
const parse = require('../parser');

let srcRootDir = '';
let scripts = {};
let isAngular = '';

/* Src Structure */
exports.getMethods = function (srcDir, scriptsConf, isAngularParam) {
    srcRootDir = srcDir;
    scripts = scriptsConf;
    isAngular = isAngularParam;
    return {
        isModuleScript: isModuleScript,
        getJsFiles: getJsFiles,
        getJsVendors: getJsVendors,
        isTs: isTs,
        getTsFiles: getTsFiles,
        getTsVendors: getTsVendors,
        isTsVendors: isTsVendors,
        isJsVendors: isJsVendors,
        getVendorsDir: getVendorsDir,
        isPolifyls: isPolifyls,
        getPolifyls: getPolifyls,
        getAllPolifyls: getAllPolifyls,
        getPolifylsDir: getPolifylsDir,
        getTestPolifyls: getTestPolifyls,
        getTestPolifylsNames: getTestPolifylsNames,
        isTest: isTest,
        getTestFiles: getTestFiles,
        isTdd: isTdd,
        isSingleTdd: isSingleTdd
    };
};

function isModuleScript() {
    return scripts.modules;
}

function getJsFiles() {
    if (!isTs() && scripts.js && scripts.js.files) {
        return getFiles(scripts.js.files);
    }
    return [];
}

function getJsVendors() {
    if (!isTs() && scripts.js && scripts.js.vendors) {
        return scripts.js.vendors && getFiles(scripts.js.vendors);
    }
    return [];
}

function isTs() {
    return scripts.ts && !_.isEmpty(scripts.ts.files);
}

function getTsFiles() {
    if (isTs()) {
        return getFiles(scripts.ts.files);
    }
    return [];
}

function getTsVendors() {
    if (scripts.ts && scripts.ts.vendors) {
        return getFiles(scripts.ts.vendors);
    }
    return [];
}

function isPolifyls() {
    return _.isArray(scripts.polifyls) && !_.isEmpty(scripts.polifyls) || scripts.polifyls;
}

function getAllPolifyls() {
    if (isPolifyls()) {
        return getFiles(scripts.polifyls);
    }
    return [];
}

function getPolifyls() {
    if (isPolifyls()) {
        return getFiles(scripts.polifyls).filter((file) => !file.includes('.test.'));
    }
    return [];
}

function getTestPolifylsNames() {
    if (isPolifyls()) {
        return scripts.polifyls.filter((file) => file.includes('.test.')).map(file => path.basename(file));
    }
    return [];
}

function getTestPolifyls() {
    if (isPolifyls()) {
        return getFiles(scripts.polifyls).filter((file) => file.includes('.test.'));
    }
    return [];
}

function getPolifylsDir() {
    if (isPolifyls()) {
        if (_.isArray(scripts.polifyls)) {
            return path.resolve(srcRootDir, path.dirname(scripts.polifyls[0]));
        }
        return path.resolve(srcRootDir, path.dirname(scripts.polifyls));
    }
}

function isTsVendors() {
    if (isTs() && scripts.ts && scripts.ts.vendors) {
        return !!scripts.ts.vendors;
    }
    return false;
}

function isJsVendors() {
    if (!isTs() && scripts.js && scripts.js.vendors) {
        return !!scripts.js.vendors;
    }
}

function getVendorsDir() {
    if (isTs() || isAngular) {
        if (scripts.ts && scripts.ts.vendors) {
            if (_.isArray(scripts.ts.vendors)) {
                return path.resolve(srcRootDir, path.dirname(scripts.ts.vendors[0]));
            }
            return path.resolve(srcRootDir, path.dirname(scripts.ts.vendors));
        }
        return '';
    } else {
        if (scripts.js && scripts.js.vendors) {
            if (_.isArray(scripts.js.vendors)) {
                return path.resolve(srcRootDir, path.dirname(scripts.js.vendors[0]));
            }
            return path.resolve(srcRootDir, path.dirname(scripts.js.vendors));
        }
        return '';
    }
}

function isTest() {
    return scripts.test && !_.isEmpty(scripts.test.specs);
}


function isTdd() {
    return isTest() && (scripts.test.tdd || process.env.npm_config_test && process.env.npm_config_test === 'tdd');
}

function isSingleTdd() {
    return isTest() && (scripts.test.singleTdd || process.env.npm_config_test && process.env.npm_config_test === 'tdd-single');
}

function getTestFiles() {
    if (isTest()) {
        return getFiles(scripts.test.specs);
    }
    return [];
}

function getFiles(files) {
    if (_.isArray(files)) {
        return files.map((file) => path.resolve(srcRootDir, file));
    }
    return [path.resolve(srcRootDir, files)];
}