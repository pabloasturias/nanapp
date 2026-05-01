const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../services/translations.ts');
let content = fs.readFileSync(file, 'utf8');

const rawKeys = {
  es: {
    academy_disclaimer: "Toda la información contenida en la Academia se basa en consensos de asociaciones pediátricas internacionales (OMS, AEP, AHA). Sin embargo, Nanapp es una herramienta informativa y en ningún caso sustituye el consejo, diagnóstico o tratamiento de un médico o pediatra titulado. Ante cualquier duda o emergencia, acude siempre a un profesional sanitario."
  },
  en: {
    academy_disclaimer: "All information contained in the Academy is based on consensuses from international pediatric associations (WHO, AAP, AHA). However, Nanapp is an informational tool and in no way replaces the advice, diagnosis, or treatment of a licensed physician or pediatrician. In case of doubt or emergency, always consult a healthcare professional."
  },
  fr: {
    academy_disclaimer: "Toutes les informations contenues dans l'Académie sont basées sur les consensus d'associations pédiatriques internationales (OMS, AAP, AHA). Cependant, Nanapp est un outil informatif et ne remplace en aucun cas les conseils, le diagnostic ou le traitement d'un médecin ou pédiatre agréé. En cas de doute ou d'urgence, consultez toujours un professionnel de la santé."
  },
  de: {
    academy_disclaimer: "Alle in der Akademie enthaltenen Informationen basieren auf dem Konsens internationaler pädiatrischer Vereinigungen (WHO, AAP, AHA). Nanapp ist jedoch ein Informationstool und ersetzt in keinem Fall die Beratung, Diagnose oder Behandlung durch einen approbierten Arzt oder Kinderarzt. Wenden Sie sich in Zweifelsfällen oder bei Notfällen immer an einen Arzt."
  },
  it: {
    academy_disclaimer: "Tutte le informazioni contenute nell'Accademia si basano su consensi di associazioni pediatriche internazionali (OMS, AAP, AHA). Tuttavia, Nanapp è uno strumento informativo e non sostituisce in alcun modo il consiglio, la diagnosi o il trattamento di un medico o pediatra abilitato. In caso di dubbi o emergenze, rivolgersi sempre a un operatore sanitario."
  },
  pt: {
    academy_disclaimer: "Todas as informações contidas na Academia são baseadas em consensos de associações pediátricas internacionais (OMS, AAP, AHA). No entanto, Nanapp é uma ferramenta informativa e de forma alguma substitui o conselho, diagnóstico ou tratamento de um médico ou pediatra licenciado. Em caso de dúvida ou emergência, consulte sempre um profissional de saúde."
  }
};

for (const lang of Object.keys(rawKeys)) {
  const data = rawKeys[lang];
  let lines = [];
  for (const k in data) {
    const val = data[k].replace(/"/g, '\\"').replace(/\n/g, '\\n');
    lines.push("    " + k + ': "' + val + '",');
  }
  const pattern = new RegExp("(^\\\\s*" + lang + ":\\\\s*\\\\{\\\\s*\\n)", "m");
  content = content.replace(pattern, "$1" + lines.join("\n") + "\n");
}

fs.writeFileSync(file, content, 'utf8');
console.log("Updated disclaimer translations successfully.");
