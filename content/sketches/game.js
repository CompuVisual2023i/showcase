let cols, rows;
let scl = 40;
let w = 1650;//1700
let h = 850;//1300

let terrain = [];
let flying = 0;
let currentFPS = 0;
let customFont;
let ml = -100;
let mh = 150;
let flySpeed = 0.04;
let xoffVal = 0.08;
let yoffVal = 0.04;
let waterLevel = 0;
let mountainPeak = 90;
let camAngle =  3.1416/3.14;
let angleMax =  3.1416/2.8;
let killsCounter = 0;
let font;
let DEBUG = 0;
let FIRST_START = true;
let gameVolume = 0.2;
let backgroundColor = "rgb(155, 155, 250)";


let enemies = [];
let enemyProjectiles = [];
let player;
let enemyManager;
let playerModel;
let soucerModel;


let explSound;
let engineSound;
let splashSound;
let engineSound2;
let killSound;
let explTexture;
let soundTrack;
let planetsCounter = 0;

let FIRST_KILL = false;
let volumeSlider;
let projectileTooFar = false;
let audioPool = [];

let STATE = 0;

function preload() {
  
  //showcase/sketches/game/
  //explosion
  explSound = loadSound("/showcase/sketches/game/explotion.mp3");
  explSound.playMode("restart");
  explSound.setVolume(gameVolume);

  //egine sound
  engineSound = loadSound("/showcase/sketches/game/hero.mp3");
  engineSound.playMode("untilDone");
  //egine sound2
  engineSound2 = loadSound("/showcase/sketches/game/hero2.mp3");
  engineSound2.playMode("untilDone");
  //next level
  nextSound = loadSound("/showcase/sketches/game/success.mp3");
  nextSound.setVolume(gameVolume);
  //textures
  explTexture = loadImage("/showcase/sketches/game/fire.jpg");
  moonTexture = loadImage("/showcase/sketches/game/moon.jpg");
  earthTexture = loadImage("/showcase/sketches/game/earth.jpg");
 
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');

  playerModel = loadModel('/showcase/sketches/game/aircraft.obj');
  saucerModel = loadModel("/showcase/sketches/game/saucer.obj");
  shipModel = loadModel("/showcase/sketches/game/ship.obj");
  motherModel = loadModel("/showcase/sketches/game/mother.obj");
}


//**********************************INITIALIZATION**************************

function setup() {
   createCanvas(800, 650, WEBGL);
   focus();
   cols = w / scl;
   rows = h / scl;
  
  //create zeroed array for terrain generation
  for(let y = 0; y < rows; y++){
    let xTemp = [];
    for(let x = 0; x < cols; x++){
      xTemp.push(0);
    } 
    terrain.push(xTemp);
  }

  //init player
  player = new Player();
  
  //enemy manager
  enemyManager = new EnemyManager();
  
  soundTrack = new SoundTrack();
  volumeSlider = createSlider(0, 1, gameVolume, 0.05);
  volumeSlider.position(650, 10);

  
}
//*******************************************************************************/
//*************                     MAIN                       ******************
/*********************************************************************************/
function draw() { 
  if(STATE == 0)
    doIntro();
  else if(STATE == 1)
    runGame();
  
}

