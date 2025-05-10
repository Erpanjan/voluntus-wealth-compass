
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  // Get the first service for the main feature card
  const mainFeature = services[0];
  
  // Get the rest of the services for the smaller cards
  const otherFeatures = services.slice(1);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Main Feature Card (Large, spans full width) */}
      <Card className="overflow-hidden border-0 shadow-md rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Image placeholder - left side on desktop */}
          <div className="w-full md:w-2/5 bg-gray-100 h-60 md:h-auto relative">
            {mainFeature.imageSrc ? (
              <img 
                src={mainFeature.imageSrc} 
                alt={mainFeature.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Image Placeholder
              </div>
            )}
          </div>
          
          {/* Content - right side on desktop */}
          <div className="p-8 md:p-10 w-full md:w-3/5">
            <h3 className="text-2xl font-semibold mb-4">{mainFeature.title}</h3>
            <p className="text-[#9F9EA1] leading-relaxed">{mainFeature.content}</p>
          </div>
        </div>
      </Card>

      {/* Smaller Feature Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {otherFeatures.map((feature) => (
          <Card key={feature.id} className="overflow-hidden border-0 shadow-md rounded-lg">
            <div className="flex flex-col">
              {/* Image placeholder - top */}
              <div className="w-full bg-gray-100 h-48 relative">
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
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-[#9F9EA1] leading-relaxed">{feature.content}</p>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureCardGrid;
