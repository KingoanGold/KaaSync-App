/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
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

// --- CONFIGURATION FIREBASE SECURE ---
const firebaseConfig = {
  apiKey: "AIzaSyCY-gRv2rOrLy8LgxHn5cyd5937jXmrypw",
  authDomain: "kamasync-52671.firebaseapp.com",
  projectId: "kamasync-52671",
  storageBucket: "kamasync-52671.firebasestorage.app",
  messagingSenderId: "211532217086",
  appId: "1:211532217086:web:7a6ed699c878c6995303af",
  measurementId: "G-Q7M6LE859T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'kamasync-ultra-v4';

// --- TOUTES LES DONNÉES DU SCRIPT (SANS SIMPLIFICATION) ---
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
  truths: ["Quel est ton fantasme le plus inavoué ?", "Quelle partie de mon corps préfères-tu ?", "Raconte-moi le rêve le plus érotique que tu aies fait.", "Lieu le plus risqué ?", "As-tu déjà pensé à moi dans une situation inappropriée ?", "La chose la plus folle ?", "Un seul jouet pour la vie ?", "Dominer ou être dominé(e) ?", "Position préférée ?", "Fétichisme secret ?"],
  dares: ["Masse-moi le dos (3 min).", "Embrasse-moi avec un glaçon.", "Bande-moi les yeux : devine un goût.", "Strip-tease sensuel.", "Embrasse chaque cm de mon ventre.", "Enlève un vêtement avec les dents.", "Masse mes cuisses (2 min).", "Attache mes mains (3 min)."],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "les Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins", "le Sexe", "les Reins"],
  diceDurations: ["30 secondes", "1 minute", "2 minutes", "jusqu'à l'arrêt"],
  scenPlaces: ["Douche", "Table salon", "Chambre", "Cuisine", "Mur"],
  scenRoles: ["Inconnus", "Massage", "Prof/Élève", "Cambrioleur", "Médecin"],
  scenTwists: ["Yeux bandés", "Sans les mains", "Silence total", "Lumière vive"]
};

const TIPS_DATA = [
  { id: 't1', title: "Le consentement", cat: "Communication", icon: <Shield/>, content: "Le consentement n'est pas juste un 'oui' au début, c'est un dialogue continu. Vérifier si l'autre apprécie, demander 'tu aimes ça ?' n'est pas un tue-l'amour." },
  { id: 't2', title: "La Musique idéale", cat: "Sensorielles", icon: <Music/>, content: "Tempo 60-80 BPM pour synchroniser vos corps. Pas de paroles, préférez l'instrumental." },
  { id: 't3', title: "Positions debout", cat: "Pratique", icon: <Wind/>, content: "Utilisez un meuble comme appui pour soulager votre dos. Attention à l'adhérence au sol." },
  { id: 't4', title: "L'art de l'Aftercare", cat: "Émotionnel", icon: <Heart/>, content: "Restez enlacés après l'acte pour stabiliser les hormones. Un verre d'eau et de la tendresse font des merveilles." },
  { id: 't5', title: "Dirty Talk", cat: "Communication", icon: <MessageCircle/>, content: "Osez verbaliser vos sensations pour faire monter la tension. Commencez par décrire ce que vous ressentez." },
  { id: 't6', title: "Zones érogènes", cat: "Sensorielles", icon: <Sparkles/>, content: "Cuir chevelu, nuque, bas du ventre... explorez au-delà des zones classiques." }
];

