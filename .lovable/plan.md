
# Multiple Themes + Word-like Editor with AI Assistant

## Overview
This plan implements two major features:
1. **5 Unique Themes** - Add 3 new distinctive themes beyond light/dark, accessible via a Settings panel
2. **Word-like Editor Section** - A rich text editor that appears for messages, with an AI context menu for text assistance

---

## Feature 1: Multiple Themes System

### Theme Definitions

| Theme | Description | Color Palette | Animation Style |
|-------|-------------|---------------|-----------------|
| **Light** (existing) | Clean, bright default | Purple/pink gradients on white | Gentle floating orbs |
| **Dark** (existing) | Sleek night mode | Purple/violet on dark gray | Subtle glowing orbs |
| **Ocean** (new) | Deep sea vibes | Teal, cyan, deep blue | Wave-like flowing animations |
| **Sunset** (new) | Warm golden hour | Orange, coral, warm pink | Slow pulsing sun-like orbs |
| **Forest** (new) | Natural, calming | Green, emerald, earth tones | Leaf-like gentle drifting |

### Implementation Details

**1. Update Theme Hook** (`src/hooks/useTheme.tsx`)
- Expand Theme type: `'light' | 'dark' | 'ocean' | 'sunset' | 'forest'`
- Update `setTheme` to handle all 5 themes
- Keep `toggleTheme` for quick light/dark switch
- Add theme metadata (name, icon, preview colors)

**2. Add CSS Theme Variables** (`src/index.css`)
- Add `.ocean`, `.sunset`, `.forest` classes with complete variable sets
- Each theme gets unique:
  - Primary/secondary/accent colors
  - Gradient definitions
  - Glass effect colors
  - Animation keyframes

**3. Create Settings Sheet Component** (`src/components/settings/SettingsSheet.tsx`)
- Slide-out panel using existing Sheet component
- Theme selector section with visual preview cards
- Click to apply theme with smooth transition
- Current theme highlighted

**4. Update Animated Background** (`src/components/chat/AnimatedBackground.tsx`)
- Accept theme prop to adjust orb colors dynamically
- Different animation patterns per theme
- Smooth color transitions when switching

**5. Add Settings Button to Sidebar**
- Replace or enhance the existing Settings dropdown item
- Opens the Settings Sheet

---

## Feature 2: Word-like Editor Section

### Overview
When a message is created or clicked, open a full Word-like editing experience with formatting tools and AI assistance.

### Editor Toolbar (inspired by uploaded image)
```text
+------------------------------------------------------------------+
| Urklipp | Tecken                          | Stycke               |
|---------|----------------------------------|----------------------|
| Klistra | Font  | Size | B I U S | A  A  | Align | Lists | etc  |
+------------------------------------------------------------------+
```

**Toolbar Groups:**
1. **Clipboard**: Cut, Copy, Paste, Format painter
2. **Font**: Bold, Italic, Underline, Strikethrough, Subscript, Superscript, Text color, Highlight
3. **Paragraph**: Alignment (left/center/right/justify), Lists (bullet/numbered), Indent

### AI Assistant Context Menu
When text is selected, show a floating menu (inspired by uploaded image 2):

```text
+----------------------+
| Quick Fix            |
|   Fix                |
|   Explain            |
|----------------------|
| Rewrite              |
|   Modify             |
|   Review             |
|----------------------|
| More Actions...      |
|   > Summarize        |
|   > Translate        |
|   > Make Shorter     |
|   > Make Longer      |
|   > Change Tone      |
+----------------------+
```

### New Components

**1. Document Editor Page** (`src/components/editor/DocumentEditor.tsx`)
- Full-screen or modal editor view
- Rich text editing area with contentEditable or textarea
- Formatting toolbar at top
- Document title editable

**2. Editor Toolbar** (`src/components/editor/EditorToolbar.tsx`)
- Grouped formatting buttons matching Word style
- Tooltip on hover for each button
- Active state for current formatting
- Uses existing Button, ToggleGroup components

**3. AI Context Menu** (`src/components/editor/AIContextMenu.tsx`)
- Appears on text selection
- Floating popover near selection
- Actions trigger simulated AI responses
- "More Actions" submenu with 5 planning-relevant options:
  1. **Summarize** - Condense selected text
  2. **Translate** - Translate to another language
  3. **Make Shorter** - Reduce verbosity
  4. **Make Longer** - Expand with details
  5. **Change Tone** - Professional/Casual/Friendly

**4. AI Action Result** (`src/components/editor/AIActionResult.tsx`)
- Shows AI response in a card below selection
- Accept/Reject buttons
- Diff view showing changes

### Integration Points

**In ChatMessage Component:**
- Add "Edit in Document" button on hover
- Opens DocumentEditor with message content

**In ChatArea/BuildMode:**
- Add "New Document" button in header
- Opens blank DocumentEditor

**State Management:**
- Create `useDocumentEditor` hook for editor state
- Track open documents
- Sync with messages/conversations

---

## Technical Implementation

### Files to Create
```text
src/components/settings/
  SettingsSheet.tsx        - Main settings panel
  ThemeSelector.tsx        - Visual theme picker

src/components/editor/
  DocumentEditor.tsx       - Full editor view
  EditorToolbar.tsx        - Formatting toolbar
  ToolbarButton.tsx        - Individual toolbar button
  AIContextMenu.tsx        - Selection AI menu
  AIActionResult.tsx       - AI response display

src/hooks/
  useDocumentEditor.tsx    - Editor state management
```

### Files to Modify
```text
src/hooks/useTheme.tsx     - Expand to 5 themes
src/index.css              - Add 3 new theme CSS
src/components/chat/ChatSidebar.tsx   - Add settings trigger
src/components/chat/ChatMessage.tsx   - Add "Edit" button
src/components/chat/AnimatedBackground.tsx - Theme-aware animations
```

### New Dependencies
No new dependencies needed - uses existing:
- Radix UI for popover/dropdown
- Lucide for icons
- Framer Motion for animations

---

## User Experience Flow

### Theme Switching
1. User clicks Settings in sidebar footer
2. Settings sheet slides in from right
3. "Themes" section shows 5 visual cards
4. User clicks theme card
5. Theme applies instantly with smooth transition
6. Background orbs change color/animation

### Document Editing
1. User hovers on a message -> sees "Edit" button
2. Click opens DocumentEditor with message content
3. User can format text using toolbar
4. Select text -> AI menu appears
5. Choose AI action (e.g., "Fix")
6. AI suggestion appears below selection
7. Accept or reject changes
8. Save returns to chat with updated message

---

## CSS Theme Previews

### Ocean Theme
- Primary: `185 75% 45%` (Teal)
- Accent: `200 90% 55%` (Cyan)
- Background: Deep navy gradients
- Orbs: Aqua/blue wave animations

### Sunset Theme
- Primary: `25 95% 55%` (Orange)
- Accent: `340 85% 60%` (Coral pink)
- Background: Warm amber/rose gradients
- Orbs: Golden pulsing like setting sun

### Forest Theme
- Primary: `142 70% 40%` (Forest green)
- Accent: `95 60% 45%` (Lime)
- Background: Earth tone gradients
- Orbs: Green leaf-like floating

---

## Animation Differences by Theme

| Theme | Orb Speed | Orb Movement | Glow Color |
|-------|-----------|--------------|------------|
| Light | Medium | Smooth float | Purple |
| Dark | Slow | Gentle pulse | Violet |
| Ocean | Fast | Wave-like | Cyan |
| Sunset | Slow | Expanding pulse | Orange |
| Forest | Medium | Drift/fall | Green |
