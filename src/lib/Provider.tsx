'use client';

import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

// Basic state provider for the whole app

// The app a list of "Players" which each have:
// - a coin balance
// - an inventory of Treasures
// - a name

// The app has a list of Treasures which each have:
// - a name
// - a value
// - an owner (can be a player or an island)

// The app has a list of Islands which each have
// - a name
// - a size (which is relative to the number of treasures)
// - a mode which is either "hide" or "seek"
// - a value (which is the sum of all owned treasures)

// Events have
// - a type (hide/seek/inventory)
// - a player
// - a treasure
// - an island
// - a timestamp


// The app has some global game state including:
// - active player
// - active mode (hide, seek, or inventory)
// - list of events (hides, seeks, )
// Summary of player inventory value and island values, sums of events by type, etc

// Constructor for the provider should create 3 players, give them names, and set the active player to the first one
// The provider constructor should also create a list of 10 treasures per player with random values from 100-1000 and assign them to the players
// The provider constructor should create 5 islands, and set the active mode to "hide" for all of them
// The provider should provide methods for updating the active player, adding treasures to islands, and updating the active mode (globally and for each island)


import React, { ReactNode, useContext, useState, useEffect } from 'react';
import { PlayerObject, TreasureObject, IslandObject, SeekerObject } from './Types';

function shuffle(array: any[]) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

// Define an interface for the context value
interface GameContextType {
    players: PlayerObject[];
    islands: IslandObject[];
    selectedTreasures: TreasureObject[];
    selectedSeekers: SeekerObject[];
    activePlayer: PlayerObject;
    activeMode: 'hide' | 'seek' | 'inventory' | 'setup';
    createTreasure: (name: string, value: number, owner: string) => void;
    updateActiveMode: (mode: 'hide' | 'seek' | 'inventory' | 'setup') => void;
    selectTreasure: (treasureId: string) => void;
    removeTreasures: (treasureIds: string[]) => void;
    deselectTreasure: (treasureId: string) => void;
    clearSelectedTreasures: () => void;
    updateActivePlayer: (playerId: string) => void;
    addSelectedTreasuresToIsland: (islandId: string) => void;
    updateIslandMode: (islandId: string, mode: 'hide' | 'seek') => void;
    toggleIslandMode: (islandId: string) => void;
    selectSeeker: (seekerId: string) => void;
    deselectSeeker: (seekerId: string) => void;
    clearSelectedSeekers: () => void;
    addSelectedSeekersToIsland: (islandId: string) => void;
    resolveIsland: (islandId: string) => void;

  }

const GameContext = React.createContext<GameContextType>({
    players: [],
    islands: [],
    selectedTreasures: [],
    selectedSeekers: [],
    activePlayer: new PlayerObject(''),
    activeMode: 'hide',
    createTreasure: () => {},
    updateActiveMode: () => {},
    selectTreasure: () => {},
    removeTreasures: () => {},
    deselectTreasure: () => {},
    clearSelectedTreasures: () => {},
    updateActivePlayer: () => {},
    addSelectedTreasuresToIsland: () => {},
    updateIslandMode: () => {},
    toggleIslandMode: () => {},
    selectSeeker: () => {},
    deselectSeeker: () => {},
    clearSelectedSeekers: () => {},
    addSelectedSeekersToIsland: () => {},
    resolveIsland: () => {}
  });


const sampleSeekers = [
    new SeekerObject("Popkin", "gold", "player", "/img/popkin.png"),
    new SeekerObject("Ronin", "gold", "player", "/img/ronin.jpg"),
    new SeekerObject("Wolf", "silver", "player", "/img/wolves.png"),
    new SeekerObject("Galactic Ape", "bronze", "player", "/img/gape.png"),
    new SeekerObject("Pizza People", "silver", "player", "/img/pizza.png"),
    new SeekerObject("Critter", "bronze", "player", "/img/critter.png"),
]

