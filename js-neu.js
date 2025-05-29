let reaktionszeiten = [];     
let letzteReaktionszeit = 0;
let letzteMessung = Date.now(); 
let anzahl;
let startTime;
let anzahlKurz = 0;
let reaktionszeitProFarbe = 0;
let reaktionszeitProFarbeSec = 0;
let letzterStart = 0;
let letzterEnde = 0;
let letzteRundeGestartet = false;
let anzahlZwei = 0;
let startTimeZwei = 0;
let anzahlLang = 0;
let spielGestartet = false;
let ersterClickGetan = false;
const soundCorrect = new Audio("correct-answer.mp3");
const soundWrong = new Audio("wrong-answer.mp3");
const soundSignup = new Audio("signed-up.mp3");
const bingSound = new Audio("bing.mp3");
const bingLastSound = new Audio("bingLast.mp3");
const buttonSound = new Audio("buttonSound.mp3");
const countdownSound = new Audio("countdown.mp3");
let counted = false;
let countedNum = false;

const bingBaseVolume = 0.2;
const bingMaxVolume = 1; 
const wuerfelAnimContainer = document.getElementById("wuerfelAnimation");

const animationInstance = lottie.loadAnimation({
  container: wuerfelAnimContainer,
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'wuerfelAnimation.json'
});

function playFixedSound(audio) {
  audio.pause();           
  audio.currentTime = 0;  
  audio.play();            
}

function zeigeLetsTest() {
  overlay.style.display = "flex";

  setTimeout(() => {
    overlay.style.display = "none";
  }, 4000);
}


let spielerName = "";
let spielerAlter = 0;
let spielerGeschlecht = "";
let anonym = false;
let spielerIP = "Unbekannt";
let userId = ""; // NEU
let startErfolgt = false;

/*// IP-Adresse abrufen
fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    spielerIP = data.ip;
    if (localStorage.getItem("angemeldet") === "true") {
  document.getElementById("startbildschirm").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
  playFixedSound(soundSignup);
  startErfolgt = true;
  localStorage.setItem("angemeldet", "true");
} else {
  checkeVorhandeneIP(spielerIP);
}
  });*/

fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    spielerIP = data.ip;
    document.getElementById("startbildschirm").style.display = "flex";
  });



/*function checkeVorhandeneIP(ip) {
  fetch("https://682f2058746f8ca4a47ff4a5.mockapi.io/game/users")
    .then(res => res.json())
    .then(users => {
      const user = users.find(u => u.ip === ip);
      if (user) {
        userId = user.id;
        spielerName = user.name;
        spielerAlter = user.alter;
        spielerGeschlecht = user.geschlecht;
        anonym = user.anonym;
        document.getElementById("startbildschirm").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
        playFixedSound(soundSignup);
        startErfolgt = true;
      } else {
        document.getElementById("startbildschirm").style.display = "flex";
      }
    });
}*/

  
// Eingabe prüfen und speichern
document.getElementById("startWeiterBtn").addEventListener("click", () => {
  const nameInput = document.getElementById("spielerName");
  const alterInput = document.getElementById("spielerAlter");
  const anonymInput = document.getElementById("anonym");
  const geschlechtInput = document.querySelector("input[name='geschlecht']:checked");

  anonym = anonymInput.checked;
  spielerName = anonym ? "Anonym" : nameInput.value.trim();
  spielerAlter = parseInt(alterInput.value);
  spielerGeschlecht = geschlechtInput ? geschlechtInput.value : "";

  if (
    isNaN(spielerAlter) ||
    spielerAlter < 1 || spielerAlter > 100 ||
    !spielerGeschlecht ||
    (!anonym && spielerName === "")
  ) {
    alert("Bitte fülle alle Felder korrekt aus");
    return;
  }

  fetch("https://682f2058746f8ca4a47ff4a5.mockapi.io/game/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: spielerName,
      alter: spielerAlter,
      geschlecht: spielerGeschlecht,
      anonym: anonym,
      ip: spielerIP
    })
  })
    .then(res => res.json())
    .then(data => {
      userId = data.id;
      document.getElementById("startbildschirm").style.display = "none";
      document.getElementById("mainContent").style.display = "block";
      soundSignup.play();
      startErfolgt = true;
    });
});

// Beim Klicken des Spielstart-Buttons:
document.getElementById("gameBtn").addEventListener("click", () => {
  if (!anzahl) {
    frageNachAnnahme();
    return;
  }

  // Hier Spielstart-Funktionen starten...
});

