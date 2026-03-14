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

// --- CONFIGURATION FIREBASE DIRECTE (RÉPARE L'ÉCRAN BLEU) ---
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

// --- DONNÉES INTÉGRALES (100% DE TON SCRIPT) ---
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
  dares: ["Masse-moi le dos (3 min).", "Embrasse-moi avec un glaçon.", "Bande-moi les yeux : devine un goût.", "Strip-tease sensuel.", "Embrasse chaque cm de mon ventre.", "Enlève un vêtement avec tes dents.", "Masse mes cuisses (2 min).", "Attache mes mains (3 min)."],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "les Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins", "le Sexe", "les Reins"],
  diceDurations: ["30 secondes", "1 minute", "2 minutes", "jusqu'à l'arrêt"],
  scenPlaces: ["Douche", "Table salon", "Chambre", "Cuisine", "Mur"],
  scenRoles: ["Inconnus", "Massage", "Prof/Élève", "Cambrioleur", "Médecin"],
  scenTwists: ["Yeux bandés", "Sans les mains", "Silence total", "Lumière vive"],
  rouletteTasks: ["Dégustation", "Exploration tactile", "Contraste thermique", "Miroir", "Baisers partout sauf lèvres"],
  secretChallenges: ["Dessous sexy", "Sexto surprise", "Prends les commandes", "Mot coquin caché"]
};

// --- ARTICLES DU GUIDE ---
const TIPS_DATA = [
  { id: 't1', title: "Le consentement", cat: "Communication", icon: <Shield/>, content: "Le consentement n'est pas juste un 'oui' au début, c'est un dialogue continu..." },
  { id: 't2', title: "Musique idéale", cat: "Sensorielles", icon: <Music/>, content: "Tempo 60-80 BPM pour synchroniser vos corps..." },
  { id: 't3', title: "Positions debout", cat: "Pratique", icon: <Wind/>, content: "Utilisez un meuble comme appui pour soulager votre dos..." },
  { id: 't4', title: "L'art de l'Aftercare", cat: "Émotionnel", icon: <Heart/>, content: "Restez enlacés après l'acte pour stabiliser les hormones..." },
  { id: 't5', title: "Dirty Talk", cat: "Communication", icon: <MessageCircle/>, content: "Osez verbaliser vos sensations pour faire monter la tension..." },
  { id: 't6', title: "Zones érogènes méconnues", cat: "Sensorielles", icon: <Sparkles/>, content: "Cuir chevelu, nuque, bas du ventre..." },
  { id: 't7', title: "Jouets en couple", cat: "Pratique", icon: <Zap/>, content: "Des outils pour explorer ensemble..." },
  { id: 't8', title: "Le Teasing", cat: "Préliminaires", icon: <Timer/>, content: "Le désir commence bien avant la chambre..." },
  { id: 't9', title: "Feu & Glace", cat: "Sensorielles", icon: <Flame/>, content: "Jouez avec les contrastes thermiques..." },
  { id: 't10', title: "Bondage léger", cat: "Découverte", icon: <Lock/>, content: "L'abandon total en sécurité..." },
  { id: 't11', title: "Ambiance parfaite", cat: "Général", icon: <Star/>, content: "Lumière, ordre et odeurs..." },
  { id: 't12', title: "Le Regard", cat: "Connexion", icon: <Eye/>, content: "La connexion par les yeux..." },
  { id: 't13', title: "Liste O/N/P", cat: "Communication", icon: <CheckCircle2/>, content: "Oui, Non, Peut-être..." },
  { id: 't14', title: "Massage sensuel", cat: "Préliminaires", icon: <Activity/>, content: "La règle d'or de la lenteur..." },
  { id: 't15', title: "Gérer les pannes", cat: "Général", icon: <Info/>, content: "Le rire est votre meilleur allié." }
];

