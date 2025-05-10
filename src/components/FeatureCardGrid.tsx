
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ServiceItem {
  id: string;
  title: string;
  content: string;
  imageSrc?: string;
}

interface FeatureCardGridProps {
  services: ServiceItem[];
}

const FeatureCardGrid: React.FC<FeatureCardGridProps> = ({ services }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Grid with all features displayed in the same format */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {services.map((feature) => (
          <Card key={feature.id} className="overflow-hidden border-0 shadow-md rounded-lg">
            <div className="flex flex-col">
              {/* Image placeholder - top */}
              <div className="w-full bg-gray-100 h-32 sm:h-36 md:h-48 relative">
                {feature.imageSrc ? (
                  <img 
                    src={feature.imageSrc} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Image Placeholder
                  </div>
                )}
              </div>
              
              {/* Content - bottom */}
              <CardContent className="p-4 sm:p-5 md:p-8 mobile-card-padding">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 break-words">
                  {feature.title}
                </h3>
                <p className="text-[#666666] leading-relaxed text-sm sm:text-base break-words mobile-text-base">
                  {feature.id === 'investment' 
                    ? "Contrary to popular belief, you don't need great wealth or expertise to build a diversified portfolio. Our Financial Planning Policy offers personalized, cost-effective strategies with global reach—helping you navigate market shifts confidently and stay aligned with your long-term goals."
                    : feature.content}
                </p>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureCardGrid;
