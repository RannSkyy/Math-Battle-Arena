/**
 * Math Battle Arena - Media Pembelajaran Matematika Berbasis Game RPG Battle untuk SMP
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { MatchConfig, TeamState, Question, BattleEventLog } from './types/game';
import { Navbar } from './components/Navbar';
import { SplashScreen } from './views/SplashScreen';
import { HomeScreen } from './views/HomeScreen';
import { SetupMatchScreen } from './views/SetupMatchScreen';
import { BattleScreen } from './views/BattleScreen';
import { ResultScreen } from './views/ResultScreen';
import { TeacherDashboardScreen } from './views/TeacherDashboardScreen';
import { MateriScreen } from './views/MateriScreen';
import { PracticeScreen } from './views/PracticeScreen';
import { HistoryScreen } from './views/HistoryScreen';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'splash' | 'home' | 'setup' | 'battle' | 'result' | 'dashboard' | 'materi' | 'practice' | 'history'
  >('splash');

  const [activeConfig, setActiveConfig] = useState<MatchConfig | null>(null);
  const [matchResultSummary, setMatchResultSummary] = useState<{
    winner: 'A' | 'B';
    winnerTeamName: string;
    teamAState: TeamState;
    teamBState: TeamState;
    totalQuestions: number;
    eventLogs: BattleEventLog[];
    durationSeconds: number;
    reviewedQuestions: Array<{
      question: Question;
      answeredBy: string;
      team: 'A' | 'B';
      isCorrect: boolean;
      chosenAnswer: string;
    }>;
  } | null>(null);

  // Manage Background Music: Calm/Relaxing during Menus & Pages, Exciting during Battle
  React.useEffect(() => {
    if (currentView === 'battle') {
      soundEngine.startBattleBGM();
    } else if (currentView !== 'splash') {
      soundEngine.startMenuBGM();
    }

    // Auto-unlock audio on first user interaction if blocked by browser policy
    const handleFirstInteraction = () => {
      if (!soundEngine.getIsBgmMuted()) {
        if (currentView === 'battle') {
          soundEngine.startBattleBGM();
        } else if (currentView !== 'splash') {
          soundEngine.startMenuBGM();
        }
      }
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [currentView]);

  // Start new match from setup
  const handleStartMatch = (config: MatchConfig) => {
    setActiveConfig(config);
    setCurrentView('battle');
  };

  // Match finished
  const handleMatchFinish = (summary: {
    winner: 'A' | 'B';
    winnerTeamName: string;
    teamAState: TeamState;
    teamBState: TeamState;
    totalQuestions: number;
    eventLogs: BattleEventLog[];
    durationSeconds: number;
    reviewedQuestions: Array<{
      question: Question;
      answeredBy: string;
      team: 'A' | 'B';
      isCorrect: boolean;
      chosenAnswer: string;
    }>;
  }) => {
    setMatchResultSummary(summary);
    setCurrentView('result');
  };

  // Rematch with same team configuration
  const handleRematch = () => {
    if (activeConfig) {
      setCurrentView('battle');
    } else {
      setCurrentView('setup');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Bar Navigation (Hidden during splash and battle to guarantee full viewport visibility) */}
      {currentView !== 'splash' && currentView !== 'battle' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view as typeof currentView)}
          inBattle={false}
        />
      )}

      {/* Main View Router with Smooth Transitions */}
      <main className="flex-1 flex flex-col w-full relative">
        <div key={currentView} className="w-full flex-1 flex flex-col page-enter-transition">
          {currentView === 'splash' && (
            <SplashScreen
              onStart={() => setCurrentView('home')}
              onOpenGuide={() => setCurrentView('home')}
            />
          )}

          {currentView === 'home' && (
            <HomeScreen
              onSelectMode={(mode) => setCurrentView(mode)}
            />
          )}

          {currentView === 'setup' && (
            <SetupMatchScreen
              onStartMatch={handleStartMatch}
              onCancel={() => setCurrentView('home')}
            />
          )}

          {currentView === 'battle' && activeConfig && (
            <BattleScreen
              config={activeConfig}
              onMatchFinish={handleMatchFinish}
              onExit={() => setCurrentView('home')}
            />
          )}

          {currentView === 'result' && matchResultSummary && (
            <ResultScreen
              summary={matchResultSummary}
              onRematch={handleRematch}
              onHome={() => setCurrentView('home')}
            />
          )}

          {currentView === 'dashboard' && <TeacherDashboardScreen />}

          {currentView === 'materi' && <MateriScreen />}

          {currentView === 'practice' && <PracticeScreen />}

          {currentView === 'history' && (
            <HistoryScreen
              onBack={() => setCurrentView('home')}
              onNewMatch={() => setCurrentView('setup')}
            />
          )}
        </div>
      </main>
    </div>
  );
}
