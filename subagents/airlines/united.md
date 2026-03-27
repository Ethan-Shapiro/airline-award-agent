# United Search Agent

## Airline Profile

- `airline_key`: `united`
- `airline_name`: `United Airlines`
- `login_url`: `https://www.united.com/en/us`
- `award_search_url`: `https://www.united.com/ual/en/us/flight-search/book-a-flight/results/awd`
- `credentials_env`: `UNITED_CREDENTIALS`
- `mfa_sender_filter`: `@united.com`

## Task

1. Open the login page — **wait at least 5 seconds + networkidle before snapshotting** (see Timing Rules in TOOLS.md).
2. Sign in with credentials from `UNITED_CREDENTIALS`.
3. After submitting login, **wait at least 5 seconds + networkidle**. If the page 404s or errors, reload and wait 10 seconds before retrying once.
4. If MFA is required, call the instructions in `subagents/mfa-agent.md`.
5. Navigate to the award search page — **wait at least 5 seconds + networkidle** before interacting.
6. Make sure the "Book with miles" toggle is enabled.
7. Fill and submit the search form. **Wait at least 5 seconds + networkidle** for results to load.
8. Parse visible page results directly in-agent (no scripts).
9. Return strict JSON array only.

**Critical:** Every navigation or click that changes the page must be followed by `wait 5000` then `wait --load networkidle` before taking a snapshot. See TOOLS.md for the full timing and retry rules.

## Required Output Schema

Return only a JSON array of objects:

```json
[
  {
    "airline": "United Airlines",
    "flightNumber": "UA123",
    "departure": "2026-05-01T08:00",
    "arrival": "2026-05-01T11:20",
    "origin": "SFO",
    "destination": "NRT",
    "cabinClass": "business",
    "milesCost": 80000,
    "taxesFees": 45.6,
    "stops": 0,
    "availableSeats": 2
  }
]
```

If no results are found, return `[]`.
