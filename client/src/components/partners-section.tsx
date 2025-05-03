import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  description: string;
}

// Partner data
const partnerData: Partner[] = [
  {
    id: "afcfta",
    name: "AfCFTA",
    logoUrl: "/assets/partners/afcfta-logo.png",
    website: "https://afcfta.au.int/",
    description: "African Continental Free Trade Area - Creating One African Market"
  },
  {
    id: "nigeria-afcfta",
    name: "Nigeria AfCFTA Coordination Office",
    logoUrl: "/assets/partners/nigeria-afcfta-logo.png",
    website: "https://afcfta.ng/",
    description: "Connecting Nigerian Businesses to Africa"
  },
  {
    id: "papss",
    name: "PAPSS",
    logoUrl: "https://papss.com/wp-content/uploads/2022/01/PAPSS-logo.png",
    website: "https://papss.com/",
    description: "Pan-African Payment and Settlement System"
  },
  {
    id: "afreximbank",
    name: "Afreximbank",
    logoUrl: "https://www.afreximbank.com/wp-content/uploads/2023/01/Afreximbank-Logo-1.png",
    website: "https://www.afreximbank.com/",
    description: "African Export-Import Bank"
  }
];

export function PartnersSection({ compact = false }: { compact?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (compact) {
    return (
      <div className="py-4">
        <h3 className="text-sm font-medium text-neutral-500 mb-4 text-center">Our Trusted Partners</h3>
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-6"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {partnerData.map((partner) => (
            <motion.a
              key={partner.id}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="grayscale hover:grayscale-0 transition-all duration-300 h-10 flex items-center"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="h-full w-auto object-contain"
              />
            </motion.a>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-2">Our Strategic Partners</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            We collaborate with leading organizations across Africa to facilitate seamless trade and financial services
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {partnerData.map((partner) => (
            <motion.div key={partner.id} variants={itemVariants}>
              <Card className="h-full hover:shadow-md transition-shadow duration-300 overflow-hidden group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 h-24 flex items-center justify-center bg-white rounded-md p-2">
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-lg mb-2 text-neutral-800">{partner.name}</h3>
                  <p className="text-sm text-neutral-600 mb-4 flex-grow">{partner.description}</p>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium flex items-center hover:underline"
                  >
                    Visit Website
                    <span className="material-icons text-sm ml-1">arrow_forward</span>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}