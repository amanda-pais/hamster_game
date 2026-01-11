let items = [];
let score = 0;
let lives = 3;

let hamster;
let carrot;
let peanut;
let anvil;

// defines the falling items properties
class FallingItem {
  
  // create the item at a random x and on the top of the screen
  constructor(img, points, speed, damage = 0, size = 40) {
    this.x = random(width);
    this.y = random(-500, -50);
    this.size = size;
    this.img = img;
    this.points = points;
    this.damage = damage;
    this.baseSpeed = speed; // initial speed
    this.speed = speed;
  }
  
  // update the movement
  update() {
    
    // increase the speed according to the score
    this.speed = map(score, 0, 40, this.baseSpeed, this.baseSpeed + 3);
    
    this.y += this.speed;
    
    if (this.y > height) {
      this.reset();
    }
  }
  
  // render image of item
  show() {
    image(this.img, this.x, this.y, this.size, this.size);
  }
  
  // reset function
  reset() {
    this.x = constrain(random(width), 0, width -this.size);
    this.y = random(-500, -50);
  }
    
  // catching the item - check if the item is in contact with the hamster
  checkCollision(hamsterX, hamsterY, hamsterSize) {
    
    let collisionSize = this.size;
    
    // visual adjustment for the anvil collision
    if (this.img === anvil) {
      collisionSize = this.size - 10; 
    }
    // +5 is a number that helps the item to be 'catch' by the size of the hamster img
    if (dist(this.x, this.y, hamsterX, hamsterY) < collisionSize + 5) {
      return true;
    } else return false;
  }
}

function setup() {
  createCanvas(400, 400);
  
  // load the vectors
  hamster = loadImage("hamster.png");
  carrot = loadImage("carrot.png");
  peanut = loadImage("peanut.png");
  anvil = loadImage("anvil.png");
  
  // create instances
  // carrot - adding 1 point to score
  items.push(new FallingItem(carrot, 1, 2, 0, 50)); 
  // peanut - adding 3 points to score
  items.push(new FallingItem(peanut, 3, 2.5)); 
  // anvil - removing 1 life from lives
  items.push(new FallingItem(anvil, 0, 3, 1, 60)); 
  
}

function draw() {
  background(220);
  
  // make the sky darker according to lives
  let skyDark = map(lives, 0, 3, 50, 200);
  
  // sky
  push();
  noStroke();
  fill(0, 0, skyDark);
  rect(0, 0, width, height * 0.8); // 80% sky
  pop();
  
  // grass
  push();
  noStroke();
  fill(64, 227, 126);
  rect(0, height * 0.8, width, height * 0.2) // 20% grass
  pop();
  
  // screen text
  push()
  textSize(20);
  fill(255, 255, 255);
  text("SCORE: " + score, 15, 50);
  text("LIVES: " + lives, 305, 50);
  pop()
  
  if (lives <= 0) {
    
    // dark background 
    fill(20, 20, 50);
    rect(0, 0, width, height);
    
    // game over text
    push();
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(255, 255, 255);
    text("GAME OVER", 200, 200);
    textSize(20);
    text('Final score: ' + score, 200, 250);
    pop();
    noLoop(); // stop the game
    
  }
  
  // outside the if statement to leave hamster and items showing at the 'game over' screen
  // hamster attributes
  let hamsterSize = 100;
  let hamsterX = constrain(mouseX, 0, width - hamsterSize); // hamster in the screen
  let hamsterY = 300;
  image(hamster, hamsterX, hamsterY, hamsterSize, hamsterSize);
  
    
  // loop to update movement and draw the items
  for (let item of items) {
    item.update();
    
    // draw with item rotation
    push();
    translate(item.x + item.size / 2, item.y + item.size / 2); // move the origin to center of the item
    rotate(frameCount * 0.03); 
    image(item.img, - item.size / 2, - item.size / 2, item.size, item.size); // draw in the 'new' center
    pop();
    
    // check the collision of each item and give points or damage
    if (item.checkCollision(hamsterX, hamsterY, hamsterSize)) {
      score += item.points;
      lives -= item.damage;
      item.reset();
    }
  }  
}

