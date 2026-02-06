import React, { useState } from 'react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribing email:', email);
  };

  return (
    <section className="relative flex flex-wrap gap-5 justify-center items-center px-20 py-16 w-full bg-primary-blue overflow-hidden max-md:px-5 max-md:max-w-full">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute text-white/20 text-8xl rotate-45" style={{ top: '-20px', right: '100px' }}>🦪</span>
        <span className="absolute text-white/20 text-6xl" style={{ bottom: '20px', left: '50px' }}>🐾</span>
      </div>

      <div className="relative z-10 max-md:max-w-full mb-5 lg:mb-0">
        <h2 className="text-3xl font-fredoka font-bold text-white mb-2 max-md:max-w-full">
          🎉 Join the Pawsome Family!
        </h2>
        <p className="text-lg text-white/90 mb-6">
          Get exclusive deals, pet care tips, and be the first to know about new arrivals!
        </p>
        <form
          onSubmit={handleSubscribe}
          className="flex flex-wrap gap-3 max-w-full text-sm w-[576px]"
        >
          <div className="relative flex-grow">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full px-6 py-4 font-nunito font-medium text-charcoal bg-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-sunny-yellow/50 transition-all"
              required
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-blue/30">🐾</span>
          </div>
          <button
            type="submit"
            className="px-8 py-4 font-fredoka font-bold text-center text-white bg-sunny-yellow rounded-full shadow-lg hover:bg-warm-orange hover:scale-105 transition-all duration-300 btn-bounce flex items-center gap-2"
          >
            Subscribe <span className="text-sm">🐾</span>
          </button>
        </form>
      </div>
      
      {/* Cute Pet Illustration */}
      {/* <div className="hidden lg:block relative">
        <div className="w-48 h-48 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center animate-float">
          <span className="text-8xl">🐕</span>
        </div>
      </div> */}
    </section>
  );
};

export default NewsletterSection;
