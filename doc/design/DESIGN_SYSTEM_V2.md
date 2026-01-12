# Design System V2: "Linear-esque" Premium UI

## 1. Design Philosophy
- **Concept**: "Heavy, Sophisticated, Professional"
- **Reference**: Linear, Conductor, Vercel Dashboard.
- **Keywords**: Density, Precision, Subtle Contrast, Keyboard-First.
- **Mode**: **Dark Mode First** (Strict support for deep dark themes).

## 2. Core Foundation (Tailwind + Shadcn)

### 2.1 Color Palette
- **Base Background**: `bg-zinc-950` (Not pure black, but very deep charcoal).
- **Surface**: `bg-zinc-900 / bg-zinc-800` for cards and panels.
- **Accents**: 
  - Primary: `text-white` (High contrast text).
  - Muted: `text-zinc-400` (Secondary text).
  - Border: `border-zinc-800` (Subtle, barely there borders).
  - Brand: `indigo-500` or `violet-500` (Used extremely sparingly for active states).

### 2.2 Typography
- **Sans**: `Inter` (Standard, clean, legible).
- **Mono**: `JetBrains Mono` (For code, IDs, logs).
- **Sizes**:
  - `text-xs` (12px): Metadata, badges.
  - `text-sm` (14px): Standard UI text (Dense information).
  - `text-base` (16px): Headers.
  - **Weight**: Heavy use of `font-medium` over `font-regular` for legibility on dark backgrounds.

### 2.3 Layout & Spacing
- **Density**: High density. `px-3 py-1.5` for buttons. `gap-2` for lists.
- **Borders**: 1px borders everywhere. No shadows for depth—use borders and slight background color shifts.
- **Radius**: `rounded-md` (6px) or `rounded-sm` (4px). Avoid `rounded-xl` unless it's a modal.

## 3. Component Guidelines (Shadcn/UI Overrides)

### 3.1 Buttons
- **Variant**: `outline` or `ghost` is the default. `default` (solid) is reserved for the primary CTA (Call to Action) only.
- **Style**: No drop shadows. Subtle hover state (`hover:bg-zinc-800`).

### 3.2 Cards / Containers
- **Style**: Flat background `bg-zinc-900/50`. 
- **Border**: `border border-zinc-800`.
- **Backdrop**: `backdrop-blur-sm` (Glassmorphism) only for sticky headers or overlays.

### 3.3 Inputs
- **Style**: Minimalist. Removal of heavy focus rings. Use subtle color change on focus.
- **Background**: `bg-transparent` or `bg-zinc-900`.

## 4. Layout Structure (Shell)
- **Sidebar (Left)**: Fixed width (e.g., 240px). `border-r border-zinc-800`. Darker shade than main content.
- **Header (Top)**: Minimal height (e.g., 48px). Breadcrumbs + Actions. Sticky with blur.
- **Main Content**: Scrollable area. Padding `p-6` or `p-8`.

## 5. Animation
- **Transitions**: `duration-200 ease-in-out` for all hover states.
- **Micro-interactions**: Subtle scale on click (`active:scale-95`).

## 6. Iconography
- **Library**: `Lucide React` (Stroke width: 1.5px or 2px depending on density).
- **Color**: `text-zinc-400` default, `text-zinc-100` active.

---

## Action Plan
1. **Reset**: Remove all existing CSS/Tailwind customizations.
2. **Install**: Initialize `shadcn-ui@latest`.
3. **Configure**: Set `slate` or `zinc` as base color.
4. **Implement**: Create the `AppShell` layout component first.
