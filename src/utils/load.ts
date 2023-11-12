import { isEmpty } from "lodash";
import { getKanjiJson, kanjiJsonUrl, setKanjiJson } from "./storage"; 


export const loadJson = async () => {
    try {
      const kanji = await getKanjiJson('kanji');

      if (!isEmpty(kanji)) {
          return kanji;
      }
      const response = await fetch(kanjiJsonUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      await setKanjiJson(data);

     return data;
    } catch (error) {
      console.error(error);
  
    }
  }