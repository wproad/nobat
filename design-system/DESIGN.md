# Soft Slot — Booking Form Plugin Design System

> Category: Embeddable plugin · Light · Persian RTL  
> Accent: **placeholder teal** — swap `--accent*` without layout changes.

## 1. Visual Theme & Atmosphere

Soft Slot is a quiet light canvas for an appointment booking widget that must sit inside any host site. Surfaces step gently (page → panel → card). Status meaning lives only in badges. Selection uses a calm teal accent fill — never black fills.

**Key characteristics**
- Light plugin canvas (`--bg`) with white elevated cards (`--surface`)
- One swappable accent (placeholder teal) for primary CTA + selected controls only
- Fixed status badge vocabulary with paired bg/fg tokens
- Host font first; Vazirmatn bundled as fallback
- All public styles scoped under `.bf-root` with `bf-*` class prefixes

**Not Linear dark.** This kit is modern light for marketing/host embeds.

## 2. Token contract

See `tokens.css`. Core tokens live on `.bf-root`.

### Host theming knobs (only)

Hosts may override:
- `--accent`
- `--accent-soft`
- `--accent-hover`
- `--accent-on`

Do **not** encourage hosts to override status, well, or count tokens.

### Status badges (required pairs)

**Appointment list**

| Class | Label | Meaning |
|-------|-------|--------|
| `bf-badge--pending` | در انتظار تأیید | Awaiting confirmation |
| `bf-badge--confirmed` | تأیید شده | Approved / booked |
| `bf-badge--cancelled` | لغو شده | Cancelled |
| `bf-badge--past` | گذشته | Past (list filter) |
| `bf-badge--upcoming` | پیش رو | Upcoming (list filter) |
| `bf-badge--count` | (number) | Neutral tab counter — not a status |

**Calendar (legend + cells)**

| Class | Label | Meaning |
|-------|-------|--------|
| `bf-badge--available` | در دسترس | Free slot |
| `bf-badge--pending` | در انتظار | Awaiting confirmation |
| `bf-badge--confirmed` | تأیید شده | Confirmed booking |
| `bf-badge--cancel-requested` | درخواست لغو | Cancellation requested |
| `bf-badge--cancelled` | لغو شده | Cancelled |
| `bf-badge--completed` | تمام شده | Finished appointment |
| `bf-badge--blocked` | مسدود شده | Blocked by admin |
| `bf-badge--unavailable` | در دسترس نیست | Outside hours / inactive |

**Rule:** Badges always use paired `bg` + `fg`. Never encode status with `--accent` alone.

### Calendar legend (toggleable)

| Piece | Notes |
|-------|-------|
| `.bf-legend` | Root; `data-open="true\|false"` |
| `.bf-legend__toggle` | Full-width disclosure control (≥44px) |
| `.bf-legend__swatch--*` | Soft fill + status-colored border square |
| `.bf-legend__info` | Optional help chip (`title` / `aria-label`) |

Demo: `calendar-legend.html`. Keep labels Persian; do not ship English status strings in UI.

## 3. Typography

| Role | Stack | Notes |
|------|-------|-------|
| UI / body | `inherit`, Vazirmatn, IRANSansX, system-ui | Host font wins |
| Tabular times | same + `font-variant-numeric: tabular-nums` | Dates, ranges, queue # |

Weights: **400** body · **500** UI · **600** titles (cap at 600).

| Role | Size / weight |
|------|----------------|
| Screen title | 20–22px / 600 |
| Section label | 14–15px / 500 |
| Body / field / slot | 14px / 400 |
| Caption / help | 12–13px / 400 · `--muted` |
| Badge | 11–12px / 500 |

## 4. Radius, space, elevation

- Radius: control `8px` · card `12px` · badge `9999px`
- Space: 4 / 8 / 12 / 16 / 24 (8px grid)
- Elevation: border + soft shadow `0 1px 2px oklch(0.2 0.02 260 / 0.06)`
- **One flourish:** selected date/slot = accent fill + `--accent-on` text

## 5. Visual language rules

1. **Accent budget:** primary CTA + selected controls only (≤2 focal accent uses per viewport).
2. **Selection ≠ black:** selected date/slot/tab use accent system.
3. **Disabled slots:** keep grid cell; muted; not interactive; do not collapse layout.
4. **RTL first:** `dir="rtl"` on `.bf-root`.
5. **Host-safe:** `bf-` prefixes; no `html`/`body` styling from the plugin.
6. **Hover contrast:** never lighten text toward the background.
7. **Wells stay nested:** note and cancel-reason remain distinct inset boxes.

## 6. Component recipes

### Badges
Pill · padding 4×8 · single line · no emoji.

### Buttons
- **Primary:** accent fill · accent-on · hover → accent-hover — `رزرو نوبت` / `رزرو نوبت جدید`
- **Ghost:** surface · border · fg — `مشاهده نوبت‌های من`
- **Danger (reserved):** soft rose — future cancel confirm only

One solid primary per viewport for the booking action.

### Date strip
Horizontal RTL scroll. States: default · hover · selected · disabled.  
**Locked:** selected = `--accent` fill + `--accent-on`.

### Time slot grid
4 cols → 2 → 1. States: available · selected · unavailable. Same selected pattern as dates.

### Tabs
پیش رو · لغو شده · گذشته + optional count pill.  
**Locked:** active = accent soft bg + accent fg. Inactive = transparent + muted. Do not mix underline + fill.

### Appointment card
Header: date · time · status badge. Nested note well and cancel-reason well when present.

### Success summary
Centered card: lead message → meta rows → status badge → queue chip. No second primary CTA in the card.

### Plugin header
Title (inline-start) + one header action (end). Hairline divider. Same chrome on Book/Success; My bookings swaps action to primary “new booking”.

## 7. Embed / isolation

| Topic | Rule |
|-------|------|
| Isolation (v1) | CSS-scoped `.bf-root` |
| Optional hardening | Shadow DOM |
| Class prefix | `bf-*` |
| Theming | `--accent*` only |
| Leakage | No global element selectors; no host `*` resets |
| Touch | ≥ 44px for dates, slots, tabs, buttons |

## 8. Do / Don’t

### Do
- Scope everything under `.bf-root`
- Use status token pairs for badges
- Keep Persian copy and RTL layout
- Preserve nested wells on cancelled cards

### Don’t
- Don’t use black fills for selection
- Don’t invent status colors per screen
- Don’t style `html` / `body` from the plugin
- Don’t put two primary booking CTAs in one viewport
- Don’t use emoji as status icons

## 9. Screens in kit

| File | Screen |
|------|--------|
| `booking-screen.html` | A — Book |
| `booking-success.html` | B — Success |
| `my-appointments.html` | C — My bookings |
| `booking-form-specimen.html` | Component specimen |
| `index.html` | Launcher |
