import loadCountries from "./helpers/loadCountries.js";
import shuffle from "./helpers/shuffle.js";


// let's fetch some countries so we can get playing!
loadCountries('js/data.json')
  .then((data) => {
    const countries = data.countries;
    const game = new Game(countries);
    game.start();
  });

class Game {
  constructor(countries) {
    // because we shift & slice the array we'll need to keep
    // an intact copy
    this.masterCountries = countries;
    // easier access to elements
    this.DOM = {
      flag: document.querySelector('h2.flag'),
      answerButtons: document.querySelectorAll('.suggestions button')
    }

    // trigger the checkAnswer method when clicked
    this.DOM.answerButtons.forEach((button) => {
      button.onclick = (e) => {
        this.checkAnswer(e.target);
      }
    })

  }

  start() {

    // note: using the spread operator allows us to make
    // a copy of the array rather than a reference which
    // would mean changes to countries affects masterCountries
    // see 4.3 https://github.com/airbnb/javascript#arrays
    this.countries = shuffle([...this.masterCountries]);
    // get our answer & remove from the array so
    // it doesn't repeat.
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
    const correct = button.dataset.correct === 'true';

    if (correct) {
      button.classList.add('correct');
      alert('Correct! Well done!');
      this.start();
    } else {
      button.classList.add('wrong');
      alert('Wrong answer try again');
    }
  }
}