function runGame(){
  background(backgroundColor);
  noStroke();
  gameVolume = volumeSlider.value();
  drawFPS();
  soundTrack.update();
  directionalLight(255, 255, 200, new p5.Vector(1000, 1200, -1000).normalize());
  directionalLight(0, 0, 250, new p5.Vector(-1000, 0, -100));
  
  rotateX(-0.6);
  scale(0.25);//default 0.47
  
  doPlanets();
  
  translate(150, 0, 0);
    //enemies
    enemies.forEach(enemy => {
    push();
    enemy.update();
    enemy.shoot(random());
    enemy.draw();
    pop();
  });
 
  //update enemy projectiles
  enemyProjectiles.forEach(projectile =>{
    push();
    projectile.update();
    projectile.draw();
     if(projectile.startZ > 1200)
        projectileTooFar = true;//delete projectile if off the screen
    pop();
  });
  
   if(projectileTooFar){
        let e = enemyProjectiles.shift();
        projectileTooFar = false;
      }
    
  
  //player
  push();
  player.doControls();
  player.update();
  player.draw();
  pop();
 
  push();
  player.shoot(enemyManager.wave);
  player.updateProjectile();
  pop();
   
  //collision detection
  aircractEnemyCollision(player, enemies);
  projectileEnemyCollision(player.projectiles, enemies);
  enemyProjectilePlayerCollision(player);
  
  
  enemyManager.update(player);
 
  //the world
  rotateX(1.5);
  scale(2.5);
  translate(-50, 100, 0)
  drawWorld();
}

function enemyProjectilePlayerCollision(player){
  enemyProjectiles.forEach(projectile =>{
    let d = dist(
             player.moveX,
             player.moveY,
             player.moveZ,
             projectile.startX,
             projectile.startY,
             projectile.startZ
            );
   // DEBUG = d;
    if(d < 110){
      player.collided = true;
      player.restart = true;
    }
  });
}

function aircractEnemyCollision(player, enemies){
  //distance between enemy and aircraft
  enemies.forEach(enemy => {
     let d = dist( //distance enemy-player
              enemy.posX, 
              enemy.posY, 
              enemy.posZ, 
              player.moveX, 
              player.moveY,
              player.moveZ);
    if(d < (player.collisionRadius + enemy.collisionRadius) && enemy.isAlive()){
      player.collided = true;
      player.restart = true;
      enemy.die();
    }
  });
}

function projectileEnemyCollision(projectiles, enemies){
  enemies.forEach(enemy =>{
     projectiles.forEach(projectile =>{
       let d = dist(
                     enemy.posX,
                     enemy.posY,
                     enemy.posZ,
                     projectile.startX,
                     projectile.startY,
                     projectile.startZ
                  );
       // DEBUG = "x:" + enemy.posX + " y:" + enemy.posY + " z:" + enemy.posZ + " distance:" + d;
       if(d < (player.collisionRadius + projectile.collisionRadius) && enemy.isAlive() && projectile.isAlive()){
         enemy.die();
         if(!enemy.isAlive())
           killsCounter++;
         projectile.dead = true;
         //explSound.play();
         FIRST_KILL = true;
       }
     }
                      
     ); 
  });
  
}

function doPlanets(){
   push();
   fill(255, 100, 0, 100);
   texture(earthTexture);
   rotateX(-planetsCounter/500000 + 0.6);
   translate(-2000, 2000, -9000);
   rotateY(-planetsCounter/40000); 
   sphere(4000);
   fill(255, 255, 200, 100);
   sphere(4005);
  
   push();
   translate(4800, -900, 0);
   texture(moonTexture);
   rotateY(-planetsCounter/9000);
   sphere(790);
   fill(185, 210, 250, 80);
   sphere(700);
   pop();
   pop();
   
   planetsCounter+=20;

}

function drawWorld(){
  
   flying  -= 0.005;
  let yoff = flying;
  //init terrain Zs
  for(let y = 0; y < rows; y++){
    let xoff = 0;
    for(let x = 0; x < cols; x++){
      //ramdomly create values for z
      terrain[y][x] = map(noise(xoff, yoff), 0, 1, ml, mh);
      xoff += xoffVal;
    }
    yoff += yoffVal; 
  }
  
  translate(-w/2, -h/2);
  // draw mountains
  for(let y = 0; y < rows - 1; y++){
    beginShape(TRIANGLE_STRIP);
    for(let x = 0; x < cols; x++){
      let z = terrain[y][x];
      
      if(z > waterLevel){
        fill(map(z, ml, mh, 0, 100), 
             map(z, ml, mh, 0, 100),
             255-20*y);
      }
            
      vertex(x*scl, y*scl, z);
      vertex(x*scl, (y+1)*scl, terrain[y+1][x]);
    }
    endShape();
  }
  
  // draw water
  for(let y = 0; y < rows - 1; y++){
    beginShape(TRIANGLE_STRIP);
    for(let x = 0; x < cols; x++){
      fill(100, 
             100,
             255-8*y);
      vertex(x*scl, y*scl, waterLevel);
      vertex(x*scl, (y+1)*scl, waterLevel);
    }
    endShape();
  }
}



