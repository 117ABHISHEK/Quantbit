# Smart Factory Maintenance Tracker - Design Guidelines

## Design Approach

**Selected Framework:** Bootstrap 5 Design System with industrial dashboard patterns inspired by Linear and Notion's data-heavy interfaces.

**Core Principles:**
- Information clarity and quick scanability for factory floor personnel
- Status-driven visual hierarchy using functional color coding
- Efficient data density without overwhelming users
- Professional enterprise aesthetic with modern refinement

## Typography System

**Font Stack:** System UI fonts via Bootstrap defaults
- Headers (H1-H3): Bold weight, large sizing for dashboard metrics
- Body Text: Regular weight, 16px base for readability in industrial settings
- Data Tables: Medium weight, 14px for dense information display
- Status Labels: Semibold weight, uppercase for emphasis

## Layout & Spacing System

**Tailwind Units:** Consistent use of `4, 8, 12, 16, 24` spacing scale
- Card padding: `p-6` (1.5rem)
- Section gaps: `gap-8` between dashboard cards
- Table row padding: `py-4` for touch-friendly interaction
- Modal spacing: `p-8` for forms

**Grid Structure:**
- Dashboard cards: 3-column grid on desktop (`grid-cols-1 md:grid-cols-3`)
- Machine table: Full-width with responsive horizontal scroll
- Forms: Single column, max-width container (`max-w-2xl`)

## Component Library

### Dashboard Cards
- Large metric number (48px, bold) at top
- Label text below (14px, muted)
- Icon indicator aligned top-right
- Subtle shadow with rounded corners (`rounded-lg`)
- Minimum height for visual balance

### Machine Table
- Sticky header row with semibold labels
- Alternating row backgrounds for scannability
- Status badge: Pill-shaped with icon, positioned left in status column
- Action buttons: Icon-only, grouped right, consistent spacing
- Responsive: Stack to cards on mobile viewports

### Status Indicators (Functional Colors Only)
- Healthy/OK: Green badge with checkmark icon
- Due Soon: Yellow/amber badge with clock icon  
- Overdue: Red badge with alert icon
- Badges use soft background tints, not solid fills

### Add Maintenance Modal
- Overlay: Semi-transparent backdrop
- Modal: Centered, `max-w-lg`, elevated shadow
- Form fields: Full-width inputs with clear labels above
- Date picker: Calendar icon inside input field
- Submit button: Full-width, prominent primary style
- Close X: Top-right corner, clear hit target

### Navigation Header
- Full-width bar with factory logo left
- App title: Bold, 20px
- Navigation links: Right-aligned, minimal styling
- Height: `h-16` for consistent vertical rhythm

## Functional Color Application

Status colors are functional indicators only:
- Green: Machine health status "OK"
- Yellow/Amber: "Due Soon" warning state
- Red: "Overdue" alert state

These colors appear exclusively in status badges and dashboard metric cards. All other UI elements use neutral grays for professional consistency.

## Data Visualization

### Summary Metrics
- Large numerals with context labels
- Icon representation for each metric category
- Card backgrounds remain neutral, status colors in badges only

### Machine List Display
- Condensed row height for information density
- Machine name: Bold, larger than other columns
- Last/Next maintenance: Date format with relative time "(3 days ago)"
- Action buttons: Edit (pencil), Delete (trash), View Logs (list icon)

## Forms & Inputs

- Label positioning: Above field, left-aligned, semibold
- Input fields: Light border, rounded corners, ample padding (`px-4 py-3`)
- Focus states: Subtle border color shift with shadow
- Validation: Inline error messages below field in red text
- Required indicators: Asterisk after label

## Toast Notifications

- Position: Top-right corner
- Success: Green accent with checkmark
- Error: Red accent with X icon  
- Auto-dismiss after 4 seconds
- Slide-in animation from right

## Responsive Behavior

**Mobile (<768px):**
- Dashboard cards stack vertically
- Table converts to card layout with labels
- Modal expands to near full-width with margin
- Navigation collapses to hamburger menu

**Desktop (≥1024px):**
- Maximum content width: `max-w-7xl` centered
- Generous whitespace around main container
- Side margins: `px-6` minimum

## Key Design Distinctions

Unlike generic Bootstrap applications, this tracker emphasizes:
- **Industrial Clarity:** High contrast, large touch targets
- **Metric Prominence:** Dashboard numbers are hero elements
- **Status-First Design:** Visual hierarchy driven by maintenance state
- **Rapid Scannability:** Table design optimized for quick status checks
- **Action Accessibility:** Maintenance logging is primary CTA, always visible