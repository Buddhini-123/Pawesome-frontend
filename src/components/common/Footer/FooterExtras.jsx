// components/FooterBottom.jsx
import React from 'react'
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    //   Pinterest,
} from 'lucide-react'
import visaImg from './images/visa.png'
import mastercardImg from './images/mastercard.png'
import dhlImg from './images/dhl.png'
import sslImg from './images/ssl.webp'
import googlePlayImg from './images/google-play.webp'
import appStoreImg from './images/app-store.webp'

export default function FooterBottom() {
    return (
        <div className="bg-cream-white py-8">
            {/* Top row: social icons / app badges */}
            <div className="container mx-auto flex items-center justify-between mb-8">
                {/* Social icons */}
                <div className="flex space-x-4">
                    <a href="#" aria-label="Facebook">
                        <Facebook className="w-5 h-5 text-charcoal-gray hover:text-calm-blue" />
                    </a>
                    <a href="#" aria-label="Instagram">
                        <Instagram className="w-5 h-5 text-charcoal-gray hover:text-calm-blue" />
                    </a>
                    <a href="#" aria-label="X (Twitter)">
                        <Twitter className="w-5 h-5 text-charcoal-gray hover:text-calm-blue" />
                    </a>
                    <a href="#" aria-label="YouTube">
                        <Youtube className="w-5 h-5 text-charcoal-gray hover:text-calm-blue" />
                    </a>
                </div>

                {/* App store badges */}
                <div className="flex space-x-4">
                    <a href="#" aria-label="Get it on Google Play">
                        <img src={googlePlayImg} alt="Google Play Store" className="h-10" />
                    </a>
                    <a href="#" aria-label="Download on the App Store">
                        <img src={appStoreImg} alt="Apple App Store" className="h-10" />
                    </a>
                </div>
            </div>

            {/* Bottom row: payment / delivery / secure */}
            <div className="container mx-auto flex flex-row md:flex-row items-start md:items-center justify-between space-y-6 md:space-y-0"
            //   style={{ flexDirection:'row' }}
            >
                <div className="flex sm:flex-row items-start sm:items-center gap-6">
                    {/* Payment methods */}
                    <div className="flex items-center sm:flex-col">
                        <h3 className="text-charcoal-gray font-semibold">Payment methods</h3>
                        <div className="flex items-center sm:flex-row self-start self-start mt-2">
                            <img src={visaImg} alt="Visa" className="h-6" />
                            <img src={mastercardImg} alt="Mastercard" className="h-6" />
                        </div>
                    </div>
                    {/* Delivery services */}
                    <div className="flex items-center sm:flex-col">
                        <h3 className="text-charcoal-gray font-semibold">Delivery services</h3>
                        <div className="flex items-center sm:flex-row self-start self-start mt-2">
                            <img src={dhlImg} alt="DHL" className="h-6" />
                        </div>
                    </div>
                    {/* Secure payment */}
                    <div className="flex items-center sm:flex-col">
                        <h3 className="text-charcoal-gray font-semibold">Secure payment</h3>
                        <div className="flex items-center sm:flex-row self-start self-start mt-2">
                            <img src={sslImg} alt="SSL Encryption" className="h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