// FPS display
function drawFPS(){
  textSize(14);
  textFont(font);
  fill(255);
  text("FPS:" + getFrameRate().toFixed(0), -400, -300);
 // text("Altitude:" + parseFloat(player.altitude).toFixed(0), -380, -300);
  text("" + DEBUG, 280, -280);
}

function doIntro(){
   background(backgroundColor);
  
   textSize(28);
   textFont(font);
   fill("blue");
   text("Use WAD keys to play", -150, -100);
   fill("white");
   text("Heads up! this game has sounds", -240, -50);
   text("Use the slider to ajust", -180, -10);
   

   noStroke();
   texture(moonTexture);
   translate(0, -200, 0);
   rotateY(millis()/1000);
   sphere(40);
  
   
  
   
}

function keyPressed(){
  if(keyCode === RIGHT_ARROW || key == "d" || key == "D"){
     player.movingRight = true; 
     STATE = 1;
     
  }
  
  if(keyCode === LEFT_ARROW || key == "a" || key == "A"){
     player.movingLeft = true;
     STATE = 1;
  }
  
  if(key === 'w'){
     //player.movingUp = true;
  }
  
   if(key === 's'){
     //player.movingDown = true;
  }
  
  if(keyCode === 32 || key == "w" || key == "W"){
     player.shootingTheHeckOutOfUFOs = true;
     STATE = 1;
  }
  
  if(keyCode === 13){
       STATE = 3;
     }
  
  //shootingTheHeckOutOfUFOs
}

function keyReleased(){
  if(keyCode === RIGHT_ARROW || key == "d" || key == "D"){
     player.movingRight = false;
  }
  if(keyCode === LEFT_ARROW || key == "a" || key == "A"){
     player.movingLeft = false;
  }
  if(key === 'w'){
     player.movingUp = false;
  }
  
  if(key === 's' ){
     player.movingDown = false;
  }
  
  if(keyCode === UP_ARROW ){
    //player.shootingTheHeckOutOfUFOs = false;
  }
}
    


//*******************************************************************************/
//*************                     MAIN                       ******************
/*********************************************************************************/
function draw() { 
  if(STATE == 0)
    doIntro();
  else if(STATE == 1)
    runGame();
  else{
    soundTrack.pause();
  }
  
}

function runGame(){
  background(backgroundColor);
  noStroke();
  gameVolume = volumeSlider.value();
  drawFPS();
  soundTrack.update();
  directionalLight(255, 255, 200, new p5.Vector(1000, 1200, -1000).normalize());
  directionalLight(0, 0, 250, new p5.Vector(-1000, 0, -100));
  
  rotateX(-0.6);
  scale(0.25);//default 0.47
  
  doPlanets();
  
  translate(150, 0, 0);
    //enemies
    enemies.forEach(enemy => {
    push();
    enemy.update();
    enemy.shoot(random());
    enemy.draw();
    pop();
  });
 
  //update enemy projectiles
  enemyProjectiles.forEach(projectile =>{
    push();
    projectile.update();
    projectile.draw();
     if(projectile.startZ > 1200)
        projectileTooFar = true;//delete projectile if off the screen
    pop();
  });
  
   if(projectileTooFar){
        let e = enemyProjectiles.shift();
        projectileTooFar = false;
      }
    
  
  //player
  push();
  player.doControls();
  player.update();
  player.draw();
  pop();
 
  push();
  player.shoot(enemyManager.wave);
  player.updateProjectile();
  pop();
   
  //collision detection
  aircractEnemyCollision(player, enemies);
  projectileEnemyCollision(player.projectiles, enemies);
  enemyProjectilePlayerCollision(player);
  
  
  enemyManager.update(player);
 
  //the world
  rotateX(1.5);
  scale(2.5);
  translate(-50, 100, 0)
  drawWorld();
}

