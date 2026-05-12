import fs from 'fs';

const TRANSLATIONS_FILE = './services/translations.ts';

const translations = {
  fr: {
    wearing_intro: "Le portage recrée la sécurité de l'utérus maternel. C'est un outil fondamental pour apaiser les pleurs et favoriser l'attachement.",
    wearing_ergo_title: "Portage Ergonomique (Posture correcte)",
    wearing_ergo_desc: "Pour que le portage soit sûr et bénéfique pour le développement physique du bébé, la posture doit respecter sa physiologie :",
    wearing_ergo_m: "Les genoux du bébé doivent être plus hauts que ses fesses, formant un 'M'. Cela protège ses hanches.",
    wearing_ergo_c: "Le dos doit conserver sa courbure naturelle en forme de 'C'. Le porte-bébé ne doit pas le forcer à être droit.",
    wearing_ergo_kiss: "La tête du bébé doit être à une hauteur qui vous permet de l'embrasser sans effort. Voies respiratoires toujours dégagées.",
    wearing_types_title: "Types de Porte-bébés",
    wearing_type_wrap_title: "Écharpe extensible ou tissée",
    wearing_type_wrap_desc: "Idéale pour les nouveau-nés. Nécessite d'apprendre à la nouer, mais offre l'ajustement le plus précis point par point.",
    wearing_type_backpack_title: "Porte-bébé Préformé (Sac à dos)",
    wearing_type_backpack_desc: "Rapide et pratique. Assurez-vous qu'il dispose d'une assise réglable pour s'adapter à la taille du bébé.",
    wearing_type_ring_title: "Sling à anneaux",
    wearing_type_ring_desc: "Très frais et utile pour les montées et descentes quand ils commencent à marcher, ou pour allaiter discrètement.",
    wearing_warning_title: "Attention aux porte-bébés non physiologiques",
    wearing_warning_desc: "Évitez les porte-bébés à base étroite où les jambes du bébé pendent droites et où le poids repose sur ses parties génitales. Ne portez JAMAIS face au monde.",

    blw_requisites_title: "Conditions requises",
    blw_requisites_desc: "Avant de proposer des aliments solides en morceaux (DME) ou en purée, le bébé doit atteindre TOUTES ces étapes de développement :",
    blw_req_1: "Se tient assis seul (ou avec un très léger soutien dans la chaise haute).",
    blw_req_2: "A perdu le réflexe d'extrusion (il ne recrache plus instinctivement tout avec la langue).",
    blw_req_3: "Montre un intérêt actif pour la nourriture et est capable de l'attraper et de la porter à sa bouche.",
    blw_gagging_title: "Réflexe nauséeux vs Étouffement",
    blw_arcada_title: "Réflexe nauséeux (Gagging) - NORMAL",
    blw_arcada_desc: "C'est un mécanisme de défense. Le bébé tousse, fait du bruit, devient rouge et recrache la nourriture. N'INTERVENEZ PAS, ne lui retirez pas la nourriture de la bouche avec le doigt. Encouragez-le.",
    blw_choking_title: "Étouffement - URGENCE",
    blw_choking_desc: "Les voies sont bloquées. Le bébé ne tousse pas, ne fait aucun bruit (silence) et peut commencer à bleuir. Appelez le 112 et appliquez les manœuvres de RCP.",
    blw_cuts_title: "Coupes sécurisées",
    blw_cuts_desc: "La taille et la forme des aliments préviennent l'étouffement :",
    blw_cuts_1: "Aliments ronds (raisins, tomates cerises, myrtilles) TOUJOURS coupés dans la longueur (en quartiers), jamais entiers.",
    blw_cuts_2: "Au début, proposez les aliments sous forme de bâtonnets, de la taille d'un index d'adulte.",

    sign_intro: "Les bébés peuvent communiquer avec leurs mains des mois avant que leurs cordes vocales puissent articuler des mots.",
    sign_why_title: "Pourquoi utiliser la langue des signes pour bébés ?",
    sign_why_desc: "Réduit considérablement les crises de colère et les pleurs dus à la frustration. Le bébé sait ce qu'il veut et peut maintenant vous le dire.",
    sign_why_quote: "Cela ne retarde pas l'apparition du langage. En fait, les bébés qui signent commencent souvent à parler plus tôt.",
    sign_basic_title: "Signes de base",
    sign_milk_title: "Lait",
    sign_milk_desc: "Ouvrir et fermer la main à plusieurs reprises comme pour traire une vache.",
    sign_more_title: "Encore / Plus",
    sign_more_desc: "Joindre le bout des doigts des deux mains et les toucher à plusieurs reprises.",
    sign_eat_title: "Manger",
    sign_eat_desc: "Porter plusieurs fois la main fermée en pince vers la bouche.",
    sign_tips_title: "Clés du succès",
    sign_tip_1: "Commencez vers l'âge de 6-8 mois.",
    sign_tip_2: "Chaque fois que vous faites le signe, prononcez le mot à voix haute en même temps.",
    sign_tip_3: "Constance. Le bébé peut mettre des semaines avant de reproduire son premier signe. N'abandonnez pas !"
  },
  de: {
    wearing_intro: "Das Tragen vermittelt die Sicherheit des Mutterleibs. Es ist ein grundlegendes Werkzeug für Eltern, um das Weinen zu beruhigen und die Bindung zu fördern.",
    wearing_ergo_title: "Ergonomisches Tragen (Die richtige Haltung)",
    wearing_ergo_desc: "Damit das Tragen sicher und förderlich für die körperliche Entwicklung des Babys ist, muss die Haltung seine Physiologie respektieren:",
    wearing_ergo_m: "Die Knie des Babys sollten höher als sein Po sein und ein 'M' bilden. Das schützt seine Hüften.",
    wearing_ergo_c: "Der Rücken sollte seine natürliche 'C'-Kurve beibehalten. Die Trage sollte ihn nicht zwingen, gerade zu sein.",
    wearing_ergo_kiss: "Der Kopf des Babys sollte hoch genug sein, damit Sie ihn mühelos küssen können. Atemwege immer frei.",
    wearing_types_title: "Arten von Babytragen",
    wearing_type_wrap_title: "Elastisches oder gewebtes Tragetuch",
    wearing_type_wrap_desc: "Ideal für Neugeborene. Erfordert das Erlernen des Bindens, bietet aber die genaueste Anpassung Punkt für Punkt.",
    wearing_type_backpack_title: "Ergonomische Komforttrage",
    wearing_type_backpack_desc: "Schnell und praktisch. Achten Sie auf einen verstellbaren Steg, um sie an die Größe des Babys anzupassen.",
    wearing_type_ring_title: "Ring-Sling",
    wearing_type_ring_desc: "Sehr luftig und nützlich für schnelles Auf- und Absetzen, wenn sie anfangen zu laufen, oder für diskretes Stillen.",
    wearing_warning_title: "Vorsicht vor 'Gruseltragen'",
    wearing_warning_desc: "Vermeiden Sie Tragen mit schmalem Steg, bei denen die Beine des Babys gerade nach unten hängen und das Gewicht auf seinen Genitalien ruht. NIEMALS mit dem Gesicht nach vorne tragen.",

    blw_requisites_title: "Voraussetzungen für den Start",
    blw_requisites_desc: "Bevor feste Nahrung in Stücken (BLW) oder Brei angeboten wird, muss das Baby ALLE diese Entwicklungsschritte erreicht haben:",
    blw_req_1: "Kann selbstständig sitzen (oder mit sehr wenig Unterstützung im Hochstuhl).",
    blw_req_2: "Der Zungenstoßreflex ist verschwunden (drückt nicht mehr instinktiv alles mit der Zunge heraus).",
    blw_req_3: "Zeigt aktives Interesse am Essen und kann es greifen und zum Mund führen.",
    blw_gagging_title: "Würgen vs. Ersticken",
    blw_arcada_title: "Würgen (Gagging) - NORMAL",
    blw_arcada_desc: "Es ist ein Schutzmechanismus. Das Baby hustet, macht Geräusche, wird rot und befördert das Essen nach vorne. GREIFEN SIE NICHT EIN, holen Sie das Essen nicht mit dem Finger heraus. Ermutigen Sie es.",
    blw_choking_title: "Ersticken - NOTFALL",
    blw_choking_desc: "Die Atemwege sind blockiert. Das Baby hustet nicht, macht keine Geräusche (Stille) und kann anfangen, blau zu werden. Rufen Sie den Notruf 112 und wenden Sie Erste-Hilfe-Maßnahmen an.",
    blw_cuts_title: "Sichere Schnitte",
    blw_cuts_desc: "Die Größe und Form des Essens verhindert ein Verschlucken:",
    blw_cuts_1: "Runde Lebensmittel (Weintrauben, Kirschtomaten, Blaubeeren) IMMER der Länge nach vierteln, niemals im Ganzen.",
    blw_cuts_2: "Bieten Sie Lebensmittel anfangs in Stäbchenform an, etwa so groß wie der Zeigefinger eines Erwachsenen.",

    sign_intro: "Babys können mit ihren Händen kommunizieren, Monate bevor ihre Stimmbänder Worte formen können.",
    sign_why_title: "Warum Babyzeichensprache?",
    sign_why_desc: "Reduziert Wutanfälle und Weinen aus Frustration drastisch. Das Baby weiß, was es will, und jetzt kann es Ihnen das mitteilen.",
    sign_why_quote: "Es verzögert das Sprechen nicht. Tatsächlich fangen Babys, die Zeichen nutzen, oft früher an zu sprechen.",
    sign_basic_title: "Grundlegende Zeichen",
    sign_milk_title: "Milch",
    sign_milk_desc: "Öffnen und schließen Sie die Hand wiederholt, als würden Sie eine Kuh melken.",
    sign_more_title: "Mehr",
    sign_more_desc: "Führen Sie die Fingerspitzen beider Hände zusammen und tippen Sie sie wiederholt aneinander.",
    sign_eat_title: "Essen",
    sign_eat_desc: "Führen Sie die zum Zangengriff geformte Hand wiederholt zum Mund.",
    sign_tips_title: "Schlüssel zum Erfolg",
    sign_tip_1: "Beginnen Sie im Alter von etwa 6-8 Monaten.",
    sign_tip_2: "Wann immer Sie das Zeichen machen, sagen Sie gleichzeitig das Wort laut.",
    sign_tip_3: "Konsequenz. Es kann Wochen dauern, bis das Baby Ihnen das erste Zeichen zurückgibt. Geben Sie nicht auf!"
  },
  it: {
    wearing_intro: "Il babywearing ricrea la sicurezza dell'utero materno. È uno strumento genitoriale fondamentale per calmare il pianto e favorire l'attaccamento.",
    wearing_ergo_title: "Babywearing Ergonomico (Postura correta)",
    wearing_ergo_desc: "Affinché il babywearing sia sicuro e benefico per lo sviluppo fisico del bambino, la postura deve rispettare la sua fisiologia:",
    wearing_ergo_m: "Le ginocchia del bambino dovrebbero essere più alte del suo sederino, formando una 'M'. Questo protegge le sue anche.",
    wearing_ergo_c: "La schiena dovrebbe mantenere la sua naturale curva a 'C'. Il marsupio non dovrebbe forzarla a stare dritta.",
    wearing_ergo_kiss: "La testa del bambino deve essere abbastanza in alto da potergli dare un bacio senza sforzo. Vie respiratorie sempre libere.",
    wearing_types_title: "Tipi di Marsupi",
    wearing_type_wrap_title: "Fascia elastica o rigida",
    wearing_type_wrap_desc: "Ideale per i neonati. Richiede di imparare ad annodarla, ma offre la regolazione più precisa punto per punto.",
    wearing_type_backpack_title: "Marsupio Ergonomico (Strutturato)",
    wearing_type_backpack_desc: "Veloce e pratico. Assicurati che abbia una seduta regolabile per adattarsi alle dimensioni del bambino.",
    wearing_type_ring_title: "Fascia ad anelli (Ring Sling)",
    wearing_type_ring_desc: "Molto fresca e utile per sali e scendi rapidi quando iniziano a camminare, o per allattare con discrezione.",
    wearing_warning_title: "Attenzione ai marsupi 'non ergonomici'",
    wearing_warning_desc: "Evita i marsupi a base stretta dove le gambe del bambino pendono dritte verso il basso e il peso ricade sui suoi genitali. MAI portare fronte mondo.",

    blw_requisites_title: "Requisiti di partenza",
    blw_requisites_desc: "Prima di offrire cibi solidi a pezzi (autosvezzamento o BLW) o in purea, il bambino deve aver raggiunto TUTTE queste tappe di sviluppo:",
    blw_req_1: "Resta seduto da solo (o con un supporto minimo nel seggiolone).",
    blw_req_2: "Ha perso il riflesso di estrusione (non sputa più fuori tutto istintivamente con la lingua).",
    blw_req_3: "Mostra un interesse attivo per il cibo ed è in grado di afferrarlo e portarlo alla bocca.",
    blw_gagging_title: "Riflesso faringeo vs Soffocamento",
    blw_arcada_title: "Riflesso faringeo (Gagging) - NORMALE",
    blw_arcada_desc: "È un meccanismo di difesa. Il bambino tossisce, fa rumore, diventa rosso e spinge il cibo in avanti. NON INTERVENIRE, non togliergli il cibo di bocca con il dito. Incoraggialo.",
    blw_choking_title: "Soffocamento - EMERGENZA",
    blw_choking_desc: "Le vie aeree sono bloccate. Il bambino non tossisce, non fa rumore (silenzio) e può iniziare a diventare blu. Chiama il 112/118 e applica le manovre di RCP.",
    blw_cuts_title: "Tagli sicuri",
    blw_cuts_desc: "La dimensione e la forma del cibo prevengono il soffocamento:",
    blw_cuts_1: "Gli alimenti rotondi (uva, pomodorini, mirtilli) SEMPRE tagliati per il lungo (in quarti), mai interi.",
    blw_cuts_2: "All'inizio, offri gli alimenti a forma di bastoncino, delle dimensioni di un dito indice di un adulto.",

    sign_intro: "I bambini possono comunicare con le mani mesi prima che le loro corde vocali possano articolare parole.",
    sign_why_title: "Perché fare Baby Signing?",
    sign_why_desc: "Riduce drasticamente i capricci e il pianto dovuto alla frustrazione. Il bambino sa cosa vuole, e ora può dirtelo.",
    sign_why_quote: "Non ritarda l'uso della parola. Anzi, i bambini che segnano spesso iniziano a parlare prima.",
    sign_basic_title: "Segni Base",
    sign_milk_title: "Latte",
    sign_milk_desc: "Apri e chiudi la mano ripetutamente come per mungere una mucca.",
    sign_more_title: "Ancora / Di più",
    sign_more_desc: "Unisci la punta delle dita di entrambe le mani e toccale ripetutamente.",
    sign_eat_title: "Mangiare",
    sign_eat_desc: "Porta ripetutamente la mano chiusa a pinza verso la bocca.",
    sign_tips_title: "Chiavi per il successo",
    sign_tip_1: "Inizia verso i 6-8 mesi di età.",
    sign_tip_2: "Ogni volta che fai il segno, di' la parola ad alta voce contemporaneamente.",
    sign_tip_3: "Costanza. Possono volerci settimane prima che il bambino ricambi il primo segno. Non arrenderti!"
  },
  pt: {
    wearing_intro: "O babywearing recria a segurança do útero materno. É uma ferramenta parental fundamental para acalmar o choro e promover o vínculo.",
    wearing_ergo_title: "Babywearing Ergonómico (Postura correta)",
    wearing_ergo_desc: "Para que o uso do porta-bebés seja seguro e benéfico para o desenvolvimento físico do bebé, a postura deve respeitar a sua fisiologia:",
    wearing_ergo_m: "Os joelhos do bebé devem ficar mais altos que o rabinho, formando um 'M'. Isso protege as suas ancas.",
    wearing_ergo_c: "As costas devem manter a sua curvatura natural em forma de 'C'. O porta-bebés não deve forçá-la a ficar reta.",
    wearing_ergo_kiss: "A cabeça do bebé deve estar suficientemente alta para lhe poder dar um beijo sem esforço. Vias respiratórias sempre livres.",
    wearing_types_title: "Tipos de Porta-bebés",
    wearing_type_wrap_title: "Pano elástico ou tecido",
    wearing_type_wrap_desc: "Ideal para recém-nascidos. Requer aprender a amarrar, mas oferece o ajuste mais preciso ponto por ponto.",
    wearing_type_backpack_title: "Mochila Ergonómica",
    wearing_type_backpack_desc: "Rápida e prática. Certifique-se de que tem um painel ajustável para se adaptar ao tamanho do bebé.",
    wearing_type_ring_title: "Sling de argolas",
    wearing_type_ring_desc: "Muito fresco e útil para subir e descer rapidamente quando começam a andar, ou para amamentar com discrição.",
    wearing_warning_title: "Cuidado com os porta-bebés 'não ergonómicos'",
    wearing_warning_desc: "Evite porta-bebés de base estreita onde as pernas do bebé ficam penduradas a direito e o peso recai sobre os seus genitais. NUNCA transporte o bebé virado para a frente.",

    blw_requisites_title: "Requisitos para iniciar",
    blw_requisites_desc: "Antes de oferecer alimentos sólidos em pedaços (BLW) ou purés, o bebé deve atingir TODOS estes marcos de desenvolvimento:",
    blw_req_1: "Senta-se sozinho (ou com um apoio muito mínimo na cadeira da papa).",
    blw_req_2: "Perdeu o reflexo de extrusão (já não empurra tudo instintivamente para fora com a língua).",
    blw_req_3: "Mostra um interesse ativo pela comida e é capaz de a agarrar e levar à boca.",
    blw_gagging_title: "Reflexo de Gág vs Engasgamento",
    blw_arcada_title: "Reflexo de Gág (Gagging) - NORMAL",
    blw_arcada_desc: "É um mecanismo de defesa. O bebé tosse, faz barulho, fica vermelho e empurra a comida para fora. NÃO INTERVENHA, não lhe tire a comida da boca com o dedo. Encoraje-o.",
    blw_choking_title: "Engasgamento - EMERGÊNCIA",
    blw_choking_desc: "As vias estão bloqueadas. O bebé não tosse, não faz barulho (silêncio) e pode começar a ficar roxo ou azul. Ligue para o 112 e aplique manobras de RCP.",
    blw_cuts_title: "Cortes seguros",
    blw_cuts_desc: "O tamanho e a forma da comida previnem o engasgamento:",
    blw_cuts_1: "Alimentos redondos (uvas, tomate cereja, mirtilos) SEMPRE cortados ao comprido (em quartos), nunca inteiros.",
    blw_cuts_2: "No início, ofereça os alimentos em formato de palito, do tamanho do dedo indicador de um adulto.",

    sign_intro: "Os bebés podem comunicar com as mãos meses antes de as suas cordas vocais conseguirem articular palavras.",
    sign_why_title: "Porquê fazer Baby Signing?",
    sign_why_desc: "Reduz drasticamente as birras e o choro por frustração. O bebé sabe o que quer, e agora pode dizer-lho.",
    sign_why_quote: "Não atrasa o desenvolvimento da fala. De facto, os bebés que usam gestos costumam começar a falar mais cedo.",
    sign_basic_title: "Gestos Básicos",
    sign_milk_title: "Leite",
    sign_milk_desc: "Abrir e fechar a mão repetidamente como se estivesse a ordenhar uma vaca.",
    sign_more_title: "Mais",
    sign_more_desc: "Juntar as pontas dos dedos de ambas as mãos e tocar com elas repetidamente.",
    sign_eat_title: "Comer",
    sign_eat_desc: "Levar repetidamente a mão fechada em pinça à boca.",
    sign_tips_title: "Chaves para o sucesso",
    sign_tip_1: "Comece por volta dos 6-8 meses de idade.",
    sign_tip_2: "Sempre que fizer o gesto, diga a palavra em voz alta simultaneamente.",
    sign_tip_3: "Constância. O bebé pode demorar semanas a devolver o primeiro gesto. Não desista!"
  }
};

