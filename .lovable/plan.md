

# Temaförbättringar + 20 nya features

## Del 1: Förbättrade teman - Klassiska och ögonvänliga

### Problem med nuvarande teman
De nuvarande temana har några problem som kan orsaka ögontrötthet:
- **Ljust tema**: Bakgrunden är för vit/ljus, primärfärgerna är för mättade
- **Mörkt tema**: Kontrasten är för hög, bakgrunden är för mörk
- **Ocean tema**: Teal-färgerna är för intensiva
- **Sunset tema**: Orange/korall är för starkt för längre läsning
- **Forest tema**: Gröna toner kan vara tröttande

### Lösning: Klassiska, dämpade färgpaletter

| Tema | Förbättringar |
|------|---------------|
| **Light** | Varmare off-white bakgrund (240 20% 98%), mjukare grå för text, pastellprimärfärger |
| **Dark** | Mjukare mörkgrå (inte svart), lägre kontrasttext (85% istället för 95%), dämpade accenter |
| **Ocean** | Mjukare havsblå toner, varmare grönblå, lägre mättnad på primärfärger |
| **Sunset** | Varmare bärnsten istället för neon-orange, mjuka terrakotta-toner |
| **Forest** | Varmare skoggrönt, jordiga toner, mjuka mossfärger |

### Tekniska ändringar i `src/index.css`

**Light tema (förbättrat):**
```css
--background: 40 20% 98%;        /* Varm off-white */
--foreground: 220 15% 20%;       /* Mjuk mörkgrå */
--primary: 250 45% 55%;          /* Dämpat violett */
--muted-foreground: 220 10% 50%; /* Lättläst grå */
```

**Dark tema (förbättrat):**
```css
--background: 220 20% 12%;       /* Mjuk mörkblå-grå */
--foreground: 220 15% 85%;       /* Inte helt vit */
--primary: 250 55% 65%;          /* Mjukt violett */
```

**Ocean tema (förbättrat):**
```css
--background: 200 25% 14%;       /* Djup men varm havsblå */
--primary: 185 50% 50%;          /* Mjukare teal */
--accent: 195 60% 55%;           /* Dämpat cyan */
```

**Sunset tema (förbättrat):**
```css
--background: 25 20% 12%;        /* Varm brun-grå */
--primary: 30 65% 50%;           /* Mjuk bärnsten */
--accent: 15 55% 55%;            /* Varm terrakotta */
```

**Forest tema (förbättrat):**
```css
--background: 120 15% 12%;       /* Varm skogsgrå */
--primary: 140 40% 45%;          /* Mjuk mossa */
--accent: 90 35% 50%;            /* Varm limegrön */
```

### Uppdateringar i `useTheme.tsx`
- Uppdatera förhandsvisningsfärger för varje tema
- Förbättra beskrivningar

---

## Del 2: 20 nya små features

Baserat på appens nuvarande funktionalitet, här är 20 små features som förbättrar användarupplevelsen:

### Kategori: Chat-förbättringar (1-5)
| # | Feature | Beskrivning |
| 4 | **Redigera användarmeddelanden** | Möjlighet att redigera skickade meddelanden |
| 5 | **Meddelandesökning** | Sök efter text inom aktuell konversation |

### Kategori: Inputförbättringar (6-10)
| # | Feature | Beskrivning |
|---|---------|-------------|
| 6 | **Promptmallar** | Snabbval för vanliga prompttyper ("Förklara...", "Skriv kod för...") |
| 7 | **Senaste meddelanden** | Pil upp för att hämta tidigare skickade meddelanden |
| 9 | **Röstinmatning (visuell)** | Animerad mikrofon-ikon med nivåmätare |
| 10 | **Markdown-förhandsvisning** | Visa hur markdown renderas innan man skickar |

### Kategori: Editor-förbättringar (16-18)
| # | Feature | Beskrivning |
|---|---------|-------------|
| 18 | **Automatisk sparning** | Spara dokument automatiskt var 30:e sekund |

### Kategori: UI/UX-polish (19-20)
| # | Feature | Beskrivning |
|---|---------|-------------|
| 19 | **Laddningsskelett** | Visa skelett-UI istället för spinner vid laddning |
---

## Implementationsplan

### Fil-ändringar för temaförbättringar:
1. **`src/index.css`** - Uppdatera alla 5 teman med nya CSS-variabler
2. **`src/hooks/useTheme.tsx`** - Uppdatera förhandsvisningsfärger

### Nya filer för features:
Ingen implementation nu - detta är en översikt för framtida utveckling.

---

## Sammanfattning

**Temaförbättringar:**
- Alla 5 teman får mjukare, mer ögonvänliga färger
- Lägre kontrast för bekvämare läsning
- Varmare toner istället för kalla/intensiva



