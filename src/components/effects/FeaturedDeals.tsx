const FeaturedDeals = () => {
  const deals = [
    {
      id: 1,
      title: "THE BEST FOOD FOR YOUR DOG",
      subtitle: "Premium dog food made with love"
    },
    {
      id: 2,
      title: "THE BEST FOOD FOR YOUR DOG",
      subtitle: "Premium dog food made with love"
    },
    {
      id: 3,
      title: "THE BEST FOOD FOR YOUR DOG",
      subtitle: "Premium dog food made with love"
    }
  ];

  return (
    <div className="mb-8">
      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div key={deal.id} className="relative bg-gradient-to-r from-orange-400 to-blue-400 rounded-2xl overflow-hidden h-64">

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

              <button className="bg-calmblue text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors w-fit">
                See More
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
export default FeaturedDeals;