// Einschätzung abfragen (UI statt prompt)
function frageNachAnnahme(callback) {
  const overlay = document.getElementById("einschaetzungsOverlay");
  const inputAs = document.getElementById("einschaetzungInput");
  const fehler = document.getElementById("einschaetzungFehler");
  const button = document.getElementById("einschaetzungBtn");

  buttonSound.currentTime = 0;
  buttonSound.play();
  overlay.style.display = "flex";
  inputAs.value = "";
  fehler.textContent = "";
   setTimeout(() => inputAs.focus(), 50);

  button.onclick = () => {
    const eingabe = Number(inputAs.value.trim());
    if (isNaN(eingabe) || eingabe < 1 || eingabe > 100) {
      fehler.textContent = "Bitte gib eine gültige Zahl zwischen 1 und 100 ein.";
      return;
    }

    anzahl = eingabe;
    overlay.style.display = "none";
    callback(); 
  };

  inputAs.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      button.click();
    }
  });
}


/*async function ladeAlleScores() {
  const res = await fetch("https://682f2058746f8ca4a47ff4a5.mockapi.io/game/scores");
  const daten = await res.json();
  return daten.filter(d => d.besteReaktion); // nur Einträge mit gültiger Reaktion
}*/

// Spielstand speichern
function datenSpeichern() {
  if (reaktionszeiten.length === 0 || !userId) return;
  /*const bereinigteDaten = reaktionszeiten.slice(1).filter(wert => wert <= 10);*/
  const durchschnitt = reaktionszeiten.reduce((a, b) => a + b, 0) / reaktionszeiten.length;

const besteReaktion = Math.min(...reaktionszeiten.slice(1))
fetch(`https://682f2058746f8ca4a47ff4a5.mockapi.io/game/users/${userId}/scores`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    punkte: korrektAnzahl,
    reaktion: Number(reaktionszeitProFarbe.toFixed(2)),
    reaktionEnd: Number(reaktionszeitProFarbeSec.toFixed(2)),
    reaktionszeiten: Number(durchschnitt.toFixed(3)),
    Einschaetzung: Number(anzahl),
    diagrammDaten: /*bereinigteDaten*/reaktionszeiten.slice(1),
    besteReaktion: Number(besteReaktion.toFixed(2))
  })
})
.then(res => res.json())
.then(data => console.log("Score gespeichert:", data))
.catch(err => console.error("Fehler beim Speichern des Scores:", err));
}

const anzeigeWrapper = document.querySelector(".anzeige-wrapper")
const karte = document.querySelector(".colorchanger");
const button = document.getElementById("gameBtn");
const buttonSec = document.getElementById("gameBtnSec");
const input = document.getElementById("input");
const feedbackright = document.getElementById("feedbackRight");
const feedbackfalse = document.getElementById("feedbackFalse");
const stunden = document.getElementById("stunden");
const minTens = document.getElementById("minTens");
const min = document.getElementById("min");
const sekTens = document.getElementById("sekTens");
const sek = document.getElementById("sek");
const msHundreds = document.getElementById("msHundreds");
const msTens = document.getElementById("msTens");
const cards = document.querySelectorAll(".card");
const timer = document.getElementById("timer");
const points = document.querySelector(".points");
const punkteZeiger = document.querySelector(".punktezeiger");
const introWrapper = document.querySelector(".intro-wrapper");
const introTitle = document.querySelector(".intro-title");
const introHighlights = document.querySelectorAll(".intro-highlight");
const introTexts = document.querySelectorAll(".intro-text");
const introSubtle = document.querySelector(".intro-subtle");
const introList = document.querySelector(".intro-list");
const introInfo = document.querySelector(".intro-info");
const introCall = document.querySelector(".intro-call");
const containerButton = document.querySelector(".containerNachClick");
const eingabeInfos = document.querySelectorAll(".EingabeInfosContainer");
const overlay = document.getElementById("letsTestOverlay");
const timeOver = document.getElementById("timeOver");
const timeOverContainer=document.getElementById("timeOverContainer");


let zustand = 0;
let korrektAnzahl = 0;
let timerGestartet = false;

