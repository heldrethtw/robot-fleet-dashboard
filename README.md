# Robot Fleet Monitoring Dashboard

A real-time monitoring system for a simulated fleet of 6 autonomous robots carrying objects between destinations. Built to demonstrate skills in full-stack development, API integration, real-time data visualization, and physics-based sensor simulation.

## 🎯 Project Overview

This project simulates a robotic fleet management system where 6 robots autonomously transport objects of varying weights from a starting point to one of two destinations (Point A: 100m or Point B: 50m). Each robot must complete its delivery within 10 seconds or the mission fails.

The system features:

- **Physics-based sensor simulation** - Weight and speed affect temperature, pressure, and voltage readings
- **Real-time monitoring dashboard** - Live updates every 500ms showing all robot statuses
- **Performance analytics** - Tracks success rate, total deliveries, and failures
- **Visual progress tracking** - Animated progress bars showing robot movement

## 🚀 Features

### Backend (Node.js + Express)

- RESTful API serving live robot data
- Physics engine calculating sensor values based on:
  - Object weight (heavier loads = higher temperature & pressure)
  - Robot speed (faster movement = higher voltage)
  - Distance traveled
- Automatic mission cycling with randomized weights and destinations
- Real-time status tracking (idle, moving, delivered, failed)

### Frontend (React)

- Real-time dashboard consuming REST API
- Live statistics panel showing:
  - Total deliveries
  - Successful deliveries
  - Failed deliveries
  - Success rate percentage
- System health indicator
- 6 robot cards displaying:
  - Current status (moving/delivered/failed)
  - Cargo weight
  - Destination and current position
  - Time elapsed
  - Live sensor readings (temperature, humidity, pressure, voltage)
  - Animated progress bar with robot visualization
- Color-coded alerts (green = normal, red = critical thresholds exceeded)

## 🛠️ Technologies Used

- **Frontend:** React, Recharts (for future data visualization)
- **Backend:** Node.js, Express
- **API:** RESTful architecture with CORS enabled
- **State Management:** React Hooks (useState, useEffect)
- **Styling:** Inline CSS with responsive grid layouts

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/heldrethtw/robot-fleet-dashboard.git
cd robot-fleet-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the backend server:

```bash
node server.js
```

The API will run on `http://localhost:3001`

4. In a separate terminal, start the React app:

```bash
npm start
```

The dashboard will open at `http://localhost:3000`

## 🎮 How It Works

1. **Initialization:** 6 robots are created and assigned random cargo weights (10-110kg) and destinations (Point A or B)

2. **Movement:** Each robot calculates the required speed to reach its destination within 10 seconds and begins moving

3. **Sensor Updates:** Every 100ms, sensor readings update based on:

   - `Temperature = 20 + (weight/10)*5 + (speed/10)*3 + random variance`
   - `Pressure = 1000 + (weight/10)*10 + random variance`
   - `Voltage = 200 + (speed/10)*5 + random variance`
   - `Humidity = 50 + random variance`

4. **Completion:** Robots that reach their destination within 10 seconds succeed (green); others fail (red)

5. **Reset:** After all 6 robots complete their missions, new random assignments begin automatically

## 📊 API Endpoints

### `GET /api/robots`

Returns array of all 6 robots with current status and sensor data.

**Response Example:**

```json
[
  {
    "id": 1,
    "position": "45.23",
    "destination": 50,
    "carrying": 67.5,
    "speed": "5.12",
    "temperature": "58.34",
    "humidity": "62.15",
    "pressure": "1089.45",
    "voltage": "207.23",
    "status": "moving",
    "timeElapsed": "8.80"
  }
]
```

## 🎯 Key Learning Outcomes

This project demonstrates:

- Building RESTful APIs with Express
- Real-time data fetching and state management in React
- Physics-based simulation logic
- Responsive UI design with dynamic styling
- Multi-entity system monitoring
- Data aggregation and statistics tracking
- API integration between frontend and backend

## 🔮 Future Enhancements

- Temperature history charts for individual robots
- WebSocket implementation for true real-time updates (replacing polling)
- Export delivery logs to CSV
- Robot path visualization on 2D map
- Adjustable difficulty settings (time limits, weight ranges)
- Dark mode toggle

## 👤 Author

**Travis Heldreth**

- GitHub: [@heldrethtw](https://github.com/heldrethtw)

## 📝 License

This project is open source and available under the MIT License.

---

Built as a portfolio project to demonstrate full-stack development skills for robotics and automation applications.
