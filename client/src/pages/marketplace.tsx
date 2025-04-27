import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";

// Types
type Product = {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  category: string;
  imageUrl: string;
  location: string;
  minimumOrder: string;
  isVerified: boolean;
};

type Category = {
  id: string;
  name: string;
};

// Categories data
const categories: Category[] = [
  { id: "all", name: "All Categories" },
  { id: "agriculture", name: "Agriculture" },
  { id: "textiles", name: "Textiles" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "services", name: "Services" },
  { id: "technology", name: "Technology" },
];

// Products data
const products: Product[] = [
  {
    id: "prod-001",
    name: "Premium Coffee Beans",
    price: 12.50,
    currency: "USD",
    description: "High-quality Arabica coffee beans from Ethiopia, organic certified.",
    category: "agriculture",
    imageUrl: "https://images.unsplash.com/photo-1607662589561-29eb2e808b8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    location: "Ethiopia",
    minimumOrder: "100kg",
    isVerified: true
  },
  {
    id: "prod-002",
    name: "Handwoven Textiles",
    price: 8.75,
    currency: "USD",
    description: "Traditional hand-woven cotton textiles, perfect for fashion and home decor.",
    category: "textiles",
    imageUrl: "https://images.unsplash.com/photo-1629912617426-af99c2c10812?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    location: "Ghana",
    minimumOrder: "50m²",
    isVerified: true
  },
  {
    id: "prod-003",
    name: "Organic Shea Butter",
    price: 22.00,
    currency: "USD",
    description: "Raw, unrefined shea butter for cosmetics and skincare products.",
    category: "manufacturing",
    imageUrl: "https://images.unsplash.com/photo-1606041011872-596597976b25?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    location: "Nigeria",
    minimumOrder: "25kg",
    isVerified: true
  },
  {
    id: "prod-004",
    name: "African Art Prints",
    price: 35.00,
    currency: "USD",
    description: "Authentic African-inspired art prints for home and office decoration.",
    category: "manufacturing",
    imageUrl: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    location: "Kenya",
    minimumOrder: "10 prints",
    isVerified: false
  },
  {
    id: "prod-005",
    name: "Mobile App Development",
    price: 2500.00,
    currency: "USD",
    description: "Custom mobile application development services for businesses.",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    location: "South Africa",
    minimumOrder: "1 project",
    isVerified: true
  },
  {
    id: "prod-006",
    name: "Consulting Services",
    price: 150.00,
    currency: "USD",
    description: "Business consulting services for African markets entry and growth.",
    category: "services",
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    location: "Multiple Countries",
    minimumOrder: "10 hours",
    isVerified: true
  }
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  
  const sectionRef = useRef<HTMLElement>(null);
  
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
  
  // Filter products based on category and search query
  useEffect(() => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);

  return (
    <section id="marketplace" className="mb-16 fade-in" ref={sectionRef}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-1">B2B Marketplace</h2>
          <p className="text-neutral-600">Discover products and services from verified suppliers</p>
        </div>
        <div className="mt-3 md:mt-0 flex items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <Input
              type="text"
              className="w-full pl-10 pr-4 py-2"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">search</span>
          </div>
          <Button variant="outline" className="p-2 bg-neutral-100 hover:bg-neutral-200 transition-all">
            <span className="material-icons">filter_list</span>
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-2" style={{ minWidth: "max-content" }}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={cn(
                "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all",
                category.id === selectedCategory
                  ? "bg-primary-500 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-xl shadow-card overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary-500 text-white text-xs font-medium">
                  {categories.find(c => c.id === product.category)?.name || product.category}
                </Badge>
              </div>
              {product.isVerified && (
                <div className="absolute top-3 right-3">
                  <Badge variant="verified" className="text-xs font-medium px-2 py-1 rounded-full flex items-center">
                    <span className="material-icons text-sm mr-1">verified</span> Verified
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-heading font-semibold text-lg">{product.name}</h3>
                <p className="font-bold text-primary-700">
                  {formatCurrency(product.price, product.currency)}/{product.minimumOrder.split(" ")[1] || "unit"}
                </p>
              </div>
              <p className="text-neutral-600 text-sm mb-3">{product.description}</p>
              <div className="flex items-center text-sm text-neutral-500 mb-3">
                <span className="material-icons text-sm mr-1">location_on</span>
                <span>{product.location}</span>
                <span className="mx-2">•</span>
                <span>Min. Order: {product.minimumOrder}</span>
              </div>
              <div className="flex mt-4 gap-2">
                <Button className="flex-1 bg-primary-500 hover:bg-primary-700 text-white font-medium py-2 rounded transition-all">
                  Contact Supplier
                </Button>
                <Button variant="outline" className="p-2 border border-neutral-200 rounded hover:bg-neutral-50 transition-all" aria-label="Add to Favorites">
                  <span className="material-icons text-neutral-400 hover:text-error">favorite_border</span>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <span className="material-icons text-5xl text-neutral-300 mb-4">search_off</span>
            <h3 className="text-lg font-medium text-neutral-700 mb-2">No products found</h3>
            <p className="text-neutral-500">Try adjusting your search or category filters</p>
          </div>
        )}
      </div>

      {filteredProducts.length > 0 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="inline-flex items-center px-6 py-3 bg-white border border-neutral-300 rounded-lg text-primary-500 font-medium hover:bg-neutral-50 transition-all">
            Load More Products <span className="material-icons ml-2">expand_more</span>
          </Button>
        </div>
      )}
    </section>
  );
}
