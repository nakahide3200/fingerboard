class FingerBoardApp {
  static get FINGERBOARD_NOTES() {
    return [
      [],
      ['E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E'],
      ['B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'],
      ['G', 'G#/Ab', 'A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G'],
      ['D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D'],
      ['A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A'],
      ['E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E']
    ]
  }

  constructor(selector) {
    this.el = document.querySelector(selector);
    if (!this.el) {
      console.error('Could not find the specified element: ' + selector);
      return;
    }

    this.initElements();
    this.state = '';
    this.doNext();
  }

  initElements() {
    this.el.innerHTML = `
      <div class="main-contanier">
        <div class="question-area">
          <span class="quetsion-label">問題： </span>
          <span class="position"></span>
        </div>
        <div class="answer-area">
          <span class="answer-lable">正解： </span>
          <span class="note"></span>
        </div>
        <button type="button" class="next-btn"></button>
      </div>
    `;

    this.questionAreaEl = this.el.querySelector('.question-area');
    this.answerAreaEl = this.el.querySelector('.answer-area');

    this.positionEl = this.el.querySelector('.position');
    this.noteEl = this.el.querySelector('.note');
    this.nextButton = this.el.querySelector('.next-btn');

    this.nextButton.onclick = (e) => {
      this.doNext();
    }
  }

  doNext() {
    if (this.state == 'question') {
      this.showAnswer();
    } else { // 'answer' or ''
      this.showQuestion();
    }
  }

  showQuestion() {
    this.createQuetsion();
    this.answerAreaEl.style.visibility ='hidden';
    this.nextButton.innerHTML = '正解を見る';
    this.state = 'question'
  }

  showAnswer() {
    this.answerAreaEl.style.visibility ='visible';
    this.nextButton.innerHTML = '次へ';
    this.state = 'answer'
  }

  createQuetsion() {
    const stringNo = Math.floor( Math.random() * 6 ) + 1; // 1 - 6
    const fretNo = Math.floor( Math.random() * 13 ); // 0 - 12

    const position = `${stringNo}弦 ${fretNo}F`;
    const note = FingerBoardApp.FINGERBOARD_NOTES[stringNo][fretNo];

    this.positionEl.innerHTML = position;
    this.noteEl.innerHTML = note;
  }
}
