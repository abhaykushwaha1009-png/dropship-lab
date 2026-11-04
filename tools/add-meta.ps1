# Adds canonical + Open Graph + Twitter Card meta to every page under site/,
# shortens overlong titles, and reports description lengths out of [120,160].
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\site')).Path
$base = 'https://dropship-lab-974ef.web.app'
$utf8 = New-Object System.Text.UTF8Encoding($false)

$niches = @('hearth','kitchen','paws','caffeine-lab','cool-paws','desk-hush','glow-shelf','grow-crate','ride-kit','strong-box','tiny-feet')

# description replacements keyed by relative path
$descFix = @{
  'hearth/index.html'     = 'Heated insoles, a heat-holding travel mug and a snow scraper mitt — the winter car kit. Free shipping, a 30-day returns promise.'
  'paws/index.html'       = 'Crash-secured dog booster seat, a self-warming pet mat and a fleece-lined winter vest for small dogs. Free shipping, 30-day returns.'
  'legal/privacy.html'    = 'How dropship-lab handles your data: what we collect, why we collect it, cookies and tracking, and how to request deletion of personal information.'
  'legal/returns.html'    = 'The dropship-lab 30-day returns policy: eligibility, how to start a return, refund timing back to your original payment method, and what you pay.'
  'legal/shipping.html'   = 'Dropship-lab shipping: dispatch from EU warehouses in 1–3 working days, tracking links, delivery times, and what happens if a package is lost.'
}
# title replacements keyed by relative path (no leading slash, forward slashes)
$titleFix = @{
  'caffeine-lab/index.html' = 'Caffeine Lab — the kettle that stops at temperature'
  'cool-paws/index.html'    = 'Cool Paws — the cooling mat dogs actually use'
  'desk-hush/index.html'    = 'Desk Hush — laptop stand that brings the screen up'
  'glow-shelf/index.html'   = 'Glow Shelf — warm shelf light for late work'
  'grow-crate/index.html'   = 'Grow Crate — a basil crate that survives August'
  'paws/index.html'         = 'Paw &amp; Posture — car seats and winter kit for small dogs'
  'ride-kit/index.html'     = 'Ride Kit — a boot organiser that ends the cable knot'
  'strong-box/index.html'   = 'Strong Box — cushion, tubes and handle for home'
  'tiny-feet/index.html'    = 'Tiny Feet — a travel seat that stays put'
}

$report = @()
Get-ChildItem $root -Recurse -File -Filter *.html | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length + 1).Replace('\','/')
  $t = [System.IO.File]::ReadAllText($_.FullName, $utf8)

  $origTitle = [regex]::Match($t,'<title>(.*?)</title>').Groups[1].Value
  $desc = [regex]::Match($t,'name="description" content="(.*?)"').Groups[1].Value

  # --- title fix ---
  if ($titleFix.ContainsKey($rel)) {
    $newTitle = [System.Net.WebUtility]::HtmlDecode($titleFix[$rel])
    $t = [regex]::Replace($t,'<title>.*?</title>',"<title>$newTitle</title>")
  }
  # --- description fix ---
  if ($descFix.ContainsKey($rel)) {
    $newDesc = [System.Net.WebUtility]::HtmlDecode($descFix[$rel])
    $t = [regex]::Replace($t,'(name="description" content=")[^"]*(")', "`${1}$newDesc`${2}")
  }

  # --- canonical url ---
  if ($rel -eq 'index.html') { $canon = "$base/" }
  elseif ($rel -like '*/index.html') {
    $dir = ($rel -replace '/index\.html$','')
    $canon = "$base/$dir/"
  }
  else { $canon = "$base/$rel" }
  # --- og image ---
  $slug = if ($niches -contains ($rel -replace '/index\.html$','')) { ($rel -replace '/index\.html$','') } else { 'home' }
  $ogImg = "$base/assets/og/$slug.png"

  $title = [regex]::Match($t,'<title>(.*?)</title>').Groups[1].Value
  $metaBlock = @"
<link rel="canonical" href="$canon">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Dropship Lab">
<meta property="og:url" content="$canon">
<meta property="og:title" content="$title">
<meta property="og:description" content="$desc">
<meta property="og:image" content="$ogImg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="$title">
<meta name="twitter:description" content="$desc">
<meta name="twitter:image" content="$ogImg">
"@
  # remove any previously injected block, then insert after the description meta line
  $t = $t -replace '(?ms)<link rel="canonical" href="[^"]*">\r?\n(?:<meta property="og:[^\r\n]*>\r?\n)*(?:<meta name="twitter:[^\r\n]*>\r?\n?)*', ''
  $t = $t -replace '(?m)(<meta name="description" content="[^"]*">)', "`$1`n$metaBlock"

  [System.IO.File]::WriteAllText($_.FullName, $t, $utf8)

  $report += [pscustomobject]@{ Page=$rel; TitleLen=$title.Length; DescLen=$desc.Length; Canon=$canon; Og=$ogImg }
}

$report | Format-Table -AutoSize | Out-String -Width 220
"--- DESC OUT OF [120,160] ---"
$report | Where-Object { $_.DescLen -lt 120 -or $_.DescLen -gt 160 } | Format-Table -AutoSize | Out-String -Width 220