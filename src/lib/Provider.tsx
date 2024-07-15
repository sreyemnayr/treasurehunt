'use client';

import CursorsProvider from '@/lib/CursorsProvider';

import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import usePartySocket from "partysocket/react";
import PartySocket from "partysocket";

import { useSession } from "next-auth/react";

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
import { 
    PlayerObject, 
    TreasureObject, 
    IslandObject, 
    SeekerObject, 
    BroadcastMessage, 
    FullSyncData,
    SyncMessage,
    IslandSyncMessage,
    PlayerSyncMessage,
    PartialSyncMessage,
    CreateTreasureMessage,
    AddTreasuresToIslandMessage,
    UpdateIslandModeMessage,
    AddSeekersToIslandMessage,
    ResolveIslandMessage,
    ResetGameMessage
} from './Types';

import { PARTYKIT_HOST, PARTYKIT_URL } from "@/app/env";

const party = "island";
export const revalidate = 0;    

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
    // removeTreasures: (treasureIds: string[]) => void;
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
    resetGame: () => void;

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
    // removeTreasures: () => {},
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
    resolveIsland: () => {},
    resetGame: () => {}
  });


const sampleSeekers = [
    new SeekerObject("Popkin", "gold", "player", "/img/popkin.png"),
    new SeekerObject("Ronin", "gold", "player", "/img/ronin.jpg"),
    new SeekerObject("Wolf", "silver", "player", "/img/wolves.png"),
    new SeekerObject("Galactic Ape", "bronze", "player", "/img/gape.png"),
    new SeekerObject("Pizza People", "silver", "player", "/img/pizza.png"),
    new SeekerObject("Critter", "bronze", "player", "/img/critter.png"),
]


const identify = async (socket: PartySocket) => {
    // the ./auth route will authenticate the connection to the partykit room
    const url = `${window.location.pathname}/auth?_pk=${socket._pk}`;
    const req = await fetch(url, { method: "POST" });
  
    if (!req.ok) {
      const res = await req.text();
      console.error("Failed to authenticate connection to PartyKit room", res);
    }
  };

