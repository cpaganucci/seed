function Graphics( canvas, compositeType )
{
    if (canvas !== undefined) {
        if (typeof FlashCanvas != "undefined") {
            canvas = FlashCanvas.initElement(canvas);
        }
        this.graphicsHelper = new GraphicsHelper();
        this.graphics = canvas.getContext( "2d" );
        this.shapeList = [];
        this.lineList = [];
        this.pointList = [];
        this.font = undefined;
        this.shadowOffset = 5 / canvas.width;
        this.bgColor = undefined;
        this.compositeType = compositeType;
    }

    //this.graphics.globalCompositeOperation = compositeType;
}

Graphics.prototype.clear = function () {
    //this.graphics.setTransform(this.graphics.canvas.width, 0, 0, this.graphics.canvas.height, 0, 0);
    if (this.bgColor) {
        this.graphics.fillStyle = this.graphicsHelper.getColorString(this.graphicsHelper.hsva2rgba(this.bgColor.h, this.bgColor.s, this.bgColor.v, 0.5));
        this.graphics.fillRect(0, 0, this.graphics.canvas.width, this.graphics.canvas.height);
    } else {
        this.graphics.clearRect(0, 0, 1, 1);
    }
};

Graphics.prototype.reset = function()
{
    this.shapeList = [];
    this.lineList = [];
    this.pointList = [];
    this.clear();
};

Graphics.prototype.point = function( x, y )
{
    return {
        x: x,
        y: y
    };
};

Graphics.prototype.circle = function( r )
{
    return {
        type: "circle",
        center: { x:0, y:0 },
        radius: r
    };
};

Graphics.prototype.rect = function( w, h )
{
    return {
        type: "rect",
        width: w,
        height: h
    };
};

Graphics.prototype.poly = function( points )
{
    return {
        type: "poly",
        points: points
    };
};

Graphics.prototype.compound = function( polys, circles )
{
    return {
        type: "compound",
        polys: polys,
        circles: circles
    };
};

Graphics.prototype.wave = function( minPeriod, maxPeriod, maxAmplitude, curveFactor, isBezier, isPicasso )
{
    return {
        type: "wave",
        period1: 1,
        period2: 1,
        minPeriod: minPeriod,
        maxPeriod: maxPeriod,
        curAmpArray1: [],
        curAmpArray2: [],
        targetAmpArray1: [],
        targetAmpArray2: [],
        maxAmplitude: maxAmplitude,
        curveFactor: curveFactor,
        tweenVal: 0,
        graphicsHelper: this.graphicsHelper,
        points: [],
        isDataDriven: false,
        isBezier: isBezier,
        isPicasso: isPicasso,
        init: function( points )
        {
            this.isDataDriven = true;
            this.points = points;

//            var r = this.graphicsHelper.randInt( 0, 255 );
//            var g = this.graphicsHelper.randInt( 0, 255 );
//            var b = this.graphicsHelper.randInt( 0, 255 );
//            this.color = this.graphicsHelper.rgba( r, g, b, 0.7 );
        },
        randomize: function()
        {
            this.curAmpArray1 = [];
            this.curAmpArray2 = [];
            this.targetAmpArray1 = [];
            this.targetAmpArray2 = [];

            this.period1 = this.graphicsHelper.randInt( this.minPeriod, this.maxPeriod ) * 2;
            this.period2 = this.graphicsHelper.randInt( this.minPeriod, this.maxPeriod ) * 2;
//            console.log( this.period1 );
//            console.log( this.period2 );

            for( var i=0; i<this.period1; i++ )
            {
                this.targetAmpArray1[i] = this.graphicsHelper.randInt( -this.maxAmplitude, this.maxAmplitude );
            }

            for( var j=0; j<this.period2; j++ )
            {
                this.targetAmpArray2[j] = this.graphicsHelper.randInt( -this.maxAmplitude, this.maxAmplitude );
            }

//            var r = this.graphicsHelper.randInt( 0, 255 );
//            var g = this.graphicsHelper.randInt( 0, 255 );
//            var b = this.graphicsHelper.randInt( 0, 255 );
//            this.color = this.graphicsHelper.rgba( r, g, b, 0.3 );
        },
        update: function()
        {
            if( this.isDataDriven )
            {
                for( var i=0; i<this.points.length; i++ )
                {
                    this.points[i].y = this.points[i].targetY * this.tweenVal;
                }
            }
            else
            {
                for( var i=0; i<this.period1; i++ )
                {
                    this.curAmpArray1[i] = this.tweenVal * this.targetAmpArray1[i];
                }
                for( var j=0; j<this.period2; j++ )
                {
                    this.curAmpArray2[j] = this.tweenVal * this.targetAmpArray2[j];
                }
            }
        }
    };
};

