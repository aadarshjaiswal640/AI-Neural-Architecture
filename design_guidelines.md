# Design Guidelines: AI Neural Architecture Energy Footprint Analyzer

## Design Approach

**Selected Approach:** Design System - Material Design (Data-Focused Variant)

**Justification:** This is a data-intensive, utility-focused dashboard requiring excellent data visualization, clear information hierarchy, and professional credibility. Material Design's strong grid system, elevation principles, and data display patterns align perfectly with the technical, analytical nature of the application.

**Key Design Principles:**
- Data clarity and readability above decorative elements
- Sustainability-conscious visual identity with purpose-driven green accents
- Professional, trustworthy interface for technical users
- Immediate information accessibility without cognitive overhead

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Default):**
- Background: 222 14% 8% (deep charcoal)
- Surface: 220 13% 13% (elevated panels)
- Surface Elevated: 220 13% 16% (cards, modals)
- Primary (Sustainability Green): 142 76% 45%
- Primary Hover: 142 76% 38%
- Success Indicator: 142 76% 45%
- Warning (Energy High): 38 92% 50%
- Danger (Critical): 0 84% 60%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 65%
- Border: 220 13% 25%

**Light Mode:**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Surface Elevated: 0 0% 100% (with shadow)
- Primary (Sustainability Green): 142 71% 42%
- Primary Hover: 142 71% 35%
- Text Primary: 0 0% 10%
- Text Secondary: 0 0% 40%
- Border: 0 0% 88%

**Accent Colors:**
- Info Blue: 217 91% 60%
- Chart Colors: Use vibrant but distinct hues - 142 76% 45% (green), 217 91% 60% (blue), 271 81% 56% (purple), 38 92% 50% (orange), 340 82% 52% (red)

### B. Typography

**Font Families:**
- Primary: Inter (Google Fonts) - Clean, technical readability
- Monospace: JetBrains Mono (Google Fonts) - For data/code displays

**Type Scale:**
- Hero Heading: 3.5rem (56px) / Bold / -0.02em
- Page Heading (H1): 2.25rem (36px) / Bold / -0.01em
- Section Heading (H2): 1.875rem (30px) / Semibold
- Card Heading (H3): 1.5rem (24px) / Semibold
- Subheading: 1.25rem (20px) / Medium
- Body Large: 1.125rem (18px) / Regular
- Body: 1rem (16px) / Regular
- Body Small: 0.875rem (14px) / Regular
- Caption: 0.75rem (12px) / Medium / Uppercase / 0.05em tracking

### C. Layout System

**Tailwind Spacing Primitives:** Use 4, 6, 8, 12, 16, 20, 24 for consistency
- Component internal padding: p-4 to p-6
- Card spacing: p-6 to p-8
- Section spacing: py-12 to py-20
- Container gaps: gap-6 to gap-8

**Grid System:**
- Dashboard: 12-column grid with 24px gutters
- Stat cards: 4-column on desktop (grid-cols-4), 2-column tablet (md:grid-cols-2), 1-column mobile
- Chart area: 8-column main / 4-column sidebar split on large screens
- Max container width: max-w-7xl (1280px)

### D. Component Library

**Navigation:**
- Top navbar: Fixed, 64px height, backdrop blur with slight transparency
- Logo left, navigation center, theme toggle + user actions right
- Sidebar (if used): 280px wide, collapsible to 64px icon-only on mobile

**Dashboard Cards:**
- Background: Surface color with subtle border (border-2)
- Border radius: rounded-lg (8px)
- Padding: p-6
- Shadow: Subtle elevation (shadow-md in light mode)
- Hover: Slight scale transform (scale-[1.02]) and increased shadow
- Header: Bold title with subtle divider line below

**Statistics Display:**
- Large counter cards with animated number increments
- Icon + Label + Value + Change indicator layout
- Value: 2.5rem, bold, primary color
- Label: 0.875rem, secondary color
- Change indicator: Small badge with arrow (↑/↓) and percentage