function enemyProjectilePlayerCollision(player){
  enemyProjectiles.forEach(projectile =>{
    let d = dist(
             player.moveX,
             player.moveY,
             player.moveZ,
             projectile.startX,
             projectile.startY,
             projectile.startZ
            );
   // DEBUG = d;
    if(d < 110){
      player.collided = true;
      player.restart = true;
    }
  });
}

function aircractEnemyCollision(player, enemies){
  //distance between enemy and aircraft
  enemies.forEach(enemy => {
     let d = dist( //distance enemy-player
              enemy.posX, 
              enemy.posY, 
              enemy.posZ, 
              player.moveX, 
              player.moveY,
              player.moveZ);
    if(d < (player.collisionRadius + enemy.collisionRadius) && enemy.isAlive()){
      player.collided = true;
      player.restart = true;
      enemy.die();
    }
  });
}

function projectileEnemyCollision(projectiles, enemies){
  enemies.forEach(enemy =>{
     projectiles.forEach(projectile =>{
       let d = dist(
                     enemy.posX,
                     enemy.posY,
                     enemy.posZ,
                     projectile.startX,
                     projectile.startY,
                     projectile.startZ
                  );
       // DEBUG = "x:" + enemy.posX + " y:" + enemy.posY + " z:" + enemy.posZ + " distance:" + d;
       if(d < (player.collisionRadius + projectile.collisionRadius) && enemy.isAlive() && projectile.isAlive()){
         enemy.die();
         if(!enemy.isAlive())
           killsCounter++;
         projectile.dead = true;
         //explSound.play();
         FIRST_KILL = true;
       }
     }
                      
     ); 
  });
  
}

function doPlanets(){
   push();
   fill(255, 100, 0, 100);
   texture(earthTexture);
   rotateX(-planetsCounter/500000 + 0.6);
   translate(-2000, 2000, -9000);
   rotateY(-planetsCounter/40000); 
   sphere(4000);
   fill(255, 255, 200, 100);
   sphere(4005);
  
   push();
   translate(4800, -900, 0);
   texture(moonTexture);
   rotateY(-planetsCounter/9000);
   sphere(790);
   fill(185, 210, 250, 80);
   sphere(700);
   pop();
   pop();
   
   planetsCounter+=20;

}

function drawWorld(){
  
   flying  -= 0.005;
  let yoff = flying;
  //init terrain Zs
  for(let y = 0; y < rows; y++){
    let xoff = 0;
    for(let x = 0; x < cols; x++){
      //ramdomly create values for z
      terrain[y][x] = map(noise(xoff, yoff), 0, 1, ml, mh);
      xoff += xoffVal;
    }
    yoff += yoffVal; 
  }
  
  translate(-w/2, -h/2);
  // draw mountains
  for(let y = 0; y < rows - 1; y++){
    beginShape(TRIANGLE_STRIP);
    for(let x = 0; x < cols; x++){
      let z = terrain[y][x];
      
      if(z > waterLevel){
        fill(map(z, ml, mh, 0, 100), 
             map(z, ml, mh, 0, 100),
             255-20*y);
      }
            
      vertex(x*scl, y*scl, z);
      vertex(x*scl, (y+1)*scl, terrain[y+1][x]);
    }
    endShape();
  }
  
  // draw water
  for(let y = 0; y < rows - 1; y++){
    beginShape(TRIANGLE_STRIP);
    for(let x = 0; x < cols; x++){
      fill(100, 
             100,
             255-8*y);
      vertex(x*scl, y*scl, waterLevel);
      vertex(x*scl, (y+1)*scl, waterLevel);
    }
    endShape();
  }
}



