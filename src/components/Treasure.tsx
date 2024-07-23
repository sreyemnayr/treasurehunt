"use client"

import { useState, useEffect } from 'react';
import { PlayerObject, TreasureObject, IslandObject } from '@/lib/Types';
import { useGameProvider } from '@/lib/Provider';

interface TreasureProps {
  treasure: TreasureObject;
}

const Treasure: React.FC<TreasureProps> = ({ treasure }) => {

    const {
        selectedTreasures,
        activePlayer,
        players,
        selectTreasure,
        deselectTreasure
    } = useGameProvider();


  const [showValue, setShowValue] = useState(false);

  if( treasure === undefined) {
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
      <img src={treasure.imageUrl} alt={treasure.name} className="w-full h-full  object-cover" />
      {showValue && (
        <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs `}>
          Value: {treasure.value}
          
        </div>
      )}
    </div>
  );
};

export default Treasure;
