"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class LOUDSTrie {
    constructor(bitVector, edges) {
        this.bitVector = bitVector;
        this.edges = edges;
    }
    getKey(index) {
        if (index <= 0 || this.edges.length <= index) {
            throw new RangeError();
        }
        let sb = new Array();
        while (index > 1) {
            sb.push(this.edges[index]);
            index = this.parent(index);
        }
        return sb.reverse().map(v => String.fromCharCode(v)).join('');
    }
    parent(x) {
        return this.bitVector.rank(this.bitVector.select(x, true), false);
    }
    firstChild(x) {
        let y = this.bitVector.select(x, false) + 1;
        if (this.bitVector.get(y)) {
            return this.bitVector.rank(y, true) + 1;
        }
        else {
            return -1;
        }
    }
    traverse(index, c) {
        let firstChild = this.firstChild(index);
        if (firstChild == -1) {
            return -1;
        }
        let childStartBit = this.bitVector.select(firstChild, true);
        let childEndBit = this.bitVector.nextClearBit(childStartBit);
        let childSize = childEndBit - childStartBit;
        let result = utils_1.binarySearchUint16(this.edges, firstChild, firstChild + childSize, c);
        return result >= 0 ? result : -1;
    }
    get(key) {
        let nodeIndex = 1;
        for (let i = 0; i < key.length; i++) {
            let c = key.charCodeAt(i);
            nodeIndex = this.traverse(nodeIndex, c);
            if (nodeIndex == -1) {
                break;
            }
        }
        return (nodeIndex >= 0) ? nodeIndex : -1;
    }
    *iterator(index) {
        yield index;
        let child = this.firstChild(index);
        if (child == -1) {
            return;
        }
        let childPos = this.bitVector.select(child, true);
        while (this.bitVector.get(childPos)) {
            yield* this.iterator(child);
            child++;
            childPos++;
        }
    }
    size() {
        return this.edges.length - 2;
    }
}
exports.LOUDSTrie = LOUDSTrie;
//# sourceMappingURL=LOUDSTrie.js.map