function handleGameInput() {
  if (!spielGestartet || !ersterClickGetan) return;

  const antwort = input.value.toLowerCase().replace(/\s/g, "");
  const korrekt =
    (zustand === 1 && antwort === "blau") ||
    (zustand === 2 && antwort === "rot") ||
    (zustand === 3 && antwort === "grün") ||
    (zustand === 4 && antwort === "gelb") ||
    (zustand === 5 && antwort === "pink") ||
    (zustand === 6 && antwort === "orange") ||
    (zustand === 7 && (antwort === "violett" || antwort === "lila")) ||
    (zustand === 8 && antwort === "braun") ||
    (zustand === 9 && antwort === "grau") ||
    (zustand === 10 && (antwort === "weiß" || antwort === "weiss"));


  if (korrekt) {
    playFixedSound(soundCorrect);
    korrektAnzahl++;
    punkteZeiger.textContent = korrektAnzahl;
    feedbackright.classList.add("sichtbar");
    setTimeout(() => feedbackright.classList.remove("sichtbar"), 1500);

    // === ERSTE RUNDE MESSUNG ===
    if (zustand === 10 && anzahlKurz === 0) {
      anzahlKurz = Date.now() - startTime;
      reaktionszeitProFarbe = anzahlKurz / 10 / 1000;
    }

    // === LETZTE RUNDE START MERKEN ===
    if (zustand === 1) {
      letzterStart = Date.now();
      letzteRundeGestartet = true;
    }

    // === LETZTE RUNDE ENDE MESSEN ===
    if (zustand === 10 && letzteRundeGestartet) {
      letzterEnde = Date.now();
      let differenz = letzterEnde - letzterStart;
      reaktionszeitProFarbeSec = differenz / 10 / 1000;
      letzteRundeGestartet = false;
    }

    zustand = (zustand % 10) + 1;
    const farben = ["blue", "red", "green", "yellow", "#FF10F0", "#FF8000", "#8B00FF", "#8B4513", "grey", "white"];
    karte.style.backgroundColor = farben[zustand - 1];
    input.value = "";
    let jetzt = Date.now();
let differenz = (jetzt - letzteMessung) / 1000; // in Sekunden
reaktionszeiten.push(differenz);  // Speichern
letzteMessung = jetzt;
  } else {
    playFixedSound(soundWrong);
    feedbackfalse.classList.add("sichtbar");
    setTimeout(() => feedbackfalse.classList.remove("sichtbar"), 1500);
    input.value = "";
    const jetzt = Date.now();
    console.log("falsch");
if (letzteReaktionszeit !== 0) {
  let differenz = (jetzt - letzteReaktionszeit) / 1000; // Sekunden
  reaktionszeiten.push(differenz);
}
letzteReaktionszeit = jetzt;
  }
}

let spielStartBereit = false;
function starteCountdown(callback) {
document.querySelectorAll("body > *").forEach(el => {
  if (
    el.id !== "gameStart" &&
    el.id !== "timer" &&
    el.id !== "wuerfelAnimation" &&
    el.id !== "letsTestOverlay"
  ) {
    el.style.display = "none";
  }
});

  document.getElementById("timer").classList.add("sichtbar");
  document.getElementById("wuerfelAnimation").style.display = "flex";

  const countdownContainer = document.createElement("div");
  countdownContainer.id = "gameStart";
  document.body.appendChild(countdownContainer);

  if (counted===false) {
      playFixedSound(countdownSound);
      counted=true;
  }

  zeigeLetsTest();
  let count = 3;
  countdownContainer.textContent = count;

  const interval = setInterval(() => {
    count--;
    if (count >= 0) {
      countdownContainer.textContent = count;
    } else {
      clearInterval(interval);
      countdownContainer.remove();

      document.querySelectorAll("body > *").forEach(el => {
        el.style.display = "";
      });

      callback(); 
    }
  }, 1000);
}


