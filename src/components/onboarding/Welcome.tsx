
import React from 'react';
import { User, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Welcome = () => {
  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  return <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-inter font-semibold mb-6">Welcome to Valence Long-Term Capital</h1>
      
      <p className="mb-12 max-w-3xl mx-auto text-gray-600 font-inter font-light text-sm">
        We're excited to have you on board. Before we can begin delivering our services, 
        we kindly ask you to complete a few important steps. Once you've completed these steps, 
        our team will review your application and follow up shortly.
      </p>
      
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12" variants={container} initial="hidden" animate="show">
        <motion.div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover hover:border-gray-200 relative overflow-hidden" variants={item}>
          <div className="absolute top-0 left-0 h-2 w-full bg-white"></div>
          <div className="mb-8 flex flex-col items-center">
            <div className="bg-[#F1F1F1] p-4 rounded-full mb-5">
              <User className="h-7 w-7 text-black" />
            </div>
            <h3 className="text-xl font-inter font-medium">Create Your Profile</h3>
          </div>
          <p className="text-gray-600 font-inter font-light">
            This is the first step. Tell us a bit about yourself so we can tailor your digital 
            experience throughout our service.
          </p>
        </motion.div>
        
        <motion.div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover hover:border-gray-200 relative overflow-hidden" variants={item}>
          <div className="absolute top-0 left-0 h-2 w-full bg-white"></div>
          <div className="mb-8 flex flex-col items-center">
            <div className="bg-[#F1F1F1] p-4 rounded-full mb-5">
              <FileText className="h-7 w-7 text-black" />
            </div>
            <h3 className="text-xl font-inter font-medium">Complete the Questionnaire</h3>
          </div>
          <p className="text-gray-600 font-inter font-light">
            This questionnaire will help us understand your financial circumstances. It is a mandatory step 
            before we offer the service; however, you can skip it and complete it during our consultation.
          </p>
        </motion.div>
        
        <motion.div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover hover:border-gray-200 relative overflow-hidden" variants={item}>
          <div className="absolute top-0 left-0 h-2 w-full bg-white"></div>
          <div className="mb-8 flex flex-col items-center">
            <div className="bg-[#F1F1F1] p-4 rounded-full mb-5">
              <Calendar className="h-7 w-7 text-black" />
            </div>
            <h3 className="text-xl font-inter font-medium">Schedule a Consultation</h3>
          </div>
          <p className="text-gray-600 font-inter font-light">
            Book a session with our advisor. Knowing your financial circumstances is central to what we do.
          </p>
        </motion.div>
      </motion.div>
    </div>;
};

export default Welcome;