// FPS display
function drawFPS(){
  textSize(14);
  textFont(font);
  fill(255);
  text("FPS:" + getFrameRate().toFixed(0), -400, -300);
 // text("Altitude:" + parseFloat(player.altitude).toFixed(0), -380, -300);
  text("" + DEBUG, 280, -280);
}

function doIntro(){
   background(backgroundColor);
  
   textSize(28);
   textFont(font);
   fill("blue");
   text("Use WAD keys to play", -150, -100);
   fill("white");
   text("Heads up! this game has sounds", -240, -50);
   text("Use the slider to ajust", -180, -10);
   

   noStroke();
   texture(moonTexture);
   translate(0, -200, 0);
   rotateY(millis()/1000);
   sphere(40);
  
   
  
   
}

function keyPressed(){
  if(keyCode === RIGHT_ARROW || key == "d" || key == "D"){
     player.movingRight = true; 
     STATE = 1;
     
  }
  
  if(keyCode === LEFT_ARROW || key == "a" || key == "A"){
     player.movingLeft = true;
     STATE = 1;
  }
  
  if(key === 'w'){
     //player.movingUp = true;
  }
  
   if(key === 's'){
     //player.movingDown = true;
  }
  
  if(keyCode === 32 || key == "w" || key == "W"){
     player.shootingTheHeckOutOfUFOs = true;
     STATE = 1;
  }
  
  if(keyCode === 13){
       STATE = 3;
     }
  
  //shootingTheHeckOutOfUFOs
}

function keyReleased(){
  if(keyCode === RIGHT_ARROW || key == "d" || key == "D"){
     player.movingRight = false;
  }
  if(keyCode === LEFT_ARROW || key == "a" || key == "A"){
     player.movingLeft = false;
  }
  if(key === 'w'){
     player.movingUp = false;
  }
  
  if(key === 's' ){
     player.movingDown = false;
  }
  
  if(keyCode === UP_ARROW ){
    //player.shootingTheHeckOutOfUFOs = false;
  }
}
    


/*******************************************************************/
/****                        CLASSES                           ****/
/*******************************************************************/



/****************************PLAYER****************************/
class Player{
  constructor(){
    this.collided = false;
    this.playerVelocity = 15; 
    this.playerVelocityY = 1;
    this.moveX = 0;
    this.moveY = -280;
    this.moveZ = 850; //fixed default:1000
    this.movingRight = false;
    this.movingLeft = false;
    this.movingDown = false;
    this.movingUp = false;
    this.rotation = PI;
    this.rotationSpeed = 0.01;
    this.currentVelocity = 0;
    this.explotionR = 0;
    this.destroyed = false;
    this.restart = true;
    this.shootingTheHeckOutOfUFOs = false;
    this.projectiles = [];
    this.projectileTooFar = false;
    this.killProjectileAt = -4000;
    this.collisionRadius = 250;
  
  }
  
  doControls(){
  if(this.movingRight){
    this.moveX+=this.smoothVelocity(this.currentVelocity);
    
 
  }
  
  if(this.movingLeft){
    this.moveX+=this.smoothVelocity(this.currentVelocity);
  }
  
   if(this.movingUp){
     this.playerVelocityY-=0.1;
  }
  
   if(this.movingDown){
     this.playerVelocityY+=0.1;
  }
    
  if(!this.movingRight && !this.movingLeft){
      this.moveX+=this.smoothVelocity(this.currentVelocity);
    }
    
    //constrain movement
    if(this.moveX > 900){
      this.moveX = 900;
    }
    if(this.moveX < -1180){
      this.moveX = -1180;
    }
    
    if(this.moveY < -220){
      //this.moveY = -220;
    }
    
    //console.log(this.moveY);
}
  
