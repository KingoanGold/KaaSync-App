"use client";
/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { 
  Heart, Flame, Sparkles, ChevronRight, 
  Users, ArrowLeft, Gamepad2, 
  Star, Lock, Activity, Wind, BookOpen, 
  Compass, User, Shield, EyeOff, Eye, 
  MessageCircle, Music, CheckCircle2, 
  Timer, Zap, Info, Search 
} from 'lucide-react';

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCY-gRv2rOrLy8LgxHn5cyd5937jXmrypw",
  authDomain: "kamasync-52671.firebaseapp.com",
  projectId: "kamasync-52671",
  storageBucket: "kamasync-52671.firebasestorage.app",
  messagingSenderId: "211532217086",
  appId: "1:211532217086:web:7a6ed699c878c6995303af",
  measurementId: "G-Q7M6LE859T"
};

// --- DONNÉES ---
const CATEGORIES = [
  { id: 'Face à face', icon: <Users size={14}/>, color: 'from-blue-500/20 to-blue-900/20', text: 'text-blue-400' },
  { id: 'Par derrière', icon: <Flame size={14}/>, color: 'from-orange-500/20 to-orange-900/20', text: 'text-orange-400' },
  { id: 'Au-dessus', icon: <Activity size={14}/>, color: 'from-rose-500/20 to-rose-900/20', text: 'text-rose-400' },
  { id: 'De côté', icon: <Heart size={14}/>, color: 'from-pink-500/20 to-pink-900/20', text: 'text-pink-400' },
  { id: 'Debout & Acrobatique', icon: <Wind size={14}/>, color: 'from-emerald-500/20 to-emerald-900/20', text: 'text-emerald-400' },
  { id: 'Sur Mobilier', icon: <Gamepad2 size={14}/>, color: 'from-purple-500/20 to-purple-900/20', text: 'text-purple-400' },
  { id: 'Oral & Préliminaires', icon: <Sparkles size={14}/>, color: 'from-amber-500/20 to-amber-900/20', text: 'text-amber-400' },
  { id: 'Angles & Tweaks', icon: <Lock size={14}/>, color: 'from-cyan-500/20 to-cyan-900/20', text: 'text-cyan-400' },
  { id: 'Sensorielles', icon: <Star size={14}/>, color: 'from-indigo-500/20 to-indigo-900/20', text: 'text-indigo-400' }
];

const GAMES_DATA = {
  truths: ["Quel est ton fantasme le plus inavoué ?", "Quelle partie de mon corps préfères-tu ?", "Raconte-moi le rêve le plus érotique que tu aies fait.", "Lieu risqué ?", "Chose la plus folle ?", "Jouet pour la vie ?", "Dominer ou être dominé(e) ?", "Position préférée ?", "Fétichisme secret ?"],
  dares: ["Masse-moi le dos (3 min).", "Embrasse-moi avec un glaçon.", "Bande-moi les yeux : devine un goût.", "Strip-tease sensuel.", "Embrasse mon ventre.", "Enlève un vêtement avec les dents.", "Masse mes cuisses (2 min).", "Attache mes mains (3 min)."],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "les Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins", "le Sexe", "les Reins"],
};

const TIPS_DATA = [
  { id: 't1', title: "Le consentement", cat: "Communication", icon: <Shield/>, content: "Le consentement est un dialogue continu et enthousiaste. C'est la base de tout plaisir partagé." },
  { id: 't2', title: "Musique idéale", cat: "Sensorielles", icon: <Music/>, content: "Utilisez un tempo de 60-80 BPM (rythme cardiaque au repos) pour synchroniser vos corps." },
  { id: 't14', title: "Massage sensuel", cat: "Préliminaires", icon: <Activity/>, content: "Utilisez de l'huile chauffée et alternez entre effleurements et pressions plus fortes." },
  { id: 't15', title: "L'art du Dirty Talk", cat: "Communication", icon: <MessageCircle/>, content: "Commencez par chuchoter ce que vous ressentez, pas besoin d'être cru tout de suite." }
];

