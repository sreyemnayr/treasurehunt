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

    const { selectSeeker, deselectSeeker, selectedSeekers, activeMode } = useGameProvider();
        
  return (
    <div className="flex flex-wrap">
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
        
        className={`h-16 w-16 p-1 m-1 border rounded cursor-move ${selected ? "bg-blue-500" : ""}`}
      >
        <Seeker
          
          seeker={seeker}
        />
      </div>
        
        
      )
      })}
    </div>
  );
};

export default SeekerBox;
