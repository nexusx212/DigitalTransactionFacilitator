import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Stats card animation variants
const statsCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    }
  })
};

export default function Dashboard() {
  // Use ref for observing sections for fade-in animation
  const fadeElementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Set up intersection observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    fadeElementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    
    return () => {
      fadeElementsRef.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Data for statistics section
  const stats = [
    { 
      id: 1, 
      title: "Trade Transactions", 
      value: 2400000, 
      currency: "USD", 
      growth: 12,
      isPositive: true 
    },
    { 
      id: 2, 
      title: "Active Businesses", 
      value: 342, 
      growth: 8,
      isPositive: true 
    },
    { 
      id: 3, 
      title: "Certifications", 
      value: 1200, 
      growth: 15,
      isPositive: true 
    },
    { 
      id: 4, 
      title: "Countries", 
      value: 26, 
      growth: 4,
      isPositive: true 
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-primary-500 text-white rounded-b-3xl overflow-hidden clip-path-wave mb-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-25 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-20 max-w-screen-xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <motion.h1 
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Digital Trade Finance System
              </motion.h1>
              <motion.p 
                className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                A cutting-edge platform connecting African businesses to global markets through simplified trade finance, robust marketplaces, and expert training.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <a href="/trade-finance" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                  Apply for Finance
                </a>
                <a href="/marketplace" className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                  Explore Marketplace
                </a>
                <a href="/training" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                  Start Training
                </a>
              </motion.div>
            </div>
            <div className="hidden lg:block lg:col-span-5">
              <motion.div 
                className="relative h-64 w-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg" style={{ top: '20%', left: '10%', transform: 'rotate(-5deg)' }}>
                  <div className="flex items-center gap-3 text-white">
                    <span className="material-icons">receipt_long</span>
                    <span className="font-medium">Smart Contract Financing</span>
                  </div>
                </div>
                <div className="absolute bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg" style={{ top: '50%', left: '30%', transform: 'rotate(3deg)' }}>
                  <div className="flex items-center gap-3 text-white">
                    <span className="material-icons">storefront</span>
                    <span className="font-medium">B2B Marketplace</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.id}
              className="bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl shadow-card hover:shadow-card-hover border border-gray-100"
              custom={index}
              initial="hidden"
              animate="visible"
              variants={statsCardVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
            >
              <h3 className="text-neutral-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-heading font-bold text-primary-700">
                {stat.currency 
                  ? formatCurrency(stat.value, stat.currency) 
                  : stat.value.toLocaleString()}
              </p>
              <p className={`text-sm flex items-center mt-1 ${stat.isPositive ? 'text-success' : 'text-error'}`}>
                <span className="material-icons text-sm mr-1">
                  {stat.isPositive ? 'arrow_upward' : 'arrow_downward'}
                </span> 
                {stat.growth}% growth
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature sections */}
      <section 
        ref={el => fadeElementsRef.current[0] = el as HTMLElement} 
        className="mb-12 fade-in"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-1">Our Digital Services</h2>
            <p className="text-neutral-600">Discover our comprehensive digital trade solutions</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-gray-100">
            <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="material-icons text-6xl text-white">receipt_long</span>
            </div>
            <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50">
              <h3 className="text-xl font-heading font-semibold mb-2">Smart Contract Trade Finance</h3>
              <p className="text-neutral-600 mb-4">Access instant financing through our smart contract approval system with minimal documentation.</p>
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-sm hover:from-blue-600 hover:to-blue-700">Quick Approvals</Badge>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-gray-100">
            <div className="h-40 bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center">
              <span className="material-icons text-6xl text-white">storefront</span>
            </div>
            <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50">
              <h3 className="text-xl font-heading font-semibold mb-2">B2B Marketplace</h3>
              <p className="text-neutral-600 mb-4">Connect with verified suppliers and buyers from across Africa and global markets.</p>
              <Badge className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold shadow-sm hover:from-indigo-600 hover:to-indigo-700">AI-Powered Search</Badge>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-gray-100">
            <div className="h-40 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="material-icons text-6xl text-white">school</span>
            </div>
            <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50">
              <h3 className="text-xl font-heading font-semibold mb-2">Trade Expertise Training</h3>
              <p className="text-neutral-600 mb-4">Build your export capabilities through our certified learning modules and resources.</p>
              <div className="flex items-center justify-between">
                <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-sm hover:from-purple-600 hover:to-purple-700">Certification Available</Badge>
                <a href="/training" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-md shadow transition-all">Start Training</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About DTFS */}
      <section 
        ref={el => fadeElementsRef.current[1] = el as HTMLElement} 
        className="mb-16 fade-in"
      >
        <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-card overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-4">About Digital Trade Finance System</h2>
            <p className="text-neutral-600 mb-6">
              DTFS is a progressive web application designed to revolutionize African trade through technology. 
              Our platform integrates multiple critical services for businesses looking to engage in cross-border trade.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-heading font-semibold mb-3 flex items-center">
                  <span className="material-icons text-primary-500 mr-2">verified</span> 
                  Key Features
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="material-icons text-success mr-2 mt-0.5">check_circle</span>
                    <span>Instant trade finance through smart contracts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-success mr-2 mt-0.5">check_circle</span>
                    <span>AI-powered marketplace with verified suppliers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-success mr-2 mt-0.5">check_circle</span>
                    <span>Digital wallet with PADC stablecoin support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-success mr-2 mt-0.5">check_circle</span>
                    <span>Interactive training modules with certification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-success mr-2 mt-0.5">check_circle</span>
                    <span>Multilingual support for pan-African businesses</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-heading font-semibold mb-3 flex items-center">
                  <span className="material-icons text-primary-500 mr-2">trending_up</span> 
                  Business Benefits
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="material-icons text-secondary-500 mr-2 mt-0.5">arrow_right</span>
                    <span>Reduced trade finance processing time by up to 80%</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-secondary-500 mr-2 mt-0.5">arrow_right</span>
                    <span>Access to over 5000+ verified buyers and suppliers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-secondary-500 mr-2 mt-0.5">arrow_right</span>
                    <span>Fast cross-border payments using PAPSS integration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-secondary-500 mr-2 mt-0.5">arrow_right</span>
                    <span>Enhanced export readiness through certified training</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-secondary-500 mr-2 mt-0.5">arrow_right</span>
                    <span>24/7 AI assistant support for trade questions</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="/trade-finance" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                Apply for Finance
              </a>
              <a href="/training" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                Start Training
              </a>
              <a href="#" className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-primary-700 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-all flex items-center">
                Learn More <span className="material-icons ml-1">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
