// import { v4 as nanoid } from 'uuid';
import { nanoid } from 'nanoid'

export class PlayerObject {
    id: string;
    name: string;
    balance: number;
    inventory: TreasureObject[];
    seekers: SeekerObject[];
  
    constructor(name: string) {
      this.id = nanoid();
      this.name = name;
      this.balance = 0; // starting balance
      this.inventory = [];
      this.seekers = [];
    }
  }
  
export class TreasureObject {
    id: string;
    name: string;
    value: number;
    owner: string;
    island: string;
    location: "player" | "island";
    imageUrl: string;
  
    constructor(name: string, value: number, owner: string, imageUrl: string) {
      this.id = nanoid();
      this.name = name;
      this.value = value;
      this.owner = owner;
      this.island = "";
      this.location = "player";
      this.imageUrl = imageUrl;
    }
  }

  export class SeekerObject {
    id: string;
    name: string;
    tier: 'gold' | 'silver' | 'bronze';
    imageUrl: string;
    owner: string;
    island: string;
    location: "player" | "island"
    energy: number;

    constructor(name: string, tier: 'gold' | 'silver' | 'bronze', owner: string, imageUrl: string) {
      this.id = nanoid();
      this.name = name;
      this.tier = tier;
      this.imageUrl = imageUrl;
      this.energy = 1;
      this.location = "player";
      this.owner = owner;
      this.island = "";
    }
  }
  
export class IslandObject {
    id: string;
    name: string;
    treasures: TreasureObject[];
    seekers: SeekerObject[];
    mode: 'hide' | 'seek';
    balance: number;
    expiration: number;
  
    constructor(name: string, mode: 'hide' | 'seek', expiration: number) {
      this.id = nanoid();
      this.name = name;
      this.treasures = [];
      this.seekers = [];
      this.mode = mode;
      this.balance = 0;
      this.expiration = expiration > 0 ? expiration : Date.now() + 15 * 60 * 1000;
    }
  
    get size(): number {
      const count = this.treasures.length;
      return (Math.ceil(Math.sqrt(count)) + 1) ** 2;
    }

    get remaining_plots(): number {
      return this.size - this.seekers.length;
    }
  
    get value(): number {
      return this.treasures.reduce((acc, treasure) => acc + treasure.value, 0);
    }

    get price(): number {
      return Math.ceil(this.value / this.size);
    }

  }

  export class EventObject {
    id: string;
    name: string;
    description: string;
    timestamp: number;
    type: 'treasure_hide' | 'treasure_seek' | 'fee_paid' | 'reward_paid';
    player: PlayerObject | null;
    treasure: TreasureObject | null;
    island: IslandObject | null;
    value: number;

    constructor(name: string, description: string, type: 'treasure_hide' | 'treasure_seek' | 'treasure_found' | 'treasure_return') {
      this.id = nanoid();
      this.name = name;
      this.description = description;
      this.timestamp = Date.now();
      this.type = 'treasure_hide';
      this.player = null;
      this.treasure = null;
      this.island = null;
      this.value = 0;
    }
  }

export interface BroadcastMessage {
  type: string;
  data: any;
}

export interface SyncErrorMessage extends BroadcastMessage {
  type: "syncerror";
  data: string;
}

export interface FullSyncData {
  islands: IslandObject[];
  players: PlayerObject[];
}

export interface SyncMessage extends BroadcastMessage {
  type: "sync";
  data: FullSyncData;
}

export interface IslandSyncMessage extends BroadcastMessage {
  type: "islandsync";
  data: IslandObject;
}

export interface PlayerSyncMessage extends BroadcastMessage {
  type: "playersync";
  data: PlayerObject;
}

export interface PartialSyncMessage extends BroadcastMessage {
  type: "partialsync";
  data: Partial<FullSyncData>;
}

export interface Message {
  method: string;
  args?: any;
}

export interface CreateTreasureMessage extends Message {
  method: 'createTreasure';
  args: {
    player_id: string;
    value: number;
  }
}

export interface AddTreasuresToIslandMessage extends Message {
  method: 'addTreasuresToIsland';
  args: {
    treasure_ids: string[];
    island_id: string;
    player_id: string;
  }
}

export interface AddSeekersToIslandMessage extends Message {
  method: 'addSeekersToIsland';
  args: {
    seeker_ids: string[];
    island_id: string;
    player_id: string;
  }
}

export interface UpdateIslandModeMessage extends Message {
  method: 'updateIslandMode';
  args: {
    island_id: string;
    mode: 'hide' | 'seek';
  }
}

export interface TransferTreasureOwnershipMessage extends Message {
  method: 'transferTreasureOwnership';
  args: {
    treasure_id: string;
    fromPlayer_id: string;
    toPlayer_id: string;
  }
}

export interface ResolveIslandMessage extends Message {
  method: 'resolveIsland';
  args: {
    island_id: string;
  }
}

export interface ResetGameMessage extends Message {
  method: 'resetGame';
}



