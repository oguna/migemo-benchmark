const fs = require('fs')
const text = fs.readFileSync('dataset/kokoro.txt', 'utf16le');

const map = new Map([
    ['あ', 'a'],
    ['い', 'i'],
    ['う', 'u'],
    ['え', 'e'],
    ['お', 'o'],
    ['か', 'ka'],
    ['き', 'ki'],
    ['く', 'ku'],
    ['け', 'ke'],
    ['こ', 'ko'],
    ['さ', 'sa'],
    ['し', 'si'],
    ['す', 'su'],
    ['せ', 'se'],
    ['そ', 'so'],
    ['た', 'ta'],
    ['ち', 'ti'],
    ['つ', 'tu'],
    ['て', 'te'],
    ['と', 'to'],
    ['な', 'na'],
    ['に', 'ni'],
    ['ぬ', 'nu'],
    ['ね', 'ne'],
    ['の', 'no'],
    ['は', 'ha'],
    ['ひ', 'hi'],
    ['ふ', 'hu'],
    ['へ', 'he'],
    ['ほ', 'ho'],
    ['ま', 'ma'],
    ['み', 'mi'],
    ['む', 'mu'],
    ['め', 'me'],
    ['も', 'mo'],
    ['や', 'ya'],
    ['ゆ', 'yu'],
    ['よ', 'yo'],
    ['ら', 'ra'],
    ['り', 'ri'],
    ['る', 'ru'],
    ['れ', 're'],
    ['ろ', 'ro'],
    ['わ', 'wa'],
    ['を', 'wo'],
    ['ん', 'nn'],
    ['が', 'ga'],
    ['ぎ', 'gi'],
    ['ぐ', 'gu'],
    ['げ', 'ge'],
    ['ご', 'go'],
    ['ざ', 'za'],
    ['じ', 'zi'],
    ['ず', 'zu'],
    ['ぜ', 'ze'],
    ['ぞ', 'zo'],
    ['だ', 'da'],
    ['ぢ', 'di'],
    ['づ', 'du'],
    ['で', 'de'],
    ['ど', 'do'],
    ['ば', 'ba'],
    ['び', 'bi'],
    ['ぶ', 'bu'],
    ['べ', 'be'],
    ['ぼ', 'bo'],
    ['ぱ', 'pa'],
    ['ぴ', 'pi'],
    ['ぷ', 'pu'],
    ['ぺ', 'pe'],
    ['ぽ', 'po'],
    ['ぁ', 'xa'],
    ['ぃ', 'xa'],
    ['ぅ', 'xa'],
    ['ぇ', 'xa'],
    ['ぉ', 'xa'],
    ['ゃ', 'xya'],
    ['ゅ', 'xyu'],
    ['ょ', 'xyo'],
    ['っ', 'xtu']
])

function hiragana2romaji(hiragana) {
    let buffer = ""
    for (let i = 0; i < hiragana.length; i++) {
        let c = hiragana[i]
        let a = map.get(c)
        if (a === undefined) {
            buffer += c;
        } else {
            buffer += a;
        }
    }
    return buffer;
}

const regex1 = /《([ぁ-ん]+)》/g;
let array1;
let result = []
while ((array1 = regex1.exec(text)) != null) {
    result.push(array1[1])
    //console.log(`${array1[1]}`);
}

fs.writeFileSync("a.txt", result.map((e) => hiragana2romaji(e)).join('\n'), {encoding: 'utf-8'})
