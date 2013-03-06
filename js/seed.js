function Seed( graphics )
{
    this.graphics = graphics;
    this.position = {x:0,y:0};
    this.rotation = 0;
    this.size = 0;
    this.color = graphics.graphicsHelper.randColor();
}

Seed.prototype.draw = function()
{
    this.graphics.home();
    this.graphics.translate( this.position.x, this.position.y );
    this.graphics.rotate( this.rotation );

    this.graphics.line( this.size, "#00ff00" );

    for( var i=0; i<8; i++ )
    {
        this.graphics.square( this.size / 3, this.color );
        this.graphics.rotate( Math.PI / 16 );
    }
};
