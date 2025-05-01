
import React from 'react';
import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';
import ArticleCard from '@/components/ArticleCard';
import ContactForm from '@/components/ContactForm';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Insight = () => {
  // Sample articles
  const articles = [
    {
      id: "green-energy-transition",
      title: "Is the Green Energy Transition Dead?",
      date: "March 19, 2025",
      category: "RESEARCH & INSIGHTS",
      authors: ["Karen Karniol-Tambour", "Carsten Stendevad", "Daniel Hochman", "Jeremy Ng"],
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      description: "Policy has shifted to prioritize energy security and industrial competitiveness over climate leadership. This will steer investment to the most economical energy sources, driving continued growth in renewables and fossil fuels—but slower decarbonization."
    },
    {
      id: "outlook-threats-portfolios",
      title: "Our Outlook and the Threats We See to Portfolios, with Co-CIO Karen Karniol-Tambour",
      date: "April 21, 2025",
      category: "RESEARCH & INSIGHTS",
      authors: ["Karen Karniol-Tambour", "Jim Haskel"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      description: "In this edited version of our Q1 CIO call, Co-CIO Karen Karniol-Tambour describes how we are processing today's radically different economic and market environment."
    },
    {
      id: "new-york-times-trade-war",
      title: "The New York Times: This Is Who Loses in a Trade War",
      date: "March 10, 2025",
      category: "IN THE NEWS",
      authors: ["Karen Karniol-Tambour"],
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      description: "For decades, America has consumed much more than it produces, financing persistent trade deficits with debt that foreign investors are happy to buy. President Trump is unwilling to accept this state of affairs. In a guest essay for the New York Times, co-CIO Karen Karniol-Tambour describes what this shift means for Europe's economic and security paradigm, the changes that are needed, and the barriers to reform."
    },
    {
      id: "barrons-influential-women",
      title: "Co-CIO Karen Karniol-Tambour Recognized on Barron's 100 Most Influential Women in U.S. Finance List",
      date: "March 14, 2025",
      category: "PEOPLE",
      authors: ["Karen Karniol-Tambour"],
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      description: "For the sixth consecutive year, Barron's has recognized Karen for her expertise, influence, and leadership in the financial services industry."
    },
    {
      id: "gold-all-time-highs",
      title: "Gold Hits All-Time Highs: Assessing the Rally and Gold's Role in Portfolios",
      date: "March 4, 2025",
      category: "RESEARCH & INSIGHTS",
      authors: ["Hudson Attar", "Alex Smith", "Jim Haskel"],
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      description: "Daily Observations editor Jim Haskel sits down with head of contra-currencies Hudson Attar and portfolio strategist Alex Smith to discuss the recent gold rally and the type of diversification gold can provide."
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title="Market Insight"
        subtitle="Our insights guide us in formulating and updating Financial Planning Policies for clients, ensuring they remain consistently informed about the market and their progress."
        background="light"
      />

      {/* Latest Research Section */}
      <Section title="Latest Research" titleCentered={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 w-full">
          {articles.slice(0, 4).map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              date={article.date}
              description={article.description}
              category={article.category}
              authors={article.authors}
              image={article.image}
            />
          ))}
        </div>
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
