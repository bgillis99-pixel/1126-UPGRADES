
import React, { useState } from 'react';

const EducationCenter: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const toggleTopic = (topic: string) => {
    setActiveTopic(activeTopic === topic ? null : topic);
  };

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <div className="bg-[#003366] text-white pb-12 pt-8 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 text-9xl transform translate-x-10 -translate-y-10">🎓</div>
        <h2 className="text-3xl font-black text-center mb-2 tracking-tight">CARB ACADEMY</h2>
        <p className="text-center text-blue-200 text-sm font-medium max-w-xs mx-auto">
          What the state forgets to tell you.<br/>Simple guides to stay on the road.
        </p>
      </div>

      <div className="px-4 -mt-6">
        {/* THE 3 PILLARS CARD */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="text-[#15803d] font-black text-lg mb-4 flex items-center gap-2">
            <span className="bg-[#15803d] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            THE 3 STEPS TO COMPLIANCE
          </h3>
          <div className="space-y-4 relative">
            {/* Connecting Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200 -z-10"></div>

            <div className="flex items-start gap-4">
              <div className="bg-white border-2 border-[#003366] w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 text-xl shadow-sm">💻</div>
              <div>
                <h4 className="font-bold text-[#003366]">Register (CTC-VIS)</h4>
                <p className="text-xs text-gray-500 leading-snug">You must create an account on the CARB website and upload your vehicle info.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white border-2 border-[#003366] w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 text-xl shadow-sm">💳</div>
              <div>
                <h4 className="font-bold text-[#003366]">Pay the Fee</h4>
                <p className="text-xs text-gray-500 leading-snug">$30 per vehicle, every year. If you don't pay, you can't print your certificate.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white border-2 border-[#003366] w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 text-xl shadow-sm">💨</div>
              <div>
                <h4 className="font-bold text-[#003366]">Pass the Test</h4>
                <p className="text-xs text-gray-500 leading-snug">Get a Smoke/OBD test from a credentialed tester (like us). Results upload automatically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* TROUBLESHOOTER */}
        <div className="mb-6">
           <h3 className="font-bold text-[#003366] ml-2 mb-2 text-sm uppercase tracking-wider">Troubleshooting</h3>
           <div className="space-y-2">
             
             {/* BLOCKER GUIDE */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button onClick={() => toggleTopic('blocked')} className="w-full flex justify-between items-center p-4 text-left">
                  <span className="font-bold text-red-600 flex items-center gap-2">🛑 Why am I Blocked?</span>
                  <span className={`text-[#003366] transition-transform ${activeTopic === 'blocked' ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {activeTopic === 'blocked' && (
                  <div className="p-4 pt-0 bg-red-50/50 text-sm text-gray-700">
                    <p className="mb-2">A "Blocked" status usually means one of three things:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-3">
                      <li><strong>Unpaid Fees:</strong> Did you pay your $30 for this year?</li>
                      <li><strong>Bad Data:</strong> Does the VIN in your account match the truck exactly?</li>
                      <li><strong>No Test:</strong> Has it been more than a year since your last test?</li>
                    </ul>
                    <div className="bg-white p-2 rounded border border-red-100 text-xs font-bold text-center text-red-500">
                      Solution: Log into CTC-VIS portal to check for "Holds".
                    </div>
                  </div>
                )}
             </div>

             {/* DEADLINES GUIDE */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button onClick={() => toggleTopic('deadlines')} className="w-full flex justify-between items-center p-4 text-left">
                  <span className="font-bold text-[#003366] flex items-center gap-2">📅 When is my deadline?</span>
                  <span className={`text-[#003366] transition-transform ${activeTopic === 'deadlines' ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {activeTopic === 'deadlines' && (
                  <div className="p-4 pt-0 text-sm text-gray-700">
                    <p className="mb-2">Deadlines are now linked to your <strong>DMV Registration Expiration</strong>.</p>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                       <div className="bg-blue-50 p-2 rounded border border-blue-100">
                          <div className="font-bold text-[#003366]">2024</div>
                          <div className="text-xs">Once / Year</div>
                       </div>
                       <div className="bg-blue-50 p-2 rounded border border-blue-100">
                          <div className="font-bold text-[#003366]">2025</div>
                          <div className="text-xs">Twice / Year</div>
                       </div>
                    </div>
                    <p className="text-xs text-gray-500 italic">
                      Note: You must test <= 90 days before your registration expires.
                    </p>
                  </div>
                )}
             </div>

             {/* MYTHS GUIDE */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button onClick={() => toggleTopic('myths')} className="w-full flex justify-between items-center p-4 text-left">
                  <span className="font-bold text-[#003366] flex items-center gap-2">🤔 Common Myths</span>
                  <span className={`text-[#003366] transition-transform ${activeTopic === 'myths' ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {activeTopic === 'myths' && (
                  <div className="p-4 pt-0 text-sm text-gray-700 space-y-3">
                    <div className="border-l-4 border-red-400 pl-3">
                        <p className="text-xs font-bold text-red-500 uppercase">Myth</p>
                        <p>"I have a 2010 truck so I am exempt."</p>
                        <p className="text-xs font-bold text-[#15803d] uppercase mt-1">Fact</p>
                        <p>No. Nearly all diesel vehicles over 14,000 lbs must test, regardless of age, until fully electric.</p>
                    </div>
                    <div className="border-l-4 border-red-400 pl-3">
                        <p className="text-xs font-bold text-red-500 uppercase">Myth</p>
                        <p>"I can just go to a Smog Check station."</p>
                        <p className="text-xs font-bold text-[#15803d] uppercase mt-1">Fact</p>
                        <p>Most can't help. You need a <strong>Credentialed Clean Truck Tester</strong> (like us).</p>
                    </div>
                  </div>
                )}
             </div>

           </div>
        </div>

        {/* EXTERNAL RESOURCES */}
        <div className="bg-[#003366] rounded-xl p-5 text-white text-center shadow-lg">
           <h3 className="font-bold text-lg mb-2">Still Confused?</h3>
           <p className="text-sm opacity-80 mb-4">Watch the official CARB training videos or call us.</p>
           <div className="flex gap-3 justify-center">
              <a href="https://www.youtube.com/user/calairresourcesboard" target="_blank" className="bg-white text-[#003366] px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100">
                 Watch Videos
              </a>
              <a href="https://cleantruckcheck.arb.ca.gov/" target="_blank" className="bg-[#15803d] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#166534]">
                 Official Portal
              </a>
           </div>
        </div>

      </div>
    </div>
  );
};

export default EducationCenter;
