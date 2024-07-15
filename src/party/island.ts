import type * as Party from "partykit/server";
import { json, notFound } from "@/party/utils/response";
import { 
  IslandObject, 
  PlayerObject, 
  SeekerObject, 
  TreasureObject, 
  SyncErrorMessage,
  FullSyncData,
  SyncMessage,
  IslandSyncMessage,
  PlayerSyncMessage,
  PartialSyncMessage,
  Message,
  CreateTreasureMessage,
  AddTreasuresToIslandMessage,
  UpdateIslandModeMessage,
  AddSeekersToIslandMessage,
  ResolveIslandMessage

} from "@/lib/Types";


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

  constructor(readonly room: Party.Room) {
    this.islands = [];
    this.players = [];

  }

  async init(reset: boolean = false) {
    if(reset){
      this.islands = [];
      this.players = [];
    } else {
      this.islands = (await this.room.storage.get<IslandObject[]>("islands")) ?? [];
      this.players = (await this.room.storage.get<PlayerObject[]>("players")) ?? [];
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
      });

      this.players = initial_players
    }

    if (this.islands.length <= 0) {
      this.islands = Array.from({ length: 5 }, (_, i) => new IslandObject(`Island ${i + 1}`, 'hide'))
    }

    await this.room.storage.put("islands", this.islands);
    await this.room.storage.put("players", this.players);
  }

  async onStart() {
    await this.init()
  }

  async onConnect(connection: Party.Connection) {
    const syncMessage = <SyncMessage>{
      type: "sync",
      data: {
        islands: this.islands,
        players: this.players
      }
    }
    connection.send(JSON.stringify(syncMessage));
  }

  async broadcastPlayer(player: PlayerObject) {
    const syncMessage = <PlayerSyncMessage>{
      type: "playersync",
      data: player
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
        players: this.players
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
    const fromPlayer = this.players.find(player => player.id === fromPlayer_id)
    const toPlayer = this.players.find(player => player.id === toPlayer_id)
    if (!fromPlayer || !toPlayer) {
      return null
    }
    
    if (!treasure) {
      return null
    }
    treasure.owner = toPlayer.id



    fromPlayer.inventory = fromPlayer.inventory.filter(t => t.id !== treasure.id)
    toPlayer.inventory.push(treasure)
    await this.room.storage.put("players", this.players);
    return { players: [fromPlayer, toPlayer] }
  }

  async createTreasure(player_id: string, value: number) {
    const player = this.players.find(player => player.id === player_id)
    if (!player) {
      return null
    }
    const treasure = new TreasureObject(`Treasure ${player.inventory.length + 1}`, value, player_id, "/img/treasure.png");
    player.balance -= value
    player.inventory.push(treasure)
    await this.room.storage.put("players", this.players);
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

    await this.room.storage.put("islands", this.islands);
    await this.room.storage.put("players", this.players);
    
    return { players: [player], islands: [island] }
  }

  async resolveIsland(island_id: string) {
    const island = this.islands.find(island => island.id === island_id)
    if (!island) {
      return null
    }

    const treasures = island.treasures;
    const total_value = island.value;

    for(let i = 0; i < treasures.length; i++) {
      const treasure = treasures[i];
      const value_share = treasure.value / total_value;
      const balance_share = Math.floor(island.balance * value_share);
      await this.adjustPlayerBalance(treasure.owner, balance_share);
    }

    for(let i = 0; i < treasures.length; i++) {
      const treasure = treasures[i];
      treasure.value = Math.ceil(treasure.value * 1.01);
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
        }
      }
      if(treasure && seeker) {
          treasure.island = ""
          treasure.location = "player"
          const data = await this.transferTreasureOwnership(treasure, treasure.owner, seeker.owner);
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
    await this.room.storage.put("islands", this.islands);
  }

  

  async adjustPlayerBalance(player_id: string, value: number) {
    const player = this.players.find(player => player.id === player_id)
    if (!player) {
      return null
    }
    player.balance += value
    await this.broadcastPlayer(player)
    await this.room.storage.put("players", this.players);
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
    player.balance -= island.price * seekers.length
    island.balance += island.price * seekers.length

    await this.room.storage.put("islands", this.islands);
    await this.room.storage.put("players", this.players);
    
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
        await this.room.storage.put("islands", this.islands);

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
          players: this.players
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