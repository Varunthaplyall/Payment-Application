import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'

const Home = () => {
  const features = [
    {
      title: "Fast Payments",
      description: "Send money instantly, anywhere"
    },
    {
      title: "Secure",
      description: "Bank-level encryption"
    },
    {
      title: "Simple",
      description: "No hidden fees or complications"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-50 flex flex-col">
     
      <main className="flex-grow ">
       
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-24 pb-16">
          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-normal text-gray-900">
              Modern way to
              <span className="block text-blue-600">handle money.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-lg">
              Send, receive, and manage your money with a simple, secure payment platform.
            </p>
            <div className="flex gap-4">
              <button className="group px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                Get Started
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

     
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 border-t border-gray-100">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="hover:translate-y-[-4px] transition-transform duration-200 cursor-pointer"
              >
                <h3 className="text-lg sm:text-xl font-medium">{feature.title}</h3>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl text-center sm:text-left">Ready to start?</h2>
              <p className="text-gray-600 mt-2 text-center sm:text-left">Set up your account in minutes.</p>
            </div>
            <Link 
            to={'/register'}
            className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
              Create Account
            </Link>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">© 2024 PayApp</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
