// Converts Romanized Nepali (typed in English letters) into Devanagari script.
// Two layers:
//   1. A dictionary of very common words (pronouns, "to be" forms, postpositions,
//      connectors) that don't follow clean phonetic spelling rules.
//   2. A phonetic, letter-by-letter engine for everything else, in the style of
//      standard Nepali/Hindi phonetic typing tools.
// This is a best-effort draft tool, not a linguistically perfect converter —
// uncommon words or unusual spellings may need manual correction afterward.

const DICTIONARY = {
  // pronouns
  ma: 'म', malai: 'मलाई', mero: 'मेरो', mera: 'मेरा', meri: 'मेरी',
  timi: 'तिमी', timro: 'तिम्रो', timilai: 'तिमीलाई',
  tapai: 'तपाईं', tapain: 'तपाईं', tapaiko: 'तपाईंको', tapainlai: 'तपाईंलाई', tapailai: 'तपाईंलाई',
  hami: 'हामी', hamro: 'हाम्रो', hamilai: 'हामीलाई',
  u: 'ऊ', us: 'उस', uslai: 'उसलाई', usko: 'उसको',
  yo: 'यो', tyo: 'त्यो', yiniharu: 'यिनीहरू', tiniharu: 'तिनीहरू', uniharu: 'उनीहरू',
  ye: 'यी', ti: 'ती',
  // verb "to be" / common verbs
  cha: 'छ', chha: 'छ', chu: 'छु', chhu: 'छु', chau: 'छौ', chhau: 'छौ',
  chan: 'छन्', chhan: 'छन्', chin: 'छिन्', chinan: 'छिनन्',
  thiyo: 'थियो', thiye: 'थिए', thiyen: 'थिएँ', thiin: 'थिइन्', thie: 'थिए',
  huncha: 'हुन्छ', hunchan: 'हुन्छन्', hunthyo: 'हुन्थ्यो', huna: 'हुन', hune: 'हुने', hos: 'होस्',
  vayo: 'भयो', bhayo: 'भयो', vaeko: 'भएको', bhaeko: 'भएको', vaera: 'भएर', bhaera: 'भएर',
  vaneko: 'भनेको', bhaneko: 'भनेको', vanchu: 'भन्छु', bhanchu: 'भन्छु', vanna: 'भन्न', bhanna: 'भन्न',
  garne: 'गर्ने', gareko: 'गरेको', gardai: 'गर्दै', garda: 'गर्दा', garna: 'गर्न',
  gareh: 'गरें', garinchha: 'गरिन्छ',
  hereko: 'हेरेको', herna: 'हेर्न', herchu: 'हेर्छु', hereh: 'हेरें', herthe: 'हेर्थे', herda: 'हेर्दा',
  aayo: 'आयो', aaeko: 'आएको', aauna: 'आउन', aauncha: 'आउँछ',
  gayo: 'गयो', jane: 'जाने', jana: 'जान',
  khole: 'खोलें', kholeh: 'खोलें', kholne: 'खोल्ने', kholna: 'खोल्न',
  uthaye: 'उठाएँ', uthayeh: 'उठाएँ', uthaune: 'उठाउने',
  sodhe: 'सोधें', sodheh: 'सोधें', sodhne: 'सोध्ने',
  sochera: 'सोचेर', sochne: 'सोच्ने',
  farkiyeh: 'फर्किएँ', farkine: 'फर्कने',
  // postpositions / connectors
  lai: 'लाई', ko: 'को', ki: 'कि', ka: 'का', haru: 'हरू',
  sanga: 'सँग', bata: 'बाट', tira: 'तिर', samma: 'सम्म',
  pachi: 'पछि', paxi: 'पछि', agadi: 'अगाडि', bhitra: 'भित्र', vitra: 'भित्र',
  ani: 'अनि', tara: 'तर', ra: 'र', kina: 'किन', kinaki: 'किनकि',
  athawa: 'अथवा', jasto: 'जस्तो', jastai: 'जस्तै',
  euta: 'एउटा', euti: 'एउटी', ek: 'एक', dui: 'दुई', tin: 'तीन',
  matra: 'मात्र', matrai: 'मात्रै', pani: 'पनि', nai: 'नै', ta: 'त',
  kehi: 'केही', sabai: 'सबै', dherai: 'धेरै', ali: 'अलि', alik: 'अलिक',
  achanak: 'अचानक', achanakai: 'अचानकै', feri: 'फेरि', tespaxi: 'त्यसपछि',
  tespachi: 'त्यसपछि', tyaspachi: 'त्यसपछि', arko: 'अर्को', arkoh: 'अर्को',
  banda: 'बन्द', khula: 'खुला', aaja: 'आज', voli: 'भोलि', bholi: 'भोलि',
  hijo: 'हिजो', raati: 'राति', rati: 'राति', din: 'दिन', bajeko: 'बजेको',
  bajehko: 'बजेको', ghanta: 'घण्टा', minute: 'मिनेट', second: 'सेकेन्ड',
  kaam: 'काम', important: 'महत्त्वपूर्ण', thaha: 'थाहा', prashna: 'प्रश्न',
  prasna: 'प्रश्न', jawaf: 'जवाफ', jawab: 'जवाफ',
  aafai: 'आफैलाई', aafulai: 'आफूलाई', aafno: 'आफ्नो',
  social: 'सोसल', media: 'मिडिया', phone: 'फोन', video: 'भिडियो',
  message: 'मेसेज', notification: 'नोटिफिकेसन',
  chalirakheko: 'चलाइरहेको', chalaune: 'चलाउने', chalirahekoh: 'चलाइरहेको', chalauna: 'चलाउन',
  namaste: 'नमस्ते', namaskar: 'नमस्कार', dhanyabad: 'धन्यवाद', dhanyawad: 'धन्यवाद',
}

