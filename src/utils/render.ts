import { meaningSection } from "./mean";

class Render {
    constructor() {}

    public static meanSection(data: any, kanjiDetail: any, kanjiJson: any, keyword: string, event: MouseEvent) {
        meaningSection.reset();
        meaningSection.render(data, kanjiDetail, kanjiJson, keyword, event);
    }

    public static getMeanSection() {
        return meaningSection;
    }
};

export { Render };