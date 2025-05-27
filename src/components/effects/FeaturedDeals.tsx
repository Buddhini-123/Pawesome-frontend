const FeaturedDeals = () => {
  const deals = [
    {
      id: 1,
      title: "THE BEST FOOD FOR YOUR DOG",
      subtitle: "Premium dog food made with love",
      buttonText: "SEE OFFER",
      image: "/lovable-uploads/2a9d233f-95e9-4c04-b160-63e9bf8eea8b.png"
    },
    {
      id: 2,
      title: "THE BEST FOOD FOR YOUR DOG",
      subtitle: "Premium dog food made with love",
      buttonText: "SEE OFFER",
      image: "/lovable-uploads/2a9d233f-95e9-4c04-b160-63e9bf8eea8b.png"
    },
    {
      id: 3,
      title: "THE BEST FOOD FOR YOUR DOG",
      subtitle: "Premium dog food made with love",
      buttonText: "SEE OFFER",
      image: "/lovable-uploads/2a9d233f-95e9-4c04-b160-63e9bf8eea8b.png"
    }
  ];

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <a href="#" className="text-blue-600 underline font-medium hover:text-blue-800">
          View all Deals
        </a>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div key={deal.id} className="relative bg-gradient-to-r from-orange-400 to-blue-400 rounded-2xl overflow-hidden h-64">
            {/* Background decorative circles */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-blue-600 rounded-full opacity-80"></div>
            <div className="absolute top-8 right-8 w-8 h-8 bg-blue-500 rounded-full opacity-60"></div>
            <div className="absolute bottom-4 right-12 w-12 h-12 bg-blue-500 rounded-full opacity-40"></div>

            {/* Paw print icon */}
            <div className="absolute top-4 left-4 w-8 h-8 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19A2 2 0 0 0 5 21H11V19H5V3H13V9H21Z"/>
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-xl mb-2 leading-tight">
                  {deal.title}
                </h3>
                <p className="text-white text-sm opacity-90 mb-4">
                  {deal.subtitle}
                </p>
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors w-fit">
                {deal.buttonText}
              </button>
            </div>

            {/* Dog Food Text Overlay */}
            <div className="absolute bottom-6 right-6 text-white font-bold text-4xl opacity-30">
              DOG<br/>FOOD
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FeaturedDeals;