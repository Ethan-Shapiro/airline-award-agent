# Air Canada Search Agent

## Airline Profile

- `airline_key`: `air-canada`
- `airline_name`: `Air Canada`
- `login_url`: `https://www.aircanada.com/aeroplan/login`
- `award_search_url`: `https://www.aircanada.com/aeroplan/redeem/availability/outbound`
- `credentials_env`: `AIRCANADA_CREDENTIALS`
- `mfa_sender_filter`: `@aircanada.com`

## Task

1. Use browser automation to sign in with credentials from `AIRCANADA_CREDENTIALS`.
2. If MFA is required, call the instructions in `subagents/mfa-agent.md`.
3. Run an award search for the provided route/date/cabin.
4. Parse visible page results directly in-agent (no scripts).
5. Return strict JSON array only.

Air Canada note: make sure "Use Aeroplan Points" is enabled.

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
