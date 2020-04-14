"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const LB = 512;
const SB = 64;
class BitVector {
    constructor(words, sizeInBits) {
        if ((sizeInBits + 63) >> 5 != words.length) {
            throw new Error();
        }
        this.words = words;
        this.sizeInBits = sizeInBits;
        this.lb = new Uint32Array((sizeInBits + 511) >>> 9);
        this.sb = new Uint16Array(this.lb.length * 8);
        let sum = 0;
        let sumInLb = 0;
        for (let i = 0; i < this.sb.length; i++) {
            let bc = i < (this.words.length >>> 1) ? utils_1.bitCount(this.words[i * 2]) + utils_1.bitCount(this.words[i * 2 + 1]) : 0;
            this.sb[i] = sumInLb;
            sumInLb += bc;
            if ((i & 7) == 7) {
                this.lb[i >> 3] = sum;
                sum += sumInLb;
                sumInLb = 0;
            }
        }
    }
    rank(pos, b) {
        if (pos < 0 && this.sizeInBits <= pos) {
            throw new RangeError();
        }
        let count1 = this.sb[pos >>> 6] + this.lb[pos >>> 9];
        const posInDWord = pos & 63;
        if (posInDWord >= 32) {
            count1 += utils_1.bitCount(this.words[(pos >>> 5) & 0xFFFFFFFE]);
        }
        const posInWord = pos & 31;
        const mask = 0x7FFFFFFF >>> (31 - posInWord);
        count1 += utils_1.bitCount(this.words[pos >>> 5] & mask);
        return b ? count1 : (pos - count1);
    }
    select(count, b) {
        let lbIndex = this.lowerBoundBinarySearchLB(count, b) - 1;
        let countInLb = count - (b ? this.lb[lbIndex] : (512 * lbIndex - this.lb[lbIndex]));
        let sbIndex = this.lowerBoundBinarySearchSB(countInLb, lbIndex * 8, lbIndex * 8 + 8, b) - 1;
        let countInSb = countInLb - (b ? this.sb[sbIndex] : (64 * (sbIndex % 8) - this.sb[sbIndex]));
        let wordL = this.words[sbIndex * 2];
        let wordU = this.words[sbIndex * 2 + 1];
        if (!b) {
            wordL = ~wordL;
            wordU = ~wordU;
        }
        let lowerBitCount = utils_1.bitCount(wordL);
        let i = 0;
        if (countInSb > lowerBitCount) {
            wordL = wordU;
            countInSb -= lowerBitCount;
            i = 32;
        }
        while (countInSb > 0) {
            countInSb -= wordL & 1;
            wordL >>>= 1;
            i++;
        }
        return sbIndex * 64 + (i - 1);
    }
    lowerBoundBinarySearchLB(key, b) {
        let high = this.lb.length;
        let low = -1;
        while (high - low > 1) {
            let mid = (high + low) >>> 1;
            if ((b ? this.lb[mid] : 512 * mid - this.lb[mid]) < key) {
                low = mid;
            }
            else {
                high = mid;
            }
        }
        return high;
    }
    lowerBoundBinarySearchSB(key, fromIndex, toIndex, b) {
        let high = toIndex;
        let low = fromIndex - 1;
        while (high - low > 1) {
            let mid = (high + low) >>> 1;
            if ((b ? this.sb[mid] : 64 * (mid & 7) - this.sb[mid]) < key) {
                low = mid;
            }
            else {
                high = mid;
            }
        }
        return high;
    }
    nextClearBit(fromIndex) {
        let u = fromIndex >> 5;
        let word = ~this.words[u] & (0xffffffff << fromIndex);
        while (true) {
            if (word != 0)
                return (u * 32) + utils_1.numberOfTrailingZeros(word);
            if (++u == this.words.length)
                return -1;
            word = ~this.words[u];
        }
    }
    size() {
        return this.sizeInBits;
    }
    get(pos) {
        if (pos < 0 && this.sizeInBits <= pos) {
            throw new RangeError();
        }
        return ((this.words[pos >>> 5] >>> (pos & 31)) & 1) == 1;
    }
    toString() {
        let s = "";
        for (let i = 0; i < this.sizeInBits; i++) {
            const bit = ((this.words[i >>> 6] >>> (i & 63)) & 1) == 1;
            s += bit ? '1' : '0';
            if ((i & 63) == 63) {
                s += ' ';
            }
        }
        return s;
    }
}
exports.BitVector = BitVector;
//# sourceMappingURL=BitVector.js.map