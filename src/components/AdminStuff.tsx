import * as React from "react";
import { TreasureObject, PlayerObject } from '@/lib/Types';
import { useGameProvider } from '@/lib/Provider';
import { Description, Field, Label, Switch, Select, Button } from '@headlessui/react'
import { PlayersData } from './PlayersData';

export default function AdminStuff() {
    const { admin, activeMode, activePlayer, players, updateActiveMode, updateActivePlayer, resetGame } = useGameProvider();

    if (!admin) {
        return (<></>);
    }

    return (

        <div className="flex flex-col gap-2 py-20">
            <h2>Admin Stuff</h2>
            
        <PlayersData />
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
        <Button className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700" onClick={resetGame}>Reset Game</Button>
        </div>
    )
}

