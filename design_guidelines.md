# Financial Freedom Simulation Game - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from gamified learning platforms (Duolingo), financial apps (Mint, YNAB), and idle simulation games (AdVenture Capitalist) to create an engaging yet educational experience.

**Core Principles**:
- Clarity over decoration: Financial data must be instantly readable
- Reward-driven visuals: Celebrate progress and achievements prominently
- Stress indicators: Visual cues for negative states (low health, insufficient funds)
- Playful professionalism: Balance game aesthetics with financial credibility

---

## Typography System

**Primary Font**: Inter or DM Sans (Google Fonts)
- Headings: 700 weight, sizes from text-3xl (page titles) to text-lg (card headers)
- Body Text: 400 weight, text-base for descriptions
- Numbers/Stats: 600 weight, text-2xl to text-4xl for currency and metrics
- Button Text: 500 weight, text-sm to text-base

**Hierarchy**:
- Game title/logo: text-3xl, 700 weight
- Currency displays: text-3xl, 600 weight, tabular-nums
- Modal titles: text-2xl, 700 weight
- Card titles: text-lg, 600 weight
- Timer displays: text-xl, 500 weight, monospace
- Body content: text-base, 400 weight

---

## Layout System

**Spacing Units**: Use Tailwind spacing of 2, 4, 6, 8, 12, 16 as primary rhythm
- Component padding: p-4 (mobile), p-6 (desktop)
- Section margins: mb-6, mb-8
- Card spacing: gap-4 in grids
- Modal padding: p-6 to p-8

**Container Strategy**:
- Max-width: max-w-6xl for main game area
- Full-width status bars at top
- Cards: Rounded corners (rounded-xl), elevation with shadows
- Modals: Fixed positioning, max-w-md to max-w-lg centered

---

## Component Library

### Navigation & Layout

**Top Status Bar** (Fixed, full-width):
- Health bar with percentage and heart icon (left)
- Currency display with trending indicator (center)
- Day/month counter with calendar icon (right)
- Background: Subtle gradient or solid with shadow-sm
- Height: h-16 with px-4 padding

**Bottom Navigation** (Fixed, mobile-optimized):
- 4-5 icon-based tabs: Home, Income, Lifestyle, Health, Achievements
- Active state: Bold icon with accent underline or fill
- Height: h-20 with safe-area padding

**Main Game Area**:
- Scrollable content between top/bottom bars
- Padding: px-4 py-6
- Background: Subtle pattern or gradient

### Cards & Data Display

**Income Source Cards**:
- Large, prominent cards with rounded-xl borders
- Header: Icon + Title + Status badge
- Body: Current income amount (large, bold)
- Timer/progress bar if applicable
- Action button (Collect/Upgrade/Unlock)
- Shadow: shadow-lg on hover, shadow-md default

**Stat Cards** (Health, Money, Time):
- Compact design with icon + label + value
- Progress bars for health/investment countdown
- Rounded-lg borders
- Visual indicators: Green for positive, red for warnings, yellow for neutral

**Lifestyle Purchase Cards**:
- Grid layout: grid-cols-2 md:grid-cols-3
- Image or icon placeholder at top
- Title, price, maintenance cost clearly labeled
- Purchase button with disabled state styling
- Owned items: Checkmark badge, slightly muted appearance

### Modals & Overlays

**Modal Container**:
- Centered overlay with backdrop blur and opacity
- Rounded-2xl with generous padding (p-8)
- Max-width: max-w-md for confirmations, max-w-lg for detailed content
- Close button: Top-right, rounded-full with hover state

**Notification Toasts**:
- Fixed positioning: top-4 right-4
- Slide-in animation from right
- Icon + message + optional dismiss
- Auto-dismiss timer indicator (subtle progress bar)
- Types: Success (green accent), Warning (yellow), Error (red), Info (blue)

**Achievement Popups**:
- Celebratory design with sparkle/trophy icon
- Larger font for achievement title
- Reward amount prominently displayed
- Confetti or particle effect suggestion (CSS animation)

