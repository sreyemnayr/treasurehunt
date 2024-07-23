import type * as Party from "partykit/server";
import { json, notFound } from "@/party/utils/response";
import { 
  IslandObject, 
  PlayerObject, 
  SeekerObject, 
  TreasureObject, 
  EventObject,
  SyncErrorMessage,
  FullSyncData,
  SyncMessage,
  IslandSyncMessage,
  PlayerSyncMessage,
  EventSyncMessage,
  PartialSyncMessage,
  Message,
  CreateTreasureMessage,
  AddTreasuresToIslandMessage,
  UpdateIslandModeMessage,
  AddSeekersToIslandMessage,
  ResolveIslandMessage

} from "@/lib/Types";

function logPlayer(player: PlayerObject) {
  console.log("Player", {
    id: player.id,
    name: player.name,
    balance: player.balance,
    seekers: player.seekers.length,
    inventory: player.inventory.length
  })
}

function logIsland(island: IslandObject) {
  console.log("Island", {
    id: island.id,
    mode: island.mode,
    size: island.size,
    balance: island.balance,
    treasures: island.treasures.length,
    seekers: island.seekers.length,
    price: island.price
  })
}


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

export default class Server implements Party.Server {
  islands: IslandObject[];
  players: PlayerObject[];
  events: EventObject[];
  expiration: number;

  constructor(readonly room: Party.Room) {
    this.islands = [];
    this.players = [];
    this.events = [];
    this.expiration = Date.now() + 5 * 60 * 1000;
  }

  async store(item: IslandObject | PlayerObject | EventObject) {
    await this.room.storage.put(item.id, item);
  }

  async storeMany(items: (IslandObject | PlayerObject | EventObject)[]) {
    await Promise.all(items.map(item => this.room.storage.put(item.id, item)));
  }

  async storePlayers() {
    await this.storeMany(this.players);
    await this.room.storage.put("player_ids", this.players.map(player => player.id));
  }

  async storeIslands() {
    await this.storeMany(this.islands);
    await this.room.storage.put("island_ids", this.islands.map(island => island.id));
  }

  async storeEvents() {
    await this.storeMany(this.events);
    await this.room.storage.put("event_ids", this.events.map(event => event.id));
  }

  async storeAll() {
    await this.storeIslands();
    await this.storePlayers();
    await this.storeEvents();
    
    await this.room.storage.put("expiration", this.expiration);
  }

  async storeKeys(type: "islands" | "players" | "events", data: any[]) {
    await this.room.storage.put(type, data);
  }

  async resetStorage() {
    const keys = [...(await this.room.storage.list()).keys()];
    await Promise.all(keys.map(key => this.room.storage.delete(key)));
  }

  async getIslands() {
    const keys: string[] = await this.room.storage.get("island_ids") ?? [];
    const items = (await Promise.all(keys.map(key => this.room.storage.get(key))) as IslandObject[]).map(item => {
      const i = new IslandObject(item.id, item.mode, item.expiration);
      i.treasures = item.treasures;
      i.seekers = item.seekers;
      i.balance = item.balance;
      return i;
    });
    return items;
  }

  async getPlayers() {
    const keys: string[] = await this.room.storage.get("player_ids") ?? [];
    const items = (await Promise.all(keys.map(key => this.room.storage.get(key)))) as PlayerObject[];
    return items;
  }

  async getEvents() {
    const keys: string[] = await this.room.storage.get("event_ids") ?? [];
    const items = (await Promise.all(keys.map(key => this.room.storage.get(key)))) as EventObject[];
    return items;
  }

  async init(reset: boolean = false) {
    if(reset){
      await this.resetStorage();
      this.islands = [];
      this.players = [];
      this.events = [];
      this.events.push(new EventObject("Game reset"));
      this.expiration = Date.now() + 5 * 60 * 1000;
    } else {
      this.islands = (await this.getIslands()) ?? [];
      this.players = (await this.getPlayers()) ?? [];
      this.events = (await this.getEvents()) ?? [];
      this.expiration = (await this.room.storage.get<number>("expiration")) ?? Date.now() + 5 * 60 * 1000;
    }
    

    const sampleSeekers = [
      new SeekerObject("Popkin", "gold", "player", "/img/popkin.png"),
      new SeekerObject("Ronin", "gold", "player", "/img/ronin.jpg"),
      new SeekerObject("Wolf", "silver", "player", "/img/wolves.png"),
      new SeekerObject("Galactic Ape", "bronze", "player", "/img/gape.png"),
      new SeekerObject("Pizza People", "silver", "player", "/img/pizza.png"),
      new SeekerObject("Critter", "bronze", "player", "/img/critter.png"),
    ]

    if (this.players.length <= 0) {
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
          this.events.push(new EventObject(`${player.name} joined the game`, player.id, 0, player.balance))
      });

