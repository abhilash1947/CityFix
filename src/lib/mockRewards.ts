// Simple localStorage-backed rewards service with a tiny pubsub for updates
export type RewardsListener = (userId: string, points: number, delta: number) => void;

const STORAGE_KEY = 'civic_rewards_points_v1';

function readAll(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

const listeners = new Set<RewardsListener>();

export const rewards = {
  getPoints(userId: string | null | undefined): number {
    if (!userId) return 0;
    const all = readAll();
    return all[userId] || 0;
  },
  setPoints(userId: string, points: number) {
    const all = readAll();
    all[userId] = Math.max(0, Math.floor(points));
    writeAll(all);
    rewards.emit(userId, all[userId], 0);
  },
  addPoints(userId: string, delta: number) {
    const all = readAll();
    const current = all[userId] || 0;
    const next = Math.max(0, Math.floor(current + delta));
    all[userId] = next;
    writeAll(all);
    rewards.emit(userId, next, delta);
  },
  on(listener: RewardsListener) {
    listeners.add(listener);
    // Return a cleanup function that returns void (not boolean)
    return () => {
      listeners.delete(listener);
    };
  },
  emit(userId: string, points: number, delta: number) {
    listeners.forEach((l) => l(userId, points, delta));
  }
};
