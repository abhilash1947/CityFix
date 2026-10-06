import React, { useEffect, useMemo, useState } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { rewards } from '../../lib/mockRewards';
import { useAuth } from '../../hooks/useAuth';

function getLevel(points: number) {
  // Simple curve: every 100 points is a level
  const level = Math.floor(points / 100) + 1;
  const currentBase = (level - 1) * 100;
  const nextBase = level * 100;
  const progress = Math.min(1, (points - currentBase) / (nextBase - currentBase));
  const toNext = nextBase - points;
  return { level, progress, toNext, currentBase, nextBase };
}

export const RewardsCard: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [points, setPoints] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setPoints(rewards.getPoints(userId));
    const off = rewards.on((id, p, delta) => {
      if (id !== userId) return;
      setPoints(p);
      if (delta > 0) {
        setPulse(true);
        setTimeout(() => setPulse(false), 900);
      }
    });
    return off;
  }, [userId]);

  const { level, progress, toNext } = useMemo(() => getLevel(points), [points]);
  const pct = Math.round(progress * 100);

  if (!userId) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-50/60 to-accent-50/40" />
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className={`w-5 h-5 text-brand-600 ${pulse ? 'animate-bounce' : ''}`} />
            <h3 className="font-semibold text-gray-900">Your Rewards</h3>
          </div>
          <div className="flex items-center gap-1 text-brand-700">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">{points} pts</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Level {level}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-600">{toNext} points to reach Level {level + 1}</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-brand-50 text-brand-700 border border-brand-100 py-2">
            +10 Report
          </div>
          <div className="rounded-lg bg-brand-50 text-brand-700 border border-brand-100 py-2">
            +2/Photo
          </div>
          <div className="rounded-lg bg-accent-50 text-accent-700 border border-accent-100 py-2">
            Streaks soon
          </div>
        </div>
      </div>
    </div>
  );
};