Graphics.prototype.text = function (string, height, radius, kerning) {
    if (this.font == undefined) {
        this.font = new PulseFont();
    }

    var points = [];
    var letters = string.split('');
    var curX = 0;
    //var spacing = 0.5 * height;
    for (var i = 0; i < letters.length; i++) {
        var letter = letters[i];
        var arrLetter = this.font[letter];
        var charWidth = 0;
        for (var j = 0; j < arrLetter.length; j += 2) {
            var charX = arrLetter[j] / 100 * height;
            var charY = arrLetter[j + 1] / 100 * height;
            points.push(curX + charX);
            points.push(charY);
            charWidth = Math.max(charWidth, charX);
        }

        if (i < letters.length - 1) {
            var spacing = kerning[i] * height;
            curX += spacing;
        }

        curX += charWidth;
    }

    return {
        type: "text",
        points: points,
        height: height,
        radius: radius,
        textWidth: curX
    };
};

Graphics.prototype.makeStar = function( numPoints, ratio, scale )
{
    var points = [],
        angle = Math.PI / numPoints,
        outerScale = scale,
        innerScale = scale * ratio;

    for( var i=0; i<numPoints*2; i++ )
    {
        var mult = ( i%2 == 0 ) ? outerScale : innerScale;
        points.push( {x:Math.sin(i*angle)*mult, y:Math.cos(i*angle)*mult} );
    }

    return points;
};

Graphics.prototype.randPoly = function( numPoints, randFactor )
{
    var points = [],
        angle = 2 * Math.PI / numPoints,
        curOffset = Math.random();

    for( var i=0; i<numPoints; i++ )
    {
        var mult = 1 + curOffset;
        points.push( {x:Math.sin(i*angle)*mult, y:Math.cos(i*angle)*mult} );
        curOffset += ( Math.random() * 2 - 1 ) * randFactor;
    }

    return points;
};

Graphics.prototype.copyShape = function (shape) {
    var newShape = {};
    switch (shape.type) {
        case "circle":
            newShape = this.copyCircle(shape);
            break;

        case "rect":
            newShape.width = shape.width;
            newShape.height = shape.height;
            break;

        case "poly":
            newShape = this.copyPoly(shape);
            break;

        case "compound":
            newShape.polys = [];
            newShape.circles = [];
            if (shape.polys) {
                for (var i = 0; i < shape.polys.length; i++) {
                    newShape.polys.push(this.copyPoly(shape.polys[i]));
                }
            }
            if (shape.circles) {
                for (var j = 0; j < shape.circles.length; j++) {
                    newShape.circles.push(this.copyCircle(shape.circles[j]));
                }
            }
            break;
    }

    newShape.type = shape.type;

    return newShape;
};

Graphics.prototype.copyPoly = function( poly )
{
    var newPoly = {};
    newPoly.points = [];
    for( var i=0; i<poly.points.length; i++ )
    {
        var point = poly.points[i];
        newPoly.points.push( {x:point.x, y:point.y} );
    }

    return newPoly;
};

Graphics.prototype.copyCircle = function( circle )
{
    var newShape = {};
    newShape.radius = circle.radius;
    if( !circle.center )
        circle.center = {x:0,y:0};
    newShape.center = {x:circle.center.x, y:circle.center.y};

    return newShape;
};


Graphics.prototype.interpolateShape = function (shape1, shape2, percent) {
    var newShape = {};
    newShape.type = shape1.type;
    switch (shape1.type) {
        case "circle":
            newShape = this.interpolateCircle(shape1, shape2, percent);
            break;

        case "rect":
            newShape.width = shape1.width + (shape2.width - shape1.width) * percent;
            newShape.height = shape1.height + (shape2.height - shape1.height) * percent;
            break;

        case "poly":
            newShape = this.interpolatePoly(shape1, shape2, percent);
            break;

        case "compound":
            newShape.polys = [];
            newShape.circles = [];
            if (shape1.polys) {
                for (var j = 0; j < shape1.polys.length; j++) {
                    var poly1 = shape1.polys[j];
                    var poly2 = shape2.polys[j];
                    newShape.polys.push(this.interpolatePoly(poly1, poly2, percent));
                }
            }
            if (shape2.circles) {
                for (var k = 0; k < shape1.circles.length; k++) {
                    var circle1 = shape1.circles[k];
                    var circle2 = shape2.circles[k];
                    newShape.circles.push(this.interpolateCircle(circle1, circle2, percent));
                }
            }
            break;
    }

    return newShape;
};

