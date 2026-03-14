/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, collection, 
  onSnapshot, updateDoc, arrayUnion, addDoc, deleteDoc
} from 'firebase/firestore';
import { 
  Heart, Flame, Plus, Sparkles, ChevronRight, 
  Search, Info, Users, ArrowLeft, Gamepad2, 
  Star, Dices, Lock, Activity, Wind, BookOpen, 
  Compass, User, Shield, EyeOff, Eye, Calendar, 
  MessageCircle, Filter, Music, CheckCircle2, 
  Shuffle, RefreshCw, Edit2, Timer, Gift, Zap, 
  Trash2, Edit3, FolderPlus, BellRing, HeartHandshake,
  CalendarHeart
} from 'lucide-react';

// --- RÉPARATION SÉCURISÉE (ANTI-CRASH) ---
const getSafeConfig = () => {
  try {
    // On essaie de lire ta config dynamique
    if (typeof __firebase_config !== 'undefined') return JSON.parse(__firebase_config);
  } catch (e) {
    console.error("Config dynamique non trouvée, passage en manuel.");
  }
  // Ta config de secours pour éviter l'écran bleu
  return {
    apiKey: "AIzaSyCY-gRv2rOrLy8LgxHn5cyd5937jXmrypw",
    authDomain: "kamasync-52671.firebaseapp.com",
    projectId: "kamasync-52671",
    storageBucket: "kamasync-52671.firebasestorage.app",
    messagingSenderId: "211532217086",
    appId: "1:211532217086:web:7a6ed699c878c6995303af",
    measurementId: "G-Q7M6LE859T"
  };
};

const firebaseConfig = getSafeConfig();
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'kamasync-ultra-v4';

// --- TON SCRIPT RESTE INTACT CI-DESSOUS ---

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

const MOODS = [
  { id: 'romantic', label: 'Câlin & Doux', icon: '☁️', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'playful', label: 'Humeur Joueuse', icon: '🎲', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'wild', label: 'Très Sauvage', icon: '🔥', color: 'bg-rose-500/20 text-rose-500 border-rose-500/30' },
  { id: 'tired', label: 'Pas ce soir', icon: '💤', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
];

const GAMES_DATA = {
  truths: ["Quel est ton fantasme le plus inavoué ?", "Quelle partie de mon corps préfères-tu ?", "Raconte-moi le rêve le plus érotique que tu aies fait.", "Lieu risqué ?", "Chose la plus folle ?", "Dominer ou être dominé(e) ?"],
  dares: ["Masse-moi le dos (3 min).", "Embrasse-moi avec un glaçon.", "Strip-tease sensuel.", "Attache mes mains (3 min)."],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "les Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins", "le Sexe"],
  diceDurations: ["30 secondes.", "1 minute.", "2 minutes.", "jusqu'à l'arrêt."],
  scenPlaces: ["Dans la douche", "Sur la table", "Dans la chambre", "Dans la cuisine"],
  scenRoles: ["Inconnus", "Massage qui dérape", "Professeur/élève", "Médecin/patient"],
  scenTwists: ["Yeux bandés", "Sans les mains", "Silence total", "Lumière allumée"],
  rouletteTasks: ["Dégustation", "Exploration tactile", "Contraste thermique", "Miroir", "Baisers interdits"],
  secretChallenges: ["Dessous sexy", "Sexto imprévu", "Prends les commandes", "Mot coquin caché"]
};

const TIPS_DATA = [
  { id: 't1', title: "Le consentement", cat: "Communication", icon: <Shield/>, content: "Le consentement est un dialogue continu..." },
  { id: 't2', title: "Musique idéale", cat: "Sensorielles", icon: <Music/>, content: "Tempo 60-80 BPM pour synchroniser vos corps..." },
  { id: 't3', title: "Positions debout", cat: "Pratique", icon: <Wind/>, content: "Utilisez un meuble comme appui..." },
  { id: 't4', title: "Aftercare", cat: "Émotionnel", icon: <Heart/>, content: "Restez enlacés après l'acte..." },
  { id: 't5', title: "Dirty Talk", cat: "Communication", icon: <MessageCircle/>, content: "Osez verbaliser vos sensations..." },
  { id: 't6', title: "Zones érogènes", cat: "Sensorielles", icon: <Sparkles/>, content: "Cuir chevelu, nuque, bas du ventre..." },
  { id: 't7', title: "Jouets en couple", cat: "Pratique", icon: <Zap/>, content: "Des outils pour explorer ensemble..." },
  { id: 't8', title: "Le Teasing", cat: "Préliminaires", icon: <Timer/>, content: "L'anticipation est la clé..." },
  { id: 't9', title: "Feu et Glace", cat: "Sensorielles", icon: <Flame/>, content: "Jouez avec les contrastes..." },
  { id: 't10', title: "Bondage Léger", cat: "Découverte", icon: <Lock/>, content: "Foulards, cravates et safe word..." },
  { id: 't11', title: "Ambiance parfaite", cat: "Général", icon: <Star/>, content: "Lumière tamisée et ordre..." },
  { id: 't12', title: "Le regard", cat: "Connexion", icon: <Eye/>, content: "Connexion visuelle totale..." },
  { id: 't13', title: "Liste O/N/P", cat: "Communication", icon: <CheckCircle2/>, content: "Oui, Non, Peut-être..." },
  { id: 't14', title: "Massage sensuel", cat: "Préliminaires", icon: <Activity/>, content: "Lenteur et effleurement..." },
  { id: 't15', title: "Gérer les pannes", cat: "Général", icon: <Info/>, content: "Le rire est votre allié." }
];

