declare module 'string-similarity' {
  export function compareTwoStrings(string1: string, string2: string): number;
  export function findBestMatch(mainString: string, targetStrings: string[]): {
    ratings: Array<{ target: string; rating: number }>;
    bestMatch: { target: string; rating: number };
    bestMatchIndex: number;
  };
}