Graphics.prototype.interpolatePoly = function( poly1, poly2, percent )
{
    var newPoly = {};
    newPoly.points = [];
    for( var i=0; i<poly1.points.length; i++ )
    {
        var px = poly1.points[i].x + ( poly2.points[i].x - poly1.points[i].x ) * percent;
        var py = poly1.points[i].y + ( poly2.points[i].y - poly1.points[i].y ) * percent;
        newPoly.points[i] = {x:px,y:py};
    }

    return newPoly;
};

Graphics.prototype.interpolateCircle = function (circle1, circle2, percent) {
    var newCircle = {};
    var point1 = circle1.center;
    var point2 = circle2.center;
    var px = point1.x + (point2.x - point1.x) * percent;
    var py = point1.y + (point2.y - point1.y) * percent;
    newCircle.center = { x: px, y: py };
    newCircle.radius = circle1.radius + (circle2.radius - circle1.radius) * percent;

    return newCircle;
};

Graphics.prototype.addShape = function( shape, transform, color, hasDropShadow, outerGlowVal, innerGlowVal )
{
    shape.transform = transform;
    shape.color = color;
    shape.hasDropShadow = hasDropShadow;
    shape.outerGlowVal = outerGlowVal != null ? outerGlowVal : 1;
    shape.innerGlowVal = innerGlowVal != null ? innerGlowVal : 1;

    this.shapeList.push( shape );

    return shape;
};

Graphics.prototype.addLine = function (line, width, color1, color2, hasDropShadow) {
    line.color1 = color1;
    line.color2 = color2;
    line.width = width;
    line.hasDropShadow = hasDropShadow;
    line.tweenVal = 0;
    var p1 = line.points[0];
    line.targetX = [p1.x];
    line.targetY = [p1.y];
    var dx = 0;
    var dy = 0;
    for( var i=1; i<line.points.length; i++ )
    {
        var p2 = line.points[i];
        dx = p2.x - p1.x;
        dy = p2.y - p1.y;
        line.targetX.push( p2.x );
        line.targetY.push( p2.y );
    }

    line.length = Math.sqrt(dx * dx + dy * dy);

    this.lineList.push(line);

    return line;
};

Graphics.prototype.addPoint = function (transform, color)
{
    var shape = this.circle(1);
    shape.transform = transform;
    shape.color = color;
    shape.innerGlowVal = shape.outerGlowVal = 1;
    this.pointList.push(shape);

    return shape;
};

Graphics.prototype.showDropShadow = function (show)
{
    if( show )
    {
        this.graphics.shadowOffsetX = this.graphics.shadowOffsetY = this.shadowOffset;
        this.graphics.shadowColor = "rgba(0,0,0,0.5)";
        this.graphics.shadowBlur = 19;
    }
    else
    {
        this.graphics.shadowOffsetX = this.graphics.shadowOffsetY = 0;
        this.graphics.shadowColor = "transparent black";
        this.graphics.shadowBlur = 0;
    }

};

Graphics.prototype.draw = function () {
    //this.clear();

    this.graphics.globalCompositeOperation = this.compositeType;

    if (this.shapeList.length > 0)
        this.drawShapes(this.shapeList);

    if (this.lineList.length > 0)
        this.drawLines();

    this.graphics.globalCompositeOperation = "source-over";

    if (this.pointList.length > 0)
        this.drawShapes(this.pointList);
};

Graphics.prototype.drawLines = function()
{
    this.showDropShadow( this.lineList[0].hasDropShadow );

    for( var i=0; i<this.lineList.length; i++ )
    {
        this.graphics.beginPath();

        var line = this.lineList[i];

        this.drawPoly( line, false );

        this.graphics.lineWidth = line.width;

        var sx = line.points[0].x;
        var sy = line.points[0].y;
        var sr = 0;
        var dx = sx;
        var dy = sy;
        var dr = line.length;
        var gradient1 = this.graphics.createRadialGradient(sx, sy, sr, dx, dy, dr);
        gradient1.addColorStop( 0, this.graphicsHelper.getColorString( line.color1 ) );
        gradient1.addColorStop( 1, this.graphicsHelper.getColorString( line.color2 ) );
        this.graphics.strokeStyle = gradient1;// this.graphicsHelper.getColorString( line.color );
        this.graphics.stroke();
    }
};

