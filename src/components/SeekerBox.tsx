import { PlayerObject, SeekerObject, IslandObject } from '@/lib/Types';
import Seeker from './Seeker';

import { useGameProvider } from '@/lib/Provider';

interface SeekerBoxProps {
  player: PlayerObject;
}

const sortByTier = (a: SeekerObject, b: SeekerObject) => {
  // Gold should be first, then silver, then bronze

  if (a.tier === b.tier){
    return a.name.localeCompare(b.name);
  }

  if (a.tier === "gold" && b.tier !== "gold") {
    return -1;
  }
  if (a.tier !== "gold" && b.tier === "gold") {
    return 1;
  }
  if (a.tier === "silver" && b.tier !== "silver") {
    return -1;
  }
  if (a.tier !== "silver" && b.tier === "silver") {
    return 1;
  }
  if (a.tier === "bronze" && b.tier !== "bronze") {
    return -1;
  }
  if (a.tier !== "bronze" && b.tier === "bronze") {
    return 1;
  }
  // then sort by name
  return a.energy - b.energy;
}

const SeekerBox: React.FC<SeekerBoxProps> = ({ player }) => {

    const { selectSeeker, selectAllPlayerSeekers, deselectSeeker, selectedSeekers, activeMode } = useGameProvider();
        
  return (
    <div className="flex flex-wrap md:w-1/4 w-full my-auto md:max-h-[60vh] md:overflow-y-auto">
      {player.seekers.filter(t => activeMode === "inventory" || t.location === "player").sort(sortByTier).map((seeker) => {
        const selected = selectedSeekers.find((t) => t.id === seeker.id);
        return (
        <div
        key={seeker.id}
        onClick={() => {
        
            if (selected) {
              deselectSeeker(seeker.id);
            } else {
              selectSeeker(seeker.id);
            }
          }}
        
        className={`h-16 w-16 p-1 m-1 cursor-move rounded ${selected ? "bg-lime-400 rounded hover:border hover:border-lime-100" : "hover:bg-lime-200"}`}
      >
        <Seeker
          
          seeker={seeker}
        />
      </div>
        
        
      )
      })}
      <div
      className={`h-16 w-16 p-1 m-1 border rounded border-dashed border-green-500 hover:bg-green-500 hover:text-white`}
      onClick={() => {
        selectAllPlayerSeekers();
      }}
      >
        Select All
      </div>
    </div>
  );
};

export default SeekerBox;
