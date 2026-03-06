# Project TODO - آلة أسعار البيض

## Core Features
- [x] Home screen layout with product cards (Red, White, Local eggs)
- [x] Product selection with visual highlighting
- [x] Reset all fields when product card is tapped
- [x] Egg count input field with keypad integration
- [x] Amount paid input field with keypad integration
- [x] Keypad with 0-9 buttons (no C or Backspace, AC only)
- [x] AC button to reset all calculation fields
- [x] Total calculation (egg count × price per egg)
- [x] Change calculation (amount paid - total)
- [x] Settings screen with price inputs
- [x] Currency name customization
- [x] Save settings functionality
- [x] Restore default prices button

## Theme Support
- [x] Light theme implementation
- [x] Dark theme implementation
- [x] System theme detection
- [x] Theme selector in settings (Light/Dark/System)
- [x] Theme persistence to local storage
- [x] Apply theme colors to all UI elements
- [x] Ensure total display is prominent in both themes
- [x] Ensure product indicators are clear in both themes

## UI/UX Improvements
- [x] No scroll on main screen - all elements fit in viewport
- [x] Compact product cards
- [x] Reduced vertical spacing
- [x] Wide keypad layout filling screen width
- [x] Large, prominent total display (32-40px font)
- [x] Strong color for total (not faded)
- [x] Clear visual indicator for active input field
- [x] RTL layout for Arabic text

## Numeric Input Fixes
- [x] Fix egg count field to append digits (not replace)
- [x] Fix amount paid field to append digits (not replace)
- [x] Support multiple digit entry in both fields
- [x] Validate input (no negative numbers for prices/amounts)
- [x] Allow 0 for egg count
- [x] Set practical maximum (9999) for egg count

## Data Persistence
- [x] Save prices to AsyncStorage
- [x] Save currency name to AsyncStorage
- [x] Save theme preference to AsyncStorage
- [x] Load saved prices on app start
- [x] Load saved currency on app start
- [x] Load saved theme on app start
- [x] Use default values if no saved data exists

## Images & Branding
- [x] Generate app logo (egg + calculator design)
- [x] Create red egg image
- [x] Create white egg image
- [x] Create local egg image (beige/cream color)
- [x] Update app.config.ts with app name and logo URL
- [x] Set up icon files (icon.png, splash-icon.png, favicon.png, android icons)

## Testing & Verification
- [x] Test product selection and field reset
- [x] Test numeric input appending in both fields
- [x] Test total calculation accuracy
- [x] Test change calculation
- [x] Test AC button functionality
- [x] Test theme switching (Light/Dark/System)
- [x] Test settings persistence
- [x] Test default prices on first launch
- [x] Verify no scroll on main screen
- [x] Verify RTL layout works correctly
- [x] Test on multiple screen sizes

## Final Delivery
- [ ] Create checkpoint
- [x] Verify all features working
- [ ] Prepare for publication