Graphics.prototype.drawShapes = function (shapeList) {
    for (var i = 0; i < shapeList.length; i++) {
        var shape = shapeList[i];

        this.graphics.beginPath();

        this.graphics.setTransform(this.graphics.canvas.width, 0, 0, this.graphics.canvas.height, 0, 0);
        var t = shape.transform;
        this.graphics.translate(t.tx, t.ty);
        this.graphics.rotate(t.rotation);
        this.graphics.scale(t.scaleX, t.scaleY);

        switch (shape.type) {
            case "poly":
                this.drawPoly(shape, true);
                break;

            case "rect":
                this.drawRect(shape);
                break;

            case "circle":
                this.drawCircle(shape);
                break;

            case "wave":
                this.drawWave(shape);
                break;

            case "text":
                this.drawText(shape);
                break;

            case "compound":
                this.drawCompoundShape(shape);
                break;
        }

        this.showDropShadow(shape.hasDropShadow);

        if (shape.innerGlowVal != 1 || shape.outerGlowVal != 1) {
            var sx = 0;
            var sy = 0;
            var sr = 0;
            var dx = 0;
            var dy = 0;
            var dr = 1;
            var gradient = this.graphics.createRadialGradient(sx, sy, sr, dx, dy, dr);
            var c1 = shape.color;
            c1 = this.graphicsHelper.rgba2hsva(c1.r, c1.g, c1.b, c1.a);
            c1 = this.graphicsHelper.hsva2rgba(c1.h, c1.s, c1.v * shape.innerGlowVal, c1.a);
            var c2 = shape.color;
            c2 = this.graphicsHelper.rgba2hsva(c2.r, c2.g, c2.b, c2.a);
            c2 = this.graphicsHelper.hsva2rgba(c2.h, c2.s, c2.v * shape.outerGlowVal, c2.a);
            gradient.addColorStop(0, this.graphicsHelper.getColorString(c1));
            gradient.addColorStop(1, this.graphicsHelper.getColorString(c2));
            this.graphics.fillStyle = gradient;
            this.graphics.fill();
        } else {
            if( shape.color.a == 0 )
            {
                var strokeColor = { r:shape.color.r, g:shape.color.g, b:shape.color.b, a:1 };
                this.graphics.lineWidth = 1 / t.scaleX / this.graphics.canvas.width;
                this.graphics.strokeStyle = this.graphicsHelper.getColorString(strokeColor);
                var fillColor = { r:255, g:255, b:255, a:0 };
                this.graphics.fillStyle = this.graphicsHelper.getColorString(fillColor);
                this.graphics.fill();
                this.graphics.stroke();
            }
            else
            {
                this.graphics.fillStyle = this.graphicsHelper.getColorString(shape.color);
                this.graphics.fill();
            }
        }

    }
};

Graphics.prototype.drawCompoundShape = function( shape )
{
    for( var i=0; i<shape.polys.length; i++ )
    {
        this.drawPoly( shape.polys[i], true );
    }

    for( var j=0; j<shape.circles.length; j++ )
    {
        this.drawCircle( shape.circles[j] );
    }
};

Graphics.prototype.drawText = function( text )
{
    for( var i=0; i<text.points.length-1; i+=2 )
    {
        var x = text.points[i];
        var y = text.points[i+1];
        this.graphics.moveTo( x, y );
        this.graphics.arc( x, y, text.radius, 0, Math.PI*2, false );
    }
};

Graphics.prototype.drawCircle = function( circle )
{
    this.graphics.moveTo( circle.center.x + circle.radius, circle.center.y );
    this.graphics.arc( circle.center.x, circle.center.y, circle.radius, 0, Math.PI*2, false );
};

Graphics.prototype.drawPoly = function (poly, close) {
    this.graphics.moveTo(poly.points[0].x, poly.points[0].y);
    //    var offset = poly.length / 2;
    for (var i = 1; i < poly.points.length; i++) {
        this.graphics.lineTo(poly.points[i].x, poly.points[i].y);
        //        this.graphics.bezierCurveTo( poly.points[i-1].x + offset, poly.points[i-1].y + offset, poly.points[i].x + offset, poly.points[i].y + offset, poly.points[i].x, poly.points[i].y );
    }

    if( close )
        this.graphics.lineTo(poly.points[0].x, poly.points[0].y);
};

