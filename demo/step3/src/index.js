import './style.css';
import Icon from './webpack.png';
import printMe from './print.js';

function component() {
  var element = document.createElement('div');
  element.innerHTML = 'Hello, webpack';
  element.classList.add('hello');

  var btn = document.createElement('button');
  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;
  element.appendChild(btn);

  var myIcon = new Image();
  myIcon.src = Icon;
  element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());