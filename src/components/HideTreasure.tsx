import React from 'react';
import TreasureBox from './TreasureBox';
import SeekerBox from './SeekerBox';
import Island from './Island';
import { TreasureObject, PlayerObject } from '@/lib/Types';
import { useGameProvider } from '@/lib/Provider';
import { Description, Field, Label, Switch, Select, Button } from '@headlessui/react'
import { PlayersData } from './PlayersData';
import AdminStuff from './AdminStuff';


const HideTreasure: React.FC = () => {
    const {activePlayer, islands, players, activeMode, updateActivePlayer, updateActiveMode, resetGame, toggleAdmin, admin} = useGameProvider();
    
  return (
    <>
    
    <div className="w-full flex  md:flex-row   flex-col">
        
        {activeMode !== "seek" && <TreasureBox player={activePlayer} />}
        {activeMode !== "hide" && <SeekerBox player={activePlayer} />}
        
            <div className={`flex flex-row justify-start gap-2`}>
            {islands.filter((island) => island.mode === activeMode).map((island) => (
                <div key={island.id} className={`${activeMode !== island.mode ? "opacity-50" : ""}`}>
                    <Island island={island} />
                </div>
            ))}
            </div>

            
        
    </div>
    
</>
    );

};

export default HideTreasure;

