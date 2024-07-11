'use client';
import { useState, useEffect } from 'react';
import { PlayerObject, TreasureObject, IslandObject } from '@/lib/Types';
import Treasure from './Treasure';
import Seeker from './Seeker';
import { useDrop } from 'react-dnd';
import { useGameProvider } from '@/lib/Provider';
import { Description, Field, Label, Switch, Button } from '@headlessui/react'

interface IslandProps {
  island: IslandObject;
}

// For tailwindcss, these need to exist as hard code somewhere
const gridCols = [
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
    "grid-cols-7",
    "grid-cols-8",
    "grid-cols-9",
    "grid-cols-10",
]

const Island: React.FC<IslandProps> = ({ island }) => {
    
    const {selectedTreasures, 
        addSelectedTreasuresToIsland, 
        toggleIslandMode, 
        addSelectedSeekersToIsland, 
        selectedSeekers, 
        activePlayer,
        resolveIsland,
        activeMode
    } = useGameProvider();
    const [showPreview, setShowPreview] = useState(false);
    const [cols, setCols] = useState(1)

    useEffect(()=>{
        const count = island.treasures.length + (island.mode === 'hide' ? selectedTreasures.length : 0);
        setCols(Math.ceil(Math.sqrt(count)) + 1);
    }, [island.size, selectedTreasures.length, island.mode])


  return (
    <div className="flex flex-col justify-start items-center">
        <h3 className="text-2xl font-bold">{island.name}</h3>
            
        <div className={`grid grid-cols-${cols} gap-0 p-0 border border-gray-200 rounded`}>
            {Array.from({ length: cols**2 }).map((_, index) => {
                const treasure = island.mode === 'hide' && island.treasures.length > index;
                const playerTreasure = treasure && island.treasures[index].owner === activePlayer.id
                const selectedTreasure = selectedTreasures.length + island.treasures.length > index && !treasure && island.mode === 'hide';
                const seeker = island.mode === 'seek' && island.seekers.length > index;
                const playerSeeker = seeker && island.seekers[index].owner === activePlayer.id
                const selectedSeeker = selectedSeekers.length + island.seekers.length > index && !seeker && island.mode === 'seek';

                return (
                    <div
                        onMouseEnter={() => setShowPreview(true)}
                        onMouseLeave={() => setShowPreview(false)}
                        onClick={() => island.mode === activeMode ? island.mode === 'hide' ? addSelectedTreasuresToIsland(island.id) : addSelectedSeekersToIsland(island.id) : null}
                        key={index} className={`p-0 m-0 border rounded shadow h-8 w-8 ${playerTreasure || playerSeeker ? "bg-red-500" : treasure || seeker ? "bg-red-300" : selectedTreasure || selectedSeeker ? "bg-blue-500" : "bg-gray-500"}`}>
                        {showPreview && treasure && playerTreasure && (
                            <Treasure treasure={island.treasures[index]} />
                        )}
                        {showPreview && selectedTreasure && (
                            <Treasure treasure={selectedTreasures[index - island.treasures.length]} />
                        )}
                        {showPreview && seeker && playerSeeker && (
                            <Seeker seeker={island.seekers[index]} />
                        )}
                        {showPreview && selectedSeeker && (
                            <Seeker seeker={selectedSeekers[index - island.seekers.length]} />
                        )}
                    </div>
                )
            })}
        </div>

        <div className="flex flex-col">
                    <Field>
                    <Label>{island.mode === 'hide' ? "Hide" : "Seek"}</Label>
                        <Switch
                        checked={island.mode === 'hide'}
                        onChange={() => toggleIslandMode(island.id)}
                        className="group inline-flex h-6 w-11 items-center rounded-full bg-green-400 transition data-[checked]:bg-red-600"
                        >
                        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                        </Switch>
                    </Field>
                    {island.mode === 'seek' && island.seekers.length > 0 && (
                    <Field>
                        <Button className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
                        onClick={() => resolveIsland(island.id)}>Resolve</Button>
                    </Field>
                    )}
                </div>
        <div>
            <p>Value: {island.value}</p>
            <p>Hidden: {island.treasures.length}</p>
            <p>Seekers: {island.seekers.length}</p>
            <p>Size: {island.size}</p>
            <p>Price: {island.price}</p>
            <p>Balance: {island.balance}</p>
        </div>
        
    </div>
    
  );
};

export default Island;
