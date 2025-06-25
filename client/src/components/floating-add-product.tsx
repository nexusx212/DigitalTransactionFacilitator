import { useState } from 'react';
import { motion } from 'framer-motion';
import { AddProductDialog } from './add-product-dialog';
import { FloatingActionMenu } from '@/components/ui/floating-action-menu';
import { useAuth } from '@/context/auth-context';
import { useLocation } from 'wouter';

export function FloatingAddProduct() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Only show on marketplace and dashboard pages for authenticated users
  const shouldShow = user && (
    location === '/marketplace' || 
    location === '/' || 
    location === ''
  );

  if (!shouldShow) return null;

  const actions = [
    {
      id: 'add-product',
      icon: 'inventory_2',
      label: 'Add Product',
      color: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
      onClick: () => setIsDialogOpen(true)
    },
    {
      id: 'bulk-import',
      icon: 'upload_file',
      label: 'Bulk Import',
      color: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
      onClick: () => console.log('Bulk import clicked')
    },
    {
      id: 'manage-inventory',
      icon: 'manage_search',
      label: 'Manage Inventory',
      color: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
      onClick: () => window.location.href = '/marketplace?tab=my-products'
    }
  ];

  return (
    <>
      <motion.div
        className="fixed bottom-32 lg:bottom-20 left-6 z-50"
        initial={{ scale: 0, x: -100 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ delay: 1.5, type: "spring", damping: 20, stiffness: 300 }}
      >
        <FloatingActionMenu actions={actions} />
      </motion.div>

      <AddProductDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </>
  );
}