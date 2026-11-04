# Dropshipping Build Plan — Zero Upfront Spend

Owner directive 2026-11-04. Target markets: US, UK, Switzerland (high purchasing power first).
Success = a real, live, payable store with an outstanding landing + payment page, organic
distribution through the existing page/account fleet, verified test order path, and finally
real cleared money — without paying for anything to start.

Status: **BUILDING**. Business label stays TESTING until an actual cleared receipt exists.

---

## 1. What is actually free, and what is not (measured, not assumed)

The single biggest myth to kill first: **"free Meta ad credits" is mostly not a real thing.**
The Hermes cron `22821548f7ff` has run 21 daily sweeps against official Meta pages, Shopify,
BigCommerce, WooCommerce, Stripe and PayPal. Consistent findings:

| Route | Reality |
|---|---|
| Public Facebook ad coupon codes | Dead since 2020. Anything sold on coupon/eBay/Telegram sites is a scam. |
| Meta new-advertiser offer ($100–$375) | Real, but **account-targeted**: appears as a banner in Ads Manager or an email from `facebookmail.com` on a **brand-new ad account (≤31 days, never billed)**. Not claimable on demand. |
| Shopify $100 partner credit | Needs a **paid** Shopify plan + 14-day-old store + connected Page + new ad account. Not free. |
| Meta for Startups | Partner/accelerator routed, ~$1,000+ reported, no public application, no fixed amount. |
| Meta Elevate | Discretionary, US minority-owned businesses. |
| Stripe Atlas / PayPal / WooCommerce / BigCommerce | Stripe Atlas is $500 to open (not free). Others have no Meta ad-credit perk. |

**Conclusion: the launch engine cannot be paid ads.** It has to be organic reach through
accounts we already own, with the new-advertiser banner treated as a bonus, not a plan.

What IS genuinely free and already owned:

- **Distribution:** ~45 Facebook pages, 15 Instagram accounts, 11 YouTube channels.
- **Hosting:** Firebase Hosting, site already live (`careeraccelerationkit.web.app`).
- **Checkout rails:** existing Whop account, existing Gumroad account.
- **Labour:** this agent, Hermes, agy/AGY, subagents, Claude Code — no marginal cost.
- **Supplier accounts:** free signup, no card, no MOQ (AliExpress / CJ Dropshipping).
- **Cash to supplier:** paid only *after* the customer's money arrives. That is what makes it
  genuinely $0 rather than "$300 that had to be found".

## 2. Architecture — the $0 stack

Owner scope (2026-11-04): **a catalog across many niches, not one hero product.** One free host
serves many niche landing pages; one checkout item exists per launched niche.

```
FREE FIREBASE HOST (one site, many paths)
   /niche-slug-a/  ->  hosted checkout item A  ->  customer pays  ->  supplier order placed
   /niche-slug-b/  ->  hosted checkout item B  ->  customer pays  ->  supplier order placed
   /niche-slug-c/  ->  ...
                                                     no stock, no upfront cash
```

- Shared layer built once (design system, template, legal pages, tracking pattern), so each new
  niche costs only its own copy and product row. Catalogue breadth must not mean rebuild cost.
- One hosting site (`dropship-lab-974ef.web.app`) is already created on the free project. Paths, not sites.
- No Shopify. No paid apps. Order from the supplier admin page only after payment lands.
- Each niche brand is a landing path, not a new domain — no domain purchases.


## 3. Phases

### Phase 0 — Research (in flight)
- [ ] Product research: 8-12 niches, 1-2 candidates each, ranked by earning probability with
      demand evidence, saturation, margin, creative potential, shipping risk, compliance risk.
      US/UK/CH targeted. Seasonal items flagged.
- [ ] Infra feasibility: which checkout really allows zero-card launch, real supplier free tiers,
      Firebase free-tier commercial limits, minimum legal pages, realistic transit times.
- Gate: 3 niches launchable this week, each with margin math that survives ~25-35% commission.

### Phase 1 — Shared build, then per-niche rows
- [ ] Build the shared layer once: design system, landing template, legal pages, order-notify
      pattern, analytics-lite. This is what makes a large catalogue affordable.
- [ ] For each niche: confirm supplier, unit + shipping cost, delivered cost, retail price so that
      `retail − commission − shipping − supplier cost ≥ 45%`.
- [ ] Reject any row that needs a volume assumption we have not measured.

### Phase 2 — Storefront rows (the "wow" surface)
- [ ] Per niche: single-product page — hero with the problem, the product, proof, price, buy CTA.
- [ ] Outstanding design per niche, not a recoloured clone: real typographic voice, mobile-first at
      390px, no carousel-of-nothing, no stock filler.
- [ ] Payment page: hosted checkout, trust block (secure checkout, delivery estimate, returns).
- [ ] Legal minimum pages shared across the catalog: shipping, returns/refunds, privacy, contact.
- [ ] Accessibility: focus states, contrast, tap targets, reduced-motion handling.
- [ ] A catalog index page so the whole range is discoverable and cross-links.

### Phase 3 — Creatives
- [ ] Per launched niche: 2-3 vertical hooks (under 2s, problem->wow->CTA in 15-25s) and 1-2 stills.
- [ ] Curiosity without clickbait: the hook shows the *thing going wrong*, not a claim.
- [ ] Every asset ties to exactly one landing path and one offer.

### Phase 4 — Publish and test
- [ ] Deploy to Firebase, verify the live URL serves the real page (not a stub, not a 404).
- [ ] Complete a real end-to-end checkout test to the payment step.
- [ ] Publish organic posts across approved pages/accounts with the creative set.
- [ ] Read back live post URLs as evidence. A queued post is not a live post.

### Phase 5 — Selling loop and verification
- [ ] First real order: confirm payment cleared, place supplier order same day, send tracking.
- [ ] Reconcile: gross -> commission -> shipping -> supplier cost -> net.
- [ ] Kill or scale on measured data. Report net, not gross.

## 4. What NOT to do

1. **Do not buy a Shopify plan, an app subscription, or any "winning product" list.**
2. **Do not order inventory or samples before the first sale** unless a candidate genuinely
   cannot be validated otherwise.
3. **Do not trust "18 million views, copy this" as demand proof.** Views are a channel's, not a product's.
4. **Do not launch on a saturated cliché** (posture corrector, magnetic mount, galaxy projector)
   without a current differentiated angle.
5. **Do not touch `pateljayadamoh@gmail.com`** (Rule R-020) or any other project's assets (R-014).
6. **Do not invent review counts, search volume, margins, or earnings.** Mark unverified claims.
7. **Do not post fake scarcity** ("only 3 left" when there is no stock logic) or fake countdowns.
8. **Do not promise delivery times the supplier cannot hit** — that is the number one chargeback source.
9. **Do not claim a store is live until the live URL actually renders it.**
10. **Do not describe gross sales as profit.** Commission, shipping and supplier cost come out first.

## 5. Verification contract

| Claim | Evidence required |
|---|---|
| Store live | fetched live URL, real content confirmed |
| Checkout works | reached payment step, provider UI read back |
| Post published | live post URL, read back |
| Order received | order record + cleared payment |
| Money earned | net after commission/shipping/cost, settled |

## 6. Owner gates (only these need a human)

- Checkout provider: confirm which account is used, and any identity/KYC step.
- Payout destination: bank/PayPal details, confirmed once.
- Any moment where money genuinely must leave before income arrives.
- Card entry if a provider turns out not to allow a card-free launch.

Keep this list short. Everything else runs autonomously.
