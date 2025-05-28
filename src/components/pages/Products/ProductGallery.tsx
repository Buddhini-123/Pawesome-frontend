interface ProductGalleryProps {
  images: string[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

export const ProductGallery = ({ images, selectedImage, onImageSelect }: ProductGalleryProps) => {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-white rounded-lg p-6 border">
        <img
          src={images[selectedImage]}
          alt="Pedigree Dog Food"
          className="w-full h-64 object-contain"
        />
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index)}
            className={`bg-white border rounded-lg p-2 transition-all ${
              selectedImage === index
                ? "border-orange-400"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={image}
              alt={`Product view ${index + 1}`}
              className="w-full h-12 object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
};