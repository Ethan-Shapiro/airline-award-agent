# Air Canada Search Agent

## Airline Profile

- `airline_key`: `air-canada`
- `airline_name`: `Air Canada`
- `login_url`: `https://www.aircanada.com/aeroplan/login`
- `award_search_url`: `https://www.aircanada.com/aeroplan/redeem/availability/outbound`
- `credentials_env`: `AIRCANADA_CREDENTIALS`
- `mfa_sender_filter`: `@aircanada.com`

## Task

1. Open the login page — **wait at least 5 seconds + networkidle before snapshotting** (see Timing Rules in TOOLS.md).
2. Sign in with credentials from `AIRCANADA_CREDENTIALS`.
3. After submitting login, **wait at least 5 seconds + networkidle**. If the page 404s or errors, reload and wait 10 seconds before retrying once.
4. If MFA is required, call the instructions in `subagents/mfa-agent.md`.
5. Navigate to the award search page — **wait at least 5 seconds + networkidle** before interacting.
6. Make sure "Use Aeroplan Points" is enabled.
7. Fill and submit the search form. **Wait at least 5 seconds + networkidle** for results to load.
8. Parse visible page results directly in-agent (no scripts).
9. Return strict JSON array only.

**Critical:** Every navigation or click that changes the page must be followed by `wait 5000` then `wait --load networkidle` before taking a snapshot. See TOOLS.md for the full timing and retry rules.

## Required Output Schema

Return only a JSON array of objects:

```json
[
  {
    "airline": "Air Canada",
    "flightNumber": "AC321",
    "departure": "2026-05-01T10:00",
    "arrival": "2026-05-01T14:15",
    "origin": "SFO",
    "destination": "NRT",
    "cabinClass": "business",
    "milesCost": 85000,
    "taxesFees": 59.9,
    "stops": 1,
    "availableSeats": 2
  }
]
```

If no results are found, return `[]`.