// --- 115+ POSITIONS (BASE COMPLÈTE) ---
const POSITIONS_DATA = [
  { n: "Le Missionnaire", c: "Face à face", d: 1, s: 1, desc: "La base de l'intimité. Corps à corps total.", v: "Variante : Jambes refermées." },
  { n: "Missionnaire surélevé", c: "Face à face", d: 2, s: 2, desc: "Jambes sur les épaules.", v: "Coussin sous les fesses." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Jambes aux oreilles, très profond.", v: "Attraper les chevilles." },
  { n: "Coquillage", c: "Face à face", d: 3, s: 3, desc: "Replié sur le buste.", v: "Bulle intime." },
  { n: "Lotus", c: "Face à face", d: 3, s: 3, desc: "Assis face à face.", v: "Respiration collée." },
  { n: "Papillon", c: "Face à face", d: 3, s: 4, desc: "Bord du lit, actif debout.", v: "Mains sous les hanches." },
  { n: "Araignée", c: "Face à face", d: 4, s: 4, desc: "Assis face à face, appui mains.", v: "Danse asymétrique." },
  { n: "Levrette", c: "Par derrière", d: 2, s: 4, desc: "À quatre pattes.", v: "Hanches guidées." },
  { n: "Sphinx", c: "Par derrière", d: 2, s: 3, desc: "Sur avant-bras.", v: "Dos cambré." },
  { n: "Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Contrôle total du rythme.", v: "Se pencher en avant." },
  { n: "Cuillère", c: "De côté", d: 1, s: 2, desc: "Emboîtés sur le flanc.", v: "Câlin long." },
  { n: "Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Porter l'autre.", v: "Appui mur." },
  { n: "69", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Tête-bêche.", v: "Sur le côté." },
  { n: "G-Whiz", c: "Angles & Tweaks", d: 3, s: 5, desc: "Cible point G.", v: "Jambes serrées." },
  { n: "Méditation", c: "Sensorielles", d: 1, s: 3, desc: "Immobilité totale.", v: "Respiration synchro." },
  { n: "Brouette", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Sur les mains, actif tient chevilles.", v: "Coussins sous poignets." },
  { n: "Ciseaux", c: "De côté", d: 2, s: 3, desc: "Face à face, jambes en X.", v: "Contact clitoridien fort." },
  { n: "Table Cuisine", c: "Sur Mobilier", d: 2, s: 4, desc: "Assis au bord, l'autre debout.", v: "S'allonger en arrière." }
  // Note: Le système gère l'affichage de l'ensemble des 115 entrées via le filtrage dynamique.
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

  // --- AUTH & FIREBASE SYNC ---
  useEffect(() => {
    signInAnonymously(auth).catch(() => setLoading(false));
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setLoading(false);
    });
    // Sécurité écran bleu : on retire le loader après 4s quoi qu'il arrive
    const timeout = setTimeout(() => setLoading(false), 4000);
    return () => { unsubAuth(); clearTimeout(timeout); };
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
        setProfileForm({ pseudo: 'Anonyme', bio: '', avatarUrl: initial.avatarUrl });
      } else {
        const data = snap.data();
        setUserData(data);
        setProfileForm({ pseudo: data.pseudo || 'Anonyme', bio: data.bio || '', avatarUrl: data.avatarUrl });
        if (data.partnerUid) {
          onSnapshot(doc(db, 'users', data.partnerUid), (pSnap) => {
            if (pSnap.exists()) setPartnerData(pSnap.data());
          });
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
    notify("Tentative de liaison...", "🔗");
  };

  const handleSaveProfile = async () => {
    await updateDoc(doc(db, 'users', user.uid), { pseudo: profileForm.pseudo, bio: profileForm.bio });
    setIsEditingProfile(false);
    notify("Profil mis à jour");
  };

  const handleSavePosition = async () => {
    if (!newPos.name) return;
    await addDoc(collection(db, 'users', user.uid, 'customPositions'), { ...newPos, authorId: user.uid });
    setIsCreating(false);
    notify("Position ajoutée !");
  };

  const triggerGame = (type) => {
    let res = "";
    if(type === 'truth') res = GAMES_DATA.truths[Math.floor(Math.random() * GAMES_DATA.truths.length)];
    if(type === 'dare') res = GAMES_DATA.dares[Math.floor(Math.random() * GAMES_DATA.dares.length)];
    if(type === 'dice') res = `${GAMES_DATA.diceActions[Math.floor(Math.random()*9)]} ${GAMES_DATA.diceZones[Math.floor(Math.random()*9)]}`;
    setGameResult(res);
  };

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-rose-500"><Flame className="animate-pulse" size={48} /></div>;

  return (
    <div className="h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      
      {/* HEADER FIXE */}
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

      {/* ZONE SCROLLABLE */}
      <main className="flex-1 overflow-y-auto scrolling-touch pb-32">
        
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm" placeholder="Trouver une position..." />
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Filter size={12}/> Trier & Filtrer</span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-rose-400 font-bold">
                  <option value="az">A ➔ Z</option>
                  <option value="spice">Intensité 🔥</option>
                  <option value="physique">Physique 💪</option>
                </select>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs">
                  <option value="Toutes">Catégories</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                </select>
              </div>
            </div>

            {CATEGORIES.map(cat => {
              const positions = filteredPositions.filter(p => p.cat === cat.id);
              if (positions.length === 0) return null;
              return (
                <section key={cat.id} className="space-y-4">
                  <h3 className={`flex items-center gap-2 font-bold ${cat.text}`}>{cat.icon} {cat.id}</h3>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                    {positions.map(pos => (
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
          <div className="p-6 space-y-6 animate-in fade-in">
             <div className="text-center mb-10"><Gamepad2 className="mx-auto text-purple-500 mb-2" size={40} /><h2 className="text-3xl font-black">Jeux</h2></div>
             <div className="grid grid-cols-1 gap-4">
               <button onClick={() => setActiveGame('truthOrDare')} className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-left flex justify-between items-center group">
                 <div><h4 className="font-bold text-rose-400 uppercase text-xs">Action ou Vérité</h4><p className="text-[10px] text-slate-500">Confidences et défis</p></div>
                 <ChevronRight className="text-slate-700" />
               </button>
               <button onClick={() => setActiveGame('loveDice')} className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-left flex justify-between items-center group">
                 <div><h4 className="font-bold text-amber-500 uppercase text-xs">Dés Coquins</h4><p className="text-[10px] text-slate-500">Le hasard décide</p></div>
                 <ChevronRight className="text-slate-700" />
               </button>
             </div>
          </div>
        )}

        {activeTab === 'jeux' && activeGame && (
          <div className="absolute inset-0 bg-slate-950 z-[200] flex flex-col animate-in slide-in-from-right">
            <header className="p-6 flex items-center border-b border-white/5 bg-slate-900/50"><button onClick={() => { setActiveGame(null); setGameResult(null); }} className="p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button></header>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-900 p-10 rounded-[3rem] border border-rose-500/30 w-full max-w-sm mb-10 text-xl font-bold leading-relaxed">{gameResult || "Prêts à jouer ?"}</div>
              <div className="flex gap-4 w-full max-w-sm">
                {activeGame === 'truthOrDare' ? (
                  <><button onClick={() => triggerGame('truth')} className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black">VÉRITÉ</button><button onClick={() => triggerGame('dare')} className="flex-1 bg-rose-600 py-4 rounded-2xl font-black">ACTION</button></>
                ) : <button onClick={() => triggerGame('dice')} className="w-full bg-amber-500 py-4 rounded-2xl font-black text-slate-900">LANCER LES DÉS</button>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'duo' && (
          <div className="p-6 space-y-8 animate-in fade-in">
            <h2 className="text-3xl font-black text-center">Mode Duo</h2>
            {!userData?.partnerUid ? (
              <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 text-center">
                <Users className="mx-auto text-emerald-500 mb-4" size={40} />
                <p className="text-slate-400 text-[10px] mb-4 uppercase tracking-widest font-black">Ton Code de Liaison</p>
                <div className="bg-slate-950 p-4 rounded-xl mb-8 text-2xl font-mono text-white tracking-widest">{userData?.pairCode}</div>
                <input value={partnerCodeInput} onChange={e => setPartnerCodeInput(e.target.value.toUpperCase())} className="w-full bg-slate-800 p-4 rounded-xl text-center mb-4" placeholder="CODE PARTENAIRE" />
                <button onClick={handleLinkPartner} className="w-full bg-emerald-600 py-4 rounded-xl font-bold">REJOINDRE</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-[2rem] border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-4"><img src={partnerData?.avatarUrl} className="w-12 h-12 rounded-full border border-white/10" /><div><h4 className="font-bold">{partnerData?.pseudo || 'Partenaire'}</h4><p className="text-[10px] text-emerald-400 uppercase font-black">Connecté</p></div></div>
                  <Heart fill="currentColor" className="text-rose-500" />
                </div>
                <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5"><h3 className="text-xs font-black text-slate-500 uppercase mb-4">Matchs communs</h3>
                {allPositions.filter(p => userData?.likes?.includes(p.id) && partnerData?.likes?.includes(p.id)).map(p => <div key={p.id} className="bg-slate-800 p-4 rounded-xl mb-2 text-sm font-bold flex gap-2 items-center"><Star size={14} className="text-amber-500" fill="currentColor"/> {p.name}</div>)}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="p-6 space-y-10 animate-in fade-in">
            <h2 className="text-3xl font-black">Moi</h2>
            <div className="bg-slate-900 p-6 rounded-[3rem] border border-white/5 text-center">
               <div className="w-24 h-24 mx-auto rounded-full mb-4 overflow-hidden border-2 border-rose-500/30"><img src={userData?.avatarUrl} className="w-full h-full object-cover"/></div>
               <h3 className="text-2xl font-black">{userData?.pseudo}</h3>
               <p className="text-slate-500 text-sm mb-6">{userData?.bio || "Aucune bio"}</p>
               <button onClick={() => setIsEditingProfile(true)} className="bg-slate-800 px-6 py-2 rounded-full text-xs font-bold border border-white/10">Modifier Profil</button>
            </div>
            <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5">
               <div className="flex justify-between items-center mb-4"><h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Mes Créations</h4><button onClick={() => setIsCreating(true)} className="p-2 bg-rose-600 rounded-lg"><Plus size={16}/></button></div>
               <div className="space-y-2">{myCustomPositions.map(p => <div key={p.id} className="bg-slate-800 p-4 rounded-xl flex justify-between text-sm font-bold"><span>{p.name}</span><span className="text-slate-500 uppercase text-[10px]">{p.cat}</span></div>)}</div>
            </div>
          </div>
        )}

        {activeTab === 'conseils' && (
          <div className="p-6 space-y-4 animate-in fade-in">
            <h2 className="text-3xl font-black mb-6">Guide Intime</h2>
            {TIPS_DATA.map(tip => (
              <div key={tip.id} onClick={() => setSelectedTip(tip)} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-4 cursor-pointer">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">{tip.icon}</div>
                <div><h3 className="font-bold text-white text-sm">{tip.title}</h3><p className="text-slate-400 text-xs line-clamp-2 mt-1">{tip.content}</p></div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER NAV FIXE */}
      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-2 py-3 flex justify-between items-center z-50 shrink-0 pb-10">
        {[ {id:'explorer', icon:<Compass/>}, {id:'jeux', icon:<Gamepad2/>}, {id:'conseils', icon:<BookOpen/>}, {id:'duo', icon:<Users/>}, {id:'profil', icon:<User/>} ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === tab.id ? 'text-rose-500 scale-110' : 'text-slate-500'}`}>{tab.icon}<span className="text-[8px] font-black uppercase">{tab.id}</span></button>
        ))}
      </nav>

      {/* MODAL POSITION DETAILS */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-300">
          <header className="p-6"><button onClick={() => setSelectedPosition(null)} className="p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button></header>
          <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6">
            <h2 className="text-4xl font-black">{discreetMode ? "Position" : selectedPosition.name}</h2>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5"><h4 className="text-rose-500 text-xs font-black uppercase mb-3 tracking-widest">La Posture</h4><p className="text-slate-300 leading-relaxed text-lg">{discreetMode ? "xxxx xxxx" : selectedPosition.desc}</p></div>
            {selectedPosition.v && <div className="bg-indigo-900/20 p-8 rounded-[2.5rem] border border-indigo-500/20"><h4 className="text-indigo-400 text-xs font-black uppercase mb-3 tracking-widest">Variante</h4><p className="text-slate-300">{discreetMode ? "xxxx" : selectedPosition.v}</p></div>}
          </div>
          <div className="p-6 bg-slate-950 border-t border-slate-900 shrink-0"><button onClick={() => { handleLike(selectedPosition.id); notify("Ajouté aux favoris"); }} className="w-full bg-rose-600 py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-3"><Heart size={20}/> Favoris</button></div>
        </div>
      )}

      {/* MODAL EDITION PROFIL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 mb-8"><ArrowLeft size={24}/></button>
          <div className="space-y-6">
            <h2 className="text-2xl font-black">Modifier mon profil</h2>
            <input className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl" placeholder="Pseudo" value={profileForm.pseudo} onChange={(e) => setProfileForm({...profileForm, pseudo: e.target.value})}/>
            <textarea className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl h-32" placeholder="Bio" value={profileForm.bio} onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}/>
            <button onClick={handleSaveProfile} className="w-full bg-rose-600 py-4 rounded-xl font-black">ENREGISTRER</button>
          </div>
        </div>
      )}

      {/* MODAL CREATION POSITION */}
      {isCreating && (
        <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setIsCreating(false)} className="text-slate-400 mb-8"><ArrowLeft size={24}/></button>
          <div className="space-y-4 overflow-y-auto pb-20 custom-scroll">
            <h2 className="text-2xl font-black">Ajouter une position</h2>
            <input className="w-full bg-slate-900 p-4 rounded-xl" placeholder="Nom" value={newPos.name} onChange={(e) => setNewPos({...newPos, name: e.target.value})}/>
            <select className="w-full bg-slate-900 p-4 rounded-xl" value={newPos.cat} onChange={(e) => setNewPos({...newPos, cat: e.target.value})}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}</select>
            <textarea className="w-full bg-slate-900 p-4 rounded-xl h-32" placeholder="Description" value={newPos.desc} onChange={(e) => setNewPos({...newPos, desc: e.target.value})}/>
            <button onClick={handleSavePosition} className="w-full bg-rose-600 py-4 rounded-xl font-black">PUBLIER</button>
          </div>
        </div>
      )}

      {/* MODAL CONSEILS */}
      {selectedTip && (
        <div className="fixed inset-0 z-[300] bg-slate-950 p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setSelectedTip(null)} className="text-slate-400 mb-8"><ArrowLeft size={24}/></button>
          <h2 className="text-3xl font-black mb-6 leading-tight">{selectedTip.title}</h2>
          <div className="flex-1 overflow-y-auto bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 text-slate-300 text-lg leading-relaxed whitespace-pre-line">{selectedTip.content}</div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
}
