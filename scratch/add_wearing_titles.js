import fs from 'fs';

const file = './services/translations.ts';
let content = fs.readFileSync(file, 'utf-8');

const additions = {
  es: { m: "Forma de 'M'", c: "Espalda en 'C'", k: "Vías Altas" },
  en: { m: "'M' Shape", c: "'C' Curve Back", k: "Clear Airways" },
  fr: { m: "Forme en 'M'", c: "Dos en 'C'", k: "Voies dégagées" },
  de: { m: "'M'-Haltung", c: "'C'-Rücken", k: "Atemwege frei" },
  it: { m: "Forma a 'M'", c: "Schiena a 'C'", k: "Vie aeree libere" },
  pt: { m: "Forma de 'M'", c: "Costas em 'C'", k: "Vias livres" }
};

for (const lang of Object.keys(additions)) {
  const insertStr = "\n    wearing_ergo_m_title: \"" + additions[lang].m + "\",\n" +
                    "    wearing_ergo_c_title: \"" + additions[lang].c + "\",\n" +
                    "    wearing_ergo_kiss_title: \"" + additions[lang].k + "\",\n";
  
  // Find where wearing_ergo_m is and insert before it
  const searchPattern = new RegExp("(\\s+wearing_ergo_m:\\s*\".*?\",?\\n)");
  // Only replace inside the language block
  const langStart = content.indexOf("  " + lang + ": {");
  let langEnd = content.indexOf("  },", langStart);
  if (langEnd === -1) langEnd = content.length;
  
  let section = content.substring(langStart, langEnd);
  section = section.replace(searchPattern, insertStr + "$1");
  content = content.substring(0, langStart) + section + content.substring(langEnd);
}

fs.writeFileSync(file, content, 'utf-8');
console.log("Added inner titles successfully.");
