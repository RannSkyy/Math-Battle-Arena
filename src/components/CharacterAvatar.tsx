import React, { useState } from 'react';
import { CharacterId } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { Shield, Sparkles, Zap, Cpu, Eye, Anchor, Crosshair, Award } from 'lucide-react';

interface CharacterAvatarProps {
  characterId: CharacterId;
  team: 'A' | 'B';
  state?: 'idle' | 'attack' | 'hit' | 'ultimate' | 'victory' | 'defeat';
  hasShield?: boolean;
  isHealing?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  team,
  state = 'idle',
  hasShield = false,
  isHealing = false,
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);
  const char = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];

  const getFallbackIcon = () => {
    const props = { className: 'w-1/2 h-1/2 drop-shadow-md text-white' };
    switch (char.id) {
      case 'knight': return <Shield {...props} />;
      case 'mage': return <Sparkles {...props} />;
      case 'samurai': return <Zap {...props} />;
      case 'robot': return <Cpu {...props} />;
      case 'ninja': return <Eye {...props} />;
      case 'pirate': return <Anchor {...props} />;
      case 'archer': return <Crosshair {...props} />;
      case 'guardian': return <Award {...props} />;
    }
  };

  // Dimensions
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    hero: 'w-48 h-48 sm:w-60 sm:h-60',
  }[size];

  // Animation transforms based on state
  let animClass = 'transition-all duration-300';
  if (state === 'idle') {
    animClass += ' animate-float-idle';
  } else if (state === 'attack') {
    animClass += team === 'A' ? ' translate-x-14 scale-110' : ' -translate-x-14 scale-110';
  } else if (state === 'hit') {
    animClass += ' animate-shake-intense filter drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]';
  } else if (state === 'ultimate') {
    animClass += (team === 'A' ? ' translate-x-16 scale-125' : ' -translate-x-16 scale-125') + ' animate-pulse-glow';
  } else if (state === 'victory') {
    animClass += ' -translate-y-4 scale-105 animate-bounce';
  } else if (state === 'defeat') {
    animClass += ' opacity-50 grayscale translate-y-4';
  }

  const teamBorder = team === 'A' ? 'border-blue-500 shadow-blue-500/40' : 'border-red-500 shadow-red-500/40';

  const containerWidthClass = {
    sm: 'w-16',
    md: 'w-32',
    lg: 'w-44',
    hero: 'w-52 sm:w-64',
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center shrink-0 ${containerWidthClass} select-none ${animClass}`}>
      {/* Outer Card Frame with Portrait Image strictly centered */}
      <div className={`relative ${sizeClasses} shrink-0 mx-auto flex items-center justify-center`}>
        {/* Healing Aura */}
        {isHealing && (
          <div className="absolute inset-0 rounded-2xl border-4 border-emerald-400 animate-ping opacity-75" />
        )}

        {/* Protective Shield Barrier */}
        {hasShield && (
          <div className="absolute -inset-3 rounded-2xl border-2 border-cyan-400 bg-cyan-500/20 animate-pulse backdrop-blur-xs flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)] z-20">
            <Shield className="w-8 h-8 text-cyan-300 opacity-80 drop-shadow" />
          </div>
        )}

        <div
          className={`relative w-full h-full rounded-2xl p-1 flex items-center justify-center overflow-hidden shadow-2xl border-2 ${teamBorder}`}
          style={{
            background: `radial-gradient(circle at 35% 30%, ${char.elementColor}44, #090d16 85%)`,
            boxShadow: `0 8px 30px -4px ${char.elementColor}66`,
          }}
        >
          {/* Real Character Portrait Image centered */}
          {!imgError && char.imagePath ? (
            <img
              src={char.imagePath}
              alt={char.name}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center rounded-xl filter contrast-105 brightness-105"
            />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-1">
              {getFallbackIcon()}
              <span className="mt-1 font-bold text-xs uppercase tracking-wider text-slate-100 leading-tight">
                {char.name}
              </span>
            </div>
          )}

          {/* Subtle Border Vignette (does not obscure character) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Teks nama karakter menampilkan semua teks lengkap tanpa terpotong (tanpa truncate), dengan tinggi konsisten agar gambar tetap di tengah dan tidak bergeser */}
      <div
        className={`mt-2 w-full min-h-[36px] px-2 py-1 rounded-xl flex items-center justify-center text-center font-black tracking-wide text-white uppercase text-[10px] sm:text-[11px] leading-snug break-words z-10 shadow-md transition-all ${
          team === 'A'
            ? 'bg-gradient-to-r from-blue-700 to-sky-600 border border-blue-400/50'
            : 'bg-gradient-to-r from-red-700 to-orange-600 border border-red-400/50'
        }`}
        title={`${char.name} · ${team === 'A' ? 'TIM KIRI' : 'TIM KANAN'}`}
      >
        <span className="w-full text-center">{char.name}</span>
      </div>
    </div>
  );
};
