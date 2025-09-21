import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Calendar, User, Clock, Heart, Brain, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function BlogFinancialPsychology() {
  const post = {
    title: "My Relationship with Money: A Guide to Financial Psychology",
    category: "Mindset",
    readTime: "8 min read",
    author: "CalcMyMoney Team",
    date: "October 22, 2023",
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Person meditating with financial symbols and growth charts in the background"
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to={createPageUrl("Blog")} className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all articles
        </Link>

        <article>
          <header className="mb-8">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-purple-900/50 dark:text-purple-300">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          <img src={post.imageUrl} alt={post.imageAlt} className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-8" />
          
          <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-gray-700 dark:text-gray-300">
            <p className="lead text-xl">Money isn't just numbers on a screen or notes in your wallet. It's deeply personal, emotional, and tied to our core beliefs about security, success, and self-worth. Understanding your relationship with money might be the most important financial skill you never learned in school.</p>
            
            <Separator className="my-8" />

            <h2>The Hidden Forces Shaping Your Money Decisions</h2>
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <p className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-0">It's All in Your Head (And That's OK)</p>
            </div>
            
            <p>Every time you make a financial decision – whether it's buying a coffee, choosing a pension contribution, or avoiding looking at your bank balance – you're being influenced by deeply ingrained psychological patterns.</p>

            <p>These patterns were formed early in life through:</p>
            <ul>
              <li><strong>Family messages:</strong> What did your parents say (or not say) about money?</li>
              <li><strong>Early experiences:</strong> Did you experience financial stress, abundance, or unpredictability?</li>
              <li><strong>Cultural influences:</strong> What does your community/society say about wealth and poverty?</li>
              <li><strong>Personal experiences:</strong> Your wins, losses, and lessons with money over time</li>
            </ul>

            <div className="my-8">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Child's hands holding coins, representing early money experiences" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
                Our earliest money memories often shape our adult financial behaviors
              </p>
            </div>

            <h2>The Four Common UK Money Personalities</h2>
            <p>Most people fall into one (or a combination) of these money personality types. Recognizing yourself can be the first step toward financial awareness:</p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <Card className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">💸 The Spender</h4>
                  <p className="text-red-700 dark:text-red-300 text-sm mb-3">Money is for enjoying life and showing love</p>
                  <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                    <li>• Shops to feel better</li>
                    <li>• Generous with others</li>
                    <li>• Lives in the moment</li>
                    <li>• Struggles with saving</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🏦 The Saver</h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">Money equals security and peace of mind</p>
                  <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                    <li>• Always has an emergency fund</li>
                    <li>• Conservative with investments</li>
                    <li>• Plans for the future</li>
                    <li>• May miss out on experiences</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">📊 The Investor</h4>
                  <p className="text-green-700 dark:text-green-300 text-sm mb-3">Money should work hard and grow</p>
                  <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                    <li>• Loves researching opportunities</li>
                    <li>• Comfortable with calculated risks</li>
                    <li>• Focuses on long-term wealth</li>
                    <li>• May neglect present enjoyment</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🙈 The Avoider</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">Money is stressful and overwhelming</p>
                  <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    <li>• Avoids checking bank statements</li>
                    <li>• Delegates financial decisions</li>
                    <li>• Feels overwhelmed by choices</li>
                    <li>• May miss financial opportunities</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h2>Common Money Myths That Hold Us Back</h2>
            <p>Many of the beliefs we hold about money aren't actually true, but they feel true because we've never questioned them. Here are some common ones among UK residents:</p>

            <div className="my-6 p-6 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200">❌ "I'm just bad with money"</p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">✅ Money management is a learnable skill, not a fixed trait.</p>
                </div>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200">❌ "Rich people are greedy/lucky/different"</p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">✅ Wealth often comes from consistent habits and informed decisions over time.</p>
                </div>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200">❌ "I need to earn more before I can save"</p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">✅ Small amounts saved consistently can grow significantly over time.</p>
                </div>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200">❌ "Investing is only for the wealthy"</p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">✅ You can start investing with as little as £25 per month in the UK.</p>
                </div>
              </div>
            </div>

            <div className="my-8">
              <img 
                src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Person breaking free from chains, representing breaking limiting money beliefs" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
                Breaking free from limiting money beliefs opens up new financial possibilities
              </p>
            </div>

            <h2>The UK Context: Cultural Money Messages</h2>
            <p>In the UK, we have some unique cultural attitudes toward money that can impact our financial wellbeing:</p>
            <ul>
              <li><strong>"Money doesn't buy happiness"</strong> – While true to an extent, this can justify underearning or avoiding financial goals</li>
              <li><strong>"It's rude to discuss money"</strong> – This taboo prevents us from learning from others and getting help when needed</li>
              <li><strong>"Keep calm and carry on"</strong> – Our stiff upper lip can prevent us from addressing financial stress</li>
              <li><strong>"Class consciousness"</strong> – Ideas about "our place" can limit financial aspirations</li>
            </ul>

            <h2>Rewiring Your Money Mindset: Practical Steps</h2>
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-green-600" />
              <p className="text-lg font-semibold text-green-800 dark:text-green-300 mb-0">Small Changes, Big Impact</p>
            </div>

            <h3>1. Practice Money Mindfulness</h3>
            <p>Before making any purchase over £20, pause and ask yourself:</p>
            <ul>
              <li>What emotion am I feeling right now?</li>
              <li>What do I hope this purchase will give me?</li>
              <li>Is this aligned with my values and goals?</li>
            </ul>

            <h3>2. Reframe Your Money Stories</h3>
            <p>Instead of "I can't afford it," try "That's not a priority for me right now." This shifts you from victim to empowered decision-maker.</p>

            <h3>3. Set Values-Based Goals</h3>
            <p>Rather than arbitrary targets, connect your financial goals to what matters most to you:</p>
            <ul>
              <li>Security: Emergency fund for peace of mind</li>
              <li>Freedom: Savings for career flexibility</li>
              <li>Family: University fund for children</li>
              <li>Adventure: Travel fund for experiences</li>
            </ul>

            <h3>4. Celebrate Small Wins</h3>
            <p>Acknowledge progress, no matter how small. Saved your first £100? Celebrate! Increased your pension contribution? That's worth recognizing!</p>

            <div className="my-8">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Person celebrating success with arms raised against sunset" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
                Celebrating financial wins, big and small, reinforces positive money habits
              </p>
            </div>

            <Separator className="my-8" />

            <h2>Your Money, Your Journey</h2>
            <p>There's no "perfect" relationship with money, just like there's no perfect relationship with anything else that matters. The goal isn't to eliminate all emotion from your financial decisions – that's impossible and unnecessary.</p>
            
            <p>Instead, the goal is <em>awareness</em>. When you understand why you make the financial choices you do, you can make more intentional decisions that align with your true values and long-term wellbeing.</p>

            <p>Remember: changing your relationship with money is a process, not a destination. Be patient with yourself as you unlearn old patterns and create new, healthier ones.</p>

            <Card className="my-8 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">💭 Ready to Transform Your Future?</h3>
                <p className="text-purple-700 dark:text-purple-300">
                  Start putting these insights into practice with our <Link to={createPageUrl("DreamLifestyleCalculator")} className="underline font-medium">Dream Lifestyle Calculator</Link>. Discover what your ideal life costs and create a values-based plan to get there.
                </p>
              </CardContent>
            </Card>
          </div>
        </article>
      </div>
    </div>
  );
}