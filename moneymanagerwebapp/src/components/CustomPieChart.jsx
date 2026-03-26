import React from 'react';

const CustomPieChart = ({ data, colors, centerLabel, centerAmount }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate angles for each segment
  let currentAngle = -90; // Start from top
  const segments = data.map((item, index) => {
    const percentage = item.amount / total;
    const angle = percentage * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      percentage: percentage * 100,
      color: colors[index],
    };
    currentAngle += angle;
    return segment;
  });

  // SVG donut chart configuration
  const size = 280;
  const strokeWidth = 45;
  const radius = (size - strokeWidth) / 2;

  const createArc = (startAngle, endAngle) => {
    const start = polarToCartesian(size / 2, size / 2, radius, endAngle);
    const end = polarToCartesian(size / 2, size / 2, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Donut Chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth={strokeWidth}
          />
          
          {/* Segments */}
          {segments.map((segment, index) => (
            <path
              key={index}
              d={createArc(segment.startAngle, segment.endAngle)}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          ))}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-sm text-gray-500">{centerLabel}</div>
          <div className="text-2xl font-bold text-gray-900">{centerAmount}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-8 justify-center flex-wrap">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-sm text-gray-700">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomPieChart;