export interface User {
  id: number;
  name: string;
  email: string;
}

export const mockUsers: Map<number, User> = new Map([
  [1, { id: 1, name: "John Doe", email: "john@example.com" }],
  [2, { id: 2, name: "Jane Smith", email: "jane@example.com" }],
  [3, { id: 3, name: "Alice Johnson", email: "alice@example.com" }],
]);

let nextId = 4;

export function getNextId(): number {
  return nextId++;
}

export function fetchUserFromDB(id: number): Promise<User | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers.get(id) ?? null);
    }, 200);
  });
}
