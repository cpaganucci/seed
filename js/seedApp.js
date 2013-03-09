function SeedApp( canvas )
{
    this.canvas = canvas;
    this.graphics = new Graphics( canvas[0].getContext( "2d") );
    this.downPoint = { x:0, y:0 };
    this.dragLength = 0;
    this.dragAngle = 0;
    this.dragging = false;
    this.seeds = [];
    
    this.canvas.attr( "width", $(window).width() );
    this.canvas.attr( "height", $(window).height() );
}

SeedApp.prototype.keyPress = function( e )
{
    var c = String.fromCharCode( e.which );
    switch( c )
    {
        case " ":
            this.seeds = [];
            break;
    }
};

SeedApp.prototype.mouseDown = function( pos )
{
    this.downPoint = pos;
    this.dragAngle = 0;
    this.dragLength = 0;
    this.dragging = true;
};

SeedApp.prototype.mouseMove = function( pos )
{
    if( this.dragging )
    {
        this.graphics.clear();

        var x = pos.x - this.downPoint.x;
        var y = pos.y - this.downPoint.y;
        var hyp = Math.sqrt( x*x + y*y );
        var angle = Math.acos( x / hyp );
        if( y < 0 )
        {
            angle += Math.PI/2;
            angle *= -1;
        }
        else
        {
            angle -= Math.PI/2;
        }

        this.dragLength = hyp;
        this.dragAngle = angle;
    }
};

SeedApp.prototype.mouseUp = function( pos )
{
    this.dragging = false;

    var seed = new Seed( this.graphics );
    seed.depth = 6;
    seed.position = this.downPoint;
    seed.rotation = this.dragAngle;
    seed.size = this.dragLength;
    seed.trunkWidth = 20;
    seed.leafSize = 20;
    seed.grow();
    this.seeds.push( seed );
};

SeedApp.prototype.draw = function()
{
    this.graphics.clear();

    for( var i=0; i<this.seeds.length; i++ )
    {
        this.seeds[i].draw();
    }

    //draw cursor
    if( this.dragging )
    {
        this.graphics.home();
        this.graphics.translate( this.downPoint.x, this.downPoint.y );
        this.graphics.circle( 10, "#000000" );
        this.graphics.rotate( this.dragAngle );
        this.graphics.line( this.dragLength, "#000000" );
    }
};

SeedApp.prototype.startRender = function()
{
    this.renderLoop( this );
};

SeedApp.prototype.renderLoop = function( self )
{
    TWEEN.update();

    this.draw();

    requestAnimationFrame( function() { self.renderLoop( self ) }  );
};
