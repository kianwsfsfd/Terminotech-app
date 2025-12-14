// ======= CONFIGURE THIS PER PAGE =======
const currentCOC = "COC1"; // Palitan: "COC1", "COC2", "COC3" depende sa page

// ======= BASE TERMS =======
let terms = {
    "Safe Mode": { full: "Safe Mode", meaning: "A diagnostic startup mode in Windows used to fix system problems." },
    "Command Prompt": { full: "Command Prompt", meaning: "Windows command line interface." }
};

// ======= LOAD ADMIN-ADDED TERMS =======
const addedTerms = JSON.parse(localStorage.getItem("addedTerms") || "[]");
addedTerms.forEach(t => {
    if (t.coc === currentCOC) {  // Filter by COC
        terms[t.term] = { full: t.full || t.term, meaning: t.meaning };
    }
});

// ======= LOAD CUSTOM TERMS =======
const custom = JSON.parse(localStorage.getItem("custom_terms") || "{}");
for (const key in custom) {
    if (custom[key].coc === currentCOC) {  // Filter by COC
        terms[key] = custom[key];
    }
}

// ======= BUILD LOOKUP TABLE =======
const lookup = {};
for (const k in terms) {
    if (terms[k].full) {
        lookup[k.toUpperCase()] = k;
        lookup[terms[k].full.toUpperCase()] = k;
    }
}

// ======= GET HTML ELEMENTS =======
const termInput    = document.getElementById("termInput");
const translateBtn = document.getElementById("translateBtn");
const speakBtn     = document.getElementById("speakBtn");
const listBtn      = document.getElementById("listBtn");
const favoriteBtn  = document.getElementById("favoriteBtn");
const outputDiv    = document.getElementById("output");

let currentTerm = "", currentFull = "";

// ======= TRANSLATE FUNCTION =======
translateBtn.addEventListener("click", () => {
    const raw = termInput.value.trim();
    if (!raw) return;
    const alias = lookup[raw.toUpperCase()];
    if (!alias) {
        outputDiv.innerHTML = "<span style='color:red'>Term not found.</span>";
        speakBtn.disabled = true;
        favoriteBtn.disabled = true;
        return;
    }
    const data = terms[alias];
    currentTerm = alias;
    currentFull = data.full;
    outputDiv.innerHTML = `<strong>${alias}</strong><br><em>${data.full}</em><br>${data.meaning}`;
    speakBtn.disabled = false;
    favoriteBtn.disabled = false;
});

// ======= ENTER KEY SUPPORT =======
termInput.addEventListener("keyup", e => {
    if (e.key === "Enter") translateBtn.click();
});

// ======= SPEAK FUNCTION =======
speakBtn.addEventListener("click", () => {
    if (!currentFull) return;
    const utter = new SpeechSynthesisUtterance(currentFull);
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
});

// ======= NAVIGATION =======
listBtn.addEventListener("click", () => {
    window.location.href = currentCOC + "DICTIONARY.html";
});

favoriteBtn.addEventListener("click", () => {
    if (!currentTerm) return;
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favs.includes(currentTerm)) favs.push(currentTerm);
    localStorage.setItem("favorites", JSON.stringify(favs));
    window.location.href = "Favoritelist.html";
});
