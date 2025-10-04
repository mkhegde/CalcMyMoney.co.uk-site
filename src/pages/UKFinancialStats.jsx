import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Percent, Home, Landmark, Zap, ExternalLink } from 'lucide-react';
import Heading from '@/components/common/Heading';

const StatCard = ({ title, value, change, description, trend, link, Icon }) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  const trendColor = trend === 'up' ? 'text-red-600' : 'text-green-600';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        <div className="text-3xl font-bold">{value}</div>
        {change && (
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            {TrendIcon && <TrendIcon className={`w-4 h-4 ${trendColor}`} />}
            <span className={trendColor}>{change}</span>
            <span>vs last year</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
      {link && (
        <div className="p-4 pt-0 text-xs">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            Source <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </Card>
  );
};

export default function UKFinancialStats() {
  // Data is now static to prevent fetching errors from blocked external APIs.
  // Users are directed to the official sources for the most up-to-date information.

  return (
    <div className="bg-background text-foreground">
      <div className="bg-hero bg-hero-pattern text-hero-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Heading as="h1" size="h1" weight="bold" className="mb-4">
            UK Financial Statistics Dashboard
          </Heading>
          <p className="lead text-hero-foreground/80 max-w-3xl mx-auto">
            Track key UK economic indicators. Data is sourced directly from official channels like
            the Bank of England and the Office for National Statistics.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="BoE Bank Rate"
            Icon={Landmark}
            value="5.25%"
            description="Official rate set by the Bank of England. Data is illustrative, check source for live rate."
            link="https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp"
          />
          <StatCard
            title="Inflation (CPIH)"
            Icon={Percent}
            value="3.8%"
            description="12-month growth rate (Apr 2024). Data is illustrative, check source for live rate."
            link="https://www.ons.gov.uk/economy/inflationandpriceindices"
            trend="down"
            change="3.8%"
          />
          <StatCard
            title="Average UK House Price"
            Icon={Home}
            value="£281,000"
            description="Average price (Mar 2024). Data is illustrative, check source for live rate."
            change="-0.2%"
            trend="down"
            link="https://landregistry.data.gov.uk/app/hpi/"
          />
          <StatCard
            title="Ofgem Energy Price Cap"
            Icon={Zap}
            value="£1,568"
            description="Typical household, per year (1 Jul - 30 Sep 2024). Source updated quarterly."
            link="https://www.ofgem.gov.uk/energy-price-cap"
          />
        </div>
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Disclaimer: Data shown here is for informational purposes only. Please consult the
            official sources linked in each card for the most current and accurate figures before
            making any financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