**Interactive Charts:**
- Chart container: White/dark surface with p-6 padding
- Height: 400px for primary charts, 300px for secondary
- Responsive: Full width, maintain aspect ratio
- Controls: Filter buttons above chart (subtle pill-style toggles)
- Tooltips: Rounded, backdrop blur, appear on hover with smooth fade

**File Upload Zone:**
- Dashed border (border-dashed border-2) in primary color
- Min-height: 200px
- Center-aligned icon (upload cloud) + text
- Hover state: Solid border, subtle background tint
- Active drag: Primary background at 10% opacity

**Tables:**
- Header: Sticky, background with subtle border-bottom
- Rows: Hover background change, 48px min-height
- Alternating row backgrounds for readability
- Action buttons: Icon-only, appear on row hover

**Buttons:**
- Primary: Solid primary green background, white text, rounded-md, px-6 py-3
- Secondary: Outline style with primary border, primary text
- Ghost: No border, primary text, hover background tint
- Icon buttons: 40px square, rounded-full, centered icon
- All buttons: Medium font weight, smooth transitions

**Badges & Tags:**
- Pill-shaped (rounded-full), px-3 py-1
- Small text (0.75rem), medium weight
- Color-coded by status: green (efficient), orange (moderate), red (high consumption)

**Modals & Overlays:**
- Backdrop: Black at 60% opacity with backdrop blur
- Modal: Centered, max-w-2xl, rounded-xl, shadow-2xl
- Header: Bold title with close button (top-right)
- Footer: Right-aligned action buttons with spacing

**Progress Indicators:**
- Linear: Full-width bar with animated primary color fill
- Circular: Ring-style with percentage in center
- Processing states: Pulsing skeleton loaders for content areas

### E. Animations

**Use Sparingly - Essential Only:**
- Page transitions: Subtle fade-in (200ms ease-out)
- Number counters: Animated count-up on load (1000ms)
- Chart entry: Staggered element appearance (300ms delay between elements)
- Hover states: Transform/color transitions (150ms ease)
- Loading spinners: Smooth rotation for processing states

**Forbidden:**
- Parallax scrolling effects
- Complex scroll-triggered animations
- Auto-playing carousels
- Decorative particle effects

---

## Page-Specific Guidelines

### Landing/Dashboard Home:
- Hero section: 60vh height with gradient overlay (dark mode: deep green-to-charcoal, light mode: white-to-mint tint)
- Hero content: Large heading "Analyze. Optimize. Sustain." with subtitle explaining the tool's value
- Real-time sustainability counter prominently displayed (CO2 saved, energy optimized)
- Quick stats row: 4 animated counter cards showing total analyses, average savings, models compared
- Feature showcase: 3-column grid (icons + title + brief description) for core capabilities
- CTA section: Upload data button with supporting text about getting started

### Analysis Dashboard:
- Sidebar: Collapsible filter panel with dataset selector, date range, model type filters
- Main area: Grid of 6 stat cards at top (2 rows × 3 columns)
- Charts section: 2-column layout for side-by-side comparisons, full-width for detailed charts
- Interactive legend: Clickable to toggle data series visibility
- Export controls: Top-right corner with download PDF and share buttons

### Recommendations Panel:
- Priority-sorted list of actionable insights
- Each recommendation: Icon + title + description + estimated impact badge
- "Apply" button for each with confirmation modal
- Impact visualization: Before/after comparison sliders

---

## Images

**Hero Section Image:**
Include a modern, abstract visualization of neural network nodes with energy flow representations (green light trails connecting nodes). Image should convey technical sophistication and sustainability. Use gradient overlay (green-to-transparent) to ensure text readability.

**Feature Section Icons:**
Use icon library (Heroicons) for: upload-cloud, chart-bar, light-bulb, document-report, cpu-chip, leaf (sustainability)

**Empty States:**
Illustrated placeholders for no-data scenarios - simple line art of graphs with "Upload data to begin" messaging