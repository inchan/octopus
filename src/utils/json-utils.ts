
export function relaxJson(input: string): string {
    let i = 0;
    const len = input.length;
    let state = 'NORMAL'; // NORMAL, STRING, COMMENT_LINE, COMMENT_BLOCK

    // We treat the output as a stream of tokens.
    // To handle trailing commas, we look back at the last "meaningful" token added to 'out'.
    // BUT modifying 'out' is expensive if strings are long.
    // Instead, we can buffer non-meaningful chars (whitespace, comments) and flush them only when we decide to keep the previous comma.

    // Simplified State Machine approach:
    // 1. Strip Comments -> Intermediate string
    // 2. Strip Trailing Commas from Intermediate string -> Final string

    // Pass 1: Strip Comments
    let clean1 = '';
    while (i < len) {
        const char = input[i];
        const next = input[i + 1];

        if (state === 'STRING') {
            clean1 += char;
            if (char === '\\') {
                i++;
                if (i < len) clean1 += input[i];
            } else if (char === '"') {
                state = 'NORMAL';
            }
        } else if (state === 'COMMENT_LINE') {
            if (char === '\n') {
                state = 'NORMAL';
                clean1 += char;
            }
        } else if (state === 'COMMENT_BLOCK') {
            if (char === '*' && next === '/') {
                state = 'NORMAL';
                i++; // Skip /
            }
        } else {
            // NORMAL
            if (char === '"') {
                state = 'STRING';
                clean1 += char;
            } else if (char === '/' && next === '/') {
                state = 'COMMENT_LINE';
                i++; // Skip second /
            } else if (char === '/' && next === '*') {
                state = 'COMMENT_BLOCK';
                i++; // Skip *
            } else {
                clean1 += char;
            }
        }
        i++;
    }

    // Pass 2: Strip Trailing Commas
    // Iterate through clean1. Keep track of "last significant char".
    // If we encounter '}' or ']', and the last significant char was ',', we must remove that comma.
    // Since we are building a string, we can verify this.

    // Problem: "key": "value, " }. Comma in string.
    // We must respect strings again.

    let clean2 = '';
    i = 0;
    state = 'NORMAL';
    const clean1Len = clean1.length;

    // We need to track the position of the last comma in 'clean2' to remove it.
    // But 'clean2' is being built.
    // A simple way: track indices? No.
    // Use a "pending comma" buffer?

    // Better: Regex replacement on specific patterns `,\s*}` -> `}` etc.
    // BUT we must exclude strings.
    // So we iterate, and when we are NOT in a string, we check for `}` or `]`.
    // If found, we check if the regex `,\s*$` matches the *end* of our current buffer (ignoring strict logic).
    // Actually, checking the end of `clean2` for a comma is easy.

    while (i < clean1Len) {
        const char = clean1[i];

        if (state === 'STRING') {
            clean2 += char;
            if (char === '\\') {
                i++;
                if (i < clean1Len) clean2 += clean1[i];
            } else if (char === '"') {
                state = 'NORMAL';
            }
        } else {
            // NORMAL
            if (char === '"') {
                state = 'STRING';
                clean2 += char;
            } else if (char === '}' || char === ']') {
                // Check if we have a trailing comma in clean2 (ignoring whitespace)
                // Scan backwards in clean2
                let j = clean2.length - 1;
                while (j >= 0 && /\s/.test(clean2[j])) {
                    j--;
                }
                if (j >= 0 && clean2[j] === ',') {
                    // Remove the comma
                    // Reconstruct clean2: up to j, then whitespace, then current char
                    const preComma = clean2.substring(0, j);
                    const postComma = clean2.substring(j + 1); // Whitespace
                    clean2 = preComma + postComma + char;
                } else {
                    clean2 += char;
                }
            } else {
                clean2 += char;
            }
        }
        i++;
    }

    return clean2;
}
