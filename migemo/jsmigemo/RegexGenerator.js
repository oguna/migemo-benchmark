"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegexNode {
    constructor(code) {
        this.code = code;
        this.child = null;
        this.next = null;
    }
}
exports.RegexNode = RegexNode;
class RegexGenerator {
    constructor(or, beginGroup, endGroup, beginClass, endClass, newline) {
        this.or = or;
        this.beginGroup = beginGroup;
        this.endGroup = endGroup;
        this.beginClass = beginClass;
        this.endClass = endClass;
        this.newline = newline;
        this.root = null;
    }
    static getDEFAULT() {
        return new RegexGenerator("|", "(", ")", "[", "]", "");
    }
    static _add(node, word, offset) {
        if (node == null) {
            if (offset >= word.length) {
                return null;
            }
            node = new RegexNode(word[offset]);
            if (offset < word.length - 1) {
                node.child = RegexGenerator._add(null, word, offset + 1);
            }
            return node;
        }
        let thisNode = node;
        const code = word[offset];
        if (code < node.code) {
            let newNode = new RegexNode(code);
            newNode.next = node;
            node = newNode;
            if (offset < word.length) {
                node.child = RegexGenerator._add(null, word, offset + 1);
            }
            thisNode = node;
        }
        else {
            while (node.next != null && node.next.code <= code) {
                node = node.next;
            }
            if (node.code == code) {
                if (node.child == null) {
                    return thisNode;
                }
            }
            else {
                let newNode = new RegexNode(code);
                newNode.next = node.next;
                node.next = newNode;
                node = newNode;
            }
            if (word.length == offset + 1) {
                node.child = null;
                return thisNode;
            }
            node.child = RegexGenerator._add(node.child, word, offset + 1);
        }
        return thisNode;
    }
    add(word) {
        if (word.length == 0) {
            return;
        }
        this.root = RegexGenerator._add(this.root, word, 0);
    }
    _generateStub(node) {
        const escapeCharacters = "\\.[]{}()*+-?^$|";
        let brother = 1;
        let haschild = 0;
        let buf = "";
        for (let tmp = node; tmp != null; tmp = tmp.next) {
            if (tmp.next != null) {
                brother++;
            }
            if (tmp.child != null) {
                haschild++;
            }
        }
        let nochild = brother - haschild;
        if (brother > 1 && haschild > 0) {
            buf += this.beginGroup;
        }
        if (nochild > 0) {
            if (nochild > 1) {
                buf = buf + this.beginClass;
            }
            for (let tmp = node; tmp != null; tmp = tmp.next) {
                if (tmp.child != null) {
                    continue;
                }
                if (escapeCharacters.indexOf(tmp.code) != -1) {
                    buf = buf + "\\";
                }
                buf = buf + tmp.code;
            }
            if (nochild > 1) {
                buf += this.endClass;
            }
        }
        if (haschild > 0) {
            if (nochild > 0) {
                buf += this.or;
            }
            let tmp = null;
            for (tmp = node; tmp.child == null; tmp = tmp.next) {
            }
            while (true) {
                if (escapeCharacters.indexOf(tmp.code) != -1) {
                    buf += "\\";
                }
                buf = buf + tmp.code;
                if (this.newline != null) {
                    buf += this.newline;
                }
                buf = buf + this._generateStub(tmp.child);
                for (tmp = tmp.next; tmp != null && tmp.child == null; tmp = tmp.next) {
                }
                if (tmp == null) {
                    break;
                }
                if (haschild > 1) {
                    buf += this.or;
                }
            }
        }
        if (brother > 1 && haschild > 0) {
            buf += this.endGroup;
        }
        return buf;
    }
    generate() {
        if (this.root == null) {
            return "";
        }
        else {
            return this._generateStub(this.root);
        }
    }
}
exports.RegexGenerator = RegexGenerator;
//# sourceMappingURL=RegexGenerator.js.map