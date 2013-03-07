function Graphics( context )
{
    this.context = context;
    this.graphicsHelper = new GraphicsHelper();
    this.context.lineWidth = 1;
}

Graphics.prototype.clear = function()
{
    this.home();
    this.context.fillStyle = "#333344";
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
};

Graphics.prototype.home = function()
{
    this.context.setTransform( 1, 0, 0, 1, 0, 0 );
};

Graphics.prototype.translate = function( x, y )
{
    this.context.translate( x, y );
};

Graphics.prototype.rotate = function( angle )
{
    this.context.rotate( angle );
};

//    function color( r, g, b )
//    {
//        var strokeColor = { r:r, g:g, b:b, a:1 };
//        context.strokeStyle = graphicsHelper.getColorString( strokeColor );
//    }

Graphics.prototype.line = function( length, color )
{
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.moveTo( 0, 0 );
    this.context.lineTo( 0, length );
    this.context.translate( 0, length );
    this.context.stroke();
};

Graphics.prototype.square = function( size, color )
{
    this.context.save();
    this.context.translate( -size/2, -size/2 );
    for( var i=0; i<4; i++ )
    {
        this.line( size, color );
        this.context.rotate( -Math.PI / 2 );
    }
    this.context.restore();
};

Graphics.prototype.circle = function( radius, color )
{
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.arc( 0, 0, radius, 0, Math.PI*2, false );
    this.context.stroke();
};
