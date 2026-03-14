interface Node<K, V> {
  key: K;
  value: V;
  expiresAt: number;
  prev: Node<K, V> | null;
  next: Node<K, V> | null;
}

export class LRUCache<K, V> {
  private capacity: number;
  private ttl: number; // ms
  private map: Map<K, Node<K, V>> = new Map();
  private head: Node<K, V>;
  private tail: Node<K, V>;
  hits = 0;
  misses = 0;

  constructor(capacity: number, ttlSeconds = 60) {
    this.capacity = capacity;
    this.ttl = ttlSeconds * 1000;
    // sentinel nodes
    this.head = {
      key: null as unknown as K,
      value: null as unknown as V,
      expiresAt: 0,
      prev: null,
      next: null,
    };
    this.tail = {
      key: null as unknown as K,
      value: null as unknown as V,
      expiresAt: 0,
      prev: null,
      next: null,
    };
    this.head.next = this.tail;
    this.tail.prev = this.head;

    // evict expired entries every 10s
    setInterval(() => this.evictExpired(), 10_000);
  }

  private removeNode(node: Node<K, V>) {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private insertFront(node: Node<K, V>) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  get(key: K): V | null {
    const node = this.map.get(key);
    if (!node) {
      this.misses++;
      return null;
    }
    if (Date.now() > node.expiresAt) {
      this.removeNode(node);
      this.map.delete(key);
      this.misses++;
      return null;
    }
    this.removeNode(node);
    this.insertFront(node);
    this.hits++;
    return node.value;
  }

  set(key: K, value: V) {
    const existing = this.map.get(key);
    if (existing) {
      this.removeNode(existing);
      this.map.delete(key);
    }
    if (this.map.size >= this.capacity) {
      const lru = this.tail.prev!;
      this.removeNode(lru);
      this.map.delete(lru.key);
    }
    const node: Node<K, V> = {
      key,
      value,
      expiresAt: Date.now() + this.ttl,
      prev: null,
      next: null,
    };
    this.insertFront(node);
    this.map.set(key, node);
  }

  delete(key: K) {
    const node = this.map.get(key);
    if (node) {
      this.removeNode(node);
      this.map.delete(key);
    }
  }

  clear() {
    this.map.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.hits = 0;
    this.misses = 0;
  }

  get size() {
    return this.map.size;
  }

  private evictExpired() {
    const now = Date.now();
    for (const [key, node] of this.map) {
      if (now > node.expiresAt) {
        this.removeNode(node);
        this.map.delete(key);
      }
    }
  }
}
