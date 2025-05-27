import React from 'react';
import NewsletterSection from './NewsletterSection.tsx';
import FooterColumns from './FooterColumns.tsx';

const Footer: React.FC = () => {
  return (
    <footer className="overflow-hidden bg-white">
      <NewsletterSection />
      <FooterColumns />
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/dce8dd2c0c7636a6f2abca161a001791c5a6d996?placeholderIfAbsent=true"
        alt="Footer decoration"
        className="object-contain mt-6 w-full aspect-[6.06] max-md:max-w-full"
      />
    </footer>
  );
};

export default Footer;
