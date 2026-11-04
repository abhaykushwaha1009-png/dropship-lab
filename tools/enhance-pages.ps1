# Adds the per-page spec blocks: hero image slot (figure on the hero), data-slot on product art, FAQ block, email capture.
# Idempotent: safe to re-run. Saves a backup copy of each page to %TEMP%\enhance-old first.
$root = "C:\antigravity\AI Money Ops\drop shopping"
$old  = Join-Path $env:TEMP "enhance-old"
Remove-Item $old -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $old -Force | Out-Null

$goals = @('cool-paws','caffeine-lab','desk-hush','grow-crate','ride-kit','glow-shelf','tiny-feet','strong-box')
$changed = 0
foreach ($g in $goals) {
  $f = "$root\site\$g\index.html"
  if (-not (Test-Path $f)) { continue }
  $html = Get-Content $f -Encoding UTF8 -Raw
  Copy-Item $f (Join-Path $old "$g.html")

  # 1) product art svg -> data-slot (only when the svg does not already carry one)
  if ($html -notmatch [regex]::Escape("data-slot=`"$g-1`"")) {
    $script:count = 0
    $html = [regex]::Replace($html, '(<div class="art"><svg )(?!data-slot=)', {
        param($m); $script:count++; $m.Groups[1].Value + ('data-slot="{0}-{1}" ' -f $g, $script:count)
    })
  }

  # 2) hero image slot right after the hero's inner <div class="wrap"> (templates use <section class="hero">)
  if (-not ($html -match [regex]::Escape("data-slot=`"$g-hero`""))) {
    $html = $html -replace '(<(?:div|section) class="hero">\s*<div class="wrap">)', ('$1' + "`n  <figure class=`"slot`" data-slot=`"$g-hero`"><figcaption>Paste product photo (1600w)</figcaption></figure>")
  }

  # 3) FAQ + email capture before </main> (only when not already present)
  if ($html -notmatch '<section class="band faq">') {
    $kit = [regex]::Match($html, '<h2>The kit</h2>\s*<p class="sub">([^<]+)</p>').Groups[1].Value
    $faq = @"
<section class="band faq"><div class="wrap">
  <h2>FAQ</h2>
  <details><summary>What exactly arrives?</summary><p>Everything in the kit above, packed together. $kit</p></details>
  <details><summary>Where does it ship from, and how fast?</summary><p>Standard tracked delivery, free. Usually 7 to 10 business days after dispatch, and tracking goes to your email.</p></details>
  <details><summary>Can I return it?</summary><p>30 days from delivery, unused. Start from the <a href="../legal/returns.html">returns page</a>.</p></details>
</div></section>
"@
    $cap = @"
<section class="band capture"><div class="wrap">
  <h2>Restock + drop alerts</h2>
  <p class="sub">One email when a sku comes back or a new drop opens. No newsletter.</p>
  <form class="email-capture" novalidate>
    <input type="email" placeholder="you@email" aria-label="Email address" required>
    <button class="btn" type="submit">Notify me</button>
    <p class="msg" aria-live="polite"></p>
  </form>
</div></section>
"@
    $html = $html -replace '</main>', ($faq + $cap + "`n</main>")
  }

  [IO.File]::WriteAllText($f, $html)
  $changed++
}
"enhanced $changed pages (backup: $old)"