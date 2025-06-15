'use client';

export default function IndianMomGPT() {
  return (
    <div className="min-h-screen" style={{
      backgroundColor: '#fef3c7',
      backgroundImage: `
        linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px),
        linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px)
      `,
      backgroundSize: '30px 30px'
    }}>
      <div className="max-w-4xl mx-auto p-4 min-h-screen flex flex-col justify-center items-center">
        {/* Coming Soon Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-4 border-amber-300 shadow-2xl text-center max-w-2xl">
          {/* Icon */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-4xl md:text-6xl shadow-xl border-4 border-white mx-auto mb-6">
            👩‍👦
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-amber-800 mb-4">
            Indian Mom GPT
          </h1>

          {/* Coming Soon Badge */}
          <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold text-lg md:text-xl mb-6 shadow-lg transform rotate-2">
            🚧 Coming Soon! 🚧
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-amber-700 mb-6 leading-relaxed font-medium">
            Get ready to chat with the most dramatic, loving, and hilariously sarcastic virtual Indian mom!
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-amber-100 rounded-2xl p-4 border-2 border-amber-300">
              <div className="text-2xl mb-2">😭</div>
              <div className="text-amber-800 font-semibold">Drama Queen Mode</div>
              <div className="text-sm text-amber-600">Experience peak emotional manipulation</div>
            </div>
            <div className="bg-amber-100 rounded-2xl p-4 border-2 border-amber-300">
              <div className="text-2xl mb-2">🥺</div>
              <div className="text-amber-800 font-semibold">Guilt Trip Master</div>
              <div className="text-sm text-amber-600">Professional disappointment delivery</div>
            </div>
            <div className="bg-amber-100 rounded-2xl p-4 border-2 border-amber-300">
              <div className="text-2xl mb-2">😠</div>
              <div className="text-amber-800 font-semibold">Strict Principal</div>
              <div className="text-sm text-amber-600">No-nonsense mom energy</div>
            </div>
            <div className="bg-amber-100 rounded-2xl p-4 border-2 border-amber-300">
              <div className="text-2xl mb-2">😄</div>
              <div className="text-amber-800 font-semibold">Funny & Chill</div>
              <div className="text-sm text-amber-600">When mom&apos;s in a good mood</div>
            </div>
          </div>


          {/* Expected Features */}
          <div className="text-left bg-white/50 rounded-2xl p-6 border-2 border-amber-200">
            <h3 className="text-xl font-bold text-amber-800 mb-4 text-center">What to Expect:</h3>
            <ul className="space-y-2 text-amber-700">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Real-time conversation with AI-powered responses</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Multiple personality modes (Drama Queen, Guilt Tripper, etc.)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Disappointment meter that tracks your choices</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Classic Indian mom responses to everything</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Comparison with &quot;Sharma ji&apos;s son&quot; included!</span>
              </li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="mt-8">
            <p className="text-lg text-amber-600 mb-4">
              This experience will be available soon! Check back for the most authentic virtual Indian mom experience.
            </p>
            
            {/* Disclaimer */}
            <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 text-center">
              <p className="text-sm text-amber-700 italic">
                ❤️ Remember: Moms are one of a kind in this world. No AI can ever replace the love, care, and warmth of a real mother. This is purely for fun and entertainment - nothing beats the real thing! ❤️
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(5deg); }
          66% { transform: translateY(5px) rotate(-3deg); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}