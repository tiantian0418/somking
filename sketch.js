var VTX = VTX468;

let cells = [];


// 初始颜色
let c1=20;
let c2=150;
let c3=200;

//Declare and initialize global variables for loading and analyzing video data using the face mesh model.
var facemeshModel = null; 
var videoDataLoaded = false; 
var statusText = "Loading facemesh model...";
var myFaces = []; 
var capture; 

//Load the facemesh model
facemesh.load().then(function(_model){
  console.log("model initialized.")
  statusText = "Model loaded."
  facemeshModel = _model;
})


function setup() {
  createCanvas(640,480);
  //640,480
//Create video or audio capture objects that allow you to access the user device's camera
  capture = createCapture(VIDEO);
  capture.size(640,480)
 //This event is triggered when the video finishes loading and is ready to play.
  capture.elt.onloadeddata = function(){
    console.log("video initialized");
    //The video is ready to be used.
    videoDataLoaded = true;
  }
//Hide the video capture object displayed on the web page
  capture.hide();
}


//Draws an array of faces and draws circles at random points on the face.
function drawFaces(faces,filled){

  for (var i = 0; i < faces.length; i++){
    //Extract the 3D coordinate array of key points of the face
    const keypoints = faces[i].scaledMesh;
    //Assigning a random index variable to an array of three values (xyz) 
    //for the location of the keypoints array between 100 and 300 of the face features being read,
    //thus drawing the morphology
    const [x, y, z]=keypoints[floor(random(100,300))]
    circle(x,y,10);
    
    mouseX=x;
    mouseY=y;
    
    if(x<width/3){
      c1=random(100)
      c2=random(200)
      c3=random(255)
      
    }

  }
}

//Detect face position output coordinates
function packFace(face,set){
  var ret = {
    scaledMesh:[],
  }
  for (var i = 0; i < set.length; i++){
    var j = set[i];
    ret.scaledMesh[i] = [
      face.scaledMesh[j][0],
      face.scaledMesh[j][1],
      face.scaledMesh[j][2],
    ]
  }
  return ret;
}

function draw() {
//The particles ensure that the facial recognition point has circular joints, which gives the drawing a smoother, 
//more aesthetically pleasing appearance.
  strokeJoin(ROUND); 
  
// model and video both loaded
  if (facemeshModel && videoDataLoaded){ 
    
    facemeshModel.estimateFaces(capture.elt).then(function(_faces){

      
      myFaces = _faces.map(x=>packFace(x,VTX)); 

      
    })
  }
  
  background(130,200,50);
  
  // Display the video capture in the canvas.Draw my face skeleton
  push();
  image(capture, 0, 0, capture.width, capture.height);
  noFill();
  stroke(255,0,0);
  drawFaces(myFaces); 
  pop();
  
  
  
  push()
//Check that the number of frames is greater than 180 and even and that there is at least one estimated face.
 if (frameCount>180&&frameCount%2==0&&myFaces.length>0) {
   //Transferring particles, if eligible
   for(let i=0;i<3;i++){
     
     cells.push(new Cell(mouseX, mouseY,c1,c2,c3));
     
   }
    
  }
  //Call update at the end of the loop
  for (let i = cells.length - 1; i >= 0; i--) {
    cells[i].update();
    cells[i].display();

  
  }
  pop();
  

}

//Define the class of cell
class Cell {
  constructor(x, y,c1,c2,c3) {
    // The location of cell
    this.pos = createVector(x, y);
    // The speed of cell
    this.vel = createVector(random(-1, 1), random(-1, 1));
    // The acceleration of the cell
    this.acc = createVector(0, 0);
    this.color = color(c1, c2, c3, random(50, 255));
    this.shape = int(random(0, 3));
    this.size = random(10, 25);

  }
//Updates the position of the cell based on the current velocity and acceleration.
  update() {
  
    let mouse = createVector(mouseX, mouseY);
    this.acc = p5.Vector.sub(mouse, this.pos).normalize().mult(0.05);

   
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
  }
//drawing the cell on the canvas.
  display() {
    noStroke();

    
    if (this.shape == 0) {
      fill(this.color);
      rectMode(CENTER);
      ellipse(this.pos.x, this.pos.y, this.size/2, this.size);
    }  else {
      let angle = map(this.pos.x, 0, width, 0, TWO_PI);
      let x = this.pos.x + cos(angle) * this.size;
      let y = this.pos.y + sin(angle) * this.size;
      fill(this.color*2);
      rect(CENTER)
      
      rect(this.pos.x, this.pos.y, this.size, this.size/4)
    }
  }

 
}