"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RegexGenerator_1 = require("./RegexGenerator");
const RomajiProcessor_1 = require("./RomajiProcessor");
const CharacterConverter_1 = require("./CharacterConverter");
class Migemo {
    constructor() {
        this.dict = null;
        this.rxop = null;
    }
    queryAWord(word) {
        let generator = this.rxop == null ? RegexGenerator_1.RegexGenerator.getDEFAULT() : new RegexGenerator_1.RegexGenerator(this.rxop[0], this.rxop[1], this.rxop[2], this.rxop[3], this.rxop[4], this.rxop[5]);
        // query自信はもちろん候補に加える
        generator.add(word);
        // queryそのものでの辞書引き
        let lower = word.toLowerCase();
        if (this.dict != null) {
            for (let word of this.dict.predictiveSearch(lower)) {
                generator.add(word);
            }
        }
        // queryを全角にして候補に加える
        let zen = CharacterConverter_1.han2zen_conv(word);
        generator.add(zen);
        // queryを半角にして候補に加える
        let han = CharacterConverter_1.zen2han_conv(word);
        generator.add(han);
        // 平仮名、カタカナ、及びそれによる辞書引き追加
        let hiraganaResult = RomajiProcessor_1.romajiToHiraganaPredictively(lower);
        for (let a of hiraganaResult.predictiveSuffixes) {
            let hira = hiraganaResult.estaglishedHiragana + a;
            generator.add(hira);
            // 平仮名による辞書引き
            if (this.dict != null) {
                for (let b of this.dict.predictiveSearch(hira)) {
                    generator.add(b);
                }
            }
            // 片仮名文字列を生成し候補に加える
            let kata = CharacterConverter_1.hira2kata_conv(hira);
            generator.add(kata);
            // 半角カナを生成し候補に加える
            generator.add(CharacterConverter_1.zen2han_conv(kata));
        }
        return generator.generate();
    }
    query(word) {
        if (word == "") {
            return "";
        }
        let words = this.parseQuery(word);
        let result = "";
        for (let w of words) {
            result += this.queryAWord(w);
        }
        return result;
    }
    setDict(dict) {
        this.dict = dict;
    }
    setRxop(rxop) {
        this.rxop = rxop;
    }
    *parseQuery(query) {
        let re = /[^A-Z\s]+|[A-Z]{2,}|([A-Z][^A-Z\s]+)|([A-Z]\s*$)/g;
        let myArray;
        while ((myArray = re.exec(query)) !== null) {
            yield myArray[0];
        }
    }
}
exports.Migemo = Migemo;
//# sourceMappingURL=Migemo.js.map