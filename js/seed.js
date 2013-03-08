function Seed( graphics )
{
    this.graphics = graphics;
    this.position = {x:0,y:0};
    this.rotation = 0;
    this.size = 0;
    this.color = graphics.graphicsHelper.randColor();
    this.depth = 5;
    this.branch = {};
    this.leafSize = 15;
    this.leafColor = graphics.graphicsHelper.randColor();
}

//Seed.prototype.draw = function()
//{
//    this.graphics.home();
//    this.graphics.translate( this.position.x, this.position.y );
//    this.graphics.rotate( this.rotation );
//
//    this.graphics.line( this.size, "#00ff00" );
//
//    for( var i=0; i<8; i++ )
//    {
//        this.graphics.square( this.size / 3, this.color );
//        this.graphics.rotate( Math.PI / 16 );
//    }
//};

Seed.prototype.grow = function()
{
    this.branch = new Branch( this, this.size, 0, 0 );
};

Seed.prototype.draw = function()
{
    this.graphics.home();
    this.graphics.translate( this.position.x, this.position.y );
    this.graphics.rotate( this.rotation );

    this.branch.draw();
};
