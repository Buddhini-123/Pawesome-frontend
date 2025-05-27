import React from 'react';
import FooterColumn from './FooterColumn.tsx';

const FooterColumns: React.FC = () => {
  const columns = [
    {
      title: 'Services',
      items: ['Pet Subscriptions', 'Gift Boxes', 'Vet Diet Plans', 'Emergency Care']
    },
    {
      title: 'Support',
      items: ['24/7 Help Center', 'Live Chat', 'Order Tracking', 'Return Policy']
    },
    {
      title: 'Company',
      items: ['About Pawsome', 'Careers', 'Press Release', 'Pet Blog']
    }
  ];

  return (
    <section className="mt-9 ml-20 max-w-full w-[574px]">
      <div className="flex gap-5 max-md:flex-col">
        {columns.map((column, index) => (
          <div
            key={index}
            className={`${
              index === 0 ? 'w-[27%]' : index === 1 ? 'w-[38%]' : 'w-[36%]'
            } max-md:ml-0 max-md:w-full`}
          >
            <FooterColumn title={column.title} items={column.items} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FooterColumns;
