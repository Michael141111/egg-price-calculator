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

## Enhancement: Improved Default Values Management
- [x] Add separate "Set as Default" button for each price field
- [x] Show current default values clearly in settings
- [x] Add confirmation dialog when restoring defaults
- [x] Display visual indicator for fields that differ from defaults

## New Feature Requests
- [x] Add "Save Current Prices as Defaults" button in settings
- [x] Store custom default prices separately from current prices
- [x] Auto-focus on egg count field when product card is selected
- [x] Enable keypad input immediately after product selection

## Bug Fixes
- [x] Fix: Save current prices before saving as defaults
- [x] Fix: AC button should only clear focused field, not all fields
- [x] Fix: Restore focus after AC clears the field

## Responsive Layout Issues
- [x] Fix: Home screen layout must fit all screen sizes without cutoff
- [x] Fix: Support different font size settings (accessibility)
- [x] Fix: Adapt to different screen aspect ratios and DPI settings
- [x] Fix: Use flexible layout that scales with content

## New Feature: Calculate Eggs from Amount
- [x] Add toggle/checkbox to switch between two calculation modes
- [x] Mode 1 (default): Input egg count, calculate total and change
- [x] Mode 2 (new): Input amount customer wants to spend, calculate egg count and remainder
- [x] Update calculator context to handle both modes
- [x] Update home screen UI to show/hide fields based on mode
- [x] Test calculations for accuracy

## Bug Fix: Auto-focus in byAmount Mode
- [x] When byAmount mode is active and product card is selected, auto-focus should go to amountPaid field (not eggCount)

## New Feature: Multi-Product Selection
- [x] Add support for selecting multiple products in one transaction
- [x] Create cart/order structure to store multiple products with quantities
- [x] Add "Add Product" button below product cards
- [x] Display selected products list with quantities and individual prices
- [x] Calculate and display total for all products
- [x] Shrink keypad to make room for product details display
- [x] Add "Clear All" button to reset entire screen
- [x] Position "Clear All" button in appropriate location
- [x] Update calculator context to handle multiple products
- [x] Test multi-product calculations

## Bug Fix: Multi-Product Cart UI
- [x] Keep keypad and input fields visible at all times
- [x] Display cart items in a persistent section (not replacing keypad)
- [x] Clear input fields when "Add Product" is pressed, but keep cart visible
- [x] Update cart total and count after each addition
- [x] Show cart item count badge in header that updates dynamically

## Bug Fix: Cart Badge Toggle
- [x] Make cart badge button toggle cart visibility (show/hide cart items)
- [x] Remove separate cart visibility toggle
- [x] Cart badge shows item count and acts as toggle button
