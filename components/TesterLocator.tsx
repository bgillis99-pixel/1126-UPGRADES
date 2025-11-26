import React, { useState, useEffect } from 'react';

interface Props {
  initialZip: string;
  onBack: () => void;
}

const TesterLocator: React.FC<Props> = ({ initialZip, onBack }) => {
  const [zipCode, setZipCode] = useState(initialZip);
  const [countyName, setCountyName] = useState('California');
  const [showAskForm, setShowAskForm] = useState(false);
  
  // Ask Form State
  const [askName, setAskName] = useState('');
  const [askPhone, setAskPhone] = useState('');
  const [askQuestion, setAskQuestion] = useState('');

  useEffect(() => {
    updateLocation(initialZip);
  }, [initialZip]);

  const getCountyFromZip = (zip: string) => {
      const p = parseInt(zip.substring(0, 3));
      if (isNaN(p)) return "California";

      // Approximate CA Zip Ranges
      if (p >= 900 && p <= 918) return "Los Angeles County";
      if (p >= 919 && p <= 921) return "San Diego County";
      if (p >= 922 && p <= 925) return "Inland Empire";
      if (p >= 926 && p <= 928) return "Orange County";
      if (p >= 930 && p <= 931) return "Ventura/Santa Barbara";
      if (p >= 932 && p <= 933) return "Kern County";
      if (p >= 934 && p <= 934) return "San Luis Obispo";
      if (p >= 936 && p <= 938) return "Fresno/Madera";
      if (p >= 939 && p <= 939) return "Monterey County";
      if (p >= 940 && p <= 944) return "San Mateo County";
      if (p >= 945 && p <= 948) return "Alameda/Contra Costa";
      if (p >= 949 && p <= 949) return "Marin/Sonoma";
      if (p >= 950 && p <= 951) return "Santa Clara County";
      if (p >= 952 && p <= 953) return "San Joaquin/Stanislaus";
      if (p >= 954 && p <= 955) return "North Coast";
      if (p >= 956 && p <= 958) return "Sacramento County";
      if (p >= 959 && p <= 961) return "Northern California";
      
      return "California";
  };

  const updateLocation = (val: string) => {
      setZipCode(val);
      if (val.length >= 3) {
          setCountyName(getCountyFromZip(val));
      } else {
          setCountyName("California");
      }
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLocation(e.target.value);
  };

  const handleAskSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const subject = encodeURIComponent(`Question from App User: ${askName}`);
      const body = encodeURIComponent(`Name: ${askName}\nPhone: ${askPhone}\nZip: ${zipCode}\n\nQuestion:\n${askQuestion}`);
      window.location.href = `mailto:support@norcalcarbmobile.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh]">
      
      <div className="w-full bg-[#003366] text-white p-6 rounded-b-3xl shadow-lg mb-8 relative">
          <button 
            onClick={onBack} 
            className="absolute top-6 left-4 text-white hover:text-gray-300 font-bold flex items-center gap-1"
          >
            ← Back
          </button>
          <div className="text-center mt-4">
            <h2 className="text-xl font-black tracking-tight uppercase leading-tight">
                {countyName}<br/>
                <span className="text-[#15803d]">Clean Truck Tester</span>
            </h2>
            <p className="opacity-80 text-sm mt-1">Mobile Service • We Come To You</p>
          </div>
      </div>

      <div className="w-full max-w-md px-4">
        
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-6">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Enter Zip Code</label>
            <input 
                type="tel" 
                value={zipCode} 
                onChange={handleZipChange}
                placeholder="Zip Code"
                maxLength={5}
                className="w-full p-4 text-center font-black text-4xl text-[#003366] border-b-2 border-[#003366] focus:outline-none mb-2"
            />
            <p className="text-center text-xs text-gray-400">Updating coverage for {countyName}...</p>
        </div>

        {/* CLICKABLE CARD TO CONTACT PAGE */}
        <a href="https://norcalcarbmobile.com/contact-us" target="_blank" rel="noopener noreferrer" className="block no-underline">
            <div className="bg-white border-l-8 border-[#15803d] rounded-r-2xl p-6 shadow-lg relative overflow-hidden group hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="absolute top-0 right-0 bg-[#15803d] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                    AVAILABLE NOW
                </div>
                
                <div className="mb-4">
                    <h3 className="text-2xl font-black text-[#003366] leading-none mb-1">MOBILE CARB</h3>
                    <h3 className="text-2xl font-black text-[#15803d] leading-none tracking-tight">TESTING</h3>
                    <p className="text-xs text-gray-400 font-bold mt-1">Tap to Visit Website &rarr;</p>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-full text-[#003366]">📍</div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Coverage</p>
                            <p className="text-sm font-bold text-[#003366]">{countyName} & Statewide</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                    <a href="tel:6173596953" className="flex-1 bg-[#003366] text-white py-4 rounded-xl font-bold text-center hover:bg-[#002244] transition-colors shadow-lg active:scale-[0.98]">
                        CALL 617-359-6953
                    </a>
                </div>
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                     <a href="sms:6173596953" className="block w-full bg-white border-2 border-[#003366] text-[#003366] py-3 rounded-xl font-bold text-center hover:bg-blue-50 transition-colors active:scale-[0.98]">
                        TEXT US
                    </a>
                </div>
            </div>
        </a>

        {/* ASK A TESTER SECTION */}
        <div className="mt-8 mb-12">
            {!showAskForm ? (
                <button 
                    onClick={() => setShowAskForm(true)}
                    className="w-full bg-gray-100 text-[#003366] font-bold py-4 rounded-xl border-2 border-dashed border-[#003366] hover:bg-white transition-all shadow-sm"
                >
                    Have a Question? <span className="underline">ASK A TESTER</span>
                </button>
            ) : (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-black text-[#003366]">ASK A TESTER</h3>
                        <button onClick={() => setShowAskForm(false)} className="text-gray-400 hover:text-red-500">✕</button>
                    </div>
                    <form onSubmit={handleAskSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Your Name</label>
                            <input 
                                required
                                type="text" 
                                value={askName}
                                onChange={e => setAskName(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#003366] outline-none"
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number</label>
                            <input 
                                required
                                type="tel" 
                                value={askPhone}
                                onChange={e => setAskPhone(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#003366] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Your Question</label>
                            <textarea 
                                required
                                value={askQuestion}
                                onChange={e => setAskQuestion(e.target.value)}
                                rows={3}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#003366] outline-none"
                                placeholder="e.g. Can you test 5 trucks in Fresno tomorrow?"
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full bg-[#15803d] text-white font-bold py-3 rounded-xl hover:bg-[#166534] shadow-md">
                            SEND TO SUPPORT
                        </button>
                        <p className="text-[10px] text-center text-gray-400">Emails support@norcalcarbmobile.com</p>
                    </form>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default TesterLocator;