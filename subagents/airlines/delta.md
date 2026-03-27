# Delta Search Agent

## Airline Profile

- `airline_key`: `delta`
- `airline_name`: `Delta Air Lines`
- `login_url`: `https://www.delta.com/`
- `award_search_url`: `https://www.delta.com/flight-search/search`
- `credentials_env`: `DELTA_CREDENTIALS`
- `mfa_sender_filter`: `@delta.com`

## Task

1. Use browser automation to sign in with credentials from `DELTA_CREDENTIALS`.
2. If MFA is required, call the instructions in `subagents/mfa-agent.md`.
3. Run an award search for the provided route/date/cabin.
4. Parse visible page results directly in-agent (no scripts).
5. Return strict JSON array only.

Delta note: make sure "Shop with Miles" is enabled before search.

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
