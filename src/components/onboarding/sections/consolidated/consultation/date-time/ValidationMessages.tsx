
import React from 'react';

interface ValidationMessagesProps {
  startTimeValid: boolean | null;
  endTimeValid: boolean | null;
  rangeValid: boolean | null;
}

const ValidationMessages: React.FC<ValidationMessagesProps> = ({
  startTimeValid,
  endTimeValid,
  rangeValid
}) => {
  return (
    <>
      {startTimeValid === false && (
        <p className="text-xs text-red-500 mt-1">
          Please enter a valid start time between 7:00 AM and 9:00 PM
        </p>
      )}
      
      {endTimeValid === false && (
        <p className="text-xs text-red-500 mt-1">
          Please enter a valid end time between 7:00 AM and 9:00 PM
        </p>
      )}
      
      {startTimeValid && endTimeValid && rangeValid === false && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            Invalid time range. Make sure the end time is after the start time and the duration is not longer than 4 hours.
          </p>
        </div>
      )}
      
      {startTimeValid && endTimeValid && rangeValid === true && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">
            Valid time range selected!
          </p>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Note: Maximum consultation duration is 4 hours. Operating hours are from 7:00 AM to 9:00 PM.
      </p>
    </>
  );
};

export default ValidationMessages;
