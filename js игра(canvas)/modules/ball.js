export default class Ball {
  constructor(canvas) {
    this.radius = 15;
    this.x = 330;
    this.y = 400;
    this.maxX = canvas.width;
    this.maxY = canvas.height;
    this.minX = 0;
    this.minY = 30;
    this.colorObj = "white";
    this.velocity = -10;
    this.direction = 0;
    this.isNegative = false;
    this.coef = 0;
    this.ctx = canvas.getContext("2d");

    this.socket = -1;
    this.roomId = -1;

    this.idOwner = "";
  }
  updateLocation() {
    if (this.x > this.maxX) this.x = this.maxX;
    if (this.x < this.minX) this.x = this.minX;
    if (this.y > this.maxY) this.y = this.maxY;
    if (this.y < this.minY) this.y = this.minY;
    if (this.idOwner == this.socket.id) {
      this.socket.emit("infoBallOnServer", {
        x: this.x,
        y: this.y,
        roomId: this.roomId,
      });
    } else {
      console.log("Пришлел мяч");
      this.socket.on("infoBallOnClient", (data) => {
        console.log(data);
        this.x = data.x;
        this.y = data.y;
      });
    }
    this.ctx.beginPath();
    this.ctx.fillStyle = this.colorObj;
    this.ctx.arc(this.x, this.y - this.radius, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
  moveBall() {
    this.x = this.x + this.velocity;
    this.y = this.y + this.direction;

    this.updateLocation();
  }
  changeDirection() {
    if (this.socket.id == this.idOwner) {
      if (this.direction == 0) {
        this.direction = 5;
      }
      this.isNegative = !this.isNegative;
      if (this.isNegative) {
        this.direction = this.direction + this.coef / 5;
        this.direction = -this.direction;
      } else {
        this.direction = this.direction - this.coef / 5;
      }
      console.log("client");
      console.log(this.direction, this.velocity);
      this.socket.emit("changeDirectionOnServer", {
        direction: this.direction,
        velocity: this.velocity,
        coef: this.coef,
        roomId: this.roomId,
        x: this.x,
        y: this.y,
      });
    } else {
      console.log("player2");
      this.socket.on("changeDirectionOnClient", (data) => {
        this.direction = data.direction;
        this.velocity = data.velocity;
        this.coef = data.coef;
        this.x = data.x;
        this.y = data.y;
      });
    }
  }
  beginPosition() {
    this.x = 500;
    this.y = 400;
    this.direction = 0;
    this.coef = 0;
    this.velocity = -10;
    this.updateLocation();
  }
}
