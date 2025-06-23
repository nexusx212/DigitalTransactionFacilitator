import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn, formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

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

export default function Marketplace() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name");

  // Fetch products from database
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  // Fetch categories from database
  const { data: categoriesData = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/product-categories"],
  });

  // Prepare categories with "All" option
  const categories = useMemo(() => [
    { id: "all", name: "All Categories" },
    ...(categoriesData.map((cat: any) => ({ id: cat.id.toString(), name: cat.name })) || [])
  ], [categoriesData]);

  // Transform database products to match component interface
  const transformedProducts = useMemo(() => {
    return products.map((product: any) => ({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.price),
      currency: product.currency,
      description: product.description,
      category: product.categoryId?.toString() || 'all',
      imageUrl: product.imageUrl || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center`,
      location: product.location,
      minimumOrder: product.minimumOrder,
      isVerified: product.isVerified
    }));
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = displayProducts;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.location.toLowerCase().includes(term)
      );
    }
    
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "location":
          return a.location.localeCompare(b.location);
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return filtered;
  }, [displayProducts, selectedCategory, searchTerm, sortBy]);
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

// Memoized category buttons component for better performance
const CategoryButtons = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: { 
  categories: Category[], 
  selectedCategory: string, 
  onSelectCategory: (id: string) => void 
}) => {
  return (
    <div className="mb-8 overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4 pb-2" style={{ minWidth: "max-content" }}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all shadow-sm",
              category.id === selectedCategory
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                : "bg-gradient-to-r from-gray-50 to-gray-100 text-neutral-700 hover:from-gray-100 hover:to-gray-200"
            )}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// Memoized product card for better performance
const ProductCard = ({ product, categories }: { product: Product, categories: Category[] }) => {
  return (
    <motion.div
      className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-card overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold shadow-sm">
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
      <div className="p-5 bg-gradient-to-b from-transparent to-gray-50">
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
          <Button className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-2 rounded shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5">
            Contact Supplier
          </Button>
          <Button variant="outline" className="p-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg shadow-sm hover:from-pink-50 hover:to-pink-100 hover:border-pink-200 transition-all" aria-label="Add to Favorites">
            <span className="material-icons text-neutral-400 hover:text-pink-500">favorite_border</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Custom hook for debouncing function calls
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Memoize products component for better performance
const MemoizedProductCard = React.memo(ProductCard);

// New product form data type
type ProductFormData = Omit<Product, 'id' | 'isVerified'> & { 
  minimumOrderQuantity: string;
  minimumOrderUnit: string;
};

export default function Marketplace() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState<ProductFormData>({
    name: "",
    price: 0,
    currency: "USD",
    description: "",
    category: "",
    imageUrl: "",
    location: "",
    minimumOrderQuantity: "",
    minimumOrderUnit: "",
    minimumOrder: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use debounced search value to avoid excessive re-renders
  const debouncedSearchQuery = useDebounce(searchInputValue, 300);
  
  const sectionRef = useRef<HTMLElement>(null);
  
  // Optimized intersection observer with cleanup
  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("appear");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  
  // Filter products based on category and search query - optimized with useMemo
  const memoizedFilteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (debouncedSearchQuery.trim() !== "") {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedCategory, debouncedSearchQuery]);
  
  // Update filtered products when memoized result changes
  useEffect(() => {
    setFilteredProducts(memoizedFilteredProducts);
  }, [memoizedFilteredProducts]);

  // Optimize expensive search function with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  };

  // Optimize category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

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
              value={searchInputValue}
              onChange={handleSearchChange}
            />
            <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">search</span>
          </div>
          <Button variant="outline" className="p-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200 rounded-lg shadow-sm transition-all">
            <span className="material-icons text-primary-600">filter_list</span>
          </Button>
          <Button 
            className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white" 
            onClick={() => setIsUploadModalOpen(true)}
          >
            <span className="material-icons">add</span>
            Add Product
          </Button>
        </div>
      </div>

      {/* Use the optimized category component */}
      <CategoryButtons 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleCategorySelect}
      />

      {/* Product Grid with virtualized rendering for better performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <MemoizedProductCard key={product.id} product={product} categories={categories} />
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
          <Button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
            Load More Products <span className="material-icons ml-2">expand_more</span>
          </Button>
        </div>
      )}
      
      {/* Product Upload Dialog */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">Add New Product</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input 
                  id="name" 
                  placeholder="Enter product name" 
                  value={productData.name}
                  onChange={e => setProductData({...productData, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01"
                    value={productData.price || ''}
                    onChange={e => setProductData({...productData, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={productData.currency}
                    onValueChange={value => setProductData({...productData, currency: value})}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="NGN">NGN</SelectItem>
                      <SelectItem value="KES">KES</SelectItem>
                      <SelectItem value="ZAR">ZAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your product in detail..." 
                rows={3}
                value={productData.description}
                onChange={e => setProductData({...productData, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={productData.category}
                  onValueChange={value => setProductData({...productData, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat.id !== "all").map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input 
                  id="location" 
                  placeholder="Country or region" 
                  value={productData.location}
                  onChange={e => setProductData({...productData, location: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="min-quantity">Min. Order Qty *</Label>
                  <Input 
                    id="min-quantity" 
                    placeholder="Quantity" 
                    value={productData.minimumOrderQuantity}
                    onChange={e => {
                      const newData = {
                        ...productData, 
                        minimumOrderQuantity: e.target.value,
                        minimumOrder: `${e.target.value}${productData.minimumOrderUnit ? productData.minimumOrderUnit : ''}`
                      };
                      setProductData(newData);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min-unit">Unit</Label>
                  <Select
                    value={productData.minimumOrderUnit}
                    onValueChange={value => {
                      const newData = {
                        ...productData, 
                        minimumOrderUnit: value,
                        minimumOrder: `${productData.minimumOrderQuantity}${value}`
                      };
                      setProductData(newData);
                    }}
                  >
                    <SelectTrigger id="min-unit">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="tons">tons</SelectItem>
                      <SelectItem value="pcs">pcs</SelectItem>
                      <SelectItem value="m²">m²</SelectItem>
                      <SelectItem value="units">units</SelectItem>
                      <SelectItem value="hours">hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div 
                  className="border-2 border-dashed border-neutral-300 rounded p-4 text-center hover:border-primary-500 transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    id="image" 
                    className="hidden" 
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // In a real app, we would upload the file to a server
                        // For now, we'll create a placeholder URL
                        setProductData({
                          ...productData, 
                          imageUrl: URL.createObjectURL(file)
                        });
                      }
                    }}
                  />
                  {productData.imageUrl ? (
                    <div className="relative w-full h-24">
                      <img 
                        src={productData.imageUrl} 
                        alt="Product preview" 
                        className="h-full mx-auto object-contain" 
                      />
                      <button 
                        type="button"
                        className="absolute top-0 right-0 bg-neutral-800/50 text-white rounded-full p-1 hover:bg-neutral-900/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductData({...productData, imageUrl: ""});
                        }}
                      >
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="material-icons text-3xl text-neutral-400">photo_camera</span>
                      <p className="text-sm text-neutral-500 mt-2">Click to upload image</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              disabled={isSubmitting || !productData.name || !productData.description || !productData.category || !productData.minimumOrderQuantity}
              onClick={() => {
                setIsSubmitting(true);
                
                // Simulate API call
                setTimeout(() => {
                  // Create a new product
                  const newProduct: Product = {
                    id: `prod-${Date.now()}`,
                    name: productData.name,
                    price: productData.price,
                    currency: productData.currency,
                    description: productData.description,
                    category: productData.category,
                    imageUrl: productData.imageUrl || "https://images.unsplash.com/photo-1603912699214-92627f304eb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", // Default placeholder
                    location: productData.location,
                    minimumOrder: `${productData.minimumOrderQuantity}${productData.minimumOrderUnit}`,
                    isVerified: false // New products start as unverified
                  };
                  
                  // Add to products list
                  const updatedProducts = [newProduct, ...products];
                  
                  // Update products and filtered products
                  // In a real app, this would be handled by a proper state management system
                  // Here we're directly modifying the static array which is not ideal
                  // but works for demonstration purposes
                  (products as Product[]).unshift(newProduct);
                  setFilteredProducts([newProduct, ...filteredProducts]);
                  
                  // Reset form and close modal
                  setProductData({
                    name: "",
                    price: 0,
                    currency: "USD",
                    description: "",
                    category: "",
                    imageUrl: "",
                    location: "",
                    minimumOrderQuantity: "",
                    minimumOrderUnit: "",
                    minimumOrder: ""
                  });
                  
                  setIsSubmitting(false);
                  setIsUploadModalOpen(false);
                  
                  toast({
                    title: "Product Added Successfully",
                    description: "Your product has been listed on the marketplace.",
                  });
                }, 1500);
              }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">
                    <span className="material-icons">refresh</span>
                  </span>
                  Submitting...
                </>
              ) : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
