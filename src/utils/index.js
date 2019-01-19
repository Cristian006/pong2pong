/* utils */
function valuesRGB() {
  /*
  const color = randomColor({
    format: 'rgb'
  });
  */
  const first = Math.floor(Math.random() * 256);
  const second = Math.floor(Math.random() * 256);
  const third = Math.floor(Math.random() * 256);
  return [first, second, third];
}

function getRGB(rgbValues) {
  const rgb = {r: rgbValues[0], g: rgbValues[1], b: rgbValues[2] };
  return rgb;
}

function setColor(rgbValues) {
  const color = `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`;
  return color;
}

function getLuminance(rgb) {
  // need to have specific rgb values

  const C = [rgb.r/255, rgb.g/255, rgb.b/255];
  const NC = C.map((c) => {
      if(c <= 0.03928) {
          return (c/12.92);
      }
      return (((c+0.055)/1.055)**2.4);
  });
  return (0.2126 * NC[0] + 0.7152 * NC[1] + 0.0722 * NC[2]);
}

function getFontColor(luminance) {
  return(luminance > 0.179 ? '#212121' : '#f1f1f1');
}

export { valuesRGB, getRGB, setColor, getLuminance, getFontColor };