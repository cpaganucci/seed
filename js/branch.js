function Branch( seed, size, width, angle, curDepth )
{
    this.seed = seed;
    this.graphics = seed.graphics;
    this.angle = angle;
    this.curDepth = curDepth;
    this.size = size;
    this.startWidth = width;
    this.endWidth = width;
    this.branches = [];
    this.leaf = {};
}

Branch.prototype.grow = function()
{
    var rand, newBranch, newSize, newAngle;

    if( this.curDepth > this.seed.depth )
        return;

    if( this.curDepth < this.seed.depth-1 )
    {
         var startingAngle = this.angle;
        if( this.angle == 0 )
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
                rand = ( Math.random() * 2 - 1 ) * 1;
                newSize = this.size * 0.6 + rand - ( 0.05 * this.curDepth );
                this.endWidth = newSize * this.startWidth / this.size;
                newBranch = new Branch( this.seed, newSize, this.endWidth, newAngle, this.curDepth+1 );
                newBranch.grow();
                this.branches.push( newBranch );

                prob -= 0.4;
            }

            startingAngle *= -1;
        }
    }

    if( this.curDepth < this.seed.depth )
    {
        rand = ( Math.random() * 2 - 1 ) * .3;
        newSize = this.size * 0.5 + rand;
        this.endWidth = newSize * this.startWidth / this.size;
        newBranch = new Branch( this.seed, newSize, this.endWidth,  0, this.curDepth+1 );
        newBranch.grow();
        this.branches.push( newBranch );
    }

    if( this.curDepth == this.seed.depth )
    {
        this.leaf = new Leaf( this.seed, this.angle );
    }
};

Branch.prototype.draw = function()
{
    if( this.branches.length > 0 )
    {
        this.graphics.context.save();
        this.graphics.rotate( this.angle );
   //     this.graphics.line( this.size * this.seed.sizeFactor, this.startWidth * this.seed.widthFactor * this.seed.sizeFactor, this.seed.color );
        this.graphics.taperedLine( this.size * this.seed.sizeFactor,
                                   this.startWidth * this.seed.widthFactor * this.seed.sizeFactor,
                                   this.endWidth * this.seed.widthFactor * this.seed.sizeFactor,
                                   this.seed.color );
        for( var i=0; i<this.branches.length; i++ )
        {
            this.branches[i].draw();
        }
        this.graphics.context.restore();
    }
    else
    {
//        this.graphics.rotate( this.angle );
//        this.graphics.square( this.seed.leafSize, 1, this.seed.leafColor );
//        this.graphics.circle( this.seed.leafSize, 1, this.seed.leafColor );
        this.leaf.draw();
    }
};
