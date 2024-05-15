const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height/1.2;
canvas.width = window_width/1.2;
canvas.style.background = "#ff8";

let mousePos = { x: 0, y: 0 };

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = 0; // Circles will not move horizontally
        this.dy = -this.speed; // Circles move upwards only
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillStyle = "white"; // Ensuring text is visible on circles
        context.fillText(this.text, this.posX, this.posY);
        context.closePath();
    }

    update(context) {
        this.posY += this.dy;
        this.draw(context);
    }

    isColliding(other) {
        const dx = this.posX - other.posX;
        const dy = this.posY - other.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + other.radius;
    }

    isClicked(mx, my) {
        const distance = Math.sqrt((mx - this.posX) ** 2 + (my - this.posY) ** 2);
        return distance < this.radius;
    }
}

let circles = [];
const numCircles = 10;

for (let i = 0; i < numCircles; i++) {
    let radius = Math.floor(Math.random() * 75 + 50);
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = window_height + Math.random() * 200; // Start below the canvas
    circles.push(new Circle(x, y, radius, 'blue', i.toString(), Math.random() * 4 + 2));
}

function updateCircle() {
    requestAnimationFrame(updateCircle);
    ctx.clearRect(0, 0, window_width, window_height);

    // Draw and update circles within the view
    for (let i = circles.length - 1; i >= 0; i--) {
        let circle = circles[i];
        if (circle.posY + circle.radius < 0) {
            circles.splice(i, 1); // Remove circles that have moved out of view
        } else {
            circle.update(ctx);
        }
    }

    xyMouse(ctx);
}

function xyMouse(context){
    context.font = "16px Arial";
    context.fillStyle = "black";
    context.fillText("x: "+mousePos.x, 30, 20); 
    context.fillText("y: "+mousePos.y, 30, 40);
}

canvas.addEventListener('click', function(evt) {
    mousePos = getMousePos(canvas, evt);
    for (let i = circles.length - 1; i >= 0; i--) {
        if (circles[i].isClicked(mousePos.x, mousePos.y)) {
            circles.splice(i, 1); // Remove the clicked circle
            break; // Assuming only one circle can be clicked at a time
        }
    }
});

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

updateCircle();
