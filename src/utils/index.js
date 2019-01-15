/* utils */
import randomColor from 'randomcolor';

function getColor() {
  return randomColor();
}

function getLuminance(color) {
  let r;
  let g;
  let b;
  const m = color.substr(1).match(color.length === 7 ? /(\S{2})/g : /(\S{1})/g);
  if (m) {
    r = parseInt(m[0], 16);
    g = parseInt(m[1], 16);
    b = parseInt(m[2], 16);
  }
  if (typeof r != "undefined") return ((r*299)+(g*587)+(b*114))/1000;
}

function getFontColor(color) {
  const luminance = getLuminance(color);
  return luminance < 180 ? '#ffffff' : 'rgba(0, 0, 0, 0.8)';
}

export { getColor, getFontColor };
