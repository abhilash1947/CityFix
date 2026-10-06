import React, { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { rewards } from '../../lib/mockRewards';
import { useAuth } from '../../hooks/useAuth';

export const PointsBadge: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [points, setPoints] = useState<number>(() => rewards.getPoints(userId));
  const [burst, setBurst] = useState<{ id: number; delta: number } | null>(null);

  useEffect(() => {
    if (!userId) return;
    setPoints(rewards.getPoints(userId));
    const off = rewards.on((changedUserId, newPoints, delta) => {
      if (changedUserId !== userId) return;
      setPoints(newPoints);
      if (delta > 0) {
        const id = Date.now();
        setBurst({ id, delta });
        setTimeout(() => {
          setBurst((b) => (b?.id === id ? null : b));
        }, 1400);
      }
    });
    return off;
  }, [userId]);

  const formatted = useMemo(() => points.toLocaleString(), [points]);

  if (!userId) return null;

  return (
    <div className="relative select-none">
      <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white px-3 py-1 shadow-sm ring-1 ring-brand-400/40">
        <Star className="w-4 h-4 drop-shadow-sm animate-pulse" />
        <span className="text-sm font-semibold">{formatted}</span>
      </div>

      {burst && (
        <div className="absolute -top-3 -right-2">
          <span className="text-xs font-bold text-brand-700 bg-brand-100 border border-brand-200 rounded-full px-2 py-0.5 animate-[pop_1400ms_ease-out_forwards]">
            +{burst.delta}
          </span>
        </div>
      )}

      {/* lightweight confetti */}
      {burst && (
        <div className="pointer-events-none absolute -top-4 -left-4 w-24 h-12">
          {Array.from({ length: 10 }).map((_, i) => (
            <i
              key={i}
              className="absolute block w-1.5 h-2 rounded-sm"
              style={{
                left: `${8 + i * 7}px`,
                background: i % 2 ? '#ec4899' : '#6366f1',
                transform: `rotate(${(i % 5) * 18}deg)`,
                animation: `confetti 900ms ease-out ${i * 30}ms forwards`,
              }}
            />
          ))}
        </div>
      )}

      <style>
        {`
        @keyframes pop { 0% { transform: translateY(4px) scale(0.9); opacity: .0 } 20% { transform: translateY(0) scale(1); opacity: 1 } 100% { transform: translateY(-12px); opacity: 0 } }
        @keyframes confetti { 0% { opacity: 0; transform: translateY(0) scale(1) } 10% { opacity: 1 } 100% { opacity: 0; transform: translateY(18px) scale(.9) rotate(25deg) } }
        `}
      </style>
    </div>
  );
};
