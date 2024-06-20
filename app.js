const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
translateBtn = document.querySelector("button"),
selectTags = document.querySelectorAll("select"),
exchangeIcon = document.querySelector(".exchange"),
icons = document.querySelectorAll(".row i");

// Populate select elements with country options
selectTags.forEach((tag, id) => {
    for (const country_code in countries) {
        let selected = "";
        if (id == 0 && country_code == "en-GB") {
            selected = "selected";
        } else if (id == 1 && country_code == "hi-IN") {
            selected = "selected";
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Exchange languages
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value,
    tempLang = selectTags[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTags[0].value = selectTags[1].value;
    selectTags[1].value = tempLang;
});

// Translate text
translateBtn.addEventListener("click", () => {
    let text = fromText.value,
        translateFrom = selectTags[0].value,
        translateTo = selectTags[1].value;
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
            toText.value = data.responseData.translatedText;
            toText.setAttribute("placeholder", "Translation");
        })
        .catch(() => {
            toText.setAttribute("placeholder", "Translation failed");
        });
});

// Handle icon click events
icons.forEach(icon => {
    icon.addEventListener("click", (event) => {
        let target = event.target;
        if (target.classList.contains("fa-copy")) {
            if (target.closest(".row").classList.contains("from")) {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if (target.closest(".row").classList.contains("from")) {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTags[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTags[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
