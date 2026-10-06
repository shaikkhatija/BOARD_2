import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const TopProductsCard = ({ productsData }) => {
  const periods = Object.keys(productsData);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0] || 'May - June 2021');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const currentProducts = productsData[selectedPeriod] || productsData[periods[0]];

  const size = 150;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const segments = currentProducts.map((prod) => {
    const strokeDasharray = `${(prod.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += prod.percentage;
    return {
      ...prod,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-2xs border border-slate-100/80 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="font-montserrat font-bold text-lg text-black">Top products</h3>
        <div className="relative inline-block">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-black transition-colors font-medium"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30">
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

      {/* Donut Chart & Legend Side by Side */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
        {/* Donut SVG */}
        <div className="relative w-[150px] h-[150px] shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            {segments.map((seg) => (
              <circle
                key={seg.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={hoveredProduct?.name === seg.name ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredProduct(seg)}
                onMouseLeave={() => setHoveredProduct(null)}
              />
            ))}
          </svg>

          {/* Donut Center Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {hoveredProduct ? (
              <>
                <span className="text-base font-bold font-montserrat text-black tabular-nums">
                  {hoveredProduct.percentage}%
                </span>
                <span className="text-[10px] text-slate-500 max-w-[80px] truncate px-1">
                  {hoveredProduct.name}
                </span>
              </>
            ) : (
              <>
                <span className="text-xs font-semibold text-slate-400 font-lato">Total</span>
                <span className="text-sm font-bold font-montserrat text-slate-800">100%</span>
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-3 w-full sm:w-auto">
          {currentProducts.map((prod) => (
            <div
              key={prod.name}
              onMouseEnter={() => setHoveredProduct(prod)}
              onMouseLeave={() => setHoveredProduct(null)}
              className={`flex items-start gap-2.5 cursor-pointer p-1 rounded-lg transition-colors ${
                hoveredProduct?.name === prod.name ? 'bg-slate-50' : ''
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 mt-0.5"
                style={{ backgroundColor: prod.color }}
              />
              <div>
                <div className="font-montserrat font-bold text-xs sm:text-sm text-black">
                  {prod.name}
                </div>
                <div className="text-xs font-lato text-slate-500 tabular-nums">
                  {prod.percentage}% {prod.salesValue && `· ${prod.salesValue}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
