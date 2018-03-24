import './style.css';
import Icon from './webpack.png';

function component() {
  var element = document.createElement('div');
  element.innerHTML = 'Hello, webpack';
  element.classList.add('hello');
  var myIcon = new Image();
  myIcon.src = Icon;
  element.appendChild(myIcon);
  return element;
}

document.body.appendChild(component());