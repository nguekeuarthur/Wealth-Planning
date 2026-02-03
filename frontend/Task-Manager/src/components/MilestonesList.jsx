import React from "react";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");

const MilestonesList = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun milestone pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => {
        const completedDate = moment(milestone.completedAt);
        
        return (
          <div
            key={milestone._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {milestone.name}
                </h4>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {milestone.description}
                </p>
                <p className="text-sm text-gray-500">
                  {completedDate.format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MilestonesList;

