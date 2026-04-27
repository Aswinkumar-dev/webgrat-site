# Webgrat — Deployment Guide

This document is the single source of truth for getting **www.webgrat.com**
live with:

- Frontend (Vite + React) on **Hostinger** shared hosting (`public_html/`)
- Backend (Spring Boot 3.5 / Java 17) on **Render** free tier (Docker)
- Domain **webgrat.com** managed at Hostinger
- A GitHub Actions cron that keeps the Render free instance awake

> **Read once, top to bottom, before clicking anything.** The order matters:
> the backend must be live first so we know its URL, which the frontend then
> bakes into its bundle at build time.

---

## 0 · Architecture at a glance

```
              ┌────────────────────────────┐
   browser ──►│  www.webgrat.com           │  Hostinger /public_html/
              │  (static dist/ from Vite)  │  HTTPS via Let's Encrypt
              └─────────────┬──────────────┘
                            │ fetch(VITE_API_BASE_URL)
                            ▼
              ┌────────────────────────────┐
              │  api.webgrat.com           │  Render Web Service (Docker)
              │  Spring Boot fat-jar       │  PORT injected by Render
              └─────────────┬──────────────┘
                            │ JDBC (Session Pooler)
                            ▼
              ┌────────────────────────────┐
              │  Supabase Postgres + Auth  │
              └────────────────────────────┘
```

---

## 1 · Rotate the secrets you accidentally pushed

Your old `application.properties` had the **Supabase DB password and
project username hard-coded** and that file is now in your public-ish
GitHub history. Treat them as compromised:

1. Supabase → **Project Settings → Database → Reset database password**.
   Save the new password somewhere safe — you'll paste it into Render
   as `SPRING_DATASOURCE_PASSWORD`.
2. Supabase → **Project Settings → API**. Note the new
   `service_role` key only if you ever rotate it; the `anon` key is
   fine to keep.
3. Resend → **API Keys** → revoke the old key, create a new one.

The new `application.properties` no longer holds any of these values
directly — they are all `${ENV_VAR}` placeholders now.

---

## 2 · Backend → Render (Docker)

### 2.1 What changed in your repo

- `backend/webgrat-agency-project/Dockerfile` — multi-stage Maven 3.9 +
  JDK 17 build, ships a tiny JRE-Alpine runtime. Honours Render's
  injected `$PORT`.
- `backend/webgrat-agency-project/.dockerignore` — keeps the image
  slim and prevents `application-local.properties` (your local secrets)
  from ever ending up in the image.
- `backend/webgrat-agency-project/src/main/resources/application.properties`
  — every secret is now `${ENV_VAR}`. Defaults are dev-friendly only.
- `backend/webgrat-agency-project/src/main/resources/application-local.properties.example`
  — copy to `application-local.properties` (gitignored) for local dev.

### 2.2 Create the Render service

1. Sign in at <https://render.com> (use your GitHub login so Render can
   read your repo).
