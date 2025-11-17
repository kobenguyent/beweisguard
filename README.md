# BeweisGuard

Ein interaktives Web-Tool zum Üben von Tests für die Polizei Asservatestelle.

## Features

- 📝 **Multiple-Choice-Tests** mit realistischen Fragen zur Asservatenverwaltung
- 🔄 **Mehrere Testtypen** (Test A, Test B, Test C, Test D, Test E) zum Üben
- 📊 **Automatische Auswertung** mit detaillierter Ergebnisübersicht
- ✅ **Sofortiges Feedback** zu richtigen und falschen Antworten
- 💡 **Hilfreiche Tipps** für Mathematikfragen (auf Wunsch anzeigbar)
- 🔢 **Integrierter Taschenrechner** für mathematische Berechnungen
- 📱 **Responsive Design** für Desktop und Mobile
- 🎨 **Moderne Benutzeroberfläche** mit intuitiver Navigation
- 💾 **Automatische Speicherung** des Testfortschritts
- 📈 **Testberichte** mit Verlauf aller durchgeführten Tests

## Screenshots

### Startseite
![Startseite](https://github.com/user-attachments/assets/c5c9e600-4db5-4d76-9dfc-d5fef1cdcda5)

### Frage mit verstecktem Tipp
![Frage mit verstecktem Tipp](https://github.com/user-attachments/assets/2852fc94-777e-4b34-9d8d-64aca859eee0)

### Frage mit angezeigtem Tipp
![Frage mit angezeigtem Tipp](https://github.com/user-attachments/assets/ce5bc4e7-1732-4d3f-a93b-2e0198ba444b)

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
- 43 Fragen zu verschiedenen Kategorien (Grundlagen, Aufbewahrung, Dokumentation, Sicherheit, Mathematik, etc.)
- Multiple-Choice-Fragen mit 4 Antwortmöglichkeiten
- Freitext-Fragen für komplexere Szenarien
- Hilfreiche Tipps für mathematische Fragen (optional einblendbar)
- Bestanden bei mindestens 60% richtigen Antworten

### Kategorien

- **Grundlagen**: Basiswissen zur Asservatenverwaltung
- **Aufbewahrung**: Lagerbedingungen und Aufbewahrungsfristen
- **Dokumentation**: Erfassung und Protokollierung
- **Sicherheit**: Sicherheitsmaßnahmen und Zugangskontrolle
- **Mathematik**: Berechnungen und Statistiken
- **Verfahren**: Prozesse und Abläufe
- **Qualitätskontrolle**: Überprüfung und Qualitätssicherung
- Und weitere...

## Automatische Fortschrittsspeicherung

Die Anwendung speichert automatisch den Testfortschritt im Browser (localStorage):

- ✅ **Automatische Speicherung**: Jede Antwort wird sofort gespeichert
- 🔄 **Wiederherstellung nach Aktualisierung**: Bei versehentlichem Neuladen der Seite wird der Test an der gleichen Stelle fortgesetzt
- 📍 **Aktuelle Frage**: Die Position im Test wird gespeichert
- 📝 **Alle Antworten**: Sowohl Multiple-Choice- als auch Freitextantworten bleiben erhalten
- 🆕 **Sauberer Start**: Beim Auswählen eines neuen Tests wird die vorherige Sitzung automatisch gelöscht

**Hinweis**: Die Daten werden nur lokal im Browser gespeichert und nicht an einen Server übertragen.

## Tests ausführen

```bash
# Unit Tests ausführen
npm test

# Tests mit Coverage
npm run test:coverage

# End-to-End Tests
npm run test:e2e
```

## Technologien

- ⚛️ React 18
- ⚡ Vite 5
- 🎨 CSS3 mit Gradient Design
- 🧪 Vitest für Unit Tests
- 🎭 Playwright für E2E Tests
- 📦 GitHub Actions für CI/CD

## Lizenz

MIT