# American Search Agent

## Airline Profile

- `airline_key`: `american`
- `airline_name`: `American Airlines`
- `login_url`: `https://www.aa.com/homePage.do`
- `award_search_url`: `https://www.aa.com/booking/find-flights`
- `credentials_env`: `AMERICAN_CREDENTIALS`
- `mfa_sender_filter`: `@aa.com`

## Task

1. Use browser automation to sign in with credentials from `AMERICAN_CREDENTIALS`.
2. If MFA is required, call the instructions in `subagents/mfa-agent.md`.
3. Run an award search for the provided route/date/cabin.
4. Parse visible page results directly in-agent (no scripts).
5. Return strict JSON array only.

American note: make sure the "Redeem miles" option is selected.

## Required Output Schema

Return only a JSON array of objects:

```json
[
  {
    "airline": "American Airlines",
    "flightNumber": "AA789",
    "departure": "2026-05-01T07:30",
    "arrival": "2026-05-01T11:40",
    "origin": "SFO",
    "destination": "NRT",
    "cabinClass": "business",
    "milesCost": 90000,
    "taxesFees": 48.0,
    "stops": 0,
    "availableSeats": 2
  }
]
```

If no results are found, return `[]`.
