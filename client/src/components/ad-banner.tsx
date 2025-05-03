import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AdBannerProps {
  type: "sidebar" | "horizontal" | "popup";
  position?: "top" | "bottom";
  className?: string;
}

// Mock ad data - in a real app, these would come from an ad server
const adData = [
  {
    id: "ad1",
    title: "Expand Your Business Across Africa",
    description: "Leverage the AfCFTA to reach new markets and grow your business",
    cta: "Learn More",
    imageUrl: "/assets/partners/afcfta-logo.png",
    linkUrl: "https://afcfta.au.int/"
  },
  {
    id: "ad2",
    title: "Seamless Cross-Border Payments",
    description: "Fast, secure transactions across African currencies",
    cta: "Get Started",
    imageUrl: "https://papss.com/wp-content/uploads/2022/01/PAPSS-logo.png",
    linkUrl: "https://papss.com/"
  },
  {
    id: "ad3",
    title: "Nigerian Export Financing",
    description: "Special rates for Nigerian businesses expanding to Africa",
    cta: "Apply Now",
    imageUrl: "/assets/partners/nigeria-afcfta-logo.png",
    linkUrl: "https://afcfta.ng/"
  }
];

export function AdBanner({ type, position = "bottom", className = "" }: AdBannerProps) {
  const [visible, setVisible] = useState(true);
  const [currentAd, setCurrentAd] = useState(adData[0]);
  
  // Rotate ads every 30 seconds
  useEffect(() => {
    if (!visible) return;
    
    const interval = setInterval(() => {
      const currentIndex = adData.findIndex(ad => ad.id === currentAd.id);
      const nextIndex = (currentIndex + 1) % adData.length;
      setCurrentAd(adData[nextIndex]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [currentAd, visible]);
  
  // Select a random ad on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * adData.length);
    setCurrentAd(adData[randomIndex]);
  }, []);
  
  if (!visible) return null;
  
  if (type === "popup") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{currentAd.title}</h3>
              <Button variant="ghost" size="icon" onClick={() => setVisible(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <img 
                src={currentAd.imageUrl} 
                alt={currentAd.title}
                className="w-24 h-24 object-contain"
              />
              <p className="text-neutral-600">{currentAd.description}</p>
            </div>
            <div className="flex justify-end">
              <a 
                href={currentAd.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-auto"
              >
                <Button className="w-full">
                  {currentAd.cta}
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (type === "sidebar") {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h4 className="text-xs uppercase tracking-wider text-neutral-500">Sponsored</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5" 
              onClick={() => setVisible(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="mt-3 text-center">
            <img 
              src={currentAd.imageUrl} 
              alt={currentAd.title}
              className="w-full h-24 object-contain mb-3"
            />
            <h3 className="text-sm font-medium mb-1">{currentAd.title}</h3>
            <p className="text-xs text-neutral-600 mb-3">{currentAd.description}</p>
            <a
              href={currentAd.linkUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
              >
                {currentAd.cta}
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Default to horizontal banner
  return (
    <div className={`bg-primary-50 ${position === "top" ? "rounded-b-lg" : "rounded-t-lg"} overflow-hidden ${className}`}>
      <div className="container mx-auto px-4">
        <div className="py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src={currentAd.imageUrl} 
              alt={currentAd.title}
              className="h-8 w-8 object-contain"
            />
            <div>
              <h4 className="text-sm font-medium">{currentAd.title}</h4>
              <p className="text-xs text-neutral-600 hidden sm:block">{currentAd.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={currentAd.linkUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                variant="default" 
                size="sm" 
                className="text-xs"
              >
                {currentAd.cta}
              </Button>
            </a>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => setVisible(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}