
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ukCities, createSlug } from '../components/data/seo-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Users, TrendingUp, Home, Utensils, Bus } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

const costOfLivingFAQs = [
    {
        question: "Where does this cost of living data come from?",
        answer: "The information on this page, particularly the Rent Index, is based on aggregated public data and rental market statistics. It is designed to provide a relative comparison between cities and should be used as a general guide. Actual costs will vary based on neighborhood, property type, and lifestyle."
    },
    {
        question: "What does the 'Rent Index' mean?",
        answer: "The Rent Index is a comparative score where London is set as the baseline (100). A city with a rent index of 70 means, on average, rental prices are about 30% cheaper than in London. It is a useful tool for quickly comparing housing affordability."
    },
    {
        question: "How can I create a budget for moving to this city?",
        answer: "That's a great next step! Once you have an idea of the relative costs, you can use our free Budget Planner tool to input your expected income and expenses to create a detailed personal budget."
    }
];

export default function CostOfLivingPage() {
    const location = useLocation();
    const city = useMemo(() => {
        const urlParams = new URLSearchParams(location.search);
        const slug = urlParams.get('slug');
        return ukCities.find(c => createSlug(c.name) === slug);
    }, [location.search]);

    if (!city) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">City Not Found</h1>
                <p className="text-gray-600">The city you're looking for could not be found.</p>
                <Link to={createPageUrl("CostOfLiving")} className="mt-4 inline-block text-blue-600 hover:underline">
                    &larr; Back to Cost of Living Explorer
                </Link>
            </div>
        );
    }
    
    const relatedCities = ukCities.filter(
        c => c.region === city.region && c.name !== city.name
    ).slice(0, 4);

    return (
        <div className="bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <div className="mb-6">
                    <Link to={createPageUrl("CostOfLiving")} className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to All Cities
                    </Link>
                </div>
                
                <Card className="bg-white shadow-lg">
                    <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-2">{city.region}</Badge>
                        <CardTitle className="text-3xl font-extrabold text-gray-900">Cost of Living in {city.name}</CardTitle>
                        <p className="text-lg text-gray-600">{city.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-4 text-center">
                             <div className="p-4 bg-green-50 rounded-lg">
                                <Users className="w-8 h-8 mx-auto text-green-700 mb-2"/>
                                <p className="text-sm text-green-800">Population</p>
                                <p className="text-2xl font-bold text-green-900">{city.population}</p>
                            </div>
                             <div className="p-4 bg-purple-50 rounded-lg">
                                <TrendingUp className="w-8 h-8 mx-auto text-purple-700 mb-2"/>
                                <p className="text-sm text-purple-800">Rent Index vs London</p>
                                <p className="text-2xl font-bold text-purple-900">{city.rentIndex}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">Cost Breakdown</h3>
                            <p className="text-gray-700 mb-4">
                                The cost of living in {city.name} is an important factor for anyone considering moving to the area for work or study. While this data provides a general comparison, actual costs can vary significantly based on lifestyle, accommodation choices, and personal spending habits.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg">
                                    <Home className="w-6 h-6 text-gray-700 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold">Housing</h4>
                                        <p className="text-sm text-gray-600">Rental prices are a primary driver of cost differences. {city.name} has a rent index of {city.rentIndex}, meaning on average, rents are about {100-city.rentIndex}% lower than in London.</p>
                                    </div>
                                </div>
                                 <div className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg">
                                    <Utensils className="w-6 h-6 text-gray-700 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold">Food & Groceries</h4>
                                        <p className="text-sm text-gray-600">The cost of groceries and dining out is generally more consistent across the UK but tends to be higher in larger city centres, especially London.</p>
                                    </div>
                                </div>
                                 <div className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg">
                                    <Bus className="w-6 h-6 text-gray-700 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold">Transportation</h4>
                                        <p className="text-sm text-gray-600">Public transport costs vary widely between cities. Major metropolitan areas like London have extensive but expensive networks, while other cities may have more affordable but less comprehensive options.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">Other Cities in {city.region}</h3>
                             <div className="space-y-2">
                                {relatedCities.length > 0 ? relatedCities.map(relatedCity => (
                                    <Link to={createPageUrl(`CostOfLivingPage?slug=${createSlug(relatedCity.name)}`)} key={relatedCity.name} className="block p-3 bg-white border rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-blue-700">{relatedCity.name}</span>
                                            <span className="font-semibold text-gray-800">Rent Index: {relatedCity.rentIndex}</span>
                                        </div>
                                    </Link>
                                )) : <p className="text-gray-600">No other cities listed in this region.</p>}
                            </div>
                        </div>

                        <div>
                             <h3 className="text-xl font-bold mb-4">Plan Your Budget</h3>
                             <Card className="bg-orange-50 border-orange-200">
                                <CardContent className="p-6">
                                     <p className="text-orange-800 mb-4">Moving to {city.name}? Make sure you have a solid financial plan. Use our free budget planner to estimate your monthly income and expenses and see how much you can save.</p>
                                    <Link to={createPageUrl("BudgetCalculator")}>
                                        <Button className="bg-orange-600 hover:bg-orange-700">
                                            Open Budget Planner
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="pt-8 border-t">
                            <FAQSection faqs={costOfLivingFAQs} title="About This Cost Data" />
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
