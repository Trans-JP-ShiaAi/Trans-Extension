
export const kanjiJsonUrl = chrome.runtime.getURL("kanji.json");

export const setKanjiJson = (kanjiJson: any): Promise<void> => {
    const vals = { kanji: kanjiJson }
    return new Promise((resolve) => {
        chrome.storage.local.set(vals, () => {
            resolve();
        });
    });    
}

export const getKanjiJson = (keyword: string): Promise<any> => {
    return new Promise((resolve) => {
        chrome.storage.local.get(keyword, (result) => {
            resolve(result.kanji);
        });
    });
}

export const clearStorage = (): Promise<void> => {
    return new Promise((resolve) => {
        chrome.storage.local.clear(() => {
            resolve();
        });
    });
}