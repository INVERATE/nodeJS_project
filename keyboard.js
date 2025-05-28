document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('.keyboardInput');
    const keys = document.querySelectorAll('#keyboard .key');
    let lastKey = null;

    keys.forEach(key => {
        key.addEventListener('click', () => {
            const value = key.textContent;

            // Réinitialise la taille de la touche précédente
            if (lastKey && lastKey !== key) {
                lastKey.classList.remove('active-key');
            }

            // Active la touche actuelle
            key.classList.add('active-key');
            lastKey = key;

            // Gestion des touches spéciales
            if (key.classList.contains('space')) {
                input.value += ' ';
            } else if (key.classList.contains('enter')) {
                input.value += '\n';
            } else if (key.classList.contains('backspace')) {
                input.value = input.value.slice(0, -1);
            } else {
                input.value += value;
            }

            input.focus();
        });
    });
});


/**
 * Virtual Keyboard Interface - v1.54
 *   Copyright (c) 2024 - GreyWyvern
 *
 * Add a script-driven keyboard interface to text fields, password
 * fields and textareas.
 *
 * See https://greywyvern.com/code/javascript/keyboard/ for examples
 * and usage instructions.
 *
 * Korean Jamo to Hangul input algorithm by VitaJane and Billy.
 *
 * - https://github.com/GreyWyvern/virtual-keyboard/
 */
var VKI_attach, VKI_close;

