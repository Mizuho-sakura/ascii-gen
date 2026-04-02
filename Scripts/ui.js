export class UI {
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.elements = {
            input: document.getElementById('input-text'),
            selectFont: document.getElementById('select-font'),
            output: document.getElementById('ascii-output'),
            chkShadow: document.getElementById('chk-shadow'),
            chkBorder: document.getElementById('chk-border'),
            chkLine: document.getElementById('chk-line'),
            radiosAlign: document.getElementsByName('align'),
            btnCopy: document.getElementById('btn-copy'),
            btnSave: document.getElementById('btn-save'),
            btnReset: document.getElementById('btn-reset'),
            historyList: document.getElementById('history-list')
        };

        this.bindEvents();
    }

    bindEvents() {
        const inputs = [
            this.elements.input,
            this.elements.selectFont,
            this.elements.chkShadow,
            this.elements.chkBorder,
            this.elements.chkLine
        ];

        inputs.forEach(el => {
            el.addEventListener('input', () => this.triggerUpdate());
        });

        this.elements.radiosAlign.forEach(el => {
            el.addEventListener('change', () => this.triggerUpdate());
        });

        this.elements.btnCopy.addEventListener('click', () => this.copyToClipboard());
        
        this.elements.btnSave.addEventListener('click', () => {
            const text = this.elements.output.textContent;
            this.callbacks.onSave(text);

            const inputVal = this.elements.input.value;
            if (inputVal.trim()) {
                const newHistory = this.callbacks.onHistoryAdd(inputVal);
                this.renderHistory(newHistory);
            }
        });

        this.elements.btnReset.addEventListener('click', () => this.callbacks.onReset());
    }

    triggerUpdate() {
        const state = this.getState();
        this.callbacks.onInput(state);
    }

    getState() {
        let align = 'left';
        this.elements.radiosAlign.forEach(r => { if(r.checked) align = r.value; });

        return {
            text: this.elements.input.value,
            font: this.elements.selectFont.value,
            options: {
                shadow: this.elements.chkShadow.checked,
                border: this.elements.chkBorder.checked,
                underline: this.elements.chkLine.checked,
                align: align
            }
        };
    }

    renderOutput(text, align = 'left') {
        this.elements.output.textContent = text;
        this.elements.output.style.textAlign = align;
        

        if(align === 'center') {
            this.elements.output.parentElement.style.display = 'flex';
            this.elements.output.parentElement.style.justifyContent = 'center';
        } else {
            this.elements.output.parentElement.style.display = 'block';
        }
    }

    setupFontSelector(fontNames) {
        this.elements.selectFont.innerHTML = '';
        fontNames.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name.toUpperCase();
            this.elements.selectFont.appendChild(opt);
        });
    }

    setInputValue(text) {
        this.elements.input.value = text;
    }

    async copyToClipboard() {
        const text = this.elements.output.textContent;
        try {
            await navigator.clipboard.writeText(text);
            const originalText = this.elements.btnCopy.textContent;
            this.elements.btnCopy.textContent = "COPIED!";
            this.elements.btnCopy.classList.add('primary');
            
            setTimeout(() => {
                this.elements.btnCopy.textContent = originalText;
            }, 1000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    }

    renderHistory(history) {
        this.elements.historyList.innerHTML = '';
        history.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            li.addEventListener('click', () => {
                this.callbacks.onHistorySelect(text);
            });
            this.elements.historyList.appendChild(li);
        });
    }

    reset() {
        this.elements.input.value = "";
        this.triggerUpdate();
    }
}