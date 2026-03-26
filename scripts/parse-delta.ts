/**
 * Deterministic parser for Delta Air Lines award search results.
 *
 * Reads page content from stdin (snapshot or text dump from agent-browser)
 * and outputs a JSON array of award results to stdout.
 *
 * Starter template — refine selectors after inspecting actual Delta results DOM.
 */

interface AwardResult {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  origin: string;
  destination: string;
  cabinClass: string;
  milesCost: number;
  taxesFees: number;
  stops: number;
  availableSeats: number | null;
}

function parseResults(content: string): AwardResult[] {
  const results: AwardResult[] = [];

  const flightPattern = /(?:DL|Delta)\s*(\d{1,4})/gi;
  const milesPattern = /(\d{1,3}(?:,\d{3})*)\s*miles/gi;
  const pricePattern = /\$(\d+(?:\.\d{2})?)/g;
  const timePattern = /(\d{1,2}:\d{2}\s*(?:AM|PM))/gi;

  const flightNumbers = [...content.matchAll(flightPattern)].map((m) => m[1]);
  const milesCosts = [...content.matchAll(milesPattern)].map((m) =>
    parseInt(m[1].replace(/,/g, ""), 10)
  );
  const prices = [...content.matchAll(pricePattern)].map((m) => parseFloat(m[1]));
  const times = [...content.matchAll(timePattern)].map((m) => m[1]);

  const count = Math.min(flightNumbers.length, milesCosts.length);
  for (let i = 0; i < count; i++) {
    results.push({
      airline: "Delta Air Lines",
      flightNumber: `DL ${flightNumbers[i]}`,
      departure: times[i * 2] ?? "",
      arrival: times[i * 2 + 1] ?? "",
      origin: "",
      destination: "",
      cabinClass: "",
      milesCost: milesCosts[i],
      taxesFees: prices[i] ?? 0,
      stops: 0,
      availableSeats: null,
    });
  }

  return results;
}

async function main() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const content = Buffer.concat(chunks).toString("utf-8");

  if (!content.trim()) {
    console.error("No input received on stdin.");
    process.exit(1);
  }

  const results = parseResults(content);
  process.stdout.write(JSON.stringify(results, null, 2));
}

main();
