import Player from "./scripts/player/Player";

class MainScene extends Phaser.Scene{

    preload(){
        this.load.tilemapTiledJSON('Mapa', 'public/Mapa.json');
        

    }

    create(){
        this.add.tileSprite(0, 0, 2848, 1024, 'hg');

        var map = this.make.tilemap({ key: 'Mapa'});
        var tiles = map.addTilesetImage('Tileset, tile');
        var layerBackground = map.createLayer('Background', tiles, 0, 0);
        var layerForeground = map.createLayer('Foreground', tiles, 0, 0);
        var layerStairs = map.createLayer('Stairs', tiles, 0, 0);
        var layerPortal = map.createLayer('Portal', tiles, 0, 0);
        var layerTilesDeath = map.createLayer('TilesDeath', tiles, 0, 0);
        var layerDetail = map.createLayer('Detail', tiles, 0, 0);
        var layerDetail2 = map.createLayer('Detail2', tiles, 0, 0);
        var layerDetail3 = map.createLayer('Detail3', tiles, 0, 0);
        var layerTilesMoveV = map.createLayer('TilesMoveV', tiles, 0, 0);
        var layerTilesMoveH = map.createLayer('TilesMoveH', tiles, 0, 0);
        var layerCollectable = map.createLayer('Collectable', tiles, 0, 0);
        var layerDoubleJump = map.createLayer('DoubleJump', tiles, 0, 0);
        var layerAmmo = map.createLayer('Ammo', tiles, 0, 0);
        var layerEndgame = map.createLayer('EndGame', tiles, 0, 0);

        layerForeground.setCollisionByExclusion(-1,true);

        var player = new Player(this, 75, 50,'player');
        this.physics.add.collider(player, layerForeground);

    }

    update(){

    }




}