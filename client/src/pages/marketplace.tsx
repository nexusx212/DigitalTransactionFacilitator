import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
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

// Product Card Component
const ProductCard = ({ product, categories }: { product: Product, categories: Category[] }) => {
  const categoryName = categories.find(c => c.id === product.category)?.name || 'Other';
  
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-blue-600 text-white text-xs font-semibold">
            {categoryName}
          </Badge>
        </div>
        {product.isVerified && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="text-xs font-medium px-2 py-1 rounded-full flex items-center bg-green-100 text-green-800">
              <span className="material-icons text-sm mr-1">verified</span> Verified
            </Badge>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
          <p className="font-bold text-blue-600">
            {formatCurrency(product.price, product.currency)}
          </p>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="material-icons text-sm mr-1">location_on</span>
          <span>{product.location}</span>
          <span className="mx-2">•</span>
          <span>Min. Order: {product.minimumOrder}</span>
        </div>
        <div className="flex mt-4 gap-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium">
            Contact Supplier
          </Button>
          <Button variant="outline" className="p-2" aria-label="Add to Favorites">
            <span className="material-icons text-gray-400">favorite_border</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
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
    ...(Array.isArray(categoriesData) ? categoriesData.map((cat: any) => ({ 
      id: cat.id.toString(), 
      name: cat.name 
    })) : [])
  ], [categoriesData]);

  // Transform database products to match component interface
  const transformedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return products.map((product: any) => ({
      id: product.id.toString(),
      name: product.name || 'Unnamed Product',
      price: parseFloat(product.price) || 0,
      currency: product.currency || 'USD',
      description: product.description || 'No description available',
      category: product.categoryId?.toString() || 'all',
      imageUrl: product.imageUrl || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center`,
      location: product.location || 'Location not specified',
      minimumOrder: product.minimumOrder || '1 unit',
      isVerified: product.isVerified || false
    }));
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = transformedProducts;
    
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
  }, [transformedProducts, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-semibold mb-4">
            <span className="material-icons text-sm">storefront</span>
            AfCFTA Marketplace
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Discover African Products
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with verified exporters and discover quality products from across the African continent
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search products, locations, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {(productsLoading || categoriesLoading) && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Loading products...</span>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!productsLoading && !categoriesLoading && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-gray-400 text-[48px]">inventory_2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">
                  {transformedProducts.length === 0 
                    ? "Be the first to add products! Use the Add Product button in the Exporter Dashboard."
                    : "Try adjusting your search criteria or browse different categories"
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} categories={categories} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}