# آلة أسعار البيض - Mobile App Design

## Design Principles
- **Portrait Orientation (9:16)**: All screens optimized for mobile portrait layout
- **One-Handed Usage**: Thumb-reachable controls, minimal scrolling
- **RTL Support**: Full Arabic interface with proper text direction
- **Cashier-Friendly**: Large buttons, clear visual hierarchy, fast interactions
- **No Scroll**: Main screen fits entirely within viewport without vertical scrolling

## Screen List

### 1. Home Screen (Main Calculator)
**Purpose**: Primary screen for egg price calculations and transactions

**Primary Content & Layout**:
- **Header**: App title "آلة أسعار البيض" with settings icon (top-right)
- **Product Selection Cards** (3 cards, horizontal layout):
  - Each card displays: egg image + product name
  - Cards: Red Egg | White Egg | Local Egg
  - Selected card highlighted with border/background color
  - Compact size to fit without scrolling
- **Input Section**:
  - "عدد البيض" (Egg Count) field - displays current number
  - Visual indicator showing which field is active
- **Results Display**:
  - "سعر الكرتونة" (Carton Price): Shows selected product's carton price
  - "سعر البيضة" (Egg Price): Calculated per-egg price (2 decimal places)
  - **"الإجمالي" (Total)**: Large, prominent, bold text with strong color
- **Keypad Section**:
  - 10 number buttons (0-9) arranged in grid, wide layout
  - AC button only (no C or Backspace buttons)
  - Buttons fill horizontal space
- **Payment Section**:
  - "المبلغ المدفوع" (Amount Paid) field
  - Visual indicator for active input field
  - **"الباقي" (Change)**: Large, prominent display
  - Shows change amount or "المتبقي على العميل" (Amount Due) if underpaid

**Key User Flows**:
1. Select product → All fields reset (egg count, total, paid, change)
2. Enter egg count via keypad → Total auto-calculates
3. Enter amount paid → Change auto-calculates
4. Press AC → All fields reset except product selection

### 2. Settings Screen
**Purpose**: Configure prices, currency, and theme preferences

**Primary Content & Layout**:
- **Price Settings Section**:
  - "سعر كرتونة البيض الأحمر" (Red Egg Carton Price) - input field
  - "سعر كرتونة البيض الأبيض" (White Egg Carton Price) - input field
  - "سعر كرتونة البيض البلدي" (Local Egg Carton Price) - input field
- **Currency Settings**:
  - "اسم العملة" (Currency Name) - text input, default: "جنيه مصري"
- **Theme Settings**:
  - "الثيم" (Theme) - selector with 3 options:
    - فاتح (Light)
    - داكن (Dark)
    - تلقائي حسب النظام (System)
- **Action Buttons**:
  - "حفظ" (Save) - saves all settings to local storage
  - "استعادة القيم الافتراضية" (Restore Defaults) - resets prices to 90/99/150

## Color Scheme & Theming

### Light Theme
- **Background**: White (#FFFFFF)
- **Surface**: Light Gray (#F5F5F5)
- **Foreground/Text**: Dark Gray (#11181C)
- **Muted Text**: Medium Gray (#687076)
- **Border**: Light Gray (#E5E7EB)
- **Primary/Accent**: Teal (#0a7ea4)
- **Red Egg Indicator**: Vibrant Red (#DC2626)
- **White Egg Indicator**: Light Blue (#3B82F6)
- **Local Egg Indicator**: Warm Beige (#D97706)
- **Total Display**: Strong Teal (#0a7ea4) - bold, large font
- **Keypad Buttons**: Light Gray background, dark text

### Dark Theme
- **Background**: Very Dark Gray (#151718)
- **Surface**: Dark Gray (#1E2022)
- **Foreground/Text**: Light Gray (#ECEDEE)
- **Muted Text**: Medium Gray (#9BA1A6)
- **Border**: Dark Slate (#334155)
- **Primary/Accent**: Teal (#0a7ea4)
- **Red Egg Indicator**: Bright Red (#EF4444)
- **White Egg Indicator**: Light Blue (#60A5FA)
- **Local Egg Indicator**: Warm Orange (#F59E0B)
- **Total Display**: Bright Teal (#0a7ea4) - bold, large font
- **Keypad Buttons**: Dark Gray background, light text

## Product Images
- **Red Egg**: Red-colored egg icon/image
- **White Egg**: White-colored egg icon/image
- **Local Egg**: Beige/Cream-colored egg icon (matching reference image provided)

## Typography & Text Styling
- **App Title**: Large, bold (24-28px)
- **Section Headers**: Medium, bold (16-18px)
- **Field Labels**: Small, regular (12-14px)
- **Input Values**: Medium, regular (16-18px)
- **Total Amount**: Extra Large, bold (32-40px) - most prominent
- **Keypad Buttons**: Medium, bold (18-20px)
- **Change Amount**: Large, bold (24-28px)

## Interaction Patterns
- **Product Card Selection**: Tap to select → immediate visual feedback (highlight) → all calculation fields reset
- **Keypad Input**: Tap number → appends to current field value (not replace)
- **Field Focus**: Visual indicator (border highlight) shows which field receives keypad input
- **AC Button**: Resets all calculation fields, keeps product selection and settings
- **Settings Save**: Persists to local storage, applies immediately

## Responsive Considerations
- **Compact Layout**: All elements fit in portrait viewport (9:16) without scrolling
- **Touch Targets**: Minimum 44px height for buttons (accessibility)
- **Text Scaling**: Adjusts based on device font size settings
- **Safe Area**: Respects notch and home indicator areas

## Data Persistence
- **Local Storage**: AsyncStorage for prices, currency name, theme preference
- **Default Values**: 
  - Red: 90
  - White: 99
  - Local: 150
  - Currency: "جنيه مصري"
  - Theme: "System"
- **Auto-Save**: Settings saved immediately when user taps "Save"
