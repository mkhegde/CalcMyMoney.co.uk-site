
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, CheckCircle } from "lucide-react";
import FAQSection from "../components/calculators/FAQSection";

// We are removing the base44 SendEmail integration as it won't work on a static site.
// import { SendEmail } from "@/api/integrations";

// Add a small FAQ specifically for the Contact page
const contactFaqs = [
  {
    question: "When will I receive a reply?",
    answer: "We typically respond within 1–2 business days. During peak periods (e.g., major UK Budget changes), replies may take a little longer, but we read every message."
  },
  {
    question: "Can you give personal financial advice?",
    answer: "No. We provide educational tools only and cannot offer personalised financial advice. For advice specific to your situation, please speak to a qualified adviser."
  },
  {
    question: "How do you use my contact details?",
    answer: "We use your details solely to respond to your enquiry. See our Privacy Policy for full details on data handling and your rights."
  }
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Replace this with your actual Formspree endpoint URL
    const formspreeEndpoint = "https://formspree.io/f/xwpnppaz";

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        setStatus("success");
        setFeedbackMessage("Thank you for your message! We'll get back to you soon.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      setStatus("error");
      setFeedbackMessage("Sorry, there was an error sending your message. Please try again later.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Send className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Have a question, feedback, or a suggestion? We'd love to hear from you.
          </p>
        </div>

        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-800 dark:text-gray-200">Full Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" className="dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-800 dark:text-gray-200">Message</Label>
                <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required placeholder="Your message here..." className="h-32 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" />
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={status === 'sending'}>
                  {status === 'sending' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
            {status === 'success' && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-3">
                 <CheckCircle className="w-5 h-5" />
                 <p>{feedbackMessage}</p>
              </div>
            )}
             {status === 'error' && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
                 <p>{feedbackMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* NEW: Helpful content to increase value and word count */}
        <div className="mt-12 space-y-8">
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">Before you get in touch</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Many common questions are answered within our calculator pages and resources. If you’re writing about a specific
              result, please include the calculator name, your inputs, and the tax year where relevant (e.g., 2025/26).
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-2">
              <li>Bug report: tell us which page and the exact steps to reproduce the issue.</li>
              <li>Feature request: describe the use‑case and the data you’d like to see.</li>
              <li>Press/partnerships: include your organisation, timelines, and the calculators of interest.</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">Our typical response</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              We aim to reply within 1–2 business days. If your question relates to a specific calculation, providing a screenshot
              and the URL helps us respond faster. For urgent media enquiries, please mention “Media” in the subject line.
            </p>
          </section>

          {/* Concise FAQ for the Contact page */}
          <FAQSection faqs={contactFaqs} title="Contact FAQs" />
        </div>
      </div>
    </div>
  );
}
