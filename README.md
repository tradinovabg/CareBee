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

## Features

- Home page with "CareBee" title and an SOS button.
- `/sos` page containing a form with name, e-mail, and message fields.
- `sendSOS` reads your geolocation and tries the Web Share API. If sharing is
  unavailable, it opens an e-mail draft and copies the message to the clipboard.
  If location access is denied, the message is sent without coordinates.

## Notes on Geolocation and Sharing

The SOS feature relies on browser APIs that work only in secure contexts. When
deployed on GitHub Pages the site is served over HTTPS, but desktop browsers may
block `navigator.share` or clipboard access. In those cases the app falls back
to creating a `mailto:` link with the prepared SOS message.

## Deployment

The application is deployed via GitHub Pages at https://tradinovabg.github.io/CareBee/

