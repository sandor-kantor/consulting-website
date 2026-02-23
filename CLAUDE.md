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

Three core files make up the entire site:

- **index.html** — Single-page layout with fixed navbar, hero, about, therapeutic areas banner, services (6-card grid), case studies, publications, contact, and footer. Each service card opens a detail modal via `data-modal` attributes.
- **css/styles.css** — All styling including responsive breakpoints at 768px and 480px, print styles, modal animations, and scroll-triggered fade-ins.
- **js/main.js** — Vanilla JS handling:
  - Mobile hamburger menu toggle with outside-click dismissal
  - Navbar transparent-to-white transition on scroll (via requestAnimationFrame, threshold 50px)
  - Active nav link highlighting via Intersection Observer (rootMargin clips to upper third of viewport)
  - Staggered scroll fade-in animations for `.animate-on-scroll` elements
  - Modal open/close system with Escape key support, focus management, and close animation

Assets live in `assets/images/`.

## Key Patterns

- **Navbar dual-state**: The navbar starts transparent over the dark hero and transitions to white on scroll (`navbar-scrolled` class). Nav link colors, logo icon filter, and hamburger colors all switch accordingly via `.navbar:not(.navbar-scrolled)` selectors.
- **Service modals**: Each service card has a `data-modal` attribute pointing to a modal overlay `id`. Modals use `hidden` attribute toggling, body scroll lock, and a 200ms closing animation. Focus returns to the triggering button on close.
- **Section alternating backgrounds**: Sections alternate between `#ffffff` and `#f7f9fc`, with the therapeutic areas banner using the dark navy `#1a3f6e`.

## Key Design Decisions

- No dependencies or build step — changes are immediately visible on reload
- Google Fonts (Inter for headings/UI, Open Sans for body) loaded via CDN
- Color palette: primary blue `#3871e0`, dark navy `#1a3f6e`, accent cyan `#64c2e4`, light gray `#f7f9fc`
- Accessibility: skip-to-content link, ARIA labels on all modals/buttons, focus-visible styles
- Mobile-first responsive design with hamburger navigation
- Print stylesheet hides nav/footer/contact, flattens grids, and appends URLs to links
