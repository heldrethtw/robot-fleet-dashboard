const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
})

// Robot class
class Robot {
    constructor(id) {
        this.id = id;
        this.position = 0; // Current position (0 to 100)
        this.destination = 0; // A=100, B=50
        this.carrying = null; // Object weight
        this.speed = 0;
        this.temperature = 20;
        this.humidity = 50;
        this.pressure = 1000;
        this.voltage = 200;
        this.status = 'idle'; // idle, moving, delivered, failed
        this.timeElapsed = 0;
    }

    assignObject(weight, destination) {
        this.carrying = weight;
        this.destination = destination;
        this.position = 0;
        this.timeElapsed = 0;
        this.status = 'moving';

        // Calculate required speed to make it in 10 seconds
        const requiredSpeed = this.destination / 10;
        this.speed = requiredSpeed + (Math.random() * 2 - 1); // Add slight variation
    }

    update(deltaTime) {
        if (this.status !== 'moving') return;

        this.timeElapsed += deltaTime;

        // Move robot
        this.position += this.speed * deltaTime;

        // Update sensors based on physics
        const weightFactor = this.carrying / 10; // Heavier = more strain
        const speedFactor = this.speed / 10;

        this.temperature = 20 + weightFactor * 5 + speedFactor * 3 + (Math.random() * 5);
        this.humidity = 50 + (Math.random() * 20);
        this.pressure = 1000 + weightFactor * 10 + (Math.random() * 50);
        this.voltage = 200 + speedFactor * 5 + (Math.random() * 10);

        // Check if delivered or failed
        if (this.position >= this.destination) {
            this.status = this.timeElapsed <= 10 ? 'delivered' : 'failed';
            this.speed = 0;
        } else if (this.timeElapsed > 10) {
            this.status = 'failed';
            this.speed = 0;
        }
    }

    getData() {
        return {
            id: this.id,
            position: this.position.toFixed(2),
            destination: this.destination,
            carrying: this.carrying,
            speed: this.speed.toFixed(2),
            temperature: this.temperature.toFixed(2),
            humidity: this.humidity.toFixed(2),
            pressure: this.pressure.toFixed(2),
            voltage: this.voltage.toFixed(2),
            status: this.status,
            timeElapsed: this.timeElapsed.toFixed(2)
        };
    }
}

// Create 6 robots
const robots = Array.from({ length: 6 }, (_, i) => new Robot(i + 1));

// Assign initial objects
function assignNewObjects() {
    robots.forEach(robot => {
        if (robot.status === 'idle' || robot.status === 'delivered' || robot.status === 'failed') {
            const weight = Math.random() * 100 + 10; // 10-110 kg
            const destination = Math.random() > 0.5 ? 100 : 50; // Point A or B
            robot.assignObject(weight, destination);
        }
    });
}

// Update simulation
setInterval(() => {
    robots.forEach(robot => robot.update(0.1)); // Update every 100ms

    // Check if all robots are done
    const allDone = robots.every(r => r.status === 'delivered' || r.status === 'failed');
    if (allDone) {
        setTimeout(() => assignNewObjects(), 2000); // Wait 2 seconds, then assign new objects
    }
}, 100);

// Start first cycle
assignNewObjects();

// API endpoint
app.get('/api/robots', (req, res) => {
    res.json(robots.map(r => r.getData()));
});

app.listen(PORT, () => {
    console.log(`Robot simulation server running on http://localhost:${PORT}`);
});