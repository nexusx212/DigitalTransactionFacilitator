import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Types
type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  duration: string;
  hasCertificate: boolean;
};

// Training courses data
const trainingCourses: Course[] = [
  {
    id: "course-001",
    title: "Export Documentation Mastery",
    description: "Learn how to prepare and process all required export documents efficiently.",
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    level: "Beginner",
    progress: 65,
    duration: "4 hours",
    hasCertificate: true
  },
  {
    id: "course-002",
    title: "Customs Regulations & Compliance",
    description: "Navigate customs requirements across different African markets.",
    imageUrl: "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    level: "Intermediate",
    progress: 25,
    duration: "6 hours",
    hasCertificate: true
  },
  {
    id: "course-003",
    title: "Trade Finance Fundamentals",
    description: "Master the financial instruments that support international trade.",
    imageUrl: "https://images.unsplash.com/photo-1601933470096-0e34634ffcde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    level: "Advanced",
    progress: 0,
    duration: "8 hours",
    hasCertificate: true
  },
  {
    id: "course-004",
    title: "AfCFTA for Businesses",
    description: "Understanding and leveraging the African Continental Free Trade Area.",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    level: "Intermediate",
    progress: 12,
    duration: "5 hours",
    hasCertificate: true
  },
  {
    id: "course-005",
    title: "Digital Marketing for Exporters",
    description: "Build your online presence to attract global buyers.",
    imageUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    level: "Beginner",
    progress: 80,
    duration: "3 hours",
    hasCertificate: true
  },
  {
    id: "course-006",
    title: "Supply Chain Optimization",
    description: "Streamline your logistics for cost-effective international shipping.",
    imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    level: "Advanced",
    progress: 45,
    duration: "7 hours",
    hasCertificate: true
  }
];

export default function Training() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current?.classList.add("appear");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const scrollAmount = 350; // Approximate card width + gap
    const currentScroll = carouselRef.current.scrollLeft;
    
    if (direction === 'left') {
      carouselRef.current.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth'
      });
    } else {
      carouselRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const getLevelBadgeVariant = (level: Course['level']) => {
    switch (level) {
      case 'Beginner':
        return 'primary';
      case 'Intermediate':
        return 'secondary';
      case 'Advanced':
        return 'accent';
      default:
        return 'default';
    }
  };
  
  const getButtonText = (progress: number) => {
    if (progress === 0) return "Start Course";
    if (progress === 100) return "View Certificate";
    return "Continue Learning";
  };

  return (
    <section id="training" className="mb-16 fade-in" ref={sectionRef}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-1">Import/Export Training</h2>
          <p className="text-neutral-600">Interactive courses to build your trade expertise</p>
        </div>
        <a href="#" className="mt-3 md:mt-0 text-primary-500 hover:text-primary-700 font-medium flex items-center">
          View All Courses <span className="material-icons ml-1">arrow_forward</span>
        </a>
      </div>

      {/* Training Modules Carousel */}
      <div className="relative">
        <div 
          ref={carouselRef}
          className="overflow-x-auto scrollbar-hide pb-4"
        >
          <div className="flex space-x-6" style={{ minWidth: "max-content" }}>
            {trainingCourses.map((course, index) => (
              <motion.div
                key={course.id}
                className="bg-white rounded-xl shadow-card overflow-hidden w-80 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="relative">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge 
                      variant={getLevelBadgeVariant(course.level) as any} 
                      className="text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {course.level}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-neutral-600 text-sm mb-4">{course.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center text-sm text-neutral-500 mb-4">
                    <div className="flex items-center mr-4">
                      <span className="material-icons text-sm mr-1">schedule</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-icons text-sm mr-1">school</span>
                      <span>Certificate</span>
                    </div>
                  </div>
                  
                  <Button 
                    className={cn(
                      "w-full bg-primary-500 hover:bg-primary-700 text-white font-medium py-3 rounded transition-all",
                      course.progress === 100 && "bg-success hover:bg-success/90"
                    )}
                  >
                    {getButtonText(course.progress)}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 -ml-3 hidden lg:block" 
          aria-label="Previous"
          onClick={() => scrollCarousel('left')}
        >
          <span className="material-icons">chevron_left</span>
        </button>
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 -mr-3 hidden lg:block" 
          aria-label="Next"
          onClick={() => scrollCarousel('right')}
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
      
      {/* Training Benefits */}
      <div className="mt-12 bg-white rounded-xl shadow-card p-8">
        <h3 className="text-xl font-heading font-semibold mb-6">Why Take Our Trade Training Courses?</h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
              <span className="material-icons text-3xl text-primary-500">verified</span>
            </div>
            <h4 className="font-heading font-semibold text-lg mb-2">Certified Expertise</h4>
            <p className="text-neutral-600 text-sm">Earn industry-recognized certifications that enhance your business credibility with partners and customers.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center mb-4">
              <span className="material-icons text-3xl text-secondary-500">devices</span>
            </div>
            <h4 className="font-heading font-semibold text-lg mb-2">Learn Anywhere</h4>
            <p className="text-neutral-600 text-sm">Access course materials online or offline through our PWA on any device, continuing your learning even with limited connectivity.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-accent-500/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-icons text-3xl text-accent-500">public</span>
            </div>
            <h4 className="font-heading font-semibold text-lg mb-2">Global Standards</h4>
            <p className="text-neutral-600 text-sm">Learn international best practices that ensure your business meets global trade standards and requirements.</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button className="bg-primary-500 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-lg shadow-button transition-all">
            Explore All Training Programs
          </Button>
        </div>
      </div>
    </section>
  );
}
