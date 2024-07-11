import { PlayerObject, TreasureObject, IslandObject } from '@/lib/Types';
import Treasure from './Treasure';

import { useGameProvider } from '@/lib/Provider';

interface TreasureBoxProps {
  player: PlayerObject;
}

const TreasureBox: React.FC<TreasureBoxProps> = ({ player }) => {

    const { selectTreasure, deselectTreasure, selectedTreasures, activeMode, createTreasure, activePlayer } = useGameProvider();
        
  return (
    <div className="flex flex-wrap">
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
      <div
      className={`h-16 w-16 p-1 m-1 border rounded border-dashed border-green-500 hover:bg-green-500 hover:text-white`}
      onClick={() => {
        createTreasure("Wrap", Math.floor(Math.random() * (99999 - 9999) + 9999), player.id);
      }}
      >
        + Wrap New BIG
      </div>
      <div
      className={`h-16 w-16 p-1 m-1 border rounded border-dashed border-green-500 hover:bg-green-500 hover:text-white`}
      onClick={() => {
        createTreasure("Wrap", Math.floor(Math.random() * (9999 - 999) + 999), player.id);
      }}
      >
        + Wrap New MID
      </div>
      <div
      className={`h-16 w-16 p-1 m-1 border rounded border-dashed border-green-500 hover:bg-green-500 hover:text-white`}
      onClick={() => {
        createTreasure("Wrap", Math.floor(Math.random() * (999 - 99) + 99), player.id);
      }}
      >
        + Wrap New SMALL
      </div>
    </div>
  );
};

export default TreasureBox;