  shoot(wave){
    if(this.shootingTheHeckOutOfUFOs){
      if(wave <= 3 ){
        //single shooting
        this.projectiles.push(new Projectile(30, this.moveX, this.moveY, this.moveZ, 1)); 
      }else if(wave < 5){
        //double shooting
        this.projectiles.push(new Projectile(30, this.moveX + 100, this.moveY, this.moveZ, 1)); 
        this.projectiles.push(new Projectile(30, this.moveX - 100, this.moveY, this.moveZ, 1)); 
        
      }else{
        //tiple shooting
        this.projectiles.push(new Projectile(30, this.moveX , this.moveY, this.moveZ, 1)); 
        this.projectiles.push(new Projectile(30, this.moveX + 140, this.moveY, this.moveZ, 1)); 
        this.projectiles.push(new Projectile(30, this.moveX - 140, this.moveY, this.moveZ, 1)); 
      }
      this.shootingTheHeckOutOfUFOs = false;
    }
  }
  
  update(){
      this.altitude = map(this.moveY, 150,-220,0, 300);
      translate(this.moveX, this.moveY, this.moveZ);
      rotateY(PI);
      rotateZ(this.rotation);
      scale(this.collisionRadius/10);
      //sphere();
      this.smoothTurn();
      this.gravity();
      if(this.destroyed && this.explotionR > 50){
        //console.log("relocate", this.moveY)
        this.moveY = -1200;
        this.moveX = 0;
        this.collided = false;
        this.explotionR = 0;
        this.destroyed = false;
      }
      
    }
    
    draw(){
    if(!this.collided){
      specularMaterial(100,100,255);
      texture(explTexture);
      model(playerModel);
    }else{
      if(!this.destroyed) explSound.play();
      //engineSound.stop();
      fill(255, 0, 0, 255 - 2*this.explotionR);
      specularMaterial(255,0, 0);
      sphere(this.explotionR);
      this.explotionR++;
      this.destroyed = true;
      
    }
      
  }
  
  updateProjectile(){
    //update projectiles
    this.projectiles.forEach(projectile =>{
      push();
      projectile.update();
      projectile.draw();
  
      if(projectile.startZ < this.killProjectileAt || projectile.toRemove())
        this.projectileTooFar = true;//delete projectile if is too far
      pop();
    });
     
      if(this.projectileTooFar){
        let e = this.projectiles.shift();
        this.projectileTooFar = false;
      }
    
    //console.log(this.projectiles.length); 
  }
  
  
  smoothTurn(){
       this.rotation+=cos(2*millis()/500)/1000;  //a bit of turbulance 
     if(this.movingRight){
       this.rotation-=this.rotationSpeed;
     }else if(this.movingLeft){
       this.rotation+=this.rotationSpeed;
     }else if(this.rotation > PI){
       this.rotation-=this.rotationSpeed;
     }else if(this.rotation < PI){
       this.rotation+=this.rotationSpeed;
     }
  
  
 }
  
  smoothVelocity(currentVelocity){
    if(this.currentVelocity < this.playerVelocity && this.movingRight){
      this.currentVelocity+=0.4;
      return this.currentVelocity;
    }else if(this.currentVelocity > 
             -this.playerVelocity &&
              this.movingLeft){
      this.currentVelocity-=0.4;
      return this.currentVelocity;
    }else{
      return this.currentVelocity;
    }
  }
  
      gravity(){ 
         if(this.moveY < -220)//when destroyed bring down to start over
         this.moveY+=this.playerVelocityY+5;
  }
  
      doSound(){
    
  }

}

/*************************************ENEMY*******************/
class Enemy{
  constructor(ampX, ampY, posX, posY, posZ, deltaY, deltaZ, spawnDelay, type, hp){
    this.posX = posX;
    this.posY = posY;
    this.posZ = posZ;
    this.type = type;
    this.savedPosX = this.posX;
    this.savedPosY = this.posY;
    this.savedPosZ = this.posZ; 
    this.deltaY = deltaY;
    this.deltaZ = deltaZ;
    this.dead = false;
    this.explotionRate = 0;
    this.spawnCounter = 0;
    this.collisionRadius = 100;
    this.spawnDelay = spawnDelay;
    this.recycle = false;
    this.ampX = ampX;
    this.ampY = ampY;
    this.enemyShoot = false;
    this.hp = hp;
    
    
  }
  
