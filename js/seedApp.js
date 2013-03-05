$(function ()
{
    var canvas = $("#mainCanvas"),
        canvasElement = canvas[0],
        graphicsHelper,
        context = canvasElement.getContext( "2d" )
        ;

    graphicsHelper = new GraphicsHelper();

    context.lineWidth = 1;

    context.translate( 300, 600 );
    context.rotate( Math.PI );

    context.beginPath();
    color( 255, 255, 0 );
    line( 300 );

    context.beginPath();
    color( 0, 255, 0 );
    for( var i=0; i<8; i++ )
    {
        square( 100 );
        context.rotate( Math.PI / 16 );
    }

    function color( r, g, b )
    {
        var strokeColor = { r:r, g:g, b:b, a:1 };
        context.strokeStyle = graphicsHelper.getColorString( strokeColor );
    }

    function line( length )
    {
        context.moveTo( 0, 0 );
        context.lineTo( 0, length );
        context.translate( 0, length );
        context.stroke();
    }

    function square( size )
    {
        context.save();
        context.translate( -size/2, -size/2 );
        for( var i=0; i<4; i++ )
        {
            line( size );
            context.rotate( -Math.PI / 2 );
        }
        context.restore();
    }
});