### Progress Indicators

**Timer Displays**:
- Monospace font for countdown (mm:ss format)
- Circular progress indicator for salary/investment timers
- Linear progress bars for health and investment countdown
- Pulsing animation when near completion

**Health Bar**:
- Full-width gradient fill
- Smooth transitions on value changes
- Color coding: Green (>75), Yellow (50-75), Red (<50)
- Accompanying heart icon that animates on low health

### Buttons & Actions

**Primary Actions** (Collect, Purchase, Boost):
- Rounded-lg with medium padding (px-6 py-3)
- Bold text with icons where appropriate
- Disabled state: Reduced opacity, cursor-not-allowed
- Loading state: Spinner or pulsing animation

**Secondary Actions**:
- Outlined style or ghost button
- Same sizing as primary for consistency

**Icon Buttons**:
- Circular (rounded-full) for close/dismiss actions
- Square with rounded corners for navigation
- Size: w-10 h-10 for touch targets

### Special Elements

**Daily Reward Indicator**:
- Floating badge or pulsing icon
- Glow effect to draw attention
- Streak counter prominently displayed

**Expense Breakdown**:
- Collapsible panel or modal
- List of items with individual costs
- Total highlighted at bottom
- Icons for each expense category

**Banner Ad Container**:
- Full-width banner across screen
- Subtle border distinction from content
- "Watch Ad" messaging with timer
- Close button after viewing period

**Game Over Screen**:
- Full-screen modal with backdrop
- Stats grid: 2 columns showing final metrics
- Restart button prominently placed
- Achievement summary section

---

## Visual Treatments

**Elevation & Shadows**:
- Cards: shadow-md default, shadow-lg on hover/active
- Modals: shadow-2xl
- Buttons: shadow-sm, shadow-md on hover
- Floating elements: shadow-xl

**Border Radius**:
- Small elements (badges, tags): rounded-md
- Cards: rounded-xl
- Modals: rounded-2xl
- Buttons: rounded-lg
- Avatars/icons: rounded-full

**Animations** (Minimal, purposeful):
- Health changes: Smooth number count-up/down (1s duration)
- Currency updates: Brief scale pulse (0.3s)
- Modal entry: Fade + slight scale (0.2s)
- Notifications: Slide from edge (0.3s)
- Achievement unlock: Celebratory bounce (0.5s)
- NO complex scroll animations or constant motion

---

## Images

**Icon System**:
Use Lucide React (already in code) for all interface icons consistently throughout

**Lifestyle Purchase Cards**:
Placeholder images for lifestyle items (house, car, gadgets)
- Aspect ratio: 16:9 or square
- Placement: Top of each card
- Style: Clean product photography or illustrations

**Achievement Badges**:
Trophy/medal icons or illustrations
- Placement: Achievement modal and achievements list
- Style: Outlined icons that fill on unlock

**Health Warning States**:
Subtle warning icon in health bar when low
- No intrusive imagery
- Keep interface clean

---

## Data Visualization

**Currency Formatting**:
- Always use ₦ symbol prefix
- Thousand separators with commas
- Large amounts: Consider K/M suffixes for compactness
- Positive changes: Green with +, Negative: Red with -

**Time Displays**:
- Countdown timers: MM:SS format
- Game duration: "X years & Y months" or "Z months"
- Consistent positioning in top bar

**Progress Tracking**:
- Linear bars for deterministic progress (investment countdown)
- Circular/radial for recurring actions (salary timer)
- Percentage display for health (0-100%)

---

## Responsive Behavior

**Mobile-First** (sm: 640px):
- Single column layouts
- Full-width cards
- Bottom tab navigation priority
- Collapsible sections for expense details

**Desktop** (md: 768px and up):
- 2-3 column grids for cards
- Side panel for secondary info (optional)
- More generous spacing (increase padding by 50%)
- Hover states become more prominent