      this.players = initial_players
    }

    if (this.islands.length <= 0) {
      this.islands = Array.from({ length: 2 }, (_, i) => new IslandObject(`Island ${i + 1}`, i % 2 === 0 ? 'hide' : 'seek', this.expiration))
    }

    await this.storeAll()
    await this.room.storage.setAlarm(this.expiration);
  }

  async onStart() {
    await this.init()
  }

  async onConnect(connection: Party.Connection) {
    const syncMessage = <SyncMessage>{
      type: "sync",
      data: {
        islands: this.islands,
        players: this.players,
        events: this.events
      }
    }
    connection.send(JSON.stringify(syncMessage));
  }



  async onAlarm() {
    // switch island modes
    this.expiration = Date.now() + 5 * 60 * 1000;

    for (let i = 0; i < this.islands.length; i++) {
      
      const island = this.islands[i];
      island.expiration = this.expiration;
      if (island.mode === "seek") {
        await this.resolveIsland(island.id)
      } else {
        island.mode = "seek"
        await this.broadcastIsland(island)
      }
    }


    this.broadcastIslands()
    this.broadcastPlayers()
    
  
    // (optional) schedule next alarm in 15 minutes
    this.room.storage.setAlarm(this.expiration);
    await this.storeAll()
  }

  async broadcastPlayer(player: PlayerObject) {
    const syncMessage = <PlayerSyncMessage>{
      type: "playersync",
      data: player
    }
    this.room.broadcast(JSON.stringify(syncMessage));
  }

  async broadcastEvent(event: EventObject) {
    const syncMessage = <EventSyncMessage>{
      type: "eventsync",
      data: event
    }
    this.room.broadcast(JSON.stringify(syncMessage));
  }

  async broadcastAllEvents() {
    const syncMessage = <PartialSyncMessage>{
      type: "partialsync",
      data: {
        events: this.events
      }
    }
    this.room.broadcast(JSON.stringify(syncMessage));
  }

  async broadcastEvents(events: EventObject[]) {
    const syncMessage = <PartialSyncMessage>{
      type: "partialsync",
      data: {
        events: events
      }
    }
    this.room.broadcast(JSON.stringify(syncMessage));
  }

  async broadcastPlayers() {
    const syncMessage = <PartialSyncMessage>{
      type: "partialsync",
      data: {
        players: this.players
      }
    } as PartialSyncMessage
    this.room.broadcast(JSON.stringify(syncMessage));
  }

  async broadcastIsland(island: IslandObject) {
    const syncMessage = <IslandSyncMessage>{
      type: "islandsync",
      data: island
    }
    this.room.broadcast(JSON.stringify(syncMessage));
  }

  async broadcastIslands() {
    const syncMessage = <PartialSyncMessage>{
      data: {
        islands: this.islands
      }
    }
    this.room.broadcast(JSON.stringify(syncMessage));
  }

  async broadcastSync() {
    const syncMessage = <SyncMessage>{
      type: "sync",
      data: {
        islands: this.islands,
        players: this.players,
        events: this.events
      }
    }
    this.room.broadcast(JSON.stringify(syncMessage));
  }

  async broadcastPartialSync(data: Partial<FullSyncData>) {
    const syncMessage = <PartialSyncMessage>{
      type: "partialsync",
      data: data
    }
    this.room.broadcast(JSON.stringify(syncMessage));
  }

  async transferTreasureOwnership(treasure: TreasureObject, fromPlayer_id: string, toPlayer_id: string) {
    const new_events: EventObject[] = []
    const fromPlayer = this.players.find(player => player.id === fromPlayer_id)
    const toPlayer = this.players.find(player => player.id === toPlayer_id)
    if (!fromPlayer || !toPlayer) {
      return null
    }
    
    if (!treasure) {
      return null
    }
    treasure.owner = toPlayer.id

    const event = new EventObject(`Treasure worth ${treasure.value} found by ${fromPlayer.name}`, fromPlayer.id, fromPlayer.balance, fromPlayer.balance, treasure.value)
    new_events.push(event)
    this.events.push(event)
    
    fromPlayer.inventory = fromPlayer.inventory.filter(t => t.id !== treasure.id)
    toPlayer.inventory.push(treasure)
    
    await this.storePlayers();
    return { players: [fromPlayer, toPlayer], events: new_events }
  }

  async createTreasure(player_id: string, value: number) {
    let player: PlayerObject | undefined | null = this.players.find(player => player.id === player_id)
    if (!player) {
      return null
    }
    const treasure = new TreasureObject(`Treasure ${player.inventory.length + 1}`, value, player_id, "/img/treasure.png");
    player = await this.adjustPlayerBalance(player_id, -value, `Created treasure worth ${value}`)
    if (!player) {
      return null
    }
    player.inventory.push(treasure)
    await this.storePlayers()
    return player
  }

  async addTreasuresToIsland(treasure_ids: string[], island_id: string, player_id: string) {
    const island = this.islands.find(island => island.id === island_id)
    const player = this.players.find(player => player.id === player_id)
    if (!island) {
      console.log(`Island with id ${island_id} not found`)
      return null
    }
    if (!player) {
      console.log(`Player with id ${player_id} not found`)
      return null
    }
    if(island.mode !== "hide") {
      console.log("Island is not in hide mode")
      return null
    }


    const treasures = player.inventory.filter(t => treasure_ids.includes(t.id)).map(t => ({ ...t, island: island.id, location: "island" } as TreasureObject))
    if (!treasures) {
      console.log(`Player ${player.name} does not have treasures with ids ${treasure_ids.join(', ')}`)
      return null
    }

    island.treasures.push(...treasures)
    // player.inventory = player.inventory.filter(t => !treasure_ids.includes(t.id))
    player.inventory = [
      ...player.inventory.filter(t => !treasure_ids.includes(t.id)),
      ...treasures
    ]

    await this.storePlayers()
    await this.storeIslands()
    
    return { players: [player], islands: [island] }
  }

  async resolveIsland(island_id: string) {
    const island = this.islands.find(island => island.id === island_id)
    const new_events: EventObject[] = []
    if (!island) {
      return null
    }

    const treasures = island.treasures;
    const total_value = island.value;

    for(let i = 0; i < treasures.length; i++) {
      const treasure = treasures[i];
      const value_share = treasure.value / total_value;
      const balance_share = Math.floor(island.balance * value_share);
      console.log("Island balance", island.balance)
      console.log("Total value", total_value)
      console.log("Value share", value_share)
      console.log("Balance share", balance_share)
      const player = this.players.find(player => player.id === treasure.owner)
      if(player){
        console.log("Player before")
        logPlayer(player)
      } 
      const p = await this.adjustPlayerBalance(treasure.owner, balance_share, `Resolved island and received ${balance_share} ( ${(value_share * 100).toFixed(2)}% of ${total_value} ) from seeker fees`);
      if(p){
        console.log("Player after")
        logPlayer(p)
      }
    }

    for(let i = 0; i < treasures.length; i++) {
      const treasure = treasures[i];
      const yield_amt = Math.ceil(treasure.value * 0.001);
      treasure.value += yield_amt;
      const owner = this.players.find(player => player.id === treasure.owner)
      if(owner){
        const event = new EventObject(`Treasure yielded ${yield_amt}, increasing to ${treasure.value}`, treasure.owner, owner.balance, owner.balance, yield_amt)
        new_events.push(event)
        this.events.push(event)
      }
    }

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
      if(seeker){
        seeker.energy += 1
        seeker.island = ""
        seeker.location = "player"
        const owner = this.players.find(player => player.id === seeker.owner)
        if(owner){
          owner.seekers = owner.seekers.map(s => s.id !== seeker.id ? s : seeker)
          if(!treasure) {
            const event = new EventObject(`Seeker ${seeker.name} returned emptyhanded`, seeker.owner, owner?.balance, owner?.balance)
            new_events.push(event)
            this.events.push(event)
          }
        }
        
      }
      if(treasure && seeker) {
          treasure.island = ""
          treasure.location = "player"
          const treasure_owner = this.players.find(player => player.id === treasure.owner)
          const data = await this.transferTreasureOwnership(treasure, treasure.owner, seeker.owner);
          const seeker_owner = this.players.find(player => player.id === seeker.owner)
          
          const event = new EventObject(`Seeker ${seeker.name} found treasure buried by ${treasure_owner?.name}`, seeker.owner, seeker_owner?.balance, seeker_owner?.balance, treasure.value)
          this.events.push(event)
          new_events.push(event)
          
          if(data){
            await this.broadcastPartialSync(data)
            
          }
          
      } 
      
    }
    island.seekers = []
    island.treasures = treasures.filter(t => t.location === "island")
    
    island.balance = 0

    island.mode = "hide"
    await this.broadcastIsland(island)
    await this.storeIslands()
    await this.storePlayers()
    await this.storeEvents()
    await this.broadcastEvents(new_events)
    await this.broadcastPlayers()
    return island
  }

  

  async adjustPlayerBalance(player_id: string, value: number, message: string = "") {
    const player = this.players.find(player => player.id === player_id)
    
    if (!player) {
      return null
    }
    const starting_balance = player.balance

    player.balance += value
    
    await this.storePlayers()
    await this.broadcastPlayer(player)
    console.log(message)
    console.log(message.includes("Created"))
    if(message !== ""){
      const event = new EventObject(message, player_id, starting_balance, player.balance)
      if (message.includes("Created")){
        event.value = -value

      } 
      console.log(event)
      this.events.push(event)
      await this.broadcastEvent(event)
      await this.store(event)
    }
    return player
  }

  async addSeekersToIsland(seeker_ids: string[], island_id: string, player_id: string) {
    const island = this.islands.find(island => island.id === island_id)
    const player = this.players.find(player => player.id === player_id)
    if (!island) {
      console.log(`Island with id ${island_id} not found`)
      return null
    }
    if (!player) {
      console.log(`Player with id ${player_id} not found`)
      return null
    }

    if(island.mode !== "seek") {
      console.log("Island is not in seek mode")
      return null
    }

    const seekers = player.seekers.filter(t => seeker_ids.includes(t.id)).map(t => ({ ...t, island: island.id, location: "island", energy: t.energy - 1 } as SeekerObject))
    if (!seekers) {
      console.log(`Player ${player.name} does not have seekers with ids ${seeker_ids.join(', ')}`)
      return null
    }

    if (island.size < island.seekers.length + seekers.length) {
      console.log("Island is full")
      return null
    }

    if (island.price * seekers.length > player.balance) {
        console.log("Player does not have enough balance")
        return null
    }

    island.seekers.push(...seekers)
    player.seekers = [
      ...player.seekers.filter(t => !seeker_ids.includes(t.id)),
      ...seekers
    ]
    console.log("Player before")
    logPlayer(player)
    console.log("Island before")
    logIsland(island)
    
    const p = await this.adjustPlayerBalance(player.id, -island.price * seekers.length, `Added ${seekers.length} seekers to island`)
    if(p){
      console.log("Player after")
      logPlayer(p)
    }

    island.balance += island.price * seekers.length

    console.log("Island after")
    logIsland(island)
    

    await this.storeAll()
    
    return { players: [player], islands: [island] }
  }

  sendError(connection: Party.Connection, message: string) {
    return connection.send(
      JSON.stringify(<SyncErrorMessage>{
        type: "syncerror",
        data: message
      })
    );
  }

  async onMessage(
    message: string,
    connection: Party.Connection
    ) {
    
    const msg = JSON.parse(message) as Message

    /* createTreasure */

    if (msg.method === "createTreasure") {
      const args = (msg as CreateTreasureMessage).args
      const player = await this.createTreasure(args.player_id, args.value)
      if (player) {
        await this.broadcastPlayer(player)
      } else {
        return this.sendError(connection, `Player with id ${args.player_id} not found`)
        }
    }

    if (msg.method === "addTreasuresToIsland") {
      const args = (msg as AddTreasuresToIslandMessage).args
      const data = await this.addTreasuresToIsland(args.treasure_ids, args.island_id, args.player_id)
      if (data) {
        await this.broadcastPartialSync(data)
      } else {
        return this.sendError(connection, `Player with id ${args.player_id} cannot move treasures with ids ${args.treasure_ids.join(', ')} to island with id ${args.island_id}`)
      }
    }

    if (msg.method === "updateIslandMode") {
      const args = (msg as UpdateIslandModeMessage).args
      const island = this.islands.find(island => island.id === args.island_id)
      if (island) {
        island.mode = args.mode
        await this.storeIslands()

        await this.broadcastIsland(island)
      } else {
        return this.sendError(connection, `Island with id ${args.island_id} not found`)
      }
    }

    if (msg.method === "addSeekersToIsland") {
      const args = (msg as AddSeekersToIslandMessage).args
      const data = await this.addSeekersToIsland(args.seeker_ids, args.island_id, args.player_id)
      if (data) {
        await this.broadcastPartialSync(data)
        await this.checkResolution()
      } else {
        return this.sendError(connection, `Player ${args.player_id} cannot move seekers with ids ${args.seeker_ids.join(', ')} to island with id ${args.island_id}`)
      }
    }

    if (msg.method === "resolveIsland") {
      const args = (msg as ResolveIslandMessage).args
      await this.resolveIsland(args.island_id)
    }

    if (msg.method === "resetGame") {
      await this.init(true)
      await this.broadcastSync()
    }
    


    console.log(msg)
  }

  async checkResolution() {
    for(let i = 0; i < this.islands.length; i++) {
      const island = this.islands[i];
      if(island.mode === "seek"){
        if(island.seekers.length === island.size){
          await this.resolveIsland(island.id)
        }
      }
    }
  }

  

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      // const island = (await req.json()) as IslandObject;
      // this.island = island;
    }

    if (req.method === "GET") {
      
        return json<SyncMessage>({ type: "sync", data: {
          islands: this.islands,
          players: this.players,
          events: this.events
        } });
      
    }

    

    if (this.islands.length > 0) {
      return new Response(JSON.stringify({islands: this.islands, players: this.players}), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  }
}

Server satisfies Party.Worker;