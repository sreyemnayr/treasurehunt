'use client';

import Image from "next/image";
import HideTreasure from "@/components/HideTreasure";
import { useGameProvider } from "@/lib/Provider";
import { GameProvider } from "@/lib/Provider";

export default function Home() {
  
  return (
    <GameProvider>
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <HideTreasure />
      </div>
    </main>
    </GameProvider>
  );
}
