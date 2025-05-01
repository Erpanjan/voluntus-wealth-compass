
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Article {
  id: string;
  title: string;
  date: string;
  category?: string;
  authors?: string[];
  image?: string;
  description: string;
  content?: string;
}

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Sample articles - in a real app, this would be fetched from an API
  const articles: Article[] = [
    {
      id: "green-energy-transition",
      title: "Is the Green Energy Transition Dead?",
      date: "March 19, 2025",
      category: "RESEARCH & INSIGHTS",
      authors: ["Karen Karniol-Tambour", "Carsten Stendevad", "Daniel Hochman", "Jeremy Ng"],
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      description: "Policy has shifted to prioritize energy security and industrial competitiveness over climate leadership. This will steer investment to the most economical energy sources, driving continued growth in renewables and fossil fuels—but slower decarbonization.",
      content: `
        <p class="mb-4">Across the world's major economies, policy is shifting to reinforce energy security and industrial competitiveness relative to climate leadership. The United States, under President Trump, is now pursuing an "all of the above" energy strategy that effectively prioritizes fossil fuel production and rolls back existing green subsidies.</p>
        
        <p class="mb-4">Europe's historic commitment to the climate transition is being challenged by the risk of carbon pricing and high electricity prices hurting industrial competitiveness, with additional complications from the energy security threat posed by Russia's invasion of Ukraine. Meanwhile, China's industrial policies have given it a commanding lead in many green technologies, but it is simultaneously doubling down on the supply of renewables and its domestic coal production.</p>
        
        <p class="mb-4">While policy may be shifting, what we're actually seeing is an energy addition, not an energy transition. Despite the hype around renewable energy and phasing out fossil fuels, what we've seen so far is massive growth in both renewable energy and fossil fuels, not a transition away from fossil fuels. With demand growing and natural gas and coal doubling their share of total energy supply in absolute terms (while renewables have increased by 4x), this picture is not likely to change.</p>
        
        <p class="mb-4">The net result for the future of energy supply is that we're seeing a shift in priorities away from climate leadership with greater focus on energy security and industrial competitiveness. This will likely steer investment to the most economical energy sources, driving continued growth in renewables and fossil fuels—but slower decarbonization.</p>
      `
    },
    {
      id: "outlook-threats-portfolios",
      title: "Our Outlook and the Threats We See to Portfolios, with Co-CIO Karen Karniol-Tambour",
      date: "April 21, 2025",
      category: "RESEARCH & INSIGHTS",
      authors: ["Karen Karniol-Tambour", "Jim Haskel"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      description: "In this edited version of our Q1 CIO call, Co-CIO Karen Karniol-Tambour describes how we are processing today's radically different economic and market environment.",
      content: `
        <p class="mb-4">In this edited version of our Q1 CIO call, Co-CIO Karen Karniol-Tambour describes how we are processing today's radically different economic and market environment.</p>
        
        <p class="mb-4">Karen discusses how we're seeing the economy and markets today, the key shifts we're making in our portfolios, and the big themes we're watching for the future.</p>
        
        <p class="mb-4">We're in a different regime from the past several decades. In that pre-COVID world, the economy was naturally too weak to generate enough demand for supply. That gave rise to very low inflation, which gave central banks freedom to run very easy monetary policy. When the economy got too weak, policymakers had enormous room to stimulate demand and to push up asset prices.</p>
        
        <p class="mb-4">Now we're in a period where the economy might generate too much demand for supply. We're living in a different physical, geopolitical, and economic environment. There are physical constraints in the supply of key commodities. Labor is in short supply, partially due to demographics, partially due to immigration restraints around the world. And there are significant geopolitical constraints, with countries increasingly working to become self-sufficient in key areas.</p>
      `
    },
    {
      id: "new-york-times-trade-war",
      title: "The New York Times: This Is Who Loses in a Trade War",
      date: "March 10, 2025",
      category: "IN THE NEWS",
      authors: ["Karen Karniol-Tambour"],
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      description: "For decades, America has consumed much more than it produces, financing persistent trade deficits with debt that foreign investors are happy to buy. President Trump is unwilling to accept this state of affairs. In a guest essay for the New York Times, co-CIO Karen Karniol-Tambour describes what this shift means for Europe's economic and security paradigm, the changes that are needed, and the barriers to reform.",
      content: `
        <p class="mb-4">For decades, America has consumed much more than it produces, financing persistent trade deficits with debt that foreign investors are happy to buy. President Trump is unwilling to accept this state of affairs.</p>
        
        <p class="mb-4">In a guest essay for the New York Times, co-CIO Karen Karniol-Tambour describes what this shift means for Europe's economic and security paradigm, the changes that are needed, and the barriers to reform.</p>
        
        <p class="mb-4">The essay touches on the realities of America's trade relationships, particularly focusing on the impacts that aggressive trade policies might have on global economies. Europe, in particular, faces unique challenges due to its dependence on both American security guarantees and export markets.</p>
        
        <p class="mb-4">The piece highlights the complex economic interdependencies that have developed over decades and how disruption to these relationships could affect global stability and prosperity.</p>
      `
    },
    {
      id: "barrons-influential-women",
      title: "Co-CIO Karen Karniol-Tambour Recognized on Barron's 100 Most Influential Women in U.S. Finance List",
      date: "March 14, 2025",
      category: "PEOPLE",
      authors: ["Karen Karniol-Tambour"],
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      description: "For the sixth consecutive year, Barron's has recognized Karen for her expertise, influence, and leadership in the financial services industry.",
      content: `
        <p class="mb-4">For the sixth consecutive year, Barron's has recognized Karen for her expertise, influence, and leadership in the financial services industry.</p>
        
        <p class="mb-4">Karen was named to Barron's inaugural list of the 100 Most Influential Women in U.S. Finance in 2020. The list recognizes women who have achieved positions of prominence in the financial services industry and are helping to shape its future.</p>
        
        <p class="mb-4">Since joining the firm in 2006 as an investment associate, Karen has been instrumental in developing our systematic investment approach and establishing the firm as a global macro investment manager. Karen is one of the industry's most highly regarded investment professionals, with deep expertise in global macroeconomics and markets.</p>
        
        <p class="mb-4">In her role, Karen oversees investment strategies and is responsible for managing portfolios, advising large institutional and sovereign wealth fund clients, and innovating new alpha sources.</p>
      `
    },
    {
      id: "gold-all-time-highs",
      title: "Gold Hits All-Time Highs: Assessing the Rally and Gold's Role in Portfolios",
      date: "March 4, 2025",
      category: "RESEARCH & INSIGHTS",
      authors: ["Hudson Attar", "Alex Smith", "Jim Haskel"],
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      description: "Daily Observations editor Jim Haskel sits down with head of contra-currencies Hudson Attar and portfolio strategist Alex Smith to discuss the recent gold rally and the type of diversification gold can provide.",
      content: `
        <p class="mb-4">Daily Observations editor Jim Haskel sits down with head of contra-currencies Hudson Attar and portfolio strategist Alex Smith to discuss the recent gold rally and the type of diversification gold can provide.</p>
        
        <p class="mb-4">Gold prices have surged to all-time highs in recent months, attracting attention from investors and financial media. In this article, we discuss the factors driving gold's rally and examine how gold functions within investment portfolios.</p>
        
        <p class="mb-4">The discussion covers several key aspects of gold as an investment:</p>
        
        <ul class="list-disc pl-5 mb-4">
          <li>The relationship between gold prices and real interest rates</li>
          <li>Gold's performance during different economic environments</li>
          <li>How central bank purchases are affecting the gold market</li>
          <li>Optimal portfolio allocation to gold as a diversifier</li>
          <li>The difference between gold and other commodity investments</li>
        </ul>
        
        <p class="mb-4">The analysis suggests that while gold can serve as a useful portfolio diversifier, its correlation with other assets varies significantly across different economic environments. This has important implications for how investors should think about gold allocation within their portfolios.</p>
      `
    },
  ];

  const article = articles.find(a => a.id === id);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If article doesn't exist, redirect to insights page
    if (!article) {
      navigate('/insight');
    }
  }, [article, navigate]);

  if (!article) return null;

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-32">
      <div className="container-custom pb-20">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="flex items-center text-sm hover:bg-white/50"
            onClick={() => navigate('/insight')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Insights
          </Button>
        </div>

        <Card className="overflow-hidden bg-white rounded-xl shadow-sm">
          {article.image && (
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            {article.category && (
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-voluntus-text-tertiary">
                  {article.category}
                </span>
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">{article.title}</h1>
            
            <div className="flex items-center mb-8 text-sm text-voluntus-text-tertiary">
              <span>{article.date}</span>
              {article.authors && article.authors.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span>By {article.authors.join(', ')}</span>
                </>
              )}
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl font-medium mb-8 text-black">{article.description}</p>
              
              {article.content && (
                <div className="text-voluntus-text-secondary" dangerouslySetInnerHTML={{ __html: article.content }} />
              )}
            </div>
            
            <div className="mt-12 flex items-center justify-between">
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => navigate('/insight')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Insights
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Button>
                <Button variant="outline" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Button>
                <Button variant="outline" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ArticleDetail;
