import React from 'react';
import { ArenaId } from '../types/game';
import { ARENAS } from '../data/arenas';

interface ArenaBackgroundProps {
  arenaId: ArenaId;
  children?: React.ReactNode;
  intensity?: 'normal' | 'intense';
}

export const ArenaBackground: React.FC<ArenaBackgroundProps> = ({
  arenaId,
  children,
  intensity = 'normal',
}) => {
  const arena = ARENAS.find((a) => a.id === arenaId) || ARENAS[0];

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-65px)] overflow-hidden bg-slate-950 flex flex-col justify-between">
      {/* Background Image / Gradient Fallback */}
      {arena.bgImagePath ? (
        <div className="absolute inset-0 z-0">
          <img
            src={arena.bgImagePath}
            alt={arena.name}
            className="w-full h-full object-cover object-center filter brightness-60 contrast-110 transform scale-102 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          {/* Vignette & Atmospheric Gradients */}
          <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80" />
        </div>
      ) : (
        <div className={`absolute inset-0 z-0 bg-gradient-to-b ${arena.colorScheme}`}>
          <div className="absolute inset-0 bg-radial from-transparent via-slate-950/70 to-slate-950" />
        </div>
      )}

      {/* Ambient Particle System Effect (Procedural CSS) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        {arena.ambientType === 'embers' && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#f97316_0%,transparent_70%)] opacity-40 animate-pulse" />
        )}
        {arena.ambientType === 'leaves' && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#10b981_0%,transparent_65%)] opacity-35" />
        )}
        {arena.ambientType === 'cyber' && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf615_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        )}
        {arena.ambientType === 'snow' && (
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 animate-pulse" />
        )}
        {arena.ambientType === 'stars' && (
          <div className="absolute inset-0 bg-[radial-gradient(#f8fafc_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
        )}
      </div>

      {/* Screen Intensity Glow (on ultimate / critical) */}
      {intensity === 'intense' && (
        <div className="absolute inset-0 z-10 pointer-events-none bg-red-600/15 animate-pulse mix-blend-screen" />
      )}

      {/* Main Content Container */}
      <div className="relative z-20 flex-1 flex flex-col w-full h-full">
        {children}
      </div>
    </div>
  );
};