// Multi-character vowel/consonant tables, longest match first.
const VOWELS = [
  ['aa', 'आ', 'ा'], ['ee', 'ई', 'ी'], ['ii', 'ई', 'ी'],
  ['oo', 'ऊ', 'ू'], ['uu', 'ऊ', 'ू'],
  ['ai', 'ऐ', 'ै'], ['au', 'औ', 'ौ'],
  ['a', 'अ', ''], ['i', 'इ', 'ि'], ['u', 'उ', 'ु'],
  ['e', 'ए', 'े'], ['o', 'ओ', 'ो'],
]

const CONSONANTS = [
  ['ksh', 'क्ष'], ['gya', 'ज्ञ'], ['gy', 'ज्ञ'], ['chh', 'छ'], ['shr', 'श्र'],
  ['kh', 'ख'], ['gh', 'घ'], ['ch', 'च'], ['jh', 'झ'], ['th', 'थ'],
  ['dh', 'ध'], ['ph', 'फ'], ['bh', 'भ'], ['sh', 'श'],
  ['k', 'क'], ['g', 'ग'], ['c', 'च'], ['j', 'ज'], ['t', 'त'], ['d', 'द'],
  ['n', 'न'], ['p', 'प'], ['b', 'ब'], ['m', 'म'], ['y', 'य'], ['r', 'र'],
  ['l', 'ल'], ['v', 'व'], ['w', 'व'], ['s', 'स'], ['h', 'ह'], ['f', 'फ'],
  ['x', 'क्ष'], ['z', 'ज'], ['q', 'क'],
]

const VELARS = new Set(['k', 'kh', 'g', 'gh'])
const HALANT = '्'

function longestMatch(str, table) {
  for (const entry of table) {
    const key = entry[0]
    if (str.startsWith(key)) return entry
  }
  return null
}

function transliterateWord(word) {
  const lower = word.toLowerCase()
  if (DICTIONARY[lower]) return DICTIONARY[lower]

  let i = 0
  let out = ''
  const n = lower.length

  while (i < n) {
    const rest = lower.slice(i)
    const cons = longestMatch(rest, CONSONANTS)

    if (cons) {
      let [key, base] = cons
      i += key.length
      const afterCons = lower.slice(i)

      // Nasal assimilation: n before k/kh/g/gh becomes ङ् (standard rule)
      if (key === 'n') {
        const peek = longestMatch(afterCons, CONSONANTS)
        if (peek && VELARS.has(peek[0])) base = 'ङ'
      }

      const vowel = longestMatch(afterCons, VOWELS)
      if (vowel) {
        out += base + vowel[2]
        i += vowel[0].length
      } else {
        const nextCons = longestMatch(afterCons, CONSONANTS)
        if (nextCons) {
          // followed directly by another consonant — suppress inherent vowel
          out += base + HALANT
        } else {
          // end of word or non-letter — keep the inherent "a" sound
          out += base
        }
      }
      continue
    }

    const vowel = longestMatch(rest, VOWELS)
    if (vowel) {
      out += vowel[1]
      i += vowel[0].length
      continue
    }

    // unrecognized character (shouldn't normally happen for a-z), pass through
    out += lower[i]
    i += 1
  }

  return out
}

/**
 * Converts a block of Romanized Nepali text to Devanagari.
 * Preserves whitespace, punctuation, digits, and any text that is already
 * in Devanagari or another script untouched — only runs of Latin letters
 * are transliterated.
 */
export function transliterateToNepali(text) {
  return text.replace(/[a-zA-Z]+/g, (word) => transliterateWord(word))
}

/**
 * Converts a single trailing word right before a boundary character
 * (used for live "type and it converts" phonetic mode).
 */
export { transliterateWord }
