import * as React from "react";
import { useGameProvider } from "../lib/Provider";

export const PlayersData = () => {
    const { players } = useGameProvider();

    return (
        <div className="flex flex-row justify-start gap-2 overflow-x-scroll w-100 text-xs border border-1 border-solid mt-6 ">
        {players.filter((player) => player.balance !== 100000).map((player) => {
            const netWorth = player.balance + player.inventory.reduce((acc, treasure) => acc + treasure.value, 0);
            const difference = netWorth - 100000;
            const plus_minus = (difference / 100000) * 100;
            return(
            <div key={player.id} className="flex flex-col justify-start gap-2 bg-amber-100 text-xs">
                <p>{player.name}</p>
                <p>Net Worth: {netWorth}</p>
                <p>+/-: {plus_minus.toFixed(2)}%</p>
                <p>Balance: {player.balance}</p>
                <p>Treasures: {player.inventory.length}</p>
                <p>Treasures Hidden: {player.inventory.filter((treasure) => treasure.location == "island").length}</p>
                <p>Treasure Value: {player.inventory.reduce((acc, treasure) => acc + treasure.value, 0)}</p>
                <p>Seekers: {player.seekers.length}</p>
                <p>Seekers Deployed: {player.seekers.filter((seeker) => seeker.location == "island").length}</p>
            </div>
            )
        }
        )}
    </div>
    );
};