export const GameProvider = ({ children }: { children: ReactNode }) => {

    // const session = useSession();

    const [players, setPlayers] = useState<PlayerObject[]>([]);
    const [islands, setIslands] = useState<IslandObject[]>([]);
    const [madeNewTreasure, setMadeNewTreasure] = useState(false);

    const socket = usePartySocket({
        host: PARTYKIT_HOST,
        party,
        room: "blast",
        // onOpen(e) {
        //   // identify user upon connection
        //   if (session.status === "authenticated" && e.target) {
        //     identify(e.target as PartySocket);
        //     if (session?.data?.user) setUser(session.data.user as User);
        //   }
        // },
        onMessage(event: MessageEvent<string>) {
          const message = JSON.parse(event.data) as BroadcastMessage;
          // upon connection, the server will send all messages in the room
          if (message.type === "syncerror") {
            console.log("syncerror", message.data)
          }
          if (message.type === "sync") {
            const data = message.data as FullSyncData
            setPlayers(data.players);
            setIslands(data.islands.map(i => {const io = new IslandObject(i.name, i.mode); io.id = i.id; io.seekers = i.seekers; io.treasures = i.treasures; io.balance = i.balance; return io}));
          }
          // after that, the server will send updates as they arrive
          if (message.type === "islandsync") {
            const island_data = (message as IslandSyncMessage).data
            const island = new IslandObject(island_data.name, island_data.mode); 
            island.id = island_data.id; island.seekers = island_data.seekers; 
            island.treasures = island_data.treasures; 
            island.balance = island_data.balance; 
            
            setIslands(prev => prev.map(i => i.id === island.id ? island : i))
          }
          if (message.type === "playersync") {
            const player = (message as PlayerSyncMessage).data
            setPlayers(prev => prev.map(p => p.id === player.id ? player : p))
          }
          if (message.type === "partialsync") {
            const partial = (message as PartialSyncMessage).data
            if (partial.players) {
                for (const player of partial.players) {
                    setPlayers(prev => prev.map(p => p.id === player.id ? player : p))
                }
            }
            if (partial.islands) {
                for (const island_data of partial.islands) {
                    const island = new IslandObject(island_data.name, island_data.mode); 
                    island.id = island_data.id; island.seekers = island_data.seekers; 
                    island.treasures = island_data.treasures; 
                    island.balance = island_data.balance; 
                    
                    setIslands(prev => prev.map(i => i.id === island.id ? island : i))
                }
            }
          }
        },
      });

    
    const [selectedTreasures, setSelectedTreasures] = useState<TreasureObject[]>([]);
    const [selectedSeekers, setSelectedSeekers] = useState<SeekerObject[]>([]);
    const [activePlayer, setActivePlayer] = useState<PlayerObject>(new PlayerObject(''));
    const [activeMode, setActiveMode] = useState<'hide' | 'seek' | 'inventory' | 'setup'>('hide');

    const resetGame = () => {
        setActivePlayer(new PlayerObject(''));
        setIslands([]);
        setPlayers([]);
        socket.send(JSON.stringify({ method: "resetGame" } as ResetGameMessage));
    }

    const createTreasure = (name: string, value: number, owner: string) => {
        if (activePlayer.balance < value) {
            console.log("Player does not have enough balance")
            return
        }
        setMadeNewTreasure(true);
        socket.send(JSON.stringify({ method: "createTreasure", args: { player_id: owner, value}} as CreateTreasureMessage));

    }

    const selectTreasure = (treasureId: string) => {
        if (!activePlayer) return
        const treasure = activePlayer.inventory.find(t => t.id === treasureId);
        if (treasure) {
            console.log(treasure)
            setSelectedTreasures(prev => [...prev, treasure]);
        }
      }
    
    //   const removeTreasures = (treasureIds: string[]) => {
    //     setActivePlayer(prev => {
    //         if (!prev) return new PlayerObject(''); // Ensure we handle the case where prev might be null
    //         const new_player = {
    //             ...prev,
    //             inventory: prev.inventory.filter(t => !treasureIds.includes(t.id))
    //         };
    //         return new_player; // Explicitly return a PlayerObject
    //     });
    //   }
    
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
        if (!island) {
            console.log(`Island with id ${islandId} not found`)
            return
        }

        if (island.mode !== 'hide') {
            console.log(`Island with id ${islandId} is not in hide mode`)
            return
        }

        socket.send(JSON.stringify({ method: "addTreasuresToIsland", args: { player_id: activePlayer.id, treasure_ids: selectedTreasures.map(t => t.id), island_id: islandId}} as AddTreasuresToIslandMessage));
        clearSelectedTreasures()
        
        
      }
    
      const updateIslandMode = (islandId: string, mode: 'hide' | 'seek') => {
        const island = islands.find(i => i.id === islandId);
        if (island) {
          setIslands(prev => prev.map(i => i.id === islandId ? { ...i, mode: mode } as IslandObject : i));
          socket.send(JSON.stringify({ method: "updateIslandMode", args: { island_id: islandId, mode: mode }} as UpdateIslandModeMessage));
        }
      }

      const toggleIslandMode = (islandId: string) => {
        const island = islands.find(i => i.id === islandId);
        
        if (island) {
            island.mode = island.mode === 'hide' ? 'seek' : 'hide'
            setIslands(prev => prev.map(i => i.id === islandId ? island : i));
            updateIslandMode(islandId, island.mode)
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
                // island?.seekers.push(...seekers);
                // island.balance += island.price * seekers.length
                // setIslands(prev => prev.map(i => i.id === islandId ? island : i));
                // setActivePlayer(prev => 
                //     (   {
                //             ...prev,
                //             balance: prev.balance - island.price * seekers.length,
                //             seekers: [
                //                 ...prev.seekers.filter(s => !seekers.map(sk => sk.id).includes(s.id)),
                //                 ...seekers
                //             ]
                //         } as PlayerObject));

                socket.send(JSON.stringify({ method: "addSeekersToIsland", args: { player_id: activePlayer.id, seeker_ids: selectedSeekers.map(s => s.id), island_id: islandId}} as AddSeekersToIslandMessage));
                clearSelectedSeekers()
            }
            
        }
      }

    //   const adjustPlayerBalance = (playerId: string, amount: number) => {
    //     const player = players.find(p => p.id === playerId);
    //     if (player) {
    //         if (player.id == activePlayer.id) {
    //             setActivePlayer(prev => ({ ...prev, balance: prev.balance + amount }));
    //         } else {
    //             setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, balance: p.balance + amount } : p));
    //         }
    //     }
    //   }

    //   const transferTreasureOwnership = (treasureId: string, fromPlayerId: string, toPlayerId: string) => {
    //     const fromPlayer = players.find(p => p.id === fromPlayerId);
    //     const toPlayer = players.find(p => p.id === toPlayerId);
        
    //     if (fromPlayer && toPlayer) {
    //         const treasure = fromPlayer.inventory.find(t => t.id === treasureId);
    //         if (treasure) {
    //             treasure.owner = toPlayer.id;
                
    //             if (fromPlayer.id === activePlayer.id) {
    //                 setActivePlayer(prev => ({ ...prev, inventory: prev.inventory.filter(t => t.id !== treasureId) }));
    //             } else {
    //                 setPlayers(prev => prev.map(p => p.id === fromPlayerId ? { ...p, inventory: p.inventory.filter(t => t.id !== treasureId) } : p));
    //             }

    //             if(toPlayer.id === activePlayer.id) {
    //                 setActivePlayer(prev => ({ ...prev, inventory: [...prev.inventory, treasure] }));
    //             } else {
    //                 setPlayers(prev => prev.map(p => p.id === toPlayerId ? { ...p, inventory: [...p.inventory, treasure] } : p));
    //             }

    //         }
    //     }
    //   }

      const resolveIsland = (islandId: string) => {
        const island = islands.find(i => i.id === islandId);
        
        // determine the value-share of each treasure relative to the island's total value
        // the balance of the island is divided to the original owners of the treasures according to value-share
        
        if (island){
            
            socket.send(JSON.stringify({ method: "resolveIsland", args: { island_id: islandId }} as ResolveIslandMessage));
            
            // const treasures = island.treasures;
            // const total_value = island.value;
            
            // for(let i = 0; i < treasures.length; i++) {
            //     const treasure = treasures[i];
            //     const value_share = treasure.value / total_value;
            //     const balance_share = Math.floor(island.balance * value_share);
            //     adjustPlayerBalance(treasure.owner, balance_share);
            // }

            // // Give each treasure 1% more value than before
            // for(let i = 0; i < treasures.length; i++) {
            //     const treasure = treasures[i];
            //     treasure.value = Math.ceil(treasure.value * 1.01);
            // }
            
        
        
        // scramble the treasures in a list of island.size length (fill in with nulls)
        // scramble the seekers in a list of island.size length (fill in with nulls)

            // const scrambled_treasures: (TreasureObject|null)[] = Array.from({ length: island.size }, () => null);
            // const scrambled_seekers: (SeekerObject|null)[] = Array.from({ length: island.size }, () => null);

            // for(let i = 0; i < island.size; i++) {
            //     scrambled_treasures[i] = treasures[i];
            //     scrambled_seekers[i] = island.seekers[i];
            // }
            // shuffle(scrambled_treasures);
            // shuffle(scrambled_seekers);

            

            // return all seekers
            // island.seekers = []
            // island.treasures = treasures.filter(t => t.location == "island")
            // setIslands(prev => prev.map(i => i.id === island.id ? island : i));

        


        }
      
        }
       
      useEffect(()=>{
        const new_active_player = players.find(p => p.id === activePlayer.id)

        if(!new_active_player && players.length > 0){
            setActivePlayer(players?.[Math.floor(Math.random() * players.length)])
        } else if (new_active_player && JSON.stringify(activePlayer) != JSON.stringify(new_active_player)) {
            
            const existing_treasures = activePlayer.inventory.map(t => t.id)
            const new_treasures = new_active_player?.inventory.filter(t => !existing_treasures.includes(t.id))
            
            if (new_active_player && JSON.stringify(activePlayer) != JSON.stringify(new_active_player)) {
                setActivePlayer(new_active_player)
            }
            if (new_treasures && madeNewTreasure) {
                setMadeNewTreasure(false);
                setSelectedTreasures(prev => [...prev, ...new_treasures])
                
            }

        }
        console.log(players)
        
      }, [JSON.stringify(players)])

    //   useEffect(()=>{
    //     setPlayers(prev => prev.map(p => p.id === activePlayer.id ? activePlayer : p))
    //   }, [JSON.stringify(activePlayer)])

      useEffect(()=>{
        for (let i = 0; i < islands.length; i++) {
            if(islands[i].mode == "seek" && islands[i].seekers.length == islands[i].size){
                resolveIsland(islands[i].id)
            }
            
        }
        console.log(islands)
      }, [islands])

  return (
    <DndProvider backend={TouchBackend}>
        <CursorsProvider>
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
                // removeTreasures,
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
                resolveIsland,
                resetGame
                }}
            >
                {children}
            </GameContext.Provider>
        </CursorsProvider>
    </DndProvider>
  );
};

export const useGameProvider = () => useContext(GameContext);

export default GameProvider;


