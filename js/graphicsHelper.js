function GraphicsHelper()
{
}

GraphicsHelper.prototype.randInt = function( min, max )
{
    return Math.round( min + ( Math.random() * ( max - min ) ) );
};

GraphicsHelper.prototype.randColor = function()
{
    var r = this.randInt( 0, 255 );
    var g = this.randInt( 0, 255 );
    var b = this.randInt( 0, 255 );
    return this.getColorString( this.rgba( r, g, b, 1 ) );
};

GraphicsHelper.prototype.createTransform = function( tx, ty, scaleX, scaleY, rotation )
{
    var transform = {};
    transform.tx = tx;
    transform.ty = ty;
    transform.scaleX = scaleX;
    transform.scaleY = scaleY;
    transform.rotation = rotation;

    return transform;
};

GraphicsHelper.prototype.rgba = function( r, g, b, a )
{
    var color = {
        r: r,
        g: g,
        b: b,
        a: a
    };

    return color;
};

GraphicsHelper.prototype.getColorString = function( rgba )
{
    return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")";
};

GraphicsHelper.prototype.rgba2hsva = function( r, g, b, a )
{
    var min, max, delta, hsva = {};

    r = r / 255;
    g = g / 255;
    b = b / 255;

    min = Math.min( r, g, b );
    max = Math.max( r, g, b );

    hsva.v = max;

    delta = max - min;
    if( max != 0 )
    {
        hsva.s = delta / max;

        if( r == max )
            hsva.h = ( g - b ) / delta;
        else if( g == max )
            hsva.h = 2 + ( b - r ) / delta;
        else
            hsva.h = 4 + ( r - g ) / delta;

        hsva.h *= 60;
        if( hsva.h < 0 )
            hsva.h += 360;
    }
    else
    {
        hsva.s = 0;
        hsva.h = -1; //Why isn't this zero?
    }

    hsva.a = a;

    return hsva;
};

GraphicsHelper.prototype.hsva2rgba = function( h, s, v, a )
{
    var i, f, p, q, t, r, g, b;

    if( s == 0 )
    {
        r = g = b = v;
    }
    else
    {
        h /= 60;
        i = Math.floor( h );
        f = h - i;
        p = v * ( 1 - s );
        q = v * ( 1 - s * f );
        t = v * ( 1 - s * ( 1 - f ) );

        switch( i )
        {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            default:
                r = v;
                g = p;
                b = q;
                break;
        }
    }

    return {r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255),a:a};
};

GraphicsHelper.prototype.interpolateHSVA = function( hsva1, hsva2, pct )
{
    var h1, h2, h, s, v, a;

    h1 = hsva1.h / 360;
    h2 = hsva2.h / 360;

    var distCCW = ( h1 >= h2 ) ? h1 - h2 : 1 + h1 - h2;
    var distCW = ( h1 >= h2 ) ? 1 + h2 - h1 : h2 - h1;
    h = ( distCW <= distCCW ) ? h1 + ( distCW * pct ) : h1 - ( distCCW * pct );
    if( h < 0 ) h = 1 + h;
    if( h > 1 ) h = h - 1;
    s = ( 1 - pct ) * hsva1.s + pct * hsva2.s;
    v = ( 1 - pct ) * hsva1.v + pct * hsva2.v;

    h *= 360;

    a = ( hsva1.a + hsva2.a ) / 2;

    return {h:h,s:s,v:v,a:a};
};

GraphicsHelper.prototype.interpolateAspectRatio = function( aspect1, aspect2, pct )
{
    var w1, h1, w2, h2, wOut, hOut;

//    if( aspect1 > 1 )
//    {
//        w1 = 1;
//        h1 = 1 / aspect1;
//    }
//    else
//    {
//        h1 = 1;
//        w1 = aspect1;
//    }
//
//    if( aspect2 > 1 )
//    {
//        w2 = 1;
//        h2 = 1 / aspect2;
//    }
//    else
//    {
//        h2 = 1;
//        w2 = aspect2;
//    }

    if( aspect1 > 1 )
    {
        w1 = aspect1;
        h1 = 1;
    }
    else
    {
        w1 = 1;
        h1 = 1 / aspect1;
    }

    if( aspect2 > 1 )
    {
        w2 = aspect2;
        h2 = 1;
    }
    else
    {
        w2 = 1;
        h2 = 1 / aspect2;
    }

    wOut = w1 + ( w2 - w1 ) * pct;
    hOut = h1 + ( h2 - h1 ) * pct;

    return wOut / hOut;
};













