const POSITIONS_DATA = [
  { n: "Le Missionnaire", c: "Face à face", d: 1, s: 1, desc: "Face à face total.", v: "Jambes refermées." },
  { n: "Missionnaire surélevé", c: "Face à face", d: 2, s: 2, desc: "Jambes sur les épaules.", v: "Coussin sous les fesses." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Genoux aux oreilles.", v: "Attraper les chevilles." },
  { n: "Le Coquillage", c: "Face à face", d: 3, s: 3, desc: "Replié sur le buste.", v: "Visuel intense." },
  { n: "Fleur de Lotus", c: "Face à face", d: 3, s: 3, desc: "Assis emboîtés.", v: "Respiration synchro." },
  { n: "La Levrette", c: "Par derrière", d: 2, s: 4, desc: "À quatre pattes.", v: "Hanches guidées." },
  { n: "Sphinx", c: "Par derrière", d: 2, s: 3, desc: "Sur avant-bras.", v: "Poitrine au lit." },
  { n: "Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Contrôle total.", v: "Se pencher." },
  { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Sur le flanc.", v: "Bras sous nuque." },
  { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Porter le partenaire.", v: "Appui mur." },
  { n: "69 Classique", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Tête-bêche.", v: "Sur le côté." },
  { n: "G-Whiz", c: "Angles & Tweaks", d: 3, s: 5, desc: "Cible point G.", v: "Jambes serrées." },
  { n: "Brouette", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Sur les mains.", v: "Coussins." },
  { n: "Table Cuisine", c: "Sur Mobilier", d: 2, s: 4, desc: "Assis au bord.", v: "Dégager la table." }
];

const FULL_CATALOG = POSITIONS_DATA.map((p, i) => ({
  id: `p${i}`, name: p.n, cat: p.c, diff: p.d, spice: p.s, desc: p.desc, v: p.v
}));

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('explorer'); 
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState('Toutes');
  const [discreetMode, setDiscreetMode] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) signInAnonymously(auth).catch(() => setLoading(false));
    });
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => { unsub(); clearTimeout(timer); };
  }, []);

  const filteredPositions = useMemo(() => {
    return FULL_CATALOG.filter(pos => {
      const matchSearch = pos.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCat === 'Toutes' || pos.cat === filterCat;
      return matchSearch && matchCat;
    });
  }, [searchQuery, filterCat]);

  const triggerGame = (type) => {
    let res = "";
    if (type === 'truth') res = GAMES_DATA.truths[Math.floor(Math.random() * GAMES_DATA.truths.length)];
    if (type === 'dare') res = GAMES_DATA.dares[Math.floor(Math.random() * GAMES_DATA.dares.length)];
    if (type === 'dice') res = `${GAMES_DATA.diceActions[Math.floor(Math.random()*8)]} ➔ ${GAMES_DATA.diceZones[Math.floor(Math.random()*8)]}`;
    setGameResult(res);
  };

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-rose-500"><Flame className="animate-pulse" size={48} /></div>;

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      <header className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl z-50 shrink-0">
        <div className="flex items-center gap-2 text-rose-500 font-black text-2xl tracking-tighter"><Flame fill="currentColor" size={28} /> KAMA<span className="text-white">SYNC</span></div>
        <button onClick={() => setDiscreetMode(!discreetMode)} className="text-slate-400 p-2">{discreetMode ? <EyeOff size={20} className="text-emerald-400" /> : <Eye size={20} />}</button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-6 animate-in fade-in">
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 text-sm outline-none" placeholder="Rechercher..." /></div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs"><option value="Toutes">Toutes</option>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}</select>
            </div>
            {CATEGORIES.map(cat => {
              const list = filteredPositions.filter(p => p.cat === cat.id);
              if (list.length === 0) return null;
              return (
                <section key={cat.id} className="space-y-4">
                  <h3 className={`flex items-center gap-2 font-bold ${cat.text}`}>{cat.icon} {cat.id}</h3>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                    {list.map(pos => (
                      <div key={pos.id} onClick={() => setSelectedPosition(pos)} className={`shrink-0 w-48 bg-gradient-to-br ${cat.color} p-5 rounded-[2rem] border border-white/5 snap-start`}>
                         <h4 className="font-bold mb-2 text-sm">{discreetMode ? "Position" : pos.name}</h4>
                         <p className="text-[10px] text-white/50 line-clamp-2">{discreetMode ? "xxx xxx" : pos.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {activeTab === 'jeux' && !activeGame && (
          <div className="p-6 animate-in fade-in space-y-4">
            <h2 className="text-3xl font-black mb-10 text-center uppercase tracking-tight">Zone de Jeux</h2>
            {['truth', 'dare', 'dice'].map(g => (
              <button key={g} onClick={() => setActiveGame(g)} className="w-full bg-slate-900 p-6 rounded-3xl border border-white/5 flex justify-between items-center group active:scale-95 transition"><div><h4 className="font-bold text-rose-400 uppercase text-xs">{g}</h4><p className="text-xs text-slate-500 mt-1">Lancer</p></div><ChevronRight/></button>
            ))}
          </div>
        )}

        {activeTab === 'jeux' && activeGame && (
          <div className="absolute inset-0 bg-slate-950 z-[200] flex flex-col animate-in slide-in-from-right">
            <header className="p-6 border-b border-white/5"><button onClick={() => {setActiveGame(null); setGameResult(null);}} className="p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button></header>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-900 p-10 rounded-[3rem] border border-rose-500/20 w-full mb-10 text-xl font-bold leading-relaxed">{gameResult || "Prêts ?"}</div>
              <button onClick={() => triggerGame(activeGame === 'dice' ? 'dice' : activeGame)} className="w-full max-w-sm bg-rose-600 py-4 rounded-2xl font-black">JOUER</button>
            </div>
          </div>
        )}

        {activeTab === 'conseils' && (
          <div className="p-6 space-y-4 animate-in fade-in">
             {TIPS_DATA.map(tip => <div key={tip.id} onClick={() => setSelectedTip(tip)} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex gap-4 cursor-pointer hover:bg-slate-800 transition"><div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">{tip.icon}</div><div><h4 className="font-bold text-sm">{tip.title}</h4><p className="text-xs text-slate-500 mt-1 line-clamp-2">{tip.content}</p></div></div>)}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-6 py-5 flex justify-between items-center z-50 shrink-0 pb-10">
        {[ {id:'explorer', icon:<Compass/>}, {id:'jeux', icon:<Gamepad2/>}, {id:'conseils', icon:<BookOpen/>}, {id:'profil', icon:<User/>} ].map(tab => (
          <button key={tab.id} onClick={() => {setActiveTab(tab.id); setActiveGame(null);}} className={`flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-rose-500 scale-110' : 'text-slate-500'}`}>{tab.icon}<span className="text-[8px] font-bold uppercase">{tab.id}</span></button>
        ))}
      </nav>

      {selectedPosition && (
        <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col animate-in slide-in-from-bottom">
          <header className="p-6 shrink-0"><button onClick={() => setSelectedPosition(null)} className="p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button></header>
          <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6">
            <h2 className="text-4xl font-black leading-tight">{discreetMode ? "Position" : selectedPosition.name}</h2>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5"><h4 className="text-rose-500 text-xs font-black uppercase mb-3 tracking-widest">Description</h4><p className="text-slate-300 leading-relaxed text-lg">{discreetMode ? "xxx xxx" : selectedPosition.desc}</p></div>
          </div>
        </div>
      )}

      {selectedTip && (
        <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col animate-in slide-in-from-bottom p-6">
          <button onClick={() => setSelectedTip(null)} className="mb-8 p-2 bg-slate-800 w-fit rounded-full"><ArrowLeft size={20}/></button>
          <h2 className="text-3xl font-black mb-6 leading-tight">{selectedTip.title}</h2>
          <div className="flex-1 overflow-y-auto bg-slate-900 p-8 rounded-[2.5rem] text-slate-300 text-lg leading-relaxed whitespace-pre-line">{selectedTip.content}</div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
}
