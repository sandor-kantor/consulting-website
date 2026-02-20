# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static consulting website for a translational neuroscience practice. No build tools, frameworks, or package manager — purely HTML5, CSS3, and vanilla JavaScript.

## Running Locally

```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

Or simply open `index.html` directly in a browser.

## Architecture

Three core files make up the entire site:

- **index.html** — Single-page layout with fixed navbar, sections for services (6-card grid), publications, and contact info
- **css/styles.css** — All styling including responsive breakpoints at 768px and 480px, print styles, and animations
- **js/main.js** — Vanilla JS handling: mobile hamburger menu toggle, navbar scroll shadow (via requestAnimationFrame), active nav link highlighting (via Intersection Observer, threshold 0.3), and scroll-triggered fade-in animations for `.animate-on-scroll` elements

Assets live in `assets/` (favicon.svg, images/profile.jpg).

## Key Design Decisions

- No dependencies or build step — changes are immediately visible on reload
- Google Fonts (Inter, Open Sans) loaded via CDN in the HTML head
- Color palette: primary blue #1a73e8, dark navy #0a2540, light gray #f8f9fa
- Accessibility: skip-to-content link, ARIA labels, focus-visible styles
- Mobile-first responsive design with hamburger navigation