  die(){
    this.hp--;
    if(this.hp <= 0)
     this.dead = true;
  }
  
  isAlive(){
    return !this.dead;
  }
  
  move(){
    this.posX = this.savedPosX + this.ampX * cos(millis()/500);
    this.posY = this.savedPosY; //+ this.ampY*sin(millis()/2000);
    if(this.type == 3)
     this.posZ = this.savedPosZ + this.ampY*sin(millis()/2000);
    this.gravity();
  }
  
  update(){
    this.spawnCounter+=2;
    if(this.wait())  //update after delay
      this.updateEnemy();

  
  }
  draw(){
    if(this.wait()) //draw after delay
      this.drawEnemy();
   
  }
  
  wait(){
     return this.spawnCounter > this.spawnDelay;
  }
  
  gravity(){
    if(this.posY < -280){
       this.savedPosY+=8;
    
    }
  }
  
  shoot(s){
    if(this.type == 3){
      s = random(0.9, 0.93)
    }
    if(s > 0.9 && s < 0.905 && this.wait() && (this.type == 2 || this.type == 3) && this.isAlive())
      this.enemyShoot = true;
    if(this.enemyShoot){
      enemyProjectiles.push(new Projectile(-20, this.posX, this.posY, this.posZ, 2));
      this.enemyShoot = false;
    }
  }
  
  updateEnemy(){
    this.move();
    if(this.posZ>1400){// relocate enemy
        this.posZ = this.savedPosZ;
        this.posY = this.savedPosY;
        this.savedPosX = random(-1000, 1000);
        this.ampX = random(5, this.ampX);
     }
        this.posY+=this.deltaY;
        this.posZ+=this.deltaZ;
        translate(this.posX, this.posY, this.posZ);
    }
  
    drawEnemy(){
      if(this.isAlive()){
      if(this.type == 1 ){
        scale(40);
        rotateX(-0.1);
        rotateZ(0.1*cos(millis()/100));
        rotateY(millis()/1000);
        specularMaterial(100,100,255);
        model(saucerModel);
      }else if(this.type == 2){
        scale(40);
        rotateX(0);
        rotateZ(PI);
        rotateY(-PI/2);
        texture(moonTexture);
        model(shipModel);
      }else{
        scale(300);
        this.collisionRadius = 500;
        rotateY(millis()/10000);
        model(motherModel);
      }
    }else if(this.explotionRate > 10 && !this.recycle){
        this.explotionRate = 0;
        this.recycle = true;
     }else if(!this.recycle){
        this.explotionRate+=0.25;
        specularMaterial(255,0,0);
        scale(this.explotionRate);
        sphere(25);
     }
      
    }
    
}

//POJECTILE 

class Projectile{
  constructor(zVelocity, startX, startY, startZ, type){
    this.zVelocity = zVelocity;
    this.startX = startX;
    this.startY = startY;
    this.startZ = startZ;
    this.type = type;
    this.dead = false;
    this.collisionRadius = 10;
    this.explotionRate = 0;
    this.explode = true;
    
  }
  
  update(){
    if(this.isAlive())
     this.startZ-=this.zVelocity;
    translate(this.startX, this.startY, this.startZ);
    
    
  }

  isAlive(){
    return !this.dead;
  }
  
  toRemove(){
    return !this.explode;
  }
  
  draw(){
    if(this.isAlive()){
      if(this.type == 1)
        specularMaterial(255, 255, 255);
      else 
        specularMaterial(255, 0, 0);
      sphere(20);
    }else{
    if(this.explode){
      fill(255, 0, 0);
      scale(this.explotionRate);
      this.explotionRate++;
      specularMaterial(255,0, 0);
      sphere(20);
      if(this.explotionRate > 20)
        this.explode = false;
    }
    
  }
  }
}


