# United Search Agent

## Airline Profile

- `airline_key`: `united`
- `airline_name`: `United Airlines`
- `login_url`: `https://www.united.com/en/us`
- `award_search_url`: `https://www.united.com/ual/en/us/flight-search/book-a-flight/results/awd`
- `credentials_env`: `UNITED_CREDENTIALS`
- `mfa_sender_filter`: `@united.com`

## Task

1. Use browser automation to sign in with credentials from `UNITED_CREDENTIALS`.
2. If MFA is required, call the instructions in `subagents/mfa-agent.md`.
3. Run an award search for the provided route/date/cabin.
4. Parse visible page results directly in-agent (no scripts).
5. Return strict JSON array only.

United note: make sure the "Book with miles" toggle is enabled.

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
