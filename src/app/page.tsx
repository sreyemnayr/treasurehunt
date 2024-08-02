'use client';

import Image from "next/image";
import HideTreasure from "@/components/HideTreasure";
import HexGrid from "@/components/HexGrid";
import { useGameProvider } from "@/lib/Provider";
import { GameProvider } from "@/lib/Provider";
import Cursors from "@/components/Cursors";
import AdminButton from "@/components/AdminButton";
import AdminStuff from "@/components/AdminStuff";
import Nav from "@/components/Nav";

export default function Home() {

  
  return (
    <GameProvider>
      <main className="flex min-h-screen flex-col items-center bg-black">
      <Nav />
      <Cursors />
      <div className="z-10 w-full max-w-5xl h-screen flex-1 items-stretch font-mono text-sm lg:flex">
       
        <HexGrid />
      </div>
      <AdminStuff />
      <AdminButton />
    </main>
    </GameProvider>
  );
}