///****************************ENEMY MANAGER**********
class EnemyManager{
  constructor(){
    this.wave = 1;
    this.timer = 0;
    this.numberOfEnemies = 5;
    this.startWave = true;
    this.tl = 100;
    
  
  }
  
  setLevelDifficulty(wave){
      this.numberOfEnemies = 5 * wave
      this.ampX1 = 100;
      this.ampX2 = 500*wave;
      this.zVelocity1 = 5;
      this.zVelocity2 = wave*7;
    
    //limits
    if(this.numberOfEnemies > 60)
      this.numberOfEnemies = 60;
    if(this.ampX2 > 800)
        this.ampX2 = 800;
    if(this.zVelocity2 > 80)
        this.zVelocity2 = 80;
  }
  
  setEnemies(){
      //clear previous enemies before starting new wave
    enemies = [];
     //init enemies
  for(let i = 0; i < this.numberOfEnemies; i++){
    if(this.wave < 10){
      enemies.push(
      new Enemy(
        random(this.ampX1, this.ampX2), //ampX
        0.0,            //ampY
        random(-1000, 1000), //pos X
        random(-280, -280), //pos Y
        -5000, //pos Z
        0.0, 
        random(this.zVelocity1, this.zVelocity2), // Z velocity
        random(20,2000), //spawn delay
        floor(random(1, 3)), ///type
        3)   //hp   
        ); 
     }
  }
    if(this.wave == 10){
      push();
       let e = new Enemy(
            1100, //ampX
            800,            //ampY
            0, //pos X
            -1580, //pos Y
            -3000, //pos Z
            0.0, 
            0,
            0, //spawn delay
            3,  //type
            100///hp
            ); 
      pop();

      enemies.push(e);
    }
  }
  
  
  update(player){
    if((killsCounter >= this.numberOfEnemies || player.restart) && this.timer < this.tl){
    if(killsCounter >= this.numberOfEnemies){
      this.wave++;
      killsCounter = 0;
      player.restart = true;
    }
      textSize(87);
      textFont(font);
      fill(255);
      text("LEVEL " + this.wave, -380, -900);
      this.timer++;
      this.startWave = true;
      
    }else if(this.startWave){
       nextSound.play();
       this.setLevelDifficulty(this.wave);
       enemyManager.setEnemies();
       this.startWave = false;
       this.timer = 0;
       killsCounter = 0;
       player.restart = false;
    }
    
    
    DEBUG = "Enemies:" + killsCounter +"/" +this.numberOfEnemies;
    
  }

  
}


class SoundTrack{
  constructor(){
    this.started1 = false;
    this.started2 = false;
  }
  
  update(){
    explSound.setVolume(gameVolume);
    nextSound.setVolume(gameVolume);
    engineSound.setVolume(gameVolume);
    engineSound2.setVolume(gameVolume);
    if(!this.started1 && FIRST_KILL){
         engineSound.play();
         this.started1 = true;
      }
    
    if(!engineSound.isPlaying() && this.started1){
      engineSound2.play(); 
      this.started2 = true;
    }
    
     
    }
  
   pause(){
    explSound.pause();
    nextSound.pause();
    engineSound.pause();
    engineSound2.pause();
   }
}

//CREDITS FOR FREE RESOURCES **************************************************************

//TEXTURE http://www.textures4photoshop.com/tex/fire-and-smoke/fire-flames-texture-background-for-free.aspx

//3D AIRCRAFT https://www.cgtrader.com/items/3857396/download-page
//3D SOUCER https://www.cgtrader.com/items/3772099/download-page
//3D SHIP  https://www.turbosquid.com/es/3d-models/free-pixel-spaceship-3d-model/1063711#
//3D MOTHER SHIP https://free3d.com/3d-model/mother-ship-alien-space-ship-326897.html

//SOUND EFFECTS https://pixabay.com/sound-effects/sinus-bomb-137068/
//https://pixabay.com/sound-effects/search/game%20win/
//https://pixabay.com/music/search/genre/video%20games/