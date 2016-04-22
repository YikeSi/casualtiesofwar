// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 1-1: stroke and fill

var table;
var baseline = 1000;
var maxheight = 10;
var myheight = 3500;
var value = (255, 0, 0);
var wars = [];
var mouseAngle = 0;
var mouseWasClicked = false;
var mouseWasMoved = false;
var button1;
var button2;
var button3;
var button4;
var button5;
var mouseWasPressed = false;
var headline = "Casualties of Wars";
var byline = null;

function preload() {
    table = loadTable('Inter-StateWarData_v4.0.csv', 'csv', 'header');
    font1 = loadFont("fonts/Roboto-Black.ttf");
    font2 = loadFont("fonts/Khmer Sangam MN.ttf");
    img = loadImage("image/Casualties of War - Legand.png"); 
};

function mouseClicked() {
    mouseWasClicked = true;
}

function setup() {
    var canvas = createCanvas(windowWidth, myheight);
//    button1 = createButton('Casualties In Descending Order');
    button1 = createButton('Casualties \u2193');
    button1.addClass('button1')
    button1.mousePressed(Descending);
    button2 = createButton('Casualties \u2191');
    button2.addClass('button2');
    button2.mousePressed(Ascending);
    button3 = createButton('Start Year \u2193');
    button3.addClass('button3');
    button3.mousePressed(YearDescending);
    button4 = createButton('Start Year \u2191');
    button4.addClass('button4');
    button4.mousePressed(YearAscending);

    frameRate(30);

    table.getRows().forEach(function (rows) {
        var warName = rows.getString("WarName");
        var participantName = rows.getString("StateName");
        var startyear = int(rows.getString("StartYear1"));
        var startmonth = int(rows.getString("StartMonth1"));
        var startday = int(rows.getString("StartDay1"));
        var endyear = int(rows.getString("EndYear1"));
        var endmonth = int(rows.getString("EndMonth1"));
        var endday = int(rows.getString("EndDay1"));
        var casualty = int(rows.getString("BatDeath"));
        var outcome = int(rows.getString('Outcome'));
        var start = getTime(new Time(startyear, startmonth, startday));
        var end = getTime(new Time(endyear, endmonth, endday));
        var participant = new Participant(participantName, start, end, casualty, outcome, startyear, endyear);

        function getWar(name) {
            for (var i = 0; i < wars.length; i++) {
                var war = wars[i];
                if (war.name == name) {
                    return war;
                }
            }
            return "false";
        };

        var war = getWar(warName);
        if (war == "false") {
            var mywar = new War(warName);
            mywar.participants.push(participant);
            wars.push(mywar);
        } else {
            war.participants.push(participant);
        }
    });

    wars.forEach(function (war) {
        war.computeCasualties();
        war.end();
        war.start();
        war.startYY();
        war.endYY();
    });

    print(wars);

    wars.forEach(function (war) {
        war.participants.forEach(function (ptc) {
            var x1 = getTimePixels(ptc.start);
            var x2 = getTimePixels(ptc.end);

            var y1 = baseline;
            var y2 = baseline - casualtiesPixels(ptc.casualties);

            var a = new toxi.geom.Vec2D(x1, y1);
            var b = new toxi.geom.Vec2D(x2, y2);
            var line1 = new toxi.geom.Line2D(a, b);

            var c = new toxi.geom.Vec2D(x2, y2);
            //print(war.end);
            var d = new toxi.geom.Vec2D(getTimePixels(war.warend), y2);
            var line2 = new toxi.geom.Line2D(c, d);

            ptc.lines.push(line1);
            ptc.lines.push(line2);
            
            if(war.name == "Iran-Iraq"){
                print(ptc.casualties + " "+casualtiesPixels(ptc.casualties));
                print(ptc);
            }  
            
             if(war.name == "World War II"){
                print(ptc.casualties + " "+casualtiesPixels(ptc.casualties));
                print(ptc);
            }   
        });
       
    });


    wars.forEach(function (war) {
        var granularity = 100;
        var ww = getTimePixels(war.warend) - getTimePixels(war.warstart);
        
        for (var i = 0; i < granularity; i++) {
            
         
            var xx = getTimePixels(war.warstart) + (ww / granularity) * i;
            var y1 = baseline - height;
            var y2 = baseline + 5;
            var e = new toxi.geom.Vec2D(xx, y2);
            var f = new toxi.geom.Vec2D(xx, y1);
            var line3 = new toxi.geom.Line2D(e, f);
            
            

            var yy = 0;

            war.participants.forEach(function (ptc) {
                var intersection1 = ptc.lines[0].intersectLine(line3);
                var interPos1 = null
                    , interPos2 = null;
                if (intersection1.getType() == toxi.geom.Line2D.LineIntersection.Type.INTERSECTING) {
                    interPos1 = intersection1.getPos();
                }

                var intersection2 = ptc.lines[1].intersectLine(line3);
                if (intersection2.getType() == toxi.geom.Line2D.LineIntersection.Type.INTERSECTING) {
                    interPos2 = intersection2.getPos();
                }

                if (interPos1 != null) {
                    yy += interPos1.y;
                } else if (interPos2 != null) {
                    yy += interPos2.y;
                }

            });
            //here we added all the y's from all the participants that stack up
            if (yy != 0)
                war.points.push(createVector(xx, yy));
        }
        war.closePoints();
    });

    wars.forEach(function (war) {
        war.participants.sort(function (a, b) {
            if (a.outcome == b.outcome) return 0;
            else if (a.outcome < b.outcome) return -1;
            else if (a.outcome > b.outcome) return 1;
        });
    });
    //saveCanvas(canvas,'myCanvas','jpg');
};