Graphics.prototype.drawRect = function( rect )
{
    this.graphics.rect( -rect.width/2, -rect.height/2, rect.width, rect.height );
};

Graphics.prototype.drawWave = function (wave) {
    var curX, curY, newX, newY, w, last, i;

    if (wave.isDataDriven) {
        if (wave.isPicasso) {
            if(wave.points.length > 0){
                curX = wave.points[0].x;
                curY = wave.points[0].y;
                this.graphics.moveTo(curX, curY);
                for (i = 0; i < wave.points.length; i++) {
                    newX = wave.points[i].x;
                    newY = wave.points[i].y;
                    w = ( newX - curX ) * wave.curveFactor * wave.points[i].curveFactor;
                    if (wave.isBezier)
                        this.graphics.bezierCurveTo(curX + w, curY, newX - w, newY, newX, newY);
                    else
                        this.graphics.lineTo(newX, newY);

                    curX = newX;
                    curY = newY;
                }
            }
        }
        else {
            curX = 0;
            curY = 0;
            this.graphics.moveTo(curX, curY);
            last = 0;
            var pointCurveFactor = 1;
            for (i = 0; i < wave.points.length + 1; i += 2) {
                if (i < wave.points.length) {
                    newX = wave.points[i].x;
                    newY = wave.points[i].y;
                    pointCurveFactor = wave.points[i].curveFactor;
                }
                else {
                    newX = this.graphics.canvas.width;
                    newY = 0;
                    pointCurveFactor = 1;
                }
                w = ( newX - curX ) * wave.curveFactor * pointCurveFactor;
                if (wave.isBezier)
                    this.graphics.bezierCurveTo(curX + w, curY, newX - w, newY, newX, newY);
                else
                    this.graphics.lineTo(newX, newY);

                curX = newX;
                curY = newY;

                last = i;
            }

            if (curX < this.graphics.canvas.width)
            {
                newX = this.graphics.canvas.width;
                newY = 0;

                w = ( newX - curX ) * wave.curveFactor;
                if (wave.isBezier)
                    this.graphics.bezierCurveTo(curX + w, curY, newX - w, newY, newX, newY);
                else
                    this.graphics.lineTo(newX, newY);
            }

            //            console.log( "last: " + last + ", wave last index: " + (wave.points.length-1) );

            if (last >= wave.points.length - 1)
                last -= 1;
            //            else
            //                last += 1;

            curX = this.graphics.canvas.width;
            curY = 0;
            this.graphics.moveTo(curX, curY);
            for (i = last; i >= -1; i -= 2) {
                if (i > -1) {
                    newX = wave.points[i].x;
                    newY = wave.points[i].y;
                    pointCurveFactor = wave.points[i].curveFactor;
                }
                else {
                    newX = 0;
                    newY = 0;
                    pointCurveFactor = 1;
                }
                w = ( newX - curX ) * wave.curveFactor * pointCurveFactor;
                if (wave.isBezier)
                    this.graphics.bezierCurveTo(curX + w, curY, newX - w, newY, newX, newY);
                else
                    this.graphics.lineTo(newX, newY);

                curX = newX;
                curY = newY;
            }
        }
    }
    else {
        w = this.graphics.canvas.width / wave.period1;
        curX = 0;
        //var curY = -wave.amplitude1;
        curY = 0;
        this.graphics.moveTo(curX, curY);
        for (i = 0; i < wave.period1; i++) {
            newX = curX + w;
            //var newY = ( i % 2 == 0 ) ? wave.amplitude1 : -wave.amplitude1;
            newY = (wave.curAmpArray1[i]) ? wave.curAmpArray1[i] : 0;
            if (i == wave.period1 - 1)
                newY = 0;
            this.graphics.bezierCurveTo(curX + w / 2, curY, newX - w / 2, newY, newX, newY);

            curX = newX;
            curY = newY;
        }

        w = this.graphics.canvas.width / wave.period2;
        this.graphics.moveTo(curX, curY);
        for (i = 0; i < wave.period2; i++) {
            newX = curX - w;
            // var newY = ( i % 2 == 0 ) ? wave.amplitude2 : -wave.amplitude2;
            newY = (wave.curAmpArray2[i]) ? wave.curAmpArray2[i] : 0;
            if (i == wave.period2 - 1)
                newY = 0;
            //newY = -wave.amplitude1;
            this.graphics.bezierCurveTo(curX - w / 2, curY, newX + w / 2, newY, newX, newY);

            curX = newX;
            curY = newY;
        }
    }
};
