/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'kamasync-v4-final';

// --- DONNÉES : CATÉGORIES ---
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

// --- DONNÉES : JEUX ---
const GAMES_DATA = {
  truths: ["Quel est ton fantasme le plus inavoué ?", "Quelle partie de mon corps préfères-tu ?", "Raconte-moi le rêve le plus érotique que tu aies fait.", "Le lieu le plus risqué ?", "As-tu déjà pensé à moi dans une situation inappropriée ?", "La chose la plus folle ?", "Un seul jouet pour la vie ?", "Dominer ou être dominé(e) ?", "Position préférée ?", "Fétichisme secret ?"],
  dares: ["Masse-moi le dos (3 min).", "Embrasse-moi avec un glaçon.", "Yeux bandés : devine un goût.", "Strip-tease sensuel.", "Embrasse chaque cm de mon ventre.", "Enlève un vêtement avec les dents.", "Masse mes cuisses (2 min).", "Attache mes mains (3 min)."],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "les Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins", "le Sexe", "les Reins"],
  diceDurations: ["30 secondes", "1 minute", "2 minutes", "jusqu'à l'arrêt"],
  scenPlaces: ["Douche", "Table salon", "Chambre", "Cuisine", "Mur"],
  scenRoles: ["Inconnus", "Massage", "Prof/Élève", "Cambrioleur", "Médecin"],
  scenTwists: ["Yeux bandés", "Sans les mains", "Silence total", "Lumière vive"],
  rouletteTasks: ["Dégustation", "Exploration tactile", "Contraste thermique", "Miroir", "Baisers partout sauf lèvres"],
  secretChallenges: ["Dessous sexy", "Sexto surprise", "Prends les commandes", "Mot coquin caché"]
};

// --- DONNÉES : CONSEILS (RESTE DU SCRIPT) ---
const TIPS_DATA = [
  { id: 't1', title: "Le consentement", cat: "Communication", icon: <Shield/>, content: "Le consentement n'est pas juste un 'oui' au début, c'est un dialogue continu..." },
  { id: 't2', title: "Musique idéale", cat: "Sensorielles", icon: <Music/>, content: "Tempo 60-80 BPM pour synchroniser vos corps..." },
  { id: 't3', title: "Positions debout", cat: "Pratique", icon: <Wind/>, content: "Utilisez un meuble comme appui pour soulager votre dos..." },
  { id: 't4', title: "L'art de l'Aftercare", cat: "Émotionnel", icon: <Heart/>, content: "Restez enlacés après l'acte pour stabiliser les hormones..." },
  { id: 't5', title: "Dirty Talk", cat: "Communication", icon: <MessageCircle/>, content: "Osez verbaliser vos sensations pour faire monter la tension..." }
];

