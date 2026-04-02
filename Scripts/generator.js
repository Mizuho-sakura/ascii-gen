import { presets } from './presets.js';

export class Generator {
    constructor() {
        this.letterSpacing = 1;
    }

    /**
     * @param {string} text 入力テキスト
     * @param {string} fontName フォント名
     * @returns {string[]} 行ごとの文字列配列
     */
    generate(text, fontName) {
        const fontData = presets[fontName] || presets['block'];
        const charHeight = fontData.height;
        const fallbackChar = fontData.fallback;

        let outputLines = new Array(charHeight).fill("");

        const chars = text.toString().split('');

        chars.forEach((char, index) => {
    
            let charPattern = fontData.chars[char.toUpperCase()];

            // パターンなし　空白　豆腐
            if (!charPattern) {
                charPattern = fallbackChar;
            }

            for (let i = 0; i < charHeight; i++) {
                outputLines[i] += charPattern[i];
                
                if (index < chars.length - 1) {
                    outputLines[i] += " ".repeat(this.letterSpacing);
                }
            }
        });

        return outputLines;
    }
}