document.getElementById("gameBtn").addEventListener("click", () => {
  if (!anzahl && !spielStartBereit) {
    frageNachAnnahme(() => {
      spielStartBereit = true;
    });
    return;
  }

  if (countedNum) return;
  countedNum=true;
starteCountdown(() => {
    [introWrapper, introTitle, introSubtle, introList, introInfo, introCall].forEach(el => el.classList.add("unsichtbar"));
    introHighlights.forEach(el => el.classList.add("unsichtbar"));
    introTexts.forEach(el => el.classList.add("unsichtbar"));
    eingabeInfos.forEach(el => el.classList.remove("sichtbar"));
    overlay.style.display="none";
    document.getElementById("wuerfelAnimation").style.display = "none";


    feedbackfalse.classList.remove("sichtbar");
    timer.classList.add("sichtbar");
    containerButton.classList.add("sichtbar");
    buttonSec.classList.add("sichtbar");
    button.style.display = "none";
    cards.forEach(card => card.classList.add("sichtbar"));
    punkteZeiger.classList.add("sichtbar");
    punkteZeiger.textContent = korrektAnzahl;

    ersterClickGetan = true;
    spielGestartet = true;
    zustand = 1;
    

    if (!timerGestartet) {
      timerGestartet = true;
      starteTimer();
    }

    input.style.display = "block";
    input.focus();
    anzeigeWrapper.classList.add("sichtbar");
    anzeigeWrapper.style.display = "flex";
    karte.classList.add("sichtbar");
  });


  setTimeout(() => {
    punkteZeiger.classList.remove("sichtbar");
    input.style.display = "none";
    karte.classList.remove("sichtbar");
    timer.classList.remove("sichtbar");
    
    function zeigeTimerOver() {
      timeOverContainer.style.display = "flex";
      timeOver.style.display = "block";
      setTimeout(() => {
        timeOver.style.display = "none";
        timeOverContainer.style.display = "none";
      }, 900);
    }

    zeigeTimerOver();

    buttonSec.classList.remove("sichtbar");
    anzeigeWrapper.classList.remove("sichtbar");
    document.getElementById("wuerfelAnimation").style.display = "flex";
    document.getElementById("wuerfelAnimation").style.position = "relative";
    document.getElementById("wuerfelAnimation").style.top = "50vh";
    document.getElementById("platzmacher").classList.add("sichtbar");
document.getElementById("box-einschaetzung").textContent =
  "Selbsteinschätzung: " + anzahl;

document.getElementById("box-punkte").textContent =
  "Punkte: " + korrektAnzahl;

document.getElementById("box-reaktion-unbekannt").textContent =
  "Reaktionszeit (unbekannter Reiz): " + reaktionszeitProFarbe.toFixed(2) + "s";

document.getElementById("box-reaktion-bekannt").textContent =
  "Reaktionszeit (bekannter Reiz): " + reaktionszeitProFarbeSec.toFixed(2) + "s";

const besteReaktion = Math.min(...reaktionszeiten.slice(1));
document.getElementById("box-reaktion-beste").textContent =
  "Beste Reaktionszeit: " + besteReaktion.toFixed(2) + "s";

document.querySelector(".auswertung-box").classList.add("sichtbar");
const items = document.querySelectorAll(".auswertung-item");

items.forEach((item, i) => {
  setTimeout(() => {
    item.classList.add("sichtbar", "animate");

    const isLast = i === items.length - 1;


    const volume = isLast
      ? bingMaxVolume + 0.1  
      : bingBaseVolume + ((bingMaxVolume - bingBaseVolume) / items.length) * i;

    const sound = isLast
      ? bingLastSound.cloneNode()
      : bingSound.cloneNode();

    sound.volume = Math.min(volume, 1.0);
    sound.play();


    // Reaktions-Chart erst anzeigen, wenn er "dran ist"
    if (item.id === "reaktionsChart") {
      item.style.display = "block"; // Jetzt erst sichtbar

      const ctx = item.getContext("2d");
      let index = 0;
      const dataset = {
        label: "Reaktionszeit (Sekunden)",
        data: [],
        fill: false,
        borderColor: "#00ffcc",
        tension: 0.3
      };

      const chartData = {
        labels: reaktionszeiten.slice(1).map((_, i) => "Farbe " + (i + 1)),
        datasets: [dataset]
      };

      const maxY = Math.max(...reaktionszeiten.slice(1)) * 1.1;

      const chartOptions = {
        responsive: true,
        animations: {
          tension: {
            duration: 600,
            easing: 'easeOutQuad',
            from: 0.3,
            to: 0.4,
            loop: false
          }
        },
        plugins: {
          legend: { labels: { color: 'white' ,
            font:{
              size:14
            }
          } }
        },
        scales: {
          y: {
            reverse: true,
            min: 0,
            max: maxY,
            ticks: { color: 'white',
            font:{
              size:14
              }
             },
            grid: { color: 'white' }
          },
          x: {
            beginAtZero: true,
            ticks: { color: 'white',
                          font:{
              size:14
              } 
             },
            grid: { color: 'white' }
          }
        }
      };

      const chart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions
      });

      let geschwindigkeit = 50;
      if (reaktionszeiten.length <= 10) geschwindigkeit = 250;
      else if (reaktionszeiten.length <= 20) geschwindigkeit = 200;
      else if (reaktionszeiten.length <= 30) geschwindigkeit = 100;

      const interval = setInterval(() => {
        if (index < reaktionszeiten.length - 1) {
          dataset.data.push(reaktionszeiten[index + 1]);
          chart.update({
            duration: 500,
            easing: 'easeOutQuad'
          });
          index++;
        } else {
          clearInterval(interval);
        }
      }, geschwindigkeit);
    }
  }, i * 900);
});

setTimeout(() => {
  datenSpeichern();
  /*ladeAlleScores().then(scores => {
  // nach Reaktionszeit sortieren (aufsteigend)
  const sortiert = scores.sort((a, b) => a.besteReaktion - b.besteReaktion);

  // Top 3 extrahieren
  const top3 = sortiert.slice(0, 3);

  // Aktueller Spieler
  const aktuellerEintrag = {
    name: spielerName,
    besteReaktion: Number(besteReaktion.toFixed(2)),
    punkte: korrektAnzahl
  };

  // Rang des aktuellen Spielers ermitteln
  const rang = sortiert.findIndex(s => s.userId === userId && s.besteReaktion === aktuellerEintrag.besteReaktion) + 1;

  // Wenn nicht in Top 3, hinzufügen
  if (rang > 3) {
    top3.push({ ...aktuellerEintrag, rang });
  }

  zeigeRangliste(top3);
});
function zeigeRangliste(topSpieler) {
  const ul = document.getElementById("ranglisteContainer");
  ul.innerHTML = ""; // vor Befüllung leeren

  topSpieler.forEach((spieler, index) => {
    const li = document.createElement("li");
    li.classList.add("ranglisten-eintrag");

    // Besondere Farben für Platz 1–3
    if (index === 0) {
      li.style.boxShadow = "0 0 25px gold";
    } else if (index === 1) {
      li.style.boxShadow = "0 0 25px silver";
    } else if (index === 2) {
      li.style.boxShadow = "0 0 25px #cd7f32"; // Bronze
    }

    // Spielername evtl. kürzen
    const name = spieler.name.length > 12 ? spieler.name.slice(0, 12) + "…" : spieler.name;

    li.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:22px;">#${spieler.rang || index + 1}</span>
        <span style="flex:1; text-align:center;">${name}</span>
        <span>
          <div style="font-size:12px;">Punkte</div>${spieler.punkte}<br>
          <div style="font-size:12px;">Zeit</div>${spieler.besteReaktion.toFixed(2)}s
        </span>
      </div>
    `;

    ul.appendChild(li);
  });
}*/
  document.querySelector(".auswertung").style.height = "auto";
}, items.length * 900);
  }, 64000);
});


