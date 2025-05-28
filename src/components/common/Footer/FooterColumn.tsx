import React from 'react';

interface FooterColumnProps {
  title: string;
  items: string[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, items }) => {
  return (
    <nav className="flex flex-col items-start text-base font-medium text-neutral-700" >
      <h2 className="self-stretch text-xl font-bold text-neutral-700 text-left">
        {title}
      </h2>
      <ul className="w-full mt-6">
        {items.map((item, index) => (
          <li key={index} className="mt-3.5 first:mt-0 text-neutral-700 text-left" >
            <a href="#" className="hover:text-neutral-900 transition-colors">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FooterColumn;
