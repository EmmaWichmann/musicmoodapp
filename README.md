# Music Mood App

Music Mood App is a small front end project for organizing songs into mood based collections through an interactive browser interface.

## Overview

The project explores organizing music around emotional context rather than only artist or genre. Users enter song information and assign it to a mood, building a personal library over time. It also includes tools for picking music for a situation, planning a short sequence of moods between two feelings, and checking in on whether a song helped.

## Features

- Adding song titles, artists, and an optional note
- Selecting a mood from a fixed set of twelve moods
- Rendering each saved song as a card, with filtering the library by mood
- Deleting songs
- Form validation requiring a title and artist before saving
- A visual map of the saved library on an energy/valence plane
- Context Mode: pick a situation (studying, commuting, exercise, etc.) for a suggested mood and time budget
- Journey Builder: pick a starting and ending mood for a short, explained sequence between them
- Reflection Cards: a short check-in after listening on whether it helped
- A patterns dashboard summarizing saved songs, journeys, and reflections
- Light/dark theme toggle, remembered between visits
- Local storage for songs, journeys, reflections, and theme preference
- Responsive layout down to mobile widths

Editing a saved song isn't supported — only adding and deleting.

## Built With

- HTML — the tabbed app shell and song entry form
- CSS — theme variables, layout, and responsive breakpoints
- JavaScript (ES modules, no framework) — forms, tab switching, mood logic, local storage
- GitHub Pages — hosts the live app

## How It Works

The song form collects a title, artist, and optional note. On submit, JavaScript builds a song card, adds it to the library, and saves it to local storage, so songs remain after a refresh. A mood chip sets the mood for new songs and filters the library. Context Mode and Journey Builder work from a small mood taxonomy — each mood has an energy and valence value — to suggest moods and build a short, explained path between a starting and ending feeling, entirely in the browser. Reflection Cards and the patterns dashboard read back from what's already saved. There's no embedded playback or links to external songs; entries only store what's typed into the form.

## Local Setup

```bash
git clone https://github.com/EmmaWichmann/musicmoodapp.git
cd musicmoodapp
npm install
npm run dev
```

ES modules must be served over HTTP, not opened directly as a file — `npm run dev` starts a local server at http://localhost:5500.

Live project:
https://emmawichmann.github.io/musicmoodapp/

Source:
https://github.com/EmmaWichmann/musicmoodapp

## Current Limitations

- No account system, cloud sync, or database backend
- Songs, journeys, and reflections disappear if local storage is cleared or a different browser/device is used
- Songs can't be edited after saving, only deleted
- No embedded audio playback or links to the actual songs
- Form validation only checks that a title and artist are present

## What This Project Demonstrates

- HTML, CSS, and JavaScript
- DOM manipulation
- Event handling
- Form validation
- Client side data organization
- Responsive interface design
- Building around a psychology informed product idea
- AI assisted development, with human review and testing
