import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ProductTabs = () => {
  return (
    <div className="bg-white rounded-lg p-4">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-md p-1 h-8">
          <TabsTrigger 
            value="description" 
            className="rounded text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Description
          </TabsTrigger>
          <TabsTrigger 
            value="review" 
            className="rounded text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Review
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-4">
          <div className="space-y-3">
            <p className="text-gray-700 text-sm leading-relaxed">
              Pawsome Premium Chicken & Rice Dog Food is specially formulated to provide balanced nutrition for adult dogs of 
              all breeds. Made with high-quality chicken as the first ingredient and wholesome rice for easy digestion, this 
              formula supports strong muscles, healthy skin, and a shiny coat.
            </p>
            
            <p className="text-gray-700 text-sm leading-relaxed">
              Enriched with essential vitamins, minerals, and omega fatty acids, it ensures your furry friend gets the nutrients 
              they need for an active, happy life. Free from artificial colors, flavors, and preservatives.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="review" className="mt-4">
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">Customer reviews will be displayed here.</p>
            <p className="mt-1 text-xs">Be the first to review this product!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};