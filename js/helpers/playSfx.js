// https://marcgg.com/blog/2016/11/01/javascript-audio/#
export default function playSfx(name){
  let context = new AudioContext(),
  o = context.createOscillator(),
  g = context.createGain();

  if (!fx[name]) {
    console.error('No such sfx: ', name);
    return;
  }

  o.type = fx[name].type;
  o.connect(g);
  o.frequency.value = fx[name].frequency;
  g.connect(context.destination);
  o.start(0);

  g.gain.exponentialRampToValueAtTime(
    0.00001, context.currentTime + delay
  );
}

const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
const delay = (isFirefox) ? .1 : 1;
const fx = {
  correct: {
    frequency: 1009,
    type: 'triangle'
  },
  wrong: {
    frequency: 65.41,
    type: 'sine'
  },
}