// Spiel-Eingabe-Button
buttonSec.addEventListener("click", handleGameInput);

// Enter während des Spiels → Eingabe auslösen
document.addEventListener("keydown", function(event) {
  if (
    event.key === "Enter" &&
    spielGestartet &&
    ersterClickGetan &&
    document.getElementById("startbildschirm").style.display === "none"
  ) {
    handleGameInput();
    input.value = "";
  }
});

document.addEventListener("keydown", function(event) {
  if (
    event.key === "Enter" &&
    spielGestartet &&
    ersterClickGetan &&
    document.getElementById("input") === document.activeElement
  ) {
    handleGameInput();
    document.getElementById("input").value = "";
  }
});

// Enter im Menü → Spiel starten
document.addEventListener("keydown", function(event) {
  const startBildschirmSichtbar = document.getElementById("startbildschirm").style.display !== "none";

  if (!spielGestartet && event.key === "Enter" && !startBildschirmSichtbar) {
    button.click();
  }
});

// Enter im Startbildschirm → Sign in auslösen
document.addEventListener("keydown", function(event) {
  const startBildschirm = document.getElementById("startbildschirm");
  if (
    event.key === "Enter" &&
    startBildschirm.style.display !== "none" &&
    !spielGestartet
  ) {
    document.getElementById("startWeiterBtn").click();
  }
});

function starteTimer() {
  startTime = Date.now();
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const milliseconds = elapsed % 1000;


    sekTens.textContent = Math.floor(seconds / 10);
    sek.textContent = seconds % 10;
    msHundreds.textContent = Math.floor(milliseconds / 100);
    msTens.textContent = Math.floor((milliseconds % 100) / 10);

    if (minutes === 1) {
      clearInterval(interval);
      timer.classList.remove("sichtbar");
    }
  }, 10);
}
