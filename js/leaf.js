function Leaf( seed, angle )
{
    this.seed = seed;
    this.graphics = seed.graphics;
    this.angle = angle;

    var rand = ( Math.random() * 2 - 1 ) * .5;
//    this.sizeOffset = seed.leafSize * rand;
    this.sizeOffset = rand;
}

Leaf.prototype.draw = function()
{
    this.graphics.rotate( this.angle );
    this.graphics.square( this.seed.leafSize + ( this.seed.leafSize * this.sizeOffset ), 1, this.seed.leafColor );
};
