# dropship-lab site — build & ops notes

Static site, no build step, no framework. Deploy target: Firebase Hosting project `dropship-lab`.

## Files
- `index.html` — hub, links to the three shops
- `hearth/` `paws/` `kitchen/` — niche landing paths (one hero SKU + two more)
- `assets/config.js` — **checkout map**: SKU → Whop plan URL. All `null` until links exist.
- `assets/js/main.js` — buy buttons: redirect when a link exists, else honest "connecting" notice
- `legal/` — shipping, returns, privacy
- `SUPPLIERS.md` — SKU economics + probe list (read before changing prices)

## Deploy
```
cd site
npx firebase-tools deploy --only hosting --project dropship-lab
```
Wrap with `set -o pipefail` if piped. Deploy URL: https://dropship-lab-974ef.web.app/

## Before any traffic
1. Every `CHECKOUT` key has a live `https://whop.com/checkout/plan_…` URL.
2. A real end-to-end test: open a shop, click a buy button, complete a $1 test checkout.
3. Verify dispatch messaging matches the supplier's actual SLA.

## Placeholder discipline
The "checkout connecting" notice is honest by design: a button that fails loudly is safer
than a fake cart. Once a Whop plan exists, drop its checkout link into `assets/config.js` and redeploy.
