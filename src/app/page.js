import React from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart2, Leaf, CreditCard } from 'lucide-react';

const FeatureCard = ({ href, title, description, icon: Icon, color }) => (
  <Link href={href} className={`group block bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl border border-${color}-200 hover:border-${color}-400 hover:scale-105`}>
    <div className="transition-transform duration-300 group-hover:translate-y-[-5px]">
      <Icon className={`w-12 h-12 mb-4 text-${color}-500`} />
      <h3 className={`text-xl font-bold mb-2 text-${color}-700`}>{title}</h3>
      <p className={`text-${color}-600 mb-4`}>{description}</p>
      <div className={`flex items-center text-${color}-500 font-semibold group-hover:translate-x-2 transition-transform duration-300`}>
        Learn More <ArrowRight className="ml-2 w-4 h-4" />
      </div>
    </div>
  </Link>
);

export default function MineZero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-8 text-center animate-fade-in-down">
        MineZero
      </h1>
      <p className="text-xl text-gray-700 text-center mb-12 max-w-2xl animate-fade-in">
        Revolutionizing carbon footprint management for coal mines. Choose a feature to start your journey towards sustainability.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard
          href="/emissions"
          title="Estimate Emissions"
          description="Calculate and track your carbon footprint with precision."
          icon={BarChart2}
          color="green"
        />
        <FeatureCard
          href="/carbon-neutrality"
          title="Neutrality Pathways"
          description="Discover strategies to achieve carbon neutrality."
          icon={Leaf}
          color="yellow"
        />
        <FeatureCard
          href="/carbon-credits"
          title="Carbon Credits"
          description="Navigate the world of carbon credit trading."
          icon={CreditCard}
          color="blue"
        />
      </div>
    </div>
  );
}