const keysEn = [
  "wearing_intro", "wearing_ergo_title", "wearing_ergo_desc", "wearing_ergo_m", "wearing_ergo_c", 
  "wearing_ergo_kiss", "wearing_types_title", "wearing_type_wrap_title", "wearing_type_wrap_desc", 
  "wearing_type_backpack_title", "wearing_type_backpack_desc", "wearing_type_ring_title", 
  "wearing_type_ring_desc", "wearing_warning_title", "wearing_warning_desc", "blw_requisites_title", 
  "blw_requisites_desc", "blw_req_1", "blw_req_2", "blw_req_3", "blw_gagging_title", "blw_arcada_title", 
  "blw_arcada_desc", "blw_choking_title", "blw_choking_desc", "blw_cuts_title", "blw_cuts_desc", 
  "blw_cuts_1", "blw_cuts_2", "sign_intro", "sign_why_title", "sign_why_desc", "sign_why_quote", 
  "sign_basic_title", "sign_milk_title", "sign_milk_desc", "sign_more_title", "sign_more_desc", 
  "sign_eat_title", "sign_eat_desc", "sign_tips_title", "sign_tip_1", "sign_tip_2", "sign_tip_3"
];

let content = fs.readFileSync(TRANSLATIONS_FILE, 'utf-8');

for (const lang of Object.keys(translations)) {
  let startIndex = content.indexOf("  " + lang + ": {");
  let endIndex = content.indexOf("  },", startIndex);
  if(endIndex === -1) endIndex = content.length;

  let section = content.substring(startIndex, endIndex);
  for (const key of keysEn) {
    const regex = new RegExp("\\\\s+" + key + ":\\\\s*\\\".*?\\\",?\\n");
    // safely string-concat instead of template literal to avoid escaping
    section = section.replace(regex, "\\n    " + key + ": \\\"" + translations[lang][key] + "\\\",\\n");
  }
  
  content = content.substring(0, startIndex) + section + content.substring(endIndex);
}

fs.writeFileSync(TRANSLATIONS_FILE, content, 'utf-8');
console.log("Translations successful.");
