import React from 'react';

const FooterColumns: React.FC = () => {
  const columns = [
    {
      title: '🛍️ Shop by Pet',
      items: [
        { text: 'Dogs', icon: '🐕' },
        { text: 'Cats', icon: '🐱' },
        { text: 'Birds', icon: '🦜' },
        { text: 'Fish', icon: '🐠' },
        { text: 'Small Pets', icon: '🐹' },
        { text: 'Exotic Pets', icon: '🐰' }
      ]
    },
    {
      title: '🎁 Services',
      items: [
        { text: 'Pet Subscriptions', icon: null },
        { text: 'Gift Boxes', icon: null },
        { text: 'Loyalty Rewards', icon: null },
        { text: 'Vet Consultations', icon: null },
        { text: 'Grooming Services', icon: null },
        { text: 'Pet Insurance', icon: null }
      ]
    },
    {
      title: '💙 Support',
      items: [
        { text: '24/7 Help Center', icon: null },
        { text: 'Track Order', icon: null },
        { text: 'Shipping Info', icon: null },
        { text: 'Returns & Refunds', icon: null },
        { text: 'Size Guide', icon: null },
        { text: 'FAQs', icon: null }
      ]
    },
    {
      title: '🏠 Company',
      items: [
        { text: 'About Us', icon: null },
        { text: 'Careers', icon: null },
        { text: 'Press & Media', icon: null },
        { text: 'Pet Blog', icon: null },
        { text: 'Sustainability', icon: null },
        { text: 'Contact Us', icon: null }
      ]
    }
  ];

  return (
    <section className="px-20 py-12 max-md:px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {columns.map((column, index) => (
          <div key={index} className="space-y-4">
            <h3 className="font-fredoka font-bold text-xl text-white mb-4">
              {column.title}
            </h3>
            <ul className="space-y-2">
              {column.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <a 
                    href="#" 
                    className="text-white/80 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    {item.icon && <span className="inline mr-2">{item.icon}</span>}
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {item.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FooterColumns;
