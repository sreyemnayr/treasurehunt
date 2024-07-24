'use client';
import { useState, useEffect } from 'react';
import { PlayerObject, TreasureObject, IslandObject } from '@/lib/Types';
import Treasure from './Treasure';
import Seeker from './Seeker';
import { Timer } from './Timer';

import { useDrop } from 'react-dnd';
import { useGameProvider } from '@/lib/Provider';
import { Description, Field, Label, Switch, Button } from '@headlessui/react'

interface IslandProps {
  island: IslandObject;
}

const hCols = [
    
    "h-40",
    "h-36",
    "h-32",
    "h-28",
    "h-24",
    "h-20",
    "h-16",
    "h-14",
    "h-12",
    "h-11",
    "h-10",
    "h-9",
    "h-8",
    "h-7",
    "h-6",
    "h-5"
]

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
    "grid-cols-11",
    "grid-cols-12",
    "grid-cols-13",
    "grid-cols-14",
    "grid-cols-15",
    "grid-cols-16",
    "grid-cols-17",
    "grid-cols-18",
    "grid-cols-19",
    "grid-cols-20",
    "grid-cols-21",
    "grid-cols-22",
    "grid-cols-23",
    "grid-cols-24",
    "grid-cols-25",
    "grid-cols-26",
    "grid-cols-27",
    "grid-cols-28",
    "grid-cols-29",
    "grid-cols-30",
    "grid-cols-31",
    "grid-cols-32",
    "grid-cols-33",
    "grid-cols-34",
    "grid-cols-35",
    "grid-cols-36",
    "grid-cols-37",
    "grid-cols-38",
    "grid-cols-39",
    "grid-cols-40",
    "grid-cols-41",
    "grid-cols-42",
    "grid-cols-43",
    "grid-cols-44",
    "grid-cols-45",
    "grid-cols-46",
    "grid-cols-47",
    "grid-cols-48",
    "grid-cols-49",
    "grid-cols-50",
    "grid-cols-51",
    "grid-cols-52",
    "grid-cols-53",
    "grid-cols-54",
    "grid-cols-55",
    "grid-cols-56",
    "grid-cols-57",
    "grid-cols-58",
    "grid-cols-59",
    "grid-cols-60",
    "grid-cols-61",
    "grid-cols-62",
    "grid-cols-63",
    "grid-cols-64",
    "grid-cols-65",
    "grid-cols-66",
    "grid-cols-67",
    "grid-cols-68",
    "grid-cols-69",
    "grid-cols-70",
    "grid-cols-71",
    "grid-cols-72",
    "grid-cols-73",
    "grid-cols-74",
    "grid-cols-75",
    "grid-cols-76",
    "grid-cols-77",
    "grid-cols-78",
    "grid-cols-79",
    "grid-cols-80",
    "grid-cols-81",
    "grid-cols-82",
    "grid-cols-83",
    "grid-cols-84",
    "grid-cols-85",
    "grid-cols-86",
    "grid-cols-87",
    "grid-cols-88",
    "grid-cols-89",
    "grid-cols-90",
    "grid-cols-91",
    "grid-cols-92",
    "grid-cols-93",
    "grid-cols-94",
    "grid-cols-95",
    "grid-cols-96",
    "grid-cols-97",
    "grid-cols-98",
    "grid-cols-99",
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
        activeMode,
        admin
    } = useGameProvider();
    const [showPreview, setShowPreview] = useState(-1);
    const [offset, setOffset] = useState(0);
    const [cols, setCols] = useState(1)

    useEffect(()=>{
        const count = island.treasures.length + (island.mode === 'hide' ? selectedTreasures.length : 0);
        setCols(Math.ceil(Math.sqrt(count)) + 1);
    }, [island.size, selectedTreasures.length, island.treasures.length, island.mode])

    useEffect(() => {

        setOffset(Math.max(0, Math.min(showPreview, cols**2 - (island.mode === 'hide' ? selectedTreasures.length : selectedSeekers.length))));
    }, [showPreview, cols, selectedTreasures.length, selectedSeekers.length])




  return (
    <div className="flex flex-col justify-start items-center">
        
        {/* <h3 className="text-2xl font-bold">{island.name}</h3> */}
        {offset}    
        
        <div className="relative">  
        <div className={`grid grid-cols-${cols+2} gap-0 p-0 `}>
            {Array.from({ length: (cols+2)**2 }).map((_, super_index) => {
                const row = Math.floor(super_index / (cols+2));
                const col = super_index % (cols+2);
                const center = centerTile(cols+2, super_index);
                
                const index = (row == (cols+1) || row == 0 || col == 0 || col == (cols+1)) ? -1 : super_index - ((cols+1) + (row*2));

                // const offset = Math.min(index + showPreview, cols**2 - selectedTreasures.length);
                

                const treasure = center && island.mode === 'hide' && island.treasures.length > index;
                const playerTreasure = treasure && island.treasures[index].owner === activePlayer.id
                const selectedTreasure = center && selectedTreasures.length + offset > index && index >= offset && !treasure && island.mode === 'hide';
                const seeker = center && island.mode === 'seek' && island.seekers.length > index;
                const playerSeeker = seeker && island.seekers[index].owner === activePlayer.id
                const selectedSeeker = center && selectedSeekers.length + offset > index && index >= offset && !seeker && island.mode === 'seek';
                

                return (
                    <div key={super_index} className={`${cols > hCols.length ? 'h-8' : hCols[cols - 1]} aspect-square p-0 m-0 ${backgroundTile(cols+2, super_index, treasure, seeker)} bg-cover bg-opacity-100  ${center ? 'border-[1px] border-amber-800 border-opacity-5' : ''}`}>
                        <div
                            onMouseEnter={() => setShowPreview(treasure || seeker ? 0 : index)}
                            onMouseLeave={() => setShowPreview(-1)}
                            onClick={() => island.mode === activeMode ? island.mode === 'hide' ? addSelectedTreasuresToIsland(island.id) : addSelectedSeekersToIsland(island.id) : null}
                            key={index} className={`p-0 m-0 ${center ? 'hover:border hover:rounded hover:shadow' : ''} h-full w-full ${playerTreasure || playerSeeker ? "bg-opacity-20 bg-amber-800 hover:bg-opacity-40" : treasure || seeker ? "hover:bg-red-300" : selectedTreasure || selectedSeeker ? "bg-opacity-50 bg-blue-500 hover:bg-opacity-90" : ""}`}>
                            {index >= 0 && showPreview >= 0 && treasure && playerTreasure && (
                                <Treasure treasure={island.treasures[index]} />
                            )}
                            {index >= 0 && showPreview >= 0 && selectedTreasure && (
                                <Treasure treasure={selectedTreasures[index - offset]} />
                            )}
                            {index >= 0 && showPreview >= 0 && seeker && playerSeeker && (
                                <Seeker seeker={island.seekers[index]} />
                            )}
                            {index >= 0 && showPreview >= 0 && selectedSeeker && (
                                <Seeker seeker={selectedSeekers[index - offset]} />
                            )}
                            {!center && (
                                <div className='h-full w-full p-0 m-0'></div>
                            )}
                        </div>
                    </div>
                )
            })}
            
        </div>
        {island.mode === 'seek' && (
            <div className="absolute flex flex-col items-center justify-center p-1 text-[0.5rem] gap-0 font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
                
                    <span className="m-0 p-0 leading-none">${island.price}/seeker</span>
                    <span className="m-0 p-0 leading-none">{island.treasures.length} nori</span>
                    <span className="m-0 p-0 leading-none">${island.value} total</span>
                    <span className="m-0 p-0 leading-none"> {island.size - island.seekers.length} remaining!</span>
            
            </div>
        )}
        {island.treasures.length > 0 && (
            <div className="absolute flex flex-col items-center justify-center p-1 text-xs font-bold text-white bg-lime-500 border-2 border-lime-100 rounded-full -bottom-2 left-1/2 transform -translate-x-1/2 dark:border-gray-900">
                Closes <Timer deadline={island.expiration} />
            </div>
                    )}
                   
            
            
        
        </div>

            {admin && (
                <>
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
        </>
         )}
    </div>
           
    
  );
};

export default Island;
