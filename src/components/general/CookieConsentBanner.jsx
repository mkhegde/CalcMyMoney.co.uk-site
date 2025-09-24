
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cookie, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });
  // NEW: show a persistent "Cookie Settings" button for returning users
  const [showFloatingManage, setShowFloatingManage] = useState(false);

  useEffect(() => {
    // Support query param to reset consent for testing or when user wants to resurface the banner
    const url = new URL(window.location.href);
    const resetParam = url.searchParams.get('consent') === 'reset' || url.searchParams.get('cookie_reset') === '1';
    if (resetParam) {
      localStorage.removeItem('cookieConsent');
      localStorage.removeItem('cookiePreferences');
      setShowBanner(true);
      setShowFloatingManage(false);
      return;
    }

    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // If consent exists, surface floating manage button for easy access
      setShowFloatingManage(true);
      // Also restore saved preferences (if present)
      try {
        const saved = JSON.parse(localStorage.getItem('cookiePreferences') || '{}');
        setCookiePreferences(prev => ({ ...prev, ...saved, essential: true }));
      } catch (error) {
        // ignore parse errors, default preferences will be used
        console.error("Error parsing cookie preferences from localStorage:", error);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    setCookiePreferences(allAccepted);
    setShowBanner(false);
    setShowManageDialog(false);
    setShowFloatingManage(true);
  };

  const handleDeclineAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookiePreferences', JSON.stringify(essentialOnly));
    setCookiePreferences(essentialOnly);
    setShowBanner(false);
    setShowManageDialog(false);
    setShowFloatingManage(true);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'customized');
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    setShowBanner(false);
    setShowManageDialog(false);
    setShowFloatingManage(true);
  };

  const updatePreference = (type, value) => {
    setCookiePreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <>
      {/* NEW: Floating manage button (visible once a consent state exists) */}
      {showFloatingManage && (
        <Button
          variant="outline"
          onClick={() => setShowManageDialog(true)}
          className="fixed bottom-4 right-4 z-[9999] shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 hover:dark:bg-gray-700"
        >
          <Settings className="w-4 h-4 mr-2" />
          Cookie Settings
        </Button>
      )}

      {/* Main Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[9998] p-4">
          <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    We Use Cookies
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    We use cookies to enhance your experience, analyze site usage, and assist with our marketing efforts. 
                    Your data is processed in your browser - we don't store any of your financial calculations on our servers.
                    <br />
                    {/* Fixed: use SPA routing to the Cookie Policy page */}
                    <Link to={createPageUrl("CookiePolicy")} className="text-blue-600 dark:text-blue-400 hover:underline">
                      Learn more about our cookies
                    </Link>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleAcceptAll} className="bg-blue-600 hover:bg-blue-700">
                      Accept All Cookies
                    </Button>
                    <Button variant="outline" onClick={() => setShowManageDialog(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Cookies
                    </Button>
                    <Button variant="outline" onClick={handleDeclineAll}>
                      Decline All
                    </Button>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleDeclineAll}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Management Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Manage Cookie Preferences</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Choose which cookies you'd like to accept. You can change these settings at any time.
            </p>
            
            <div className="space-y-4">
              {/* Essential Cookies */}
              <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Essential Cookies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Required for basic site functionality. These cannot be disabled.
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Help us understand how visitors use our site to improve user experience.
                  </p>
                </div>
                <div className="ml-4">
                  <button 
                    onClick={() => updatePreference('analytics', !cookiePreferences.analytics)}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      cookiePreferences.analytics 
                        ? 'bg-blue-500 justify-end' 
                        : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                  </button>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Used to track visitors for advertising and marketing purposes.
                  </p>
                </div>
                <div className="ml-4">
                  <button 
                    onClick={() => updatePreference('marketing', !cookiePreferences.marketing)}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      cookiePreferences.marketing 
                        ? 'bg-blue-500 justify-end' 
                        : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                  </button>
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Preference Cookies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Remember your settings and preferences (like dark mode).
                  </p>
                </div>
                <div className="ml-4">
                  <button 
                    onClick={() => updatePreference('preferences', !cookiePreferences.preferences)}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      cookiePreferences.preferences 
                        ? 'bg-blue-500 justify-end' 
                        : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={handleDeclineAll}>
                Decline All
              </Button>
              <Button onClick={handleSavePreferences} className="bg-blue-600 hover:bg-blue-700">
                Save Preferences
              </Button>
              <Button onClick={handleAcceptAll} className="bg-green-600 hover:bg-green-700">
                Accept All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
