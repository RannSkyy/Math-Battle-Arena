import React from 'react';
import { BuffType, DebuffType } from '../types/game';
import { Shield, Sparkles, Flame, Heart, Zap, Snowflake, Skull, EyeOff, TrendingDown, RefreshCcw } from 'lucide-react';

interface HealthBarProps {
  team: 'A' | 'B';
  teamName: string;
  characterName: string;
  hp: number;
  maxHp: number;
  ultimateGauge: number; // 0 to 6
  combo: number;
  activeBuffs: BuffType[];
  activeDebuffs: DebuffType[];
  currentPlayer: string;
  playerIndex: number;
  totalPlayers: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  team,
  teamName,
  characterName,
  hp,
  maxHp,
  ultimateGauge,
  combo,
  activeBuffs,
  activeDebuffs,
  currentPlayer,
  playerIndex,
  totalPlayers,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const isDanger = hpPercent <= 25;
  const isUltimateReady = ultimateGauge >= 6;

  // Buff icon helper
  const renderBuffBadge = (buff: BuffType, idx: number) => {
    switch (buff) {
      case 'ATTACK_UP':
        return (
          <span key={idx} title="Attack Up +2 DMG" className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
            <Flame className="w-3 h-3 text-amber-400" /> ATK+
          </span>
        );
      case 'CRITICAL_BOOST':
        return (
          <span key={idx} title="Critical Chance +30%" className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
            <Zap className="w-3 h-3 text-rose-400" /> CRIT+
          </span>
        );
      case 'SHIELD':
        return (
          <span key={idx} title="Shield: Tahan 1 Serangan" className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
            <Shield className="w-3 h-3 text-cyan-400" /> SHIELD
          </span>
        );
      case 'HEAL':
        return (
          <span key={idx} title="Heal +5 HP" className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
            <Heart className="w-3 h-3 text-emerald-400" /> HEAL
          </span>
        );
      case 'COMBO_SAVER':
        return (
          <span key={idx} title="Combo Saver: Mencegah Reset Combo" className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">
            <RefreshCcw className="w-3 h-3 text-purple-400" /> SAVER
          </span>
        );
      case 'DOUBLE_DAMAGE':
        return (
          <span key={idx} title="Double Damage 2x!" className="inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-300 bg-yellow-950/80 px-2 py-0.5 rounded border border-yellow-500/40 animate-pulse">
            <Flame className="w-3 h-3 text-yellow-400" /> 2X DMG
          </span>
        );
    }
  };

  const renderDebuffBadge = (debuff: DebuffType, idx: number) => {
    switch (debuff) {
      case 'FREEZE':
        return (
          <span key={idx} title="Freeze: Waktu berkurang" className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/40">
            <Snowflake className="w-3 h-3 text-sky-400" /> BEKU
          </span>
        );
      case 'POISON':
        return (
          <span key={idx} title="Poison: -2 HP" className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/50">
            <Skull className="w-3 h-3 text-emerald-400" /> RACUN
          </span>
        );
      case 'BLIND':
        return (
          <span key={idx} title="Blind" className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-600">
            <EyeOff className="w-3 h-3 text-slate-400" /> BLIND
          </span>
        );
      case 'DAMAGE_DOWN':
        return (
          <span key={idx} title="Damage Down" className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">
            <TrendingDown className="w-3 h-3 text-red-400" /> ATK-
          </span>
        );
      case 'COMBO_BREAK':
        return (
          <span key={idx} title="Combo Break" className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-300 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/40">
            BROKEN
          </span>
        );
    }
  };

  const isLeft = team === 'A';

  return (
    <div className={`flex flex-col gap-1.5 w-full max-w-md ${isLeft ? 'items-start' : 'items-end'}`}>
      {/* Top Header: Team Name, Character, and Active Player */}
      <div className={`flex items-center gap-2 ${isLeft ? 'flex-row' : 'flex-row-reverse'} w-full justify-between`}>
        <div className={`flex items-baseline gap-2 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
          <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded text-white shadow-sm"
            style={{ backgroundColor: isLeft ? '#2563eb' : '#dc2626' }}>
            {teamName}
          </span>
          <span className="text-xs text-slate-400 font-medium">{characterName}</span>
        </div>

        {/* Current Active Student */}
        <div className={`text-xs flex items-center gap-1 text-slate-300 ${isLeft ? 'text-left' : 'text-right'}`}>
          <span className="text-slate-400">Pemain:</span>
          <span className="font-semibold text-amber-300">{currentPlayer || `Siswa ${playerIndex + 1}`}</span>
          <span className="text-slate-500 text-[10px]">({playerIndex + 1}/{totalPlayers})</span>
        </div>
      </div>

      {/* Main HP Bar Gauge */}
      <div className="relative w-full h-7 bg-slate-900 rounded-lg p-1 border border-slate-700/80 shadow-inner overflow-hidden">
        {/* HP Fill */}
        <div
          className={`h-full rounded-md transition-all duration-500 flex items-center ${
            isLeft ? 'justify-start pl-2' : 'justify-end pr-2'
          } ${
            isDanger
              ? 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse'
              : isLeft
              ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400'
              : 'bg-gradient-to-l from-red-600 via-orange-500 to-amber-400'
          }`}
          style={{ width: `${hpPercent}%` }}
        />

        {/* Numerical HP Center Overlay */}
        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] pointer-events-none">
          <span className="tabular-nums">{hp}</span> / {maxHp} HP
        </div>
      </div>

      {/* Bottom Sub-HUD: Ultimate Gauge & Combos & Buffs */}
      <div className={`flex items-center gap-3 w-full ${isLeft ? 'flex-row justify-between' : 'flex-row-reverse justify-between'}`}>
        {/* Ultimate Pips (6 steps) */}
        <div className="flex items-center gap-1.5" title={`Ultimate Gauge: ${ultimateGauge}/6`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className={`w-3 h-3 ${isUltimateReady ? 'text-amber-400 animate-spin' : 'text-slate-500'}`} />
            ULT
          </span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4, 5].map((pip) => {
              const filled = pip < ultimateGauge;
              return (
                <div
                  key={pip}
                  className={`w-3.5 h-2.5 rounded-xs transition-all duration-300 ${
                    filled
                      ? isUltimateReady
                        ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse'
                        : 'bg-sky-400 shadow-[0_0_4px_rgba(56,189,248,0.6)]'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                />
              );
            })}
          </div>
          {isUltimateReady && (
            <span className="text-[10px] font-extrabold text-amber-300 animate-bounce tracking-widest ml-1">
              READY!
            </span>
          )}
        </div>

        {/* Combo Multiplier Indicator */}
        {combo >= 2 && (
          <div className="flex items-center gap-1 font-mono font-black text-xs text-amber-400 animate-pulse bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 shadow-sm">
            <span>COMBO x{combo}</span>
          </div>
        )}
      </div>

      {/* Active Buffs & Debuffs Badges List */}
      {(activeBuffs.length > 0 || activeDebuffs.length > 0) && (
        <div className={`flex flex-wrap items-center gap-1 mt-0.5 ${isLeft ? 'justify-start' : 'justify-end'}`}>
          {activeBuffs.map(renderBuffBadge)}
          {activeDebuffs.map(renderDebuffBadge)}
        </div>
      )}
    </div>
  );
};
