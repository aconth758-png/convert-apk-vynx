# Vynx APK Builder — GitHub Actions variant

## What this package does
- `web/`: static blue-themed Vercel frontend.
- `worker/template/`: Android WebView template.
- `.github/workflows/build-apk.yml`: manual GitHub Actions workflow that compiles a debug APK from the committed template and can optionally wrap a public HTTPS URL.
- This is a starter workflow, not yet an end-to-end public multi-user build service. The current web form does not securely upload arbitrary ZIP/HTML to GitHub Actions or poll a workflow result. Do not expose a GitHub token in browser JavaScript.

## Deploy frontend to Vercel
1. Push the extracted folder to a GitHub repository.
2. In Vercel, import that repository.
3. Set Root Directory to `web`, Framework Preset `Other`, and leave Build Command empty.
4. Deploy. The static UI will be available, but its Build button must not be treated as connected to GitHub Actions yet.

## Test the GitHub Actions workflow
1. In the repository, open Actions.
2. Select `Build Vynx APK`, click `Run workflow`.
3. Enter app name/package/SDK/version and optionally a public HTTPS website URL.
4. After success, open the workflow run and download the `vynx-apk-*` artifact.
5. The artifact contains a debug APK (and SHA256SUMS.txt). It is for testing, not Play Store release.

## Important limitations
- This manual workflow builds from the committed Android template. It does NOT currently accept an uploaded ZIP or HTML from the Vercel form.
- For URL wrapping, the URL is loaded in WebView at runtime and must remain online. Public URL input is still a security concern; a production workflow should allowlist domains and use a backend to validate submissions.
- For arbitrary ZIP/HTML uploads, implement a secure job submission service or GitHub App/backend. Never put a personal access token in `web/config.js`; browser JavaScript is public.
- Artifact downloads require repository access/authentication. Public anonymous downloads require separate, deliberate publishing/storage design and security controls.
- GitHub-hosted runners and artifact retention/usage depend on the GitHub plan and repository settings.
- Debug APKs are not signed with a production release key. For release distribution, securely configure signing in repository Actions secrets and create a signed release build.
- `targetSdk 36` requires the installed Android SDK platform 36; this workflow installs it. Verify Google Play policy and plugin compatibility before publishing.
- The source template has no Gradle wrapper, so workflow installs Gradle 8.9. The Android Gradle Plugin 8.7.3 supports Gradle 8.9 and JDK 17.
