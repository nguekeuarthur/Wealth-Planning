import React from "react";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");

const WeeklyUpdatesTimeline = ({ updates }) => {
  if (!updates || updates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune note pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {updates.map((update, index) => {
        const date = moment(update.createdAt);
        const authorName = update.author?.fullName || update.author?.email || "Unknown";
        
        return (
          <div
            key={update._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {date.format("DD/MM/YYYY")}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {update.note}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                {authorName}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyUpdatesTimeline;

