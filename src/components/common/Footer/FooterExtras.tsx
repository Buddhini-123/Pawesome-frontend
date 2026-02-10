import React from 'react';
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
} from 'lucide-react';
import visaImg from './images/visa.png';
import mastercardImg from './images/mastercard.png';
import dhlImg from './images/dhl.png';
import sslImg from './images/ssl.webp';
import googlePlayImg from './images/google-play.webp';
import appStoreImg from './images/app-store.webp';

const FooterExtras: React.FC = () => {
    return (
        <div className="bg-soft-gray py-12 border-t border-light-gray">
            {/* Top row: social icons / app badges */}
            <div className="container mx-auto flex flex-wrap items-center justify-between mb-8 px-4">
                {/* Social icons */}
                <div className="flex space-x-6">
                    <a href="#" aria-label="Facebook" className="group">
                        <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-primary-blue group-hover:scale-110">
                            <Facebook className="w-5 h-5 text-primary-blue group-hover:text-white" />
                        </div>
                    </a>
                    <a href="#" aria-label="Instagram" className="group">
                        <div className="w-12 h-12 bg-vibrant-orange/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-vibrant-orange group-hover:scale-110">
                            <Instagram className="w-5 h-5 text-vibrant-orange group-hover:text-white" />
                        </div>
                    </a>
                    <a href="#" aria-label="X (Twitter)" className="group">
                        <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-primary-blue group-hover:scale-110">
                            <Twitter className="w-5 h-5 text-primary-blue group-hover:text-white" />
                        </div>
                    </a>
                    <a href="#" aria-label="YouTube" className="group">
                        <div className="w-12 h-12 bg-crimson/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-crimson group-hover:scale-110">
                            <Youtube className="w-5 h-5 text-crimson group-hover:text-white" />
                        </div>
                    </a>
                </div>

                {/* App store badges */}
                <div className="flex space-x-4 mt-6 sm:mt-0">
                    <a href="#" aria-label="Get it on Google Play" className="transform hover:scale-105 transition-transform duration-300">
                        <img src={googlePlayImg} alt="Google Play Store" className="h-12 rounded-lg shadow-md" />
                    </a>
                    <a href="#" aria-label="Download on the App Store" className="transform hover:scale-105 transition-transform duration-300">
                        <img src={appStoreImg} alt="Apple App Store" className="h-12 rounded-lg shadow-md" />
                    </a>
                </div>
            </div>

            {/* Bottom row: payment / delivery / secure */}
            <div className="container mx-auto flex flex-wrap items-start md:items-center justify-between space-y-6 md:space-y-0 px-4">
                <div className="flex flex-wrap gap-8 md:gap-12">
                    {/* Payment methods */}
                    <div>
                        <h3 className="text-charcoal font-fredoka font-semibold mb-3">💳 Payment Methods</h3>
                        <div className="flex gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <img src={visaImg} alt="Visa" className="h-8" />
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <img src={mastercardImg} alt="Mastercard" className="h-8" />
                            </div>
                        </div>
                    </div>
                    {/* Delivery services */}
                    <div>
                        <h3 className="text-charcoal font-fredoka font-semibold mb-3">🚚 Fast Delivery</h3>
                        <div className="bg-white p-2 rounded-lg shadow-sm inline-block">
                            <img src={dhlImg} alt="DHL" className="h-8" />
                        </div>
                    </div>
                    {/* Secure payment */}
                    <div>
                        <h3 className="text-charcoal font-fredoka font-semibold mb-3">🔒 100% Secure</h3>
                        <div className="bg-white p-2 rounded-lg shadow-sm inline-block">
                            <img src={sslImg} alt="SSL Encryption" className="h-8" />
                        </div>
                    </div>
                </div>
                
                {/* Copyright */}
                <div className="mt-6 md:mt-0 text-center md:text-right">
                    <p className="text-medium-gray flex items-center justify-center md:justify-end">
                        Made with <span className="text-crimson mx-1 animate-pulse">❤️</span> for pets 
                        <span className="text-primary-blue ml-2">🐾</span>
                    </p>
                    <p className="text-sm text-medium-gray mt-2">
                        © 2026 Pawsome. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FooterExtras;