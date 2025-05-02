
/**
 * Helper utilities for the Review Section
 */

// Helper to get date label
export const getDateLabel = (dateValue: string) => {
  const dates = [
    { value: '2025-05-05', label: 'Monday, May 5' },
    { value: '2025-05-06', label: 'Tuesday, May 6' },
    { value: '2025-05-07', label: 'Wednesday, May 7' },
    { value: '2025-05-08', label: 'Thursday, May 8' },
    { value: '2025-05-09', label: 'Friday, May 9' }
  ];
  const date = dates.find(d => d.value === dateValue);
  return date?.label || dateValue;
};

// Helper to get time label
export const getTimeLabel = (timeValue: string) => {
  const times = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
  ];
  const time = times.find(t => t.value === timeValue);
  return time?.label || timeValue;
};

// Helper for questionnaire answers
export const getAnswerLabel = (questionId: string, value: string) => {
  if (questionId === 'investmentGoals') {
    const options = {
      'retirement': 'Retirement Planning',
      'wealth': 'Wealth Accumulation',
      'income': 'Regular Income',
      'education': 'Education Funding',
      'other': 'Other Goals'
    };
    return options[value as keyof typeof options] || value;
  } else if (questionId === 'riskTolerance') {
    const options = {
      'conservative': 'Conservative - Preserve capital with minimal risk',
      'moderate': 'Moderate - Balance between growth and capital preservation',
      'aggressive': 'Aggressive - Maximize growth, comfortable with volatility'
    };
    return options[value as keyof typeof options] || value;
  } else if (questionId === 'timeHorizon') {
    const options = {
      'short': 'Short term (1-3 years)',
      'medium': 'Medium term (3-10 years)',
      'long': 'Long term (10+ years)'
    };
    return options[value as keyof typeof options] || value;
  }
  return value;
};
