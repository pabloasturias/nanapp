import fs from 'fs';

const translations = {
  es: {
    academy_soon_title: "Próximamente...",
    academy_soon_desc: "Esta guía estará disponible pronto en la versión Pro.",
    academy_wisdom: "Pequeña Sabiduría",
    endo_disruptors: "Disruptores",
    endo_traffic_light: "Semáforo de Ingredientes",
    endo_ing_1: "Parabenos / Ftalatos",
    endo_ing_1_desc: "Evitar siempre",
    endo_ing_2: "Fragancias / Perfumes",
    endo_ing_2_desc: "Usar con cautela",
    endo_ing_3: "Aceites Minerales",
    endo_ing_3_desc: "Seguro / Recomendado",
    endo_swap_1_from: "Botes de plástico",
    endo_swap_1_to: "Vidrio o Acero Inox",
    endo_swap_2_from: "Fragancias sintéticas",
    endo_swap_2_to: "Sin perfume / Natural",
    endo_swap_3_from: "Ropa sintética",
    endo_swap_3_to: "Algodón Orgánico",
    endo_scan_btn: "Simular Escáner",
    endo_scan_desc: "Analiza la composición en segundos"
  },
  en: {
    academy_soon_title: "Coming soon...",
    academy_soon_desc: "This guide will be available soon in the Pro version.",
    academy_wisdom: "Little Wisdom",
    endo_disruptors: "Disruptors",
    endo_traffic_light: "Ingredient Traffic Light",
    endo_ing_1: "Parabens / Phthalates",
    endo_ing_1_desc: "Always avoid",
    endo_ing_2: "Fragrances / Perfumes",
    endo_ing_2_desc: "Use with caution",
    endo_ing_3: "Mineral Oils",
    endo_ing_3_desc: "Safe / Recommended",
    endo_swap_1_from: "Plastic bottles",
    endo_swap_1_to: "Glass or Stainless Steel",
    endo_swap_2_from: "Synthetic fragrances",
    endo_swap_2_to: "Fragrance-free / Natural",
    endo_swap_3_from: "Synthetic clothing",
    endo_swap_3_to: "Organic Cotton",
    endo_scan_btn: "Simulate Scanner",
    endo_scan_desc: "Analyze composition in seconds"
  },
  fr: {
    academy_soon_title: "Bientôt disponible...",
    academy_soon_desc: "Ce guide sera bientôt disponible dans la version Pro.",
    academy_wisdom: "Petite Sagesse",
    endo_disruptors: "Perturbateurs",
    endo_traffic_light: "Feu tricolore des ingrédients",
    endo_ing_1: "Parabènes / Phtalates",
    endo_ing_1_desc: "À éviter toujours",
    endo_ing_2: "Parfums",
    endo_ing_2_desc: "Utiliser avec prudence",
    endo_ing_3: "Huiles Minérales",
    endo_ing_3_desc: "Sûr / Recommandé",
    endo_swap_1_from: "Bouteilles en plastique",
    endo_swap_1_to: "Verre ou Acier Inoxydable",
    endo_swap_2_from: "Parfums synthétiques",
    endo_swap_2_to: "Sans parfum / Naturel",
    endo_swap_3_from: "Vêtements synthétiques",
    endo_swap_3_to: "Coton Biologique",
    endo_scan_btn: "Simuler le Scanner",
    endo_scan_desc: "Analysez la composition en quelques secondes"
  },
  de: {
    academy_soon_title: "Demnächst...",
    academy_soon_desc: "Dieser Leitfaden wird bald in der Pro-Version verfügbar sein.",
    academy_wisdom: "Kleine Weisheit",
    endo_disruptors: "Disruptoren",
    endo_traffic_light: "Zutaten-Ampel",
    endo_ing_1: "Parabene / Phthalate",
    endo_ing_1_desc: "Immer vermeiden",
    endo_ing_2: "Duftstoffe / Parfüms",
    endo_ing_2_desc: "Mit Vorsicht verwenden",
    endo_ing_3: "Mineralöle",
    endo_ing_3_desc: "Sicher / Empfohlen",
    endo_swap_1_from: "Plastikflaschen",
    endo_swap_1_to: "Glas oder Edelstahl",
    endo_swap_2_from: "Synthetische Duftstoffe",
    endo_swap_2_to: "Parfümfrei / Natürlich",
    endo_swap_3_from: "Synthetische Kleidung",
    endo_swap_3_to: "Bio-Baumwolle",
    endo_scan_btn: "Scanner simulieren",
    endo_scan_desc: "Analysieren Sie die Zusammensetzung in Sekunden"
  },
  it: {
    academy_soon_title: "Prossimamente...",
    academy_soon_desc: "Questa guida sarà presto disponibile nella versione Pro.",
    academy_wisdom: "Piccola Saggezza",
    endo_disruptors: "Interferenti",
    endo_traffic_light: "Semaforo degli Ingredienti",
    endo_ing_1: "Parabeni / Ftalati",
    endo_ing_1_desc: "Evitare sempre",
    endo_ing_2: "Fragranze / Profumi",
    endo_ing_2_desc: "Usare con cautela",
    endo_ing_3: "Oli Minerali",
    endo_ing_3_desc: "Sicuro / Raccomandato",
    endo_swap_1_from: "Bottiglie di plastica",
    endo_swap_1_to: "Vetro o Acciaio Inox",
    endo_swap_2_from: "Fragranze sintetiche",
    endo_swap_2_to: "Senza profumo / Naturale",
    endo_swap_3_from: "Abbigliamento sintetico",
    endo_swap_3_to: "Cotone Organico",
    endo_scan_btn: "Simula Scanner",
    endo_scan_desc: "Analizza la composizione in pochi secondi"
  },
  pt: {
    academy_soon_title: "Em breve...",
    academy_soon_desc: "Este guia estará disponível em breve na versão Pro.",
    academy_wisdom: "Pequena Sabedoria",
    endo_disruptors: "Disruptores",
    endo_traffic_light: "Semáforo de Ingredientes",
    endo_ing_1: "Parabenos / Ftalatos",
    endo_ing_1_desc: "Evitar sempre",
    endo_ing_2: "Fragrâncias / Perfumes",
    endo_ing_2_desc: "Usar com cautela",
    endo_ing_3: "Óleos Minerais",
    endo_ing_3_desc: "Seguro / Recomendado",
    endo_swap_1_from: "Garrafas de plástico",
    endo_swap_1_to: "Vidro ou Aço Inoxidável",
    endo_swap_2_from: "Fragrâncias sintéticas",
    endo_swap_2_to: "Sem perfume / Natural",
    endo_swap_3_from: "Roupa sintética",
    endo_swap_3_to: "Algodão Orgânico",
    endo_scan_btn: "Simular Scanner",
    endo_scan_desc: "Analise a composição em segundos"
  }
};

const file = './services/translations.ts';
let content = fs.readFileSync(file, 'utf-8');

for (const lang of Object.keys(translations)) {
  let insertStr = "\n";
  for (const [k, v] of Object.entries(translations[lang])) {
    insertStr += "    " + k + ": \"" + v + "\",\n";
  }
  
  const searchPattern = new RegExp("(\\\\s+tool_endocrine_info:\\\\s*\\\".*?\\\",?\\\\n)");
  const langStart = content.indexOf("  " + lang + ": {");
  let langEnd = content.indexOf("  },", langStart);
  if (langEnd === -1) langEnd = content.length;
  
  let section = content.substring(langStart, langEnd);
  section = section.replace(searchPattern, "$1" + insertStr);
  content = content.substring(0, langStart) + section + content.substring(langEnd);
}

fs.writeFileSync(file, content, 'utf-8');
console.log("Added missed hardcoded translations successfully.");
