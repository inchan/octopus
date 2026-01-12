# UX Research: Drag and Drop Interactions in Desktop Apps
Date: 2025-12-20
Status: Draft

## 1. Objective
Analyze best practices for "Reordering Lists" in modern desktop applications (Electron/Web) to determine the optimal interaction model for Align Agents v2, specifically evaluating the "Long Press" pattern versus standard alternatives.

## 2. Benchmark Analysis

### A. Explicit Drag Handle (The Standard)
*   **Examples**: Linear, Notion, GitHub Projects, Jira.
*   **Behavior**: A "Grip" icon (6 dots `⋮⋮` or hamburger `≡`) is visible or appears on hover.
*   **Pros**:
    *   **High Discoverability**: User immediately knows "This is draggable".
    *   **No Conflicts**: Separates "Drag" from "Text Selection" or "Click".
    *   **Accessible**: Can be mapped to keyboard focus easily.
*   **Cons**:
    *   **Visual Clutter**: Takes up horizontal space (24px+).

### B. Hover-Reveal Handle (Modern & Clean)
*   **Examples**: Linear, Notion (Lists), Asana.
*   **Behavior**: The row looks clean text initially. On mouse hover, a grip handle fades in at the left margin.
*   **Pros**:
    *   **Aesthetics**: 100% clean when not interacting.
    *   **Usability**: Standard affordance appears exactly when needed.
*   **Cons**:
    *   Mobile/Touch users need a different trigger (touch often implies hover, or needs swipe).

### C. Drag by Row (Native/Finder)
*   **Examples**: macOS Finder (Icon view), Trello cards.
*   **Behavior**: Clicking anywhere on the item starts dragging immediately.
*   **Pros**: Fastest interaction.
*   **Cons**: Prevents text selection inside the card. Conflicts with child buttons (Delete/Edit) requiring extensive `e.stopPropagation()`.

### D. Long Press (Mobile Pattern)
*   **Examples**: iOS Home Screen, Android Lists.
*   **Behavior**: Click and hold for >200ms to "lift" the item, then drag.
*   **Pros**:
    *   **Zero Visual Noise**: No icons ever needed.
    *   **Enables Click**: Short click works as normal selection/action.
*   **Cons on Desktop**:
    *   **Low Discoverability**: No visual cue that "Long Press" does anything. Users rarely "guess" to long press on desktop.
    *   **Friction**: The 200-500ms delay feels "sluggish" for power users compared to instant handles.
    *   **Text Selection Conflict**: Users trying to select text might trigger drag if implementation is naive.

## 3. Heuristic Evaluation for Align Agents v2

User Requirement: "Clean Design", "Premium Feel", "No Drag Icon".

| Criteria | Long Press (Current) | Hover Reveal |
| :--- | :--- | :--- |
| **Cleanliness** | ⭐⭐⭐⭐⭐ (Perfect) | ⭐⭐⭐⭐ (Near Perfect) |
| **Discoverability** | ⭐ (Poor) | ⭐⭐⭐⭐⭐ (Excellent) |
| **Speed** | ⭐⭐ (Delayed) | ⭐⭐⭐⭐⭐ (Instant) |
| **Desktop Native Feel** | ⭐⭐ (Mobile-like) | ⭐⭐⭐⭐⭐ (Standard) |

## 4. Recommendation

While "Long Press" satisfies the "No Icon" requirement strictly, **"Hover Reveal Handle"** is the widely accepted "Best Practice" for modern, premium desktop apps (Linear-like) because it balances aesthetics with usability.

**However**, to strictly follow the User's Request for **"No Drag Icon"** while mitigating the "Discoverability" issue of Long Press:

### Proposed Strategy: "Enhanced Long Press + Visual Cues"
If we stick to Long Press:
1.  **Cursor Feedback**: Change cursor to `grab` or `context-menu` on hover, or use a Tooltip "Hold to reorder".
2.  **Animation**: When the timer triggers (200ms), the item must visibly "pop" or "lift" (scale 1.02, shadow-lg) to confirm drag mode is active.
3.  **Haptic/Sound**: (Optional) Micro-feedback.

**Alternative Recommendation (If aesthetics permit)**:
**"Clean Hover Gutter"**: The left padding (16px) is empty. On hover, a subtle grip `⋮⋮` appears in `text-zinc-700`. This is the "Linear" way.

## 5. Decision for Implementation
Given the strict user constraint "드레그엔드랍 아이콘을 생성하지말고" (Do not create drag icon), we proceed with **Enhanced Long Press**.

### Implementation Details
*   **Sensor**: `PointerSensor` (Delay: 200ms, Tolerance: 5px).
*   **Visuals**:
    *   **Idle**: No Icon.
    *   **Hover**: Tooltip "Long press to move".
    *   **Dragging**: Opacity 50%, Scale 1.05, Shadow.
    *   **Cursor**: `cursor-grab`.
