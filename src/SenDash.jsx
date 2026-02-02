import React, { useState, useEffect } from "react";

const SensorDashboard = () => {
  const [robots, setRobots] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    successfulDeliveries: 0,
    failedDeliveries: 0,
  });
  const [trackedRobots, setTrackedRobots] = useState(new Set());

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/robots");
        const data = await response.json();
        setRobots(data);

        // Track completed deliveries
        data.forEach((robot) => {
          const key = `${robot.id}-${robot.timeElapsed}`;
          if (
            (robot.status === "delivered" || robot.status === "failed") &&
            !trackedRobots.has(key)
          ) {
            setTrackedRobots((prev) => new Set([...prev, key]));
            setStats((prev) => ({
              totalDeliveries: prev.totalDeliveries + 1,
              successfulDeliveries:
                prev.successfulDeliveries +
                (robot.status === "delivered" ? 1 : 0),
              failedDeliveries:
                prev.failedDeliveries + (robot.status === "failed" ? 1 : 0),
            }));
          }
        });
      } catch (error) {
        console.error("Error fetching robot data:", error);
      }
    };

    fetchRobots();
    const interval = setInterval(fetchRobots, 500);
    return () => clearInterval(interval);
  }, [trackedRobots]);

  const successRate =
    stats.totalDeliveries > 0
      ? ((stats.successfulDeliveries / stats.totalDeliveries) * 100).toFixed(1)
      : 0;

  const getSensorStyle = (value, threshold) => {
    return {
      backgroundColor: value > threshold ? "#ff4444" : "#4CAF50",
      color: "white",
      padding: "15px",
      margin: "10px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "moving":
        return "#2196F3";
      case "delivered":
        return "#4CAF50";
      case "failed":
        return "#ff4444";
      default:
        return "#gray";
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "1400px",
        margin: "30px auto",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "20px",
        }}
      >
        Robot Fleet Dashboard
      </h1>

      {/* Statistics Panel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{ fontSize: "32px", fontWeight: "bold", color: "#2196F3" }}
          >
            {stats.totalDeliveries}
          </div>
          <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Total Deliveries
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{ fontSize: "32px", fontWeight: "bold", color: "#4CAF50" }}
          >
            {stats.successfulDeliveries}
          </div>
          <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Successful
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{ fontSize: "32px", fontWeight: "bold", color: "#ff4444" }}
          >
            {stats.failedDeliveries}
          </div>
          <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Failed
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{ fontSize: "32px", fontWeight: "bold", color: "#FF9800" }}
          >
            {successRate}%
          </div>
          <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Success Rate
          </div>
        </div>
      </div>

      {/* System Health Status */}
      <div
        style={{
          backgroundColor: robots.some((r) => r.status === "failed")
            ? "#ff4444"
            : "#4CAF50",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "18px",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {robots.some((r) => r.status === "failed")
          ? `⚠️ WARNING: ${
              robots.filter((r) => r.status === "failed").length
            } Robot(s) Failed Delivery`
          : "✓ All Robots Operating"}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {robots.map((robot) => (
          <div
            key={robot.id}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: `3px solid ${getStatusColor(robot.status)}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h2 style={{ margin: 0, color: "#333" }}>Robot {robot.id}</h2>
              <span
                style={{
                  backgroundColor: getStatusColor(robot.status),
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {robot.status.toUpperCase()}
              </span>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <strong>Carrying:</strong>{" "}
                {parseFloat(robot.carrying).toFixed(1)} kg
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <strong>Destination:</strong> Point{" "}
                {robot.destination === 100 ? "A" : "B"} ({robot.destination}m)
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <strong>Position:</strong> {robot.position}m
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <strong>Time:</strong> {robot.timeElapsed}s / 10s
              </p>
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    marginBottom: "5px",
                    color: "#666",
                  }}
                >
                  Progress to Point {robot.destination === 100 ? "A" : "B"}
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "20px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "10px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: `${
                        (parseFloat(robot.position) / robot.destination) * 100
                      }%`,
                      height: "100%",
                      backgroundColor: getStatusColor(robot.status),
                      transition: "width 0.5s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingRight: "5px",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>🤖</span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#999",
                    marginTop: "3px",
                  }}
                >
                  <span>Start</span>
                  <span>{robot.destination}m</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div style={getSensorStyle(parseFloat(robot.temperature), 35)}>
                <div style={{ fontSize: "11px", opacity: "0.9" }}>Temp</div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {robot.temperature}°C
                </div>
              </div>
              <div style={getSensorStyle(parseFloat(robot.humidity), 75)}>
                <div style={{ fontSize: "11px", opacity: "0.9" }}>Humidity</div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {robot.humidity}%
                </div>
              </div>
              <div style={getSensorStyle(parseFloat(robot.pressure), 1000)}>
                <div style={{ fontSize: "11px", opacity: "0.9" }}>Pressure</div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {robot.pressure}
                </div>
              </div>
              <div style={getSensorStyle(parseFloat(robot.voltage), 210)}>
                <div style={{ fontSize: "11px", opacity: "0.9" }}>Voltage</div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {robot.voltage}V
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorDashboard;