export const GameProvider = ({ children }: { children: ReactNode }) => {

    const [players, setPlayers] = useState<PlayerObject[]>([]);
    const [islands, setIslands] = useState<IslandObject[]>([]);
    const [selectedTreasures, setSelectedTreasures] = useState<TreasureObject[]>([]);
    const [selectedSeekers, setSelectedSeekers] = useState<SeekerObject[]>([]);
    const [activePlayer, setActivePlayer] = useState<PlayerObject>(new PlayerObject(''));
    const [activeMode, setActiveMode] = useState<'hide' | 'seek' | 'inventory' | 'setup'>('hide');

    const createTreasure = (name: string, value: number, owner: string) => {
        if (activePlayer.balance < value) {
            console.log("Player does not have enough balance")
            return
        }
        const treasure = new TreasureObject(name, value, owner, "/img/treasure.png");
        setActivePlayer(prev => ({ ...prev, inventory: [...prev.inventory, treasure], balance: prev.balance - value }));
        setSelectedTreasures(prev => [...prev, treasure]);
    }

    useEffect(() => {
            setPlayers(()=>{
                const player_one = new PlayerObject('Alice H.')
                const player_two = new PlayerObject('Bob S.')
                const player_three = new PlayerObject('Charlie H.')
                const player_four = new PlayerObject('Dave S.')
                const player_five = new PlayerObject('Eve H.')
                const player_six = new PlayerObject('Frank S.')
                const player_seven = new PlayerObject('Grace H.')
                const player_eight = new PlayerObject('Helen S.')
                const player_nine = new PlayerObject('Ivan H.')
                const player_ten = new PlayerObject('John S.')
                const player_eleven = new PlayerObject('Kelly H.')
                const player_twelve = new PlayerObject('Lisa S.')
                const player_thirteen = new PlayerObject('Mike H.')
                const player_fourteen = new PlayerObject('Nancy S.')
                const player_fifteen = new PlayerObject('Oliver H.')
                const player_sixteen = new PlayerObject('Pam S.')
                const player_seventeen = new PlayerObject('Quincy H.')
                const player_eighteen = new PlayerObject('Rachel S.')
                const player_nineteen = new PlayerObject('Steve H.')
                const player_twenty = new PlayerObject('Tim S.')
                const player_twentyone = new PlayerObject('Ursula H.')
                const player_twentytwo = new PlayerObject('Victoria S.')
                const player_twentythree = new PlayerObject('Wendy H.')
                const player_twentyfour = new PlayerObject('Xander S.')
                const player_twentyfive = new PlayerObject('Yvonne H.')
                const player_twentysix = new PlayerObject('Zach S.')

                const initial_players = [player_one, player_two, player_three, player_four, player_five, player_six, player_seven, player_eight, player_nine, player_ten, player_eleven, player_twelve, player_thirteen, player_fourteen, player_fifteen, player_sixteen, player_seventeen, player_eighteen, player_nineteen, player_twenty, player_twentyone, player_twentytwo, player_twentythree, player_twentyfour, player_twentyfive, player_twentysix]

                initial_players.forEach(player => {
                    player.balance = 100000
                    // for (let i = 0; i < 10; i++) {
                    // const value = Math.floor(Math.random() * (999 - 100) + 100);
                    // const treasure = new TreasureObject(`Treasure ${i + 1}`, value, player.id, "/img/treasure.png");
                    // player.inventory.push(treasure);
                    // }
                });

                initial_players.forEach(player => {
                    for (let i = 0; i < 20; i++) {
                    const value = Math.floor(Math.random() * (999 - 100) + 100);
                    const seeker = sampleSeekers[Math.floor(Math.random() * sampleSeekers.length)]
                    const seekerCopy = new SeekerObject(`${seeker.name} #${value}`, seeker.tier, player.id, seeker.imageUrl);
                    player.seekers.push(seekerCopy);
                    }
                });

                setActivePlayer(player_one);
                return initial_players
            });

            setIslands(()=>{
                return Array.from({ length: 5 }, (_, i) => new IslandObject(`Island ${i + 1}`, 'hide'))
            });

            setActiveMode('hide');
            setSelectedTreasures([]);
        
            // Assigning random treasures to players
            
          
    }, []);

    const selectTreasure = (treasureId: string) => {
        if (!activePlayer) return
        const treasure = activePlayer.inventory.find(t => t.id === treasureId);
        if (treasure) {
            console.log("found treasure")
            console.log(treasure)
            setSelectedTreasures(prev => [...prev, treasure]);
          // this.activePlayer.inventory = this.activePlayer.inventory.filter(t => t.id !== treasureId);
        }
      }
    
      const removeTreasures = (treasureIds: string[]) => {
        setActivePlayer(prev => {
            if (!prev) return new PlayerObject(''); // Ensure we handle the case where prev might be null
            const new_player = {
                ...prev,
                inventory: prev.inventory.filter(t => !treasureIds.includes(t.id))
            };
            return new_player; // Explicitly return a PlayerObject
        });
      }
    
      const deselectTreasure = (treasureId: string) => {
        setSelectedTreasures(prev => prev.filter(t => t.id !== treasureId));
      }
    
      const clearSelectedTreasures = () => {
        setSelectedTreasures([]);
      }
    
      const updateActivePlayer = (playerId: string) => {
        const player = players.find(p => p.id === playerId);
        if (player) {
          setActivePlayer(player);
          clearSelectedTreasures();
        }
      }
    
      const addSelectedTreasuresToIsland = (islandId: string) => {
        if (!activePlayer) return
        
        const island = islands.find(i => i.id === islandId);
        

        if (selectedTreasures && island && island.mode === 'hide') {
            const treasures = selectedTreasures.map(t => ({ ...t, island: island.id, location: "island" } as TreasureObject))
            island?.treasures.push(...treasures)
            
            setIslands(prev => prev.map(i => i.id === islandId ? island : i));
            setActivePlayer(prev => ({
                ...prev,
                inventory: [
                    ...prev.inventory.filter(t => !treasures.map(t => t.id).includes(t.id)),
                    ...treasures
                ]
            }))
            // removeTreasures(selectedTreasures.map(t => t.id))
            clearSelectedTreasures()
        }
      }
    
      const updateIslandMode = (islandId: string, mode: 'hide' | 'seek') => {
        const island = islands.find(i => i.id === islandId);
        if (island) {
          setIslands(prev => prev.map(i => i.id === islandId ? { ...i, mode: mode } as IslandObject : i));
        }
      }

      const toggleIslandMode = (islandId: string) => {
        const island = islands.find(i => i.id === islandId);
        
        if (island) {
            island.mode = island.mode === 'hide' ? 'seek' : 'hide'
            setIslands(prev => prev.map(i => i.id === islandId ? island : i));
        }
      }

      const updateActiveMode = (mode: 'hide' | 'seek' | 'inventory' | 'setup') => {
        setActiveMode(mode);
      }

      const selectSeeker = (seekerId: string) => {
        const seeker = activePlayer.seekers.find(s => s.id === seekerId);
        if (seeker) {
            setSelectedSeekers(prev => [...prev, seeker]);
        }
        console.log(selectedSeekers);
      }

      const deselectSeeker = (seekerId: string) => {
        setSelectedSeekers(prev => prev.filter(s => s.id !== seekerId));
      }

      const clearSelectedSeekers = () => {
        setSelectedSeekers([]);
      }

      const addSelectedSeekersToIsland = (islandId: string) =>  {
        if (!activePlayer) return

        
        const island = islands.find(i => i.id === islandId);

        
        
        if (selectedSeekers && island && island.mode === 'seek') {
            const seekers = selectedSeekers.map(s => ({ ...s, energy: 0, location: "island" } as SeekerObject));

            if (island.size < island.seekers.length + seekers.length) {
                console.log("Island is full")
                return
            }

            if (island.price * seekers.length > activePlayer.balance) {
                console.log("Player does not have enough balance")
                return
            }

            if (seekers) {
                island?.seekers.push(...seekers);
                island.balance += island.price * seekers.length
                setIslands(prev => prev.map(i => i.id === islandId ? island : i));
                setActivePlayer(prev => 
                    (   {
                            ...prev,
                            balance: prev.balance - island.price * seekers.length,
                            seekers: [
                                ...prev.seekers.filter(s => !seekers.map(sk => sk.id).includes(s.id)),
                                ...seekers
                            ]
                        } as PlayerObject));
                clearSelectedSeekers()
            }
            
        }
      }

      const adjustPlayerBalance = (playerId: string, amount: number) => {
        const player = players.find(p => p.id === playerId);
        if (player) {
            if (player.id == activePlayer.id) {
                setActivePlayer(prev => ({ ...prev, balance: prev.balance + amount }));
            } else {
                setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, balance: p.balance + amount } : p));
            }
        }
      }

      const transferTreasureOwnership = (treasureId: string, fromPlayerId: string, toPlayerId: string) => {
        const fromPlayer = players.find(p => p.id === fromPlayerId);
        const toPlayer = players.find(p => p.id === toPlayerId);
        
        if (fromPlayer && toPlayer) {
            const treasure = fromPlayer.inventory.find(t => t.id === treasureId);
            if (treasure) {
                treasure.owner = toPlayer.id;
                
                if (fromPlayer.id === activePlayer.id) {
                    setActivePlayer(prev => ({ ...prev, inventory: prev.inventory.filter(t => t.id !== treasureId) }));
                } else {
                    setPlayers(prev => prev.map(p => p.id === fromPlayerId ? { ...p, inventory: p.inventory.filter(t => t.id !== treasureId) } : p));
                }

                if(toPlayer.id === activePlayer.id) {
                    setActivePlayer(prev => ({ ...prev, inventory: [...prev.inventory, treasure] }));
                } else {
                    setPlayers(prev => prev.map(p => p.id === toPlayerId ? { ...p, inventory: [...p.inventory, treasure] } : p));
                }

            }
        }
      }

      const resolveIsland = (islandId: string) => {
        const island = islands.find(i => i.id === islandId);
        
        // determine the value-share of each treasure relative to the island's total value
        // the balance of the island is divided to the original owners of the treasures according to value-share
        
        if (island){
            const treasures = island.treasures;
            const total_value = island.value;
            
            for(let i = 0; i < treasures.length; i++) {
                const treasure = treasures[i];
                const value_share = treasure.value / total_value;
                const balance_share = Math.floor(island.balance * value_share);
                adjustPlayerBalance(treasure.owner, balance_share);
            }

            // Give each treasure 1% more value than before
            for(let i = 0; i < treasures.length; i++) {
                const treasure = treasures[i];
                treasure.value = Math.ceil(treasure.value * 1.01);
            }
            
        
        
        // scramble the treasures in a list of island.size length (fill in with nulls)
        // scramble the seekers in a list of island.size length (fill in with nulls)

            const scrambled_treasures: (TreasureObject|null)[] = Array.from({ length: island.size }, () => null);
            const scrambled_seekers: (SeekerObject|null)[] = Array.from({ length: island.size }, () => null);

            for(let i = 0; i < island.size; i++) {
                scrambled_treasures[i] = treasures[i];
                scrambled_seekers[i] = island.seekers[i];
            }
            shuffle(scrambled_treasures);
            shuffle(scrambled_seekers);

            for(let i = 0; i < island.size; i++) {
                const treasure = scrambled_treasures[i];
                const seeker = scrambled_seekers[i];
                if(treasure && seeker) {
                    treasure.island = ""
                    treasure.location = "player"
                    transferTreasureOwnership(treasure.id, treasure.owner, seeker.owner);
                    
                } 
                    
                if(seeker){
                    seeker.island = ""
                    seeker.location = "player"
                    seeker.energy += 1
                    if(seeker.owner == activePlayer.id){
                        setActivePlayer(prev => ({ ...prev, seekers: [
                            ...prev.seekers.filter(s => s.id !== seeker.id),
                            seeker
                        ] }));
                    } else {
                        setPlayers(prev => prev.map(p => p.id === seeker.owner ? { ...p, seekers: [
                            ...p.seekers.filter(s => s.id !== seeker.id),
                            seeker
                        ] } : p));
                    }
                }
                
            }

            // return all seekers
            island.seekers = []
            island.treasures = treasures.filter(t => t.location == "island")
            setIslands(prev => prev.map(i => i.id === island.id ? island : i));

        


        }
      
        }
        

      useEffect(()=>{
        setPlayers(prev => prev.map(p => p.id === activePlayer.id ? activePlayer : p))
      }, [JSON.stringify(activePlayer)])

      useEffect(()=>{
        for (let i = 0; i < islands.length; i++) {
            if(islands[i].mode == "seek" && islands[i].seekers.length == islands[i].size){
                resolveIsland(islands[i].id)
            }
            
        }
      }, [islands])

  return (
    <DndProvider backend={TouchBackend}>
        <GameContext.Provider value={{
            players,
            islands,
            selectedTreasures,
            selectedSeekers,
            activePlayer,
            activeMode,
            createTreasure,
            updateActiveMode,
            selectTreasure,
            removeTreasures,
            deselectTreasure,
            clearSelectedTreasures,
            updateActivePlayer,
            addSelectedTreasuresToIsland,
            updateIslandMode,
            toggleIslandMode,
            selectSeeker,
            deselectSeeker,
            clearSelectedSeekers,
            addSelectedSeekersToIsland,
            resolveIsland
             }}>
        {children}
        </GameContext.Provider>
    </DndProvider>
  );
};

export const useGameProvider = () => useContext(GameContext);

export default GameProvider;


