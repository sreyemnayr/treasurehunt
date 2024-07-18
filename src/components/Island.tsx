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

const backgroundTile = (cols: number, index: number, treasure: boolean = false, seeker: boolean = false) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    if (col === 0 && row === 0) {
        return "bg-[url('/img/island/TOP_LEFT.png')]";
    }
    if (col == 0 && row == cols - 1) {
        return "bg-[url('/img/island/BOTTOM_LEFT.png')]";
    }

    
    if (col == cols - 1 && row == 0) {
        return "bg-[url('/img/island/TOP_RIGHT.png')]";
    }
    if (col == cols - 1 && row == cols - 1) {
        return "bg-[url('/img/island/BOTTOM_RIGHT.png')]";
    }
    if (col == cols - 1) {
        return "bg-[url('/img/island/RIGHT.png')]";
    }
    if (row == cols - 1) {
        return "bg-[url('/img/island/BOTTOM.png')]";
    }
    if (col == 0) {
        return "bg-[url('/img/island/LEFT.png')]";
    }
    if (row == 0) {
        return "bg-[url('/img/island/TOP.png')]";
    }
    if (treasure) {
        return "bg-[url('/img/island/CENTER_HIDDEN.png')]";
    }
    if (seeker) {
        return "bg-[url('/img/island/CENTER_DUG.png')]";
    }
    return "bg-[url('/img/island/CENTER.png')]";
}

const centerTile = (cols: number, index: number) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    if (col === 0) {
        return false;
    }
    if (col == cols - 1) {
        return false;
    }
    if (row == cols - 1) {
        return false;
    }
    if (row == 0) {
        return false;
    }
    return true;
}

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
    }, [island.size, selectedTreasures.length, island.treasures.length, island.mode])


  return (
    <div className="flex flex-col justify-start items-center">
        <h3 className="text-2xl font-bold">{island.name}</h3>
            
        <div className={`grid grid-cols-${cols+2} gap-0 p-0 `}>
            {Array.from({ length: (cols+2)**2 }).map((_, super_index) => {
                const row = Math.floor(super_index / (cols+2));
                const col = super_index % (cols+2);
                const center = centerTile(cols+2, super_index);
                
                const index = (row == (cols+1) || row == 0 || col == 0 || col == (cols+1)) ? -1 : super_index - ((cols+1) + (row*2));
                

                const treasure = center && island.mode === 'hide' && island.treasures.length > index;
                const playerTreasure = treasure && island.treasures[index].owner === activePlayer.id
                const selectedTreasure = center && selectedTreasures.length + island.treasures.length > index && !treasure && island.mode === 'hide';
                const seeker = center && island.mode === 'seek' && island.seekers.length > index;
                const playerSeeker = seeker && island.seekers[index].owner === activePlayer.id
                const selectedSeeker = center && selectedSeekers.length + island.seekers.length > index && !seeker && island.mode === 'seek';
                

                return (
                    <div key={super_index} className={`h-10 w-10 p-0 m-0 ${backgroundTile(cols+2, super_index, treasure, seeker)} bg-cover bg-opacity-100  ${center ? 'border-[1px] border-amber-800 border-opacity-5' : ''}`}>
                        <div
                            onMouseEnter={() => setShowPreview(true)}
                            onMouseLeave={() => setShowPreview(false)}
                            onClick={() => island.mode === activeMode ? island.mode === 'hide' ? addSelectedTreasuresToIsland(island.id) : addSelectedSeekersToIsland(island.id) : null}
                            key={index} className={`p-0 m-0 ${center ? 'hover:border hover:rounded hover:shadow' : ''} h-full w-full ${playerTreasure || playerSeeker ? "bg-opacity-20 bg-amber-800 hover:bg-opacity-40" : treasure || seeker ? "hover:bg-red-300" : selectedTreasure || selectedSeeker ? "bg-opacity-50 bg-blue-500 hover:bg-opacity-90" : ""}`}>
                            {index >= 0 && showPreview && treasure && playerTreasure && (
                                <Treasure treasure={island.treasures[index]} />
                            )}
                            {index >= 0 && showPreview && selectedTreasure && (
                                <Treasure treasure={selectedTreasures[index - island.treasures.length]} />
                            )}
                            {index >= 0 && showPreview && seeker && playerSeeker && (
                                <Seeker seeker={island.seekers[index]} />
                            )}
                            {index >= 0 && showPreview && selectedSeeker && (
                                <Seeker seeker={selectedSeekers[index - island.seekers.length]} />
                            )}
                            {!center && (
                                <div className='h-full w-full p-0 m-0'></div>
                            )}
                        </div>
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
        <div className="bg-amber-100">
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
