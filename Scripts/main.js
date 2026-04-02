import { Generator } from './generator.js';
import { Effects } from './effects.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';
import { presets } from './presets.js';

class App {
    constructor() {
        this.generator = new Generator();
        this.effects = new Effects();
        this.storage = new Storage();

        this.ui = new UI({
            onInput: (state) => this.updatePreview(state),
            onSave: (text) => this.saveFile(text),
            onHistorySelect: (text) => this.restoreFromHistory(text),
            onHistoryAdd: (text) => this.storage.addHistory(text),
            onReset: () => this.ui.reset()
        });

        this.init();
    }

    init() {
        const fontNames = Object.keys(presets);
        this.ui.setupFontSelector(fontNames);
        const history = this.storage.getHistory();
        this.ui.renderHistory(history);
        // 初回描画
        this.ui.triggerUpdate();
    }

    updatePreview(state) {
        const { text, font, options } = state;

        if (!text) {
            this.ui.renderOutput("");
            return;
        }

        let lines = this.generator.generate(text, font);
        lines = this.effects.apply(lines, options);

        const result = lines.join('\n');
        this.ui.renderOutput(result, options.align);
    }

    saveFile(content) {
        if (!content) return;
        this.storage.download(content);
    }

    restoreFromHistory(text) {
        this.ui.setInputValue(text);
        this.ui.triggerUpdate();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
document.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('catalog-modal');
    const openBtn = document.getElementById('btn-open-catalog');
    const closeBtn = document.getElementById('btn-close-catalog');
    const grid = document.getElementById('catalog-grid');
    const fontSelect = document.getElementById('select-font'); 


    const fonts = [
        { id: 'SOLID05',     name: 'SOLID-05(Default)',         img: 'images/solid05.png' },
        { id: 'NeoSMOOTH',   name: 'NeoSmooth',       img: 'images/neosmooth.png' },
        { id: 'MONOLITH08',  name: 'MONOLITH-08',      img: 'images/monolith.png' },
        { id: 'GrandARCH',   name: 'GRAND-ARCH',       img: 'images/grandarch.png' }
    ];

    const renderCatalog = () => {
        grid.innerHTML = ''; 
        const currentFont = fontSelect.value;

        fonts.forEach(font => {
            const card = document.createElement('div');
            card.className = `font-card ${font.id === currentFont ? 'active-card' : ''}`;
            
            card.innerHTML = `
                <img src="${font.img}" alt="${font.name}" class="font-card-img" onerror="this.src='https://placehold.co/600x200?text=No+Image'">
                <div class="font-card-info">
                    <span class="font-name">${font.name}</span>
                    <span class="select-label">APPLY</span>
                </div>
            `;

            card.addEventListener('click', () => {
                fontSelect.value = font.id;
                fontSelect.dispatchEvent(new Event('change'));
                closeModal();
            });

            grid.appendChild(card);
        });
    };

    const openModal = () => {
        renderCatalog(); 
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
});