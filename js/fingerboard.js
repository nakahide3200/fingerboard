class FingerboardApp {
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

  static get MESSAGES() {
    return [
      '明日のギターヒーローは君だ！',
      '明日のロックスターは君だ！',
      '明日のジャズの帝王は君だ！',
      '明日の三大ギタリストは君だ！'
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
      <div class="fingerboard-app">
        <div class="message"></div>
        <div class="question-answer-area">
          <div class="question-area">
            <span class="quetsion-label">問題： </span>
            <span class="position"></span>
          </div>
          <canvas class="fingerboard-image"></canvas>
          <div class="answer-area">
            <span class="answer-lable">正解： </span>
            <span class="note"></span>
          </div>
        </div>
        <button type="button" class="next-btn"></button>
      </div>
    `;

    this.questionAreaEl = this.el.querySelector('.question-area');
    this.answerAreaEl = this.el.querySelector('.answer-area');

    this.messageEl = this.el.querySelector('.message');

    this.positionEl = this.el.querySelector('.position');
    this.noteEl = this.el.querySelector('.note');
    this.nextButton = this.el.querySelector('.next-btn');

    this.nextButton.onclick = (e) => {
      this.doNext();
    }

    this.fingerboardImage = new FingerboardImage('.fingerboard-image');
  }

  doNext() {
    if (this.state == 'question') {
      this.showAnswer();
    } else { // 'answer' or ''
      this.showQuestion();
    }
  }

  showQuestion() {
    this.setMessage();
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
    const note = FingerboardApp.FINGERBOARD_NOTES[stringNo][fretNo];

    this.positionEl.innerHTML = position;
    this.noteEl.innerHTML = note;

    this.fingerboardImage.clearPostion();
    this.fingerboardImage.drawPostion(stringNo, fretNo);
  }

  setMessage() {
    this.messageEl.innerHTML = FingerboardApp.MESSAGES[Math.floor( Math.random() * FingerboardApp.MESSAGES.length )]
  }
}

class FingerboardImage {
  constructor(selector) {
    this.canvas = document.querySelector(selector);
    if (!this.canvas) {
      console.error('Could not find the specified element: ' + selector);
      return;
    }

    this.ctx = this.canvas.getContext('2d');

    this.initParams();
    this.drawFingerboard();
  }

  initParams() {
    this.cellWidth = 28;
    this.cellHeight = 20;

    this.marginTop = 20;
    this.marginBottom = 20;
    this.marginLeft = 35;
    this.marginRight = 20;

    this.dotRadius = 5;
    this.dotColor = 'black'

    this.postionRadius = 8;
    this.postionColor = 'red'
  }

  drawFingerboard() {
    const fingerboardWidth = this.cellWidth * 12;
    const fingerboardHeight = this.cellHeight * 5;

    const canvasWidth = fingerboardWidth + this.marginLeft + this.marginRight;
    const canvasHeight = fingerboardHeight + this.marginTop + this.marginBottom;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    this.ctx.lineWidth = 1;

    // draw strings
    for (let i = 0; i < 6; i ++) {
      this.ctx.strokeRect(this.marginLeft, this.marginTop + this.cellHeight * i, fingerboardWidth, 0);
    }

    // draw frets
    for (let i = 0; i < 13; i ++) {
      this.ctx.strokeRect(this.marginLeft + this.cellWidth * i, this.marginTop, 0, fingerboardHeight);
    }

    this.drawDots();
  }

  drawDots() {
    [3, 5, 7, 9].forEach((fret) => {
      this.drawSingleDot(fret);
    });

    [12].forEach((fret) => {
      this.drawDoubleDot(fret);
    });
  }

  drawSingleDot(fret) {
    const center_x = this.marginLeft + this.cellWidth / 2 + (fret - 1) * this.cellWidth;
    const center_y = this.marginTop + this.cellHeight * 2.5;
    this.drawDot(center_x, center_y)
  }

  drawDoubleDot(fret) {
    const center_x = this.marginLeft + this.cellWidth / 2 + (fret - 1) * this.cellWidth;

    let center_y = this.marginTop + this.cellHeight * 1.5;
    this.drawDot(center_x, center_y)

    center_y = this.marginTop + this.cellHeight * 3.5;
    this.drawDot(center_x, center_y)
  }

  drawDot(center_x, center_y) {
    this.drawArc(center_x, center_y, this.dotRadius, this.dotColor);
  }

  drawPostion(stringNo, fretNo) {
    const center_x = this.marginLeft + this.cellWidth * (fretNo - 0.5);
    const center_y = this.marginTop + this.cellHeight * (stringNo - 1);
    this.drawArc(center_x, center_y, this.postionRadius, this.postionColor);
  }

  clearPostion() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawFingerboard();
  }

  drawArc(center_x, center_y, radius, color) {
    this.ctx.beginPath();
    this.ctx.arc(center_x, center_y, radius, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
}