export class Effects {
    /**
     * @param {string[]} lines アスキーアート行配列
     * @param {object} options { shadow, border, underline }
     */
    apply(lines, options) {
        if (!lines || lines.length === 0) return [];

        let processed = [...lines]; 
        if (options.shadow) {
            processed = this.addShadow(processed);
        }
        if (options.underline) {
            processed = this.addUnderline(processed);
        }
        if (options.border) {
            processed = this.addBorder(processed);
        }
        return processed;
    }

    addShadow(lines) {
        const height = lines.length;
        const width = lines[0].length;
        const shadowChar = "░";

        const newLines = new Array(height + 1).fill("");
        
        for (let y = 0; y <= height; y++) {
            let rowStr = "";
            for (let x = 0; x <= width; x++) {
                const charHere = (y < height && x < width) ? lines[y][x] : " ";
                const isSolid = charHere !== " ";

                let shouldShadow = false;
                if (y > 0 && x > 0 && y - 1 < height && x - 1 < width) {
                    if (lines[y - 1][x - 1] !== " ") {
                        shouldShadow = true;
                    }
                }

                if (isSolid) {
                    rowStr += charHere;
                } else if (shouldShadow) {
                    rowStr += shadowChar;
                } else {
                    rowStr += " ";
                }
            }
            newLines[y] = rowStr;
        }
        return newLines;
    }

    addUnderline(lines) {
        const width = Math.max(...lines.map(l => l.length));
        const separator = "═".repeat(width);
        return [...lines, separator];
    }

    addBorder(lines) {
        const width = Math.max(...lines.map(l => l.length));
        const top = "╔" + "═".repeat(width + 2) + "╗";
        const bottom = "╚" + "═".repeat(width + 2) + "╝";
        
        const content = lines.map(line => {
            const padded = line.padEnd(width, " ");
            return `║ ${padded} ║`;
        });

        return [top, ...content, bottom];
    }
}
