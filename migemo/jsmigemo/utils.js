"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function binarySearch(a, fromIndex, toIndex, key) {
    var low = fromIndex;
    var high = toIndex - 1;
    while (low <= high) {
        const mid = (low + high) >>> 1;
        const midVal = a[mid];
        if (midVal < key)
            low = mid + 1;
        else if (midVal > key)
            high = mid - 1;
        else
            return mid;
    }
    return -(low + 1);
}
exports.binarySearch = binarySearch;
function binarySearchUint16(a, fromIndex, toIndex, key) {
    var low = fromIndex;
    var high = toIndex - 1;
    while (low <= high) {
        const mid = (low + high) >>> 1;
        const midVal = a[mid];
        if (midVal < key)
            low = mid + 1;
        else if (midVal > key)
            high = mid - 1;
        else
            return mid;
    }
    return -(low + 1);
}
exports.binarySearchUint16 = binarySearchUint16;
function binarySearchString(a, fromIndex, toIndex, key) {
    var low = fromIndex;
    var high = toIndex - 1;
    while (low <= high) {
        const mid = (low + high) >>> 1;
        const midVal = a[mid];
        if (midVal < key)
            low = mid + 1;
        else if (midVal > key)
            high = mid - 1;
        else
            return mid;
    }
    return -(low + 1);
}
exports.binarySearchString = binarySearchString;
function bitCount(i) {
    i = i - ((i >>> 1) & 0x55555555);
    i = (i & 0x33333333) + ((i >>> 2) & 0x33333333);
    i = (i + (i >>> 4)) & 0x0f0f0f0f;
    i = i + (i >>> 8);
    i = i + (i >>> 16);
    return i & 0x3f;
}
exports.bitCount = bitCount;
function numberOfTrailingZeros(i) {
    let x, y;
    if (i == 0)
        return 64;
    let n = 63;
    y = i;
    if (y != 0) {
        n = n - 32;
        x = y;
    }
    else
        x = (i >>> 32);
    y = x << 16;
    if (y != 0) {
        n = n - 16;
        x = y;
    }
    y = x << 8;
    if (y != 0) {
        n = n - 8;
        x = y;
    }
    y = x << 4;
    if (y != 0) {
        n = n - 4;
        x = y;
    }
    y = x << 2;
    if (y != 0) {
        n = n - 2;
        x = y;
    }
    return n - ((x << 1) >>> 31);
}
exports.numberOfTrailingZeros = numberOfTrailingZeros;
//# sourceMappingURL=utils.js.map