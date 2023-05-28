let hardSpace = "\u00A0";

function convert() {
  let input = document.getElementById('input');
  let output = document.getElementById('output');
  output.value = "";
  let lines = input.value.split('\n');
  output.value = lines.filter(line => line != "")
    .map((line, index) => {
      return (index + 1) + '.' + hardSpace + generateText(line);
    }).join("\n");
}


function generateText(input) {
  try {
    const regexp = /^[0-9]+?.[\h\s](.+)/;
    const match = input.match(regexp);
    return match[1];
  } catch (e) {
    console.log(input);
    console.error(e, e.stack);
    return "";
  }
}

function copyText() {
  let output = document.getElementById('output');
  output.select();
  document.execCommand('copy');
}
