import React, { useState } from 'react';

type MonitorState = {
    misfire: boolean;
    fuel: boolean;
    comprehensive: boolean;
    nmhc: boolean;
    nox: boolean;
    pm: boolean;
    exhaustGas: boolean;
    boostPressure: boolean;
};

const TesterDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CALC' | 'OBD' | 'RECEIPT' | 'GUIDE'>('CALC');

  // Calculator State
  const [engineYear, setEngineYear] = useState<number>(new Date().getFullYear());
  const [hasDPF, setHasDPF] = useState(true);

  // Receipt State
  const [customerPhone, setCustomerPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [vinLast6, setVinLast6] = useState('');
  
  // OBD Checklist State
  const [monitors, setMonitors] = useState<MonitorState>({
      misfire: true,
      fuel: true,
      comprehensive: true,
      nmhc: false,
      nox: false,
      pm: false,
      exhaustGas: false,
      boostPressure: false
  });

  // OPACITY LOGIC
  const getOpacityLimit = () => {
      if (engineYear >= 2007 || hasDPF) return { limit: "5%", color: "text-[#15803d]" };
      if (engineYear >= 1996 && engineYear <= 2006) return { limit: "20%", color: "text-orange-600" };
      if (engineYear >= 1991 && engineYear <= 1995) return { limit: "30%", color: "text-red-600" };
      if (engineYear < 1991) return { limit: "40%", color: "text-red-800" };
      return { limit: "5%", color: "text-[#15803d]" }; // Default safe
  };

  const limitData = getOpacityLimit();

  const toggleMonitor = (key: keyof MonitorState) => {
      setMonitors(prev => ({...prev, [key]: !prev[key]}));
  };

  const setAllMonitors = (state: boolean) => {
      setMonitors(prev => {
          const newState = { ...prev };
          (Object.keys(newState) as Array<keyof MonitorState>).forEach(k => {
             newState[k] = state;
          });
          return newState;
      });
  };

  const generateReceiptLink = () => {
      const msg = `🧾 RECEIPT: Clean Truck Check\nAmount Paid: $${amount}\nVIN (last 6): ${vinLast6}\nDate: ${new Date().toLocaleDateString()}\nStatus: COMPLETED\n\nThank you for choosing Mobile Carb Check.`;
      return `sms:${customerPhone}?body=${encodeURIComponent(msg)}`;
  };

  const handleShareGuide = () => {
      if (navigator.share) {
          navigator.share({
              title: 'Wager 6500 Cheat Sheet',
              text: 'Mobile Carb Check - Field Guide for SAE J1667',
              url: window.location.href
          });
      } else {
          alert("Link copied to clipboard (Simulated)");
      }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-50 min-h-screen pb-20">
        {/* HEADER */}
        <div className="bg-gray-900 text-white p-6 rounded-b-3xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black tracking-tight">FIELD TECHNICIAN</h2>
                <span className="bg-[#15803d] text-xs font-bold px-2 py-1 rounded text-white">PRO MODE</span>
            </div>
            
            <div className="flex bg-gray-800 p-1 rounded-xl overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('CALC')} 
                    className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition-colors ${activeTab === 'CALC' ? 'bg-white text-gray-900' : 'text-gray-400'}`}
                >
                    OPACITY
                </button>
                <button 
                    onClick={() => setActiveTab('OBD')} 
                    className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition-colors ${activeTab === 'OBD' ? 'bg-white text-gray-900' : 'text-gray-400'}`}
                >
                    OBD PREP
                </button>
                <button 
                    onClick={() => setActiveTab('RECEIPT')} 
                    className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition-colors ${activeTab === 'RECEIPT' ? 'bg-white text-gray-900' : 'text-gray-400'}`}
                >
                    INVOICE
                </button>
                <button 
                    onClick={() => setActiveTab('GUIDE')} 
                    className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition-colors ${activeTab === 'GUIDE' ? 'bg-[#00C853] text-white' : 'text-gray-400'}`}
                >
                    WAGER GUIDE
                </button>
            </div>
        </div>

        <div className="p-4">
            
            {/* CALCULATOR TAB */}
            {activeTab === 'CALC' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                        <h3 className="text-gray-500 font-bold text-xs uppercase mb-2">Maximum Opacity Limit</h3>
                        <div className={`text-6xl font-black ${limitData.color}`}>{limitData.limit}</div>
                        <p className="text-xs text-gray-400 mt-2">Any reading above this is a FAIL.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Engine Year</label>
                            <input 
                                type="number" 
                                value={engineYear} 
                                onChange={(e) => setEngineYear(parseInt(e.target.value))} 
                                className="w-full p-4 text-2xl font-bold border-2 border-gray-100 rounded-xl focus:border-[#003366] outline-none"
                            />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <span className="font-bold text-gray-700">Has DPF Filter?</span>
                            <div 
                                onClick={() => setHasDPF(!hasDPF)}
                                className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${hasDPF ? 'bg-[#15803d]' : 'bg-gray-300'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${hasDPF ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center text-xs text-gray-400">
                        <p>Note: All 2007+ Engines are 5%.</p>
                        <p>Any vehicle with a DPF retrofit is 5%.</p>
                    </div>
                </div>
            )}

            {/* OBD TAB */}
            {activeTab === 'OBD' && (
                <div className="animate-in slide-in-from-bottom-2">
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                         <h4 className="font-bold text-[#003366] mb-1">Readiness Requirement</h4>
                         <p className="text-xs text-gray-700">For OBD tests, ensure monitors are "Ready" before starting the official run to avoid a failed test submission.</p>
                     </div>

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                         <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-500 text-xs uppercase">Monitor Checklist</div>
                         
                         <div className="divide-y divide-gray-100">
                             {Object.entries(monitors).map(([key, isReady]) => (
                                 <div key={key} onClick={() => toggleMonitor(key as keyof MonitorState)} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                                     <span className="capitalize font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                     <div className={`px-3 py-1 rounded-full text-xs font-bold ${isReady ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                         {isReady ? 'READY' : 'NOT READY'}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                     
                     <div className="mt-4 flex gap-2">
                         <button onClick={() => setAllMonitors(true)} className="flex-1 py-3 bg-gray-200 rounded-xl font-bold text-gray-600 text-xs">MARK ALL READY</button>
                         <button onClick={() => setAllMonitors(false)} className="flex-1 py-3 bg-gray-200 rounded-xl font-bold text-gray-600 text-xs">RESET</button>
                     </div>
                </div>
            )}

            {/* RECEIPT TAB */}
            {activeTab === 'RECEIPT' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                        <h3 className="font-bold text-[#003366] text-lg mb-2">Quick Receipt Generator</h3>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Customer Phone</label>
                            <input 
                                type="tel" 
                                value={customerPhone} 
                                onChange={(e) => setCustomerPhone(e.target.value)} 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#003366] outline-none"
                                placeholder="(555) 123-4567"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount ($)</label>
                                <input 
                                    type="number" 
                                    value={amount} 
                                    onChange={(e) => setAmount(e.target.value)} 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#003366] outline-none"
                                    placeholder="150.00"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">VIN (Last 6)</label>
                                <input 
                                    type="text" 
                                    value={vinLast6} 
                                    onChange={(e) => setVinLast6(e.target.value.toUpperCase())} 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#003366] outline-none uppercase"
                                    placeholder="AB1234"
                                    maxLength={6}
                                />
                            </div>
                        </div>

                        <a 
                            href={generateReceiptLink()} 
                            className={`block w-full text-center py-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${(!amount || !customerPhone) ? 'bg-gray-400 pointer-events-none' : 'bg-[#003366] hover:bg-[#002244]'}`}
                        >
                            SEND RECEIPT TEXT 💬
                        </a>
                        <p className="text-center text-[10px] text-gray-400">Opens your default SMS app with pre-filled message.</p>
                    </div>
                </div>
            )}

            {/* GUIDE TAB (NEW) */}
            {activeTab === 'GUIDE' && (
                <div className="space-y-4 animate-in slide-in-from-bottom-2 pb-10">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-[#003366]">WAGER 6500 CHEAT SHEET</h3>
                        <button onClick={handleShareGuide} className="text-[#15803d] text-xs font-bold border border-[#15803d] px-2 py-1 rounded hover:bg-[#15803d] hover:text-white transition-colors">SHARE LINK</button>
                    </div>
                    <p className="text-xs text-gray-500">Based on SAE J1667 Snap-Acceleration Test.</p>

                    {/* SECTION 1: PREP */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                         <div className="bg-gray-100 p-3 font-bold text-[#003366] text-sm flex items-center gap-2">
                             <div className="bg-[#003366] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">1</div>
                             Vehicle Prep
                         </div>
                         <div className="p-4 text-sm text-gray-700 space-y-2">
                             <ul className="list-disc pl-5 space-y-1">
                                 <li><strong>Safety First:</strong> Chock wheels, Transmission in Neutral (Manual) or Park (Auto).</li>
                                 <li><strong>Temperature:</strong> Engine must be at normal operating temp (Oil {'>'} 140°F). Check gauges.</li>
                                 <li><strong>Governor:</strong> Verify RPM governor is working. Do not test if engine overspeeds.</li>
                                 <li><strong>Inspect:</strong> Check for exhaust leaks. Large leaks invalidate the test.</li>
                             </ul>
                         </div>
                    </div>

                    {/* SECTION 2: WAGER SETUP */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                         <div className="bg-gray-100 p-3 font-bold text-[#003366] text-sm flex items-center gap-2">
                             <div className="bg-[#003366] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">2</div>
                             Wager Setup
                         </div>
                         <div className="p-4 text-sm text-gray-700 space-y-2">
                             <ul className="list-disc pl-5 space-y-1">
                                 <li><strong>Power Up:</strong> Turn on Wager 6500 & Wireless Tablet/Printer.</li>
                                 <li><strong>Zero/Span:</strong> Perform self-calibration (Zero/Span) away from smoke.</li>
                                 <li><strong>Mount Head:</strong> Attach optical head to stack. Ensure tube is <u>parallel</u> to exhaust flow.</li>
                                 <li><strong>RPM Sensor:</strong>
                                    <ul className="list-disc pl-4 mt-1 text-xs text-gray-500">
                                        <li>Standard: Clamp on injector line or piezo sensor.</li>
                                        <li>Battery Ripple: Connect to battery terminals (Red/Black).</li>
                                    </ul>
                                 </li>
                             </ul>
                         </div>
                    </div>

                    {/* SECTION 3: THE TEST */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                         <div className="bg-gray-100 p-3 font-bold text-[#003366] text-sm flex items-center gap-2">
                             <div className="bg-[#003366] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">3</div>
                             The Test (3 + 3)
                         </div>
                         <div className="p-4 text-sm text-gray-700 space-y-2">
                             <div className="border-l-4 border-yellow-400 pl-3 mb-2">
                                 <p className="font-bold text-xs uppercase text-gray-500">Phase 1: Clean Out</p>
                                 <p>Perform <strong>3 preliminary snaps</strong> to clear loose soot. Do not record these.</p>
                             </div>
                             <div className="border-l-4 border-green-500 pl-3">
                                 <p className="font-bold text-xs uppercase text-gray-500">Phase 2: Official Test</p>
                                 <p>Perform <strong>3 official snaps</strong>.</p>
                                 <ul className="list-disc pl-4 mt-1 text-xs">
                                     <li>Pedal to floor rapidly (High Idle).</li>
                                     <li>Hold 1-2 seconds. Release.</li>
                                     <li>Wait for idle (10-15 sec). Repeat.</li>
                                 </ul>
                             </div>
                             <div className="mt-2 bg-blue-50 p-2 rounded text-xs text-blue-800">
                                 <strong>Validation Rule:</strong> The difference between the highest and lowest reading must be within <strong>5% opacity</strong>. If not, repeat snaps until 3 consecutive snaps align.
                             </div>
                         </div>
                    </div>

                    {/* SECTION 4: MOTORHOMES & OLDER TRUCKS */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                         <div className="bg-gray-100 p-3 font-bold text-[#003366] text-sm flex items-center gap-2">
                             <div className="bg-[#003366] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">4</div>
                             Vehicle Specifics
                         </div>
                         <div className="p-4 text-sm text-gray-700 space-y-4">
                             <div>
                                 <p className="font-bold text-[#15803d] text-xs uppercase mb-1">🚐 Motorhomes (RV)</p>
                                 <ul className="list-disc pl-5 space-y-1">
                                     <li><strong>Exemption:</strong> Most are exempt from OBD, but MUST pass smoke if {'>'}14,000 GVWR.</li>
                                     <li><strong>RPM Signal:</strong> Rear engine access is hard. Use <strong>Battery Ripple</strong> method on the chassis battery or alternator if accessible.</li>
                                     <li><strong>Pipe Shape:</strong> Many have curved turn-downs. Use the Wager curved probe adapter if available, or insert standard probe deep enough to center in flow.</li>
                                 </ul>
                             </div>
                             <div className="h-px bg-gray-200"></div>
                             <div>
                                 <p className="font-bold text-orange-600 text-xs uppercase mb-1">🚚 Older Trucks (Pre-OBD)</p>
                                 <ul className="list-disc pl-5 space-y-1">
                                     <li><strong>Smoke Limit:</strong>
                                         <br/>1991-1995: 30%
                                         <br/>1996-2006: 20%
                                         <br/>DPF Retrofit: 5% (Regardless of year)
                                     </li>
                                     <li><strong>Technique:</strong> Older governors cut in slower. Ensure full pedal depression to get accurate fuel delivery.</li>
                                 </ul>
                             </div>
                         </div>
                    </div>

                    {/* SECTION 5: CARB UPLOAD */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                         <div className="bg-gray-100 p-3 font-bold text-[#003366] text-sm flex items-center gap-2">
                             <div className="bg-[#003366] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">5</div>
                             Upload to CARB (CTC-VIS)
                         </div>
                         <div className="p-4 text-sm text-gray-700 space-y-2">
                             <ol className="list-decimal pl-5 space-y-2">
                                 <li><strong>Export Data:</strong> Connect Wager Tablet to PC. Export test file (XML/JSON/CSV) to desktop.</li>
                                 <li><strong>Log In:</strong> Go to <a href="https://cleantruckcheck.arb.ca.gov" target="_blank" className="text-blue-600 underline font-bold">CTC-VIS Portal</a>.</li>
                                 <li><strong>Select Fleet:</strong> Navigate to the customer's fleet.</li>
                                 <li><strong>Upload:</strong> Click "Compliance" &rarr; "Upload Smoke Test".</li>
                                 <li><strong>Attach:</strong> Select the file exported from the Wager 6500.</li>
                                 <li><strong>Verify:</strong> Ensure status changes to <span className="text-[#15803d] font-bold">COMPLIANT</span>.</li>
                             </ol>
                             <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800 mt-2">
                                 <strong>Tip:</strong> If upload fails, manually enter the opacity reading and "Test Date" in the manual entry form on CTC-VIS. Keep printout for 2 years.
                             </div>
                         </div>
                    </div>

                    <div className="text-center pt-4 pb-8">
                        <p className="text-xs text-gray-400">NorCal Mobile Carb Testing • 617-359-6953</p>
                    </div>

                </div>
            )}

        </div>
    </div>
  );
};

export default TesterDashboard;