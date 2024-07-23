import * as React from "react";
import { useGameProvider } from "../lib/Provider";
import { Timer } from "./Timer";

export const PlayersData = () => {
    const { players, events } = useGameProvider();


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
                {plus_minus !== 0 && (
                    <p className={`text-[0.5rem] ${plus_minus >= 0 ? "text-green-500" : "text-red-500"}`}>{plus_minus >= 0 ? "+" : ""}{difference} ({plus_minus.toFixed(2)}%)</p>
                )}
                
                <p>Balance: {player.balance}</p>
                <p>Treasures: {player.inventory.length}</p>
                <p>Treasures Hidden: {player.inventory.filter((treasure) => treasure.location == "island").length}</p>
                <p>Treasure Value: {player.inventory.reduce((acc, treasure) => acc + treasure.value, 0)}</p>
                <p>Seekers: {player.seekers.length}</p>
                <p>Seekers Deployed: {player.seekers.filter((seeker) => seeker.location == "island").length}</p>
                
                <div className="overflow-y-auto max-h-60 divide-y">
                {events && events.length > 0 && events.filter((event) => event.player_id === player.id).sort((a, b) => b.timestamp - a.timestamp).map((event) => {
                    console.log("event", event)
                    const difference = (event.after - event.before) + event.value;
                    return (
                    <div className="flex flex-col text-[0.5rem] " key={event.id}>
                        
                        <div> {event.message}</div>
                        <div className="grid grid-cols-4 justify-between">
                            
                            <div className="col-span-2">
                            <Timer deadline={event.timestamp} />
                            </div>
                            <div>
                            {event.before !== event.after && (`${event.before} ->`)}
                            <span className={`${event.before < event.after ? "text-green-500" : event.before === event.after ? "text-black" : "text-red-500"}`}>{event.after}</span>
                            </div>
                            
                            <div className={`text-right ${difference >= 0 ? "text-green-500" : "text-red-500"}`}>{difference >= 0 ? "+" : ""}{difference}</div>
                        </div>
                            

                    </div>
                    )}
                    )}
                </div>
                  
                
                
            </div>
            )
        }
        )}
        
    </div>
    );
};

