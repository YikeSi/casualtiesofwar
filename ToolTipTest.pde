int r1;
int g1;
int b1;
int r2;
int g2;
int b2;

color start;
color finish;
float amt=0.01;

int tooltipR=80;
int tooltipG=150;
int tooltipB=0;
int tooltipAlpha=200;

public class Sommet{

  int x;
  int y;
  int iterX;
  int iterY;
	color c;
   
  public Sommet(int _x,int _y){
    x = _x;
    y = _y;
    iterX = (int)random(-5,5);
    iterY = (int)random(-5,5);

		c = lerpColor(start,finish,amt);
		amt+=0.02;
		if (amt >=1) amt =0;
  }
   
  public void update(){
    x+=iterX;
    if(x>800) {x=0;}
    if(x<0)   {x=600;}       
     
    y+=iterY;
    if(y>600) {y=0;}   
    if(y<0)   {y=600;}         
}
   
  public void draw(){
    //fill(210, 230, 250);
		fill(c);
    stroke(100,150,250);
    ellipse(x,y,15,15);
  }
   
  public boolean closeEnough(Sommet s){
    PVector v1 = new PVector(this.x, this.y);
    PVector v2 = new PVector(s.x, s.y);
    if(v1.dist(v2) < 100){
      return true;
    }
    else{
      return false;
    } 
}
}
 
List list;

boolean isMouseIn = false;
 
void setup() {  //setup function called initially, only once
  size(590, 300);
  frameRate(30);
  smooth();
  
  create();
}
 
void create(){
	
	randomSeed(millis());
	r1 = int(round(random(0,1))*255);
	g1 = int(round(random(0,1))*255);
	b1 = int(round(random(0,1))*255);
	randomSeed(millis());
	r2 = int(round(random(0,1))*255);
	g2 = int(round(random(0,1))*255);
	b2 = int(round(random(0,1))*255);

	start=color(r1,g1,b1);
	finish = color(random(255),random(255),random(255));
	
	list = new ArrayList();
	background(51);  //set background white

  for(int i=0; i<50; i++){
    list.add(new Sommet((int)random(0,800), (int)random(0,600)));
  }		
}



void keyPressed(){
	if ((key == 'r') || (key == 'R')){
		create();
	}
	
	if (key == 'a'){
		tooltipAlpha +=10;
		if (tooltipAlpha >= 255) tooltipAlpha = 0;
	}
	
	if (key == 'c'){
		tooltipR = int(random(255));
		tooltipG = int(random(255));
		tooltipB = int(random(255));
	}	
}

void draw() {  //draw function loops
	  
    background(51);
    for(int i=0; i<50; i++){
			Sommet s1 = (Sommet)list.get(i);
      for(int j=0; j<50; j++){
        if(i!=j){
          Sommet s2 = (Sommet)list.get(j);
          if( s1.closeEnough(s2)){
						//linecolor = lerp(s1.c,s2.c,0.1);
            //stroke(linecolor); 
  					stroke(100,150,250);
            line(s1.x,s1.y,s2.x, s2.y);
          }
        }
      }     
    }

		// Draw dots after lines so lines appear behind dots. 
		for(int i = 0;i < 50;i++){
			Sommet s1 = (Sommet)list.get(i);
		  s1.draw();
	    s1.update();
		}

		// Display tooltip
		x = mouseX;
		y = mouseY;

		if (isMouseIn){
			String tipText = "Alpha: "+tooltipAlpha+"\nR: "+tooltipR+"  G: "+tooltipG+"  B: "+tooltipB+"\nmouseX= "+x+" mouseY= "+y;	
			toolTip = new ToolTip(x,y,tipText);
			toolTip.setBackground(color(tooltipR,tooltipG,tooltipB,tooltipAlpha));
			toolTip.clip=false;
			toolTip.display();
		}
}


void mouseOver(){
	isMouseIn = true;
}

void mouseOut(){
	isMouseIn = false;;
}

/*
void mouseMoved(){	
	// Look up a new tool tip each time x,y cell changes...
	x = mouseX;
	y = mouseY;
	
	String tipText = "X112U375\nStatus:Normal\nx="+x+" y="+y;	
	toolTip = new ToolTip(x,y,tipText);
	toolTip.display();
}
*/

