"""Read-only Whop API probe. Never prints the key.

Confirms the stored credential works and reports the business/product surface so
product creation can be done by API instead of browser automation.
"""

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(r"C:\antigravity\AI Money Ops")
sys.path.insert(0, str(ROOT))
from zero_cost_system.whop_auth import fetch_credential  # noqa: E402

BASE = "https://api.whop.com/api/v5"


def get(key, path):
    req = urllib.request.Request(
        BASE + path,
        headers={"Authorization": f"Bearer {key}", "Accept": "application/json"},
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            return r.status, json.loads(r.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")[:600]
    except Exception as e:
        return None, f"{type(e).__name__}: {e}"


def main():
    key = fetch_credential()
    if not key:
        print("NO_KEY")
        return 2
    print(f"key_present len={len(key)} prefix={key[:6]}...")
    for path in ("/me", "/companies", "/products?first=10"):
        status, body = get(key, path)
        print(f"\n=== GET {path} -> {status}")
        if isinstance(body, (dict, list)):
            print(json.dumps(body, indent=2)[:2200])
        else:
            print(body)
    return 0


if __name__ == "__main__":
    sys.exit(main())
