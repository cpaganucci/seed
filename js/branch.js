function Branch( seed, size, angle, curDepth )
{
    this.seed = seed;
    this.graphics = seed.graphics;
    this.angle = angle;
    this.size = size;
    this.branches = [];

    var rand, newSize, newAngle;

    if( curDepth > this.seed.depth )
        return;

    rand = ( Math.random() * 2 - 1 ) * .3;
    newSize = size * 0.5 + rand;
    this.branches.push( new Branch( this.seed, newSize, 0, curDepth+1 ) );

    var startingAngle = angle;
    if( angle == 0 )
    {
        startingAngle = Math.PI/6;
        if( Math.random() < 0.5 )
            startingAngle *= -1;
    }

    var prob = 0.8;
    for( var i=0; i<2; i++ )
    {
        if( Math.random() < prob )
        {
            rand = ( Math.random() * 2 - 1 ) * .7;
            newAngle = startingAngle + rand;
            rand = ( Math.random() * 2 - 1 ) * .5;
            newSize = size * 0.6 + rand - ( 0.05 * curDepth );
            this.branches.push( new Branch( this.seed, newSize, newAngle, curDepth+1 ) );

            prob -= 0.4;
        }

        startingAngle *= -1;
    }
}

Branch.prototype.draw = function()
{
    if( this.branches.length > 0 )
    {
        this.graphics.context.save();
        this.graphics.rotate( this.angle );
        this.graphics.line( this.size, this.seed.color );
        for( var i=0; i<this.branches.length; i++ )
        {
            this.branches[i].draw();
        }
        this.graphics.context.restore();
    }
    else
    {
        this.graphics.rotate( this.angle );
        this.graphics.square( this.seed.leafSize, this.seed.leafColor );
    }
};
