import React from 'react';
import './StatsCard.css';

export default function StatsCard({ label, value, icon, color = 'blue', trend, trendValue }) {
  return (
    <div className={`stats-card stats-card--${color}`}>
      <div className="stats-card__icon">{icon}</div>
      <div className="stats-card__body">
        <div className="stats-card__value">{value}</div>
        <div className="stats-card__label">{label}</div>
        {trend && (
          <div className={`stats-card__trend stats-card__trend--${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </div>
    </div>
  );
}
