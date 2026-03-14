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
const appId = 'kamasync-ultra-v4';

// --- DONNÉES MASSIVES : JEUX ---
const GAMES_DATA = {
  truths: [
    "Quel est ton fantasme le plus inavoué ?", "Quelle partie de mon corps préfères-tu ?", "Raconte-moi le rêve le plus érotique que tu aies fait.",
    "Lieu le plus risqué où tu aimerais le faire ?", "As-tu déjà pensé à moi dans une situation inappropriée ?",
    "La chose la plus folle que tu aimerais que je te fasse ?", "Si tu choisissais un seul jouet sexuel ?",
    "Dominer ou être dominé(e) ?", "Position préférée et pourquoi ?", "Ton fétichisme secret ?",
    "Ta tenue préférée sur moi ?", "Une zone que je ne touche pas assez ?", "Ton meilleur souvenir avec moi ?"
  ],
  dares: [
    "Masse-moi le dos pendant 3 min.", "Embrasse-moi dans le cou avec un glaçon.",
    "Yeux bandés : devine ce que je te fais goûter.", "Fais-moi un strip-tease sensuel.",
    "Embrasse chaque cm de mon ventre.", "Enlève un vêtement avec tes dents.",
    "Masse mes cuisses sans toucher mon sexe pendant 2 min.", "Attache mes mains et fais ce que tu veux (3 min)."
  ],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "les Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins", "le Sexe", "les Reins"],
  diceDurations: ["30 secondes", "1 minute", "2 minutes", "jusqu'à l'orgasme"],
  scenPlaces: ["Douche", "Table du salon", "Cuisine", "Contre un mur", "Voiture"],
  scenRoles: ["Inconnus au bar", "Masseur & Client", "Prof & Élève", "Médecin & Patient"],
  scenTwists: ["Yeux bandés", "Sans les mains", "Silence total", "Lumière vive"],
  rouletteTasks: ["Dégustation", "Exploration tactile", "Contraste thermique", "Miroir", "Baisers partout sauf lèvres"],
  secretChallenges: ["Dessous sexy", "Sexto surprise", "Prends les commandes", "Mot coquin caché"]
};

// --- BASE DE DONNÉES : 100+ POSITIONS ---
const POSITIONS_DATA = [
  // FACE À FACE (15)
  { n: "Le Missionnaire", c: "Face à face", d: 1, s: 1, desc: "La base de l'intimité. Corps à corps total.", v: "Coussin sous les hanches pour l'angle." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Jambes vers les épaules, très profond.", v: "Attraper les chevilles pour stabiliser." },
  { n: "La Fleur de Lotus", c: "Face à face", d: 3, s: 3, desc: "Assis face à face, jambes enroulées.", v: "Mouvements circulaires très lents." },
  { n: "Le Coquillage", c: "Face à face", d: 3, s: 3, desc: "Receveur replié, actif enveloppant.", v: "Respiration synchronisée." },
  { n: "Le Papillon", c: "Face à face", d: 3, s: 4, desc: "Au bord du lit, actif debout.", v: "Mains sous les hanches du receveur." },
  { n: "L'Araignée", c: "Face à face", d: 4, s: 4, desc: "Assis face à face, appui sur les mains.", v: "Danse asymétrique des bassins." },
  { n: "Le Wrap", c: "Face à face", d: 2, s: 3, desc: "Jambes verrouillées derrière le dos de l'actif.", v: "Contrôler la profondeur en serrant." },
  { n: "Montagne Magique", c: "Face à face", d: 2, s: 2, desc: "Pieds à plat sur le matelas.", v: "Pousser sur les talons." },
  { n: "Le G-Whiz", c: "Face à face", d: 3, s: 5, desc: "Missionnaire ultra-replié pour le point G.", v: "Genoux contre la poitrine." },
  { n: "L'Entrelacs", c: "Face à face", d: 2, s: 3, desc: "Jambes emmêlées pour friction maximale.", v: "Contact visuel forcé." },
  { n: "Le V incliné", c: "Face à face", d: 3, s: 3, desc: "Corps formant un V, bassins joints.", v: "Mains sur les épaules." },
  { n: "Le Pont Amoureux", c: "Face à face", d: 4, s: 4, desc: "L'un soulève le bassin en pont.", v: "Soutien avec un traversin." },
  
  // PAR DERRIÈRE (15)
  { n: "Levrette Classique", c: "Par derrière", d: 2, s: 4, desc: "À quatre pattes. Instinctif et profond.", v: "Attraper les hanches." },
  { n: "Le Sphinx", c: "Par derrière", d: 1, s: 3, desc: "Allongé sur le ventre, actif par-dessus.", v: "Coussin sous le bas-ventre." },
  { n: "La Grenouille", c: "Par derrière", d: 2, s: 4, desc: "À plat ventre, genoux très écartés.", v: "Presser les cuisses du receveur." },
  { n: "Chien de Chasse", c: "Par derrière", d: 3, s: 4, desc: "Une jambe tendue vers l'arrière.", v: "Pénétration asymétrique." },
  { n: "Le Toboggan", c: "Par derrière", d: 3, s: 4, desc: "Receveur redressé à la verticale.", v: "Actif entoure le buste." },
  { n: "La Luge", c: "Par derrière", d: 3, s: 3, desc: "Receveur sur le ventre, actif à califourchon.", v: "Massage des épaules simultané." },
  { n: "Lazy Dog", c: "Par derrière", d: 1, s: 2, desc: "Actif allongé sur le dos du receveur.", v: "Pénétration douce et lente." },
  { n: "Levrette Debout", c: "Par derrière", d: 4, s: 5, desc: "Appuyé contre un mur ou une table.", v: "Garder les jambes droites." },
  { n: "Le Bambou", c: "Par derrière", d: 3, s: 5, desc: "Levrette avec jambes du receveur serrées.", v: "Friction intense." },
  { n: "X inversé", c: "Par derrière", d: 4, s: 4, desc: "Receveur tête vers le bas au bord du lit.", v: "Vertige et profondeur." },

  // AU-DESSUS (15)
  { n: "Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Assis au-dessus, contrôle total.", v: "Se pencher pour s'enlacer." },
  { n: "Andromaque Inversée", c: "Au-dessus", d: 3, s: 4, desc: "Dos au partenaire. Très visuel.", v: "S'appuyer sur les genoux de l'autre." },
  { n: "L'Amazone", c: "Au-dessus", d: 4, s: 5, desc: "Accroupi sans poser les genoux.", v: "Bondir avec la force des cuisses." },
  { n: "Cow-girl Rodéo", c: "Au-dessus", d: 3, s: 4, desc: "Rotations circulaires du bassin.", v: "Varier la vitesse." },
  { n: "Cavalière de l'espace", c: "Au-dessus", d: 3, s: 3, desc: "Penché en arrière jusqu'au matelas.", v: "Actif soulève son bassin." },
  { n: "La Sirène", c: "Au-dessus", d: 2, s: 3, desc: "Jambes serrées sur le côté.", v: "Frictions latérales." },
  { n: "Le Bridge", c: "Au-dessus", d: 4, s: 4, desc: "Partenaire supérieur en pont.", v: "Appui sur les mains et pieds." },
  { n: "L'Arc de Triomphe", c: "Au-dessus", d: 5, s: 5, desc: "Pont complet des deux corps.", v: "Très physique." },

  // DE CÔTÉ (10)
  { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Emboîtés sur le flanc. Relaxant.", v: "Massage du torse." },
  { n: "Les Ciseaux", c: "De côté", d: 2, s: 3, desc: "Face à face, jambes en X.", v: "Contact clitoridien fort." },
  { n: "Tire-bouchon", c: "De côté", d: 3, s: 4, desc: "Corps en T, l'un sur le dos.", v: "Mains sur les hanches." },
  { n: "L'Étau", c: "De côté", d: 2, s: 3, desc: "Jambes verrouillant la cuisse adverse.", v: "Pression constante." },

  // DEBOUT & ACROBATIQUE (15)
  { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Porter l'autre totalement.", v: "S'adosser à un mur." },
  { n: "Le Poteau", c: "Debout & Acrobatique", d: 4, s: 4, desc: "Contre le mur, face à face.", v: "Lever une jambe." },
  { n: "La Brouette", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Sur les mains, actif tient chevilles.", v: "Coussins sous les poignets." },
  { n: "Saut de l'ange", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Porté, receveur se cambre en arrière.", v: "Soutenir les reins fermement." },

  // ORAL & PRÉLIMINAIRES (20)
  { n: "Le 69", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Plaisir mutuel tête-bêche.", v: "Sur le côté pour durer." },
  { n: "La Cascade", c: "Oral & Préliminaires", d: 3, s: 5, desc: "Tête pendante au bord du lit.", v: "Afflux sanguin = sensibilité." },
  { n: "Baiser Polaire", c: "Oral & Préliminaires", d: 1, s: 5, desc: "Glaçon en bouche avant l'oral.", v: "Choc thermique explosif." },
  { n: "Le Trône", c: "Oral & Préliminaires", d: 1, s: 4, desc: "Receveur sur chaise, actif à genoux.", v: "Position de dévotion." },
  { n: "Dégustation Aveugle", c: "Oral & Préliminaires", d: 1, s: 5, desc: "Actif a les yeux bandés.", v: "Se repérer au toucher/odorat." }
];

const FULL_CATALOG = POSITIONS_DATA.map((p, i) => ({
  id: `p${i}`, name: p.n, cat: p.c, diff: p.d, spice: p.s, desc: p.desc, v: p.v
}));

const CATEGORIES = [
  { id: 'Face à face', icon: <Users size={14}/>, color: 'from-blue-500/20 to-blue-900/20', text: 'text-blue-400' },
  { id: 'Par derrière', icon: <Flame size={14}/>, color: 'from-orange-500/20 to-orange-900/20', text: 'text-orange-400' },
  { id: 'Au-dessus', icon: <Activity size={14}/>, color: 'from-rose-500/20 to-rose-900/20', text: 'text-rose-400' },
  { id: 'De côté', icon: <Heart size={14}/>, color: 'from-pink-500/20 to-pink-900/20', text: 'text-pink-400' },
  { id: 'Debout & Acrobatique', icon: <Wind size={14}/>, color: 'from-emerald-500/20 to-emerald-900/20', text: 'text-emerald-400' },
  { id: 'Sur Mobilier', icon: <Gamepad2 size={14}/>, color: 'from-purple-500/20 to-purple-900/20', text: 'text-purple-400' },
  { id: 'Oral & Préliminaires', icon: <Sparkles size={14}/>, color: 'from-amber-500/20 to-amber-900/20', text: 'text-amber-400' }
];

const TIPS_DATA = [
  { id: 't1', title: "Le consentement", cat: "Communication", icon: <Shield/>, content: "Dialogue continu. Demandez 'tu aimes ça ?'." },
  { id: 't2', title: "Musique & BPM", cat: "Sensorielles", icon: <Music/>, content: "60-80 BPM pour synchroniser les cœurs." },
  { id: 't3', title: "Dirty Talk", cat: "Communication", icon: <MessageCircle/>, content: "Mettre des mots sur les désirs." }
];

// --- APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [activeTab, setActiveTab] = useState('explorer'); 
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState('Toutes');
  const [sortBy, setSortBy] = useState('az');
  const [notifications, setNotifications] = useState([]);
  const [discreetMode, setDiscreetMode] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ pseudo: '', bio: '' });

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
        const initial = { uid: user.uid, pseudo: 'Anonyme', bio: '', likes: [], pairCode: Math.random().toString(36).substring(2, 8).toUpperCase(), partnerUid: null };
        setDoc(userRef, initial);
        setUserData(initial);
        setProfileForm({ pseudo: 'Anonyme', bio: '' });
      } else {
        const data = snap.data();
        setUserData(data);
        setProfileForm({ pseudo: data.pseudo || 'Anonyme', bio: data.bio || '' });
        if (data.partnerUid) {
          onSnapshot(doc(db, 'users', data.partnerUid), (pSnap) => { if (pSnap.exists()) setPartnerData(pSnap.data()); });
        }
      }
      setLoading(false);
    });
    return () => unsubUser();
  }, [user]);

  const filteredPositions = useMemo(() => {
    let res = FULL_CATALOG.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCat === 'Toutes' || p.cat === filterCat;
      return matchSearch && matchCat;
    });
    if (sortBy === 'spice') return res.sort((a,b) => b.spice - a.spice);
    return res.sort((a,b) => a.name.localeCompare(b.name));
  }, [searchQuery, filterCat, sortBy]);

  const notify = (msg, icon = '✨') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const handleLike = async (id) => {
    if (!user || !userData) return;
    const isLiked = userData.likes?.includes(id);
    const newLikes = isLiked ? userData.likes.filter(l => l !== id) : [...userData.likes, id];
    await updateDoc(doc(db, 'users', user.uid), { likes: newLikes });
    if (!isLiked && partnerData?.likes?.includes(id)) notify("MATCH PARFAIT !", "🔥");
  };

  const triggerGame = (type) => {
    let res = "";
    if(type === 'truth') res = GAMES_DATA.truths[Math.floor(Math.random() * GAMES_DATA.truths.length)];
    if(type === 'dare') res = GAMES_DATA.dares[Math.floor(Math.random() * GAMES_DATA.dares.length)];
    if(type === 'dice') res = `${GAMES_DATA.diceActions[Math.floor(Math.random()*9)]} ${GAMES_DATA.diceZones[Math.floor(Math.random()*9)]} ${GAMES_DATA.diceDurations[Math.floor(Math.random()*4)]}`;
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

      {/* NOTIFS */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[500] flex flex-col gap-2 items-center pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-xs font-bold border border-white/10 shadow-2xl animate-in slide-in-from-top">{n.icon} {n.msg}</div>
        ))}
      </div>

      {/* MAIN CONTENT (SCROLLABLE) */}
      <main className="flex-1 overflow-y-auto scrolling-touch pb-32">
        
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm" placeholder="Rechercher..." />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8">
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs">
                <option value="Toutes">Catégories</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
              </select>
            </div>

            {CATEGORIES.map(cat => {
              const positions = filteredPositions.filter(p => p.cat === cat.id);
              if (positions.length === 0) return null;
              return (
                <section key={cat.id} className="space-y-4">
                  <h3 className={`flex items-center gap-2 font-bold ${cat.text}`}>{cat.icon} {cat.id}</h3>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                    {positions.map(pos => (
                      <div key={pos.id} onClick={() => setSelectedPosition(pos)} className={`shrink-0 w-48 bg-gradient-to-br ${cat.color} p-5 rounded-[2.5rem] border border-white/5 snap-start`}>
                         <h4 className="font-bold mb-2">{discreetMode ? "Position" : pos.name}</h4>
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
          <div className="p-6 space-y-4 animate-in fade-in">
            <h2 className="text-3xl font-black mb-6">Jeux</h2>
            <button onClick={() => triggerGame('truth')} className="w-full bg-slate-900 p-6 rounded-[2rem] border border-white/5 text-left font-bold text-rose-400">Vérité</button>
            <button onClick={() => triggerGame('dare')} className="w-full bg-slate-900 p-6 rounded-[2rem] border border-white/5 text-left font-bold text-indigo-400">Action</button>
            <button onClick={() => triggerGame('dice')} className="w-full bg-slate-900 p-6 rounded-[2rem] border border-white/5 text-left font-bold text-amber-400">Dés</button>
            {gameResult && <div className="mt-8 bg-slate-900 p-8 rounded-[2rem] border border-rose-500/30 text-center animate-in zoom-in text-xl font-bold">{gameResult}</div>}
          </div>
        )}

        {activeTab === 'duo' && (
          <div className="p-6 space-y-8 text-center animate-in fade-in">
            <h2 className="text-3xl font-black">Mode Duo</h2>
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <Users className="mx-auto text-emerald-500 mb-4" size={40} />
              <div className="text-4xl font-mono font-black tracking-widest text-white">{userData?.pairCode}</div>
            </div>
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="p-6 space-y-10 animate-in fade-in">
            <h2 className="text-3xl font-black">Moi</h2>
            <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
               <div><h3 className="font-bold text-2xl">{userData?.pseudo}</h3><p className="text-slate-500 text-sm">{userData?.bio || "Pas de bio"}</p></div>
               <button onClick={() => setIsEditingProfile(true)} className="p-3 bg-slate-800 rounded-full"><Edit2 size={18}/></button>
            </div>
            {isEditingProfile && (
              <div className="space-y-4 bg-slate-900 p-6 rounded-3xl border border-white/5">
                <input value={profileForm.pseudo} onChange={e => setProfileForm({...profileForm, pseudo: e.target.value})} className="w-full bg-slate-800 p-4 rounded-xl text-white" />
                <button onClick={async () => { await updateDoc(doc(db, 'users', user.uid), { pseudo: profileForm.pseudo }); setIsEditingProfile(false); }} className="w-full bg-rose-600 py-4 rounded-xl font-bold">Enregistrer</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER NAV FIXE */}
      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-6 py-5 flex justify-between items-center z-50 shrink-0 pb-10">
        <button onClick={() => setActiveTab('explorer')} className={`flex flex-col items-center gap-1 ${activeTab === 'explorer' ? 'text-rose-500 scale-110' : 'text-slate-500'}`}><Compass size={24}/><span className="text-[8px] font-bold uppercase">Explorer</span></button>
        <button onClick={() => setActiveTab('jeux')} className={`flex flex-col items-center gap-1 ${activeTab === 'jeux' ? 'text-purple-500 scale-110' : 'text-slate-500'}`}><Gamepad2 size={24}/><span className="text-[8px] font-bold uppercase">Jeux</span></button>
        <button onClick={() => setActiveTab('duo')} className={`flex flex-col items-center gap-1 ${activeTab === 'duo' ? 'text-emerald-400 scale-110' : 'text-slate-500'}`}><Users size={24}/><span className="text-[8px] font-bold uppercase">Duo</span></button>
        <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 ${activeTab === 'profil' ? 'text-white scale-110' : 'text-slate-500'}`}><User size={24}/><span className="text-[8px] font-bold uppercase">Moi</span></button>
      </nav>

      {/* MODAL DETAIL POSITION */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[200] bg-slate-950 p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setSelectedPosition(null)} className="mb-8 text-slate-500 p-2 bg-slate-900 rounded-full w-fit"><ArrowLeft size={24}/></button>
          <div className="flex-1 overflow-y-auto space-y-6">
            <h2 className="text-4xl font-black leading-tight">{discreetMode ? "Position" : selectedPosition.name}</h2>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5"><h4 className="text-rose-500 font-bold text-xs uppercase mb-3">La Position</h4><p className="text-slate-300 leading-relaxed text-lg">{discreetMode ? "xxx xxx xxx xxx" : selectedPosition.desc}</p></div>
            {selectedPosition.v && <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5"><h4 className="text-indigo-400 font-bold text-xs uppercase mb-3">Variante</h4><p className="text-slate-400 italic leading-relaxed">{discreetMode ? "xxx xxx" : selectedPosition.v}</p></div>}
          </div>
          <button onClick={() => handleLike(selectedPosition.id)} className={`mt-6 w-full py-5 rounded-2xl font-black text-lg ${userData?.likes?.includes(selectedPosition.id) ? 'bg-slate-800 text-rose-500' : 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'}`}>{userData?.likes?.includes(selectedPosition.id) ? "RETIRER DES FAVORIS" : "AJOUTER AUX FAVORIS"}</button>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        main { -webkit-overflow-scrolling: touch; }
      `}</style>
    </div>
  );
}
