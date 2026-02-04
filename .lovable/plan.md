

# Build Mode - App Generator Interface

## Overview
Add a "Build" mode toggle that transforms the chat interface into an app generation platform similar to Lovable, Replit, Bolt, and Base44. This includes a split-panel layout with a preview iframe and makes authentication optional.

---

## Changes Summary

### 1. Make Authentication Optional
Currently, users are forced to login. We'll change this to allow guest usage:
- Modify `Index.tsx` to redirect to `/chat` directly (not `/auth`)
- Update `Chat.tsx` to work without authentication
- Create a guest mode in `useConversations` that stores data locally
- Add "Sign in" button in sidebar for guests who want to save their chats

### 2. Add Build Mode Toggle
Add a toggle switch in the header to enable "Build" mode:
- Place it next to the model selector in `ChatArea.tsx`
- Use the existing Switch component with a "Build" label
- Add a distinctive icon (Hammer/Wrench)
- Toggle animates smoothly

### 3. Build Mode Layout (New Component: `BuildMode.tsx`)
When Build mode is active, the interface transforms:

```text
+------------------+----------------------------------+
|    Sidebar       |     Preview Panel (iframe)       |
| (conversations)  |    +------------------------+    |
|                  |    |  Generated App View    |    |
|                  |    |                        |    |
|                  |    |   [Mobile/Tablet/      |    |
|                  |    |    Desktop toggle]     |    |
|                  |    +------------------------+    |
|                  +----------------------------------+
|                  |          Chat Panel              |
|                  |  +----------------------------+  |
|                  |  |  Messages scroll area      |  |
|                  |  +----------------------------+  |
|                  |  |  Input: "Build me an app  |  |
|                  |  |  that does X..."          |  |
|                  +----------------------------------+
+------------------+----------------------------------+
```

Features:
- Uses `ResizablePanelGroup` for adjustable panels
- Preview panel on top (60% default height)
- Chat panel on bottom (40% default height)
- Horizontal resize between sidebar and main area
- Vertical resize between preview and chat

### 4. Preview Panel Component (`BuildPreview.tsx`)
The preview area includes:
- **Device selector** - Mobile/Tablet/Desktop view buttons
- **URL bar** (visual) - Shows simulated app URL
- **Refresh button** - Simulates reloading
- **Open in new tab** button
- **Iframe container** - Shows a demo/placeholder app
- Device frame styling (phone/tablet borders)

### 5. Build Chat Modifications
When in Build mode, the chat adapts:
- Different placeholder text: "Beskriv appen du vill bygga..."
- Build-specific suggestions in empty state:
  - "Bygg en todo-app med kategorier"
  - "Skapa en väder-app med kartor"
  - "Gör en receptsamling med sökfunktion"
- AI responses simulate "building" with progress indicators
- Show simulated file tree/code changes

### 6. File Tree Panel (Optional Side Panel)
Add a collapsible file tree showing "generated" files:
- `src/App.tsx`
- `src/components/...`
- `package.json`
- Files highlight when "modified"

### 7. Build Progress Component (`BuildProgress.tsx`)
Shows simulated build progress:
- "Skapar projektstruktur..."
- "Installerar beroenden..."
- "Genererar komponenter..."
- Progress bar animation
- Success/error states

---

## Technical Details

### New Files to Create
1. `src/components/build/BuildMode.tsx` - Main build mode layout
2. `src/components/build/BuildPreview.tsx` - Preview iframe component
3. `src/components/build/DeviceSelector.tsx` - Mobile/tablet/desktop toggle
4. `src/components/build/FileTree.tsx` - Simulated file explorer
5. `src/components/build/BuildProgress.tsx` - Progress indicator
6. `src/components/build/BuildEmptyState.tsx` - Build-specific suggestions
7. `src/hooks/useBuildMode.tsx` - State management for build mode
8. `src/hooks/useGuestMode.tsx` - Local storage for guest users

### Files to Modify
1. `src/pages/Index.tsx` - Remove forced auth redirect
2. `src/pages/Chat.tsx` - Add build mode toggle and conditional rendering
3. `src/components/chat/ChatArea.tsx` - Add build mode prop and toggle
4. `src/components/chat/ChatSidebar.tsx` - Handle guest mode
5. `src/components/chat/ChatInput.tsx` - Build mode placeholder
6. `src/components/chat/EmptyState.tsx` - Add build suggestions
7. `src/hooks/useConversations.tsx` - Add guest mode support
8. `src/hooks/useAuth.tsx` - Add guest user support

### Database Considerations
- No database changes needed
- Guest mode uses localStorage
- When guest signs up, migrate local data to database

---

## User Experience Flow

### Guest User Flow
1. User arrives at `/` -> redirected to `/chat` (not `/auth`)
2. Can use chat normally with data stored locally
3. Sees "Logga in för att spara" prompt in sidebar
4. Can click to sign in/up when ready
5. After login, local data migrates to database

### Build Mode Flow
1. User clicks "Build" toggle in header
2. Interface smoothly transitions to split layout
3. User types: "Bygg en app som..."
4. Simulated build progress appears
5. Preview shows placeholder/demo content
6. File tree shows "generated" files
7. User can continue chatting to refine

---

## Design Notes

### Build Mode Styling
- Preview panel has subtle glassmorphism border
- Device frames use rounded corners and shadows
- Progress indicators use gradient animations
- File tree icons match VS Code style
- Build toggle has "under construction" feel

### Animations
- Smooth transition when toggling build mode
- Panel resize animations
- Progress bar fills smoothly
- Preview device transitions
- File tree expand/collapse

### Responsive Behavior
- Mobile: Stack preview above chat (no side-by-side)
- Tablet: Narrower sidebar, full preview/chat
- Desktop: Full three-panel layout