(function() {
    let self = this;

    this.VKI_showVersion = true; // Display the version number
    this.VKI_deadBox = true; // Show the dead keys checkbox
    this.VKI_deadkeysOn = false;  // Turn dead keys on by default
    this.VKI_numberPad = true;  // Allow user to open and close the number pad
    this.VKI_numberPadOn = false;  // Show number pad by default
    this.VKI_kts = this.VKI_kt = 'Fran\u00e7ais';  // Default keyboard layout
    this.VKI_langAdapt = true;  // Use lang attribute of input to pre-select keyboard
    this.VKI_size = 2;  // Default keyboard size (1-5)
    this.VKI_sizeAdj = true;  // Allow user to adjust keyboard size
    this.VKI_clearPasswords = false;  // Clear password fields on focus
    this.VKI_flashPassword = 1000; // Flash last character of password: 0 = disabled, > 0 = delay in ms
    this.VKI_imageURI = 'keyboard.svg';  // If empty string, use imageless mode
    this.VKI_clickless = 0;  // 0 = disabled, > 0 = delay in ms
    this.VKI_activeTab = 0;  // Tab moves to next: 1 = element, 2 = keyboard enabled element
    this.VKI_enterSubmit = true;  // Submit forms when Enter is pressed
    this.VKI_keyCenter = 3; // If this many or fewer keys in a row, center the row
    this.VKI_move = true; // Allow user to move keyboard

    // Do not touch these
    this.VKI_version = '1.54';
    this.VKI_target = false;
    this.VKI_shift = this.VKI_shiftlock = false;
    this.VKI_altgr = this.VKI_altgrlock = false;
    this.VKI_dead = false;
    this.VKI_path = (new URL((document.currentScript ||
        document.querySelector('script[src*="keyboard.js"]')
    ).src)).pathname.replace(/\/[^\/]*$/, '/');


    /* ***** i18n text strings *************************************** */
    this.VKI_i18n = {
        '00': 'Display number pad',
        '01': 'Display virtual keyboard interface',
        '02': 'Select keyboard layout',
        '03': 'Dead keys',
        '04': 'On',
        '05': 'Off',
        '06': 'Close the keyboard',
        '07': 'Clear',
        '08': 'Clear this input',
        '09': 'Version',
        '10': 'Decrease keyboard size',
        '11': 'Increase keyboard size',
        '12': 'Backspace',
        '13': 'Korean complete button',
        '14': 'Move keyboard'
    };


    /* ***** Create keyboards **************************************** */
    this.VKI_layout = {};

    // - Lay out each keyboard in rows of sub-arrays. Each sub-array
    //   represents one key.
    //
    // - Each sub-array consists of four slots described as follows:
    //     example: ['a', 'A', '\u00e1', '\u00c1']
    //
    //          a) Normal character
    //          A) Character + Shift/Caps
    //     \u00e1) Character + Alt/AltGr/AltLk
    //     \u00c1) Character + Shift/Caps + Alt/AltGr/AltLk
    //
    //   You may include sub-arrays which are fewer than four slots.
    //   In these cases, the missing slots will be blanked when the
    //   corresponding modifier key (Shift or AltGr) is pressed.
    //
    // - If the second slot of a sub-array matches one of the following
    //   strings:
    //     'Tab', 'Caps', 'Shift', 'Enter', 'Bksp', 'Alt' OR 'AltGr',
    //     'AltLk', 'Complete'
    //   then the function of the key will be the following,
    //   respectively:
    //     - Insert a tab
    //     - Toggle Caps Lock (technically a Shift Lock)
    //     - Next entered character will be the shifted character
    //     - Insert a newline (textarea), or close the keyboard
    //     - Delete the previous character
    //     - Next entered character will be the alternate character
    //     - Toggle Alt/AltGr Lock
    //     - Finish the currently displayed Korean Hangul character
    //
    //   The first slot of this sub-array will be the text to display
    //   on the corresponding key. This allows for easy localisation
    //   of key names.
    //
    // - Layout dead keys (diacritic + letter) should be added as
    //   property/value pairs of objects with hash keys equal to the
    //   diacritic. See the 'this.VKI_deadkey' object below the layout
    //   definitions. In each property/value pair, the value is what
    //   the diacritic would change the property name to.
    //
    // - Note that any characters beyond the normal ASCII set should be
    //   entered in escaped Unicode format. (eg \u00a3 = Pound symbol)
    //   You can find Unicode values for characters here:
    //     https://unicode.org/charts/
    //
    // - To remove a keyboard, just delete it, or comment it out of the
    //   source code. If you decide to remove the US International
    //   keyboard layout, make sure you change the default layout
    //   (this.VKI_kt) above so it references an existing layout.
    //
    // - The 'lang' property determines what keyboard layouts will
    //   appear when 'this.VKI_langAdapt' is true. The script will go
    //   through the layouts in code order and display the first layout
    //   with a matching language string. eg. If two layouts have the
    //   same language code, the one listed *first* below will be the
    //   layout displayed.

    this.VKI_layout['Fran\u00e7ais'] = {
        'name': 'French', 'keys': [
            [['\u00b2', '\u00b3'], ['&', '1'], ['\u00e9', '2', '~'], ['"', '3', '#'], ['\'', '4', '{'], ['(', '5', '['], ['-', '6', '|'], ['\u00e8', '7', '`'], ['_', '8', '\\'], ['\u00e7', '9', '^'], ['\u00e0', '0', '@'], [')', '\u00b0', ']'], ['=', '+', '}'], ['Bksp', 'Bksp']],
            [['Tab', 'Tab'], ['a', 'A'], ['z', 'Z'], ['e', 'E', '\u20ac'], ['r', 'R'], ['t', 'T'], ['y', 'Y'], ['u', 'U'], ['i', 'I'], ['o', 'O'], ['p', 'P'], ['^', '\u00a8'], ['$', '\u00a3', '\u00a4'], ['*', '\u03bc']],
            [['Caps', 'Caps'], ['q', 'Q'], ['s', 'S'], ['d', 'D'], ['f', 'F'], ['g', 'G'], ['h', 'H'], ['j', 'J'], ['k', 'K'], ['l', 'L'], ['m', 'M'], ['\u00f9', '%'], ['Enter', 'Enter']],
            [['Shift', 'Shift'], ['<', '>'], ['w', 'W'], ['x', 'X'], ['c', 'C'], ['v', 'V'], ['b', 'B'], ['n', 'N'], [',', '?'], [';', '.'], [':', '/'], ['!', '\u00a7'], ['Shift', 'Shift']],
            [[' ', ' ', ' ', ' '], ['AltGr', 'AltGr']]
        ], 'lang': ['fr'] };

    /* ***** Define Dead Keys **************************************** */
    this.VKI_deadkey = {};

    // - Lay out each dead key set as an object of property/value
    //   pairs. The rows below are wrapped so uppercase letters are
    //   below their lowercase equivalents.
    //
    // - The property name is the letter pressed after the diacritic.
    //   The property value is the letter this key-combo will generate.
    //
    // - Note that if you have created a new keyboard layout and want
    //   it included in the distributed script, PLEASE TELL ME if you
    //   have added additional dead keys to the ones below.

    this.VKI_deadkey['"'] = this.VKI_deadkey['\u00a8'] = this.VKI_deadkey['\u309B'] = { // Umlaut / Diaeresis / Greek Dialytika / Hiragana/Katakana Voiced Sound Mark
        'a': '\u00e4', 'e': '\u00eb', 'i': '\u00ef', 'o': '\u00f6', 'u': '\u00fc', 'y': '\u00ff', '\u03b9': '\u03ca', '\u03c5': '\u03cb', '\u016B': '\u01D6', '\u00FA': '\u01D8', '\u01D4': '\u01DA', '\u00F9': '\u01DC',
        'A': '\u00c4', 'E': '\u00cb', 'I': '\u00cf', 'O': '\u00d6', 'U': '\u00dc', 'Y': '\u0178', '\u0399': '\u03aa', '\u03a5': '\u03ab', '\u016A': '\u01D5', '\u00DA': '\u01D7', '\u01D3': '\u01D9', '\u00D9': '\u01DB',
        '\u304b': '\u304c', '\u304d': '\u304e', '\u304f': '\u3050', '\u3051': '\u3052', '\u3053': '\u3054', '\u305f': '\u3060', '\u3061': '\u3062', '\u3064': '\u3065', '\u3066': '\u3067', '\u3068': '\u3069',
        '\u3055': '\u3056', '\u3057': '\u3058', '\u3059': '\u305a', '\u305b': '\u305c', '\u305d': '\u305e', '\u306f': '\u3070', '\u3072': '\u3073', '\u3075': '\u3076', '\u3078': '\u3079', '\u307b': '\u307c',
        '\u30ab': '\u30ac', '\u30ad': '\u30ae', '\u30af': '\u30b0', '\u30b1': '\u30b2', '\u30b3': '\u30b4', '\u30bf': '\u30c0', '\u30c1': '\u30c2', '\u30c4': '\u30c5', '\u30c6': '\u30c7', '\u30c8': '\u30c9',
        '\u30b5': '\u30b6', '\u30b7': '\u30b8', '\u30b9': '\u30ba', '\u30bb': '\u30bc', '\u30bd': '\u30be', '\u30cf': '\u30d0', '\u30d2': '\u30d3', '\u30d5': '\u30d6', '\u30d8': '\u30d9', '\u30db': '\u30dc'
    };
    this.VKI_deadkey['~'] = { // Tilde / Stroke
        'a': '\u00e3', 'l': '\u0142', 'n': '\u00f1', 'o': '\u00f5',
        'A': '\u00c3', 'L': '\u0141', 'N': '\u00d1', 'O': '\u00d5'
    };
    this.VKI_deadkey['^'] = { // Circumflex
        'a': '\u00e2', 'e': '\u00ea', 'i': '\u00ee', 'o': '\u00f4', 'u': '\u00fb', 'w': '\u0175', 'y': '\u0177',
        'A': '\u00c2', 'E': '\u00ca', 'I': '\u00ce', 'O': '\u00d4', 'U': '\u00db', 'W': '\u0174', 'Y': '\u0176'
    };
    this.VKI_deadkey['\u02c7'] = { // Baltic caron
        'c': '\u010D', 'd': '\u010f', 'e': '\u011b', 's': '\u0161', 'l': '\u013e', 'n': '\u0148', 'r': '\u0159', 't': '\u0165', 'u': '\u01d4', 'z': '\u017E', '\u00fc': '\u01da',
        'C': '\u010C', 'D': '\u010e', 'E': '\u011a', 'S': '\u0160', 'L': '\u013d', 'N': '\u0147', 'R': '\u0158', 'T': '\u0164', 'U': '\u01d3', 'Z': '\u017D', '\u00dc': '\u01d9'
    };
    this.VKI_deadkey['\u02d8'] = { // Romanian and Turkish breve
        'a': '\u0103', 'g': '\u011f',
        'A': '\u0102', 'G': '\u011e'
    };
    this.VKI_deadkey['-'] = this.VKI_deadkey['\u00af'] = { // Macron
        'a': '\u0101', 'e': '\u0113', 'i': '\u012b', 'o': '\u014d', 'u': '\u016B', 'y': '\u0233', '\u00fc': '\u01d6',
        'A': '\u0100', 'E': '\u0112', 'I': '\u012a', 'O': '\u014c', 'U': '\u016A', 'Y': '\u0232', '\u00dc': '\u01d5'
    };
    this.VKI_deadkey['`'] = { // Grave
        'a': '\u00e0', 'e': '\u00e8', 'i': '\u00ec', 'o': '\u00f2', 'u': '\u00f9', '\u00fc': '\u01dc',
        'A': '\u00c0', 'E': '\u00c8', 'I': '\u00cc', 'O': '\u00d2', 'U': '\u00d9', '\u00dc': '\u01db'
    };
    this.VKI_deadkey['\''] = this.VKI_deadkey['\u00b4'] = this.VKI_deadkey['\u0384'] = { // Acute / Greek Tonos
        'a': '\u00e1', 'e': '\u00e9', 'i': '\u00ed', 'o': '\u00f3', 'u': '\u00fa', 'y': '\u00fd', '\u03b1': '\u03ac', '\u03b5': '\u03ad', '\u03b7': '\u03ae', '\u03b9': '\u03af', '\u03bf': '\u03cc', '\u03c5': '\u03cd', '\u03c9': '\u03ce', '\u00fc': '\u01d8',
        'A': '\u00c1', 'E': '\u00c9', 'I': '\u00cd', 'O': '\u00d3', 'U': '\u00da', 'Y': '\u00dd', '\u0391': '\u0386', '\u0395': '\u0388', '\u0397': '\u0389', '\u0399': '\u038a', '\u039f': '\u038c', '\u03a5': '\u038e', '\u03a9': '\u038f', '\u00dc': '\u01d7'
    };
    this.VKI_deadkey['\u02dd'] = { // Hungarian Double Acute Accent
        'o': '\u0151', 'u': '\u0171',
        'O': '\u0150', 'U': '\u0170'
    };
    this.VKI_deadkey['\u0385'] = { // Greek Dialytika + Tonos
        '\u03b9': '\u0390', '\u03c5': '\u03b0'
    };
    this.VKI_deadkey['\u00b0'] = this.VKI_deadkey['\u00ba'] = { // Ring
        'a': '\u00e5', 'u': '\u016f',
        'A': '\u00c5', 'U': '\u016e'
    };
    this.VKI_deadkey['\u02DB'] = { // Ogonek
        'a': '\u0106', 'e': '\u0119', 'i': '\u012f', 'o': '\u01eb', 'u': '\u0173', 'y': '\u0177',
        'A': '\u0105', 'E': '\u0118', 'I': '\u012e', 'O': '\u01ea', 'U': '\u0172', 'Y': '\u0176'
    };
    this.VKI_deadkey['\u02D9'] = { // Dot-above
        'c': '\u010B', 'e': '\u0117', 'g': '\u0121', 'z': '\u017C',
        'C': '\u010A', 'E': '\u0116', 'G': '\u0120', 'Z': '\u017B'
    };
    this.VKI_deadkey['\u00B8'] = this.VKI_deadkey['\u201a'] = { // Cedilla
        'c': '\u00e7', 's': '\u015F',
        'C': '\u00c7', 'S': '\u015E'
    };
    this.VKI_deadkey[','] = { // Comma
        's': '\u0219', 't': '\u021B',
        'S': '\u0218', 'T': '\u021A'
    };
    this.VKI_deadkey['\u3002'] = { // Hiragana/Katakana Point
        '\u306f': '\u3071', '\u3072': '\u3074', '\u3075': '\u3077', '\u3078': '\u307a', '\u307b': '\u307d',
        '\u30cf': '\u30d1', '\u30d2': '\u30d4', '\u30d5': '\u30d7', '\u30d8': '\u30da', '\u30db': '\u30dd'
    };


    /* ***** Define Symbols ****************************************** */
    this.VKI_symbol = {
        '\u00a0': "NB\nSP", '\u200b': "ZW\nSP", '\u200c': "ZW\nNJ", '\u200d': "ZW\nJ"
    };


    /* ***** Layout Number Pad *************************************** */
    this.VKI_numpad = [
        [['$'], ['\u00a3'], ['\u20ac'], ['\u00a5']],
        [['7'], ['8'], ['9'], ['/']],
        [['4'], ['5'], ['6'], ['*']],
        [['1'], ['2'], ['3'], ['=']],
        [['0'], ['.'], ['+'], ['-']]
    ];


    /* *************************************************************** */
    /* ***** Korean Specific Input *********************************** */
    let VKI_KO_char = []; // Array of Jamo in current Hangul

    /**
     * Object of objects for each Jamo key. Each key has a lead, vowel,
     * and tail number that is null or the number associated with Hangul
     * Unicode algorithm. Every key also has a second that is null or an
     * array of keys that can be the second key in a two key Jamo char.
     */
    let VKI_KO_jamo = {
        '\u3131': {lead:    1, vowel: null, tail:    1, second: ['\u3145']},
        '\u3132': {lead:    2, vowel: null, tail:    2, second: null},
        '\u3134': {lead:    3, vowel: null, tail:    4, second: ['\u3148', '\u314e']},
        '\u3137': {lead:    4, vowel: null, tail:    7, second: null},
        '\u3138': {lead:    5, vowel: null, tail: null, second: null},
        '\u3139': {lead:    6, vowel: null, tail:    8, second: ['\u3131', '\u3141', '\u3142', '\u3145', '\u314c', '\u314d', '\u314e']},
        '\u3141': {lead:    7, vowel: null, tail:   16, second: null},
        '\u3142': {lead:    8, vowel: null, tail:   17, second: ['\u3145']},
        '\u3143': {lead:    9, vowel: null, tail: null, second: null},
        '\u3145': {lead:   10, vowel: null, tail:   19, second: null},
        '\u3146': {lead:   11, vowel: null, tail:   20, second: null},
        '\u3147': {lead:   12, vowel: null, tail:   21, second: null},
        '\u3148': {lead:   13, vowel: null, tail:   22, second: null},
        '\u3149': {lead:   14, vowel: null, tail: null, second: null},
        '\u314a': {lead:   15, vowel: null, tail:   23, second: null},
        '\u314b': {lead:   16, vowel: null, tail:   24, second: null},
        '\u314c': {lead:   17, vowel: null, tail:   25, second: null},
        '\u314d': {lead:   18, vowel: null, tail:   26, second: null},
        '\u314e': {lead:   19, vowel: null, tail:   27, second: null},
        '\u314f': {lead: null, vowel:    1, tail: null, second: null},
        '\u3150': {lead: null, vowel:    2, tail: null, second: null},
        '\u3151': {lead: null, vowel:    3, tail: null, second: null},
        '\u3152': {lead: null, vowel:    4, tail: null, second: null},
        '\u3153': {lead: null, vowel:    5, tail: null, second: null},
        '\u3154': {lead: null, vowel:    6, tail: null, second: null},
        '\u3155': {lead: null, vowel:    7, tail: null, second: null},
        '\u3156': {lead: null, vowel:    8, tail: null, second: null},
        '\u3157': {lead: null, vowel:    9, tail: null, second: ['\u314f', '\u3150', '\u3163']},
        '\u315b': {lead: null, vowel:   13, tail: null, second: null},
        '\u315c': {lead: null, vowel:   14, tail: null, second: ['\u3153', '\u3154', '\u3163']},
        '\u3160': {lead: null, vowel:   18, tail: null, second: null},
        '\u3161': {lead: null, vowel:   19, tail: null, second: ['\u3163']},
        '\u3163': {lead: null, vowel:   21, tail: null, second: null}
    };

    /**
     * An object of objects for every Jamo vowel that is made up of two
     * keys. Each Jamo has a vowel, which is the number associated with
     * the Hangul algorithm, and combo, which is the sum of the two vowels
     * numbers for the two Jamo keys that make it up.
     */
    let VKI_KO_jamoDoubleVowels = {
        '\u3158': {vowel: 10, combo: 10, pair: ['\u3157', '\u314f']},
        '\u3159': {vowel: 11, combo: 11, pair: ['\u3157', '\u3150']},
        '\u315a': {vowel: 12, combo: 30, pair: ['\u3157', '\u3163']},
        '\u315d': {vowel: 15, combo: 19, pair: ['\u315c', '\u1165']},
        '\u315e': {vowel: 16, combo: 20, pair: ['\u315c', '\u3154']},
        '\u315f': {vowel: 17, combo: 35, pair: ['\u315c', '\u3163']},
        '\u3162': {vowel: 20, combo: 40, pair: ['\u3161', '\u3163']}
    };

    /**
     * An object of objects for every Jamo tail that is made up of two
     * keys. Each Jamo has a tail, which is the number associated with the
     * Hangul algorithm, and combo, which is the sum of the two tail
     * numbers for the two Jamo keys that make it up.
     */
    let VKI_KO_jamoDoubleTails = {
        '\u3133': {tail:  3, combo: 20, val:  3, pair: ['\u3131', '\u3145']},
        '\u3135': {tail:  5, combo: 26, val:  5, pair: ['\u3134', '\u110c']},
        '\u3136': {tail:  6, combo: 31, val:  6, pair: ['\u3134', '\u314e']},
        '\u313a': {tail:  9, combo:  9, val:  9, pair: ['\u3139', '\u3131']},
        '\u313b': {tail: 10, combo: 24, val: 10, pair: ['\u3139', '\u3141']},
        '\u313c': {tail: 11, combo: 25, val: 11, pair: ['\u3139', '\u3142']},
        '\u313d': {tail: 12, combo: 27, val: 12, pair: ['\u3139', '\u3145']},
        '\u313e': {tail: 13, combo: 33, val: 13, pair: ['\u3139', '\u314c']},
        '\u313f': {tail: 14, combo: 34, val: 14, pair: ['\u3139', '\u314d']},
        '\u3140': {tail: 15, combo: 35, val: 15, pair: ['\u3139', '\u314e']},
        '\u3144': {tail: 18, combo: 36, val: 18, pair: ['\u3142', '\u3145']}
    };

    /**
     * Finds the Hangul Unicode character from the given list of Jamo.
     * @param {Array} jamoList array of Jamo
     * @returns Hangul Unicode character
     */
    let VKI_KO_getHangul = function(jamoList) {

        // Algorithm that finds the Hangul Unicode for the given Jamo
        let hangulAlgorithm = function(lead, vowel, tail) {
            return String.fromCodePoint(tail + (vowel - 1) * 28 + (lead - 1) * 588 + 44032);
        };

        let vSum = 0, tSum = 0;
        switch (jamoList.length) {
            case 1: return jamoList;

            case 2: // LV, VV, TT
                if (VKI_KO_jamo[jamoList[0]].lead != null && VKI_KO_jamo[jamoList[1]].vowel != null) {
                    return hangulAlgorithm(
                        VKI_KO_jamo[jamoList[0]].lead,
                        VKI_KO_jamo[jamoList[1]].vowel,
                        0);
                } else if (VKI_KO_jamo[jamoList[1]].tail != null && VKI_KO_jamo[jamoList[0]].tail != null) {
                    tSum = VKI_KO_jamo[jamoList[0]].tail + VKI_KO_jamo[jamoList[1]].tail;
                    for (const jamoTPair in VKI_KO_jamoDoubleTails)
                        if (VKI_KO_jamoDoubleTails[jamoTPair].combo ==  tSum)
                            return jamoTPair;
                } else if (VKI_KO_jamo[jamoList[0]].vowel != null && VKI_KO_jamo[jamoList[1]].vowel != null) {
                    vSum = VKI_KO_jamo[jamoList[0]].vowel + VKI_KO_jamo[jamoList[1]].vowel;
                    for (const jamoVPair in VKI_KO_jamoDoubleVowels)
                        if (VKI_KO_jamoDoubleVowels[jamoVPair].combo == vSum)
                            return jamoVPair;
                }
                break;

            case 3: // LVT, LVV
                if (VKI_KO_jamo[jamoList[2]].tail != null) {
                    return hangulAlgorithm(
                        VKI_KO_jamo[jamoList[0]].lead,
                        VKI_KO_jamo[jamoList[1]].vowel,
                        VKI_KO_jamo[jamoList[2]].tail);
                } else if (VKI_KO_jamo[jamoList[2]].vowel != null) {
                    vSum = VKI_KO_jamo[jamoList[1]].vowel + VKI_KO_jamo[jamoList[2]].vowel;
                    for (const jamoVPair in VKI_KO_jamoDoubleVowels)
                        if (VKI_KO_jamoDoubleVowels[jamoVPair].combo == vSum)
                            return hangulAlgorithm(
                                VKI_KO_jamo[jamoList[0]].lead,
                                VKI_KO_jamoDoubleVowels[jamoVPair].vowel,
                                0);
                }
                break;

            case 4: // LVVT, LVTT
                if (VKI_KO_jamo[jamoList[2]].vowel != null) {
                    vSum = VKI_KO_jamo[jamoList[1]].vowel + VKI_KO_jamo[jamoList[2]].vowel;
                    for (const jamoVPair in VKI_KO_jamoDoubleVowels)
                        if (VKI_KO_jamoDoubleVowels[jamoVPair].combo == vSum)
                            return hangulAlgorithm(
                                VKI_KO_jamo[jamoList[0]].lead,
                                VKI_KO_jamoDoubleVowels[jamoVPair].vowel,
                                VKI_KO_jamo[jamoList[3]].tail);
                }
                tSum = VKI_KO_jamo[jamoList[2]].tail + VKI_KO_jamo[jamoList[3]].tail;
                for (const jamoTPair in VKI_KO_jamoDoubleTails)
                    if (VKI_KO_jamoDoubleTails[jamoTPair].combo == tSum)
                        return hangulAlgorithm(
                            VKI_KO_jamo[jamoList[0]].lead,
                            VKI_KO_jamo[jamoList[1]].vowel,
                            VKI_KO_jamoDoubleTails[jamoTPair].tail);
                break;

            case 5: // LVVTT
                vSum = VKI_KO_jamo[jamoList[1]].vowel + VKI_KO_jamo[jamoList[2]].vowel;
                tSum = VKI_KO_jamo[jamoList[3]].tail + VKI_KO_jamo[jamoList[4]].tail;
                for (const jamoVPair in VKI_KO_jamoDoubleVowels)
                    if (VKI_KO_jamoDoubleVowels[jamoVPair].combo == vSum)
                        for (const jamoTPair in VKI_KO_jamoDoubleTails)
                            if (VKI_KO_jamoDoubleTails[jamoTPair].combo == tSum)
                                return hangulAlgorithm(
                                    VKI_KO_jamo[jamoList[0]].lead,
                                    VKI_KO_jamoDoubleVowels[jamoVPair].vowel,
                                    VKI_KO_jamoDoubleTails[jamoTPair].tail);
        }

        return null;
    };

    /**
     * Get the list of Jamo characters used to make up the given Hangul.
     * Returns an array of Jamo compatible with VKI_KO_char. Basically
     * the reverse of VKI_KO_getHangul.
     * @param {*} Hangul character or Unicode of that character
     * @returns array of Jamo that make up the given Hangul
     */
    let VKI_KO_getHangulParts = function(hangul) {
        hangul = (typeof hangul == 'string') ? hangul.charCodeAt() : parseInt(hangul);

        let jamo = [];

        // Get tail, vowel, and lead values
        let tail = Math.floor((hangul - 44032) % 28);
        let vowel = Math.floor(1 + ((hangul - 44032 - tail) % 588) / 28);
        let lead = Math.floor(1 + (hangul - 44032) / 588);

        // Find unicode from values
        for (const j in VKI_KO_jamo) {
            if (VKI_KO_jamo[j].lead == lead) jamo.push(j);
            if (VKI_KO_jamo[j].vowel == vowel) vowel = j;
            if (VKI_KO_jamo[j].tail == tail) tail = j;
        }

        // Find two parts of vowel
        if (Number.isInteger(vowel)) {
            for (const j in VKI_KO_jamoDoubleVowels) {
                if (VKI_KO_jamoDoubleVowels[j].vowel == vowel) {
                    jamo.push(VKI_KO_jamoDoubleVowels[j].pair[0]);
                    jamo.push(VKI_KO_jamoDoubleVowels[j].pair[1]);
                }
            }
        } else jamo.push(vowel);

        // Find two parts of tail
        if (Number.isInteger(tail)) {
            for (const j in VKI_KO_jamoDoubleTails) {
                if (VKI_KO_jamoDoubleTails[j].tail == tail) {
                    jamo.push(VKI_KO_jamoDoubleTails[j].pair[0]);
                    jamo.push(VKI_KO_jamoDoubleTails[j].pair[1]);
                }
            }
        } else jamo.push(tail);

        return jamo;
    };

    /**
     * Called from VKI_insert when selected keyboard is Korean. Updates
     * 'text' and 'rng' values when an input Jamo can be added to the
     * Hangul at the cursor position.
     * @param {string} text string of the jamo key clicked.
     * @param {array} rng current cursor range position in the field
     * @returns array of updated 'text' and 'rng' variables
     */
    this.VKI_KO_insert = function(text, rng) {

        // If input is a Jamo character
        if (text.charCodeAt() >= 12593 && text.charCodeAt() <= 12643) {

            // Get the Hangul Unicode with new added Jamo
            let hangulText = false, hangulModify = true;
            switch (VKI_KO_char.length) {
                case 0: // First input
                    VKI_KO_char.push(text);
                    hangulText = text;
                    hangulModify = false;
                    break;

                case 1: // Second Input: LV, VV, TT
                    if (VKI_KO_jamo[VKI_KO_char[0]].lead != null && VKI_KO_jamo[text].vowel != null) {
                        VKI_KO_char.push(text);
                        hangulText = VKI_KO_getHangul(VKI_KO_char);
                    } else if (VKI_KO_jamo[VKI_KO_char[0]].second != null) {
                        if (VKI_KO_jamo[VKI_KO_char[0]].second.includes(text)) {
                            VKI_KO_char.push(text);
                            hangulText = VKI_KO_getHangul(VKI_KO_char);
                            VKI_KO_char = [];
                        }
                    }
                    break;

                case 2: // Third input: LVV, LVT
                    if (VKI_KO_jamo[VKI_KO_char[0]].lead != null && VKI_KO_jamo[VKI_KO_char[1]].vowel != null) {
                        if (VKI_KO_jamo[text].tail != null) { // Text is part of tail
                            VKI_KO_char.push(text);
                            hangulText = VKI_KO_getHangul(VKI_KO_char);
                        } else if (VKI_KO_jamo[VKI_KO_char[1]].second != null) { // LVV
                            if (VKI_KO_jamo[VKI_KO_char[1]].second.includes(text)) {
                                VKI_KO_char.push(text);
                                hangulText = VKI_KO_getHangul(VKI_KO_char);
                            }
                        }
                    }
                    break;

                case 3: // Fourth input: LVVT, must be a tail
                    if (VKI_KO_jamo[text].vowel != null && VKI_KO_jamo[VKI_KO_char[2]].tail != null) {
                        let k1 = VKI_KO_char.pop(), k2 = VKI_KO_getHangul(VKI_KO_char);
                        VKI_KO_char = [k1, text]; // Next text is a vowel (move tail)
                        hangulText = k2 + VKI_KO_getHangul(VKI_KO_char);
                    } else if (VKI_KO_jamo[VKI_KO_char[2]].vowel != null && VKI_KO_jamo[text].vowel == null) {
                        VKI_KO_char.push(text);
                        hangulText = VKI_KO_getHangul(VKI_KO_char);
                    } else if (VKI_KO_jamo[VKI_KO_char[2]].second != null) { // LVTT
                        if (VKI_KO_jamo[VKI_KO_char[2]].second.includes(text)) {
                            VKI_KO_char.push(text);
                            hangulText = VKI_KO_getHangul(VKI_KO_char);
                        }
                    }
                    break;

                case 4: // Fifth input: Must be second text in two part tail
                    if (VKI_KO_jamo[text].vowel != null && VKI_KO_jamo[VKI_KO_char[3]].tail != null) {
                        let k1 = VKI_KO_char.pop(), k2 = VKI_KO_getHangul(VKI_KO_char);
                        VKI_KO_char = [k1, text]; // Next text is a vowel (move tail)
                        hangulText = k2 + VKI_KO_getHangul(VKI_KO_char);
                    } else if (VKI_KO_jamo[VKI_KO_char[3]].second != null) {
                        if (VKI_KO_jamo[VKI_KO_char[3]].second.includes(text)) {
                            VKI_KO_char.push(text);
                            hangulText = VKI_KO_getHangul(VKI_KO_char);
                        }
                    }
                    break;

                case 5: // Sixth input: Start of new Hangul
                    if (VKI_KO_jamo[text].vowel != null && VKI_KO_jamo[VKI_KO_char[4]].tail != null) {
                        let k1 = VKI_KO_char.pop(), k2 = VKI_KO_getHangul(VKI_KO_char);
                        VKI_KO_char = [k1, text]; // Next text is a vowel (move tail)
                        hangulText = k2 + VKI_KO_getHangul(VKI_KO_char);
                    }
            }

            if (!hangulText) {
                VKI_KO_char = [text];
                hangulModify = false;
            } else text = hangulText;

            // If a Jamo was added that modifies the current Hangul, delete
            // the previous, unmodified Hangul
            if (hangulModify) {
                if (rng[0] < rng[1]) rng[0]++;
                this.VKI_target.value = this.VKI_target.value.substr(0, rng[0] - 1) + this.VKI_target.value.substr(rng[1]);
                rng[0]--; rng[1]--;
            }

            // Update the Korean complete button contents
            let koComplete = document.getElementById('keyboardInputKOComplete');
            if (koComplete) koComplete.textContent = (text.length > 1) ? text[1] : text;

            // Non Jamo input
        } else this.VKI_KO_clearCurrent();

        return [text, rng];
    };

    /**
     * Called from VKI_backspace when selected keyboard is Korean. Checks
     * if the backspaced character was Hangul and if so, checks if just
     * one Jamo part of it can be deleted instead of the whole Hangul.
     * @param {string} lastInput the character that was backspaced
     * @param {array} rng current cursor range position in the field
     */
    this.VKI_KO_backspace = function(lastInput, rng) {

        // If the backspaced character was Hangul or Jamo
        if ((lastInput.charCodeAt() >= 12593 && lastInput.charCodeAt() <= 12643) ||
            (lastInput.charCodeAt() >= 44032 && lastInput.charCodeAt() <= 55203)) {

            // If nothing is in VKI_KO_char, get the Jamo from the
            // backspaced Hangul and put it in VKI_KO_char
            if (VKI_KO_char.length == 0)
                VKI_KO_char = VKI_KO_getHangulParts(lastInput);

            // Remove the last Jamo
            VKI_KO_char.pop();

            // Re-insert modified Hangul if it exists
            if (VKI_KO_char.length != 0) {
                lastInput = VKI_KO_getHangul(VKI_KO_char);
                this.VKI_target.value = this.VKI_target.value.substr(0, rng[0]) + lastInput + this.VKI_target.value.substr(rng[1]);
                this.VKI_target.setSelectionRange(rng[0] + lastInput.length, rng[0] + lastInput.length);
            }
        }

        // If we're not currently working on any Hangul
        if (VKI_KO_char.length == 0) {
            // Check if previous character is also Hangul or Jamo and if
            // so, load Jamo into VKI_KO_char
            lastInput = this.VKI_target.value.substr(rng[0] - 2, rng[1] - 1);
            if ((lastInput.charCodeAt() >= 12593 && lastInput.charCodeAt() <= 12643) ||
                (lastInput.charCodeAt() >= 44032 && lastInput.charCodeAt() <= 55203)) {
                VKI_KO_char = VKI_KO_getHangulParts(lastInput);
            } else lastInput = '';
        }

        // Update the Korean complete button contents
        let koComplete = document.getElementById('keyboardInputKOComplete');
        if (koComplete) koComplete.textContent = lastInput;
    };

    // Apply Korean-specific event listeners if layout is Korean
    this.VKI_KO_targetEvents = function() {
        if (this.VKI_target) {
            if (this.VKI_kt == '\ud55c\uad6d\uc5b4') {
                this.VKI_target.addEventListener('click', this.VKI_KO_clearCurrent, true);
                this.VKI_target.addEventListener('keydown', this.VKI_KO_clearCurrent, true);
            } else { // Else remove Korean-specific event listeners
                this.VKI_target.removeEventListener('click', this.VKI_KO_clearCurrent, true);
                this.VKI_target.removeEventListener('keydown', this.VKI_KO_clearCurrent, true);
            }
        }
    };

    // Shortcut function to end the current working Hangul and clear the
    // Korean complete button
    this.VKI_KO_clearCurrent = function() {
        VKI_KO_char = [];
        let koComplete = document.getElementById('keyboardInputKOComplete');
        if (koComplete) koComplete.textContent = '';
    };
    /* ***** END Korean Specific Input ******************************* */
    /* *************************************************************** */


    /* ******************************************************************
     * Attach the keyboard to an element
     *
     */
    VKI_attach = function(elem) {
        if (elem.getAttribute('VKI_attached')) return false;
        if (self.VKI_imageURI) {
            let img = document.createElement('img');
            img.src = self.VKI_path + self.VKI_imageURI;
            img.alt = self.VKI_i18n['01'];
            img.classList.add('keyboardInputInitiator');
            img.title = self.VKI_i18n['01'];
            img.elem = elem;
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                self.VKI_show(this.elem);
            });
            elem.parentNode.insertBefore(img, (elem.dir == 'rtl') ? elem : elem.nextSibling);
        } else {
            elem.addEventListener('focus', function() {
                if (self.VKI_target != this) {
                    if (self.VKI_target) self.VKI_close();
                    self.VKI_show(this);
                }
            });
            elem.addEventListener('click', function() {
                if (!self.VKI_target) self.VKI_show(this);
            });
        }
        elem.setAttribute('VKI_attached', 'true');
        elem.setAttribute('VKI_type', elem.type);
        elem.setAttribute('inputmode', 'none');
        if (elem.classList.contains('keyboardInputNumbersOnly')) {
            elem.setAttribute('VKI_numpadInput', 'true');
            elem.min = elem.min ?? 0;
            elem.step = elem.step ?? 1;
        } else if (elem.type == 'number') {
            elem.setAttribute('VKI_numpadInput', 'true');
        } else elem.setAttribute('VKI_numpadInput', 'false');
        elem.addEventListener('click', function(e) {
            if (self.VKI_target == this) e.stopPropagation();
            return false;
        });
        if (self.VKI_flashPassword && elem.getAttribute('VKI_type') == 'password') {
            elem.setAttribute('autocomplete', 'new-password');
            elem.storeValue = elem.value;
            elem.timeout = false;
            elem.addEventListener('focus', function() {
                if (typeof this.timeout !== 'number')
                    this.storeValue = this.value;
            });
            elem.restorePassword = function() {
                if (typeof this.timeout === 'number') {
                    this.type = 'password';
                    this.value = this.storeValue;
                    clearTimeout(this.timeout);
                    this.timeout = false;
                }
            };
            if (elem.form) {
                elem.form.addEventListener('submit', function(e) {
                    elem.restorePassword();
                });
            }
            elem.addEventListener('beforeinput', function() {
                elem.restorePassword();
            });
            elem.addEventListener('input', function() {
                let selfPass = this;
                if (this.value.length == this.storeValue.length + 1) {
                    this.storeValue = this.value;
                    this.value = this.value.replace(/.(?!$)/g, '\u2022');
                    setTimeout(function() {
                        selfPass.type = 'text';
                        selfPass.setSelectionRange(selfPass.value.length, selfPass.value.length);
                    }, 0);
                    this.timeout = setTimeout(function() {
                        selfPass.type = 'password';
                        selfPass.value = selfPass.storeValue;
                        selfPass.timeout = false;
                    }, self.VKI_flashPassword);
                } else this.storeValue = this.value;
            });
        }
        if (elem.getAttribute('VKI_numpadInput') == 'true') {
            elem.type = (elem.getAttribute('VKI_type') == 'password') ? 'password' : 'text';
            elem.addEventListener('beforeinput', function() {
                if (this.getAttribute('VKI_type') != 'password')
                    this.storeValue = this.value;
            });
            elem.addEventListener('input', function() {
                if (!this.value.match(new RegExp(this.pattern)) ||
                    (this.max && parseFloat(this.value) > parseFloat(this.max)) ||
                    (this.min && parseFloat(this.value) < parseFloat(this.min)))
                    if (this.getAttribute('VKI_type') != 'password')
                        this.value = this.storeValue;
            });
        }
    };


    /* ******************************************************************
     * Common mouse event actions on character keys, mainly to do with
     * clickless input
     *
     */
    let VKI_mouseEvents = function(elem) {
        if (!elem.click) elem.click = function() {
            let evt = this.ownerDocument.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            this.dispatchEvent(evt);
        };
        elem.VKI_clickless = 0;
        elem.addEventListener('dblclick', function() { return false; });
        elem.addEventListener('mouseover', function() {
            if (self.VKI_clickless) {
                let _self = this;
                clearTimeout(this.VKI_clickless);
                this.VKI_clickless = setTimeout(function() {
                    _self.click(); }, self.VKI_clickless);
            }
        });
        elem.addEventListener('mouseout', function() { clearTimeout(this.VKI_clickless); });
        elem.addEventListener('mousedown', function() { clearTimeout(this.VKI_clickless); });
        elem.addEventListener('mouseup', function() { clearTimeout(this.VKI_clickless); });
    };


    /* ******************************************************************
     * Private table cell attachment function for generic characters
     *
     */
    let VKI_keyClick = function() {
        let done = false, character = '\xa0';
        if (this.firstChild.nodeName.toLowerCase() != 'small') {
            if ((character = this.firstChild.nodeValue) == '\xa0') return false;
        } else character = this.firstChild.getAttribute('char');
        if (self.VKI_deadkeysOn.checked && self.VKI_dead) {
            if (self.VKI_dead != character) {
                if (character != ' ') {
                    if (self.VKI_deadkey[self.VKI_dead][character]) {
                        self.VKI_insert(self.VKI_deadkey[self.VKI_dead][character]);
                        done = true;
                    }
                } else {
                    self.VKI_insert(self.VKI_dead);
                    done = true;
                }
            } else done = true;
        }
        self.VKI_dead = false;

        if (!done) {
            if (self.VKI_deadkeysOn.checked && self.VKI_deadkey[character]) {
                self.VKI_dead = character;
                this.classList.add('dead');
                if (self.VKI_shift) self.VKI_modify('Shift');
                if (self.VKI_altgr) self.VKI_modify('AltGr');
            } else self.VKI_insert(character);
        }
        self.VKI_modify('');
        return false;
    };


    /* ***** Build the keyboard interface **************************** */
    this.VKI_keyboard = document.createElement('table');
    this.VKI_keyboard.id = 'keyboardInputMaster';
    this.VKI_keyboard.dir = 'ltr';
    this.VKI_keyboard.cellSpacing = '0';
    this.VKI_keyboard.classList.add('keyboardInputSize' + this.VKI_size);
    this.VKI_keyboard.addEventListener('click', function(e) {
        e.stopPropagation();
        return false;
    });

    if (!this.VKI_layout[this.VKI_kt])
        return alert('No keyboard named "' + this.VKI_kt + '"');

    let thead = document.createElement('thead');
    let thtr = document.createElement('tr');
    let thth = document.createElement('th');
    thth.colSpan = '2';

    this.VKI_select = document.createElement('div');
    this.VKI_select.id = 'keyboardInputSelect';
    this.VKI_select.title = this.VKI_i18n['02'];
    this.VKI_select.sortType = 0;
    this.VKI_select.addEventListener('click', function() {
        let ol = this.getElementsByTagName('ol')[0];
        if (!ol.style.display || this.sortType < 2) {
            ol.style.display = 'block';
            let li = ol.getElementsByTagName('li'), scr = 0;
            [...li].sort((a, b) => {
                if (!this.sortType) {
                    return a.getAttribute('data-order') - b.getAttribute('data-order');
                } else return (a.title > b.title) ? 1 : -1;
            }).forEach(node => ol.appendChild(node));
            for (let x = 0; x < li.length; x++) {
                li[x].firstChild.nodeValue = (this.sortType) ? li[x].title : li[x].getAttribute('data-text');
                if (VKI_kt == li[x].getAttribute('data-text')) {
                    li[x].classList.add('selected');
                    scr = li[x].offsetTop - li[x].offsetHeight * 2;
                } else li[x].classList.remove('selected');
            }
            setTimeout(function() { ol.scrollTop = scr; }, 0);
            this.sortType++;
        } else {
            ol.style.display = '';
            this.sortType = 0;
        }
    });
    this.VKI_select.appendChild(document.createTextNode(this.VKI_kt));
    this.VKI_select.appendChild(document.createTextNode(' \u25be'));
    let order = 0, langs = 0, ol = document.createElement('ol');
    Object.keys(this.VKI_layout).forEach(ktype => {
        if (!this.VKI_layout[ktype].lang) this.VKI_layout[ktype].lang = [];
        let li = document.createElement('li');
        li.title = this.VKI_layout[ktype].name;
        li.setAttribute('data-order', order++);
        li.setAttribute('data-text', ktype);
        li.addEventListener('click', function(e) {
            e.stopPropagation();
            this.parentNode.style.display = '';
            self.VKI_kts = self.VKI_kt = self.VKI_select.firstChild.nodeValue = this.getAttribute('data-text');
            self.VKI_select.sortType = 0;
            self.VKI_buildKeys();
            self.VKI_KO_targetEvents?.(); // Korean target events
        });
        li.appendChild(document.createTextNode(ktype));
        ol.appendChild(li);
        langs++;
    });
    this.VKI_select.appendChild(ol);
    if (langs > 1) thth.appendChild(this.VKI_select);

    if (this.VKI_numberPad) {
        let span = document.createElement('span');
        span.id = 'keyboardInputNumpadToggle';
        span.appendChild(document.createTextNode('#'));
        span.title = this.VKI_i18n['00'];
        span.addEventListener('click', function() {
            self.VKI_numpadCell.style.display = (!self.VKI_numpadCell.style.display) ? 'none' : '';
            self.VKI_numpadCell.previousStyle = self.VKI_numpadCell.style.display;
            self.VKI_position(true);
        });
        thth.appendChild(span);
    }

    this.VKI_kbSize = function(delta) {
        this.VKI_size = Math.min(5, Math.max(1, this.VKI_size + delta));
        this.VKI_keyboard.className = this.VKI_keyboard.className.replace(/\bkeyboardInputSize\d\b/, '');
        if (this.VKI_size != 2) this.VKI_keyboard.classList.add('keyboardInputSize' + this.VKI_size);
        this.VKI_position(true);
    };
    if (this.VKI_sizeAdj) {
        let small = document.createElement('small');
        small.title = this.VKI_i18n['10'];
        small.addEventListener('click', function() { self.VKI_kbSize(-1); });
        small.appendChild(document.createTextNode('\u21d3'));
        thth.appendChild(small);
        let big = document.createElement('big');
        big.title = this.VKI_i18n['11'];
        big.addEventListener('click', function() { self.VKI_kbSize(1); });
        big.appendChild(document.createTextNode('\u21d1'));
        thth.appendChild(big);
    }

    let span = document.createElement('span');
    span.id = 'keyboardInputNumpadBksp';
    span.appendChild(document.createTextNode('\u21E6'));
    span.title = this.VKI_i18n['12'];
    span.addEventListener('click', function() { self.VKI_backspace(); });
    thth.appendChild(span);

    if (this.VKI_move) {
        this.VKI_move = document.createElement('span');
        this.VKI_move.pos = [0, 0];
        this.VKI_move.appendChild(document.createTextNode('\u2725'));
        this.VKI_move.title = this.VKI_i18n['14'];
        this.VKI_move.move = function(e) {
            if (self.VKI_target.keyboardPosition == 'fixed') {
                self.VKI_keyboard.style.left = e.pageX - self.VKI_move.pos[0] + 'px';
                self.VKI_keyboard.style.top = e.pageY - self.VKI_move.pos[1] + 'px';
            } else {
                self.VKI_keyboard.style.left = e.pageX + VKI_scrollDist()[0] - self.VKI_move.pos[0] + VKI_scrollDist()[0] + 'px';
                self.VKI_keyboard.style.top = e.pageY + VKI_scrollDist()[1] - self.VKI_move.pos[1] + VKI_scrollDist()[1] + 'px';
            }
        };
        this.VKI_move.drop = function() {
            document.removeEventListener('mousemove', self.VKI_move.move);
            document.removeEventListener('mouseup', self.VKI_move.drop);
        }
        this.VKI_move.addEventListener('mousedown', function(e) {
            e.preventDefault();
            let coord = self.VKI_keyboard.getBoundingClientRect();
            self.VKI_move.pos[0] = e.pageX - coord.left;
            self.VKI_move.pos[1] = e.pageY - coord.top;
            if (self.VKI_target.keyboardPosition != 'fixed') {
                self.VKI_move.pos[0] += VKI_scrollDist()[0];
                self.VKI_move.pos[1] += VKI_scrollDist()[1];
            }
            document.addEventListener('mousemove', self.VKI_move.move);
            document.addEventListener('mouseup', self.VKI_move.drop);
        });
        thth.appendChild(this.VKI_move);
    }

    span = document.createElement('span');
    span.appendChild(document.createTextNode(this.VKI_i18n['07']));
    span.title = this.VKI_i18n['08'];
    span.addEventListener('click', function() {
        self.VKI_target.value = '';
        self.VKI_target.focus();
        self.VKI_KO_clearCurrent?.();
        return false;
    });
    thth.appendChild(span);

    let strong = document.createElement('strong');
    strong.title = this.VKI_i18n['06'];
    strong.addEventListener('click', function() { self.VKI_close(); });
    let big = document.createElement('big');
    big.appendChild(document.createTextNode('\u00d7'));
    strong.appendChild(big);
    thth.appendChild(strong);

    thtr.appendChild(thth);
    thead.appendChild(thtr);
    this.VKI_keyboard.appendChild(thead);

    let tbody = document.createElement('tbody');
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.id = 'keyboardInputKeyboard';
    let div = document.createElement('div');

    if (this.VKI_deadBox) {
        let label = document.createElement('label');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.title = this.VKI_i18n['03'] + ': ' + ((this.VKI_deadkeysOn) ? this.VKI_i18n['04'] : this.VKI_i18n['05']);
        checkbox.defaultChecked = this.VKI_deadkeysOn;
        checkbox.addEventListener('click', function() {
            this.title = self.VKI_i18n['03'] + ': ' + ((this.checked) ? self.VKI_i18n['04'] : self.VKI_i18n['05']);
            self.VKI_modify('');
            return true;
        });
        label.appendChild(checkbox);
        checkbox.checked = this.VKI_deadkeysOn;
        div.appendChild(label);
        this.VKI_deadkeysOn = checkbox;
    } else this.VKI_deadkeysOn.checked = this.VKI_deadkeysOn;

    if (this.VKI_showVersion) {
        let vr = document.createElement('var');
        vr.title = this.VKI_i18n['09'] + ' ' + this.VKI_version;
        vr.appendChild(document.createTextNode('v' + this.VKI_version));
        div.appendChild(vr);
    } td.appendChild(div);
    tr.appendChild(td);

    this.VKI_numpadCell = document.createElement('td');
    this.VKI_numpadCell.id = 'keyboardInputNumpad';
    if (!this.VKI_numberPadOn) {
        this.VKI_numpadCell.style.display = 'none';
        this.VKI_numpadCell.previousStyle = 'none';
    } else this.VKI_numpadCell.previousStyle = '';
    let ntable = document.createElement('table');
    ntable.cellSpacing = '0';
    let ntbody = document.createElement('tbody');
    for (let x = 0; x < this.VKI_numpad.length; x++) {
        let ntr = document.createElement('tr');
        for (let y = 0; y < this.VKI_numpad[x].length; y++) {
            let ntd = document.createElement('td');
            ntd.addEventListener('click', VKI_keyClick);
            if (this.VKI_numpad[x][y][0].match(/\d/)) ntd.classList.add('digit');
            if (this.VKI_numpad[x][y][0] == '.') ntd.classList.add('decimal');
            if (this.VKI_numpad[x][y][0] == '-') ntd.classList.add('negative');
            ntd.appendChild(document.createTextNode(this.VKI_numpad[x][y][0]));
            VKI_mouseEvents(ntd);
            ntr.appendChild(ntd);
        } ntbody.appendChild(ntr);
    } ntable.appendChild(ntbody);
    this.VKI_numpadCell.appendChild(ntable);
    tr.appendChild(this.VKI_numpadCell);
    tbody.appendChild(tr);
    this.VKI_keyboard.appendChild(tbody);


    /* ****************************************************************
     * Build or rebuild the keyboard keys
     *
     */
    this.VKI_buildKeys = function() {
        this.VKI_shift = this.VKI_shiftlock = this.VKI_altgr = this.VKI_altgrlock = this.VKI_dead = false;
        let container = this.VKI_keyboard.tBodies[0].getElementsByTagName('div')[0];
        for (let t = container.getElementsByTagName('table'), x = t.length - 1; x >= 0; x--)
            container.removeChild(t[x]);

        let hasDeadKey = false;
        for (let x = 0, lyt; lyt = this.VKI_layout[this.VKI_kt].keys[x++];) {
            let table = document.createElement('table');
            table.cellSpacing = '0';
            if (lyt.length <= this.VKI_keyCenter) table.classList.add('keyboardInputCenter');
            let tbody = document.createElement('tbody');
            let tr = document.createElement('tr');
            for (let y = 0, lkey; lkey = lyt[y++];) {
                let td = document.createElement('td');
                if (this.VKI_symbol[lkey[0]]) {
                    let text = this.VKI_symbol[lkey[0]].split("\n");
                    let small = document.createElement('small');
                    small.setAttribute('char', lkey[0]);
                    for (let z = 0; z < text.length; z++) {
                        if (z) small.appendChild(document.createElement('br'));
                        small.appendChild(document.createTextNode(text[z]));
                    } td.appendChild(small);
                } else td.appendChild(document.createTextNode(lkey[0] || '\xa0'));

                if (this.VKI_deadkeysOn.checked)
                    for (const key in this.VKI_deadkey)
                        if (key === lkey[0]) { td.classList.add('deadkey'); break; }
                if (lyt.length > this.VKI_keyCenter && y == lyt.length) td.classList.add('last');
                if (lkey[0] == ' ' || lkey[1] == ' ') td.classList.add('space');

                switch (lkey[1]) {
                    case 'Caps': case 'Shift':
                    case 'Alt': case 'AltGr': case 'AltLk':
                        td.addEventListener('click', (function(type) { return function() { self.VKI_modify(type); return false; }})(lkey[1]));
                        break;

                    case 'Tab':
                        td.addEventListener('click', function() {
                            if (self.VKI_activeTab) {
                                if (self.VKI_target.form) {
                                    let target = self.VKI_target, elems = target.form.elements;
                                    self.VKI_close();
                                    for (let z = 0, me = false, j = -1; z < elems.length; z++) {
                                        if (j == -1 && elems[z].getAttribute('VKI_attached')) j = z;
                                        if (me) {
                                            if (self.VKI_activeTab == 1 && elems[z]) break;
                                            if (elems[z].getAttribute('VKI_attached')) break;
                                        } else if (elems[z] == target) me = true;
                                    }
                                    if (z == elems.length) z = Math.max(j, 0);
                                    if (elems[z].getAttribute('VKI_attached')) {
                                        self.VKI_show(elems[z]);
                                    } else elems[z].focus();
                                } else self.VKI_target.focus();
                            } else self.VKI_insert("\t");
                            return false;
                        });
                        break;

                    case 'Bksp':
                        td.title = this.VKI_i18n['12'];
                        td.addEventListener('click', function() { self.VKI_backspace(); });
                        break;

                    case 'Enter':
                        td.addEventListener('click', function() {
                            if (self.VKI_target.nodeName != 'TEXTAREA') {
                                if (self.VKI_enterSubmit && self.VKI_target.form) {
                                    for (let z = 0, subm = false; z < self.VKI_target.form.elements.length; z++)
                                        if (self.VKI_target.form.elements[z].type == 'submit') subm = true;
                                    if (!subm) self.VKI_target.form.submit();
                                }
                                self.VKI_close();
                            } else self.VKI_insert("\n");
                            return true;
                        });
                        break;

                    case 'Complete': // Korean input only
                        td.title = this.VKI_i18n['13'];
                        td.id = 'keyboardInputKOComplete';
                        td.textContent = '';
                        td.addEventListener('click', function() {
                            self.VKI_target.focus();
                            self.VKI_KO_clearCurrent?.();
                            // Keep the cursor in place
                            self.VKI_target.setSelectionRange(
                                self.VKI_target.selectionStart,
                                self.VKI_target.selectionStart
                            );
                        });
                        break;

                    default:
                        td.addEventListener('click', VKI_keyClick);

                }
                VKI_mouseEvents(td);
                tr.appendChild(td);
                for (let z = 0; z < 4; z++)
                    if (this.VKI_deadkey[lkey[z] = lkey[z] || '']) hasDeadKey = true;
            } tbody.appendChild(tr);
            table.appendChild(tbody);
            container.appendChild(table);
        }
        if (this.VKI_deadBox)
            this.VKI_deadkeysOn.style.display = (hasDeadKey) ? 'inline' : 'none';
    };

    this.VKI_buildKeys();
    this.VKI_keyboard.addEventListener('selectstart', function() { return false; });
    this.VKI_keyboard.unselectable = 'on';


    /* ******************************************************************
     * Controls modifier keys
     *
     */
    this.VKI_modify = function(type) {
        switch (type) {
            case 'Alt': case 'AltGr': this.VKI_altgr = !this.VKI_altgr; break;
            case 'AltLk': this.VKI_altgr = 0; this.VKI_altgrlock = !this.VKI_altgrlock; break;
            case 'Caps': this.VKI_shift = 0; this.VKI_shiftlock = !this.VKI_shiftlock; break;
            case 'Shift': this.VKI_shift = !this.VKI_shift;
        }
        let vchar = 0;
        if (!this.VKI_shift != !this.VKI_shiftlock) vchar += 1;
        if (!this.VKI_altgr != !this.VKI_altgrlock) vchar += 2;

        for (let t = this.VKI_keyboard.tBodies[0].getElementsByTagName('div')[0].getElementsByTagName('table'), x = 0, tds; x < t.length; x++) {
            tds = t[x].getElementsByTagName('td');
            for (let y = 0, lkey; y < tds.length; y++) {
                tds[y].className = '';
                lkey = this.VKI_layout[this.VKI_kt].keys[x][y];

                switch (lkey[1]) {
                    case 'Alt':
                    case 'AltGr':
                        if (this.VKI_altgr) tds[y].classList.add('pressed');
                        break;
                    case 'AltLk':
                        if (this.VKI_altgrlock) tds[y].classList.add('pressed');
                        break;
                    case 'Shift':
                        if (this.VKI_shift) tds[y].classList.add('pressed');
                        break;
                    case 'Caps':
                        if (this.VKI_shiftlock) tds[y].classList.add('pressed');
                        break;
                    case 'Tab': case 'Enter': case 'Bksp': case 'Complete': break;
                    default:
                        if (type) {
                            tds[y].removeChild(tds[y].firstChild);
                            if (this.VKI_symbol[lkey[vchar]]) {
                                let text = this.VKI_symbol[lkey[vchar]].split("\n");
                                let small = document.createElement('small');
                                small.setAttribute('char', lkey[vchar]);
                                for (let z = 0; z < text.length; z++) {
                                    if (z) small.appendChild(document.createElement('br'));
                                    small.appendChild(document.createTextNode(text[z]));
                                } tds[y].appendChild(small);
                            } else tds[y].appendChild(document.createTextNode(lkey[vchar] || '\xa0'));
                        }
                        if (this.VKI_deadkeysOn.checked) {
                            let character = tds[y].firstChild.nodeValue || tds[y].firstChild.className;
                            if (this.VKI_dead) {
                                if (character == this.VKI_dead) tds[y].classList.add('pressed');
                                if (this.VKI_deadkey[this.VKI_dead][character]) tds[y].classList.add('target');
                            }
                            if (this.VKI_deadkey[character]) tds[y].classList.add('deadkey');
                        }
                }

                if (y == tds.length - 1 && tds.length > this.VKI_keyCenter) tds[y].classList.add('last');
                if (lkey[0] == ' ' || lkey[1] == ' ') tds[y].classList.add('space');
            }
        }
    };


    /* ******************************************************************
     * Insert text at the cursor
     *
     */
    this.VKI_insert = function(text) {
        this.VKI_target.dispatchEvent(new Event('beforeinput'));
        this.VKI_target.focus();
        if (this.VKI_target.maxLength)
            this.VKI_target.maxlength = this.VKI_target.maxLength;
        if (typeof this.VKI_target.maxlength == 'undefined' ||
            this.VKI_target.maxlength < 0 ||
            this.VKI_target.value.length < this.VKI_target.maxlength) {
            if (!this.VKI_target.readOnly || this.VKI_target.getAttribute('VKI_type') == 'password') {
                let rng = [this.VKI_target.selectionStart, this.VKI_target.selectionEnd];
                // If using the Korean keyboard
                if (this.VKI_kt == '\ud55c\uad6d\uc5b4') {
                    let val = this.VKI_KO_insert?.(text, rng);
                    if (typeof val != 'undefined') [text, rng] = val;
                }
                this.VKI_target.value = this.VKI_target.value.substr(0, rng[0]) + text + this.VKI_target.value.substr(rng[1]);
                this.VKI_target.setSelectionRange(rng[0] + text.length, rng[0] + text.length);
            } // Readonly
            if (this.VKI_shift) this.VKI_modify('Shift');
            if (this.VKI_altgr) this.VKI_modify('AltGr');
            this.VKI_target.dispatchEvent(new Event('input'));
            this.VKI_target.focus();
        } // Addition of this character would be over the maxLength
    };


    /* ******************************************************************
     * Delete a character behind the cursor
     *
     */
    this.VKI_backspace = function() {
        this.VKI_target.focus();
        if (!this.VKI_target.readOnly || this.VKI_target.getAttribute('VKI_type') == 'password') {
            let rng = [this.VKI_target.selectionStart, this.VKI_target.selectionEnd];
            // Get the character we're about to delete with backspace
            let lastInput = this.VKI_target.value.substr(rng[0] - 1, rng[1]);
            // Delete the previous character
            if (rng[0] < rng[1]) rng[0]++;
            this.VKI_target.value = this.VKI_target.value.substr(0, rng[0] - 1) + this.VKI_target.value.substr(rng[1]);
            this.VKI_target.setSelectionRange(rng[0] - 1, rng[0] - 1);
            // If using the Korean keyboard
            if (this.VKI_kt == '\ud55c\uad6d\uc5b4')
                this.VKI_KO_backspace?.(lastInput, rng);
        } // Readonly
        if (this.VKI_shift) this.VKI_modify('Shift');
        if (this.VKI_altgr) this.VKI_modify('AltGr');
        this.VKI_target.focus();
        return true;
    };


    /* ******************************************************************
     * Show the keyboard interface
     *
     */
    this.VKI_show = function(elem) {
        if (!this.VKI_target) {
            this.VKI_target = elem;
            if (this.VKI_langAdapt && this.VKI_target.lang) {
                let chg = false, lang = this.VKI_target.lang.toLowerCase().replace(/-/g, '_');
                for (const layout in this.VKI_layout)
                    for (let y = 0; y < this.VKI_layout[layout].lang.length; y++)
                        if (!chg && lang == this.VKI_layout[layout].lang[y].toLowerCase())
                            chg = this.VKI_select.firstChild.nodeValue = this.VKI_kt = layout;
                if (chg) this.VKI_buildKeys();
            }
            try {
                this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard);
            } catch (e) {}
            if (this.VKI_target.getAttribute('VKI_type') == 'password') {
                this.VKI_target.storeReadOnly = this.VKI_target.readOnly;
                this.VKI_target.readOnly = 'readonly';
                if (this.VKI_clearPasswords) this.VKI_target.value = '';
            }
            if (this.VKI_target.getAttribute('VKI_numpadInput') == 'true') {
                this.VKI_keyboard.classList.add('numpadOnly');
                this.VKI_numpadCell.classList.add('showNegative', 'showDecimal');
                this.VKI_numpadCell.previousStyle = this.VKI_numpadCell.style.display;
                this.VKI_numpadCell.style.display = '';
                let noNeg = false;
                this.VKI_target.pattern = '^[+-]?[0-9]*\\.?[0-9]*$';
                if (this.VKI_target.min && parseFloat(this.VKI_target.min) >= 0) {
                    this.VKI_target.pattern = '^\\+?[0-9]*\\.?[0-9]*$';
                    this.VKI_numpadCell.classList.remove('showNegative');
                    noNeg = true;
                }
                if (this.VKI_target.step && !parseFloat(this.VKI_target.step).toString().match(/\./)) {
                    this.VKI_target.pattern = (noNeg) ? '^\\+?[0-9]*$' : '^[+-]?[0-9]*$';
                    this.VKI_numpadCell.classList.remove('showDecimal');
                }
            } else {
                this.VKI_keyboard.classList.remove('numpadOnly');
                this.VKI_numpadCell.style.display = this.VKI_numpadCell.previousStyle;
            }

            let elemStep = this.VKI_target;
            this.VKI_target.keyboardPosition = 'absolute';
            do {
                if (window.getComputedStyle(elemStep, null)['position'] == 'fixed') {
                    this.VKI_target.keyboardPosition = 'fixed';
                    break;
                }
            } while (elemStep = elemStep.offsetParent);

            document.body.appendChild(this.VKI_keyboard);
            this.VKI_keyboard.style.position = this.VKI_target.keyboardPosition;

            this.VKI_position(true);
            this.VKI_target.blur();
            this.VKI_target.focus();

            this.VKI_KO_targetEvents?.();
        } else this.VKI_close();
    };


    /* ******************************************************************
     * Position the keyboard
     *
     */
    this.VKI_position = function(force) {
        if (this.VKI_target) {
            let kPos = VKI_findPos(this.VKI_keyboard), wDim = VKI_innerDimensions(), sDis = VKI_scrollDist();
            let place = false, fudge = this.VKI_target.offsetHeight + 3;
            if (force !== true) {
                if (kPos[1] + this.VKI_keyboard.offsetHeight - sDis[1] - wDim[1] > 0) {
                    place = true;
                    fudge = -this.VKI_keyboard.offsetHeight - 3;
                } else if (kPos[1] - sDis[1] < 0) place = true;
            }
            if (place || force === true) {
                let iPos = VKI_findPos(this.VKI_target), scr = this.VKI_target;
                while (scr = scr.parentNode) {
                    if (scr == document.body) break;
                    if (scr.scrollHeight > scr.offsetHeight || scr.scrollWidth > scr.offsetWidth) {
                        if (!scr.getAttribute('VKI_scrollListener')) {
                            scr.setAttribute('VKI_scrollListener', true);
                            scr.addEventListener('scroll', function() { this.VKI_position(true); });
                        } // Check if the input is in view
                        let pPos = VKI_findPos(scr), oTop = iPos[1] - pPos[1], oLeft = iPos[0] - pPos[0];
                        let top = oTop + this.VKI_target.offsetHeight;
                        let left = oLeft + this.VKI_target.offsetWidth;
                        let bottom = scr.offsetHeight - oTop - this.VKI_target.offsetHeight;
                        let right = scr.offsetWidth - oLeft - this.VKI_target.offsetWidth;
                        this.VKI_keyboard.style.display = (top < 0 || left < 0 || bottom < 0 || right < 0) ? 'none' : '';
                    }
                }
                this.VKI_keyboard.style.top = iPos[1] + fudge + 'px';
                this.VKI_keyboard.style.left = Math.max(10, Math.min(wDim[0] - this.VKI_keyboard.offsetWidth - 25, iPos[0])) + 'px';
            }
            if (force === true) this.VKI_position();
        }
    };


    /* ******************************************************************
     * Close the keyboard interface
     *
     */
    this.VKI_close = VKI_close = function() {
        if (this.VKI_target) {
            if (this.VKI_move) this.VKI_move.drop();
            this.VKI_KO_clearCurrent?.();

            if (this.VKI_target.getAttribute('VKI_type') == 'password')
                this.VKI_target.readOnly = this.VKI_target.storeReadOnly;
            if (this.VKI_target.getAttribute('VKI_numpadInput') == 'true')
                this.VKI_target.pattern = '.*';
            try {
                this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard);
            } catch (e) {}
            if (this.VKI_kt != this.VKI_kts) {
                this.VKI_select.firstChild.nodeValue = this.VKI_kt = this.VKI_kts;
                this.VKI_buildKeys();
            }
            this.VKI_select.getElementsByTagName('ol')[0].style.display = '';;
            this.VKI_select.sortType = 0;
            this.VKI_target.focus();
            this.VKI_target = false;
            this.VKI_KO_targetEvents?.();
        }
    };


    /* ***** Private functions *************************************** */
    let VKI_findPos = function(obj) {
        if (self.VKI_target.keyboardPosition != 'fixed') {
            let curleft = curtop = 0, scr = obj;
            while ((scr = scr.parentNode) && scr != document.body) {
                curleft -= scr.scrollLeft || 0;
                curtop -= scr.scrollTop || 0;
            }
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return [curleft, curtop];
        } else {
            let boundingRect = obj.getBoundingClientRect();
            return [boundingRect.left, boundingRect.top];
        }
    };

    let VKI_innerDimensions = function() {
        if (self.innerHeight) {
            return [self.innerWidth, self.innerHeight];
        } else if (document.documentElement && document.documentElement.clientHeight) {
            return [document.documentElement.clientWidth, document.documentElement.clientHeight];
        } else if (document.body && document.body.clientWidth)
            return [document.body.clientWidth, document.body.clientHeight];
        return [0, 0];
    };

    let VKI_scrollDist = function() {
        let html = document.getElementsByTagName('html')[0];
        if (html.scrollTop && document.documentElement.scrollTop) {
            return [html.scrollLeft, html.scrollTop];
        } else if (html.scrollTop || document.documentElement.scrollTop) {
            return [html.scrollLeft + document.documentElement.scrollLeft, html.scrollTop + document.documentElement.scrollTop];
        } else if (document.body.scrollTop)
            return [document.body.scrollLeft, document.body.scrollTop];
        return [0, 0];
    };

    window.addEventListener('resize', this.VKI_position);
    window.addEventListener('scroll', this.VKI_position);
    window.addEventListener('load', function() {
        let inputElems = [
            ...document.getElementsByTagName('input'),
            ...document.getElementsByTagName('textarea')
        ];
        for (let x = 0, elem; elem = inputElems[x++];)
            if (elem.nodeName == 'TEXTAREA' || elem.type == 'text' || elem.type == 'number' || elem.type == 'password')
                if (elem.classList.contains('keyboardInput')) VKI_attach(elem);

        document.documentElement.addEventListener('click', function(e) {
            self.VKI_close();
        });
    });
})();