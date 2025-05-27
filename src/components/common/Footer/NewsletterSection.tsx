import React, { useState } from 'react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribing email:', email);
  };

  return (
    <section className="flex flex-wrap gap-5 justify-between items-start px-20 pt-5 w-full bg-stone-400 max-md:px-5 max-md:max-w-full">
      <div className="max-md:max-w-full">
        <h2 className="text-2xl font-bold text-white max-md:max-w-full">
          Don't miss out on our personalized discounts, special offers and our new arrivals
        </h2>
        <form
          onSubmit={handleSubscribe}
          className="flex flex-wrap gap-3 mt-4 max-w-full text-sm w-[576px]"
        >
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="grow shrink-0 px-4 py-5 font-medium text-gray-200 bg-white rounded-xl basis-0 w-fit max-md:pr-5"
            required
          />
          <button
            type="submit"
            className="grow shrink-0 px-14 py-5 font-bold text-center text-white whitespace-nowrap bg-amber-300 rounded-xl basis-0 w-fit max-md:px-5 hover:bg-amber-400 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/15f7c3a0cd0d3d89a1aad13e64ece685049fc91c?placeholderIfAbsent=true"
        alt="Newsletter decoration"
        className="object-contain shrink-0 max-w-full aspect-square w-[189px]"
      />
    </section>
  );
};

export default NewsletterSection;
