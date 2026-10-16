# Vynx APK Builder

Project starter for a Vercel-hosted web UI + separate Android build worker.

## Architecture
- `web/`: static HTML/CSS/JS frontend, deployable to Vercel.
- `worker/`: Dockerized Node.js API + Android SDK/Gradle build environment. Deploy this on a VPS/container host, not as a normal Vercel Function. APK compilation needs Android SDK, Java, Gradle, and a writable workspace.
- Frontend sends source ZIP or website URL plus app settings and icon to the worker. Worker builds a WebView APK and returns it for download.

## Deploy
1. Deploy `web/` to Vercel (set Root Directory to `web`, or deploy this repo with the included `vercel.json`).
2. Deploy `worker/` on a Docker-capable VPS/container platform. Build image with `docker build -t vynx-apk-worker worker/`, then run:
   `docker run -p 8080:8080 -e BUILD_API_KEY='replace-with-long-random-secret' -v vynx-work:/tmp/vynx-build vynx-apk-worker`
3. In Vercel project settings, set `VITE_BUILD_API_URL` to the worker URL and `VITE_BUILD_API_KEY` to the same secret. Because this is a static HTML project, edit `web/config.js` and set `BUILD_API_URL` and `BUILD_API_KEY` before deploying. **Important:** a secret embedded in browser JavaScript is not private. For a public production service, add authenticated server-side job creation, rate limits, quotas, and a private queue; do not expose a shared build key in the browser.
4. Worker CORS allows requests by default for easier testing. Restrict `ALLOWED_ORIGIN` to your Vercel domain for production.
5. Test with a small trusted HTML ZIP and install the resulting APK on a test Android device.

## Input behavior
- ZIP upload: must contain `index.html` at root or in a single top-level folder. HTML/CSS/JS/assets are bundled into Android assets.
- HTML upload: single HTML file.
- URL: worker downloads the page and packages it as a remote WebView URL. This requires the website to permit WebView access and remain online.
- Icon: PNG recommended, square, ideally 512x512. The worker converts it to Android launcher icon assets.
- Output: unsigned debug APK for testing. For distribution, configure a private signing keystore on the worker and never upload/store signing credentials in the browser.

## SDK settings
Default minimum SDK 23 (Android 6.0), target SDK 36 (Android 16). The target API 36 default reflects Google Play's requirement for new apps and updates from August 31, 2026. Device installation can differ by Android version and app behavior.

## Security
This starter is intended for controlled use. Before public deployment, implement authentication, upload size limits, job isolation, URL allowlists/SSRF protection, cleanup, per-IP quotas, malware scanning, and a private queue. Do not allow arbitrary URL fetches on an exposed worker without SSRF protections. Do not use this as a public multi-tenant build service until hardened.
