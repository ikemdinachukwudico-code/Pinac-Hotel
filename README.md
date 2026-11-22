# Pinec Hotel Website

This is a static HTML/CSS/JavaScript website. The homepage is `index.html` and is located in the repository root.

## Project structure

- `index.html` — homepage / entry page
- `about.html`, `rooms.html`, `restaurant.html`, `facilities.html`, `events.html`, `gallery.html`, `contact.html`, `book.html` — other pages
- `css/style.css` — site styling
- `js/` — site JavaScript
- `images/` — website images

## Deploy from GitHub

Upload the **contents of this ZIP**, not the ZIP file itself, into the root of your GitHub repository. Keep the folder structure exactly as shown above. In particular, do not put `index.html` inside another folder.

For a static-site host, choose the project/repository root as the site root. The entry file is `index.html`. No build command is needed for this plain HTML site unless the hosting provider specifically requires one.

## Booking and payment setup

The website currently contains placeholder Firebase configuration and a placeholder Paystack test key. Booking therefore runs in demo mode until you configure your own Firebase web-app settings and Paystack public key. Do not put secret keys in frontend JavaScript. Before accepting real payments or storing real guest information, configure secure server-side payment verification and appropriate Firebase security rules.

## Local preview

Open `index.html` in a browser, or run `python -m http.server 8000` from this folder and visit `http://localhost:8000`.