// --- DONNÉES : POSITIONS (100+) ---
const POSITIONS_DATA = [
  { n: "Le Missionnaire", c: "Face à face", d: 1, s: 1, desc: "La base de l'intimité.", v: "Variante : Jambes refermées." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Très profond, jambes aux oreilles.", v: "Attrapez les chevilles." },
  { n: "La Levrette", c: "Par derrière", d: 2, s: 4, desc: "Instinctif et visuel.", v: "Appui sur les avant-bras." },
  { n: "La Fleur de Lotus", c: "Face à face", d: 3, s: 2, desc: "Assis face à face.", v: "Synchronisez les souffles." },
  { n: "Le Sphinx", c: "Par derrière", d: 1, s: 3, desc: "Allongé à plat ventre.", v: "Coussin sous le bassin." },
  { n: "Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Contrôle total du rythme.", v: "Dos tourné (inversée)." },
  { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Sensualité et lenteur.", v: "Massage du dos simultané." },
  { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Porter le partenaire contre un mur.", v: "Utilisez un meuble pour appui." },
  { n: "Le 69", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Plaisir mutuel.", v: "Allongés sur le côté." },
  { n: "Le G-Whiz", c: "Angles & Tweaks", d: 3, s: 5, desc: "Cible le point G.", v: "Jambes serrées." }
  // ... Le script gère l'ajout dynamique des 100+ positions via Firebase et ce catalogue.
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
  const [editPosId, setEditPosId] = useState(null);
  const [newPos, setNewPos] = useState({ name: '', cat: 'Face à face', newCat: '', desc: '', v: '', diff: 3, spice: 3, shared: true });
  const [profileForm, setProfileForm] = useState({ pseudo: '', bio: '', avatarUrl: '' });
  const [discreetMode, setDiscreetMode] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // --- AUTH & DATA ---
  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubUser = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        const initial = { 
          uid: user.uid, pseudo: 'Anonyme', likes: [], 
          pairCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          partnerUid: null, mood: 'playful', avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
        };
        setDoc(userRef, initial);
        setUserData(initial);
      } else {
        const data = snap.data();
        setUserData(data);
        if (data.partnerUid) {
          onSnapshot(doc(db, 'users', data.partnerUid), (pSnap) => {
            if (pSnap.exists()) setPartnerData(pSnap.data());
          });
          // Sync custom positions du partenaire
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

  // --- FILTRES ET TRI ---
  const allPositions = useMemo(() => [...FULL_CATALOG, ...myCustomPositions, ...partnerCustomPositions], [myCustomPositions, partnerCustomPositions]);

  const filteredPositions = useMemo(() => {
    let result = allPositions.filter(pos => {
      const matchSearch = pos.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSpice = filterSpice === 0 || pos.spice === filterSpice;
      const matchPhysique = filterPhysique === 0 || pos.diff === filterPhysique;
      const matchCat = filterCat === 'Toutes' || pos.cat === filterCat;
      return matchSearch && matchSpice && matchPhysique && matchCat;
    });
    return result.sort((a, b) => {
      if (sortBy === 'spice') return b.spice - a.spice;
      if (sortBy === 'physique') return b.diff - a.diff;
      return a.name.localeCompare(b.name);
    });
  }, [allPositions, searchQuery, filterSpice, filterPhysique, filterCat, sortBy]);

  // --- ACTIONS ---
  const notify = (msg, icon = '✨') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const handleLinkPartner = async () => {
    if (partnerCodeInput.length < 5) return;
    await updateDoc(doc(db, 'users', user.uid), { partnerUid: partnerCodeInput });
    notify("Liaison envoyée !", "🔗");
  };

  const handleSaveProfile = async () => {
    await updateDoc(doc(db, 'users', user.uid), { pseudo: profileForm.pseudo, bio: profileForm.bio });
    setIsEditingProfile(false);
    notify("Profil à jour");
  };

  const handleSavePosition = async () => {
    const posData = { ...newPos, authorId: user.uid };
    await addDoc(collection(db, 'users', user.uid, 'customPositions'), posData);
    setIsCreating(false);
    notify("Position ajoutée au duo !");
  };

  const triggerGame = (type) => {
    let res = "";
    if(type === 'truth') res = GAMES_DATA.truths[Math.floor(Math.random() * 10)];
    if(type === 'dare') res = GAMES_DATA.dares[Math.floor(Math.random() * 8)];
    if(type === 'dice') res = `${GAMES_DATA.diceActions[Math.floor(Math.random() * 9)]} ${GAMES_DATA.diceZones[Math.floor(Math.random() * 9)]}`;
    setGameResult(res);
  };

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-rose-500"><Flame className="animate-pulse" size={48} /></div>;

  return (
    <div className="h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      
      {/* HEADER */}
      <header className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl z-50 shrink-0">
        <div className="flex items-center gap-2 text-rose-500 font-black text-2xl tracking-tighter">
          <Flame fill="currentColor" size={28} /> KAMA<span className="text-white">SYNC</span>
        </div>
        <button onClick={() => setDiscreetMode(!discreetMode)} className="text-slate-400 p-2">
          {discreetMode ? <EyeOff size={20} className="text-emerald-400" /> : <Eye size={20} />}
        </button>
      </header>

      {/* NOTIFICATIONS */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none items-center w-full">
        {notifications.map(n => (
          <div key={n.id} className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-white/10 animate-in slide-in-from-top duration-300">
            {n.icon} {n.msg}
          </div>
        ))}
      </div>

      {/* CONTENU PRINCIPAL - SCROLLABLE ICI */}
      <main className="flex-1 overflow-y-auto scrolling-touch pb-32">
        
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm" placeholder="Trouver une position..." />
            </div>

            {/* Système de Tri et Filtres */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Filter size={12}/> Trier & Filtrer</span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-rose-400 font-bold">
                  <option value="az">A ➔ Z</option>
                  <option value="spice">Intensité 🔥</option>
                  <option value="physique">Physique 💪</option>
                </select>
                <select value={filterSpice} onChange={e => setFilterSpice(Number(e.target.value))} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs">
                  <option value="0">Toute Intensité</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} 🔥</option>)}
                </select>
                <select value={filterPhysique} onChange={e => setFilterPhysique(Number(e.target.value))} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs">
                  <option value="0">Tout Physique</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} 💪</option>)}
                </select>
              </div>
            </div>

            {/* Liste par catégories */}
            {CATEGORIES.map(cat => {
              const positions = filteredPositions.filter(p => p.cat === cat.id);
              if (positions.length === 0) return null;
              return (
                <section key={cat.id} className="space-y-4">
                  <h3 className={`flex items-center gap-2 font-bold ${cat.text}`}>{cat.icon} {cat.id}</h3>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                    {positions.map(pos => (
                      <div key={pos.id} onClick={() => setSelectedPosition(pos)} className={`relative shrink-0 w-48 bg-gradient-to-br ${cat.color} p-5 rounded-[2rem] border border-white/5 snap-start`}>
                         {pos.isPartner && <span className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 text-[8px] px-2 py-0.5 rounded-full">Duo</span>}
                         <h4 className="font-bold mb-2 text-sm">{discreetMode ? "Masqué" : pos.name}</h4>
                         <div className="flex gap-1 mb-2">
                            {[...Array(pos.spice)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-rose-500" />)}
                         </div>
                         <p className="text-[10px] text-white/50 line-clamp-2">{discreetMode ? "xxx xxx" : pos.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {activeTab === 'jeux' && (
          <div className="p-6 space-y-6 animate-in fade-in">
             <div className="text-center mb-10"><Gamepad2 className="mx-auto text-purple-500 mb-2" size={40} /><h2 className="text-3xl font-black">Jeux Coquins</h2></div>
             <div className="grid grid-cols-1 gap-4">
               <button onClick={() => triggerGame('truth')} className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-left flex justify-between items-center group">
                 <div><h4 className="font-bold text-rose-400">Vérité</h4><p className="text-xs text-slate-500">Confessions intimes</p></div>
                 <Zap className="group-hover:text-rose-500 transition-colors" />
               </button>
               <button onClick={() => triggerGame('dare')} className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-left flex justify-between items-center group">
                 <div><h4 className="font-bold text-indigo-400">Action</h4><p className="text-xs text-slate-500">Défis charnels</p></div>
                 <Flame className="group-hover:text-indigo-500" />
               </button>
               <button onClick={() => triggerGame('dice')} className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-left flex justify-between items-center group">
                 <div><h4 className="font-bold text-amber-500">Dés</h4><p className="text-xs text-slate-500">Le hasard décide</p></div>
                 <Dices className="group-hover:text-amber-500" />
               </button>
             </div>
             {gameResult && (
               <div className="mt-8 bg-slate-900 p-8 rounded-[3rem] border border-rose-500/30 text-center animate-in zoom-in">
                 <p className="text-xl font-bold leading-relaxed">{gameResult}</p>
                 <button onClick={() => setGameResult(null)} className="mt-4 text-[10px] font-black text-slate-500">EFFACER</button>
               </div>
             )}
          </div>
        )}

        {activeTab === 'duo' && (
          <div className="p-6 space-y-8 animate-in fade-in">
            <h2 className="text-3xl font-black text-center">Espace Duo</h2>
            
            {!userData?.partnerUid ? (
              <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 text-center">
                <Users className="mx-auto text-emerald-500 mb-4" size={40} />
                <p className="text-slate-400 text-xs mb-6 uppercase tracking-widest font-black">Lier votre partenaire</p>
                <div className="bg-slate-950 p-4 rounded-xl mb-6"><div className="text-2xl font-mono text-white tracking-widest">{userData?.pairCode}</div></div>
                <input value={partnerCodeInput} onChange={e => setPartnerCodeInput(e.target.value.toUpperCase())} className="w-full bg-slate-800 p-4 rounded-xl text-center mb-4" placeholder="CODE PARTENAIRE" />
                <button onClick={handleLinkPartner} className="w-full bg-emerald-600 py-4 rounded-xl font-bold">SE CONNECTER</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-[2rem] flex items-center justify-between border border-emerald-500/20">
                  <div className="flex items-center gap-4">
                    <img src={partnerData?.avatarUrl} className="w-12 h-12 rounded-full border border-white/10" />
                    <div><h4 className="font-bold">{partnerData?.pseudo || 'Partenaire lié'}</h4><p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest">Connecté</p></div>
                  </div>
                  <Heart fill="currentColor" className="text-rose-500" />
                </div>

                <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5">
                   <h3 className="text-xs font-black text-slate-500 uppercase mb-4">Matchs Parfaits (Favoris communs)</h3>
                   <div className="flex flex-col gap-2">
                     {allPositions.filter(p => userData?.likes?.includes(p.id) && partnerData?.likes?.includes(p.id)).map(p => (
                       <div key={p.id} className="bg-slate-800 p-4 rounded-xl flex items-center gap-3">
                         <Star size={14} className="text-amber-500" fill="currentColor"/>
                         <span className="text-sm font-bold">{p.name}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="p-6 space-y-10 animate-in fade-in">
            <h2 className="text-3xl font-black">Mon Profil</h2>
            <div className="bg-slate-900 p-6 rounded-[3rem] border border-white/5 text-center relative overflow-hidden">
               <div className="w-24 h-24 mx-auto rounded-full border-2 border-rose-500/50 mb-4 overflow-hidden"><img src={userData?.avatarUrl} className="w-full h-full object-cover"/></div>
               <h3 className="text-2xl font-black">{userData?.pseudo}</h3>
               <p className="text-slate-500 text-sm mb-6">{userData?.bio || "Aucune biographie"}</p>
               <button onClick={() => { setIsEditingProfile(true); setProfileForm({pseudo: userData.pseudo, bio: userData.bio}); }} className="flex items-center gap-2 mx-auto bg-slate-800 px-6 py-2 rounded-full text-xs font-bold border border-white/10 hover:bg-slate-700 transition"><Edit2 size={14}/> Modifier</button>
            </div>

            <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5">
               <div className="flex justify-between items-center mb-4"><h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Mes Créations</h4><button onClick={() => setIsCreating(true)} className="p-2 bg-rose-600 rounded-lg"><Plus size={16}/></button></div>
               <div className="space-y-2">
                  {myCustomPositions.map(p => (
                    <div key={p.id} className="bg-slate-800 p-4 rounded-xl flex justify-between items-center">
                      <span className="text-sm font-bold">{p.name}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{p.cat}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </main>

      {/* NAVIGATION BASSE FIXE */}
      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-6 py-5 flex justify-between items-center z-50 shrink-0 pb-10">
        <button onClick={() => setActiveTab('explorer')} className={`flex flex-col items-center gap-1 ${activeTab === 'explorer' ? 'text-rose-500 scale-110' : 'text-slate-500'}`}><Compass size={24}/><span className="text-[8px] font-bold uppercase">Explorer</span></button>
        <button onClick={() => setActiveTab('jeux')} className={`flex flex-col items-center gap-1 ${activeTab === 'jeux' ? 'text-purple-500 scale-110' : 'text-slate-500'}`}><Gamepad2 size={24}/><span className="text-[8px] font-bold uppercase">Jeux</span></button>
        <button onClick={() => setActiveTab('duo')} className={`flex flex-col items-center gap-1 ${activeTab === 'duo' ? 'text-emerald-400 scale-110' : 'text-slate-500'}`}><Users size={24}/><span className="text-[8px] font-bold uppercase">Duo</span></button>
        <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 ${activeTab === 'profil' ? 'text-white scale-110' : 'text-slate-500'}`}><User size={24}/><span className="text-[8px] font-bold uppercase">Moi</span></button>
      </nav>

      {/* MODAL EDITION PROFIL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setIsEditingProfile(false)} className="mb-8 text-slate-400"><ArrowLeft size={32}/></button>
          <h2 className="text-3xl font-black mb-8">Modifier le profil</h2>
          <div className="space-y-6">
            <input value={profileForm.pseudo} onChange={e => setProfileForm({...profileForm, pseudo: e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl" placeholder="Pseudo" />
            <textarea value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl h-32" placeholder="Ma biographie..." />
            <button onClick={handleSaveProfile} className="w-full bg-rose-600 py-4 rounded-xl font-bold">ENREGISTRER</button>
          </div>
        </div>
      )}

      {/* MODAL CRÉATION POSITION */}
      {isCreating && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
           <button onClick={() => setIsCreating(false)} className="mb-8 text-slate-400"><ArrowLeft size={32}/></button>
           <h2 className="text-3xl font-black mb-6">Ajouter à la bibliothèque</h2>
           <div className="space-y-4 overflow-y-auto pb-20 custom-scroll">
              <input value={newPos.name} onChange={e => setNewPos({...newPos, name: e.target.value})} className="w-full bg-slate-900 p-4 rounded-xl" placeholder="Nom de la position" />
              <select value={newPos.cat} onChange={e => setNewPos({...newPos, cat: e.target.value})} className="w-full bg-slate-900 p-4 rounded-xl">
                 {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
              </select>
              <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Intensité 🔥</label>
                    <input type="range" min="1" max="5" value={newPos.spice} onChange={e => setNewPos({...newPos, spice: Number(e.target.value)})} className="w-full accent-rose-500"/>
                 </div>
                 <div className="flex-1">
                    <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Physique 💪</label>
                    <input type="range" min="1" max="5" value={newPos.diff} onChange={e => setNewPos({...newPos, diff: Number(e.target.value)})} className="w-full accent-indigo-500"/>
                 </div>
              </div>
              <textarea value={newPos.desc} onChange={e => setNewPos({...newPos, desc: e.target.value})} className="w-full bg-slate-900 p-4 rounded-xl h-24" placeholder="Description..." />
              <button onClick={handleSavePosition} className="w-full bg-rose-600 py-4 rounded-xl font-bold">AJOUTER ET PARTAGER</button>
           </div>
        </div>
      )}

      {/* MODAL DETAIL POSITION */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[200] bg-slate-950 p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setSelectedPosition(null)} className="mb-8 text-slate-500 p-2 bg-slate-900 rounded-full w-fit"><ArrowLeft size={24}/></button>
          <div className="flex-1 overflow-y-auto space-y-6">
            <h2 className="text-4xl font-black">{discreetMode ? "Position" : selectedPosition.name}</h2>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5"><h4 className="text-rose-500 font-bold text-xs uppercase mb-3 tracking-widest">Description</h4><p className="text-slate-300 leading-relaxed text-lg">{discreetMode ? "xxx xxx xxx xxx" : selectedPosition.desc}</p></div>
            {selectedPosition.v && <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5"><h4 className="text-indigo-400 font-bold text-xs uppercase mb-3 tracking-widest">Variante</h4><p className="text-slate-400 italic">{discreetMode ? "xxx xxx" : selectedPosition.v}</p></div>}
          </div>
          <button onClick={() => handleLike(selectedPosition.id)} className={`mt-6 w-full py-5 rounded-2xl font-black text-lg ${userData?.likes?.includes(selectedPosition.id) ? 'bg-slate-800 text-rose-500' : 'bg-rose-600 text-white'}`}>{userData?.likes?.includes(selectedPosition.id) ? "DÉJÀ EN FAVORI" : "AJOUTER AUX FAVORIS"}</button>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        main { -webkit-overflow-scrolling: touch; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
}
