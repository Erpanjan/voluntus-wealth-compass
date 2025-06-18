import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    'nav.home': 'HOME',
    'nav.services': 'SERVICES',
    'nav.insight': 'INSIGHT',
    'nav.about': 'ABOUT US',
    'nav.contact': 'CONTACT US',
    'nav.login': 'LOGIN',

    // Home page
    'home.hero.title': "We're There With You Every Step of The Way",
    'home.hero.subtitle': 'Access professional investment management service through a simple monthly subscription, with reduced costs and service tailored to you.',
    'home.ourServices': 'Our Services',
    'home.howWeCanHelp': 'How We Can Help',
    'home.whatWeCanHelp': 'What We Can Help',

    // Interactive container sections
    'container.gambling.title': "Tired of Feeling Like You're Gambling With Your Money?",
    'container.gambling.text1': "Managing your wealth shouldn't feel like placing bets in a game where the odds are stacked against you. But for many, that's exactly what it is: guesswork, conflicting advice, and a constant fear of making the wrong move.",
    'container.gambling.text2': 'It is time for a strategic and systematic approach to financial success.',
    
    'container.complicated.title': 'Does Managing Your Wealth Have to Be So Complicated and Expensive?',
    'container.complicated.text1': 'Investing can feel overwhelming—endless strategies, intricate products, and expensive fees. But does it really need to be this way?',
    'container.complicated.text2': 'Complexity provides only marginal value and oftentimes drives up the cost, while simplicity delivers clarity and confidence.',
    
    'container.bestInterest.title': 'Can Financial Advice Ever Be in Your Best Interest?',
    'container.bestInterest.text1': "Everywhere you turn, you're bombarded with financial advice, all telling you what to do with your money. But most of this 'advice' comes with a catch: it's incentivized to get you to trade, transact, and eventually buy products.",
    'container.bestInterest.text2': 'Commission-based advice is not in your best interest, so we offer a subscription-based service.',
    
    'container.accountability.title': 'Does Investing End Once the Product is Purchased?',
    'container.accountability.text1': 'Investment products are so much accessible, but what happens after the purchase? Once decisions are made, people are often left navigating the market volatility on their own.',
    'container.accountability.text2': 'Purchasing a product is only the start of the journey, what matters is what comes after the purchase.',

    'container.staticAdvice.title': 'Is Static Advice Enough in a Dynamic Life?',
    'container.staticAdvice.text1': 'Most wealth advice is given once, at a single point in time — assuming your goals, needs, and circumstances will stay the same. But life doesn\'t work like that. Priorities shift. New goals emerge. And when your situation changes, the original investment plan may no longer serve its purpose.',
    'container.staticAdvice.text2': 'That\'s why your investment strategy should evolve with you. We deliver ongoing, personalized advice that adapts to both your changing life and the markets — so your money is always working toward the right future.',

    // About page
    'about.title': 'About Us',
    'about.subtitle': 'We are a Hong Kong-based wealth advisory firm dedicated to helping households secure their financial future through tailored investment planning',
    'about.vision': 'We envision a world where finance truly empowering people to flourish in life.',

    // Services page
    'services.title': 'A Financial Policy That Guides You From Start to End',
    'services.roadmap.title': 'A Roadmap for your Investment Journey',
    'services.roadmap.text1': 'The Financial Planning Policy is a personalized roadmap for managing your wealth. It outlines how your funds should be allocated to kick-start your investment journey, providing step-by-step guidance along with ongoing monitoring and plan governance.',
    'services.roadmap.text2': 'It also defines our roles and responsibilities throughout this process, ensuring the policy remains up-to-date and that you\'re never alone on your journey to reach your financial goals.',
    'services.whatsIncluded': "What's Included",
    'services.whyChooseUs': 'Why Choose Us',
    'services.whyChooseUs.subtitle': 'What sets us apart',
    'services.pricing.title': 'Our Pricing',
    'services.pricing.text1': 'This is a subscription service with policy fee is charged periodically, with the amount depending on the complexity of your financial needs and the duration of the policy.',
    'services.pricing.text2': 'We DO NOT charge based on investment vehicle selected or size of the investment.',

    // Service items
    'service.investment.title': 'Investment Solution',
    'service.investment.content': "Many believe building a diversified investment portfolio requires substantial wealth and expertise, limiting it to a small set of investors—but this isn't true. Our Financial Planning Policy provides personalized investment strategies offering effective global diversification, empowering clients to navigate market volatility confidently. Moreover, our portfolios are designed to be cost-effective, lowering upfront investment expenses. Regular updates ensure the strategies remain aligned with each client's evolving goals and market conditions, maintaining a robust financial plan aimed at achieving long-term success.",
    'service.advisor.title': 'Dedicated Advisor',
    'service.advisor.content': 'Every client is paired with a dedicated financial advisor who not only executes the policy but regularly refines your Financial Planning Policy based on market condition and your circumstances. Through proactive, insightful communication, they keep you informed and empowered—ensuring you feel confident in every investment decision you make.',
    'service.risk.title': 'Risk Management',
    'service.risk.content': 'With our strong quantitative skills and deep investment expertise, we manage risk across multiple dimensions. Through vigilant, ongoing oversight, we ensure your investments stay aligned with your evolving financial circumstances and remain positioned to achieve your goals—delivering peace of mind and confidence in your investment journey.',
    'service.policy.title': 'Policy Keeping',
    'service.policy.content': 'Many assume that global diversification requires significant wealth or expertise—but it doesn\'t. Our Financial Planning Policy delivers personalized, cost-effective investment strategies that offer broad diversification and adapt over time, helping clients manage risk and stay aligned with their long-term goals.',

    // Value propositions
    'value.control.title': 'We give you control',
    'value.control.subtitle': 'over your wealth, decisions, and outcomes.',
    'value.control.description': 'By placing the financial planning policy at the center of our service, we empower clients with direct control over the rules, processes, and the outcome.',
    'value.fiduciary.title': 'We bear fiduciary Duty',
    'value.fiduciary.subtitle': 'with a transparent governance',
    'value.fiduciary.description': 'We uphold a fiduciary duty to act in the client\'s best interest. This commitment is reflected in a clear plan that outlines all rules, including legal accountability. Importantly, we do not accept commissions from third party, this ensures that our interests remain aligned.',
    'value.simplicity.title': 'We value simplicity',
    'value.simplicity.subtitle': 'over complexity',
    'value.simplicity.description': 'We aim to keep the policy and investment strategy simple. This simplicity enables client to have a clearer understanding of their investments, fostering greater confidence and maintain a healthy expectation for the outcomes. Overly complex investment strategies often yield marginal benefits at the expense of clarity and transparency.',
    'value.accountability.title': 'We take accountability',
    'value.accountability.subtitle': 'over every advice we share',
    'value.accountability.description': 'We take accountability by making all the advice we share measurable. At the conclusion of the policy, we will revisit all advice provided, taking responsibility and being incentivized based on the outcomes. This approach reinforces our commitment to the client\'s success and ensures full accountability for our actions.',

    // Insight page
    'insight.title': 'Market Insight',
    'insight.subtitle': 'Our insights guide us in formulating and updating Financial Planning Policies for clients, ensuring they remain consistently informed about the market and their progress.',
    'insight.latestResearch': 'Latest Research',
    'insight.noArticles': 'No published articles found',
    'insight.noArticles.subtitle': 'Articles need to have a published date in the past to appear here',
    'insight.refresh': 'Refresh Articles',
    'insight.showing': 'Showing',
    'insight.of': 'of',
    'insight.articles': 'articles',

    // Event page
    'event.title': 'Our Community',
    'event.subtitle': 'A community where you can connect with others, exchange ideas, and enjoy meaningful conversations.',
    'event.collaboration': 'A collaberation with Besties',
    'event.upcoming': 'Upcoming Events',
    'event.previous': 'Previous Events',

    // Contact/Waitlist
    'contact.title': 'Join Our Waitlist',
    'contact.subtitle': 'Be among the first to experience our service when we launch',
    'waitlist.joinWaitlist': 'Join the Waitlist',
    'waitlist.firstName': 'First name',
    'waitlist.lastName': 'Last name',
    'waitlist.contactMethod': 'Contact method (Email, Phone, etc.)',
    'waitlist.preferredContact': 'Preferred contact avenue (Email, Phone, WeChat, WhatsApp, etc.)',
    'waitlist.contactInfo': 'Your contact information',
    'waitlist.interests': 'Any specific interests or questions? (optional)',
    'waitlist.message': 'Your message',
    'waitlist.submit': 'Submit',
    'waitlist.submitting': 'Submitting...',
    'waitlist.consent': 'By clicking \'Join Waitlist\'/\'Submit\', I authorize Voluntas Long-term Capital to reach out to me about their service, exclusive events, service updates, and company news.',

    // Common buttons and actions
    'common.joinWaitlist': 'Join the Waitlist',
    'common.getStarted': 'Get Started',
    'common.learnMore': 'Learn More',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',

    // Login/Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.loggingIn': 'Logging in...',
    'auth.resetLink': 'Reset link sent',
    'auth.resetMessage': 'If an account exists with this email, you\'ll receive a password reset link.',

    // Footer
    'footer.copyright': '© {year} Voluntas Long-term Capital',
    'footer.disclaimer': 'This website is owned and operated by Voluntas Long-term Capital, a Hong Kong-based wealth advisory firm. Our services are only available to Hong Kong-based investors, excluding U.S. Persons.',
    'footer.returns': 'Unless otherwise stated, all return figures shown are for illustrative purposes only, do not represent actual client or model returns, and are not indicative of future performance.',

    // Toast messages
    'toast.waitlistAdded': 'Added to waitlist',
    'toast.waitlistMessage': 'Thank you for joining our waitlist. We\'ll notify you when we launch.',
    'toast.messageSent': 'Message sent',
    'toast.messageResponse': 'Thank you for contacting us. Our advisor will reach out to you shortly.',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.services': '服务',
    'nav.insight': '市场洞察',
    'nav.about': '关于我们',
    'nav.contact': '联系我们',
    'nav.login': '登录',

    // Home page
    'home.hero.title': '理财路上，有我们一路相伴',
    'home.hero.subtitle': '只需简单订阅，享受量身定制的投资管理服务，专业、省钱、更安心',
    'home.ourServices': '我们的服务',
    'home.howWeCanHelp': '我们的解决方案',
    'home.whatWeCanHelp': '我们致力解决的问题',

    // Interactive container sections
    'container.gambling.title': '是否厌倦了投资变成一场没有把握的赌局？',
    'container.gambling.text1': '管理财富，不该像在押注一场胜算渺茫的赌局。但对许多人来说，现实正是如此：依赖猜测做决定、时刻面对互相矛盾的信息，担心每一步都可能走错。',
    'container.gambling.text2': '是时候用战略性、系统化的方法，迈向真正的财富成功。',
    
    'container.complicated.title': '管理财富真的需要这么复杂又昂贵吗？',
    'container.complicated.text1': '投资往往让人不知所措——策略繁多、产品复杂、费用高昂。可真的非得如此吗？',
    'container.complicated.text2': '复杂的投资方案往往价值有限，却抬高了成本；真正的清晰与信心，来自简单而高效的解决方案。',
    
    'container.bestInterest.title': '投资建议，真的能以您的利益为先吗？',
    'container.bestInterest.text1': '无论走到哪里，都会被各种理财建议包围——每个人似乎都在告诉您该如何管理自己的钱。但这些所谓的"建议"背后，往往隐藏着附带的动机：促使投资者频繁交易、购买产品，以赚取更高的佣金。',
    'container.bestInterest.text2': '佣金驱动的建议并非以您为本，我们以订阅方式提供更透明的理财服务',
    
    'container.accountability.title': '投资难道买入产品就完事了？',
    'container.accountability.text1': '投资产品触手可及，但购买后会怎样？一旦做出决定，人们往往只能独自面对市场的波动。',
    'container.accountability.text2': '购买产品只是旅程的起点，真正重要的是后续的管理与规划。',

    'container.staticAdvice.title': '生活在变，投资策略却一成不变，真的合适吗？',
    'container.staticAdvice.text1': '多数理财服务，只是在某个时点提供一次性的方案——假设您的目标和需求不会改变。但现实生活并非如此。人生会变，目标会变，原来的投资组合可能就不再适用。',
    'container.staticAdvice.text2': '因此，投资策略也应与您的生活变化而做调整。我们提供持续更新的个性化建议，确保您的资金始终服务于您想要的未来。',

    // About page
    'about.title': '关于我们',
    'about.subtitle': '我们是一家位于香港的投资咨询公司，致力于通过量身定制的投资规划帮助家庭保障财务未来。',
    'about.vision': '我们的愿景，是让金融真正服务于人的成长与美好生活。',

    // Services page
    'services.title': '一份贯穿全程的财务规划，陪您踏实走完每一段财富旅程',
    'services.roadmap.title': '您投资旅程中的指南针',
    'services.roadmap.text1': '财务规划建议书是一份专属定制的财富管理路线图，清晰规划投资方向，提供分阶段的执行指引，并持续跟进与管理整体方案。',
    'services.roadmap.text2': '财务规划建议书明确我们在整个过程中的角色与责任，确保方案持续优化、与时俱进，并在您迈向财务目标的每一步中始终陪伴左右。',
    'services.whatsIncluded': '服务内容一览',
    'services.whyChooseUs': '为什么选择我们',
    'services.whyChooseUs.subtitle': '我们的独特之处',
    'services.pricing.title': '我们的定价',
    'services.pricing.text1': '本服务为按期收费的订阅制投资咨询服务，费用将根据您的财富需求及规划期限而定。',
    'services.pricing.text2': '我们的收费与您所选择的投资工具或投资金额并不直接挂钩。',

    // Service items
    'service.investment.title': '投资方案',
    'service.investment.content': '许多人认为构建多样化投资组合需要丰厚的资产和专业知识，仅限于少数投资者——但这并非事实。我们的财务规划政策提供个性化投资策略，实现有效的全球多样化，帮助客户自信应对市场波动。此外，我们的投资组合设计注重成本效益，降低前期投资费用。定期更新确保策略与客户不断变化的目标和市场条件保持一致，维护旨在实现长期成功的稳健财务计划。',
    'service.advisor.title': '专属顾问',
    'service.advisor.content': '每位客户都配有专属财务顾问，不仅执行政策，还会根据市场状况和您的情况定期完善您的财务规划政策。通过主动、深入的沟通，他们让您了解情况并充满信心——确保您对每一个投资决策都充满信心。',
    'service.risk.title': '风险管理',
    'service.risk.content': '凭借我们强大的量化技能和深度投资专业知识，我们从多个维度管理风险。通过警觉、持续的监督，我们确保您的投资与您不断变化的财务状况保持一致，并始终朝着实现目标的方向发展——为您的投资之旅带来安心和信心。',
    'service.policy.title': '方案更新',
    'service.policy.content': '您的财务规划政策适应不断变化的市场条件和您的个人生活变化，细致跟踪所有给出的建议和做出的决定。这种灵活、主动的方法为不确定的时期带来清晰度，让您的投资策略既有韧性又与时俱进。',

    // Value propositions
    'value.control.title': '让您掌握主动权',
    'value.control.subtitle': '掌控您的财富、决策和结果。',
    'value.control.description': '通过将财务规划政策置于我们服务的中心，我们让客户直接控制规则、流程和结果。',
    'value.fiduciary.title': '承担受托责任',
    'value.fiduciary.subtitle': '始终坚持透明的管理',
    'value.fiduciary.description': '我们承担受托责任，始终以客户的最佳利益行事。这一承诺体现在明确的计划中，该计划概述了所有规则，包括法律责任。重要的是，我们不接受第三方佣金，这确保了我们的利益保持一致。',
    'value.simplicity.title': '重视简单之道',
    'value.simplicity.subtitle': '我们坚持化繁为简',
    'value.simplicity.description': '我们致力于保持政策和投资策略的简单性。这种简单性使客户能够更清楚地了解他们的投资，培养更大的信心并保持对结果的健康期望。过于复杂的投资策略往往以牺牲清晰度和透明度为代价，只能产生边际收益。',
    'value.accountability.title': '我们承担应有的责任',
    'value.accountability.subtitle': '我们不仅给出建议，更承担责任',
    'value.accountability.description': '我们通过让我们分享的所有建议都可以衡量来承担责任。在政策结束时，我们将重新审视所提供的所有建议，承担责任并根据结果获得激励。这种方法强化了我们对客户成功的承诺，并确保我们的行为完全负责。',

    // Insight page
    'insight.title': '市场洞察',
    'insight.subtitle': '我们的市场见解指导我们为客户制定和更新财务规划政策，确保客户持续了解市场及其财富进展。',
    'insight.latestResearch': '最新研究',
    'insight.noArticles': '暂无已发布文章',
    'insight.noArticles.subtitle': '文章需设有发布日期才会显示在此处',
    'insight.refresh': '刷新文章',
    'insight.showing': '正在显示第',
    'insight.of': '篇，共',
    'insight.articles': '篇文章',

    // Event page
    'event.title': '我们的社区',
    'event.subtitle': '一个让您可以与他人交流、分享想法和进行有意义对话的社区。',
    'event.collaboration': '我们与 Besties 的联名合作',
    'event.upcoming': '即将举行的活动',
    'event.previous': '往期活动',

    // Contact/Waitlist
    'contact.title': '抢先预约',
    'contact.subtitle': '成为首批体验我们服务的用户',
    'waitlist.joinWaitlist': '抢先预约',
    'waitlist.firstName': '名字',
    'waitlist.lastName': '姓氏',
    'waitlist.contactMethod': '联系方式（邮箱、电话等）',
    'waitlist.preferredContact': '首选联系方式（邮箱、电话、微信、WhatsApp 等）',
    'waitlist.contactInfo': '您的联系账号',
    'waitlist.interests': '特别关注的内容或想了解的问题？（选填）',
    'waitlist.message': '您的留言',
    'waitlist.submit': '提交',
    'waitlist.submitting': '正在提交...',
    'waitlist.consent': '点击"提交"即表示您同意我们与您联系，分享服务详情、专属活动及公司动态。',

    // Common buttons and actions
    'common.joinWaitlist': '抢先预约',
    'common.getStarted': '开始使用',
    'common.learnMore': '了解更多',
    'common.submit': '提交',
    'common.cancel': '取消',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.save': '保存',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',

    // Login/Auth
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.email': '邮箱地址',
    'auth.password': '密码',
    'auth.loggingIn': '正在登录...',
    'auth.resetLink': '重置链接已发送',
    'auth.resetMessage': '如果该邮箱已有账户，您将收到密码重置链接。',

    // Footer
    'footer.copyright': '© {year} Voluntas Long-term Capital',
    'footer.disclaimer': '本网站由 Voluntas Long-term Capital 拥有并负责运营，Voluntas Long-term Capital 为一家总部设于香港的财富管理顾问公司。我们的服务仅限提供予在香港的投资者，美国人士（U.S. Persons）不在本服务范围内。',
    'footer.returns': '除非另有说明，所有回报数据仅为演示用途，不代表实际客户回报，也不构成未来表现的保证。',

    // Toast messages
    'toast.waitlistAdded': '已加入等候名单',
    'toast.waitlistMessage': '感谢您加入等候名单，我们将在上线时第一时间通知您。',
    'toast.messageSent': '信息已发送',
    'toast.messageResponse': '感谢您的联系，我们的顾问将尽快与您联系。',
  }
};
