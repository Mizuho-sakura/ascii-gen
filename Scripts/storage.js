export class Storage {
    constructor() {
        this.KEY = 'ascii_gen_history';
        this.maxHistory = 10;
    }

    getHistory() {
        const json = localStorage.getItem(this.KEY);
        return json ? JSON.parse(json) : [];
    }

    addHistory(text) {
        let history = this.getHistory();
        
        history = history.filter(item => item !== text);
        history.unshift(text);

        if (history.length > this.maxHistory) {
            history.pop();
        }

        localStorage.setItem(this.KEY, JSON.stringify(history));
        return history;
    }

    download(content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.href = url;
        a.download = `ascii_logo_${timestamp}.txt`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}