var Descending = function () {
    wars.sort(function (a, b) {
        return (b.totalCasualties - a.totalCasualties);
    });
};

var Ascending = function () {
    wars.sort(function (a, b) {
        return (a.totalCasualties - b.totalCasualties);
    });
}

var YearDescending = function () {
    wars.sort(function (a, b) {
        return (b.warstart - a.warstart);
    });
}

var YearAscending = function () {
    wars.sort(function (a, b) {
        return (a.warstart - b.warstart);
    });
}

var War = function (name, startyear) {
    this.name = name;
    this.participants = [];
    this.totalCasualties = 0;
    this.warstart = 0;
    this.warend = 0;
    this.points = [];
    this.mouseOver = false;
    this.activated = false;
    this.mouseend = 0;
    this.mousestart = 0;
    this.startY = 0;
    this.endY = 0;
    //    this.checkmatch = 0;

    this.computeCasualties = function () {
        var sum = 0;
        for (var i = 0; i < this.participants.length; i++) {
            sum += this.participants[i].casualties;
        }
        this.totalCasualties = sum;
    }

    this.startYY = function () {
        var sdy = 3000;
        for (var i = 0; i < this.participants.length; i++) {
            sdy = Math.min(this.participants[i].startyear, sdy)
        }
        this.startY = sdy;
    }

    this.endYY = function () {
        var edy = 0;
        for (var i = 0; i < this.participants.length; i++) {
            edy = Math.max(this.participants[i].endyear, edy);
        }
        this.endY = edy;
    }

    this.start = function () {
        var sdw = 3000;
        for (var i = 0; i < this.participants.length; i++) {
            sdw = Math.min(this.participants[i].start, sdw)
        }
        this.warstart = sdw;
        this.points.push(createVector(getTimePixels(this.warstart)), baseline);
    }

    this.end = function () {
        var edw = 0;
        for (var i = 0; i < this.participants.length; i++) {
            edw = Math.max(this.participants[i].end, edw);
        }
        this.warend = edw;
    }

    this.closePoints = function () {
        var y = this.points[this.points.length - 1].y;
        var vv = createVector(getTimePixels(this.warend), y);
        this.points.push(vv);
    }

    this.draw = function (x, y, pieX, pieY) {
        var war = this;
        var tx = textWidth(war.name);
        var radius = map(sqrt(war.totalCasualties), 0, 1E6, 10, 300);
        radius = log(war.totalCasualties) * 2;
        var startAngle = 0;
        for (var i = 0; i < war.participants.length; i++) {
            var part = war.participants[i];
            var angle = map(part.casualties / war.totalCasualties, 0, 1, 0, TWO_PI);
            var gray = map(i, 0, war.participants.length, 240, 255);
            fill(gray);
            noStroke();
            arc(x + 50, y - 10, radius * 3, radius * 3, startAngle, startAngle + angle);
            startAngle += angle;
            pieX = tx + pieX;
        };

        var c = select(".headline");
        c.html(headline);

        noStroke();
        fill(0, 0, 0);
        text(war.name, x, y);

        noFill();
        strokeWeight(5);
        stroke(1);
        strokeCap(SQUARE);

        beginShape();
        war.points.forEach(function (p) {
            var xpos = map(p.x
                , war.points[0].x
                , war.points[war.points.length - 1].x
                , 10
                , 70);
            var ypos = map(30 - p.y / 100, 10, 20, 0, 10);
            stroke("#C62828");
            vertex(x + tx + xpos, y + ypos - 10);
        });
        endShape();

        //after we draw, here, lets check if the mouse is over here and set a variable

        if (mouseX <= x + tx && mouseX >= x && mouseY >= y - 30 && mouseY <= y)
            this.mouseOver = true;
        else {
            this.mouseOver = false;
        }

        if (this.mouseOver && mouseWasClicked) {
            wars.forEach(function (w) {
                w.activated = false;
            });
            this.activated = true;
        } else if (mouseWasClicked) {
            this.activated = false;
        } else if (this.mouseOver) {
            noStroke();
            fill(0, 0, 0);
            var a = select(".time");
            byline = this.totalCasualties
            a.html(nfc(byline));
        }
        return tx;
    }

    this.drawFeaturedPieChart = function () {
        var radiusO = 80;
        var startAngle = 0;
        var y = windowHeight * (7 / 10);
        var war = this;
        var c = select(".headline");
        c.html(this.name);
        var b = select(".time");
        byline = this.startY + '-' + this.endY;
        b.html(byline);
        var dy = window.scrollY;
        noStroke();
        fill('rgba(255,255,255,0.9)');
        rect(0, 0, windowWidth, myheight);
        mouseAngle = Math.atan2(y + dy - mouseY, width / 2 - mouseX) + Math.PI;
        var mousePos = createVector(mouseX, mouseY);
        var center = createVector(width / 2, y + dy);
        var dist = mousePos.dist(center);
        for (var i = 0; i < war.participants.length; i++) {
            var part = war.participants[i];
            //            var gray = map(i, 0, war.participants.length, 100, 255);
            if (part.outcome == 1) {
                var c = color('rgba(229,115,115,0.8)');
                var tag = "winner";
            } else if (part.outcome == 2) {
                var c = color('rgba(207,216,220,0.8)');
                var tag = 'loser';
            } else if (part.outcome == 3) {
                var c = color('rgba(255, 109, 0, 0.8)');
                var tag = "Compromise/Tied"
            } else if (part.outcome == 4) {
                var c = color('rgba(255, 145, 0, 0.8)');
                var tag = 'The war was transformed into another type of war'
            } else if (part.outcome == 5) {
                var c = color('rgba(255,171,64, 0.8)');
                var tag = 'The war is ongoing as of 12/31/2007';
            } else if (part.outcome == 6) {
                var tag = 'Stalemate';
                var c = color('rgba(255,209,128, 0.8)');
            } else if (part.outcome == 7) {
                var tag = ' Conflict continues at below war level';
                var c = color('rgba(230,81,0, 0.8)');
            } else if (part.outcome == 8) {
                var tag = 'changed sides';
                var c = color('rgba(255,204,128, 0.8)');
            }
            fill(c);
            stroke("rgb(255,255,255)");
            strokeWeight(0.8);
            this.mousestart = startAngle;
            var angle = map(part.casualties / this.totalCasualties, 0, 1, 0, TWO_PI);
            this.mouseend = startAngle + angle;
            arc((width - 80) / 2, y + dy, radiusO * 3, radiusO * 3, startAngle, startAngle + angle, PIE);
            if (mouseAngle >= this.mousestart && mouseAngle <= this.mouseend && dist < radiusO * 3 / 2) {
                stroke("rgb(255,255,255)");
                strokeWeight(4);
                arc((width - 80) / 2, y + dy, radiusO * 3, radiusO * 3, startAngle, startAngle + angle, PIE);
                noStroke();
                textFont(font2);
                textSize(20);
                fill("rgb(84,110,122)");
                text("Country: " + part.country, mouseX + 20, mouseY - 90);
                fill("rgb(198,40,40)");
                text("Casualties: " + nfc(part.casualties), mouseX + 20, mouseY - 65);
                fill("rgb(84,110,122)");
                text("start: " + part.startyear, mouseX + 20, mouseY - 40);
                text("end: " + part.endyear, mouseX + 20, mouseY - 15);
                text('outcome: ' + tag, mouseX + 20, mouseY +10);

            }
            startAngle += angle;
        }
    }
}

