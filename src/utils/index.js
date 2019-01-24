/* utils */
function generateRGBValues() {
  const first = Math.floor(Math.random() * 256);
  const second = Math.floor(Math.random() * 256);
  const third = Math.floor(Math.random() * 256);
  const rgb = {r: first, g: second, b: third };
  return rgb;
}

function setColor({r, g, b}) {
  const color = `rgb(${r}, ${g}, ${b})`;
  return color;
}

function formatColorObject({r, g, b}) {
  return `rgb(${r}, ${g}, ${b})`;
}

function getLuminance({r, g, b}) {
  const C = [r/255, g/255, b/255];
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

export { generateRGBValues, setColor, getLuminance, getFontColor, formatColorObject };
