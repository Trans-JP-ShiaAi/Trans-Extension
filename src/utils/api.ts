class Api {
    private baseUrl: string;
    private payload = {
        dict: 'javi',
        limit: 20,
        page: 1,
        query: '',
        type: 'word'
    }

    private loadKanjiPayload = {
        "dict": "javi",
        "type": "kanji",
        "page": 1
    };


    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async postWord(word: any): Promise<any> {
        const payload = Object.assign({}, this.payload, { query: word });
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) // Convert the object to a JSON string
        });
        return response.json();
    }

    async postKanji(kanji: any): Promise<any> {
        const payload = Object.assign({}, this.loadKanjiPayload, { query: kanji });
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) // Convert the object to a JSON string
        });
        return response.json();
    }
    
    async put(endpoint: string, data: any): Promise<any> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async delete(endpoint: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE'
        });
        return response.json();
    }
    async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

const API = new Api('https://mazii.net/api/search');
export default API;
