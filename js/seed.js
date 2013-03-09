function Seed( graphics )
{
    this.graphics = graphics;
    this.position = {x:0,y:0};
    this.rotation = 0;
    this.size = 0;
    this.trunkWidth = 0;
    this.color = graphics.graphicsHelper.randColor();
    this.depth = 0;
    this.branch = {};
    this.leafSize = 0;
    this.leafColor = graphics.graphicsHelper.randColor();
}

Seed.prototype.grow = function()
{
    this.branch = new Branch( this, this.size, this.trunkWidth, 0, 0 );
};

Seed.prototype.draw = function()
{
    this.graphics.home();
    this.graphics.translate( this.position.x, this.position.y );
    this.graphics.rotate( this.rotation );

    this.branch.draw();
};
