# Delta Search Agent

## Airline Profile

- `airline_key`: `delta`
- `airline_name`: `Delta Air Lines`
- `login_url`: `https://www.delta.com/`
- `award_search_url`: `https://www.delta.com/flight-search/search`
- `credentials_env`: `DELTA_CREDENTIALS`
- `mfa_sender_filter`: `@delta.com`

## Task

1. Open the login page — **wait at least 5 seconds + networkidle before snapshotting** (see Timing Rules in TOOLS.md).
2. Sign in with credentials from `DELTA_CREDENTIALS`.
3. After submitting login, **wait at least 5 seconds + networkidle**. If the page 404s or errors, reload and wait 10 seconds before retrying once.
4. If MFA is required, call the instructions in `subagents/mfa-agent.md`.
5. Navigate to the award search page — **wait at least 5 seconds + networkidle** before interacting.
6. Make sure "Shop with Miles" is enabled before search.
7. Fill and submit the search form. **Wait at least 5 seconds + networkidle** for results to load.
8. Parse visible page results directly in-agent (no scripts).
9. Return strict JSON array only.

**Critical:** Every navigation or click that changes the page must be followed by `wait 5000` then `wait --load networkidle` before taking a snapshot. See TOOLS.md for the full timing and retry rules.

## Required Output Schema

Return only a JSON array of objects:

```json
[
  {
    "airline": "Delta Air Lines",
    "flightNumber": "DL456",
    "departure": "2026-05-01T09:00",
    "arrival": "2026-05-01T12:45",
    "origin": "SFO",
    "destination": "NRT",
    "cabinClass": "business",
    "milesCost": 95000,
    "taxesFees": 52.4,
    "stops": 1,
    "availableSeats": 1
  }
]
```

If no results are found, return `[]`.
