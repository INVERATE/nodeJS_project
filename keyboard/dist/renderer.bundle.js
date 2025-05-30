(() => {
  // node_modules/ramda/es/internal/_isPlaceholder.js
  function _isPlaceholder(a) {
    return a != null && typeof a === "object" && a["@@functional/placeholder"] === true;
  }

  // node_modules/ramda/es/internal/_curry1.js
  function _curry1(fn) {
    return function f1(a) {
      if (arguments.length === 0 || _isPlaceholder(a)) {
        return f1;
      } else {
        return fn.apply(this, arguments);
      }
    };
  }

  // node_modules/ramda/es/internal/_curry2.js
  function _curry2(fn) {
    return function f2(a, b) {
      switch (arguments.length) {
        case 0:
          return f2;
        case 1:
          return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
            return fn(a, _b);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
            return fn(_a, b);
          }) : _isPlaceholder(b) ? _curry1(function(_b) {
            return fn(a, _b);
          }) : fn(a, b);
      }
    };
  }

  // node_modules/ramda/es/internal/_arity.js
  function _arity(n, fn) {
    switch (n) {
      case 0:
        return function() {
          return fn.apply(this, arguments);
        };
      case 1:
        return function(a0) {
          return fn.apply(this, arguments);
        };
      case 2:
        return function(a0, a1) {
          return fn.apply(this, arguments);
        };
      case 3:
        return function(a0, a1, a2) {
          return fn.apply(this, arguments);
        };
      case 4:
        return function(a0, a1, a2, a3) {
          return fn.apply(this, arguments);
        };
      case 5:
        return function(a0, a1, a2, a3, a4) {
          return fn.apply(this, arguments);
        };
      case 6:
        return function(a0, a1, a2, a3, a4, a5) {
          return fn.apply(this, arguments);
        };
      case 7:
        return function(a0, a1, a2, a3, a4, a5, a6) {
          return fn.apply(this, arguments);
        };
      case 8:
        return function(a0, a1, a2, a3, a4, a5, a6, a7) {
          return fn.apply(this, arguments);
        };
      case 9:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          return fn.apply(this, arguments);
        };
      case 10:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return fn.apply(this, arguments);
        };
      default:
        throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
    }
  }

  // node_modules/ramda/es/internal/_curry3.js
  function _curry3(fn) {
    return function f3(a, b, c) {
      switch (arguments.length) {
        case 0:
          return f3;
        case 1:
          return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          });
        case 2:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          }) : _curry1(function(_c) {
            return fn(a, b, _c);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
            return fn(_a, _b, c);
          }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          }) : _isPlaceholder(a) ? _curry1(function(_a) {
            return fn(_a, b, c);
          }) : _isPlaceholder(b) ? _curry1(function(_b) {
            return fn(a, _b, c);
          }) : _isPlaceholder(c) ? _curry1(function(_c) {
            return fn(a, b, _c);
          }) : fn(a, b, c);
      }
    };
  }

  // node_modules/ramda/es/internal/_isArray.js
  var isArray_default = Array.isArray || function _isArray(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === "[object Array]";
  };

  // node_modules/ramda/es/internal/_isString.js
  function _isString(x) {
    return Object.prototype.toString.call(x) === "[object String]";
  }

  // node_modules/ramda/es/internal/_isArrayLike.js
  var _isArrayLike = /* @__PURE__ */ _curry1(function isArrayLike(x) {
    if (isArray_default(x)) {
      return true;
    }
    if (!x) {
      return false;
    }
    if (typeof x !== "object") {
      return false;
    }
    if (_isString(x)) {
      return false;
    }
    if (x.nodeType === 1) {
      return !!x.length;
    }
    if (x.length === 0) {
      return true;
    }
    if (x.length > 0) {
      return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
    }
    return false;
  });
  var isArrayLike_default = _isArrayLike;

  // node_modules/ramda/es/internal/_xwrap.js
  var XWrap = /* @__PURE__ */ function() {
    function XWrap2(fn) {
      this.f = fn;
    }
    XWrap2.prototype["@@transducer/init"] = function() {
      throw new Error("init not implemented on XWrap");
    };
    XWrap2.prototype["@@transducer/result"] = function(acc) {
      return acc;
    };
    XWrap2.prototype["@@transducer/step"] = function(acc, x) {
      return this.f(acc, x);
    };
    return XWrap2;
  }();
  function _xwrap(fn) {
    return new XWrap(fn);
  }

  // node_modules/ramda/es/bind.js
  var bind = /* @__PURE__ */ _curry2(function bind2(fn, thisObj) {
    return _arity(fn.length, function() {
      return fn.apply(thisObj, arguments);
    });
  });
  var bind_default = bind;

  // node_modules/ramda/es/internal/_reduce.js
  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf["@@transducer/step"](acc, list[idx]);
      if (acc && acc["@@transducer/reduced"]) {
        acc = acc["@@transducer/value"];
        break;
      }
      idx += 1;
    }
    return xf["@@transducer/result"](acc);
  }
  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf["@@transducer/step"](acc, step.value);
      if (acc && acc["@@transducer/reduced"]) {
        acc = acc["@@transducer/value"];
        break;
      }
      step = iter.next();
    }
    return xf["@@transducer/result"](acc);
  }
  function _methodReduce(xf, acc, obj, methodName) {
    return xf["@@transducer/result"](obj[methodName](bind_default(xf["@@transducer/step"], xf), acc));
  }
  var symIterator = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
  function _reduce(fn, acc, list) {
    if (typeof fn === "function") {
      fn = _xwrap(fn);
    }
    if (isArrayLike_default(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list["fantasy-land/reduce"] === "function") {
      return _methodReduce(fn, acc, list, "fantasy-land/reduce");
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === "function") {
      return _iterableReduce(fn, acc, list);
    }
    if (typeof list.reduce === "function") {
      return _methodReduce(fn, acc, list, "reduce");
    }
    throw new TypeError("reduce: list must be array or iterable");
  }

  // node_modules/ramda/es/internal/_has.js
  function _has(prop3, obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop3);
  }

  // node_modules/ramda/es/internal/_isArguments.js
  var toString = Object.prototype.toString;
  var _isArguments = /* @__PURE__ */ function() {
    return toString.call(arguments) === "[object Arguments]" ? function _isArguments2(x) {
      return toString.call(x) === "[object Arguments]";
    } : function _isArguments2(x) {
      return _has("callee", x);
    };
  }();
  var isArguments_default = _isArguments;

  // node_modules/ramda/es/keys.js
  var hasEnumBug = !/* @__PURE__ */ {
    toString: null
  }.propertyIsEnumerable("toString");
  var nonEnumerableProps = ["constructor", "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
  var hasArgsEnumBug = /* @__PURE__ */ function() {
    "use strict";
    return arguments.propertyIsEnumerable("length");
  }();
  var contains = function contains2(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };
  var keys = typeof Object.keys === "function" && !hasArgsEnumBug ? /* @__PURE__ */ _curry1(function keys2(obj) {
    return Object(obj) !== obj ? [] : Object.keys(obj);
  }) : /* @__PURE__ */ _curry1(function keys3(obj) {
    if (Object(obj) !== obj) {
      return [];
    }
    var prop3, nIdx;
    var ks = [];
    var checkArgsLength = hasArgsEnumBug && isArguments_default(obj);
    for (prop3 in obj) {
      if (_has(prop3, obj) && (!checkArgsLength || prop3 !== "length")) {
        ks[ks.length] = prop3;
      }
    }
    if (hasEnumBug) {
      nIdx = nonEnumerableProps.length - 1;
      while (nIdx >= 0) {
        prop3 = nonEnumerableProps[nIdx];
        if (_has(prop3, obj) && !contains(ks, prop3)) {
          ks[ks.length] = prop3;
        }
        nIdx -= 1;
      }
    }
    return ks;
  });
  var keys_default = keys;

  // node_modules/ramda/es/internal/_isInteger.js
  var isInteger_default = Number.isInteger || function _isInteger(n) {
    return n << 0 === n;
  };

  // node_modules/ramda/es/nth.js
  var nth = /* @__PURE__ */ _curry2(function nth2(offset, list) {
    var idx = offset < 0 ? list.length + offset : offset;
    return _isString(list) ? list.charAt(idx) : list[idx];
  });
  var nth_default = nth;

  // node_modules/ramda/es/paths.js
  var paths = /* @__PURE__ */ _curry2(function paths2(pathsArray, obj) {
    return pathsArray.map(function(paths3) {
      var val = obj;
      var idx = 0;
      var p;
      while (idx < paths3.length) {
        if (val == null) {
          return;
        }
        p = paths3[idx];
        val = isInteger_default(p) ? nth_default(p, val) : val[p];
        idx += 1;
      }
      return val;
    });
  });
  var paths_default = paths;

  // node_modules/ramda/es/path.js
  var path = /* @__PURE__ */ _curry2(function path2(pathAr, obj) {
    return paths_default([pathAr], obj)[0];
  });
  var path_default = path;

  // node_modules/ramda/es/prop.js
  var prop = /* @__PURE__ */ _curry2(function prop2(p, obj) {
    return path_default([p], obj);
  });
  var prop_default = prop;

  // node_modules/ramda/es/reduce.js
  var reduce = /* @__PURE__ */ _curry3(_reduce);
  var reduce_default = reduce;

  // node_modules/ramda/es/internal/_pipe.js
  function _pipe(f, g) {
    return function() {
      return g.call(this, f.apply(this, arguments));
    };
  }

  // node_modules/ramda/es/internal/_checkForMethod.js
  function _checkForMethod(methodname, fn) {
    return function() {
      var length = arguments.length;
      if (length === 0) {
        return fn();
      }
      var obj = arguments[length - 1];
      return isArray_default(obj) || typeof obj[methodname] !== "function" ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
    };
  }

  // node_modules/ramda/es/slice.js
  var slice = /* @__PURE__ */ _curry3(
    /* @__PURE__ */ _checkForMethod("slice", function slice2(fromIndex, toIndex, list) {
      return Array.prototype.slice.call(list, fromIndex, toIndex);
    })
  );
  var slice_default = slice;

  // node_modules/ramda/es/tail.js
  var tail = /* @__PURE__ */ _curry1(
    /* @__PURE__ */ _checkForMethod(
      "tail",
      /* @__PURE__ */ slice_default(1, Infinity)
    )
  );
  var tail_default = tail;

  // node_modules/ramda/es/pipe.js
  function pipe() {
    if (arguments.length === 0) {
      throw new Error("pipe requires at least one argument");
    }
    return _arity(arguments[0].length, reduce_default(_pipe, arguments[0], tail_default(arguments)));
  }

  // node_modules/ramda/es/reverse.js
  var reverse = /* @__PURE__ */ _curry1(function reverse2(list) {
    return _isString(list) ? list.split("").reverse().join("") : Array.prototype.slice.call(list, 0).reverse();
  });
  var reverse_default = reverse;

  // node_modules/ramda/es/fromPairs.js
  var fromPairs = /* @__PURE__ */ _curry1(function fromPairs2(pairs) {
    var result = {};
    var idx = 0;
    while (idx < pairs.length) {
      result[pairs[idx][0]] = pairs[idx][1];
      idx += 1;
    }
    return result;
  });
  var fromPairs_default = fromPairs;

  // node_modules/ramda/es/mapObjIndexed.js
  var mapObjIndexed = /* @__PURE__ */ _curry2(function mapObjIndexed2(fn, obj) {
    return _reduce(function(acc, key) {
      acc[key] = fn(obj[key], key, obj);
      return acc;
    }, {}, keys_default(obj));
  });
  var mapObjIndexed_default = mapObjIndexed;

  // node_modules/ramda/es/sortBy.js
  var sortBy = /* @__PURE__ */ _curry2(function sortBy2(fn, list) {
    return Array.prototype.slice.call(list, 0).sort(function(a, b) {
      var aa = fn(a);
      var bb = fn(b);
      return aa < bb ? -1 : aa > bb ? 1 : 0;
    });
  });
  var sortBy_default = sortBy;

  // node_modules/ramda/es/toPairs.js
  var toPairs = /* @__PURE__ */ _curry1(function toPairs2(obj) {
    var pairs = [];
    for (var prop3 in obj) {
      if (_has(prop3, obj)) {
        pairs[pairs.length] = [prop3, obj[prop3]];
      }
    }
    return pairs;
  });
  var toPairs_default = toPairs;

  // predictionRamda.mjs
  var wordFrequencyMap = {};
  function setCorpusWords(tokens2) {
    wordFrequencyMap = {};
    tokens2.forEach((token) => {
      const word = token.toLowerCase();
      wordFrequencyMap[word] = (wordFrequencyMap[word] || 0) + 1;
    });
  }
  function predictNextLetterProbs(prefix) {
    const prefixLower = prefix.toLowerCase();
    const counts = {};
    let total = 0;
    Object.entries(wordFrequencyMap).forEach(([word, freq]) => {
      if (word.startsWith(prefixLower) && word.length > prefixLower.length) {
        const nextChar = word[prefixLower.length];
        counts[nextChar] = (counts[nextChar] || 0) + freq;
        total += freq;
      }
    });
    if (total === 0) return { " ": 1 };
    return pipe(
      mapObjIndexed_default((count) => count / total),
      toPairs_default,
      sortBy_default(prop_default(1)),
      reverse_default,
      fromPairs_default
    )(counts);
  }

  // src/keyboard.js
  var Keyboard = {
    elements: {
      main: null,
      keysContainer: null,
      keys: [],
      capsKey: null
    },
    properties: {
      value: "",
      capsLock: false,
      keyboardInputs: null,
      keyLayout: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "backspace",
        "a",
        "z",
        "e",
        "r",
        "t",
        "y",
        "u",
        "i",
        "o",
        "p",
        "caps",
        "q",
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        "m",
        "enter",
        "done",
        "w",
        "x",
        "c",
        "v",
        "b",
        "n",
        ",",
        ";",
        ":",
        "!",
        "space"
      ]
    },
    init() {
      this.elements.main = document.createElement("div");
      this.elements.main.classList.add("keyboard");
      document.body.appendChild(this.elements.main);
      this.elements.keysContainer = document.createElement("div");
      this.elements.keysContainer.classList.add("keyboard__keys");
      this.elements.main.appendChild(this.elements.keysContainer);
      this.elements.keysContainer.appendChild(this._createKeys());
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
      this.properties.keyboardInputs = document.querySelectorAll(
        ".use-keyboard-input"
      );
      this.properties.keyboardInputs.forEach((element) => {
        element.addEventListener("focus", () => {
          this.open(element.value, (currentValue) => {
            element.value = currentValue;
          });
        });
      });
    },
    _createIconHTML(icon_name) {
      return `<span class="material-icons">${icon_name}</span>`;
    },
    _createKeyBtn(iconName = "", class1 = "", onclick = () => {
    }, class2 = "", dataChar = null) {
      this.keyElement = document.createElement("button");
      this.keyElement.setAttribute("type", "button");
      this.keyElement.classList.add("keyboard__key");
      if (class1) this.keyElement.classList.add(class1);
      if (class2) this.keyElement.classList.add(class2);
      if (iconName) {
        this.keyElement.innerHTML = this._createIconHTML(iconName);
      }
      if (dataChar !== null) {
        this.keyElement.dataset.char = dataChar;
      }
      this.keyElement.addEventListener("click", onclick);
      return this.keyElement;
    },
    _createKeys() {
      const fragment = document.createDocumentFragment();
      this.properties.keyLayout.forEach((key) => {
        const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;
        switch (key) {
          case "backspace":
            this._createKeyBtn(
              "backspace",
              "keyboard__key--wide",
              () => {
                this.properties.value = this.properties.value.slice(0, -1);
                this._updateValueInTarget();
              }
            );
            break;
          case "caps":
            this._createKeyBtn(
              "keyboard_capslock",
              "keyboard__key--activatable",
              () => {
                this.elements.capsKey.classList.toggle("keyboard__key--active");
                this._toggleCapsLock();
              },
              "keyboard__key--wide"
            );
            this.elements.capsKey = this.keyElement;
            break;
          case "enter":
            this._createKeyBtn(
              "keyboard_return",
              "keyboard__key--wide",
              () => {
                this.properties.value += "\n";
                this._updateValueInTarget();
              }
            );
            break;
          case "space":
            const spaceBtn = this._createKeyBtn(
              "space_bar",
              "keyboard__key--extra--wide",
              () => {
                this.properties.value += " ";
                this._updateValueInTarget();
              },
              "",
              // pas de class2
              " "
              // data-char pour la touche espace
            );
            fragment.appendChild(spaceBtn);
            break;
          case "done":
            this._createKeyBtn(
              "check_circle",
              "keyboard__key--dark",
              () => {
                this.close();
                this._updateValueInTarget();
              },
              "keyboard__key--wide"
            );
            break;
          // Partie du clavier avec les corrections pour la prédiction des lettres
          // Dans la fonction _createKeys(), cas "default" corrigé :
          default:
            this._createKeyBtn("", "", () => {
              this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
              this._updateValueInTarget();
              const currentValue = this.properties.value.trim().split(/\s+/);
              const lastWord = currentValue[currentValue.length - 1] || " ";
              if (!corpusReady) {
                console.warn("Le corpus n'est pas encore pr\xEAt !");
                return;
              }
              const letterProbs = predictNextLetterProbs(lastWord);
              console.log("Valeur tap\xE9e :", this.properties.value);
              console.log("Mot en cours :", lastWord);
              console.log("Letter probs:", letterProbs);
              this.elements.keys.forEach((keyEl) => {
                keyEl.classList.remove("activeYellow", "activePurple");
                let char;
                if (keyEl.dataset.char) {
                  char = keyEl.dataset.char.toLowerCase();
                } else if (keyEl.textContent && keyEl.textContent.trim()) {
                  char = keyEl.textContent.trim().toLowerCase();
                } else {
                  return;
                }
                if (char === " " || char.length !== 1 || /[^a-z0-9]/.test(char)) return;
                const prob = letterProbs[char] || 0;
                if (prob > 0.15) {
                  keyEl.classList.add("activePurple");
                } else if (prob > 0.05) {
                  keyEl.classList.add("activeYellow");
                }
              });
            });
            this.keyElement.textContent = key.toLowerCase();
            this.keyElement.dataset.char = key.toLowerCase();
            break;
        }
        fragment.appendChild(this.keyElement);
        if (insertLineBreak) {
          fragment.appendChild(document.createElement("br"));
        }
      });
      return fragment;
    },
    _updateValueInTarget() {
      this.properties.keyboardInputs.forEach((keyboard) => {
        keyboard.value = this.properties.value;
      });
    },
    _toggleCapsLock() {
      this.properties.capsLock = !this.properties.capsLock;
      for (let key of this.elements.keys) {
        if (key.childElementCount === 0) {
          key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
    },
    open(initialValue, oninput) {
      this.properties.value = initialValue || "";
      this.elements.main.classList.remove("keyboard--hidden");
      this.elements.main.classList.add("keyboard--visible");
    },
    close() {
      this.elements.main.classList.remove("keyboard--visible");
      this.properties.value = this.properties.value;
      this.elements.main.classList.add("keyboard--hidden");
    }
  };
  var tokens = [];
  function tokenizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s!:;,]/gi, " ").split(/\s+/).filter(Boolean);
  }
  var corpusReady = false;
  var FALLBACK_CORPUS = `
    le chat dort paisiblement sur le canap\xE9 pendant que le chien court dans le jardin
    la pluie tombe doucement sur les toits de la ville endormie
    un bon livre et une tasse de th\xE9 chaud font le bonheur des jours de pluie
    les oiseaux chantent \xE0 l'aurore pour saluer le lever du soleil
    la connaissance s'acquiert par l'exp\xE9rience et l'observation
`;
  async function checkElectronAPI() {
    if (!window.electronAPI) {
      console.warn("L'API Electron n'est pas disponible dans le navigateur");
      return false;
    }
    try {
      const pingResponse = window.electronAPI.ping ? await window.electronAPI.ping() : null;
      if (pingResponse === "pong") {
        console.log("\u2705 L'API Electron est disponible et fonctionnelle");
        return true;
      } else {
        console.warn("L'API Electron ne r\xE9pond pas comme pr\xE9vu");
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la v\xE9rification de l'API Electron:", error);
      return false;
    }
  }
  async function loadCorpus() {
    console.log("D\xE9but du chargement du corpus...");
    try {
      const isElectronAvailable = await checkElectronAPI();
      let corpusText = "";
      if (isElectronAvailable) {
        console.log("Tentative de chargement du corpus via l'API Electron...");
        try {
          corpusText = await window.electronAPI.loadCorpus();
          console.log("R\xE9ponse de l'API re\xE7ue, longueur:", corpusText?.length || 0);
          if (!corpusText || corpusText.trim() === "") {
            throw new Error("Le corpus est vide");
          }
          console.log("Corpus charg\xE9 avec succ\xE8s via l'API Electron");
        } catch (apiError) {
          console.error("Erreur lors du chargement via l'API:", apiError);
          throw apiError;
        }
      } else {
        console.warn("API Electron non disponible, utilisation du corpus de secours");
        corpusText = FALLBACK_CORPUS;
      }
      console.log("Traitement du texte du corpus...");
      tokens = tokenizeText(corpusText);
      if (tokens.length === 0) {
        throw new Error("Aucun token valide trouv\xE9 dans le corpus");
      }
      console.log("D\xE9finition des mots du corpus...");
      setCorpusWords(tokens);
      corpusReady = true;
      console.log("\u2705 Corpus pr\xEAt - ", tokens.length, "tokens charg\xE9s");
    } catch (error) {
      console.error("\u274C Erreur critique lors du chargement du corpus:", error);
      console.warn("Utilisation du corpus de secours...");
      tokens = tokenizeText(FALLBACK_CORPUS);
      setCorpusWords(tokens);
      corpusReady = true;
      console.log("\u2705 Corpus de secours charg\xE9 avec succ\xE8s -", tokens.length, "tokens");
    }
  }
  loadCorpus().catch(console.error);
  window.addEventListener("DOMContentLoaded", () => {
    Keyboard.init();
    setTimeout(() => {
      Keyboard.elements.main.classList.add("keyboard--visible");
    }, 100);
  });
})();
//# sourceMappingURL=renderer.bundle.js.map
