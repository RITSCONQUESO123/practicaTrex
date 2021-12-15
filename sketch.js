var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var PLAY=1;
var END=0;
var gameState=PLAY;

var gameOver, gameOverImg;
var restart, restartImg;

var trexCollided;

var jumpSound;
var diedSound;
var checkPoint;


var matriz = [3,4,5,6,7,8,9];
console.log(matriz);

function preload(){

  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");

  trexCollided=loadImage("trex_collided.png");

  jumpSound=loadSound("jump.mp3");
  diedSound=loadSound("die.mp3");
  checkPoint=loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

 
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,20);
  trex.debug=true;
  
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 

  gameOver=createSprite(width/2,height/2 - 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.9;

  restart=createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale=0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;

  
  score = 0;

  cloudsGroup=new Group();
  obstaclesGroup= new Group();


}

function draw() {
  background(180);
  text("Puntuación: "+ score, 500,50);

  if(gameState===PLAY){

    gameOver.visible=false;
    restart.visible=false;


  score = score + Math.round(getFrameRate()/60);
  
  if(score>0 && score%500===0){
    checkPoint.play();

  }
  ground.velocityX = -(4 + score/100);

  if(touches.length>0 || keyDown("space") && trex.y >= height-120) {
    trex.velocityY = -13;
    jumpSound.play();
    touches=[];
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  //aparecer nubes
  spawnClouds();
  
  //aparecer obstáculos en el suelo
  spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      gameState=END;
      diedSound.play();
    }

  } else if (gameState===END){

  gameOver.visible=true;
  restart.visible=true;
  
    ground.velocityX=0;
    trex.velocityY=0;

    trex.changeAnimation("collided",trexCollided);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    if(mousePressedOver(restart)){
      console.log("Se reincia el juego");
      reset();
    }
  }
  
  

  trex.collide(invisibleGround);


  
  drawSprites();
}
function reset(){
  //agregar que es lo que queremos que pase en cuando le demos clcik a restart
  gameState=PLAY;

  gameOver.visible=false;
  restart.visible=false; 

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  score=0;
  trex.changeAnimation("running",trex_running);
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-10,10,40);
   obstacle.velocityX = -(6+score/100);

   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes 
  if (frameCount % 60 === 0) {
    cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 200;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);
  }
  
}
