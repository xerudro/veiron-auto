# Common CSS Files

This folder contains **reusable CSS modules** that are shared across multiple pages.

## 📁 Files:

### `variables.css` (76 lines)
**Global CSS Variables & Design System**
- Color palette (primary, secondary, text, background)
- Spacing and layout variables
- Shadow definitions
- Border radius standards
- Transition durations
- Base reset styles

**Used by:** ALL pages (loaded first)

---

### `footer-ro.css` (139 lines)
**Footer Styles (Romanian & English)**
- Footer layout and structure
- Logo, contact info, links columns
- Fiscal information section
- Responsive design for all screen sizes
- Works for both RO and EN pages

**Used by:** ALL pages with footer

---

### `privacy.css` (74 lines)
**Privacy Policy & Terms Pages Styling**
- Privacy content typography
- Heading hierarchy (h2, h3, h4)
- List and paragraph styling
- Content container layout

**Used by:**
- politica-de-confidentialitate.html
- privacy-policy.html
- termeni-si-conditii.html

---

## 💡 Benefits of This Structure:

✅ **Single Source of Truth** - Variables defined once, used everywhere
✅ **Easy Maintenance** - Update footer in one place
✅ **Reduced Duplication** - Footer & privacy styles not repeated in every file
✅ **Better Organization** - Clear separation of concerns
✅ **Smaller Files** - Page-specific CSS files are now cleaner

---

## 🔄 Before vs After:

**Before:**
- `contact-ro.css`: 473 lines (included footer + privacy)
- Footer styles duplicated across pages
- Variables duplicated in 6+ files

**After:**
- `contact-ro.css`: 304 lines (-36%)
- `common/footer-ro.css`: 139 lines (shared)
- `common/privacy.css`: 74 lines (shared)
- `common/variables.css`: 76 lines (shared)

**Total reduction:** ~200 lines of duplicate code removed!

---

## 📝 Usage Pattern:

```html
<!-- Correct order in HTML <head>: -->

<!-- 1. Global Variables (ALWAYS FIRST) -->
<link rel="stylesheet" href="assets/css/common/variables.css">

<!-- 2. Page Specific Styles -->
<link rel="stylesheet" href="assets/css/header.css">
<link rel="stylesheet" href="assets/css/contact-ro.css">

<!-- 3. Common Modules (as needed) -->
<link rel="stylesheet" href="assets/css/common/footer-ro.css">
<link rel="stylesheet" href="assets/css/common/privacy.css">

<!-- 4. External Libraries (LAST) -->
<link rel="stylesheet" href="https://...font-awesome.css">
```

---

Last updated: 2025-11-17
