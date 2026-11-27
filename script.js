
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const shape = document.getElementById("shape");
const color = document.getElementById("color");
const width = document.getElementById("width");
const widthValue = document.getElementById("widthValue");
const erase = document.getElementById("erase");
const clear = document.getElementById("clear");

let drawing = false;
let startX = 0;
let startY = 0;
let selectedShape = "line";
let isErasing = false;

// Display line width
width.addEventListener("input", function () {
    widthValue.textContent = width.value;
});

// Select shape
shape.addEventListener("change", function () {
    selectedShape = shape.value;
});

// Get mouse position
function getPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * canvas.width / rect.width,
        y: (event.clientY - rect.top) * canvas.height / rect.height
    };
}

// Start drawing
canvas.addEventListener("pointerdown", function (event) {
    drawing = true;

    const position = getPosition(event);

    startX = position.x;
    startY = position.y;

    canvas.setPointerCapture(event.pointerId);
});

// Finish drawing
canvas.addEventListener("pointerup", function (event) {
    if (!drawing) return;

    drawing = false;

    const position = getPosition(event);

    ctx.beginPath();
    ctx.lineWidth = width.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = isErasing ? "#ffffff" : color.value;

    // Draw Line
    if (selectedShape === "line") {
        ctx.moveTo(startX, startY);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
    }

    // Draw Rectangle
    else if (selectedShape === "rectangle") {
        ctx.strokeRect(
            startX,
            startY,
            position.x - startX,
            position.y - startY
        );
    }

    // Draw Circle
    else if (selectedShape === "circle") {
        const radius = Math.sqrt(
            Math.pow(position.x - startX, 2) +
            Math.pow(position.y - startY, 2)
        );

        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    ctx.closePath();
});

// Cancel drawing safely
canvas.addEventListener("pointercancel", function () {
    drawing = false;
});

// Erase option
erase.addEventListener("click", function () {
    isErasing = true;
    selectedShape = "line";
    shape.value = "line";
});

// Return to normal drawing when color changes
color.addEventListener("input", function () {
    isErasing = false;
});

// Clear Canvas
clear.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isErasing = false;
});
