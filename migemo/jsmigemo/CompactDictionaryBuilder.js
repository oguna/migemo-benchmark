"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOUDSTrieBuilder_1 = require("./LOUDSTrieBuilder");
const CompactHiraganaString_1 = require("./CompactHiraganaString");
class CompactDictionaryBuilder {
    static build(dict) {
        // remove some keys
        const keysToRemove = new Array();
        for (const key of dict.keys()) {
            try {
                CompactHiraganaString_1.CompactHiraganaString.encodeString(key);
            }
            catch (e) {
                keysToRemove.push(key);
                console.log("skipped the world: " + key);
            }
        }
        for (const key of keysToRemove) {
            dict.delete(key);
        }
        // build key trie
        const keys = Array.from(dict.keys()).sort();
        const generatedKeyIndex = new Uint32Array(keys.length);
        const keyTrie = LOUDSTrieBuilder_1.LOUDSTrieBuilder.build(keys, generatedKeyIndex);
        // build value trie
        const valuesSet = new Set();
        for (const value of dict.values()) {
            for (const v of value) {
                valuesSet.add(v);
            }
        }
        const values = Array.from(valuesSet.values()).sort();
        const valueTrie = LOUDSTrieBuilder_1.LOUDSTrieBuilder.build(values);
        // build trie mapping
        let mappingCount = 0;
        for (const i of dict.values()) {
            mappingCount += i.length;
        }
        const mapping = new Uint32Array(mappingCount);
        let mappingIndex = 0;
        const mappingBitSet = new Array(keyTrie.size() + mappingCount);
        let mappingBitSetIndex = 0;
        for (let i = 1; i <= keyTrie.size(); i++) {
            const key = keyTrie.getKey(i);
            mappingBitSet[mappingBitSetIndex++] = false;
            const value = dict.get(key);
            if (value !== undefined) {
                for (let j = 0; j < value.length; j++) {
                    mappingBitSet[mappingBitSetIndex++] = true;
                    mapping[mappingIndex++] = valueTrie.get(value[j]);
                }
            }
        }
        // calculate output size
        const keyTrieDataSize = 8 + keyTrie.edges.length + ((keyTrie.bitVector.size() + 63) >>> 6) * 8;
        const valueTrieDataSize = 8 + valueTrie.edges.length * 2 + ((valueTrie.bitVector.size() + 63) >>> 6) * 8;
        const mappingDataSize = 8 + ((mappingBitSet.length + 63) >>> 6) * 8 + mapping.length * 4;
        const outputDataSize = keyTrieDataSize + valueTrieDataSize + mappingDataSize;
        // ready output
        const arrayBuffer = new ArrayBuffer(outputDataSize);
        const dataView = new DataView(arrayBuffer);
        let dataViewIndex = 0;
        // output key trie
        dataView.setInt32(dataViewIndex, keyTrie.edges.length);
        dataViewIndex += 4;
        for (let i = 0; i < keyTrie.edges.length; i++) {
            const compactChar = CompactHiraganaString_1.CompactHiraganaString.encodeChar(keyTrie.edges[i]);
            dataView.setUint8(dataViewIndex, compactChar);
            dataViewIndex += 1;
        }
        dataView.setInt32(dataViewIndex, keyTrie.bitVector.size());
        dataViewIndex += 4;
        const keyTrieBitVectorWords = keyTrie.bitVector.words;
        for (let i = 0; i < keyTrieBitVectorWords.length >>> 1; i++) {
            dataView.setUint32(dataViewIndex, keyTrieBitVectorWords[i * 2 + 1]);
            dataViewIndex += 4;
            dataView.setUint32(dataViewIndex, keyTrieBitVectorWords[i * 2]);
            dataViewIndex += 4;
        }
        // output value trie
        dataView.setInt32(dataViewIndex, valueTrie.edges.length);
        dataViewIndex += 4;
        for (let i = 0; i < valueTrie.edges.length; i++) {
            dataView.setUint16(dataViewIndex, valueTrie.edges[i]);
            dataViewIndex += 2;
        }
        dataView.setInt32(dataViewIndex, valueTrie.bitVector.size());
        dataViewIndex += 4;
        const valueTrieBitVectorWords = valueTrie.bitVector.words;
        for (let i = 0; i < valueTrieBitVectorWords.length >>> 1; i++) {
            dataView.setUint32(dataViewIndex, valueTrieBitVectorWords[i * 2 + 1]);
            dataViewIndex += 4;
            dataView.setUint32(dataViewIndex, valueTrieBitVectorWords[i * 2]);
            dataViewIndex += 4;
        }
        // output mapping
        dataView.setInt32(dataViewIndex, mappingBitSetIndex);
        dataViewIndex += 4;
        const mappingWords = this.bitSetToIntArray(mappingBitSet);
        for (let i = 0; i < (mappingWords.length + 1) >> 1; i++) {
            dataView.setUint32(dataViewIndex, mappingWords[i * 2 + 1]);
            dataViewIndex += 4;
            dataView.setUint32(dataViewIndex, mappingWords[i * 2]);
            dataViewIndex += 4;
        }
        dataView.setInt32(dataViewIndex, mapping.length);
        dataViewIndex += 4;
        for (let i = 0; i < mapping.length; i++) {
            dataView.setUint32(dataViewIndex, mapping[i]);
            dataViewIndex += 4;
        }
        // padding to 64bit words
        if (mapping.length % 2 === 1) {
            dataView.setUint32(dataViewIndex, 0);
            dataViewIndex += 4;
        }
        // check data size
        if (dataViewIndex !== outputDataSize) {
            throw new Error(`file size is not valid: expected=${outputDataSize} actual=${dataViewIndex}`);
        }
        return arrayBuffer;
    }
    static bitSetToIntArray(bitSet) {
        const uint32Length = (bitSet.length + 31) >> 5;
        const result = new Uint32Array(uint32Length);
        for (let i = 0; i < bitSet.length; i++) {
            result[i >>> 5] |= (bitSet[i] ? 1 : 0) << (i & 31);
        }
        return result;
    }
}
exports.CompactDictionaryBuilder = CompactDictionaryBuilder;
//# sourceMappingURL=CompactDictionaryBuilder.js.map