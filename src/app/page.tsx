'use client';

import Image from "next/image";
import HideTreasure from "@/components/HideTreasure";
import { useGameProvider } from "@/lib/Provider";
import { GameProvider } from "@/lib/Provider";
import Cursors from "@/components/Cursors";
import AdminButton from "@/components/AdminButton";
import AdminStuff from "@/components/AdminStuff";
import Nav from "@/components/Nav";

export default function Home() {

  
  return (
    <GameProvider>
      <main className="flex min-h-screen flex-col items-center">
      <Nav />
      <Cursors />
      <div className="z-10 w-full max-w-5xl items-center font-mono text-sm lg:flex">
        <HideTreasure />
      </div>
      <AdminStuff />
      <AdminButton />
    </main>
    </GameProvider>
  );
}
