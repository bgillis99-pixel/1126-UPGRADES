import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react";
import VinChecker from './components/VinChecker';
import ChatAssistant from './components/ChatAssistant';
import MediaTools from './components/MediaTools';
import ProfileView from './components/ProfileView';
import AdminView from './components/AdminView';
import TesterLocator from './components/TesterLocator';
import EducationCenter from './components/EducationCenter';
import TesterDashboard from './components/TesterDashboard';
import { AppView, User, HistoryItem } from './types';

const USERS_KEY = 'vin_diesel_users';
const CURRENT_USER_KEY = 'vin_diesel_current_user';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPwaBanner, setShowPwaBanner] = useState(false);
  
  // Client Welcome State
  const [welcomeClient, setWelcomeClient] = useState<string | null>(null);

  // Tester Search State
  const [searchZip, setSearchZip] = useState('');

  // iOS Detection
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Full Screen QR for Field Sharing
  const [fullScreenQR, setFullScreenQR] = useState(false);

  // Always use the production URL for sharing, regardless of where the app is currently running (e.g. localhost or vercel preview)
  const shareUrl = 'https://carbcleantruckcheck.app/';
  
  const shareTitle = "Mobile Carb Check";
  const shareText = "Keep your fleet compliant. Check heavy-duty diesel compliance instantly and find certified smoke testers.";
  const shareBody = `${shareText} Download the app here: ${shareUrl}`;

  useEffect(() => {
    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(checkIOS);
  }, []);

  useEffect(() => {
    // Check for Client Parameter & View Parameter (for Shortcuts)
    const params = new URLSearchParams(window.location.search);
    const client = params.get('client');
    const view = params.get('view');

    if (client) {
      setWelcomeClient(decodeURIComponent(client));
    }
    
    if (view === 'chat') {
        setCurrentView(AppView.ASSISTANT);
    }

    // Clean URL without refresh if we processed params
    if (client || view) {
        window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPwaBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const currentEmail = localStorage.getItem(CURRENT_USER_KEY);
    if (currentEmail) {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      if (users[currentEmail]) {
        setUser({ email: currentEmail, history: users[currentEmail].history || [] });
      }
    }
  }, []);

  const handleLogin = (email: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (users[email]) {
      localStorage.setItem(CURRENT_USER_KEY, email);
      setUser({ email, history: users[email].history || [] });
    } else {
        alert('User not found. Please register.');
    }
  };

  const handleRegister = (email: string) => {
     const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
     if (users[email]) {
         alert('User already exists.');
         return;
     }
     users[email] = { history: [] };
     localStorage.setItem(USERS_KEY, JSON.stringify(users));
     handleLogin(email);
  };

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setCurrentView(AppView.HOME);
  };

  const handleAddToHistory = (value: string, type: 'VIN' | 'ENTITY' | 'TRUCRS') => {
    if (!user) return;
    
    const newItem: HistoryItem = {
        id: Date.now().toString(),
        value,
        type,
        timestamp: Date.now()
    };

    const updatedHistory = [newItem, ...user.history];
    const updatedUser = { ...user, history: updatedHistory };
    
    setUser(updatedUser);
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (users[user.email]) {
        users[user.email].history = updatedHistory;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  };

  // --- SOCIAL SHARING LOGIC ---

  const handleSocialShare = (platform: 'x' | 'facebook' | 'reddit') => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(shareText);
    let link = '';

    switch(platform) {
      case 'x':
        link = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        link = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'reddit':
        link = `https://www.reddit.com/submit?url=${url}&title=${encodeURIComponent(shareTitle)}`;
        break;
    }
    
    window.open(link, '_blank', 'width=600,height=400');
  };

  const handleInstagramShare = async () => {
    // IG doesn't support web share links. Copy to clipboard is best practice.
    await handleCopyLink();
    alert("Link copied! Open Instagram to paste it into your Story or Bio.");
  };

  const handleSystemShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
         title: shareTitle,
         text: shareText,
         url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      alert("System sharing is not available.");
    }
  };

  const handleCopyLink = async () => {
      try {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
      } catch (e) {
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Link copied to clipboard!');
      }
  };

  const handleInstallClick = async () => {
    if (isIOS) {
        setShowIosInstall(true);
    } else if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPwaBanner(false);
        }
    } else {
        alert("To install: Tap your browser menu (⋮) and select 'Add to Home Screen'.");
    }
  };

  const handleFindTester = (zip: string) => {
      setSearchZip(zip);
      setCurrentView(AppView.TESTER_LOCATOR);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans text-[#003366]">
      <Analytics />
      {!isOnline && (
        <div className="bg-gray-800 text-white text-xs text-center py-1 font-bold tracking-wider">
          OFFLINE MODE: VIEWING HISTORY ONLY
        </div>
      )}

      {welcomeClient && (
         <div className="bg-[#15803d] text-white p-3 text-center animate-in slide-in-from-top flex justify-between items-center shadow-lg relative z-50">
            <span className="font-bold text-sm tracking-wide">👋 Welcome, {welcomeClient} Team!</span>
            <button onClick={() => setWelcomeClient(null)} aria-label="Close welcome banner" className="bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
         </div>
      )}
      
      <a href="tel:6173596953" className="bg-[#003366] text-white text-xs text-center py-2 font-medium tracking-wide px-2 block hover:bg-[#002244] active:bg-[#004488] transition-colors">
        NEED IMMEDIATE TESTING? CALL <span className="text-white font-black text-sm underline decoration-white/50 underline-offset-2">617-359-6953</span> • SERVING CA STATEWIDE
      </a>

      {currentView !== AppView.TESTER_LOCATOR && (
        <header className="bg-white pt-3 pb-3 px-4 text-center shadow-sm sticky top-0 z-20 border-b-2 border-[#15803d] flex justify-between items-center">
            
            <div className="flex flex-col items-start leading-none select-none" onClick={() => setCurrentView(AppView.HOME)}>
                <span className="text-[#003366] font-black text-2xl tracking-tighter">MOBILE</span>
                <span className="text-[#15803d] font-black text-2xl tracking-tighter -mt-1">CARB</span>
                <div className="flex items-center gap-1 mt-0.5">
                    <div className="h-[2px] w-3 bg-[#15803d]"></div>
                    <span className="text-[#003366] font-bold text-[10px] tracking-[0.2em]">TESTING CA</span>
                </div>
            </div>

            <button 
                onClick={() => setShowInstall(true)} 
                className="bg-[#15803d] text-white px-4 py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#166534] active:scale-95 active:bg-[#14532d] transition-all flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                SHARE APP
            </button>
        </header>
      )}

      {showInstall && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowInstall(false)}>
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-[#003366]">Share & Install</h3>
                      <button onClick={() => setShowInstall(false)} aria-label="Close install modal" className="text-gray-400 hover:text-gray-600 p-2 text-2xl leading-none active:scale-90 transition-transform">&times;</button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-6">Help friends keep their trucks compliant.</p>
                  
                  <div className="relative group cursor-pointer" onClick={() => setFullScreenQR(true)}>
                      <div className="bg-white p-2 inline-block mb-4 border-2 border-gray-100 rounded-2xl shadow-inner transition-transform hover:scale-105">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}&color=003366`} alt="QR Code" className="w-32 h-32" />
                      </div>
                      <p className="text-xs text-[#15803d] font-bold uppercase tracking-wide mb-4 animate-pulse">Tap to Enlarge</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                      
                      {/* NEW SOCIAL GRID */}
                      <div className="grid grid-cols-4 gap-2 mb-2">
                          <button onClick={() => handleSocialShare('x')} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                              </div>
                              <span className="text-[10px] font-bold text-gray-600">X</span>
                          </button>
                          
                          <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center">
                                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.376h3.428l-.532 3.667h-2.896v7.981A10.302 10.302 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a10.302 10.302 0 0 0 7.101 11.691z"/></svg>
                              </div>
                              <span className="text-[10px] font-bold text-gray-600">Facebook</span>
                          </button>

                          <button onClick={() => handleSocialShare('reddit')} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 bg-[#FF4500] text-white rounded-full flex items-center justify-center">
                                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
                              </div>
                              <span className="text-[10px] font-bold text-gray-600">Reddit</span>
                          </button>

                          <button onClick={handleInstagramShare} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] text-white rounded-full flex items-center justify-center">
                                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                              </div>
                              <span className="text-[10px] font-bold text-gray-600">IG Copy</span>
                          </button>
                      </div>

                      <button 
                          onClick={handleSystemShare}
                          className="w-full py-3 bg-[#003366] text-white font-bold rounded-xl shadow-lg hover:bg-[#002244] flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                          Share to Others
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                         <a 
                            href={`sms:?body=${encodeURIComponent(shareBody)}`}
                            className="w-full py-3 bg-green-100 text-green-800 font-bold rounded-xl border border-green-200 flex items-center justify-center gap-2 hover:bg-green-200 active:scale-95 transition-transform no-underline"
                         >
                             💬 Text
                         </a>
                         <a 
                            href={`mailto:?subject=Mobile Carb Check App&body=${encodeURIComponent(shareBody)}`}
                            className="w-full py-3 bg-blue-100 text-blue-800 font-bold rounded-xl border border-blue-200 flex items-center justify-center gap-2 hover:bg-blue-200 active:scale-95 transition-transform no-underline"
                         >
                             📧 Email
                         </a>
                      </div>

                      <button 
                         onClick={handleCopyLink}
                         className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-transform"
                      >
                          🔗 Copy Link
                      </button>
                  </div>
              </div>
          </div>
      )}

      {fullScreenQR && (
          <div className="fixed inset-0 z-[150] bg-[#003366] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-200" onClick={() => setFullScreenQR(false)}>
              <div className="text-white text-center mb-8">
                  <h2 className="text-3xl font-black mb-2">SCAN TO INSTALL</h2>
                  <p className="text-gray-300">Point customer camera here</p>
              </div>
              <div className="bg-white p-4 rounded-3xl shadow-2xl">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}&color=003366`} alt="Full Screen QR" className="w-64 h-64 sm:w-80 sm:h-80" />
              </div>
              <button onClick={() => setFullScreenQR(false)} className="mt-12 bg-white/10 text-white px-8 py-3 rounded-full font-bold border border-white/20 hover:bg-white/20">
                  CLOSE
              </button>
          </div>
      )}

      {showIosInstall && (
          <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex flex-col justify-end pb-8 animate-in fade-in duration-300" onClick={() => setShowIosInstall(false)}>
               <div className="bg-white mx-4 rounded-2xl p-6 text-center relative animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-lg">
                        <svg className="w-8 h-8 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   </div>
                   
                   <h3 className="mt-4 text-xl font-black text-[#003366] mb-2">Install for iPhone</h3>
                   <p className="text-gray-500 mb-6">Install this app to your home screen for instant access.</p>
                   
                   <div className="text-left space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                       <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#003366]">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                           </div>
                           <span className="font-bold text-sm text-gray-700">1. Tap the Share button below</span>
                       </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#003366]">
                               <span className="text-xl leading-none">+</span>
                           </div>
                           <span className="font-bold text-sm text-gray-700">2. Scroll down & tap "Add to Home Screen"</span>
                       </div>
                   </div>

                   <button onClick={() => setShowIosInstall(false)} className="mt-6 w-full py-3 bg-[#003366] text-white font-bold rounded-xl active:scale-95 transition-transform">
                       Got it
                   </button>
                   
                   <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white text-4xl animate-bounce">
                       ↓
                   </div>
               </div>
          </div>
      )}

      <main className="flex-1 p-4 overflow-y-auto pb-32">
        {currentView === AppView.HOME && (
            <VinChecker 
                onAddToHistory={handleAddToHistory} 
                onNavigateChat={() => setCurrentView(AppView.ASSISTANT)}
                onInstallApp={handleInstallClick}
                onFindTester={handleFindTester}
            />
        )}
        {currentView === AppView.TESTER_LOCATOR && (
            <TesterLocator 
                initialZip={searchZip} 
                onBack={() => setCurrentView(AppView.HOME)} 
            />
        )}
        {currentView === AppView.ASSISTANT && <ChatAssistant />}
        {currentView === AppView.EDUCATION && <EducationCenter />}
        {currentView === AppView.ANALYZE && <MediaTools />}
        {currentView === AppView.PROFILE && (
            <ProfileView 
                user={user} 
                onLogin={handleLogin} 
                onRegister={handleRegister} 
                onLogout={handleLogout}
                onAdminAccess={() => setCurrentView(AppView.ADMIN)}
                onTesterAccess={() => setCurrentView(AppView.TESTER_DASHBOARD)}
                isOnline={isOnline}
            />
        )}
        {currentView === AppView.ADMIN && <AdminView />}
        {currentView === AppView.TESTER_DASHBOARD && <TesterDashboard />}
      </main>

      <div className="pb-24 text-center text-xs text-gray-400 space-y-1">
         <p>Copyright 2026 Mobile Carb Check</p>
         <a href="mailto:info@carbcleantruckcheck.app" className="text-[#15803d] hover:underline font-bold">info@carbcleantruckcheck.app</a>
         <p className="text-[10px] font-bold">
             <a href="tel:6173596953">617-359-6953</a>
         </p>
      </div>

      {showPwaBanner && deferredPrompt && !isIOS && (
        <div className="fixed bottom-[80px] left-0 right-0 bg-[#003366] text-white p-4 z-40 flex justify-between items-center shadow-lg animate-in slide-in-from-bottom border-t-4 border-[#15803d]">
            <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg">
                     <svg className="w-6 h-6 text-[#003366]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                </div>
                <div>
                    <p className="font-bold text-sm">Install App</p>
                    <p className="text-xs text-gray-300">Add to home screen</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setShowPwaBanner(false)} aria-label="Close PWA banner" className="text-gray-400 hover:text-white p-2">✕</button>
                <button onClick={handleInstallClick} className="bg-[#15803d] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#166534] active:scale-95 transition-transform">
                    INSTALL
                </button>
            </div>
        </div>
      )}

      {currentView !== AppView.TESTER_LOCATOR && (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#003366] pb-safe pt-2 px-4 flex justify-between items-end z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] h-[80px]">
        <button 
          onClick={() => setCurrentView(AppView.HOME)}
          className={`flex flex-col items-center pb-4 w-14 transition-transform active:scale-90 duration-150 ${currentView === AppView.HOME ? '-translate-y-2' : ''}`}
        >
          <div className={`p-2 rounded-full mb-1 transition-colors ${currentView === AppView.HOME ? 'bg-[#15803d] text-white' : 'text-[#003366]'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className={`text-[9px] font-bold tracking-widest ${currentView === AppView.HOME ? 'text-[#15803d]' : 'text-gray-400'}`}>CHECK</span>
        </button>

        <button 
          onClick={() => setCurrentView(AppView.ASSISTANT)}
          className={`flex flex-col items-center pb-4 w-14 transition-transform active:scale-90 duration-150 ${currentView === AppView.ASSISTANT ? '-translate-y-2' : ''}`}
        >
           <div className={`p-2 rounded-full mb-1 transition-colors ${currentView === AppView.ASSISTANT ? 'bg-[#15803d] text-white' : 'text-[#003366]'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <span className={`text-[9px] font-bold tracking-widest ${currentView === AppView.ASSISTANT ? 'text-[#15803d]' : 'text-gray-400'}`}>CHAT</span>
        </button>

        <button 
          onClick={() => setCurrentView(AppView.EDUCATION)}
          className={`flex flex-col items-center pb-4 w-14 transition-transform active:scale-90 duration-150 ${currentView === AppView.EDUCATION ? '-translate-y-2' : ''}`}
        >
           <div className={`p-2 rounded-full mb-1 transition-colors ${currentView === AppView.EDUCATION ? 'bg-[#15803d] text-white' : 'text-[#003366]'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <span className={`text-[9px] font-bold tracking-widest ${currentView === AppView.EDUCATION ? 'text-[#15803d]' : 'text-gray-400'}`}>LEARN</span>
        </button>

        <button 
          onClick={() => setCurrentView(AppView.ANALYZE)}
          className={`flex flex-col items-center pb-4 w-14 transition-transform active:scale-90 duration-150 ${currentView === AppView.ANALYZE ? '-translate-y-2' : ''}`}
        >
           <div className={`p-2 rounded-full mb-1 transition-colors ${currentView === AppView.ANALYZE ? 'bg-[#15803d] text-white' : 'text-[#003366]'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <span className={`text-[9px] font-bold tracking-widest ${currentView === AppView.ANALYZE ? 'text-[#15803d]' : 'text-gray-400'}`}>TOOLS</span>
        </button>

        <button 
          onClick={() => setCurrentView(AppView.PROFILE)}
          className={`flex flex-col items-center pb-4 w-14 transition-transform active:scale-90 duration-150 ${currentView === AppView.PROFILE ? '-translate-y-2' : ''}`}
        >
           <div className={`p-2 rounded-full mb-1 transition-colors ${currentView === AppView.PROFILE ? 'bg-[#15803d] text-white' : 'text-[#003366]'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <span className={`text-[9px] font-bold tracking-widest ${currentView === AppView.PROFILE ? 'text-[#15803d]' : 'text-gray-400'}`}>PROFILE</span>
        </button>
      </nav>
      )}
    </div>
  );
};

export default App;