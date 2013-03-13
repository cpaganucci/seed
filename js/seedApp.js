function SeedApp( canvas )
{
    this.canvas = canvas;
    this.graphics = new Graphics( canvas[0].getContext( "2d") );
    this.downPoint = { x:0, y:0 };
    this.dragLength = 0;
    this.dragAngle = 0;
    this.dragging = false;
    this.seeds = [];

    this.gui = new dat.GUI();
    
    this.canvas.attr( "width", $(window).width() );
    this.canvas.attr( "height", $(window).height() );
}

SeedApp.prototype.keyPress = function( e )
{
    var c = String.fromCharCode( e.which );
    switch( c )
    {
        case " ":
            this.gui.destroy();
            this.gui = new dat.GUI();
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
    if( this.dragging )
    {
        this.dragging = false;

        var seed = new Seed( this.graphics );
        seed.depth = 8;
        seed.position = this.downPoint;
        seed.rotation = this.dragAngle;
        seed.size = this.dragLength;
        seed.trunkWidth = seed.size * 0.05;
        seed.leafSize = 2;
        seed.color = this.graphics.graphicsHelper.randColor();
        seed.leafColor = this.graphics.graphicsHelper.randColor();
        seed.grow();

        var f1 = this.gui.addFolder( 'Seed ' + (this.seeds.length+1) );
        var depthController = f1.add( seed, 'depth', 0, 10 ).step( 1 );
        depthController.onFinishChange( function(value)
        {
           seed.grow();
        });
        f1.add( seed, 'sizeFactor').step( 0.01 );
        f1.add( seed, 'widthFactor', 0 ).step( 0.01 );
        f1.addColor( seed, 'color' );
        f1.addColor( seed, 'leafColor' );
        f1.add( seed, 'leafSize' );
        f1.open();

        this.seeds.push( seed );
    }
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
