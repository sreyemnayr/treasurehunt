import * as React from 'react';
import { useState } from 'react';
import { PlayerObject, TreasureObject, IslandObject } from '@/lib/Types';
import Treasure from './Treasure';
import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop, Input, Field, Label, Button } from '@headlessui/react'


import { useGameProvider } from '@/lib/Provider';

interface TreasureBoxProps {
  player: PlayerObject;
}

const TreasureBox: React.FC<TreasureBoxProps> = ({ player }) => {

    const { selectTreasure, deselectTreasure, selectedTreasures, activeMode, createTreasure, activePlayer } = useGameProvider();

    const [isOpen, setIsOpen] = useState(false)
    const [amt, setAmt] = useState(1)
        
  return (
    <div className="flex flex-wrap">

    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
    <DialogBackdrop className="fixed inset-0 bg-black/80" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 align-center">
            <DialogTitle className="font-bold"><img src="./img/treasure.png" alt="NORI Treasure" className="w-4 h-4 object-cover inline" /> Wrap NORI Treasure</DialogTitle>
            <Description></Description>
            <div>
                Balance Available: {activePlayer.balance}
            </div>
            <div className="flex flex-wrap justify-center items-center">
            <p className="text-sm/6 font-medium text-black">Random: </p>
            <Button
            className={`p-1 m-1 border rounded border-dashed border-green-500 hover:bg-green-500 hover:text-white`}
            onClick={() => {
                createTreasure("Wrap", Math.floor(Math.random() * (99999 - 9999) + 9999), player.id);
            }}
            >
                BIG
            </Button>
            <Button
            className={`p-1 m-1 border rounded border-dashed border-green-500 hover:bg-green-500 hover:text-white`}
            onClick={() => {
                createTreasure("Wrap", Math.floor(Math.random() * (9999 - 999) + 999), player.id);
            }}
            >
                MID
            </Button>
            <Button
            className={`p-1 m-1 border rounded border-dashed border-green-500 hover:bg-green-500 hover:text-white`}
            onClick={() => {
                createTreasure("Wrap", Math.floor(Math.random() * (999 - 99) + 99), player.id);
            }}
            >
                SMALL
            </Button>
            </div>
            <div className="flex flex-row justify-center items-center">
            <Field className="flex flex-row justify-center items-center">
            <Label className="text-sm/6 font-medium text-black">Custom: </Label>
            <Input name="amt" type="number" max={activePlayer.balance} min={1} value={amt} onChange={(e) => setAmt(Number(e.target.value))}
            className="block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
             />
            </Field>
            <Button onClick={() => {createTreasure("Wrap", amt, player.id);}} className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700">Wrap</Button>
            </div>
            
            <div className="flex flex-wrap">
                {selectedTreasures.map((t) => {
                    return (
                        <div key={t.id} className="h-8 w-8">
                        <Treasure treasure={t} />
                        </div>
                    )
                })}
            </div>
            <div className="flex gap-4 w-full justify-center items-center">
              <Button onClick={() => setIsOpen(false)} className="rounded bg-red-600 py-2 px-4 w-full text-sm text-white data-[hover]:bg-red-500 data-[active]:bg-red-700">DONE</Button>
              
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      
      <div
      className={`h-16 w-16 p-1 m-1 border rounded border-dashed border-green-500 hover:bg-green-500 hover:text-white`}
      onClick={() => {
        // createTreasure("Wrap", Math.floor(Math.random() * (99999 - 9999) + 9999), player.id);
        setIsOpen(true)
      }}
      >
        + Wrap New
      </div>
      {/*  */}
      {player.inventory.filter(t => activeMode === "inventory" || t.location === "player").sort((a, b) => a.location.localeCompare(b.location)).map((treasure) => {
        const selected = selectedTreasures.find((t) => t.id === treasure.id);
        return (
        <div
        key={treasure.id}
        onClick={() => {
        
            if (selected) {
              deselectTreasure(treasure.id);
            } else {
              selectTreasure(treasure.id);
            }
          }}
        
        className={`h-16 w-16 p-1 m-1 border rounded cursor-move ${treasure.location === "island" ? "opacity-50" : ""} ${selected ? "bg-blue-500" : ""}`}
      >
        <Treasure
         
          treasure={treasure}
        />
      </div>
        
        
      )
      })}
    </div>
    
  );
};

export default TreasureBox;
