
import React, { useState, useEffect } from 'react';

interface Props {
  initialZip: string;
  onBack: () => void;
}

const TesterLocator: React.FC<Props> = ({ initialZip, onBack }) => {
  const [zipCode, setZipCode] = useState(initialZip);
  const [showRequestForm, setShowRequestForm] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formZip, setFormZip] = useState(initialZip);
  const [vehicleType, setVehicleType] = useState('Heavy Duty (OBD + Smoke)');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [agreeToApp, setAgreeToApp] = useState(true);

  useEffect(() => {
    setFormZip(initialZip);
    setZipCode(initialZip);
  }, [initialZip]);

  const constructMessage = () => {
    // Array defined without trailing commas to ensure compatibility
    const parts = [
      "TESTING REQUEST",
      "---------------",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Zip: ${formZip}`,
      `Vehicle: ${vehicleType}`,
      `Requested Date: ${date} ${time ? '@ ' + time : ''}`,
      "",
      `Notes: ${notes}`,
      "",
      agreeToApp ? "[x] Please text me a link to the Mobile CARB App." : "[] No app link."
    ];
    return parts.join("\n").trim();
  };

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please enter Name and Phone.');
      return;
    }
    
    const body = encodeURIComponent(constructMessage());
    const subject = encodeURIComponent(`Testing Request - ${name}`);
    window.location.href = `mailto:support@norcalcarbmobile.com?subject=${subject}&body=${body}`;
  };

  const handleText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please enter Name and Phone.');
      return;
    }

    const body = encodeURIComponent(constructMessage());
    window.location.href = `sms:6173596953?body=${body}`;
  };

  return (
    <div className="pb-20">
       <div className="bg-white sticky top-0 z-10 shadow-sm border-b border-gray-200">
           <div className="flex items-center p-4">
               <button onClick={onBack} className="mr-4 text-[#003366]">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               </button>
               <h2 className="font-bold text-lg text-[#003366]">Find a Tester</h2>
           </div>
       </div>

       <div className="p-4 space-y-6">
           
           {/* SEARCH SECTION */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <label className="block text-sm font-bold text-gray-500 mb-2">SEARCH NEARBY</label>
               <div className="flex gap-2">
                   <input 
                      type="tel" 
                      value={zipCode} 
                      onChange={(e) => setZipCode(e.target.value)} 
                      placeholder="Enter Zip Code"
                      className="flex-1 p-3 border-2 border-gray-200 rounded-xl font-bold text-[#003366] text-lg focus:border-[#003366] outline-none"
                   />
                   <button className="bg-[#003366] text-white px-6 rounded-xl font-bold">GO</button>
               </div>
               
               {/* DUMMY RESULTS FOR DEMO */}
               <div className="mt-6 space-y-4">
                   <div className="border-l-4 border-[#15803d] pl-4 py-1">
                       <h4 className="font-bold text-[#003366]">NorCal Mobile Testing (Preferred)</h4>
                       <p className="text-xs text-gray-500">Servicing All Northern California</p>
                       <p className="text-xs font-bold text-[#15803d]">✓ Mobile Service Available</p>
                   </div>
                   <div className="border-l-4 border-gray-300 pl-4 py-1 opacity-60">
                       <h4 className="font-bold text-gray-600">Local Shop (3rd Party)</h4>
                       <p className="text-xs text-gray-500">Stationary Only • 15 miles away</p>
                   </div>
               </div>
           </div>

           {/* REQUEST FORM */}
           <div className="bg-gradient-to-br from-[#003366] to-[#002244] rounded-2xl p-1 shadow-lg">
               <div className="bg-white rounded-xl overflow-hidden">
                   <button 
                      onClick={() => setShowRequestForm(!showRequestForm)}
                      className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                   >
                       <div className="flex items-center gap-3">
                           <div className="bg-[#15803d] text-white p-2 rounded-lg">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           </div>
                           <div className="text-left">
                               <h3 className="font-bold text-[#003366]">Book Mobile Service</h3>
                               <p className="text-[10px] text-gray-500">We come to you. Schedule now.</p>
                           </div>
                       </div>
                       <span className={`transform transition-transform ${showRequestForm ? 'rotate-180' : ''}`}>▼</span>
                   </button>
                   
                   {showRequestForm && (
                       <div className="p-5 animate-in slide-in-from-top-2 duration-200">
                           <div className="space-y-4">
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                       <label className="text-[10px] font-bold text-gray-400 uppercase">Name</label>
                                       <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border-b-2 border-gray-200 focus:border-[#003366] outline-none text-sm font-semibold" placeholder="John Doe" />
                                   </div>
                                   <div>
                                       <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                                       <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border-b-2 border-gray-200 focus:border-[#003366] outline-none text-sm font-semibold" placeholder="(555) 123-4567" />
                                   </div>
                               </div>

                               <div className="grid grid-cols-3 gap-4">
                                   <div className="col-span-1">
                                       <label className="text-[10px] font-bold text-gray-400 uppercase">Zip</label>
                                       <input type="tel" value={formZip} onChange={(e) => setFormZip(e.target.value)} className="w-full p-2 border-b-2 border-gray-200 focus:border-[#003366] outline-none text-sm font-semibold" />
                                   </div>
                                   <div className="col-span-2">
                                       <label className="text-[10px] font-bold text-gray-400 uppercase">Vehicle Type</label>
                                       <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="w-full p-2 border-b-2 border-gray-200 focus:border-[#003366] outline-none text-sm font-semibold bg-white">
                                           <option>Heavy Duty (OBD + Smoke)</option>
                                           <option>Older Engine (Smoke/OVI)</option>
                                           <option>Motorhome / RV</option>
                                           <option>Ag / Farm Equipment</option>
                                           <option>Other</option>
                                       </select>
                                   </div>
                               </div>

                               <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                   <div>
                                       <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Preferred Date</label>
                                       <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 rounded border border-gray-200 text-xs" />
                                   </div>
                                   <div>
                                       <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Time (Tentative)</label>
                                       <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-2 rounded border border-gray-200 text-xs" />
                                   </div>
                                   <div className="col-span-2 text-[10px] text-gray-400 italic text-center">
                                       * Scheduling subject to availability in your area.
                                   </div>
                               </div>

                               <div>
                                   <label className="text-[10px] font-bold text-gray-400 uppercase">Questions / Notes</label>
                                   <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border-2 border-gray-100 rounded-lg focus:border-[#003366] outline-none text-sm" placeholder="How many trucks? Location details?"></textarea>
                               </div>

                               <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                                   <input type="checkbox" checked={agreeToApp} onChange={(e) => setAgreeToApp(e.target.checked)} className="mt-1" />
                                   <label className="text-xs text-[#003366] leading-tight cursor-pointer" onClick={() => setAgreeToApp(!agreeToApp)}>
                                       <strong>Get the App:</strong> I agree to receive a text message with a link to download the Mobile Carb App for easier compliance management.
                                   </label>
                               </div>

                               <div className="pt-2 grid grid-cols-2 gap-3">
                                   <button onClick={handleText} className="bg-[#15803d] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#166534] active:scale-95 transition-transform flex items-center justify-center gap-2">
                                       <span>💬 Text Request</span>
                                   </button>
                                   <button onClick={handleEmail} className="bg-white border-2 border-[#003366] text-[#003366] py-3 rounded-xl font-bold hover:bg-gray-50 active:scale-95 transition-transform flex items-center justify-center gap-2">
                                       <span>📧 Email</span>
                                   </button>
                               </div>
                               <p className="text-center text-[10px] text-gray-400">Faster response via Text.</p>
                           </div>
                       </div>
                   )}
               </div>
           </div>
       </div>
    </div>
  );
};

export default TesterLocator;
