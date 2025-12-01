import React from 'react';
import toastLogo from "../../assets/icons/toastLogo.svg";
import Button from '../Button/Button';
import Footer from '../Footer/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex justify-between items-center">
             <div className="flex justify-center items-center">
                  <div className="flex items-center space-x-2">
                    <a href="/" className="flex items-center space-x-2">
                    <img
                      src={toastLogo}
                      alt="Toast Logo"
                      className="w-8 h-8 md:w-10 md:h-10"
                    />
                    <h1 className="text-lg md:text-2xl font-semibold text-gray-900 whitespace-nowrap">
                      Get your toast
                    </h1>
                    </a>
                  </div>
                </div>
          <Button label="Subscribe Now" to="/subscribe" />
        </div>
      </nav>

      {/* Hero Section with Image */}
      <div className="relative h-96 lg:h-[500px] bg-neutral-100 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1721399154252-6772a4c76bbf?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          
  alt="Happy Morning"
  className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-12 pb-12">
          <div className="inline-block px-4 py-1.5 bg-yellow-400 text-neutral-900 text-sm font-medium mb-4">
            ABOUT US
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-neutral-900 leading-tight tracking-tight">
            Our Story
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 space-y-8">
            <p className="text-2xl lg:text-3xl text-neutral-900 leading-relaxed font-light">
              We built Get Your Toast to make mornings feel a little more human.
            </p>
            
            <p className="text-lg text-neutral-600 leading-relaxed">
              Most of us wake up, grab our phones, and scroll. We see hundreds of things before we've even fully opened our eyes. We wanted to change that.
            </p>

            <div className="pt-8 space-y-6">
              <p className="text-lg text-neutral-600 leading-relaxed">
                This isn't a productivity hack. This isn't another app. This isn't a dopamine trap. And it's definitely not endless scrolling.
              </p>
              
              <div className="border-l-4 border-yellow-400 pl-6 py-2">
                <p className="text-xl text-neutral-900 leading-relaxed font-medium">
                  It's one thoughtful message, sent every morning at 8 AM on WhatsApp, something to read before your day truly begins.
                </p>
              </div>
              
              <p className="text-lg text-neutral-600 leading-relaxed">
                Built by two brothers in India, it's personal, simple, and made for people we care about - so it works perfectly for anyone who wants a better start to their day.
              </p>
            </div>

            {/* Image in Content */}
            <div className="pt-8">
              <img 
                src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Person reading on phone with coffee"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          {/* Right Column - Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-50 p-8 border border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-500 mb-3 tracking-wide uppercase">What We Deliver</h3>
              <p className="text-2xl font-semibold text-neutral-900 mb-4">One message, every morning</p>
              <p className="text-neutral-600">No apps. No algorithms. No infinite feeds. Just a single, thoughtful message delivered to your WhatsApp at 8 AM.</p>
            </div>

            <div className="bg-yellow-400 p-8">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 tracking-wide uppercase">Our Philosophy</h3>
              <p className="text-lg text-neutral-900 leading-relaxed">
                Your morning shouldn't start with chaos. It should start with intention.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border border-neutral-200 p-6">
                <div className="text-4xl font-bold text-neutral-900 mb-2">8 AM</div>
                <p className="text-sm text-neutral-600">Daily delivery</p>
              </div>
              <div className="border border-neutral-200 p-6">
                <div className="text-4xl font-bold text-neutral-900 mb-2">0</div>
                <p className="text-sm text-neutral-600">Apps needed</p>
              </div>
            </div>

            {/* Small Image */}
            <div className="mt-8">
              <img 
                src="https://plus.unsplash.com/premium_photo-1663054391923-d5caaba60039?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Morning ritual"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section with Image Grid */}
      <div className="bg-neutral-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                Made for real people, real mornings
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                We're not trying to gamify your morning or make you more productive. We're just offering a moment of thoughtfulness before the chaos begins.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                No notifications throughout the day. No pressure to engage. Just one message, waiting for you when you're ready.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=500&fit=crop" 
                alt="Coffee cup"
                className="w-full h-64 object-cover"
              />
              <img 
                src="https://plus.unsplash.com/premium_photo-1661512552992-0c5b759d2b76?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Morning light"
                className="w-full h-64 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-neutral-900 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Just say yes to start your mornings better.
            </h2>
            <p className="text-lg text-neutral-400 mb-8">
              Join others who've chosen a more intentional way to begin their day.
            </p>
             <Button label="Subscribe Now" to="/subscribe" />
          </div>
        </div>
      </div>
<Footer />

    </div>
  );
}