# BeweisGuard

Ein interaktives Web-Tool zum Üben von Tests für die Polizei Asservatestelle.

## Features

- 📝 **Multiple-Choice-Tests** mit realistischen Fragen zur Asservatenverwaltung
- 🔄 **Mehrere Testtypen** (Test A, Test B, Test C) zum Üben
- 📊 **Automatische Auswertung** mit detaillierter Ergebnisübersicht
- ✅ **Sofortiges Feedback** zu richtigen und falschen Antworten
- 📱 **Responsive Design** für Desktop und Mobile
- 🎨 **Moderne Benutzeroberfläche** mit intuitiver Navigation

## Live Demo

Die Anwendung ist live verfügbar unter: [https://kobenguyent.github.io/beweisguard/](https://kobenguyent.github.io/beweisguard/)

## Lokale Entwicklung

### Voraussetzungen

- Node.js 20 oder höher
- npm

### Installation

```bash
# Repository klonen
git clone https://github.com/kobenguyent/beweisguard.git
cd beweisguard

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung läuft dann auf `http://localhost:5173`.

### Produktions-Build

```bash
npm run build
```

Der Build wird im `dist` Verzeichnis erstellt.

### Vorschau des Production Builds

```bash
npm run preview
```

## Deployment

Die Anwendung wird automatisch auf GitHub Pages bereitgestellt, wenn Änderungen zum `main` Branch gepusht werden.

### Manuelle Deployment

```bash
npm run build
npm run deploy
```

## Teststruktur

Jeder Test enthält:
- 10 Multiple-Choice-Fragen
- 4 Antwortmöglichkeiten pro Frage
- Eine korrekte Antwort
- Bestanden bei mindestens 60% richtigen Antworten

## Technologien

- ⚛️ React 18
- ⚡ Vite 5
- 🎨 CSS3 mit Gradient Design
- 📦 GitHub Actions für CI/CD

## Lizenz

MIT