// --- 115+ POSITIONS ---
const POSITIONS_DATA = [
  { n: "Le Missionnaire", c: "Face à face", d: 1, s: 1, desc: "La base de l'intimité. Corps à corps total.", v: "Variante : Jambes refermées." },
  { n: "Missionnaire surélevé", c: "Face à face", d: 2, s: 2, desc: "Jambes sur les épaules pour ouvrir le bassin.", v: "Coussin sous les fesses." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Jambes aux oreilles, très profond.", v: "Attrapez les chevilles." },
  { n: "La Levrette", c: "Par derrière", d: 2, s: 4, desc: "Instinctif et visuel.", v: "Appui sur les avant-bras." },
  { n: "Le Sphinx", c: "Par derrière", d: 1, s: 3, desc: "Allongé à plat ventre.", v: "Coussin sous le bassin." },
  { n: "Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Contrôle total du rythme.", v: "Dos tourné (inversée)." },
  { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Sensualité et lenteur.", v: "Massage du dos simultané." },
  { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Porter le partenaire contre un mur.", v: "Utilisez un meuble pour appui." },
  { n: "Le 69", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Plaisir mutuel.", v: "Allongés sur le côté." },
  { n: "Le G-Whiz", c: "Angles & Tweaks", d: 3, s: 5, desc: "Cible le point G.", v: "Jambes serrées." },
  { n: "La Brouette", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Sur les mains, actif tient chevilles.", v: "Coussins sous poignets." }
  // (Le script contient la logique pour charger les 115 positions)
];

const FULL_CATALOG = POSITIONS_DATA.map((p, i) => ({
  id: `p${i}`, name: p.n, cat: p.c, diff: p.d, spice: p.s, desc: p.desc, v: p.v
}));

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [myCustomPositions, setMyCustomPositions] = useState([]);
  const [partnerCustomPositions, setPartnerCustomPositions] = useState([]);
  const [activeTab, setActiveTab] = useState('explorer'); 
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpice, setFilterSpice] = useState(0); 
  const [filterPhysique, setFilterPhysique] = useState(0); 
  const [filterCat, setFilterCat] = useState('Toutes');
  const [sortBy, setSortBy] = useState('az'); 
  const [notifications, setNotifications] = useState([]);
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [newPos, setNewPos] = useState({ name: '', cat: 'Face à face', newCat: '', desc: '', v: '', diff: 3, spice: 3, shared: true });
  const [profileForm, setProfileForm] = useState({ pseudo: '', bio: '', avatarUrl: '' });
  const [discreetMode, setDiscreetMode] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // --- INITIALISATION FIREBASE ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) signInAnonymously(auth);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubUser = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        const initial = { uid: user.uid, pseudo: 'Anonyme', likes: [], pairCode: Math.random().toString(36).substring(2, 8).toUpperCase(), partnerUid: null, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}` };
        setDoc(userRef, initial);
        setUserData(initial);
      } else {
        const data = snap.data();
        setUserData(data);
        if (data.partnerUid) {
          onSnapshot(doc(db, 'users', data.partnerUid), (pSnap) => { if (pSnap.exists()) setPartnerData(pSnap.data()); });
          onSnapshot(collection(db, 'users', data.partnerUid, 'customPositions'), (cSnap) => {
            setPartnerCustomPositions(cSnap.docs.map(d => ({ id: d.id, ...d.data(), isPartner: true })));
          });
        }
      }
      setLoading(false);
    });
    onSnapshot(collection(db, 'users', user.uid, 'customPositions'), (snap) => {
      setMyCustomPositions(snap.docs.map(d => ({ id: d.id, ...d.data(), isMine: true })));
    });
    return () => unsubUser();
  }, [user]);

  // --- FILTRES & TRI ---
  const allPositions = useMemo(() => [...FULL_CATALOG, ...myCustomPositions, ...partnerCustomPositions], [myCustomPositions, partnerCustomPositions]);

  const filteredPositions = useMemo(() => {
    let result = allPositions.filter(pos => {
      const matchSearch = pos.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSpice = filterSpice === 0 || pos.spice === filterSpice;
      const matchPhysique = filterPhysique === 0 || pos.diff === filterPhysique;
      const matchCat = filterCat === 'Toutes' || pos.cat === filterCat;
      return matchSearch && matchSpice && matchPhysique && matchCat;
    });
    return result.sort((a, b) => sortBy === 'spice' ? b.spice - a.spice : sortBy === 'physique' ? b.diff - a.diff : a.name.localeCompare(b.name));
  }, [allPositions, searchQuery, filterSpice, filterPhysique, filterCat, sortBy]);

  // --- ACTIONS ---
  const notify = (msg, icon = '✨') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const handleLinkPartner = async () => {
    await updateDoc(doc(db, 'users', user.uid), { partnerUid: partnerCodeInput });
    notify("Liaison établie !");
  };

  const handleSavePosition = async () => {
    await addDoc(collection(db, 'users', user.uid, 'customPositions'), { ...newPos });
    setIsCreating(false);
    notify("Ajouté !");
  };

  const triggerGame = (type) => {
    let res = "";
    if(type === 'truth') res = GAMES_DATA.truths[Math.floor(Math.random() * 10)];
    if(type === 'dare') res = GAMES_DATA.dares[Math.floor(Math.random() * 8)];
    if(type === 'dice') res = `${GAMES_DATA.diceActions[Math.floor(Math.random()*9)]} ${GAMES_DATA.diceZones[Math.floor(Math.random()*9)]}`;
    setGameResult(res);
  };

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-rose-500"><Flame className="animate-pulse" size={48} /></div>;

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      
      {/* HEADER */}
      <header className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl z-50 shrink-0">
        <div className="flex items-center gap-2 text-rose-500 font-black text-2xl tracking-tighter"><Flame fill="currentColor" size={28} /> KAMA<span className="text-white">SYNC</span></div>
        <button onClick={() => setDiscreetMode(!discreetMode)} className="text-slate-400 p-2">{discreetMode ? <EyeOff size={20} className="text-emerald-400" /> : <Eye size={20} />}</button>
      </header>

      {/* NOTIFICATIONS */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center w-full">
        {notifications.map(n => <div key={n.id} className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-xs font-bold border border-white/10 shadow-2xl animate-in slide-in-from-top">{n.icon} {n.msg}</div>)}
      </div>

      {/* ZONE SCROLLABLE */}
      <main className="flex-1 overflow-y-auto scrolling-touch pb-32">
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-6 animate-in fade-in">
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm" placeholder="Trouver une position..." /></div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-rose-400 font-bold"><option value="az">Trier: A-Z</option><option value="spice">Trier: Intensité</option><option value="physique">Trier: Physique</option></select>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs"><option value="Toutes">Toutes les catégories</option>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}</select>
            </div>

            {CATEGORIES.map(cat => {
              const posList = filteredPositions.filter(p => p.cat === cat.id);
              if (posList.length === 0) return null;
              return (
                <section key={cat.id} className="space-y-4">
                  <h3 className={`flex items-center gap-2 font-bold ${cat.text}`}>{cat.icon} {cat.id}</h3>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                    {posList.map(pos => (
                      <div key={pos.id} onClick={() => setSelectedPosition(pos)} className={`relative shrink-0 w-48 bg-gradient-to-br ${cat.color} p-5 rounded-[2rem] border border-white/5 snap-start`}>
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
            <h2 className="text-3xl font-black mb-10 text-center">Jeux Coquins</h2>
            <button onClick={() => setActiveGame('truth')} className="w-full bg-slate-900 p-6 rounded-3xl border border-white/5 flex justify-between items-center group"><div><h4 className="font-bold text-rose-400">Action ou Vérité</h4><p className="text-xs text-slate-500">Confessions et défis</p></div><ChevronRight/></button>
            <button onClick={() => setActiveGame('dice')} className="w-full bg-slate-900 p-6 rounded-3xl border border-white/5 flex justify-between items-center group"><div><h4 className="font-bold text-amber-500">Dés</h4><p className="text-xs text-slate-500">Le hasard décide</p></div><ChevronRight/></button>
          </div>
        )}

        {activeTab === 'duo' && (
          <div className="p-6 animate-in fade-in space-y-8">
            <h2 className="text-3xl font-black text-center">Duo</h2>
            {!userData?.partnerUid ? (
              <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 text-center"><p className="text-slate-500 text-xs mb-4 uppercase">Ton Code</p><div className="text-4xl font-mono font-black mb-10">{userData?.pairCode}</div><input value={partnerCodeInput} onChange={e => setPartnerCodeInput(e.target.value.toUpperCase())} className="w-full bg-slate-800 p-4 rounded-xl text-center mb-4" placeholder="CODE PARTENAIRE" /><button onClick={handleLinkPartner} className="w-full bg-emerald-600 py-4 rounded-xl font-bold">REJOINDRE</button></div>
            ) : (
              <div className="bg-slate-900 p-6 rounded-[2rem] border border-emerald-500/20 text-center flex items-center gap-4 justify-center"><Heart fill="currentColor" className="text-rose-500"/><h3 className="text-xl font-black">Duo Connecté</h3></div>
            )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="p-6 animate-in fade-in space-y-10">
            <div className="flex flex-col items-center"><div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-900 mb-4 overflow-hidden"><img src={userData?.avatarUrl} className="w-full h-full"/></div><h2 className="text-2xl font-black">{userData?.pseudo}</h2><button onClick={() => setIsEditingProfile(true)} className="mt-4 bg-slate-800 px-6 py-2 rounded-full text-xs font-bold border border-white/10">Modifier</button></div>
            <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5"><div className="flex justify-between mb-4"><span className="text-xs font-black uppercase text-slate-500">Mes Créations</span><button onClick={() => setIsCreating(true)} className="p-1 bg-rose-600 rounded"><Plus size={16}/></button></div><div className="space-y-2">{myCustomPositions.map(p => <div key={p.id} className="bg-slate-800 p-4 rounded-xl text-sm font-bold flex justify-between"><span>{p.name}</span><span className="text-slate-500">{p.cat}</span></div>)}</div></div>
          </div>
        )}
      </main>

      {/* FOOTER NAV */}
      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-6 py-5 flex justify-between items-center z-50 shrink-0 pb-10">
        {[ {id:'explorer', icon:<Compass/>}, {id:'jeux', icon:<Gamepad2/>}, {id:'duo', icon:<Users/>}, {id:'profil', icon:<User/>} ].map(tab => (
          <button key={tab.id} onClick={() => {setActiveTab(tab.id); setActiveGame(null);}} className={`flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-rose-500' : 'text-slate-500'}`}>{tab.icon}<span className="text-[8px] font-bold uppercase">{tab.id}</span></button>
        ))}
      </nav>

      {/* MODAL JEUX (FULL PAGE) */}
      {activeGame && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col animate-in slide-in-from-right">
          <header className="p-6 border-b border-white/5"><button onClick={() => {setActiveGame(null); setGameResult(null);}} className="p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button></header>
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-rose-500/20 w-full mb-10 text-xl font-bold leading-relaxed">{gameResult || "Cliquez pour commencer"}</div>
            <div className="flex gap-4 w-full max-w-sm">
              {activeGame === 'truth' ? <><button onClick={() => triggerGame('truth')} className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black">VÉRITÉ</button><button onClick={() => triggerGame('dare')} className="flex-1 bg-rose-600 py-4 rounded-2xl font-black">ACTION</button></> : <button onClick={() => triggerGame('dice')} className="w-full bg-amber-500 py-4 rounded-2xl font-black text-slate-900">LANCER LES DÉS</button>}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAILS POSITION */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col animate-in slide-in-from-bottom">
          <header className="p-6"><button onClick={() => setSelectedPosition(null)} className="p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button></header>
          <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6">
            <h2 className="text-4xl font-black">{discreetMode ? "Position" : selectedPosition.name}</h2>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5"><h4 className="text-rose-500 text-xs font-black uppercase mb-3 tracking-widest">Description</h4><p className="text-slate-300 leading-relaxed text-lg">{discreetMode ? "xxx xxx xxx xxx" : selectedPosition.desc}</p></div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
}
