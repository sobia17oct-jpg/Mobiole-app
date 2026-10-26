---
name: Pitch Precision
colors:
  surface: '#f3faff'
  surface-dim: '#d2dbe1'
  surface-bright: '#f3faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf5fa'
  surface-container: '#e6eff5'
  surface-container-high: '#e0eaef'
  surface-container-highest: '#dae4e9'
  on-surface: '#141d21'
  on-surface-variant: '#404941'
  inverse-surface: '#293236'
  inverse-on-surface: '#e9f2f8'
  outline: '#707971'
  outline-variant: '#bfc9bf'
  surface-tint: '#256b44'
  primary: '#004425'
  on-primary: '#ffffff'
  primary-container: '#135d38'
  on-primary-container: '#8dd4a5'
  inverse-primary: '#8fd6a7'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#0c4327'
  on-tertiary: '#ffffff'
  tertiary-container: '#285b3d'
  on-tertiary-container: '#9ad1ab'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#abf3c2'
  primary-fixed-dim: '#8fd6a7'
  on-primary-fixed: '#002110'
  on-primary-fixed-variant: '#00522e'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#b8efc8'
  tertiary-fixed-dim: '#9cd3ad'
  on-tertiary-fixed: '#002110'
  on-tertiary-fixed-variant: '#1c5033'
  background: '#f3faff'
  on-background: '#141d21'
  surface-variant: '#dae4e9'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
  metric-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 48px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-tablet: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The visual identity embodies the disciplined, competitive spirit of championship cricket. Designed specifically for tournament directors, team captains, scorers, and passionate supporters, the interface prioritizes immediate situational awareness and crisp real-time operational clarity under bright daylight conditions.

The visual style blends **Corporate / Modern** precision with athletic vitality. Drawing from stadium turf greens, crisp chalk boundary lines, and luminous trophy gold, the aesthetic maintains institutional authority while preserving the live-match urgency of tournament operations. Layouts emphasize tabular balance, high-density match tracking, and distinct structural hierarchies without falling into visual clutter or neon excess.

Every screen communicates dependable structure: dense statistics resolve into clear visual cards, live-action metrics stand out with deliberate golden accents, and navigation follows ergonomic mobile-first touch ergonomics.

## Colors

The color palette is derived directly from tournament grounds: deep turf grass, crisp boundary markings, and brass silverware. 

- **Primary (`#135D38`)**: Represents championship green. Used for authoritative surfaces, primary navigation anchors, high-level headers, and main interactive calls to action.
- **Secondary (`#F59E0B`)**: An athletic amber-gold accent reserved for live match indicators, player of the match honors, leaderboard rankings, and critical match states.
- **Tertiary (`#0D4428`)**: Deep stadium night green. Employed for high-contrast emphasis, active tab indicators, and deep card surfaces when presenting dark-mode score highlights within an overall light frame.
- **Neutral (`#1A2327`)**: Deep slate charcoal, replacing stark pitch black to ensure comfortable outdoor readability for extended scoring sessions.

### Functional Tint & Surface Tiers
- **Surface Canvas**: `#F8FAF8` - A softened outdoor white with a whisper of field mist.
- **Surface Subdued / Mint Tint**: `#EDF5F0` - For secondary chips, inning segment selectors, and table striping.
- **Surface Border**: `#D6E4DB` - Subtle, structural grid containment.
- **Status Signal Red**: `#DC2626` - Reserved strictly for dismissals (wickets) and match interruptions.

## Typography

The type scale combines **Plus Jakarta Sans** for headlines, labels, and match metric scoreboards with **Inter** for multi-column data sheets, ball-by-ball commentaries, and tournament administrative controls.

- **Plus Jakarta Sans**: Injected into scores, team abbreviations, and structural navigation to present clean, athletic geometries without decorative distractions. Numbers inherit tabular sizing (`tnum`) automatically across all metric styles to keep run totals and strike rates vertically stable.
- **Inter**: Neutral, workhorse legibility for tabular scorecard rows, player bio details, and rules documentation. High x-height keeps runs, balls, boundaries, and extras legible on compact 360dp mobile viewports.
- **Metric Display**: Reserved for active match scores (e.g., `184/4 (18.2)`), anchoring live match headers with decisive visual hierarchy.

## Layout & Spacing

The layout model is anchored to a mobile-first 4-column grid (expanding to 8 columns on tablet viewports) optimized for portrait handheld usage. Standard mobile horizontal canvas margins are locked to `1rem` (16px), keeping touchable cards safely away from display bezels while maximizing room for 11-player rosters and multi-column overs tables.

