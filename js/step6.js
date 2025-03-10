import loadCountries from "./helpers/loadCountries.js";
import shuffle from "./helpers/shuffle.js";

// let's fetch some countries so we can get playing!
loadCountries('js/data.json')
  .then((data) => {
    const countries = data.countries;
    const game = new Game(countries);
  });

class Game {
  constructor(countries, numTurns = 10) {
    // because we shift & slice the array we'll need to keep
    // an intact copy
    this.masterCountries = countries;
    // easier access to elements
    this.DOM = {
      intro: document.querySelector('.intro'),
      score: document.querySelector('.score'),
      play: document.querySelector('.play'),
      gameover: document.querySelector('.gameover'),
      result: document.querySelector('.result'),
      flag: document.querySelector('h2.flag'),
      answerButtons: document.querySelectorAll('.suggestions button'),
      replayButtons: document.querySelectorAll('button.replay'),
    }

    // number of turns in a game
    this.numTurns = numTurns;

    // trigger the checkAnswer method when clicked
    this.DOM.answerButtons.forEach((button) => {
      button.onclick = (e) => {
        this.checkAnswer(e.target);
      }
    });

    this.DOM.replayButtons.forEach((button) => {
      button.onclick = (e) => {
        this.start();
      }
    });

    // listen to animation end events
    // in the case of .move-on, we change the card,
    // then move it back on screen
    this.DOM.play.addEventListener('animationend', (e) => {
      const targetClass = e.target.classList;
      if (targetClass.contains('slide-off')) {
        this.showCountries();
        targetClass.remove('slide-off');
        targetClass.add('slide-on');
      }
    });
  }

  start() {
    // hide intro and gameover
    this.DOM.intro.classList.add('hide');
    this.DOM.gameover.classList.add('hide');
    this.DOM.score.classList.remove('hide');
    // show play area & score
    this.DOM.play.classList.remove('hide');
    this.DOM.play.classList.add('slide-on');
    // randomize countries
    this.countries = shuffle([...this.masterCountries]);

    this.turn = 0; // current turn
    this.score = 0;
    this.updateScore();
    this.showCountries();
  }

  showCountries() {
    // get our answer
    const answer = this.countries.shift();
    // pick 4 more countries, merge our answer and shuffle
    const selected = shuffle([answer, ...this.countries.slice(0, 4)]);

    // update the DOM, starting with the flag
    this.DOM.flag.innerText = answer.flag;
    // update each button with a country name
    selected.forEach((country, index) => {
      const button = this.DOM.answerButtons[index];
      // remove any classes from previous turn
      button.classList.remove('correct', 'wrong');
      button.innerText = country.name;
      button.dataset.correct = country.name === answer.name;
    });

  }

  checkAnswer(button) {
    // prevent clicks once round is finished
    if (this.DOM.play.classList.contains('slide-off')) {
      return;
    }

    const correct = button.dataset.correct === 'true';

    if (correct) {
      button.classList.add('correct');
      this.nextTurn();
    } else {
      button.classList.add('wrong');
    }
  }

  nextTurn() {
    const wrongAnswers = document.querySelectorAll('button.wrong').length;
    this.turn += 1;
    if (wrongAnswers === 0) {
      this.score += 1;
      this.updateScore();
    }

    if (this.turn === this.numTurns) {
      window.setTimeout(() => {
        this.gameOver();
        console.log('GAMEOVER')
      }, 1500);
    } else {
      this.DOM.play.classList.remove('slide-on');
      this.DOM.play.classList.add('slide-off');
    }
  }

  updateScore() {
    this.DOM.score.innerText = this.score;
  }

  gameOver() {
    const ratings = ['💩','🤣','😴','🤪','👎','😓','😅','😃','🤓','🔥','⭐'];
    const percentage = (this.score / this.numTurns) * 100;
    // calculate rating based on score
    const rating = Math.ceil(percentage / ratings.length);

    this.DOM.play.classList.add('hide');
    this.DOM.gameover.classList.remove('hide');
    // reuse our fade-in class from the intro
    this.DOM.gameover.classList.add('fade-in');
    this.DOM.result.innerHTML = `
      ${this.score} out of ${this.numTurns}
      <br />
      Your rating: ${ratings[rating]}
      `;
  }
}
