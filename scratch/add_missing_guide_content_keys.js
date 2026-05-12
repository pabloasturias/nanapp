import fs from 'fs';

const TRANSLATIONS_FILE = './services/translations.ts';

const extraKeys = {
  es: `
    wearing_intro: "El porteo recrea la seguridad del útero materno. Es una herramienta de crianza fundamental para calmar el llanto y favorecer el apego.",
    wearing_ergo_title: "Porteo Ergonómico (La postura correcta)",
    wearing_ergo_desc: "Para que el porteo sea seguro y beneficioso para el desarrollo físico del bebé, la postura debe respetar su fisiología:",
    wearing_ergo_m: "Las rodillas del bebé deben estar más altas que su culete, formando una 'M'. Esto protege sus caderas.",
    wearing_ergo_c: "La espalda debe mantener su curvatura natural en forma de 'C'. El portabebés no debe forzarla a estar recta.",
    wearing_ergo_kiss: "La cabeza del bebé debe estar a una altura que te permita darle un beso sin esfuerzo. Las vías respiratorias siempre libres.",
    wearing_types_title: "Tipos de Portabebés",
    wearing_type_wrap_title: "Fular elástico o tejido",
    wearing_type_wrap_desc: "Ideal para recién nacidos. Requiere aprender a anudarlo, pero ofrece el ajuste más preciso punto por punto.",
    wearing_type_backpack_title: "Mochila Ergonómica",
    wearing_type_backpack_desc: "Rápida y práctica. Asegúrate de que tenga puente ajustable para que se adapte al tamaño del bebé.",
    wearing_type_ring_title: "Bandolera de anillas",
    wearing_type_ring_desc: "Muy fresca y útil para sube y bajas cuando ya caminan, o para amamantar con discreción.",
    wearing_warning_title: "Cuidado con las 'Colgonas'",
    wearing_warning_desc: "Evita portabebés con base rígida estrecha donde las piernas del bebé cuelguen rectas y el peso recaiga sobre sus genitales. NUNCA portees mirando hacia afuera.",

    blw_requisites_title: "Requisitos de inicio",
    blw_requisites_desc: "Antes de ofrecer alimentos sólidos en trozos (BLW) o triturados, el bebé debe cumplir TODOS estos hitos de desarrollo:",
    blw_req_1: "Se mantiene sentado por sí solo (o con muy mínimo apoyo en la trona).",
    blw_req_2: "Ha perdido el reflejo de extrusión (ya no escupe instintivamente todo con la lengua).",
    blw_req_3: "Muestra interés activo por la comida y es capaz de agarrarla y llevarla a la boca.",
    blw_gagging_title: "Arcadas vs Atragantamiento",
    blw_arcada_title: "Gagging (Arcada) - NORMAL",
    blw_arcada_desc: "Es un mecanismo de defensa. El bebé tose, hace ruido, se pone rojo y expulsa la comida. NO INTERVENGAS, no le saques la comida de la boca con el dedo. Anímale.",
    blw_choking_title: "Atragantamiento - EMERGENCIA",
    blw_choking_desc: "Las vías están bloqueadas. El bebé no tose, no hace ruido (silencio) y puede empezar a ponerse morado o azul. Llama al 112 y aplica maniobras de RCP.",
    blw_cuts_title: "Cortes seguros",
    blw_cuts_desc: "El tamaño y forma de la comida previene el atragantamiento:",
    blw_cuts_1: "Alimentos redondos (uvas, cherrys, arándanos) SIEMPRE cortados a lo largo (en cuartos), nunca enteros.",
    blw_cuts_2: "Al principio, ofrece los alimentos en formato bastón, del tamaño de un dedo índice de adulto.",

    sign_intro: "Los bebés pueden comunicarse con las manos meses antes de que sus cuerdas vocales puedan articular palabras.",
    sign_why_title: "¿Por qué hacer Baby Signing?",
    sign_why_desc: "Reduce drásticamente las rabietas y el llanto por frustración. El bebé sabe lo que quiere, y ahora puede decírtelo.",
    sign_why_quote: "No retrasa el habla. De hecho, los bebés que signan suelen empezar a hablar antes.",
    sign_basic_title: "Signos Básicos",
    sign_milk_title: "Leche",
    sign_milk_desc: "Abrir y cerrar la mano repetidamente como si ordeñaras una vaca.",
    sign_more_title: "Más",
    sign_more_desc: "Juntar las puntas de los dedos de ambas manos y tocarlas repetidamente.",
    sign_eat_title: "Comer",
    sign_eat_desc: "Llevar la mano cerrada en pinza repetidamente hacia la boca.",
    sign_tips_title: "Claves del éxito",
    sign_tip_1: "Empieza alrededor de los 6-8 meses.",
    sign_tip_2: "Siempre que hagas el signo, dí la palabra en voz alta simultáneamente.",
    sign_tip_3: "Constancia. El bebé puede tardar semanas en devolverte el primer signo. ¡No te rindas!"
  `,
  en: `
    wearing_intro: "Babywearing recreates the security of the womb. It's a fundamental parenting tool to soothe crying and foster attachment.",
    wearing_ergo_title: "Ergonomic Babywearing (Correct Posture)",
    wearing_ergo_desc: "For babywearing to be safe and beneficial for the baby's physical development, the posture must respect their physiology:",
    wearing_ergo_m: "The baby's knees should be higher than their bottom, forming an 'M'. This protects their hips.",
    wearing_ergo_c: "The back should maintain its natural 'C' curve. The carrier shouldn't force it to be straight.",
    wearing_ergo_kiss: "The baby's head should be high enough for you to kiss it effortlessly. Airways always clear.",
    wearing_types_title: "Types of Carriers",
    wearing_type_wrap_title: "Stretchy or Woven Wrap",
    wearing_type_wrap_desc: "Ideal for newborns. Requires learning to tie, but offers the most precise fit point by point.",
    wearing_type_backpack_title: "Ergonomic Backpack/Carrier",
    wearing_type_backpack_desc: "Fast and practical. Make sure it has an adjustable panel to adapt to the baby's size.",
    wearing_type_ring_title: "Ring Sling",
    wearing_type_ring_desc: "Very fresh and useful for quick up-and-downs when they start walking, or for discreet nursing.",
    wearing_warning_title: "Beware of 'Crotch Danglers'",
    wearing_warning_desc: "Avoid narrow-based carriers where the baby's legs hang straight down and the weight falls on their genitals. NEVER wear baby facing outward.",

    blw_requisites_title: "Starting Requirements",
    blw_requisites_desc: "Before offering solid food in pieces (BLW) or purees, the baby must meet ALL these developmental milestones:",
    blw_req_1: "Sits up independently (or with very minimal support in the high chair).",
    blw_req_2: "Has lost the extrusion reflex (no longer instinctively pushes everything out with their tongue).",
    blw_req_3: "Shows active interest in food and is able to grab it and bring it to their mouth.",
    blw_gagging_title: "Gagging vs Choking",
    blw_arcada_title: "Gagging - NORMAL",
    blw_arcada_desc: "It is a defense mechanism. The baby coughs, makes noise, turns red and pushes the food forward. DO NOT INTERVENE, do not hook it out with your finger. Encourage them.",
    blw_choking_title: "Choking - EMERGENCY",
    blw_choking_desc: "Airways are blocked. The baby doesn't cough, makes no noise (silence) and may start turning blue. Call 911/112 and apply CPR maneuvers.",
    blw_cuts_title: "Safe Cuts",
    blw_cuts_desc: "The size and shape of the food prevents choking:",
    blw_cuts_1: "Round foods (grapes, cherry tomatoes, blueberries) ALWAYS cut lengthwise (in quarters), never whole.",
    blw_cuts_2: "At first, offer food in stick shapes, the size of an adult index finger.",

    sign_intro: "Babies can communicate with their hands months before their vocal cords can articulate words.",
    sign_why_title: "Why Baby Signing?",
    sign_why_desc: "Drastically reduces tantrums and crying from frustration. The baby knows what they want, and now they can tell you.",
    sign_why_quote: "It does not delay speech. In fact, babies who sign often start speaking earlier.",
    sign_basic_title: "Basic Signs",
    sign_milk_title: "Milk",
    sign_milk_desc: "Open and close your hand repeatedly as if milking a cow.",
    sign_more_title: "More",
    sign_more_desc: "Bring the fingertips of both hands together and tap them repeatedly.",
    sign_eat_title: "Eat",
    sign_eat_desc: "Bring pinched fingers repeatedly to the mouth.",
    sign_tips_title: "Keys to Success",
    sign_tip_1: "Start around 6-8 months.",
    sign_tip_2: "Whenever you make the sign, say the word aloud simultaneously.",
    sign_tip_3: "Consistency. It may take weeks for the baby to return the first sign. Don't give up!"
  `
};

extraKeys.fr = extraKeys.en;
extraKeys.de = extraKeys.en;
extraKeys.it = extraKeys.en;
extraKeys.pt = extraKeys.en;

let content = fs.readFileSync(TRANSLATIONS_FILE, 'utf-8');

for (const lang of Object.keys(extraKeys)) {
  const marker = new RegExp("(\\s*" + lang + ":\\s*\\{)");
  content = content.replace(marker, "$1\n" + extraKeys[lang] + ",");
}

fs.writeFileSync(TRANSLATIONS_FILE, content, 'utf-8');
console.log("Missing guide contents successfully added.");
