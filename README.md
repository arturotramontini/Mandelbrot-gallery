# Galleria Frattali di Mandelbrot — Arturo Tramontini

Progetto web moderno, leggero e responsive per archiviare, visualizzare e rendere scaricabili le immagini frattali generate con calcolo GPU e precisione arbitraria (`MyFloat256`).

---

## 📁 Struttura delle Cartelle

```text
SITO1/
├── index.html                   # Pagina principale del sito
├── css/
│   └── style.css                # Foglio di stile dark-mode, glassmorphism e responsive
├── js/
│   ├── gallery-data.js          # Database delle immagini e dei metadati
│   └── app.js                   # Motore di rendering griglia, filtri, ricerca e lightbox
├── images/
│   ├── full/                    # Immagini originali ad alta risoluzione (da scaricare)
│   └── thumbnails/              # Miniature per la visualizzazione veloce nella griglia
├── generate_samples.py          # Script Python usato per generare i primi 5 campioni
└── README.md                    # Questa guida
```

---

## 🚀 1. Come vedere il sito in locale (sul tuo Mac)

* **Opzione 1 (Immediata)**: Fai doppio clic sul file `index.html` nel Finder per aprirlo nel tuo browser (Safari, Chrome, ecc.). Funziona direttamente senza bisogno di server web!
* **Opzione 2 (Server locale opzionale)**:
  Apri il terminale in questa cartella ed esegui:
  ```bash
  python3 -m http.server 8080
  ```
  Poi apri nel browser l'indirizzo `http://localhost:8080`.

---

## ➕ 2. Come aggiungere nuove immagini Mandelbrot

1. **Salva l'immagine a piena risoluzione** nella cartella `images/full/` (es. `mio_frattale_01.png` o `.jpg`).
2. **(Consigliato) Crea una miniatura** nella cartella `images/thumbnails/` (es. 640x360 px per rendere il caricamento istantaneo). *Nota: Se non hai voglia di fare la miniatura, puoi indicare direttamente il file originale anche nel campo `thumb`.*
3. **Apri il file `js/gallery-data.js`** con un editor di testo e aggiungi un blocco all'inizio o alla fine della lista:

```javascript
{
  id: "mio_frattale_01",
  title: "Titolo del Frattale",
  category: "Deep Zoom", // Categoria o tag (es. Seahorse, Spirali, Minibrot, ecc.)
  description: "Breve descrizione visiva o spiegazione dell'area esplorata.",
  thumb: "images/thumbnails/mio_frattale_01_thumb.jpg",
  full: "images/full/mio_frattale_01.jpg",
  real: "-0.7436438870371587047521915061", // Parte reale del centro
  imag: "+0.1318259042053119704931881729", // Parte immaginaria del centro
  zoom: "1.5 × 10³²",                       // Livello di zoom
  iterations: 50000,                        // Numero iterazioni
  resolution: "3840 × 2160 (4K)",           // Risoluzione
  palette: "Plasma Neon",                   // Nome della palette usata
  engine: "GPU Compute / MyFloat256",       // Algoritmo / Shader usato
  date: "2026-10"
},
```
Salva il file `js/gallery-data.js` e ricarica la pagina nel browser: la nuova immagine comparirà immediatamente, completa di filtri e pulsante di download!

---

## 🌐 3. Come pubblicare il sito su `arturotramontini.it`

Quando sei pronto a sostituire il vecchio sito Herbalife:

1. Apri il tuo client FTP (es. **FileZilla** o **Cyberduck**) oppure accedi al **File Manager** del pannello di controllo del tuo provider hosting (Aruba, Register, SiteGround, ecc.).
2. Collegati alla cartella pubblica del tuo dominio (di solito si chiama `public_html`, `www` o `htdocs`).
3. Elimina o rinomina il vecchio file `index.html`.
4. Carica l'intero contenuto di questa cartella:
   * `index.html`
   * la cartella `css/`
   * la cartella `js/`
   * la cartella `images/`
5. Vai su `https://arturotramontini.it` per ammirare il tuo nuovo sito online!
