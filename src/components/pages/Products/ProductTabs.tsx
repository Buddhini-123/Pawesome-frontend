interface ProductTabsProps {
  product: {
    description?: string;
  };
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-fredoka font-bold text-charcoal mb-4">Description</h2>
      {product.description ? (
        <div
          className="text-charcoal text-sm font-fredoka leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      ) : (
        <p className="text-gray-500 text-sm font-fredoka italic">
          No description available for this product.
        </p>
      )}
    </div>
  );
};

export default ProductTabs;
