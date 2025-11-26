import React, { useState, useRef } from 'react';
import { scoutTruckLead } from '../services/geminiService';
import { Lead } from '../types';

const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SCOUT' | 'LEADS' | 'TRACKING' | 'FINANCIALS'>('SCOUT');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [scouting, setScouting] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tracking State
  const [clientName, setClientName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScouting(true);
    try {
        const lead = await scoutTruckLead(file);
        setCurrentLead(lead);
        setLeads(prev => [lead, ...prev]);
        setActiveTab('LEADS');
    } catch (err) {
        alert('Scout analysis failed.');
    } finally {
        setScouting(false);
    }
  };

  const generateClientLink = () => {
      if (!clientName) return;
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/?client=${encodeURIComponent(clientName)}`;
      setGeneratedLink(link);
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedLink);
      alert('Link copied! Send this to your client.');
  };

  const projections = [
      { year: 2026, trucks: 2500, testsPerYear: 2, totalTests: 5000, price: 130, revenue: 650000 },
      { year: 2027, trucks: 2700, testsPerYear: 4, totalTests: 10800, price: 135, revenue: 1458000 },
      { year: 2028, trucks: 2916, testsPerYear: 4, totalTests: 11664, price: 140, revenue: 1632960 },
      { year: 2029, trucks: 3150, testsPerYear: 4, totalTests: 12600, price: 145, revenue: 1827000 },
      { year: 2030, trucks: 3400, testsPerYear: 4, totalTests: 13600, price: 150, revenue: 2040000 },
  ];

  const syncToZapier = (lead: Lead) => {
      alert(`Syncing ${lead.companyName} to Zapier Webhook... \n(Simulation: Data sent to Google Sheets/CRM)`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-[#003366] overflow-hidden mb-20 min-h-[80vh]">
        <div className="bg-[#003366] text-white p-4 flex justify-between items-center">
            <div>
                <h2 className="font-bold text-xl tracking-widest">NORCAL SCOUT ADMIN</h2>
                <div className="flex items-center gap-2 mt-1">
                     <div className="w-2 h-2 bg-[#00A651] rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-mono text-gray-300">SYSTEM READY FOR DEPLOYMENT v1.0</span>
                </div>
            </div>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">INTERNAL 1225</span>
        </div>

        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
            <button className={`flex-1 p-4 font-bold text-sm whitespace-nowrap ${activeTab === 'SCOUT' ? 'text-[#003366] border-b-4 border-[#00A651] bg-white' : 'text-gray-400'}`} onClick={() => setActiveTab('SCOUT')}>📷 SCOUT</button>
            <button className={`flex-1 p-4 font-bold text-sm whitespace-nowrap ${activeTab === 'LEADS' ? 'text-[#003366] border-b-4 border-[#00A651] bg-white' : 'text-gray-400'}`} onClick={() => setActiveTab('LEADS')}>📋 LEADS</button>
            <button className={`flex-1 p-4 font-bold text-sm whitespace-nowrap ${activeTab === 'TRACKING' ? 'text-[#003366] border-b-4 border-[#00A651] bg-white' : 'text-gray-400'}`} onClick={() => setActiveTab('TRACKING')}>🎯 LINKS</button>
            <button className={`flex-1 p-4 font-bold text-sm whitespace-nowrap ${activeTab === 'FINANCIALS' ? 'text-[#003366] border-b-4 border-[#00A651] bg-white' : 'text-gray-400'}`} onClick={() => setActiveTab('FINANCIALS')}>💰 EMPIRE</button>
        </div>

        <div className="p-4">
            {activeTab === 'SCOUT' && (
                <div className="text-center py-10 space-y-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center border-4 border-[#003366]">
                        <span className="text-4xl">🚛</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#003366]">Highway Scout Mode</h3>
                    <p className="text-gray-500 max-w-md mx-auto">Take a photo of a truck, door logo, or fleet yard. AI will extract company info, draft a sales email, and create a social post.</p>
                    <button onClick={() => fileInputRef.current?.click()} disabled={scouting} className="w-full max-w-xs mx-auto p-6 bg-[#00A651] text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-[#008a42] transition-transform active:scale-95">
                        {scouting ? 'ANALYZING...' : '📸 CAPTURE LEAD'}
                    </button>
                    <input type="file" ref={fileInputRef} accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
                </div>
            )}

            {activeTab === 'LEADS' && (
                <div className="space-y-6">
                    {leads.length === 0 && <div className="text-center text-gray-400 py-10">No leads captured yet. Go to Scout Camera.</div>}
                    {leads.map(lead => (
                        <div key={lead.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-lg text-[#003366]">{lead.companyName}</h4>
                                    <p className="text-xs text-gray-500">{lead.industry} • {lead.location}</p>
                                    <p className="text-xs font-mono text-[#00A651]">{lead.phone} {lead.dot ? `• DOT: ${lead.dot}` : ''}</p>
                                </div>
                                <button onClick={() => syncToZapier(lead)} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200 font-bold">⚡ ZAPIER</button>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg mb-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Email Draft</p>
                                <p className="text-xs text-gray-700 whitespace-pre-wrap line-clamp-3">{lead.emailDraft}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'TRACKING' && (
                <div className="max-w-md mx-auto py-6">
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center mb-6">
                        <div className="text-4xl mb-4">🔗</div>
                        <h3 className="font-bold text-[#003366] text-lg mb-2">Client Link Generator</h3>
                        <p className="text-sm text-gray-600 mb-6">Create a personalized link for a fleet manager. When they open it, they'll see a custom welcome message.</p>
                        
                        <div className="space-y-3">
                            <div className="text-left">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Client Name</label>
                                <input 
                                    type="text" 
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="e.g. FedEx Ground" 
                                    className="w-full p-3 border rounded-xl font-bold text-[#003366]"
                                />
                            </div>
                            <button onClick={generateClientLink} className="w-full py-3 bg-[#003366] text-white rounded-xl font-bold hover:bg-[#002244]">
                                Generate Link
                            </button>
                        </div>
                    </div>

                    {generatedLink && (
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200 animate-in slide-in-from-top-2">
                            <p className="text-xs font-bold text-green-800 mb-2 uppercase">Ready to Share:</p>
                            <div className="bg-white p-3 rounded border border-gray-200 text-xs font-mono break-all mb-3 text-gray-600">
                                {generatedLink}
                            </div>
                            <button onClick={copyToClipboard} className="w-full py-2 bg-[#00A651] text-white rounded-lg font-bold text-sm shadow-sm hover:bg-[#008a42]">
                                Copy to Clipboard
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'FINANCIALS' && (
                <div className="overflow-x-auto">
                    <h3 className="text-[#003366] font-bold mb-4">Revenue Projections (2026-2030)</h3>
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-white bg-[#003366] uppercase">
                            <tr>
                                <th className="px-4 py-3">Year</th>
                                <th className="px-4 py-3">Trucks</th>
                                <th className="px-4 py-3">Tests/Yr</th>
                                <th className="px-4 py-3">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projections.map((row, idx) => (
                                <tr key={row.year} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 border-b'}>
                                    <td className="px-4 py-3 font-bold">{row.year}</td>
                                    <td className="px-4 py-3">{row.trucks.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">{row.testsPerYear}x</td>
                                    <td className="px-4 py-3 font-bold text-[#00A651]">${row.revenue.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
  );
};

export default AdminView;