import * as React from "react";
import { useGameProvider } from "@/lib/Provider";
import { Button } from "@headlessui/react";

export default function Nav() {
    const { activePlayer, activeMode, updateActiveMode, updateActivePlayer } = useGameProvider();

    return (
        <nav className="flex flex-col justify-between items-center bg-black text-white w-full">
        <div className="flex flex-col justify-between items-center gap-2">
            <h1 className="text-2xl font-bold">NORI Treasure Hunt</h1>
            <div className="flex flex-row justify-between items-center gap-1">
                <p>{activePlayer.name}</p>
                <p>{activePlayer.balance}</p>
            </div>
        </div>
        <div className="flex flex-row justify-between items-center gap-2">
            <Button onClick={() => {
                updateActiveMode("hide");
                
            }}
            className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
            >HIDE</Button>
            <Button onClick={() => {
                updateActiveMode("seek");
                
            }}
            className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
            >SEEK</Button>
            <Button onClick={() => {
                updateActiveMode("inventory");
                
            }}
            className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
            >INVENTORY</Button>
        </div>
    </nav>
    );
}

