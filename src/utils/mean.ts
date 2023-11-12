const useSlot = (element: string | HTMLElement) => {
  // https://stackoverflow.com/questions/27079598/error-failed-to-execute-appendchild-on-node-parameter-1-is-not-of-type-no
  if (typeof element === 'string') {
    const wrap = document.createElement('div');
    wrap.innerHTML = element;
    const el = wrap.children[0];
    document.body.appendChild(el);
    return el;
  }
};


export class MeaningSection {
    private data: any;
    private kanjiJson: any;
    private keyword: string | undefined;
    private kanjiDetail: any;
    private event: MouseEvent | undefined;
    private wrap!: HTMLDivElement;
    private kanji!: HTMLDivElement;
    private hiragana!: HTMLDivElement;
    private detail!: HTMLDivElement;
    private quick!: HTMLAnchorElement;
    private meaningCont!: HTMLDivElement;
    private meaningSection!: HTMLDivElement;
    private kanjiSection!: HTMLDivElement;
    constructor() {
        this.createElement();
        this.hide();
    }

    private readonly wrapHTML = 
    `
    <div class="meaning-container">
      <div class="row">
        <button class="half left">
          Ý nghĩa
        </button>
        <button class="half right">
          Hán tự
        </button>
      </div>
      <div class="row meaning-section">
        <div class="meaning">
          <div class="kanji">
          </div>
          <div class="hiragana">
          </div>
          <ul class="detail">
          </ul>
        </div>
      </div>
      <div class="others">
        <a class="quick"></a>
      </div>
    </div>
    `

    private readonly kanjiHTML = 
    `
     <div class="kanji-section">
                <div class="meaning">
                    <div class="kanji">
                        <ul>
   
                        </ul>
                    </div>
                </div>
                <div class="detail-kanji">
                    <ul>
                     
                    </ul>
                </div>
            </div>
    `

    public render(data: any, kanjiDetail: any, kanjiJson: any, keyword: string, event: MouseEvent) {
      this.show();
      this.data = data;
      this.kanjiJson = kanjiJson;
      this.keyword = keyword;
      this.event = event;
      this.kanjiDetail = kanjiDetail;
      this.calcWhereToShow();
      this.parseInformation();
    }

    public dispatchEvent(event: string, content?: any) {
      if (event === 'button-right') {
        const kanjiSection = useSlot(this.kanjiHTML) as HTMLDivElement;
        if (this.meaningSection && kanjiSection) {
          this.meaningSection.replaceChildren(kanjiSection);
          this.kanjiSection = kanjiSection;
          this.parseKanjiSection(content);
        }
      } else if (event === 'button-left') {
        if (this.meaningSection && this.meaningCont) {
          this.meaningSection.replaceChildren(this.meaningCont);
        }
      }
    }

    public reset() {
      this.kanji.innerHTML = '';
      this.hiragana.innerHTML = '';
      this.detail.innerHTML = '';
      this.quick.innerHTML = '';
    }

    public isShow() {
      return this.wrap.style.display === 'block';
    }

    public hideMeaningSection() {
      this.hide();
    };
    
    private createElement() {
        this.wrap = useSlot(this.wrapHTML) as HTMLDivElement;
        this.kanji = this.wrap.querySelector('.kanji') as HTMLDivElement;
        this.meaningCont = this.wrap.querySelector('.meaning') as HTMLDivElement;
        this.meaningSection = this.wrap.querySelector('.meaning-section') as HTMLDivElement;
        this.hiragana = this.wrap.querySelector('.hiragana') as HTMLDivElement;
        this.detail = this.wrap.querySelector('.detail') as HTMLDivElement;
        this.quick = this.wrap.querySelector('.quick') as HTMLAnchorElement;
    }

