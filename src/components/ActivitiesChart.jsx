import React, { useState } from 'react';
import { ChevronDown, BarChart2, TrendingUp } from 'lucide-react';

export const ActivitiesChart = ({ activitiesData }) => {
  const periods = Object.keys(activitiesData);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0] || 'May - June 2021');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartType, setChartType] = useState('line');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const currentData = activitiesData[selectedPeriod] || activitiesData[periods[0]];

  // SVG Chart Geometry
  const width = 800;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxY = 500;

  const getYPos = (val) => {
    return paddingTop + chartHeight - (val / maxY) * chartHeight;
  };

  const getXPos = (index) => {
    return paddingLeft + (index / (currentData.length - 1)) * chartWidth;
  };

  // Generate smooth cubic bezier SVG path
  const generateSmoothPath = (key) => {
    if (!currentData || currentData.length === 0) return '';
    const points = currentData.map((d, i) => ({
      x: getXPos(i),
      y: getYPos(d[key]),
    }));

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : points.length - 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const yTicks = [500, 400, 300, 200, 100, 0];

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-2xs border border-slate-100/80">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-montserrat font-bold text-lg text-black">Activities</h3>
          {/* Period Dropdown */}
          <div className="relative inline-block mt-0.5">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-black transition-colors font-medium"
            >
              <span>{selectedPeriod}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30">
                {periods.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPeriod(p);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors ${
                      selectedPeriod === p
                        ? 'font-bold text-black bg-slate-50'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Legend & Chart Type Toggle */}
        <div className="flex items-center gap-6">
          {/* Legend Items */}
          <div className="flex items-center gap-5 text-xs font-lato">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E9A0A0]" />
              <span className="text-slate-700 font-medium">Guest</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9BDD7C]" />
              <span className="text-slate-700 font-medium">User</span>
            </div>
          </div>

          {/* Toggle between Line and Bar presentation */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setChartType('line')}
              title="Line Chart"
              className={`p-1 rounded-md transition-colors ${
                chartType === 'line' ? 'bg-white shadow-2xs text-black' : 'text-slate-500 hover:text-black'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              title="Bar Chart"
              className={`p-1 rounded-md transition-colors ${
                chartType === 'bar' ? 'bg-white shadow-2xs text-black' : 'text-slate-500 hover:text-black'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[300px] select-none"
        >
          {/* Y Axis Grid Lines & Labels */}
          {yTicks.map((val) => {
            const y = getYPos(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#F2F2F2"
                  strokeWidth="1.2"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="11"
                  fill="#999999"
                  fontFamily="Lato, sans-serif"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {currentData.map((d, i) => {
            const x = getXPos(i);
            return (
              <text
                key={d.week}
                x={x}
                y={height - 12}
                textAnchor="middle"
                fontSize="12"
                fill="#858585"
                fontFamily="Lato, sans-serif"
              >
                {d.week}
              </text>
            );
          })}

          {chartType === 'line' ? (
            <>
              {/* Guest Smooth Line (Pink/Coral #E9A0A0) */}
              <path
                d={generateSmoothPath('guest')}
                fill="none"
                stroke="#E9A0A0"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* User Smooth Line (Green #9BDD7C) */}
              <path
                d={generateSmoothPath('user')}
                fill="none"
                stroke="#9BDD7C"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data Node Dots */}
              {currentData.map((d, i) => {
                const x = getXPos(i);
                const guestY = getYPos(d.guest);
                const userY = getYPos(d.user);

                return (
                  <g
                    key={d.week}
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        index: i,
                        week: d.week,
                        guest: d.guest,
                        user: d.user,
                        x,
                        guestY,
                        userY,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <rect
                      x={x - 25}
                      y={paddingTop}
                      width={50}
                      height={chartHeight}
                      fill="transparent"
                    />

                    {/* Guest Node */}
                    <circle
                      cx={x}
                      cy={guestY}
                      r={hoveredPoint?.index === i ? 6 : 4}
                      fill="#E9A0A0"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />

                    {/* User Node */}
                    <circle
                      cx={x}
                      cy={userY}
                      r={hoveredPoint?.index === i ? 6 : 4}
                      fill="#9BDD7C"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </>
          ) : (
            /* Bar Chart Rendering Mode */
            currentData.map((d, i) => {
              const x = getXPos(i);
              const barW = 16;
              const guestH = (d.guest / maxY) * chartHeight;
              const userH = (d.user / maxY) * chartHeight;
              const guestY = paddingTop + chartHeight - guestH;
              const userY = paddingTop + chartHeight - userH;

              return (
                <g
                  key={d.week}
                  className="cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredPoint({
                      index: i,
                      week: d.week,
                      guest: d.guest,
                      user: d.user,
                      x,
                      guestY,
                      userY,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <rect
                    x={x - barW - 2}
                    y={guestY}
                    width={barW}
                    height={guestH}
                    rx="4"
                    fill="#E9A0A0"
                  />
                  <rect
                    x={x + 2}
                    y={userY}
                    width={barW}
                    height={userH}
                    rx="4"
                    fill="#9BDD7C"
                  />
                </g>
              );
            })
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none bg-slate-900/90 text-white text-[11px] p-2.5 rounded-xl shadow-lg transform -translate-x-1/2 -translate-y-full transition-all z-20 backdrop-blur-xs"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(Math.min(hoveredPoint.guestY, hoveredPoint.userY) / height) * 100 - 8}%`,
            }}
          >
            <div className="font-bold text-slate-200 border-b border-white/20 pb-1 mb-1">
              {hoveredPoint.week}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E9A0A0]" />
              <span>Guest: {hoveredPoint.guest}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9BDD7C]" />
              <span>User: {hoveredPoint.user}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
