
export const getMobileTabTitle = (index: number): string => {
  return (index + 1).toString();
};

export const calculateTabTransform = (activeIndex: number, totalTabs: number): string => {
  const percentage = activeIndex * (100 + (2 / totalTabs));
  return `translateX(${percentage}%)`;
};

export const getTabWidth = (totalTabs: number): string => {
  return `${100 / totalTabs}%`;
};
