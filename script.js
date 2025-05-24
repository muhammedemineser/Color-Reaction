
let reaktionszeiten = [];     
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

function datenSpeichern() {
  if (reaktionszeiten.length === 0) return; // Schutz vor Division durch 0
  const durchschnitt = reaktionszeiten.reduce((a, b) => a + b, 0) / reaktionszeiten.length;

  fetch("https://682f2058746f8ca4a47ff4a5.mockapi.io/game/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reaktion: Number(reaktionszeitProFarbe.toFixed(2)),
      reaktionEnd: Number(reaktionszeitProFarbeSec.toFixed(2)),
      punkte: korrektAnzahl,
      reaktionszeiten: Number(durchschnitt.toFixed(3)),
      Einschaetzung: Number(anzahl)
    })
  })
  .then(res => res.json())
  .then(data => console.log("Gespeichert:", data))
  .catch(err => console.error("Fehler:", err));
}

function frageNachAnnahme() {
  let assume = prompt("Selbsteinschätzung:\nWieviele Farben kannst du, ohne einen Fehler zu machen, in einer Minute erkennen und schreiben? \nGebe eine Zahl ein");
  anzahl = Number(assume);
  if (isNaN(anzahl) || anzahl === 0) {
    alert("Bitte gib eine gültige Zahl größer als 0 ein.");
    frageNachAnnahme();
  } else {
    alert("Let's Test!");
  }
}

frageNachAnnahme();

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

let letzteReaktionszeit = 0;

  if (korrekt) {
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
    punkteZeiger.textContent = korrektAnzahl;
    feedbackfalse.classList.add("sichtbar");
    setTimeout(() => feedbackfalse.classList.remove("sichtbar"), 1500);
    input.value = "";
    const jetzt = Date.now();
if (letzteReaktionszeit !== 0) {
  let differenz = (jetzt - letzteReaktionszeit) / 1000; // Sekunden
  reaktionszeiten.push(differenz);
}
letzteReaktionszeit = jetzt;
  }
}

button.addEventListener("click", () => {
  [introWrapper, introTitle, introSubtle, introList, introInfo, introCall].forEach(el => el.classList.add("unsichtbar"));
  introHighlights.forEach(el => el.classList.add("unsichtbar"));
  introTexts.forEach(el => el.classList.add("unsichtbar"));
  eingabeInfos.forEach(el => el.classList.remove("sichtbar"));

  feedbackfalse.classList.remove("sichtbar");
  timer.classList.add("sichtbar");
  containerButton.classList.add("sichtbar");
  buttonSec.classList.add("sichtbar");
  cards.forEach(card => card.classList.add("sichtbar"));
  punkteZeiger.classList.add("sichtbar");
  punkteZeiger.textContent = korrektAnzahl;
  alert("Let's Play!");
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

  setTimeout(() => {
    punkteZeiger.classList.remove("sichtbar");
    input.style.display = "none";
    karte.classList.remove("sichtbar");
    timer.classList.remove("sichtbar");
    buttonSec.classList.remove("sichtbar");
    anzeigeWrapper.classList.remove("sichtbar");
    
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

// Sichtbarkeit einleiten
document.querySelector(".auswertung-box").classList.add("sichtbar");
const items = document.querySelectorAll(".auswertung-item");

items.forEach((item, i) => {
  setTimeout(() => {
    item.classList.add("sichtbar", "animate");

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
  document.querySelector(".auswertung").style.height = "auto";
  datenSpeichern();
}, items.length * 900);
  datenSpeichern();
  }, 60000);
});


buttonSec.addEventListener("click", handleGameInput);

document.addEventListener("keydown", function(event) {
  if (spielGestartet && ersterClickGetan && event.key === "Enter") {
    handleGameInput();
    input.value = "";
  }
});

document.addEventListener("keydown", function(event) {
  if (!spielGestartet && event.key === "Enter") {
    button.click();
  }
});

document.addEventListener("keydown", function(event) {
  let timePassed = Date.now() - startTime;
  if (timePassed > 60000 && event.key === "Enter") {
    location.reload();
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
      alert("Time Over!");
    }
  }, 10);
}


