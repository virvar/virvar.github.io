let hardSpace = "\u00A0";

function convert() {
  let input = document.getElementById('input');
  let output = document.getElementById('output');
  output.value = "";
  output.value = generateText(input.value);
}

function generateText(input) {
  let lines = input.split('\n');
  let docNameIndex = lines.indexOf("Название документа");
  let docNameLines = lines.slice(docNameIndex + 1);
  let docTypes = {
    "Федеральный закон": "федер. закон",
    "Постановление Правительства РФ": "постановление Правительства Российской Федерации",
    "Распоряжение Правительства РФ": "распоряжение Правительства Российской Федерации",
    "Указ Президента РФ": "указ Президента Российской Федерации"
  };
  let docTypeLine = docNameLines[0];
  let docTypeIn = docTypeLine.split(" от ")[0];
  let docTypeOut = docTypes[docTypeIn] || (docTypeIn.substring(0, 1).toLowerCase() + docTypeIn.substring(1));
  let dateStr = docTypeLine.substring((docTypeIn + " от ").length, (docTypeIn + " от 01.01.2000").length);
  let dd = dateStr.substring(0, 2);
  let months = {"01": "января", "02": "февраля", "03": "марта", "04": "апреля", "05": "мая", "06": "июня",
    "07": "июля", "08": "августа", "09": "сентября", "10": "октября", "11": "ноября", "12": "декабря"};
  let month = months[dateStr.substring(3, 5)];
  let yyyy = dateStr.substring(6, 10);
  let docNum = docTypeLine.split(" N ")[1];

  let docNameLine = docNameLines.find(s => s.startsWith("\""));
  if (!docNameLine) {
    docNameLine = docNameLines.find(s => s.startsWith("<"));
  }
  let docName = docNameLine.substring(1, docNameLine.length - 1);

  let resultDocName = docName + ": " + docTypeOut +
    " от " + dd + " " + month + " " + yyyy +
    " №" + hardSpace + docNum;

  let editedLine = docNameLines.find(s => s.startsWith("(ред. от "));
  if (editedLine) {
    let edited = editedLine.substring(1, editedLine.length - 1);
    resultDocName += " [в " + edited + "]";
  }
  return dateStr + "\n" +
    resultDocName + getPublication(lines, false) + "\n" +
    resultDocName + getPublication(lines, true) + "\n";
}

function getPublication(lines, isNote) {
  let line = lines.find(s => s.startsWith("\"Собрание законодательства РФ\""));
  if (line) {
    let pubParts = line.split(", ");
    let pubYyyy = pubParts[1].substring(6, 10);
    let pubNum = pubParts[2].replace("N ", "");
    let pubArticle = pubParts[3].replace("ст. ", "").replace(",", "").replace(".", "");
    if (!isNote) {
      return " // Собрание законодательства Российской Федерации. - " + pubYyyy +
        ". – №" + hardSpace + pubNum +
        ". – Ст. " + pubArticle + ".";
    } else {
      return " // Собр. законодательства Рос. Федерации. " + pubYyyy +
        ". №" + hardSpace + pubNum +
        ". Ст. " + pubArticle + ".";
    }
  } else {
    return " [Электронный ресурс]. – Электрон. дан. – Доступ из справ.-правовой системы «Консультант Плюс».";
  }
}

function copyText() {
  let output = document.getElementById('output');
  output.select();
  document.execCommand('copy');
}
