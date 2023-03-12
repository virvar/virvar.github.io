let hardSpace = "\u00A0";

function convert() {
  let input = document.getElementById('input');
  let output = document.getElementById('output');
  output.value = "";
  let lines = input.value.split('\n');
  output.value = lines.filter(line => line != "")
    .map(line => {
      return generateText(line) + "\n" + line + "\n";
    }).join("\n");
}

function generateText(input) {
  try {
    let fios = getFios(input);
    let withoutFios = removeFirstFiosStr(input);
    let firstFio = fios[0];
    let titleArea = getTitleArea(withoutFios);
    let authors = formatFios(fios);
    let publication = getPublication(withoutFios);
    let result = firstFio + " " + titleArea + " / " + authors + " // " + publication;
    result = result.replaceAll(/\s\s+/g, " ");
    return result;
  } catch (e) {
    console.log(input);
    console.error(e, e.stack);
    return "";
  }
}

function getFios(input) {
  try {
    let regex = /[А-Я]{1}[а-я]{1,20} ([А-Я]{1}\. ?){1,2}/g;
    let result = input.match(regex);
    return result;
  } catch (e) {
    console.error(e, e.stack);
    return "";
  }
}

function removeFirstFiosStr(input) {
  try {
    let regex = /([А-Я]{1}[а-я]{1,20} ([А-Я]{1}\. ?){1,2}(,? )?)*/;
    let result = input.match(regex);
    return input.substring(result[0].length);
  } catch (e) {
    console.error(e, e.stack);
    return "";
  }
}

function getTitleArea(withoutFios) {
  try {
    let parts = withoutFios.split('/');
    if (parts.length < 2) {
      parts = withoutFios.split('.');
    }
    return parts[0].trim();
  } catch (e) {
    console.error(e, e.stack);
    return "";
  }
}

function formatFios(fios) {
  try {
    return fios.map(fio => {
      let parts = fio.split(' ');
      return parts.slice(1).join('') + " " + parts[0];
    }).join(', ');
  } catch (e) {
    console.error(e, e.stack);
    return "";
  }
}

function getPublication(withoutFios) {
  try {
    let start = withoutFios.indexOf('/');
    if (start > 0) {
      start++;
    }
    if (start == -1) {
      start = withoutFios.indexOf('.');
    }
    if (start > 0) {
      start++;
    }
    let s = withoutFios.substring(start).trim();
    if (s.includes("№")) {
      s = s.replace(", 20", ". – 20")
        .replace(". 20", ". – 20")
        .replace(" N ", " № ")
        .replace(". №", ". – №");
    } else {
      s = s.replace(". 20", ", 20").replace(". – 20", ", 20");
    }
    s = s.replace(". С. ", ". – С. ");
    return s;
  } catch (e) {
    console.error(e, e.stack);
    return "";
  }
}

function copyText() {
  let output = document.getElementById('output');
  output.select();
  document.execCommand('copy');
}
