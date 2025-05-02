import { TradeBadge, TradeBadgesGroup } from "@/components/badges";

export default function BadgesDemo() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Trade Badges</h1>
        <p className="text-muted-foreground mb-6">
          These badges are used to indicate various certifications, verifications, and achievements
          for businesses and sellers within the DTFS platform.
        </p>
      </div>
      
      {/* Individual badges */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Individual Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-4">
            <TradeBadge type="export-ready" />
            <span className="text-sm text-gray-500">Certified Export-Ready Business</span>
          </div>
          <div className="flex items-center space-x-4">
            <TradeBadge type="finance-approved" />
            <span className="text-sm text-gray-500">Trade Finance Approved</span>
          </div>
          <div className="flex items-center space-x-4">
            <TradeBadge type="cross-border" />
            <span className="text-sm text-gray-500">Cross-Border Seller</span>
          </div>
          <div className="flex items-center space-x-4">
            <TradeBadge type="afcfta-compliant" />
            <span className="text-sm text-gray-500">AfCFTA Compliant Trader</span>
          </div>
          <div className="flex items-center space-x-4">
            <TradeBadge type="top-seller" />
            <span className="text-sm text-gray-500">Marketplace Top Seller</span>
          </div>
          <div className="flex items-center space-x-4">
            <TradeBadge type="ava-verified" />
            <span className="text-sm text-gray-500">Ava AI Verified Profile</span>
          </div>
        </div>
      </div>
      
      {/* Badge sizes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Badge Sizes</h2>
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-4">
            <TradeBadge type="export-ready" size="sm" />
            <span className="text-sm text-gray-500">Small Size</span>
          </div>
          <div className="flex items-center space-x-4">
            <TradeBadge type="export-ready" size="default" />
            <span className="text-sm text-gray-500">Default Size</span>
          </div>
          <div className="flex items-center space-x-4">
            <TradeBadge type="export-ready" size="lg" />
            <span className="text-sm text-gray-500">Large Size</span>
          </div>
        </div>
      </div>
      
      {/* Badges group */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Badge Groups (User Profile Example)</h2>
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">SJ</div>
            <div>
              <h3 className="font-semibold">Sarah Johnson</h3>
              <p className="text-sm text-gray-500">Global Imports Ltd.</p>
            </div>
          </div>
          <TradeBadgesGroup 
            badges={['export-ready', 'finance-approved', 'cross-border', 'ava-verified']} 
          />
        </div>
      </div>
      
      {/* Marketplace example */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Marketplace Listing Example</h2>
        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-40 h-32 bg-gray-300 rounded-md flex items-center justify-center text-gray-600">
              Product Image
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Premium Coffee Beans - 5kg</h3>
              <p className="text-sm text-gray-600 mb-2">High-quality arabica coffee beans sourced directly from Ethiopian farms</p>
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold">$125.00 USD</span>
                <span className="text-sm text-gray-500">per bag</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <TradeBadge type="afcfta-compliant" size="sm" />
                <TradeBadge type="top-seller" size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}