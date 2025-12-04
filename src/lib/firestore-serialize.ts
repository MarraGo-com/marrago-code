// Helper to convert Firestore Timestamp-like objects to ISO strings recursively
// Ensures objects passed from Server Components to Client Components are plain
export function serializeTimestamps<T = any>(value: T): T {
  if (value === null || value === undefined) return value;

  // Handle Firestore Timestamp-like objects (have toDate function)
  if (typeof (value as any)?.toDate === 'function') {
    try {
      return (value as any).toDate().toISOString();
    } catch (err) {
      if(err instanceof Error) {
        console.error("Error converting Firestore Timestamp to Date:", err.message);
      } 
      return value;
    }
  }

  // Arrays
  if (Array.isArray(value)) {
    return (value as any[]).map(item => serializeTimestamps(item)) as any;
  }

  // Plain objects: iterate keys and serialize recursively
  if (typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const key of Object.keys(value as any)) {
      out[key] = serializeTimestamps((value as any)[key]);
    }
    return out as T;
  }

  // Primitives
  return value;
}

export default serializeTimestamps;
