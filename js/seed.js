function Seed( graphics )
{
    this.graphics = graphics;
    this.position = {x:0,y:0};
    this.rotation = 0;
    this.size = 0;
    this.color = graphics.graphicsHelper.randColor();
    this.depth = 5;
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

Seed.prototype.draw = function()
{
    this.graphics.home();
    this.graphics.translate( this.position.x, this.position.y );
    this.graphics.rotate( this.rotation );

    this.drawBranch( this.size, 0, 0 );
};

Seed.prototype.drawBranch = function( size, angle, curDepth )
{
    if( curDepth > this.depth )
        return;

    this.graphics.context.save();
    this.graphics.rotate( angle );
    this.graphics.line( size, this.color );
    var rand = 0;//( Math.random() * 2 - 1 ) * 2;
    this.drawBranch( size/2, Math.PI/4 + rand, curDepth+1 );
    rand = 0;//( Math.random() * 2 - 1 ) * 2;
    this.drawBranch( size/2, -Math.PI/4 + rand, curDepth+1 );
    this.graphics.context.restore();
};
