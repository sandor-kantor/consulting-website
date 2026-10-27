# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static consulting website for PharmaBrAIn (www.pharmabrain.co.uk), a translational neuroscience practice. Hosted on GitHub Pages. No build tools, frameworks, or package manager — purely HTML5, CSS3, and vanilla JavaScript.

## Running Locally

```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

Or simply open `index.html` directly in a browser.

## Architecture

The site is built on the PharmaBrAIn design system (on claude.ai). Five files make it up:

- **index.html**: the single page. A sticky top bar, then the hero, about (with the stat row), the therapeutic areas band, services (six cards), the Somnolect card, case studies, publications, contact and the footer. The six service panels follow `</main>`. Links and scripts depend on the section IDs (`hero`, `about`, `therapeutic-areas`, `services`, `somnolect`, `case-studies`, `publications`, `contact`), the panel IDs (`modal-system-impl`, `modal-pharmaco-eeg`, `modal-data-analysis`, `modal-translational`, `modal-disease-models`, `modal-advisory`) and `main-content`.
- **css/tokens.css**: the design tokens as custom properties, the type classes and the `@font-face` rules. A copy from the design system: replace it with a new copy when the system changes, never edit it.
- **css/components.css**: the design system's `pb-` component classes, including the 768 px and 480 px breakpoints. Also a copy: replaced, never edited.
- **css/styles.css**: every site-specific rule and override:
  - a zero-specificity margin reset
  - the `.nowrap` helper
  - focus scrolling and the skip link offset
  - the therapeutic areas band above 768 px
  - smooth scrolling (only without reduced motion)
  - the print rules
- **js/main.js**: vanilla JS for three things:
  - **The phone menu:** it toggles, and closes on a link, an outside click, Escape (focus returns to the button) or widening past 768 px.
  - **The active section link:** an Intersection Observer over `section[id]`, triggered in the upper third of the viewport, sets `aria-current="true"`.
  - **The service panels.**

Stylesheets load in this order: tokens.css, components.css, styles.css. Fonts live in `assets/fonts/`, images in `assets/images/`.

## Key Patterns

- **Design system classes**: markup uses the `pb-` classes, with a type class beside them for the size: `display-xl`, `display`, `h2`, `h3`, `stat`, `lead`, `body`, `body-strong`, `label`, `small`, `caption`, `eyebrow`, `index`, `data`. For example: `<h2 class="display pb-head__title">`. `<body class="pb body">` applies the system.
- **Tokens only**: colours, spacing, radii, shadows and sizes come only from the custom properties in tokens.css. styles.css holds no hex colours and no pixel spacing.
- **Grounds**: paper (`pb-section`) and mist (`pb-section--mist`) sections.
  - Navy bands (`pb-inverse`) carry the hero, the therapeutic areas, and the contact band and footer, which share one ground.
  - Two navy bands never touch.
  - The Somnolect card is a navy card on paper.
- **Top bar**: `pb-topbar` is sticky and paper at every scroll position, with no transparent state.
  - At 768 px and below, the links move into a menu under `.pb-menu-button` (`.pb-nav.is-open`).
  - The section in view gets `aria-current="true"` on its link, which components.css colours.
- **Service cards and panels**:
  - **The card:** each card is one button, `<button class="pb-card service-learn-more" data-modal="…">`. It's named by its title (`aria-labelledby`) and described by its teaser (`aria-describedby`). main.js finds the cards by `.service-learn-more`.
  - **Opening:** a card opens its `.pb-overlay` panel. `hidden` is removed, the `is-opening` fade runs for 150 ms, body scroll locks, the close button takes focus, and Tab is trapped in the panel.
  - **Closing:** Escape, the close button or a click on the scrim closes it with the `is-closing` fade, and focus returns to the card.
  - **Reduced motion:** with reduced motion there's no fade.
- **No scroll animations**: content is visible as soon as the page loads. The panel fade is the only motion.
- **Print**: hides the top bar, skip link, panels, therapeutic areas band, contact, footer, the trace band and the white logo artwork. Grounds print white and text in `--text`. Cards don't split across pages, and external links print their address.

## Key Design Decisions

- No dependencies or build step: changes are visible on reload.
- css/tokens.css and css/components.css come from the PharmaBrAIn design system and are replaced, never edited. Site rules and overrides go in css/styles.css.
- Fonts: IBM Plex Sans and IBM Plex Mono, self-hosted from `assets/fonts/`: Latin-1 WOFF2 files, plus Plex Sans's small arrow files. No Google Fonts.
- Colours: the three blues of the logo (`--brand-navy`, `--brand-cyan`, `--brand-blue`) and cool neutrals, all as tokens. Cyan is never text on paper, and there's one primary button per view.
- Images:
  - **Logos** are SVG files, never retyped or recoloured.
  - **Data figures** (the hypnograms) keep their own colours and shape.
  - **Other pictures in panels** are cropped to 16:10:
    - the surgery photograph and the illustrations in panels 02 and 05 are navy duotones
    - the panel 04 illustration and the panel 06 lab photograph keep their original colours
  - **Never** a colour photograph of a procedure or of an animal with an implant.
  - **Somnolect's screenshots** are shown exactly as Somnolect publishes them: dark on the Somnolect card, light and framed (`pb-figure--framed`) in panel 03.
  - **Markup:** every `<img>` has a width, a height and alt text, empty only for decorative pictures. Everything below the hero has `loading="lazy"`.
- Copy:
  - sentence case for headings, buttons, labels and chips
  - no em dashes in visible text or alt text
  - British spelling
  - first person singular (never "we")
- Accessibility:
  - a skip link
  - a 2 px focus ring on every control, kept clear of the top bar
  - headings in order
  - panels as `aria-modal` dialogs with a focus trap
- Responsive: components.css sets the breakpoints:
  - **768 px:** two columns and the menu button
  - **480 px:** one column, phone type sizes, no hero logo
