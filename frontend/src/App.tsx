/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DnaBackground } from './components/DnaBackground';
import { Header } from './components/Header';
import { ChatSection } from './components/ChatSection';

export default function App() {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 overflow-x-hidden selection:bg-sky-500/30 selection:text-sky-200">
      {/* 3D Realistic Single-Colored DNA Double Helix Slowly Spinning (Completely Local) */}
      <DnaBackground speed={0.8} opacity={0.75} />

      {/* Atmospheric Depth Gradient (Pure CSS, completely offline) */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-radial from-transparent via-slate-950/40 to-slate-950/85" />

      {/* Main Content Area */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header with small PrionLM logo at top-left */}
        <Header onReset={handleReset} showReset={false} />

        {/* Central Chat / Q&A Section */}
        <main className="flex flex-1 flex-col items-center justify-center py-6 sm:py-12">
          <ChatSection key={resetKey} />
        </main>
      </div>
    </div>
  );
}
