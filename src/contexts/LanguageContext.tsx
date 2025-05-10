
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Available languages
export type Language = 'en' | 'zh';

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, section?: string) => string;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object structure
type TranslationSection = {
  [key: string]: string;
};

type TranslationObject = {
  [section: string]: TranslationSection;
};

// Translation data
const translations: Record<Language, TranslationObject> = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      insight: 'Insight',
      event: 'Event',
      about: 'About',
      contact: 'Contact Us',
      login: 'LOGIN'
    },
    home: {
      hero_title: "We're There With You Every Step of The Way",
      hero_subtitle: "Access professional investment management service through a simple monthly subscription, with reduced costs and service tailored to you.",
      services_button: "Our Services",
      question_gambling: "Tired of Feeling Like You're Gambling With Your Money?",
      gambling_desc1: "Managing your wealth shouldn't feel like placing bets in a game where the odds are stacked against you. But for many, that's exactly what it is: guesswork, conflicting advice, and a constant fear of making the wrong move.",
      gambling_desc2: "It is time for a strategic and systematic approach to financial success.",
      question_complicated: "Does Managing Your Wealth Have to Be So Complicated and Expensive?",
      complicated_desc1: "Investing can feel overwhelming—endless strategies, intricate products, and expensive fees. But does it really need to be this way?",
      complicated_desc2: "Complexity provides only marginal value and oftentimes drives up the cost, while simplicity delivers clarity and confidence.",
      question_best_interest: "Can Financial Advice Ever Be in Your Best Interest?",
      best_interest_desc1: "Everywhere you turn, you're bombarded with financial advice, all telling you what to do with your money. But most of this 'advice' comes with a catch: it's incentivized to get you to trade, transact, and eventually buy products.",
      best_interest_desc2: "Commission-based advice is not in your best interest, so we offer a subscription-based service.",
      question_accountability: "Does Investing End Once the Product is Purchased?",
      accountability_desc1: "Investment products are so much accessible, but what happens after the purchase? Once decisions are made, people are often left navigating the market volatility on their own.",
      accountability_desc2: "Purchasing a product is only the start of the journey, what matters is what comes after the purchase.",
      how_we_can_help: "How We Can Help"
    },
    services: {
      hero_title: "A Financial Policy That Guides You From Start to End",
      roadmap_title: "A Roadmap for your Investment Journey",
      roadmap_desc1: "The Financial Planning Policy is a personalized roadmap for managing your wealth. It outlines how your funds should be allocated to kick-start your investment journey, providing step-by-step guidance along with ongoing monitoring and plan governance.",
      roadmap_desc2: "It also defines our roles and responsibilities throughout this process, ensuring the policy remains up-to-date and that you're never alone on your journey to reach your financial goals.",
      whats_included: "What's Included",
      investment_title: "Investment Solution",
      investment_content: "Many believe building a diversified investment portfolio requires substantial wealth and expertise, limiting it to a small set of investors—but this isn't true. Our Financial Planning Policy provides personalized investment strategies offering effective global diversification, empowering clients to navigate market volatility confidently. Moreover, our portfolios are designed to be cost-effective, lowering upfront investment expenses. Regular updates ensure the strategies remain aligned with each client's evolving goals and market conditions, maintaining a robust financial plan aimed at achieving long-term success.",
      advisor_title: "Dedicated Advisor",
      advisor_content: "Every client is paired with a dedicated financial advisor who not only executes the policy but regularly refines your Financial Planning Policy based on market condition and your circumstances. Through proactive, insightful communication, they keep you informed and empowered—ensuring you feel confident in every investment decision you make.",
      risk_title: "Risk Management",
      risk_content: "With our strong quantitative skills and deep investment expertise, we manage risk across multiple dimensions. Through vigilant, ongoing oversight, we ensure your investments stay aligned with your evolving financial circumstances and remain positioned to achieve your goals—delivering peace of mind and confidence in your investment journey.",
      policy_title: "Policy Keeping",
      policy_content: "Your Financial Planning Policy adapts to shifting market conditions and your personal life changes, meticulously tracking all advice given and decisions made. This flexible, proactive approach brings clarity to uncertain times, keeping your investment strategy both resilient and relevant.",
      why_choose_us: "Why Choose Us",
      what_sets_apart: "What sets us apart",
      control_title: "We give you control",
      control_subtitle: "over your wealth, decisions, and outcomes.",
      control_desc: "By placing the financial planning policy at the center of our service, we empower clients with direct control over the rules, processes, and the outcome.",
      fiduciary_title: "We bear fiduciary Duty",
      fiduciary_subtitle: "with a transparent governance",
      fiduciary_desc: "We uphold a fiduciary duty to act in the client's best interest. This commitment is reflected in a clear plan that outlines all rules, including legal accountability. Importantly, we do not accept commissions from third party, this ensures that our interests remain aligned.",
      simplicity_title: "We value simplicity",
      simplicity_subtitle: "over complexity",
      simplicity_desc: "We aim to keep the policy and investment strategy simple. This simplicity enables client to have a clearer understanding of their investments, fostering greater confidence and maintain a healthy expectation for the outcomes. Overly complex investment strategies often yield marginal benefits at the expense of clarity and transparency.",
      accountability_title: "We take accountability",
      accountability_subtitle: "over every advice we share",
      accountability_desc: "We take accountability by making all the advice we share measurable. At the conclusion of the policy, we will revisit all advice provided, taking responsibility and being incentivized based on the outcomes. This approach reinforces our commitment to the client's success and ensures full accountability for our actions.",
      pricing_title: "Our Pricing",
      pricing_desc1: "This is a subscription service with policy fee is charged periodically, with the amount depending on the complexity of your financial needs and the duration of the policy.",
      pricing_desc2: "We DO NOT charge based on investment vehicle selected or size of the investment.",
      join_waitlist: "Join the Waitlist"
    },
    about: {
      hero_title: "About Us",
      hero_subtitle: "We are a Hong Kong-based wealth advisory firm dedicated to helping households secure their financial future through tailored investment planning",
      vision_title: "We envision a world where finance truly empowering people to flourish in life."
    },
    insight: {
      hero_title: "Market Insight",
      hero_subtitle: "Our insights guide us in formulating and updating Financial Planning Policies for clients, ensuring they remain consistently informed about the market and their progress.",
      latest_research: "Latest Research",
      no_articles: "No articles found",
      check_back: "Check back soon for new insights"
    },
    event: {
      hero_title: "Our Community",
      hero_subtitle: "A community where you can connect with others, exchange ideas, and enjoy meaningful conversations.",
      collaboration: "A collaberation with Besties",
      upcoming_events: "Upcoming Events",
      previous_events: "Previous Events",
      financial_workshop: "Financial Planning Workshop",
      financial_workshop_desc: "Join us for an interactive workshop on creating sustainable financial plans that adapt to changing market conditions.",
      investment_webinar: "Investment Strategy Webinar",
      investment_webinar_desc: "Learn about emerging investment opportunities and how to position your portfolio for long-term growth.",
      market_outlook: "Market Outlook 2025",
      market_outlook_desc: "Our annual event discussing economic trends and investment strategies for the coming year.",
      retirement_seminar: "Retirement Planning Seminar",
      retirement_seminar_desc: "A comprehensive seminar on building and maintaining wealth through retirement."
    },
    contact: {
      hero_title: "Join Our Waitlist",
      hero_subtitle: "Be among the first to experience our service when we launch",
    },
    common: {
      join_waitlist: "Join the Waitlist",
      how_we_can_help: "How We Can Help",
      copyright: "© {year} Voluntus Long-term Capital",
      disclaimer: "This website is owned and operated by Voluntus Long-term Capital, a Hong Kong-based wealth advisory firm.",
      disclaimer_extended: "This website is owned and operated by Voluntus Long-term Capital, a Hong Kong-based wealth advisory firm. Our services are only available to Hong Kong-based investors, excluding U.S. Persons.",
      disclaimer_returns: "Unless otherwise stated, all return figures shown are for illustrative purposes only, do not represent actual client or model returns, and are not indicative of future performance.",
      language: "Language",
      english: "English",
      chinese: "中文"
    }
  },
  zh: {
    nav: {
      home: '首页',
      services: '服务',
      insight: '市场洞察',
      event: '活动',
      about: '关于我们',
      contact: '联系我们',
      login: '登录'
    },
    home: {
      hero_title: "我们全程陪伴您的投资之旅",
      hero_subtitle: "通过简单的月度订阅，获得专业的投资管理服务，降低成本，享受为您量身定制的服务。",
      services_button: "我们的服务",
      question_gambling: "厌倦了感觉像在用钱赌博？",
      gambling_desc1: "管理您的财富不应该像在赔率对您不利的游戏中下注。但对许多人来说，这正是：猜测、矛盾的建议和对做出错误决定的持续恐惧。",
      gambling_desc2: "是时候采用策略性和系统性的方法来实现财务成功了。",
      question_complicated: "管理您的财富真的必须如此复杂和昂贵吗？",
      complicated_desc1: "投资可能令人不知所措——无尽的策略、复杂的产品和昂贵的费用。但真的需要这样吗？",
      complicated_desc2: "复杂性只提供边际价值，且往往会增加成本，而简单性则带来清晰度和信心。",
      question_best_interest: "金融建议真的能符合您的最佳利益吗？",
      best_interest_desc1: "无论您转向何处，都会被各种金融建议轰炸，告诉您如何处理您的钱。但大多数这些'建议'都有一个隐藏条件：它们的目的是激励您交易、进行交易，最终购买产品。",
      best_interest_desc2: "基于佣金的建议不符合您的最佳利益，因此我们提供基于订阅的服务。",
      question_accountability: "投资在产品购买后就结束了吗？",
      accountability_desc1: "投资产品变得如此容易获取，但购买后会发生什么？一旦做出决定，人们往往被留下独自应对市场波动。",
      accountability_desc2: "购买产品只是旅程的开始，重要的是购买后发生的事情。",
      how_we_can_help: "我们如何提供帮助"
    },
    services: {
      hero_title: "从始至终指导您的金融政策",
      roadmap_title: "您投资旅程的路线图",
      roadmap_desc1: "金融规划政策是管理您财富的个性化路线图。它概述了如何分配您的资金以启动您的投资旅程，提供逐步指导以及持续监控和计划治理。",
      roadmap_desc2: "它还定义了我们在整个过程中的角色和责任，确保政策保持最新，并且在您实现财务目标的旅程中，您永远不会孤单。",
      whats_included: "包括什么",
      investment_title: "投资解决方案",
      investment_content: "许多人认为构建多元化投资组合需要大量财富和专业知识，将其限制在一小部分投资者范围内——但事实并非如此。我们的金融规划政策提供个性化投资策略，提供有效的全球多元化，使客户能够自信地应对市场波动。此外，我们的投资组合设计成本效益高，降低了前期投资费用。定期更新确保策略与每个客户不断变化的目标和市场条件保持一致，保持健全的财务计划，旨在实现长期成功。",
      advisor_title: "专属顾问",
      advisor_content: "每位客户都会配对一位专属财务顾问，他们不仅执行政策，还会根据市场状况和您的情况定期完善您的金融规划政策。通过主动、有见地的沟通，他们让您保持知情和权能 —— 确保您在做出每个投资决策时都充满信心。",
      risk_title: "风险管理",
      risk_content: "凭借我们强大的定量技能和深厚的投资专业知识，我们跨多个维度管理风险。通过警惕、持续的监督，我们确保您的投资与您不断变化的财务状况保持一致，并保持定位以实现您的目标 —— 为您的投资旅程带来安心和信心。",
      policy_title: "政策保持",
      policy_content: "您的金融规划政策会适应不断变化的市场条件和您个人生活的变化，细致跟踪所有给予的建议和做出的决定。这种灵活、主动的方法在不确定时期带来清晰度，使您的投资策略既有弹性又有相关性。",
      why_choose_us: "为什么选择我们",
      what_sets_apart: "我们的独特之处",
      control_title: "我们给您控制权",
      control_subtitle: "控制您的财富、决策和结果。",
      control_desc: "通过将金融规划政策置于我们服务的中心，我们使客户能够直接控制规则、流程和结果。",
      fiduciary_title: "我们承担受托责任",
      fiduciary_subtitle: "具有透明的治理",
      fiduciary_desc: "我们坚持以客户最佳利益行事的受托责任。这一承诺反映在一个明确的计划中，该计划概述了所有规则，包括法律责任。重要的是，我们不接受第三方的佣金，这确保了我们的利益保持一致。",
      simplicity_title: "我们重视简单性",
      simplicity_subtitle: "而非复杂性",
      simplicity_desc: "我们的目标是保持政策和投资策略简单。这种简单性使客户能够更清晰地了解他们的投资，培养更大的信心，并保持对结果的健康期望。过于复杂的投资策略通常以牺牲清晰度和透明度为代价，只产生边际收益。",
      accountability_title: "我们承担责任",
      accountability_subtitle: "对我们分享的每一条建议",
      accountability_desc: "我们通过使我们分享的所有建议都可衡量来承担责任。在政策结束时，我们将重新审视所提供的所有建议，根据结果承担责任并激励。这种方法加强了我们对客户成功的承诺，并确保对我们行动的充分问责。",
      pricing_title: "我们的定价",
      pricing_desc1: "这是一项订阅服务，根据您的财务需求的复杂性和政策的持续时间定期收取政策费用。",
      pricing_desc2: "我们不基于所选投资工具或投资规模收费。",
      join_waitlist: "加入等候名单"
    },
    about: {
      hero_title: "关于我们",
      hero_subtitle: "我们是一家总部位于香港的财富咨询公司，致力于通过定制的投资规划帮助家庭保障其财务未来",
      vision_title: "我们设想一个金融真正赋能人们在生活中蓬勃发展的世界。"
    },
    insight: {
      hero_title: "市场洞察",
      hero_subtitle: "我们的洞察指导我们制定和更新客户的金融规划政策，确保他们始终了解市场和他们的进展。",
      latest_research: "最新研究",
      no_articles: "未找到文章",
      check_back: "请稍后再来查看新的洞察"
    },
    event: {
      hero_title: "我们的社区",
      hero_subtitle: "一个您可以与他人联系、交流想法并享受有意义对话的社区。",
      collaboration: "与Besties合作",
      upcoming_events: "即将举行的活动",
      previous_events: "过往活动",
      financial_workshop: "金融规划工作坊",
      financial_workshop_desc: "加入我们的互动工作坊，学习如何创建适应变化市场条件的可持续金融计划。",
      investment_webinar: "投资策略网络研讨会",
      investment_webinar_desc: "了解新兴投资机会以及如何定位您的投资组合以实现长期增长。",
      market_outlook: "2025年市场展望",
      market_outlook_desc: "我们的年度活动，讨论未来一年的经济趋势和投资策略。",
      retirement_seminar: "退休规划研讨会",
      retirement_seminar_desc: "关于通过退休建立和维持财富的综合研讨会。"
    },
    contact: {
      hero_title: "加入我们的等候名单",
      hero_subtitle: "成为首批体验我们服务的人",
    },
    common: {
      join_waitlist: "加入等候名单",
      how_we_can_help: "我们如何提供帮助",
      copyright: "© {year} Voluntus长期资本",
      disclaimer: "本网站由Voluntus长期资本拥有和运营，这是一家总部位于香港的财富咨询公司。",
      disclaimer_extended: "本网站由Voluntus长期资本拥有和运营，这是一家总部位于香港的财富咨询公司。我们的服务仅适用于香港投资者，不包括美国人士。",
      disclaimer_returns: "除非另有说明，所有回报数据均仅供说明之用，不代表实际客户或模型回报，也不表明未来业绩。",
      language: "语言",
      english: "English",
      chinese: "中文"
    }
  }
};

// Provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get browser language or default to English
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'zh' ? 'zh' : 'en';
  };

  // Try to get saved language from localStorage or use browser language
  const getSavedLanguage = (): Language => {
    try {
      const savedLang = localStorage.getItem('language') as Language;
      return savedLang === 'zh' ? 'zh' : 'en';
    } catch (error) {
      return getBrowserLanguage();
    }
  };

  const [language, setLanguage] = useState<Language>(getSavedLanguage());

  // Save language to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  }, [language]);

  // Translation function
  const t = (key: string, section: string = 'common'): string => {
    try {
      const translationSection = translations[language][section];
      if (!translationSection) return key;
      
      const translation = translationSection[key];
      if (!translation) return key;
      
      // Handle special cases like year placeholder
      if (key.includes('copyright')) {
        return translation.replace('{year}', new Date().getFullYear().toString());
      }
      
      return translation;
    } catch (error) {
      console.warn(`Translation not found for key: ${section}.${key}`);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