### Layout Principles
- **Scoring Rhythms**: Ball-by-ball indicator groups utilize `space-xs` (4px) gaps to allow six balls to span comfortably across one row on any screen width.
- **Card Internals**: Match fixtures and player statistic cards rely on `space-md` (16px) internal padding, establishing uniform containment without consuming vital scoreboard real estate.
- **Vertical Hierarchy**: Match sections (e.g., Summary, Bowling Card, Live Commentary) separate across `space-lg` (24px) blocks to avoid thumb fatigue and accidental clicks during live ball-entry modes.
- **Tablet Reflow**: On screens exceeding 600px width, layout switches from single-column vertical stacking into a split-screen match dashboard: live pitch view and action wheel on the left, full batting and bowling tables on the right.

## Elevation & Depth

Visual hierarchy uses a refined combination of **low-contrast athletic outlines** and **ambient stadium turf shadows**. This keeps the interface crisp under outdoor ambient glare while preventing cards from appearing muddy.

- **Level 0 (Flat Canvas)**: Neutral surface `#F8FAF8` with no shadow. Houses primary page backgrounds and full-bleed utility toolbars.
- **Level 1 (Default Match Cards)**: Pure white `#FFFFFF` surface accompanied by a crisp `1px` border of `#D6E4DB` and an ambient shadow: `0 2px 8px -2px rgba(19, 93, 56, 0.08)`. This soft emerald-tinted drop shadow lifts content subtly without looking greasy.
- **Level 2 (Active Scoreboard & Overlays)**: Surface `#FFFFFF` layered over elevated components (e.g., Live Match Strip, Floating Scoring Wheel). Shadow: `0 8px 24px -4px rgba(13, 68, 40, 0.14)`.
- **Level 3 (Modal Sheets & Match Toss Selectors)**: Bottom-sheet drawers and confirmation dialogues. Elevated with `0 16px 36px -6px rgba(26, 35, 39, 0.22)`, bounded by a top border of `#D6E4DB`.
- **Active State Highlights**: When a match is live, the card edge receives a `2px` left border in secondary accent amber (`#F59E0B`), signaling dynamic data changes instantly.

## Shapes

The design system employs **Level 2 (Rounded)** curvature across all core elements, creating a contemporary, accessible athletic feel that stays balanced and professional.

- **Cards and Containers**: Standardized to `rounded-lg` (`1rem` / 16px). This delivers the specified 16dp aesthetic, keeping team matchups, over-trackers, and player profile panels consistent.
- **Buttons and Inputs**: Governed by default roundedness (`0.5rem` / 8px) for buttons, score keypad triggers, and search inputs, reinforcing physical tactile target areas.
- **Pills and Badges**: Status badges (such as `LIVE`, `INNINGS BREAK`, and run chips) use fully rounded pill structures (`9999px`) to maintain clear visual separation from rectangular data cards.
- **Over Wheels**: Over progress circles and ball trackers use absolute circular radii (`50%`), matching the physical geometry of cricket balls.

## Components

### Buttons
- **Primary Buttons**: Filled with `#135D38`, label in pure white `#FFFFFF` (`label-lg`), `0.5rem` border radius, minimum height of 48px to comply with athletic touch target ergonomics.
- **Secondary / Action Accent Buttons**: Filled with `#F59E0B` with neutral `#1A2327` type, reserved for critical match actions: "End Over", "Declare", or "Start Match".
- **Ghost / Outlined Buttons**: Transparent fill with `1.5px` border in `#135D38` and primary green text for actions like "View Full Scorecard" or "Export PDF".

### Chips & Badges
- **Live Indicator Badge**: High-saturation `#F59E0B` pill background with `#1A2327` uppercase text (`label-sm`), featuring a pulsating 6px white status dot.
- **Ball Chips**: 32x32px circular indicators. Default dot ball uses `#EDF5F0` background with slate text. Boundary 4s use `#135D38` with white text. Boundary 6s and Wickets use `#0D4428` and `#DC2626` respectively with white text, bolded for instant scanability.

### Match & Tournament Cards
- **Structure**: Surface `#FFFFFF`, 16px (`1rem`) border radius, 1px border `#D6E4DB`, and 16px padding.
- **Header**: League name and stage in `label-sm` muted slate, paired with match status chip on the right.
- **Body**: Two team rows showcasing flag/emblem, team acronym in `headline-sm`, score in `headline-md`, and overs in `body-sm`.
- **Footer**: Required run rate, target summary, or venue text separated by a thin `1px` divider in `#EDF5F0`.

### Lists & Score Tables
- Batting and bowling data grids utilize compact rows of 40px height with alternating row striping using `#F8FAF8` and `#FFFFFF`.
- Player name columns are left-aligned in `body-md` bold; numeric statistics (Runs, Balls, 4s, 6s, SR) are right-aligned with fixed tabular spacing.

### Inputs & Keypads
- Text fields use `#FFFFFF` background, `1px` border `#D6E4DB`, and 12px horizontal padding. Active focus states switch to a solid `2px` border in `#135D38`.
- Scoring Keypad: High-speed scoring grid of 60x60px numeric buttons designed for one-thumb field scoring, utilizing `0.5rem` radius and soft click depression states.