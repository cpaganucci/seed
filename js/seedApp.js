$(function ()
{
    var canvas = $("#mainCanvas"),
        canvasElement = canvas[0],
        graphics,
        graphicsHelper,
        turtle = new Turtle( canvasElement.getContext( "2d" ) ),
        points = []
        ;

    $( canvas ).click( function(e) {
       addPoint( e.pageX, e.pageY );
    });

    graphicsHelper = new GraphicsHelper();
    graphics = new Graphics( canvasElement, "source-over" );
    graphics.reset();

    points.push( graphics.point( 0, 0 ) );
    points.push( graphics.point( 100, 0 ) );
    points.push( graphics.point( 100, 100 ) );
    points.push( graphics.point( 0, 100 ) );
    points.push( graphics.point( 0, 0 ) );

    var line = graphics.poly( points );
    var c1 = graphicsHelper.rgba( 255, 0, 0, 1 );
    var c2 = graphicsHelper.rgba( 0, 255, 0, 1 );
    graphics.addLine( line, 1, c1, c2, false );

    graphics.graphics.translate( 300, 300 );

    for( var i=0; i<16; i++ )
    {
        graphics.draw();

        turtle.right( Math.PI / 8 );
    }
    
    function addPoint( x, y )
    {
        graphics.lineList[0].points.push( {x:x,y:y} );
        graphics.draw();
    }
});
