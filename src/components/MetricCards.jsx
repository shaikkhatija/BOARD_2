import React from 'react';
import { DollarSign, Tag, ThumbsUp, Users as UsersIcon } from 'lucide-react';

export const MetricCards = ({ metrics }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'revenue':
        return <DollarSign className="w-5 h-5 text-black" strokeWidth={2.2} />;
      case 'transaction':
        return <Tag className="w-5 h-5 text-black" strokeWidth={2.2} />;
      case 'likes':
        return <ThumbsUp className="w-5 h-5 text-black" strokeWidth={2.2} />;
      case 'users':
        return <UsersIcon className="w-5 h-5 text-black" strokeWidth={2.2} />;
      default:
        return <DollarSign className="w-5 h-5 text-black" strokeWidth={2.2} />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((card) => (
        <div
          key={card.id}
          style={{ backgroundColor: card.bgColor }}
          className="rounded-[20px] p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-200 relative flex flex-col justify-between h-[120px] sm:h-[128px]"
        >
          {/* Top Row: Icon in top-right */}
          <div className="flex justify-end">
            <div className="p-1 rounded-full">{getIcon(card.iconName)}</div>
          </div>

          {/* Bottom Area: Label and Value */}
          <div>
            <span className="block text-xs font-lato text-slate-800 font-medium">
              {card.title}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-bold font-montserrat text-black tabular-nums tracking-tight">
                {card.value}
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-white/40 px-1.5 py-0.5 rounded-full">
                {card.changePercent}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