    private calcWhereToShow() {
      const { clientX, clientY } = this.event!;
      const { innerWidth, innerHeight } = window;
      const { width, height } = this.wrap.getBoundingClientRect();
      const { style } = this.wrap;
      style.position = 'absolute';
      
      if (clientX + width > innerWidth) {
        style.left = `${clientX - width}px`;
      } else {
        style.left = `${clientX}px`;
      }

      if (clientY + height > innerHeight) {
        style.top = `${clientY - height}px`;
      } else {
        style.top = `${clientY}px`;
      }
    };

    private parseInformation() {
      this.parseHeader();
      this.parseHiragana();
      this.parseMeaning();
      this.parseQuick();
    }

    private parseMeaning() {
      const meansList = this.data[0].means.map((m: any) => m.mean);
      const meanUniq = [...new Set(meansList)];
      for (const mean of meanUniq) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = mean as string;
        span.classList.add('detail-content');
        li.appendChild(span);
        this.detail.appendChild(li);
      }
     
    }

    private parseHeader() {
      const span = document.createElement('span');
      const kanjiHeader = document.createElement('strong');
      kanjiHeader.classList.add('kanji-detail');
      
      const hanVietHeader = document.createElement('strong');
      hanVietHeader.classList.add('hanviet-detail');


      kanjiHeader.textContent = this.keyword!;
      hanVietHeader.textContent = this.findHanViet();
      span.appendChild(kanjiHeader);
      span.appendChild(hanVietHeader);
      this.kanji.appendChild(span);
    };

    private parseHiragana() {
      const span = document.createElement('span');
      span.textContent = this.data[0].phonetic;
      this.hiragana.appendChild(span);
    };
    
    private parseKanjiSection(content? : any) {
      const wordFound = content ? content : this.keyword?.split('')[0];
      const kanjiList = this.keyword!.split('');
      const kanjiUl = this.kanjiSection.querySelector('.kanji ul') as HTMLUListElement;
      for (const kanji of kanjiList) {
        const li = document.createElement('li');
        li.classList.add('half-kanji');
        const button = document.createElement('button');
        button.textContent = kanji;
        button.classList.add('detail-content');
        li.appendChild(button);
        kanjiUl.appendChild(li);
      };

      this.parseDetailKanji(wordFound);
    }

    private parseDetailKanji(word: any) {
      const kanjiDetail = this.kanjiSection.querySelector('.detail-kanji ul') as HTMLUListElement;
      const titleLi = this.buildTitleDetailEachKanji(word);

      for (const [key, value] of Object.entries(titleLi)) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        const strong = document.createElement('strong');
        strong.textContent = key;
        span.textContent = value as string;
        span.classList.add('detail-content');
        li.appendChild(strong);
        li.appendChild(span);
        kanjiDetail.appendChild(li);
      }
    } 

    private buildTitleDetailEachKanji(word: any) {
      const kanjiDetail = this.kanjiDetail.filter((k: any) => k.kanji === word);
  
      return ({
        'Bộ': word,
        'Âm On': kanjiDetail[0].on,
        'Âm Kun': kanjiDetail[0].kun,
        'Số nét': kanjiDetail[0].stroke_count,
      })
    }

    private parseQuick() {
      this.quick.textContent = 'Xem thêm';
      this.quick.href = `https://mazii.net/search?query=${this.keyword}`;
      this.quick.target = '_blank';
    };

    
    // input: 知識
    // output: 'tri thức'
    private findHanViet() {
      const matchHanViet: { [key: string]: string } = {};
      let hanViet = '';
      for (let i = 0; i < this.keyword!.length; i++) {
        const keywordChar = this.keyword![i];
    
        for (const obj of this.kanjiJson) {
          if (obj.w.includes(keywordChar)) {
            matchHanViet[keywordChar] = obj.h;
            break; 
          }
        }
      }
      
      for (const [_, value] of Object.entries(matchHanViet)) {
        const [firstValue] = value.split(', ');
        hanViet += `${firstValue} `;
      }

      return hanViet;
    }

    private hide() {
      this.wrap.style.display = 'none';
    }

    private show() {
      this.wrap.style.display = 'block';
    }
};

const meaningSection = new MeaningSection();

export { meaningSection };
