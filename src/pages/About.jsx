import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/common/Heading';

export default function About() {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.calcmymoney.co.uk';
  const breadcrumbJson = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${origin}/About` },
    ],
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJson)}</script>
      <div className="bg-background">
        <div className="bg-hero border-b border-border/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <Heading as="h1" size="h1" weight="bold" underline className="text-hero-foreground">
              About Calculate My Money
            </Heading>
            <p className="lead text-muted-foreground max-w-3xl mx-auto mt-3">
              Who we are and how we build accurate, transparent UK financial calculators.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-muted-foreground">
          <Card>
            <CardHeader>
              <CardTitle className="heading-3 text-card-foreground">Mission</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p>
                Our mission is simple: to make UK money calculations clear, accurate, and accessible
                for everyone. Whether you’re checking your take-home pay, planning a mortgage, or
                projecting savings, we want you to have fast, reliable tools that reflect the latest
                rules.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="heading-3 text-card-foreground">Who We Are</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p>
                We are a team of financial experts and IT specialists who are passionate about
                building transparent, trustworthy, and user-friendly tools. Each calculator is
                designed with a balance of financial expertise and technical precision to ensure
                accuracy, clarity, and ease of use.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="heading-3 text-card-foreground">Our Approach</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Accuracy first</strong> – always based on HMRC and Bank of England sources
                </li>
                <li>
                  <strong>Regular updates</strong> – new thresholds integrated promptly
                </li>
                <li>
                  <strong>Transparency</strong> – clear assumptions and disclaimers on every
                  calculator
                </li>
                <li>
                  <strong>Accessibility</strong> – free and mobile-friendly for everyone in the UK
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="heading-3 text-card-foreground">Contact</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p>For questions, corrections, or feedback, please email:</p>
              <p className="mt-2">
                📧{' '}
                <a
                  href="mailto:support@calcmymoney.co.uk"
                  className="text-primary hover:underline"
                >
                  support@calcmymoney.co.uk
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
