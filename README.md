# CareBee

A simple web application built with [Vite](https://vitejs.dev/) and [React](https://react.dev/).

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Localization

Translations live in the `src/locales` directory. Each language has its own
JSON file (e.g. `en.json`). To extend translations with new meal labels or
other strings:

1. Add the keys and values to every locale JSON file.
2. If you introduce new meal types, also update `src/locale/mealLabel.js` so
   components can reference the new translation keys.

## Live

- App: https://tradinovabg.github.io/CareBee/
- Short link: https://tinyurl.com/carebee24

## Features

- Home page with "CareBee" title and an SOS button.
- `/sos` page containing a form with name, e-mail, and message fields.
- `sendSOS` reads your geolocation and tries the Web Share API. If sharing is
  unavailable, it opens an e-mail draft and copies the message to the clipboard.
  If location access is denied, the message is sent without coordinates.


## Medication Scheduler

- **Auto-send setup** – configure a contact once and the app can automatically
  send your schedule when you trigger the SOS action.
- **Scheduling modes** – add medicines as one-off doses or recurring daily
  courses with custom start/end dates and times.
- **Calendar page** – review upcoming doses in day, week, or month views.
- **Editing entries** – update or remove existing items directly from the
  schedule.
- **Google Calendar/.ics exports** – download iCalendar files or import events
  to Google Calendar with a tap.

## Nearby

Search for pharmacies or medical specialists near a location. Uses OpenStreetMap Overpass API for places and Nominatim for address geocoding. The 3237 banner links to the official on-call pharmacy service in France. You can also import FINESS CSV files in the browser to search registered facilities. Be mindful of request throttling; results may be cached client-side.

## Notes on Geolocation and Sharing

The SOS feature relies on browser APIs that work only in secure contexts. When
deployed on GitHub Pages the site is served over HTTPS, but desktop browsers may
block `navigator.share` or clipboard access. In those cases the app falls back
to creating a `mailto:` link with the prepared SOS message.

## Deployment

The application is deployed via GitHub Pages at https://tradinovabg.github.io/CareBee/

