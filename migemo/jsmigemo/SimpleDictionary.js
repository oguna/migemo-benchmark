"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class SimpleDictionary {
    constructor(keys, values) {
        this.keys = keys;
        this.values = values;
    }
    static build(file) {
        let lines = file.split("\n");
        let keyValuePairs = Array();
        for (let line of lines) {
            if (!line.startsWith(";") && line.length != 0) {
                let semicolonPos = line.indexOf('\t');
                let key = line.substr(0, semicolonPos);
                let value = line.substr(semicolonPos + 1);
                keyValuePairs.push([key, value]);
            }
        }
        keyValuePairs.sort((a, b) => {
            if (a[0] > b[0]) {
                return 1;
            }
            else {
                return -1;
            }
        });
        let keys = keyValuePairs.map((a) => a[0]);
        let values = keyValuePairs.map((a) => a[1]);
        return new SimpleDictionary(keys, values);
    }
    predictiveSearch(hiragana) {
        if (hiragana.length > 0) {
            let stop = hiragana.substring(0, hiragana.length - 1) + String.fromCodePoint(hiragana.codePointAt(hiragana.length - 1) || 0 + 1);
            let startPos = utils_1.binarySearchString(this.keys, 0, this.keys.length, hiragana);
            if (startPos < 0) {
                startPos = -(startPos + 1);
            }
            let endPos = utils_1.binarySearchString(this.keys, 0, this.keys.length, stop);
            if (endPos < 0) {
                endPos = -(endPos + 1);
            }
            let result = Array();
            for (let i = startPos; i < endPos; i++) {
                for (let j of this.values[i].split("\t")) {
                    result.push(j);
                }
            }
            return result;
        }
        else {
            return [];
        }
    }
}
//# sourceMappingURL=SimpleDictionary.js.map