/**
 * Formats data for the AI Valuation Engine.
 * Wraps the data in a standardized context string.
 */
export function formatForAI(data: any, naicsCode: string = "511210"): string {
    const date = new Date().toISOString().split('T')[0];

    // Ensure data is a string representation if it's an object
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);

    return `System Context: "You are a Valuation Expert. The following JSON data represents a [NAICS: ${naicsCode}] company. Based on the [${date}] market conditions, calculate the Enterprise Value." Data Input: ${dataString}`;
}

/**
 * Example usage:
 * const context = formatForAI({ "Revenue": 1000000, "Growth_YoY": 0.25, "EBITDA": 100000 });
 * console.log(context);
 */
