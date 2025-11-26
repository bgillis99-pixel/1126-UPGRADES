import React, { useState, useRef } from 'react';
import { extractVinFromImage } from '../services/geminiService';

interface Props {
  onAddToHistory: (value: string, type: 'VIN' | 'ENTITY' | 'TRUCRS') => void;
  onNavigateChat: () => void;
  onInstallApp: () => void;
  onFindTester: (zip: string) => void;
}

const VinChecker: React.FC<Props> = ({ onAddToHistory, onNavigateChat, onInstallApp, onFindTester }) => {
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [zipInput, setZipInput] = useState('');
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [hasClickedLink, setHasClickedLink] = useState(false);
  
  // Podcast State
  const [isPlaying, setIsPlaying] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const vin = await extractVinFromImage(file);
      
      const cleaned = vin.replace(/[^A-Z0-9]/gi, '');
      setInputVal(cleaned);
      
      if (cleaned.includes('I') || cleaned.includes('O') || cleaned.includes('Q')) {
           if (navigator.vibrate) navigator.vibrate(200);
           alert("SCANNER WARNING: Illegal characters (I, O, Q) detected. Please verify VIN manually.");
      }

    } catch (err) {
      alert('Failed to scan. Please type manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value.toUpperCase());
  };

  const hasInvalidChars = /[IOQ]/.test(inputVal);

  const handleCheckSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const val = inputVal.trim().toUpperCase();
    
    if (val.includes('O')) return alert("⚠️ Invalid character: Letter 'O' (Oh) is not allowed. Use Number '0' (Zero).");
    if (val.includes('I')) return alert("⚠️ Invalid character: Letter 'I' (Eye) is not allowed. Use Number '1' (One).");
    if (val.includes('Q')) return alert("⚠️ Invalid character: Letter 'Q' is not allowed in VINs.");

    if (!val || val.length < 17) {
      alert('Please enter a valid 17-character VIN.');
      return;
    }
    
    setHasClickedLink(false);
    setShowRedirectModal(true);
  };

  const proceedToStateSite = () => {
      const val = inputVal.trim().toUpperCase();
      onAddToHistory(val, 'VIN');
      window.open(`https://cleantruckcheck.arb.ca.gov/Fleet/Vehicle/VehicleComplianceStatusLookup?vin=${val}`, '_blank');
      
      // Update modal state to ask the user the result when they come back
      setHasClickedLink(true);
  };

  const handlePassed = () => {
      setShowRedirectModal(false);
      alert("Great! This VIN has been saved to your history. We will remind you when it's time to test again.");
  };

  const handleFailed = () => {
      setShowRedirectModal(false);
      // Scroll to finder
      document.getElementById('tester-finder')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipInput.length < 5) {
      alert("Please enter a valid 5-digit Zip Code.");
      return;
    }
    onFindTester(zipInput);
  };

  const togglePodcast = () => {
      setIsPlaying(!isPlaying);
      // In a real app, this would toggle an <audio> element
      if (!isPlaying) {
          alert("Playing: 'Common Compliance Questions with NorCal Mobile'...");
      }
  };

  return (
    <div className="flex flex-col items-center w-full pb-10">
      
      <div className="w-full bg-gradient-to-b from-[#003366] to-[#f8f9fa] pb-12 pt-6 px-4 rounded-b-[3rem] shadow-sm mb-[-40px]">
        <div className="max-w-md mx-auto text-center text-white">
            <h2 className="text-xl font-light opacity-90 tracking-wide mb-1">CALIFORNIA STATEWIDE</h2>
            <p className="text-3xl font-black tracking-tight mb-6">Compliance Status & Mobile Testing</p>
            
            <button onClick={onInstallApp} className="bg-[#15803d] text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-[#166534] active:scale-95 transition-all inline-flex items-center gap-2 mb-4">
                <span>⬇️ INSTALL APP</span>
            </button>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[24px] shadow-[0_20px_40px_rgba(0,51,102,0.15)] border border-gray-100 w-full max-w-md text-center relative overflow-hidden z-10">
        
        {loading && (
          <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-20 backdrop-blur-sm">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#15803d] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <div className="text-[#003366] font-bold animate-pulse">Analyzing VIN...</div>
            </div>
          </div>
        )}

        <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full mb-6 py-5 bg-gradient-to-r from-[#003366] to-[#002244] text-white rounded-2xl font-bold text-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            SCAN VIN TAG
        </button>

        <form onSubmit={handleCheckSubmit} className="relative mb-2 group">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={inputVal}
                    onChange={handleInputChange}
                    placeholder="Or Type VIN..."
                    maxLength={17}
                    className={`w-full p-4 pr-16 text-2xl font-black text-center border-4 ${hasInvalidChars ? 'border-red-500 focus:ring-red-200' : 'border-[#003366] focus:ring-blue-100'} rounded-xl focus:outline-none focus:ring-4 transition-all font-mono uppercase tracking-widest text-[#003366] placeholder:text-gray-400 placeholder:text-xl placeholder:font-sans placeholder:font-bold placeholder:normal-case shadow-inner`}
                />
                
                {/* INLINE SUBMIT BUTTON */}
                <button 
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-[#15803d] text-white w-12 rounded-lg flex items-center justify-center shadow-md hover:bg-[#166534] active:scale-95 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            </div>
        </form>
        
        {hasInvalidChars ? (
             <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-6 text-center animate-in fade-in slide-in-from-top-1">
                 <p className="text-xs text-red-700 font-bold">⚠️ STOP: INVALID VIN CHARACTERS</p>
                 <p className="text-[10px] text-red-600 mt-1">
                    VINs <u>never</u> contain letters <span className="font-black">I, O, or Q</span>.<br/>
                    Please use numbers <span className="font-black">1</span> or <span className="font-black">0</span>.
                 </p>
             </div>
        ) : (
            <p className="text-[10px] text-gray-500 mb-6 px-2 text-center leading-tight">
                <span className="font-bold text-[#003366]">VIN RULES:</span> Never use letters <span className="font-bold text-red-500">I, O, Q</span>. Press <span className="font-bold text-[#15803d]">GO</span> to Check.
            </p>
        )}

        {/* MEDIA & RESOURCES SECTION */}
        <div className="space-y-4 mb-6">
            
            {/* AUDIO PLAYER CARD */}
            <div className="bg-[#003366] rounded-xl p-4 text-white shadow-lg relative overflow-hidden group">
                <div className="relative z-10 flex items-center gap-4">
                    <button onClick={togglePodcast} className="bg-[#15803d] w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-[#166534] transition-transform active:scale-95 flex-shrink-0">
                        {isPlaying ? (
                            <span className="text-xl">❚❚</span>
                        ) : (
                            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                    </button>
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-0.5">COMPLIANCE PODCAST</p>
                        <h4 className="font-bold text-sm leading-tight">Q&A with NorCal Mobile</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Ep. 1: Blocking, Fees & Timelines</p>
                    </div>
                </div>
                {/* Visual Waveform Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center gap-1 opacity-20 pointer-events-none px-4 pb-2">
                    {[40,60,30,80,50,90,40,70,30,50,80,40,60,30].map((h, i) => (
                        <div key={i} className={`w-1.5 bg-white rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`} style={{height: `${h}%`}}></div>
                    ))}
                </div>
            </div>

            {/* BLOG LINKS */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-left shadow-sm">
                 <h4 className="font-bold text-[#003366] text-sm mb-3 flex items-center gap-2">
                    <span className="bg-blue-50 p-1 rounded">📰</span> Latest Updates
                 </h4>
                 <div className="space-y-3">
                     <a href="https://norcalcarbmobile.com/blog" target="_blank" className="block group">
                         <div className="text-xs font-bold text-gray-800 group-hover:text-[#15803d] transition-colors">How to clear a "Blocked" Status</div>
                         <div className="text-[10px] text-gray-400">Read Article &rarr;</div>
                     </a>
                     <div className="h-px bg-gray-100"></div>
                     <a href="https://norcalcarbmobile.com/blog" target="_blank" className="block group">
                         <div className="text-xs font-bold text-gray-800 group-hover:text-[#15803d] transition-colors">2025 vs 2026 Testing Schedules</div>
                         <div className="text-[10px] text-gray-400">Read Article &rarr;</div>
                     </a>
                 </div>
            </div>

        </div>

        <div className="space-y-3">
          <form onSubmit={handleZipSubmit} className="relative pt-2" id="tester-finder">
            <label className="block text-left text-xs font-bold text-[#003366] mb-1 ml-1">FIND A TESTER</label>
            <div className="flex shadow-sm rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#003366] transition-colors bg-white">
                <input 
                    type="tel" 
                    placeholder="Enter Zip Code"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value)}
                    maxLength={5}
                    className="flex-1 p-4 font-bold text-lg text-[#003366] placeholder:text-gray-400 focus:outline-none"
                />
                <button 
                    type="submit"
                    className="px-6 bg-gray-100 text-[#003366] font-black hover:bg-[#003366] hover:text-white transition-colors active:bg-[#002244] flex items-center gap-1"
                >
                    SEARCH
                </button>
            </div>
          </form>

          <a
            href="https://cleantruckcheck.arb.ca.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 text-lg font-bold text-[#003366] bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 block no-underline"
          >
            <span>GET COMPLIANT</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </a>

          <div className="py-2">
             <p className="text-xs text-gray-400">
                Need help? <span className="font-bold text-[#15803d] cursor-pointer hover:underline" onClick={onNavigateChat}>Ask AI Assistant &rarr;</span>
             </p>
          </div>

        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleScan}
        />
      </div>

      {/* REDIRECT MODAL */}
      {showRedirectModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                  
                  {!hasClickedLink ? (
                      <>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-[#003366] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-[#003366] mb-2">OFFICIAL RECORD CHECK</h3>
                            <p className="text-gray-500 text-sm mb-4">You are leaving the app to view the official California government database.</p>
                            
                            <div className="bg-gray-100 p-3 rounded-xl border border-gray-200 mb-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Checking VIN</p>
                                <p className="text-lg font-mono font-bold text-[#003366] tracking-widest break-all">{inputVal}</p>
                            </div>

                            <div className="text-left text-sm space-y-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="font-bold text-[#003366]">⚠️ What to look for:</p>
                                <ul className="list-disc pl-4 text-gray-700 space-y-1">
                                    <li>Green <span className="font-bold text-[#15803d]">COMPLIANT</span> status.</li>
                                    <li>If <span className="font-bold text-red-600">BLOCKED</span>, check for unpaid fees.</li>
                                    <li>Verify the License Plate matches.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button onClick={proceedToStateSite} className="w-full py-4 bg-[#15803d] text-white font-bold rounded-xl shadow-lg hover:bg-[#166534] flex items-center justify-center gap-2">
                                VIEW OFFICIAL STATUS &rarr;
                            </button>
                            <button onClick={() => setShowRedirectModal(false)} className="w-full py-3 text-gray-400 font-bold hover:text-gray-600">
                                Cancel
                            </button>
                        </div>
                      </>
                  ) : (
                      <div className="text-center py-6">
                          <div className="mb-6">
                              <h3 className="text-2xl font-black text-[#003366] mb-2">Did you pass?</h3>
                              <p className="text-gray-500">Welcome back. What was the result on the state website?</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <button onClick={handleFailed} className="p-4 rounded-xl bg-red-50 border-2 border-red-100 hover:border-red-300 hover:bg-red-100 transition-all">
                                  <div className="text-3xl mb-2">❌</div>
                                  <div className="font-bold text-red-700">Blocked</div>
                                  <div className="text-[10px] text-red-500">or Fees Due</div>
                              </button>
                              
                              <button onClick={handlePassed} className="p-4 rounded-xl bg-green-50 border-2 border-green-100 hover:border-green-300 hover:bg-green-100 transition-all">
                                  <div className="text-3xl mb-2">✅</div>
                                  <div className="font-bold text-green-700">Compliant</div>
                                  <div className="text-[10px] text-green-500">Good to go</div>
                              </button>
                          </div>
                          <p className="text-xs text-gray-400 mt-4">If blocked, tap the red box to find a tester.</p>
                      </div>
                  )}

              </div>
          </div>
      )}
      
      <div className="flex justify-center gap-6 mt-8 grayscale opacity-50">
           <div className="text-center">
                <div className="text-2xl">🛡️</div>
                <div className="text-[10px] font-bold mt-1">Secure</div>
           </div>
           <div className="text-center">
                <div className="text-2xl">⚡</div>
                <div className="text-[10px] font-bold mt-1">Instant</div>
           </div>
           <div className="text-center">
                <div className="text-2xl">🤝</div>
                <div className="text-[10px] font-bold mt-1">Trusted</div>
           </div>
      </div>

      <div className="mt-8 w-full max-w-md bg-white/50 border border-white p-6 rounded-xl mb-6 backdrop-blur-sm">
        <h3 className="font-bold text-[#003366] text-lg mb-4">Common Questions</h3>
        <div className="space-y-3 divide-y divide-gray-200/50">
             
             {/* NEW SEO ACTIONS */}
             <details className="group pt-2">
                <summary className="cursor-pointer font-semibold text-[#003366] text-sm flex justify-between items-center">
                    Create Account
                    <span className="text-[#15803d] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2 text-xs text-gray-600 flex flex-col gap-2">
                    <p>New to CARB? You must register your fleet online.</p>
                    <a href="https://cleantruckcheck.arb.ca.gov/" target="_blank" className="font-bold text-[#003366] underline">Go to Registration Portal &rarr;</a>
                </div>
            </details>

            <details className="group pt-2">
                <summary className="cursor-pointer font-semibold text-[#003366] text-sm flex justify-between items-center">
                    Pay Annual Fees
                    <span className="text-[#15803d] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                 <div className="mt-2 text-xs text-gray-600 flex flex-col gap-2">
                    <p>$30 per vehicle annual compliance fee is required.</p>
                    <a href="https://cleantruckcheck.arb.ca.gov/" target="_blank" className="font-bold text-[#003366] underline">Pay Fees Online &rarr;</a>
                </div>
            </details>

             <details className="group pt-2">
                <summary className="cursor-pointer font-semibold text-[#003366] text-sm flex justify-between items-center">
                    Upload Vehicle Info
                    <span className="text-[#15803d] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                 <div className="mt-2 text-xs text-gray-600 flex flex-col gap-2">
                    <p>Add new trucks to your fleet profile before testing.</p>
                    <a href="https://cleantruckcheck.arb.ca.gov/" target="_blank" className="font-bold text-[#003366] underline">Upload Vehicle Data &rarr;</a>
                </div>
            </details>
            
            <div className="border-t border-gray-100 my-2"></div>

             <details className="group pt-2">
                <summary className="cursor-pointer font-semibold text-[#003366] text-sm flex justify-between items-center">
                    Passed but Non-Compliant?
                    <span className="text-[#15803d] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2 text-xs text-gray-600">
                    <p className="mb-1">Common causes: Entity setup, unpaid fees, missing vehicle upload, or OVI data entry errors (bad digit).</p>
                    <p className="font-bold text-[#003366] mt-2">Ask an Expert:</p>
                    <div className="flex flex-col gap-1 mt-1">
                        <a href="tel:6173596953" className="text-[#15803d] hover:underline font-bold">617-359-6953</a>
                        <a href="mailto:sales@norcalcarbmobile.com" className="text-[#15803d] hover:underline">sales@norcalcarbmobile.com</a>
                    </div>
                </div>
            </details>
            <details className="group pt-2">
                <summary className="cursor-pointer font-semibold text-[#003366] text-sm flex justify-between items-center">
                    Results Missing?
                    <span className="text-[#15803d] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs text-gray-600">Takes 48 hours. If longer, call 844-685-8922.</p>
            </details>
             <details className="group pt-2">
                <summary className="cursor-pointer font-semibold text-[#003366] text-sm flex justify-between items-center">
                    Next Test Due?
                    <span className="text-[#15803d] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs text-gray-600">Linked to DMV registration. 2025 is 2x/year. 2027 is 4x/year.</p>
            </details>
             <details className="group pt-2">
                <summary className="cursor-pointer font-semibold text-[#003366] text-sm flex justify-between items-center">
                    Lost Password?
                    <span className="text-[#15803d] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs text-gray-600">Reset at <a href="https://cleantruckcheck.arb.ca.gov" target="_blank" className="underline text-[#003366]">cleantruckcheck.arb.ca.gov</a>.</p>
            </details>
            <details className="group pt-2">
                <summary className="cursor-pointer font-semibold text-[#003366] text-sm flex justify-between items-center">
                    Scan didn't work?
                    <span className="text-[#15803d] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs text-gray-600">Try wiping the engine tag clean. If still failing, type the 17 characters manually.</p>
            </details>
             <details className="group pt-2">
                <summary className="cursor-pointer font-semibold text-[#003366] text-sm flex justify-between items-center">
                    What vehicles?
                    <span className="text-[#15803d] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs text-gray-600">Heavy Duty Diesel (>14,000 lbs), Motorhomes, and Ag Equipment. NO GASOLINE CARS.</p>
            </details>
        </div>
      </div>
    </div>
  );
};

export default VinChecker;