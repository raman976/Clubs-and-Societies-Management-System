import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Successfully Logged In!</h1>
      <div className="work-in-progress">
        <h2>🚧 Work in Progress 🚧</h2>
        <p>We're building something amazing here. Stay tuned!</p>
      </div>
    </div>
  );
};

export default Dashboard;