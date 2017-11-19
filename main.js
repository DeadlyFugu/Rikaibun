
var km_tokenizer = null

window.onload = function () {
	const textInputBox = document.getElementById('input')
	const resultDisplay = document.getElementById('result-span')

	kuromoji.builder({dicPath: 'kuromoji/dict/'}).build(function(err, tokenizer) {
		km_tokenizer = tokenizer
		if (textInputBox.value.length > 0) {
			updateResultDisplay(resultDisplay, this.value)
		} else {
			resultDisplay.innerHTML = 'Ready!'
		}
		
		textInputBox.focus()
	})

	textInputBox.addEventListener('input', function (event) {
		if (km_tokenizer != null) {
			updateResultDisplay(resultDisplay, this.value)
		}
	})

	// const testElement = document.getElementById('test')

	// testElement.onmouseover = function() {

	// }

	// testElement.onmouseout = function() {

	// }
}

const verb_searchback = 6
const adjective_searchback = 5;
const wordTypeLookup = {
	"名詞": ["Noun", "noun", 0],
	"助詞": ["Particle", "particle", 0],
	"動詞": ["Verb", "verb", verb_searchback],
	"助動詞": ["Auxiliary Verb", "aux-verb", verb_searchback],
	"形容詞": ["Adjective", "adjective", adjective_searchback],
	"副詞": ["Adverb", "adverb", 0],
	"接続詞": ["Conjunction", "particle", 0],
	"連体詞": ["Adnominal Adjective", "adjective", adjective_searchback],
	"記号": ["Symbol", "other", 0],
	"感動詞": ["Interjection", "other", 0],
	"接頭詞": ["Prefix", "adjective", 0],
	"フィラー": ["Filler", "other", 0],
}

// const englishTable = {
// 	"ガル接続": "-garu Setsuzoku",
// 	"仮定形": "Kateikei",
// 	"体言接続": "Taigen Setsuzoku",
// 	"基本形": "Kihonkei",
// 	"未然ウ接続": "Mizen U Setsuzoku",
// 	"未然レル接続": "Mizen Reru Setsuzoku",
// 	"未然形": "Mizenkei",
// 	"連用タ接続": "Ren'you Ta Setsuzoku",
// 	"連用形": "Ren'youkei",
//  "連用デ接続": "Ren'you De Setsuzoku",
//  "命令ｉ": "Meirei I",
//  "命令ｅ": "Meirei E"
// }

const englishTable = {
	"ガル接続": "-garu Setsuzoku",
	"仮定形": "Kateikei",
	"体言接続": "Taigen Setsuzoku",
	"基本形": "Dictionary",
	"未然ウ接続": "-u",
	"未然レル接続": "-reru",
	"未然形": "-nai",
	"連用タ接続": "-ta",
	"連用形": "-masu",
	"連用デ接続": "-de",
	"命令ｉ": "Command -i",
	"命令ｅ": "Command"
}

const updateResultDisplay = function (resultDisplay, inputText) {
	const tokens = km_tokenizer.tokenize(inputText)

	var builtOutput = ""

	for (const i in tokens) {
		// get token info
		const token = tokens[i]

		// syntax highlighting
		const purpose = wordTypeLookup[token.pos]
		var clazz = purpose ? " " + purpose[1] : ""
		var clazz_back = purpose ? " " + purpose[1] + "-back" : ""

		var jmdict_index = kuromoji_to_jmdict[token.word_id]
		if (jmdict_index == undefined) {
			jmdict_index = kuromoji_to_jmdict_2[token.word_id]
		}

		if (purpose != undefined) {
			for (var j = 1; j <= purpose[2]; j++) {
				if (jmdict_index != undefined) break;
				jmdict_index = kuromoji_to_jmdict[token.word_id - 10 * j]
			}
		}

		builtOutput += '<span class="word' + clazz + '">' + token.surface_form +
		'<div class="popup">\n【' + token.basic_form + '】' + token.pronunciation +
		(purpose ? '<span class="purpose' + clazz_back + '">' + purpose[0] + '</span>' : '') +
		//(token.conjugated_form != '*' ? '<span class="purpose' + clazz_back + '">' + englishTable[token.conjugated_form] + '</span>' : '') +
		'<br/>' + (jmdict_index != undefined ? jmdict_meanings[jmdict_index] : 'unknown [' + token.word_id + ']') + '</div>' + '</span>'
	}

	resultDisplay.innerHTML = builtOutput
}
