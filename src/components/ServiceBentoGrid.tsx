
import React from 'react';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { 
  Bell,
  Calendar,
  FileText,
  Globe
} from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  content: string;
}

interface ServiceBentoGridProps {
  services: ServiceItem[];
}

const ServiceBentoGrid: React.FC<ServiceBentoGridProps> = ({ services }) => {
  // Map services to bento features with appropriate icons and layouts
  const features = [
    {
      Icon: Globe,
      name: services[0]?.title || "Investment Planning",
      description: services[0]?.content || "Comprehensive investment strategy and portfolio management.",
      href: "/services",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-60" />
      ),
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: Bell,
      name: services[1]?.title || "Personal Advisor",
      description: services[1]?.content || "Dedicated financial advisor for personalized guidance.",
      href: "/services",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-60" />
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: Calendar,
      name: services[2]?.title || "Risk Management",
      description: services[2]?.content || "Comprehensive risk assessment and mitigation strategies.",
      href: "/services",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-100 opacity-60" />
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: FileText,
      name: services[3]?.title || "Policy Review",
      description: services[3]?.content || "Regular review and optimization of your financial policies.",
      href: "/services",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-100 opacity-60" />
      ),
      className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-4",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <BentoGrid className="lg:grid-rows-3 md:grid-cols-2 grid-cols-1">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
};

export default ServiceBentoGrid;