2. **New + → Web Service → Build and deploy from a Git repository**.
3. Pick **`Aswinkumar-dev/webgrat-site`** (the repo in your screenshot).
4. Fill the form exactly as below:

   | Field            | Value                                                     |
   |------------------|-----------------------------------------------------------|
   | Name             | `webgrat-backend` (or anything — you'll get `<name>.onrender.com`) |
   | Language         | **Docker**                                                |
   | Branch           | `main`                                                    |
   | Region           | Singapore (closest to your users in IN/SEA)               |
   | Root Directory   | `backend/webgrat-agency-project`                          |
   | Dockerfile Path  | `Dockerfile` *(relative to the Root Directory above)*     |
   | Instance Type    | **Free**                                                  |

   > Why both "Root Directory" and "Dockerfile Path"? Render runs `docker
   > build` with the Root Directory as the build context, then looks for
   > the Dockerfile inside it. Setting Root Directory means Render only
   > redeploys when files under `backend/` change.

5. Scroll to **Environment Variables** and click **Add Environment
   Variable** for each row below.

   | Key                            | Example value                                                                     |
   |--------------------------------|-----------------------------------------------------------------------------------|
   | `SPRING_DATASOURCE_URL`        | `jdbc:postgresql://aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres`        |
   | `SPRING_DATASOURCE_USERNAME`   | `postgres.fpvppqqmkpiihqssytfe`                                                   |
   | `SPRING_DATASOURCE_PASSWORD`   | *the **new** password you just rotated in Supabase*                               |
   | `SUPABASE_URL`                 | `https://fpvppqqmkpiihqssytfe.supabase.co`                                        |
   | `SUPABASE_ANON_KEY`            | *anon public key from Supabase → Settings → API*                                  |
   | `SUPABASE_SERVICE_ROLE_KEY`    | *service_role secret from the same page*                                          |
   | `SUPABASE_STORAGE_BUCKET`      | `blog-thumbnails` *(only set if your bucket name differs)*                        |
   | `RESEND_API_KEY`               | `re_…` *the new key you generated*                                                |
   | `ALLOWED_ORIGINS`              | `https://webgrat.com,https://www.webgrat.com`                                     |
   | `FRONTEND_URL`                 | `https://www.webgrat.com`                                                         |
   | `EMAIL_FROM`                   | `Webgrat <hello@webgrat.com>`                                                     |
   | `EMAIL_ADMIN`                  | `webgrat.com@gmail.com`                                                           |
   | `THYMELEAF_CACHE`              | `true`                                                                            |

   Render will **not** show the values back to you after saving — that
   is intentional, treat them as secrets.

   > **Do NOT set `PORT`.** Render injects it for you and Spring Boot
   > picks it up via `server.port=${PORT:8080}`.

6. Open **Advanced** and set:

   | Field             | Value                  |
   |-------------------|------------------------|
   | Health Check Path | `/api/blogs/health`    |

   This is the cheap public endpoint already in your `BlogController`.
   It returns `200 ok` without touching the DB, so Render can probe it
   safely during cold starts.

7. Click **Create Web Service**. The first build takes ~5–7 minutes
   (Maven downloads, Docker build, JVM cold start). Watch the
   **Logs** tab — you want to see the Spring banner followed by
   `Started WebgratAgencyProjectApplication in N seconds`.

8. Copy the public URL Render gives you, e.g.
   `https://webgrat-backend.onrender.com`. Test it:

   ```bash
   curl https://webgrat-backend.onrender.com/api/blogs/health
   # → ok
   ```

### 2.3 (Recommended) Custom domain `api.webgrat.com`

Putting the API on `api.webgrat.com` makes the frontend code, the
allowed-origins list and your future debugging much nicer.

1. Render → your service → **Settings → Custom Domains → Add Custom
   Domain** → enter `api.webgrat.com`. Render shows a CNAME target
   (something like `webgrat-backend.onrender.com`).
2. Hostinger → **Domains → webgrat.com → DNS / Name Servers → Manage
   DNS records → Add new record**:
   - Type: `CNAME`
   - Name: `api`
   - Target / Points to: *the Render CNAME value*
   - TTL: 14400 (default)
3. Wait 5–30 min, hit **Verify** on Render. Once green, Render
   provisions a free TLS certificate automatically.
4. Update Render env vars:
   - `ALLOWED_ORIGINS` → no change (still
     `https://webgrat.com,https://www.webgrat.com` — these are the
     **frontend** origins, not the API host)
5. The frontend will use `VITE_API_BASE_URL=https://api.webgrat.com`
   (see §3 below).

If you'd rather skip the custom domain, just use the
`https://webgrat-backend.onrender.com` URL directly in
`VITE_API_BASE_URL` — everything else still works.

---

## 3 · Frontend → Hostinger (`public_html/`)

Hostinger shared hosting serves static files out of `public_html/`.
There is **no Node runtime, no env-var injection at request time** —
that is why Vite env vars must be present **on your machine when you
run `npm run build`**, so they get baked into the JS bundle.

### 3.1 Create `frontend/.env.production`

In your local `frontend/` folder create a file called **`.env.production`**
(it is gitignored, so it never leaves your laptop):

```
VITE_SUPABASE_URL=https://fpvppqqmkpiihqssytfe.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
VITE_API_BASE_URL=https://api.webgrat.com
```

> If you skipped the custom domain in §2.3, set
> `VITE_API_BASE_URL=https://webgrat-backend.onrender.com` instead.

### 3.2 Build the production bundle

From `frontend/`:

```powershell
npm install            # only the first time
npm run build          # produces frontend/dist/
```

You should now have a `frontend/dist/` folder with `index.html`,
`assets/`, `.htaccess`, `manifest.json`, `robots.txt`, etc. The
`.htaccess` (already in `frontend/public/.htaccess`) is what makes
React Router routes like `/blog/foo` work on Apache by falling back
to `index.html`.

> **Sanity check before uploading**: open
> `frontend/dist/assets/*.js` in a text editor, search for
> `webgrat-backend.onrender.com` (or `api.webgrat.com`). If you find
> it, the bundle is wired correctly. If you find `localhost:8080`,
> your `.env.production` was wrong — fix and rebuild.

### 3.3 Upload to Hostinger

You're already on the File Manager screen from your screenshot.

1. Open `public_html/` (the highlighted folder).
2. Delete any default Hostinger placeholder files inside it
   (`default.php`, etc). Leave the `DO_NOT_UPLOAD_HERE` file outside
   `public_html/` exactly where it is.
3. **Select all files inside `frontend/dist/` on your machine**
   (including the hidden `.htaccess` — on Windows you may need
   `View → Show → Hidden items` in File Explorer to see it).
4. Drag-drop them into `public_html/`. Or zip `dist/`'s contents,
   upload the zip, then right-click → Extract.
5. The result inside `public_html/` should look like:

   ```
   public_html/
   ├── .htaccess
   ├── assets/
   ├── index.html
   ├── manifest.json
   ├── robots.txt
   └── …
   ```

### 3.4 Point the domain at `public_html/` and enable HTTPS

If `webgrat.com` was bought through Hostinger and the hosting plan is
attached to it, this is already wired — `public_html/` IS the docroot.
Otherwise: **hPanel → Websites → webgrat.com → Setup**.

Then:

- **hPanel → SSL → Setup** → install free Let's Encrypt cert for
  `webgrat.com` and `www.webgrat.com`. Wait until status is
  *Active*. The `.htaccess` we shipped force-redirects `http→https`
  and `webgrat.com → www.webgrat.com`.

### 3.5 Verify

- `https://www.webgrat.com` → loads the SPA.
- `https://www.webgrat.com/blog` → loads (no 404 — proves `.htaccess`
  works).
- DevTools → Network → check that XHR / fetch requests go to
  `https://api.webgrat.com/api/...` and return 200.
- DevTools → Console → no CORS errors. If you see
  *"Origin … is not allowed"*, double-check Render's
  `ALLOWED_ORIGINS` env var contains the **exact** origin the browser
  is on (`https://www.webgrat.com` vs `https://webgrat.com` matters).

---

## 4 · Keep the free Render instance awake

Render free Web Services sleep after ~15 min of no HTTP traffic.
First request after sleep takes 30–60 s — that's the JVM cold-starting.

The repo now contains **`.github/workflows/keep-alive.yml`** that
pings `/api/blogs/health` every 14 minutes from GitHub's free runners.

### One-time setup

1. Push the workflow to GitHub (you do this anyway when you push the
   rest of these changes).
2. Go to your repo on GitHub →
   **Settings → Secrets and variables → Actions → Variables tab →
   New repository variable**.
3. Add:
   - **Name**: `BACKEND_URL`
   - **Value**: `https://api.webgrat.com`
     *(or `https://webgrat-backend.onrender.com` if you didn't set
     up the custom domain)*
4. Go to **Actions → Keep Render backend awake → Run workflow** to
   trigger it once manually and confirm green tick.

After that it runs automatically every 14 min, forever, free of
charge. You can watch the run history in the Actions tab — each run
takes ~2 seconds and prints the response body.

> **Caveat**: GitHub Actions cron is best-effort. During GitHub's
> peak load a `*/14` schedule sometimes fires every 16–18 min and
> Render *might* sleep briefly between pings. If you ever see this
> happening, change the cron line to `*/10 * * * *` for a tighter
> margin.

---

## 5 · Day-to-day workflow after this is live

### 5.1 Backend code change

```powershell
git add .
git commit -m "fix: tweak blog ordering"
git push origin main
```

Render watches `main` and auto-deploys on every push. Builds take
~3–5 min after the first one (Docker layer cache helps).

### 5.2 Frontend code change

```powershell
cd frontend
npm run build
# upload everything in frontend/dist/ into public_html/
```

Hostinger has no auto-deploy from GitHub on shared hosting — every
frontend release is "build locally + drag-drop". If you want
auto-deploy later, the standard recipe is a GitHub Action that
SFTPs `dist/` into Hostinger using credentials from
**hPanel → Advanced → SSH Access**. Tell me when you want that and
I'll write the workflow.

### 5.3 Local development is unchanged

```powershell
# Terminal 1
cd backend\webgrat-agency-project
copy src\main\resources\application-local.properties.example src\main\resources\application-local.properties
# fill in your real secrets, then:
mvnw spring-boot:run "-Dspring-boot.run.profiles=local"

# Terminal 2
cd frontend
copy .env.example .env
# fill in your local Supabase + http://localhost:8080
npm run dev
```

---

## 6 · Troubleshooting cheat-sheet

| Symptom                                                  | Likely cause                                                                                              | Fix                                                                                                  |
|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| Render build fails: *"Could not resolve dependencies"*  | Maven Central blip                                                                                        | Render → service → **Manual Deploy → Clear build cache & deploy**.                                  |
| Render logs: *"Could not parse … property … placeholder"* | An `${ENV_VAR}` referenced in `application.properties` is missing from Render's env vars                  | Add the variable, save, redeploy.                                                                    |
| App boots but DB queries 500 with `password authentication failed` | Old DB password baked in somewhere, or you forgot to rotate after the leak                                | Reset password in Supabase, update `SPRING_DATASOURCE_PASSWORD` in Render, redeploy.                |
| Frontend console: *"CORS policy: No 'Access-Control-Allow-Origin'"* | `ALLOWED_ORIGINS` on Render doesn't include the exact frontend origin                                     | Add both `https://webgrat.com` and `https://www.webgrat.com`, comma-separated, no spaces.            |
| Frontend hits `http://localhost:8080` in production       | You ran `npm run build` without `.env.production` next to `package.json`                                  | Create `frontend/.env.production`, rebuild, re-upload `dist/`.                                       |
| `/blog/anything` shows Hostinger's 404                    | `.htaccess` didn't make it into `public_html/`                                                            | On Windows enable "show hidden files" and re-upload `.htaccess` from `frontend/dist/`.               |
| First request of the morning takes 60 s                   | Render free instance was asleep                                                                           | Confirm the keep-alive workflow ran in the last 15 min (GitHub → Actions tab).                       |

---

## 7 · Files added / changed by this round of work

```
A  .github/workflows/keep-alive.yml
A  DEPLOYMENT.md
A  backend/webgrat-agency-project/Dockerfile
A  backend/webgrat-agency-project/.dockerignore
A  backend/webgrat-agency-project/src/main/resources/application-local.properties.example
M  backend/webgrat-agency-project/.gitignore
M  backend/webgrat-agency-project/src/main/resources/application.properties
M  frontend/.env.example
M  frontend/public/.htaccess
```

No Java source files needed to change — the `${ENV_VAR}` syntax in
`application.properties` is the standard Spring Boot way to read env
vars, and `SecurityConfig` already pulls `allowed.origins` through
`@Value`, so swapping it to be sourced from `ALLOWED_ORIGINS` works
without any code edit.