function mouseMoved() {
    var mouseWasMoved = true;
}

var Participant = function (country, start, end, casualties, outcome, startyear, endyear) {
    this.country = country;
    this.startyear = startyear;
    this.endyear = endyear;
    this.start = start;
    this.end = end;
    this.casualties = casualties;
    this.lines = [];
    this.outcome = outcome;
}

var Time = function (year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
}

function getTime(date) {
    return date.year + (date.month - 1) / 12 + (date.day - 1) / 365;
}

function getTimePixels(date) {
    return map(date, 1823, 2003, 0, width);
}

function casualtiesPixels(casualties_) {
    //var map1 = map(casualties, 0, 70000, 0, 100);
    
    return map(casualties_, 0, 7000000, 0, 100);
};

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255);
    translate(40, 0);
    textFont(font1);
    textSize(25);

    var xstart = 0;
    var x = 0;
    var xend = 50;
    var y = 800;
    var pieX = 50;
    var pieY = 60;

    fill(value);
    noStroke();
    text("This is a monument for all people, who sacrified their lives for the wars. Our memories and prays belong to all the dead and affected as you enter this page. History already reminds us that we have suffered from too much violence. This monument tells you that too many people died on the battle fields from both sides, winners and losers.", width*(5/23), 350, width*(8/15), 400);
    
    if(mouseX>width*(1/5)&&mouseX<width*(8/15)&&mouseY>350 &&mouseY<750){
        fill(255,255,255);
        rect(width*(5/23), 350, width*(8/15), 400);
        image(img, width*(1/3), 350);
    }
    
    fill(value);
    textSize(25);
    wars.forEach(function (war) {
        var tx = war.draw(x, y, pieX, pieY);
        x = x + tx + 80;
        if (x > width - 300) {
            x = 0;
            y = y + 100;
            pieX = 50;
            pieY = pieY + 100;
        }
    });

    wars.forEach(function (war) {
        if (war.activated) {
            war.drawFeaturedPieChart();
        }
    });

    mouseWasClicked = false;
    mouseOver = false;
}