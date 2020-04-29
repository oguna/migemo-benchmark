"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BitList {
    constructor(size) {
        if (size == undefined) {
            this.words = new Uint32Array(8);
            this.size = 0;
        }
        else {
            this.words = new Uint32Array((size + 31) >> 5);
            this.size = size;
        }
    }
    add(value) {
        if (this.words.length < (this.size + 1 + 31) >> 5) {
            this.words = new Uint32Array(this.words.buffer, 0, this.words.length * 2);
        }
        this.set(this.size, value);
        this.size++;
    }
    set(pos, value) {
        if (this.size < pos) {
            throw new Error();
        }
        if (value) {
            this.words[pos >> 5] |= 1 << (pos & 31);
        }
        else {
            this.words[pos >> 5] &= ~(1 << (pos & 31));
        }
    }
    get(pos) {
        if (this.size < pos) {
            throw new Error();
        }
        return ((this.words[pos >> 5] >> (pos & 31)) & 1) == 1;
    }
}
exports.BitList = BitList;
//# sourceMappingURL=BitList.js.map