function Seed( graphics )
{
    this.graphics = graphics;
    this.position = {x:0,y:0};
    this.rotation = 0;
    this.size = 0;
    this.sizeFactor = 1;
    this.trunkWidth = 0;
    this.widthFactor = 1;
    this.color = '#ffffff';
    this.depth = 0;
    this.branch = {};
    this.leafSize = 0;
    this.leafColor = '#ffffff';
}

Seed.prototype.grow = function()
{
    this.branch = new Branch( this, this.size, this.trunkWidth, 0, 0 );
    this.branch.grow();
};

Seed.prototype.draw = function()
{
    this.graphics.home();
    this.graphics.translate( this.position.x, this.position.y );
    this.graphics.rotate( this.rotation );

    this.branch.draw();
};
