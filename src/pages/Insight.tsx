
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ArticleCard from '@/components/ArticleCard';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Insight = () => {
  // Sample articles
  const articles = [
    {
      title: "Building Resilience to Different Macroeconomic Regimes",
      date: "April 3, 2025",
      description: "Head of the Portfolio Strategist group Atul Lele joins the Fiduciary Investors Symposium in Singapore to discuss the paradigm shift from globalization to modern mercantilism, and how investors can construct resilient portfolios in today's increasingly complex macroeconomic and geopolitical environments."
    },
    {
      title: "Is the Green Energy Transition Dead?",
      date: "March 19, 2025",
      description: "Policy has shifted to prioritize energy security and industrial competitiveness over climate leadership. This will steer investment to the most economical energy sources, driving continued growth in renewables and fossil fuels—but slower decarbonization."
    },
    {
      title: "The New York Times: This Is Who Loses in a Trade War",
      date: "March 10, 2025",
      description: "For decades, America has consumed much more than it produces, financing persistent trade deficits with debt that foreign investors are happy to buy. President Trump is unwilling to accept this state of affairs. In a guest essay for the New York Times, co-CIO Karen Karniol-Tambour describes what this shift means for Europe's economic and security paradigm, the changes that are needed, and the barriers to reform."
    },
    {
      title: "Gold Hits All-Time Highs: Assessing the Rally and Gold's Role in Portfolios",
      date: "March 4, 2025",
      description: "Daily Observations editor Jim Haskel sits down with head of contra-currencies Hudson Attar and portfolio strategist Alex Smith to discuss the recent gold rally and the type of diversification gold can provide."
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title="Market Insight"
        subtitle="Our insights guide us in formulating and updating Financial Planning Policies for clients, ensuring they remain consistently informed about the market and their progress."
        background="transparent"
      />

      {/* Research Library Section */}
      <Section title="Selected Insights from Our Research Library" background="white">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              title={article.title}
              date={article.date}
              description={article.description}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button className="bg-black hover:bg-black/90 text-white inline-flex items-center">
            View all insights <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </Section>

      {/* Contact Form */}
      <Section id="contact" background="light">
        <ContactForm />
      </Section>
    </div>
  );
};

export default Insight;
