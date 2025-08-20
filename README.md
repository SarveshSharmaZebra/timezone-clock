# Multi‑Time Zone Digital Clock

A lightweight web app that shows the current time across multiple time zones with add/remove zones and a 12/24‑hour toggle. Built with vanilla HTML/CSS/JS, deployable on GitHub Pages.

## Features
- Add any IANA time zone (e.g., `Europe/Paris`, `America/Phoenix`)
- Remove zones
- 12/24‑hour toggle (persists in LocalStorage)
- Shows date and numeric UTC offset (e.g., `GMT+05:30`)
- No dependencies

## Localless deploy on GitHub

1. Create a new repository (public is fine), e.g., `timezone-clock`.
2. Add these files to the repo root: `index.html`, `styles.css`, `script.js`, `.nojekyll`, and `.github/workflows/pages.yml`.
   - In the GitHub UI: Add file → Create new file (repeat per file), or Upload files.
3. Commit to the `main` branch.
4. In the repo: Actions → ensure “Deploy static site to GitHub Pages” workflow runs and succeeds.
5. Your site will be available at:
   - `https://<your-username>.github.io/timezone-clock/`
   - For your account: `https://SarveshSharmaZebra.github.io/timezone-clock/` (once created).

If Actions are disabled for your org, enable them in Settings → Actions.

### Custom domain (optional)
- Settings → Pages → Custom domain → enter your domain.
- Add a `CNAME` DNS record pointing to `<your-username>.github.io`.
- Create a `CNAME` file in the repo root with your domain name inside.

## Development
Just open `index.html` in a browser; everything is client-side.

## License
You may use, modify, and deploy this project. If you need an explicit license, add MIT."# timezone-clock" 
