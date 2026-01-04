import { Zap, Target, BarChart3, ShieldCheck, RefreshCw, Flame } from "lucide-react";

export function ProductInfo() {
  return (
    <div className="w-full bg-white mt-16 flex justify-center">
      <section className="w-full max-w-2xl px-6 py-16 sm:py-24 text-gray-800 space-y-16">
        {/* Introduction */}
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">What is FlowTime?</h2>
          <div className="h-1.5 w-20 bg-red-500 rounded-full"></div>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            FlowTime is a customizable pomodoro timer that works on desktop & mobile browser. 
            The aim of this app is to help you focus on any task you are working on, such as studying, 
            writing, or coding. This app is inspired by Pomodoro Technique which is a time management 
            method developed by Francesco Cirillo.
          </p>
        </div>

        {/* How to use */}
        <div className="space-y-8">
          <h2 className="text-3xl font-extrabold text-gray-900">How to use the Timer?</h2>
          <div className="grid gap-6">
            <Step number="1" text="Log in to your account to keep your data synced." />
            <Step number="2" text="Choose a task to work on." />
            <Step number="3" text="Start the Flow Time timer and focus on your task for as long as you can maintain concentration." />
            <Step number="4" text="When you feel your focus fading, stop the timer and take a well-deserved break." />
            <Step number="5" text="The app will automatically calculate your break time based on how long you focused." />
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Core Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Feature 
              icon={<Target className="text-red-500" />} 
              title="Focus Mode" 
              description="Specialized sessions designed for deep work without interruptions."
            />
            <Feature 
              icon={<BarChart3 className="text-blue-500" />} 
              title="Advanced Analytics" 
              description="Track your productivity with beautiful, interactive charts and reports."
            />
            <Feature 
              icon={<RefreshCw className="text-green-500" />} 
              title="Cloud Sync" 
              description="Your focus history is safely stored and synced across all your devices."
            />
            <Feature 
              icon={<Flame className="text-orange-500" />} 
              title="Daily Streaks" 
              description="Stay motivated by maintaining your daily focus streaks."
            />
            <Feature 
              icon={<ShieldCheck className="text-purple-500" />} 
              title="Enterprise Security" 
              description="Industry-standard protection for your data and payments."
            />
            <Feature 
              icon={<Zap className="text-yellow-500" />} 
              title="Premium Experience" 
              description="Unlock professional features to take your productivity to the next level."
            />
          </div>
        </div>

        {/* Philosophy */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 sm:p-12 space-y-4 shadow-sm text-center">
          <Zap size={32} className="text-yellow-500 fill-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">
            The FlowTime Philosophy
          </h3>
          <p className="text-lg text-gray-500 leading-relaxed italic max-w-lg mx-auto">
            "Focus is not about doing more things, but about doing the right things with 100% of your presence."
          </p>
        </div>
      </section>
    </div>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex gap-5 items-start">
      <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-lg shadow-sm">
        {number}
      </span>
      <p className="pt-1.5 text-lg text-gray-600 font-medium">{text}</p>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white border border-gray-100 p-8 rounded-3xl space-y-4 hover:border-gray-200 hover:shadow-md transition-all">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-50">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-900">{title}</h4>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}