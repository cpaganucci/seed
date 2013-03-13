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

Graphics.prototype.line = function( length, width, color )
{
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.lineWidth = width;
    this.context.moveTo( 0, 0 );
    this.context.lineTo( 0, length );
    this.context.translate( 0, length );
    this.context.stroke();
};

Graphics.prototype.taperedLine = function( length, startWidth, endWidth, color )
{
    this.context.beginPath();
    //this.context.strokeStyle = color;
    this.context.fillStyle = color;
    //this.context.lineWidth = 1;
    this.context.moveTo( startWidth/2, 0 );
    this.context.lineTo( -startWidth/2, 0 );
    this.context.lineTo( -endWidth/2, length );
    this.context.lineTo( endWidth/2, length );
    this.context.lineTo( startWidth/2, 0 );
    //this.context.stroke();
    this.context.fill();

    this.context.translate( 0, length );
};

Graphics.prototype.square = function( size, width, color )
{
    this.context.save();
    this.context.translate( -size/2, -size/2 );
    for( var i=0; i<4; i++ )
    {
        this.line( size, width, color );
        this.context.rotate( -Math.PI / 2 );
    }
    this.context.restore();
};

Graphics.prototype.circle = function( radius, width, color )
{
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.strokeWidth = width;
    this.context.arc( 0, 0, radius, 0, Math.PI*2, false );
    this.context.stroke();
};
