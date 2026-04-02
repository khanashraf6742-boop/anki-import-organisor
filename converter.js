const fileInput = document.getElementById('file');
const outSepSel = document.getElementById('outSep');
const convertBtn = document.getElementById('convert');
const downloadBtn = document.getElementById('download');
const previewTbody = document.getElementById('preview');
const metaDiv = document.getElementById('meta');

let lastCards = [];
let lastOutText = '';

function isCardStartLine(line) {
  return line.startsWith('🏥') || line.endsWith('?');
}

function indexOfAnswerMarker(line) {
  return line.indexOf('✅ Answer:');
}

function parseCardsFromText(text) {
  const lines = text.split(/\r\n|\n|\r/);

  const cards = [];
  let current = null;

  function flush() {
    if (!current) return;

    const front = current.frontLines.join('\n');
    const back  = current.backLines.join('\n');

    if (front !== '' || back !== '') cards.push({ front, back });
    current = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isCardStartLine(line)) {
      flush();
      current = { frontLines: [line], backLines: [], seenAnswer: false };
      continue;
    }

    if (!current) continue;

    const ansIdx = indexOfAnswerMarker(line);
    if (!current.seenAnswer && ansIdx !== -1) {
      current.seenAnswer = true;
      current.backLines.push(line);
      continue;
    }

    if (!current.seenAnswer) current.frontLines.push(line);
    else current.backLines.push(line);
  }

  flush();
  return cards;
}

function ankiSeparatorFromChoice(choice) {
  if (choice === 'Tab') return { header: 'Tab', sep: '\t' };
  if (choice === 'Semicolon') return { header: 'Semicolon', sep: ';' };
  if (choice === 'Pipe') return { header: 'Pipe', sep: '|' };
  return { header: 'Tab', sep: '\t' };
}

function escapeForAnkiFieldLossless(value) {
  const needsQuotes = value.includes('\n') || value.includes('"') || value.includes('\t') || value.includes(';') || value.includes('|');
  if (!needsQuotes) return value;
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
}

function buildAnkiImport(cards, outSepChoice) {
  const { header, sep } = ankiSeparatorFromChoice(outSepChoice);

  const headerLines =
    `#separator:${header}\n` +
    `#html:true\n` +
    `#columns:Front${sep}Back\n`;

  const rows = cards.map(c => {
    const f = escapeForAnkiFieldLossless(c.front);
    const b = escapeForAnkiFieldLossless(c.back);
    return `${f}${sep}${b}`;
  }).join('\n');

  return headerLines + rows + '\n';
}

function renderPreview(cards) {
  previewTbody.innerHTML = '';
  metaDiv.textContent = \
    `${cards.length} card(s) detected.`;

  for (let i = 0; i < cards.length; i++) {
    const tr = document.createElement('tr');

    const tdN = document.createElement('td');
    tdN.textContent = String(i + 1);

    const tdF = document.createElement('td');
    const preF = document.createElement('pre');
    preF.textContent = cards[i].front;
    tdF.appendChild(preF);

    const tdB = document.createElement('td');
    const preB = document.createElement('pre');
    preB.textContent = cards[i].back;
    tdB.appendChild(preB);

    tr.appendChild(tdN);
    tr.appendChild(tdF);
    tr.appendChild(tdB);
    previewTbody.appendChild(tr);
  }
}

fileInput.addEventListener('change', () => {
  convertBtn.disabled = !fileInput.files || !fileInput.files[0];
  downloadBtn.disabled = true;
  lastCards = [];
  lastOutText = '';
  previewTbody.innerHTML = '';
  metaDiv.textContent = '';
});

convertBtn.addEventListener('click', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const text = await file.text();
  const cards = parseCardsFromText(text);

  lastCards = cards;
  lastOutText = buildAnkiImport(cards, outSepSel.value);

  renderPreview(cards);
  downloadBtn.disabled = cards.length === 0;
});

downloadBtn.addEventListener('click', () => {
  if (!lastOutText) return;

  const blob = new Blob([lastOutText], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'anki_import.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
});
