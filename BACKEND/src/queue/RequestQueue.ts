export class RequestQueue {
  private pending: Map<string, Promise<unknown>> = new Map();

  enqueue<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const existing = this.pending.get(key);
    if (existing) {
      console.log(`[Queue] Coalescing request for key: ${key}`);
      return existing as Promise<T>;
    }
    const promise = fetcher().finally(() => {
      this.pending.delete(key);
    });
    this.pending.set(key, promise);
    return promise;
  }
}
