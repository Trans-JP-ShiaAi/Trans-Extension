import API from "./utils/api";
import { isJapanese } from "./utils/handler";
import { loadJson } from "./utils/load";
import { Render } from './utils/render';
import { meaningSection } from "./utils/mean";


(() => {
  document.addEventListener("dblclick", async (event) => {
    const selectedText: string | undefined = window.getSelection()?.toString().trim(); 
    if (isJapanese(selectedText)) {
      const response = await API.postWord(selectedText);
      const kanjiDetail = await API.postKanji(selectedText);
      const kanjiJson = await loadJson();
      const meaning = response.data;

      await buildSectionMeaning(meaning, kanjiDetail.results, kanjiJson, selectedText as string, event);
    }
  });


  document.addEventListener("click", (event) => {
    const meaningContainer = document.querySelector(".meaning-container");
    if (meaningContainer?.contains(event.target as Node)) {
        const clickedButton = event.target as HTMLElement;
        if (clickedButton?.classList.contains("left")) {
          meaningSection.dispatchEvent("button-left");
         
          // if 
        } else {
          
          if (clickedButton?.classList.contains("detail-content")) {
            const content = clickedButton?.textContent;
            return meaningSection.dispatchEvent("button-right", content);
          };


          meaningSection.dispatchEvent("button-right");
        }

    } else {
      meaningSection.hideMeaningSection();
    }
    
  });

})();

const buildSectionMeaning = async (meaning: string, kanjiDetail: string, kanjiJson: any, selectedText : string, event: MouseEvent) => {
  Render.meanSection(meaning, kanjiDetail, kanjiJson, selectedText, event);
};