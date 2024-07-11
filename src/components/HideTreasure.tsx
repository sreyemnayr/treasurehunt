import React from 'react';
import TreasureBox from './TreasureBox';
import SeekerBox from './SeekerBox';
import Island from './Island';
import { TreasureObject, PlayerObject } from '@/lib/Types';
import { useGameProvider } from '@/lib/Provider';
import { Description, Field, Label, Switch, Select } from '@headlessui/react'

const HideTreasure: React.FC = () => {
    const {activePlayer, islands, players, activeMode, updateActivePlayer, updateActiveMode} = useGameProvider();
    
  return (
    <div className="w-full">
        <Field>
            <Label>Game Mode</Label>
         <Select name="status" aria-label="Project status" value={activeMode} onChange={(e) => updateActiveMode(e.target.value as 'hide' | 'seek' | 'inventory' | 'setup')}>
            <option value="hide">Hide</option>
            <option value="seek">Seek</option>
            <option value="inventory">Inventory</option>
            <option value="setup">Setup</option>
        </Select>
        </Field>
        <Field>
            <Label>Active Player</Label>
            <Select name="players" aria-label="Project status" value={activePlayer.id} onChange={(e) => updateActivePlayer(e.target.value as string)}>
            {players.map((player) => (
                <option key={player.id} value={player.id}>{player.name} - {player.balance}</option>
            ))}
            
        </Select>
        </Field>
        {activeMode !== "seek" && <TreasureBox player={activePlayer} />}
        {activeMode !== "hide" && <SeekerBox player={activePlayer} />}
        
            <div className={`flex flex-row justify-start gap-2`}>
            {islands.map((island) => (
                <div className={`${activeMode !== island.mode ? "opacity-50" : ""}`}>
                    <Island key={island.id} island={island} />
                </div>
            ))}
            </div>
        
        <div className="flex flex-row justify-start gap-2 overflow-x-scroll w-100 text-xs border border-1 border-solid mt-6">
            {players.filter((player) => player.balance !== 100000).map((player) => {
                const netWorth = player.balance + player.inventory.reduce((acc, treasure) => acc + treasure.value, 0);
                const difference = netWorth - 100000;
                const plus_minus = (difference / 100000) * 100;
                return(
                <div key={player.id} className="flex flex-col justify-start gap-2">
                    <p>{player.name}</p>
                    <p>Net Worth: {netWorth}</p>
                    <p>+/-: {plus_minus.toFixed(2)}%</p>
                    <p>Balance: {player.balance}</p>
                    <p>Treasures: {player.inventory.length}</p>
                    <p>Treasure Value: {player.inventory.reduce((acc, treasure) => acc + treasure.value, 0)}</p>
                    <p>Seekers: {player.seekers.length}</p>
                </div>
                )
            }
            )}
        </div>
    </div>
    );

};

export default HideTreasure;

