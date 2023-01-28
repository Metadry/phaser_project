import Player from "../scripts/player/Player";

export default class Juego extends Phaser.Scene{

    preload(){
        this.load.image('tiles', 'Tileset.png');
        this.load.image('items', 'Items.png');
        this.load.tilemapTiledJSON('Mapa', 'Mapa.json');
                
        this.load.spritesheet('tilesSprites','Tileset.png',
        { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('itemSprites','Items.png',
        { frameWidth: 32, frameHeight: 32});

    }

    create(){
        this.add.tileSprite(0, 0, 2848, 1024, 'hg');

        var map = this.make.tilemap({ key: 'Mapa'});
        var tilesItems = map.addTilesetImage('Items', 'items');
        var tiles = map.addTilesetImage('Mapa', 'tiles');
        


        var layerBackground = map.createLayer('BackGround', tiles, 0, 0);
        var layerForeground = map.createLayer('Foreground', tiles, 0, 0);
        var layerStairs = map.createLayer('Stairs', tiles, 0, 0);
        var layerPortal = map.createLayer('Portal', tiles, 0, 0);
        var layerTilesDeath = map.createLayer('TilesDeath', tiles, 0, 0);
        var layerDetail = map.createLayer('Detail', tiles, 0, 0);
        var layerDetail2 = map.createLayer('Detail2', tiles, 0, 0);
        var layerDetail3 = map.createLayer('Detail3', tiles, 0, 0);
        var layerTilesMoveV = map.createLayer('TilesMoveV', tiles, 0, 0);
        var layerTilesMoveH = map.createLayer('TilesMoveH', tiles, 0, 0);
        var layerCollectable = map.createLayer('Collectable', tilesItems, 0, 0);
        var layerDoubleJump = map.createLayer('DoubleJump', tilesItems, 0, 0);
        var layerAmmo = map.createLayer('Ammo', tilesItems, 0, 0);
        var layerEndgame = map.createLayer('EndGame', tiles, 0, 0);

        layerForeground.setCollisionByExclusion(-1,true);

        var player = new Player(this, 100, 450,'player');
        this.physics.add.collider(player, layerForeground);
        // var musica = new Audio('phaserMusic')
        // musica.play();

        

    }

    update(){
        if(this.input.keyboard.addKey('space')){
            
        }

    }




}