const POSITIONS_DATA = [
  { n: "Le Missionnaire", c: "Face à face", d: 1, s: 1, desc: "Face à face classique.", v: "Placez un coussin sous les hanches." },
  { n: "La Levrette", c: "Par derrière", d: 2, s: 4, desc: "À quatre pattes.", v: "Guidage par les hanches." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Genoux aux oreilles.", v: "Pression profonde." },
  { n: "Sphinx", c: "Par derrière", d: 2, s: 3, desc: "Allongé sur le ventre.", v: "Très sensoriel." },
  { n: "Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Partenaire assis dessus.", v: "Contrôle total du rythme." },
  { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Porter le partenaire.", v: "S'appuyer contre un mur." }
];

const FULL_CATALOG = POSITIONS_DATA.map((p, i) => ({
  id: `p${i}`, name: p.n, cat: p.c, diff: p.d, spice: p.s, desc: p.desc, v: p.v
}));

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('explorer');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [discreetMode, setDiscreetMode] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [activeGame, setActiveGame] = useState(null);

  // 1. Montage du client (Fix Safari/iPhone Hydration)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 2. Initialisation Firebase sécurisée
  useEffect(() => {
    if (!isClient) return;

    const timeout = setTimeout(() => setLoading(false), 3000); // Sécurité si Firebase bloque

    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const auth = getAuth(app);
      
      const unsub = onAuthStateChanged(auth, (u) => {
        if (!u) signInAnonymously(auth).catch(() => {});
        setLoading(false);
        clearTimeout(timeout);
      });

      return () => { unsub(); clearTimeout(timeout); };
    } catch (e) {
      setLoading(false);
    }
  }, [isClient]);

  const filteredPositions = useMemo(() => {
    return FULL_CATALOG.filter(pos => 
      pos.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const triggerGame = (type) => {
    let res = "";
    if (type === 'truth') res = GAMES_DATA.truths[Math.floor(Math.random() * GAMES_DATA.truths.length)];
    if (type === 'dare') res = GAMES_DATA.dares[Math.floor(Math.random() * GAMES_DATA.dares.length)];
    if (type === 'dice') {
      res = `${GAMES_DATA.diceActions[Math.floor(Math.random() * 8)]} ➔ ${GAMES_DATA.diceZones[Math.floor(Math.random() * 8)]}`;
    }
    setGameResult(res);
  };

  if (!isClient) return null;

  if (loading) return (
    <div className="h-[100dvh] bg-slate-950 flex items-center justify-center text-rose-500">
      <Flame className="animate-pulse" size={48} />
    </div>
  );

  return (
    <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      
      {/* HEADER FIXE */}
      <header className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2 text-rose-500 font-black text-2xl tracking-tighter">
          <Flame fill="currentColor" size={28} /> KAMA<span className="text-white">SYNC</span>
        </div>
        <button onClick={() => setDiscreetMode(!discreetMode)} className="text-slate-400 p-2 active:opacity-50">
          {discreetMode ? <EyeOff size={22} className="text-emerald-400" /> : <Eye size={22} />}
        </button>
      </header>

      {/* CONTENU SCROLLABLE */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y pb-32">
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none" 
                placeholder="Rechercher..." 
              />
            </div>

            {CATEGORIES.map(cat => {
              const items = filteredPositions.filter(p => p.cat === cat.id);
              if (items.length === 0) return null;
              return (
                <section key={cat.id} className="space-y-4">
                  <h3 className={`font-bold text-xs uppercase tracking-widest ${cat.text}`}>{cat.id}</h3>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {items.map(pos => (
                      <div 
                        key={pos.id} 
                        onClick={() => setSelectedPosition(pos)} 
                        className={`shrink-0 w-44 bg-gradient-to-br ${cat.color} p-5 rounded-[2rem] border border-white/5 active:scale-95 transition-transform`}
                      >
                         <h4 className="font-bold text-sm leading-tight">{discreetMode ? "Position" : pos.name}</h4>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {activeTab === 'jeux' && !activeGame && (
          <div className="p-6 space-y-4">
            <button onClick={() => setActiveGame('truth')} className="w-full bg-slate-900 p-6 rounded-3xl border border-white/5 flex justify-between items-center active:bg-slate-800">
               <span className="font-bold">ACTION OU VÉRITÉ</span>
               <ChevronRight className="text-rose-500" />
            </button>
            <button onClick={() => setActiveGame('dice')} className="w-full bg-slate-900 p-6 rounded-3xl border border-white/5 flex justify-between items-center active:bg-slate-800">
               <span className="font-bold">DÉS COQUINS</span>
               <ChevronRight className="text-purple-500" />
            </button>
          </div>
        )}

        {activeTab === 'conseils' && (
          <div className="p-6 space-y-3">
             {TIPS_DATA.map(tip => (
               <div key={tip.id} onClick={() => setSelectedTip(tip)} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex gap-4 items-center active:bg-slate-800">
                 <div className="text-indigo-400">{tip.icon}</div>
                 <h4 className="font-bold text-sm">{tip.title}</h4>
               </div>
             ))}
          </div>
        )}
      </main>

      {/* NAVIGATION MOBILE FIXE */}
      <nav className="fixed bottom-0 w-full bg-slate-950/90 backdrop-blur-2xl border-t border-white/5 px-8 pt-4 pb-10 flex justify-between items-center z-50">
        {[
          {id:'explorer', icon:<Compass size={24}/>, label: 'Explorer'},
          {id:'jeux', icon:<Gamepad2 size={24}/>, label: 'Jeux'},
          {id:'conseils', icon:<BookOpen size={24}/>, label: 'Conseils'},
          {id:'profil', icon:<User size={24}/>, label: 'Profil'}
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => {setActiveTab(tab.id); setActiveGame(null);}} 
            className={`flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-rose-500' : 'text-slate-600'}`}
          >
            {tab.icon}
            <span className="text-[9px] font-bold uppercase">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* MODALE JEUX */}
      {activeGame && (
        <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col p-6 animate-in fade-in duration-300">
          <button onClick={() => {setActiveGame(null); setGameResult(null);}} className="mb-8 self-start text-slate-400"><ArrowLeft size={30}/></button>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full bg-slate-900 p-10 rounded-[3rem] border border-rose-500/20 text-center text-xl font-bold">
              {gameResult || "Cliquez pour lancer"}
            </div>
            <button onClick={() => triggerGame(activeGame)} className="mt-10 w-full max-w-xs bg-rose-600 py-5 rounded-2xl font-black active:scale-95 transition-transform">
              LANCER LE DÉ
            </button>
          </div>
        </div>
      )}

      {/* MODALE POSITION */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col animate-in slide-in-from-right duration-300">
          <header className="p-6"><button onClick={() => setSelectedPosition(null)} className="p-2 text-slate-400"><ArrowLeft size={30}/></button></header>
          <div className="px-8 pb-32 overflow-y-auto">
            <h2 className="text-4xl font-black tracking-tighter mb-6">{discreetMode ? "Position" : selectedPosition.name}</h2>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 text-lg leading-relaxed italic text-slate-300">
              "{discreetMode ? "Détails masqués" : selectedPosition.desc}"
            </div>
            {!discreetMode && (
              <div className="mt-6 bg-rose-500/10 p-6 rounded-[2rem] border border-rose-500/20">
                <p className="text-rose-300 font-bold text-sm">Conseil : {selectedPosition.v}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALE CONSEIL */}
      {selectedTip && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setSelectedTip(null)} className="mb-8 self-start p-2 text-slate-400"><ArrowLeft size={30}/></button>
          <h2 className="text-3xl font-black mb-8 px-4 leading-none">{selectedTip.title}</h2>
          <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 text-slate-300 text-lg leading-relaxed mx-4">
            {selectedTip.content}
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}
