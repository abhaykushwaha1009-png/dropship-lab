"""Firecrawl search/scrape helper with round-robin key rotation.

Stdlib only. Used because the harness web_search key is invalid.

Usage:
    py fc.py search "query" [--limit N]
    py fc.py scrape "https://url"
    py fc.py status

Keys are read from the shared credential file, never printed in full.
"""

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

KEY_FILE = Path(r"C:\antigravity\MonkeyCode_Profiles\tools\firecrawl_keys.json")
README = Path(r"C:\antigravity\Abhay k sare MCP API CRED\FIRECRAWL_KEYS_README.md")
API = "https://api.firecrawl.dev/v1"
STATE_FILE = Path(__file__).with_name(".fc_state.json")


def load_keys():
    if KEY_FILE.exists():
        try:
            raw = json.loads(KEY_FILE.read_text(encoding="utf-8-sig"))
        except Exception:
            raw = None
        keys = []
        if isinstance(raw, dict):
            for v in raw.values():
                if isinstance(v, str) and v.startswith("fc-"):
                    keys.append(v)
                elif isinstance(v, dict):
                    for kk, vv in v.items():
                        if isinstance(vv, str) and vv.startswith("fc-"):
                            keys.append(vv)
        elif isinstance(raw, list):
            for item in raw:
                if isinstance(item, str) and item.startswith("fc-"):
                    keys.append(item)
                elif isinstance(item, dict):
                    for vv in item.values():
                        if isinstance(vv, str) and vv.startswith("fc-"):
                            keys.append(vv)
        keys = list(dict.fromkeys(keys))
        if keys:
            return keys
    # fallback: parse the markdown table
    keys = []
    if README.exists():
        for line in README.read_text(encoding="utf-8-sig", errors="replace").splitlines():
            for tok in line.replace("|", " ").split():
                if tok.startswith("fc-") and len(tok) > 20:
                    keys.append(tok.strip())
    return list(dict.fromkeys(keys))


def next_key_index(n):
    try:
        idx = int(json.loads(STATE_FILE.read_text(encoding="utf-8")).get("i", 0))
    except Exception:
        idx = 0
    idx %= max(n, 1)
    try:
        STATE_FILE.write_text(json.dumps({"i": (idx + 1) % max(n, 1)}), encoding="utf-8")
    except Exception:
        pass
    return idx


def call(path, payload, timeout=90):
    keys = load_keys()
    if not keys:
        raise SystemExit("No Firecrawl keys found in expected files.")
    start = next_key_index(len(keys))
    last = None
    for offset in range(len(keys)):
        key = keys[(start + offset) % len(keys)]
        req = urllib.request.Request(
            f"{API}/{path}",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode("utf-8", "replace"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")[:200]
            last = f"HTTP {e.code}: {body}"
            if e.code in (401, 402, 403, 429, 500, 502, 503):
                time.sleep(1.0)
                continue
            raise SystemExit(last)
        except Exception as e:
            last = f"{type(e).__name__}: {e}"
            time.sleep(1.0)
            continue
    raise SystemExit(f"All {len(keys)} keys failed. Last: {last}")


def do_search(query, limit):
    out = call("search", {"query": query, "limit": min(limit, 10)})
    data = out.get("data") or out.get("web") or []
    if not data:
        print(json.dumps(out, indent=2)[:1500])
        return
    for i, item in enumerate(data, 1):
        print(f"[{i}] {item.get('title', '').strip()}")
        print(f"    {item.get('url', '')}")
        desc = (item.get("description") or item.get("markdown") or "").strip().replace("\n", " ")
        if desc:
            print(f"    {desc[:300]}")
        print()


def do_scrape(url):
    out = call("scrape", {"url": url, "formats": ["markdown"]})
    data = out.get("data", out)
    md = data.get("markdown", "")
    meta = data.get("metadata", {})
    print(f"# {meta.get('title', '')}  ({meta.get('sourceURL', url)})")
    print()
    print(md[:12000])


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    cmd = argv[1]
    if cmd == "status":
        keys = load_keys()
        print(f"{len(keys)} key(s) found; next index {next_key_index(len(keys))}")
        return 0
    if cmd == "search":
        limit = 5
        if "--limit" in argv:
            limit = int(argv[argv.index("--limit") + 1])
        do_search(argv[2], limit)
        return 0
    if cmd == "scrape":
        do_scrape(argv[2])
        return 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
