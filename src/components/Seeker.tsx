"use client"

import { useState, useEffect } from 'react';
import { PlayerObject, SeekerObject, IslandObject } from '@/lib/Types';
import { useGameProvider } from '@/lib/Provider';

interface SeekerProps {
  seeker: SeekerObject;
}

const Seeker: React.FC<SeekerProps> = ({ seeker }) => {

    const {
        selectedSeekers,
        activePlayer,
        players,
        selectSeeker,
        deselectSeeker
    } = useGameProvider();


  const [showValue, setShowValue] = useState(false);

  if(seeker === undefined) {
    return (
        <div></div>
    )
  }


  return (
    <div
      onMouseEnter={() => setShowValue(true)}
      onMouseLeave={() => setShowValue(false)}
      
      className={`relative`}
    >
      <img src={seeker.imageUrl} alt={seeker.name} className="w-full h-full  object-cover" />
      {showValue && (
        <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs `}>
          Energy: {seeker.energy}
          {seeker.tier}
        </div>
      )}
    </div>
  );
};

export default Seeker;
