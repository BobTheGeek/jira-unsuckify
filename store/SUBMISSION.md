# How to publish this, step by step

Target: an **Unlisted** Chrome Web Store listing. Not in search. Anyone with the
link can install. Auto-updates for everyone on your team.

All the text you need to paste is in [`listing.md`](listing.md). Keep it open in
another tab.

Total hands-on time: about 25 minutes. Then you wait for Google.

---

## Before you start

You need:

- A Google account. Use one your team will still have access to in two years.
  A shared or role account is safer than your personal one.
- A credit card, for a one-time $5 registration fee.
- About 25 minutes.

---

## Step 1 — Create the developer account

1. Go to https://chrome.google.com/webstore/devconsole
2. Sign in with the Google account you picked.
3. Accept the developer agreement.
4. Pay the **one-time $5 registration fee**. You pay this once, ever, not per
   extension.
5. Open **Account** in the left sidebar. Fill in the **contact email** and
   click the verify link Google emails you.

Do not skip the email verification. You cannot publish without it.

---

## Step 2 — Upload the package

1. Click **Items** in the left sidebar, then **Add new item**.
2. Upload this file:

   ```
   dist/jira-unsuckify-1.0.0.zip
   ```

3. Wait for it to process. You land on the item's **Store listing** tab.

---

## Step 3 — Store listing tab

Open [`listing.md`](listing.md), section **Store listing tab**, and copy each
block across.

1. **Description** — paste the detailed description block.
2. **Category** — pick `Workflow & Planning`.
3. **Language** — `English (United States)`.
4. **Store icon** — it is taken from the package. Nothing to do.
5. **Screenshots** — upload these four, in this order:

   ```
   store/screenshots/01-before.png
   store/screenshots/02-after.png
   store/screenshots/03-sticky-headers.png
   store/screenshots/04-controls.png
   ```

6. **Small promo tile** — `store/small-promo-tile-440x280.png`
7. **Marquee promo tile** — `store/marquee-promo-tile-1400x560.png`

The extension name and the short description come from `manifest.json`, so
those fields may already be filled in. If they are editable, the exact text is
in `listing.md`.

Click **Save draft**.

---

## Step 4 — Privacy tab

This is the tab that gets submissions rejected. Take it slowly. Every answer
is in [`listing.md`](listing.md), section **Privacy tab**.

1. **Single purpose** — paste the single purpose block.
2. **Permission justification** — there is one box per permission. Paste the
   matching block for each:
   - `storage`
   - `scripting`
   - host permission `https://*.atlassian.net/*`
   - optional host permission `https://*/*`
3. **Are you using remote code?** — choose **No, I am not using remote code**.
4. **Data usage** — tick **nothing** in the list of data types. Then tick all
   three certification checkboxes at the bottom.
5. **Privacy policy URL** — required. Host the policy first, see below, then
   paste the URL here.

Click **Save draft**.

### Hosting the privacy policy

It is hosted from this repo, on GitHub Pages. The site lives in `docs/`:

```
docs/index.html     a landing page for the extension
docs/privacy.html   the privacy policy
docs/.nojekyll      stops GitHub trying to run Jekyll over it
```

Pages is already switched on for this repo, serving `main` / `/docs`. To check
or change it: repo → **Settings** → **Pages**.

The canonical URLs are:

```
https://bobthegeek.github.io/jira-unsuckify/
https://bobthegeek.github.io/jira-unsuckify/privacy.html
```

The second one is the privacy policy URL the store wants.

**Before you paste it into the store, open it in a private window** and confirm
you get the policy, over HTTPS, with no login. The reviewer will do exactly
that.

> **Heads up.** The account `bobthegeek.github.io` has a custom domain set
> (`bobthegeek.com`), so GitHub 301s every `github.io` URL to it. That domain's
> DNS currently points at a mix of GitHub's **deprecated** Pages IPs and a
> registrar parking service, so some requests land on a parking page and HTTPS
> does not answer at all. Until that is fixed, neither URL is dependable enough
> to submit.
>
> The fix is four DNS `A` records on `bobthegeek.com`, replacing what is there
> now, plus removing any registrar domain-forwarding on the apex:
>
> ```
> 185.199.108.153
> 185.199.109.153
> 185.199.110.153
> 185.199.111.153
> ```
>
> Then, in the `bobthegeek.github.io` repo → **Settings** → **Pages**, re-save
> the custom domain so GitHub issues a certificate, and tick **Enforce HTTPS**.
> That fixes the personal site too.

GitHub Pages needs either a **public repo**, or a **private repo on GitHub
Pro/Team/Enterprise**. A private repo on the free plan cannot serve Pages.

### Two places want the URL

Paste the same URL into both:

- **Privacy tab → Privacy policy URL** (this item)
- **Account → Privacy policy URL** (your whole developer account). If this one
  is blank, submissions can be rejected even when the item-level field is
  filled in.

---

## Step 5 — Distribution tab

1. **Visibility** → **Unlisted**

   This is the whole point. Do not pick Public.

2. **Distribution** → all regions
3. **Pricing** → Free

Click **Save draft**.

---

## Step 6 — Submit

1. Click **Submit for review** (top right).
2. If it complains, it will name the tab and the field. Go fix that one thing
   and submit again.
3. Review usually takes **1 to 3 days**. A first submission with a broad host
   permission can take longer. You get an email either way.

Broad host permissions get extra scrutiny, so expect this one to sit at the
slower end. The `https://*/*` justification in `listing.md` is written for
exactly that question.

---

## Step 7 — Share it with your team

Once it is approved, open the item in the developer console and copy the
**public link**. It looks like:

```
https://chromewebstore.google.com/detail/jira-unsuckify/<some-id>
```

Send that link to your team. They click **Add to Chrome**. That is all they do.
The extension updates itself from then on.

---

## Shipping an update later

When Jira changes its DOM and you patch `src/selectors.js`:

1. Bump `"version"` in `manifest.json`. Chrome will reject an upload that
   reuses a version number.
2. Bump `SELECTORS_VERSION` in `src/selectors.js` to the date you re-validated.
3. Rebuild the package:

   ```bash
   cd /Users/bobgibilaro/development/jira-unsuckify
   rm -f dist/*.zip
   zip -qr dist/jira-unsuckify-$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])").zip \
     manifest.json src icons/icon16.png icons/icon32.png icons/icon48.png icons/icon128.png -x '*.DS_Store'
   ```

4. In the developer console: **Items** → Jira Unsuckify → **Package** →
   **Upload new package** → **Submit for review**.

Updates review faster than a first submission. Your team gets it automatically
within a few hours of approval.

---

## If you would rather not wait for review

Send them `dist/jira-unsuckify-1.0.0.zip` and these four steps:

1. Unzip it somewhere permanent. Not Downloads.
2. Open `chrome://extensions`
3. Turn on **Developer mode**, top right
4. Click **Load unpacked** and pick the unzipped folder

It works immediately. The catches: Chrome may nag about developer mode, there
are no automatic updates, and if anyone moves or deletes that folder their
extension stops working.

You can do this today and still submit to the store in parallel. Tell people to
remove the unpacked copy once the store version is approved, so they are not
running two.
