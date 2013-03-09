function Leaf( seed, angle )
{
    this.seed = seed;
    this.graphics = seed.graphics;
    this.angle = angle;

    var rand = ( Math.random() * 2 - 1 ) * .5;
    this.size = seed.leafSize + seed.leafSize * rand;
}

Leaf.prototype.draw = function()
{
    this.graphics.rotate( this.angle );
    this.graphics.square( this.size, 1, this.seed.leafColor );
};
