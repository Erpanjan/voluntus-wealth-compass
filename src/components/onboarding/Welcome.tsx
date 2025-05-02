
import React from 'react';
import { User, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Welcome = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6">Welcome to Valence Long-Term Capital</h1>
      
      <p className="text-lg mb-12 max-w-3xl mx-auto text-gray-600">
        We're excited to have you on board. Before we can begin delivering our personalized 
        financial services, we kindly ask you to complete a few important steps:
      </p>
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover hover:border-gray-200 relative overflow-hidden"
          variants={item}
        >
          <div className="absolute top-0 left-0 h-2 w-full bg-gray-300"></div>
          <div className="mb-8 flex flex-col items-center">
            <div className="bg-[#F1F1F1] p-4 rounded-full mb-5">
              <User className="h-7 w-7 text-black" />
            </div>
            <h3 className="text-xl font-semibold">Create Your Profile</h3>
          </div>
          <p className="text-gray-600">
            This is the first step. Tell us a bit about yourself so we can tailor your digital 
            experience throughout our service.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover hover:border-gray-200 relative overflow-hidden"
          variants={item}
        >
          <div className="absolute top-0 left-0 h-2 w-full bg-gray-300"></div>
          <div className="mb-8 flex flex-col items-center">
            <div className="bg-[#F1F1F1] p-4 rounded-full mb-5">
              <FileText className="h-7 w-7 text-black" />
            </div>
            <h3 className="text-xl font-semibold">Complete the Questionnaire</h3>
          </div>
          <p className="text-gray-600">
            Help us understand your financial circumstances and investment goals. This step is optional, 
            but it allows us to provide more relevant and meaningful advice.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover hover:border-gray-200 relative overflow-hidden"
          variants={item}
        >
          <div className="absolute top-0 left-0 h-2 w-full bg-gray-300"></div>
          <div className="mb-8 flex flex-col items-center">
            <div className="bg-[#F1F1F1] p-4 rounded-full mb-5">
              <Calendar className="h-7 w-7 text-black" />
            </div>
            <h3 className="text-xl font-semibold">Schedule a Consultation</h3>
          </div>
          <p className="text-gray-600">
            Book a session with one of our advisors. We'll have an in-depth conversation about your 
            financial situation and verify key details.
          </p>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="mt-14 text-lg text-gray-600 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <p>Once you've completed these steps, our team will review your application and follow up shortly.</p>
      </motion.div>
    </div>
  );
};

export default Welcome;
