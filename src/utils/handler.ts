// http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
export const isJapanese = (text?: string): boolean => {
  const japaneseRegex = /^[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]+$/;
  return text ? japaneseRegex.test(text) : false;
}
