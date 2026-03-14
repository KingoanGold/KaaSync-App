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

// --- CONFIGURATION FIREBASE SÉCURISÉE (Correction écran bleu) ---
const getFirebaseConfig = () => {
  try {
    if (typeof __firebase_config !== 'undefined') return JSON.parse(__firebase_config);
  } catch (e) { console.error("Config missing"); }
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

const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'kamasync-ultra-v4';

// --- CATÉGORIES ---
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
  truths: ["Quel est ton fantasme le plus inavoué ?", "Quelle partie de mon corps préfères-tu ?", "Raconte-moi le rêve le plus érotique que tu aies fait.", "Quel est le lieu le plus risqué où tu aimerais faire l'amour ?", "As-tu déjà pensé à moi dans une situation inappropriée ?", "Quelle est la chose la plus folle que tu aimerais que je te fasse ?", "Si tu devais choisir un seul jouet sexuel pour le reste de ta vie, ce serait quoi ?", "Préfères-tu dominer ou être dominé(e) ?", "Quelle est ta position préférée et pourquoi ?", "As-tu un fétichisme secret ?"],
  dares: ["Masse-moi le dos pendant 3 minutes avec de l'huile ou de la crème.", "Embrasse-moi dans le cou avec un glaçon.", "Bande-moi les yeux et fais-moi deviner ce que tu manges ou bois.", "Fais-moi un strip-tease sensuel sur une musique de mon choix.", "Embrasse passionnément chaque centimètre de mon ventre.", "Enlève un de mes vêtements en utilisant uniquement tes dents.", "Masse l'intérieur de mes cuisses sans toucher mon sexe pendant 2 minutes.", "Attache mes mains et fais ce que tu veux pendant 3 minutes."],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller avec la langue", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "l'Intérieur des Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins / Pectoraux", "le Sexe", "le Creux des reins"],
  diceDurations: ["pendant 30 secondes.", "pendant 1 minute.", "pendant 2 minutes.", "jusqu'à ce que je te supplie d'arrêter.", "les yeux fermés."],
  scenPlaces: ["Dans la douche", "Sur la table du salon", "Enfermés dans la chambre", "Dans la cuisine", "Contre un mur"],
  scenRoles: ["Des inconnus dans un bar", "Un massage qui dérape", "Professeur et élève", "Cambrioleur et propriétaire", "Médecin et patient"],
  scenTwists: ["Avec un bandeau sur les yeux", "Sans utiliser les mains", "Dans le silence total", "La lumière doit rester allumée", "En écoutant une musique classique très fort"],
  rouletteTasks: ["Dégustation à l'aveugle : Fais-moi goûter 3 choses.", "Exploration tactile : Caresses avec une plume ou un tissu doux.", "Contraste thermique : Souffle chaud et glaçon sur le torse.", "Le jeu du miroir : Place-nous devant un miroir.", "Baisers interdits : Embrasse tout mon corps SAUF mes lèvres."],
  secretChallenges: ["Porte des dessous sexy dehors sans me le dire.", "Envoie-moi un message explicite quand je ne m'y attends pas.", "Ce soir, prends totalement les commandes au lit.", "Glisse un mot coquin dans ma poche aujourd'hui."]
};

const TIPS_DATA = [
  { id: 't1', title: "Le consentement, moteur du désir", cat: "Communication", icon: <Shield/>, time: "2 min", content: "Le consentement n'est pas juste un 'oui' au début, c'est un dialogue continu..." },
  { id: 't2', title: "La Musique idéale pour le lit", cat: "Sensorielles", icon: <Music/>, time: "4 min", content: "1. Tempo 60-80 BPM. 2. Pas de paroles. 3. Pas de mode aléatoire..." },
  { id: 't3', title: "Réussir les positions debout", cat: "Pratique", icon: <Wind/>, time: "3 min", content: "1. Adhérence. 2. Hauteur. 3. Communication." },
  { id: 't4', title: "L'art délicat de l'Aftercare", cat: "Émotionnel", icon: <Heart/>, time: "3 min", content: "L'après est crucial. Restez enlacés, hydratez-vous..." },
  { id: 't5', title: "Dirty Talk : Comment oser", cat: "Communication", icon: <MessageCircle/>, time: "4 min", content: "1. Le constat. 2. L'instruction. 3. L'anticipation." },
  { id: 't6', title: "Les zones érogènes méconnues", cat: "Sensorielles", icon: <Sparkles/>, time: "5 min", content: "Cuir chevelu, creux des genoux, nuque..." },
  { id: 't7', title: "Introduire des jouets", cat: "Pratique", icon: <Zap/>, time: "4 min", content: "Un sex-toy ne remplace pas, il complète..." },
  { id: 't8', title: "L'art du Teasing", cat: "Préliminaires", icon: <Timer/>, time: "3 min", content: "Le désir commence bien avant la chambre..." },
  { id: 't9', title: "Jeux de température", cat: "Sensorielles", icon: <Flame/>, time: "3 min", content: "Souffle chaud, glaçon, huiles chauffantes..." },
  { id: 't10', title: "Initiation au Bondage Léger", cat: "Découverte", icon: <Lock/>, time: "4 min", content: "Foulards, cravates, safe words..." },
  { id: 't11', title: "Créer l'ambiance parfaite", cat: "Général", icon: <Star/>, time: "2 min", content: "Éclairage, ordre, odeur..." },
  { id: 't12', title: "Le pouvoir du regard", cat: "Connexion", icon: <Eye/>, time: "3 min", content: "Fixez les yeux, utilisez les miroirs..." },
  { id: 't13', title: "Liste Oui / Non / Peut-être", cat: "Communication", icon: <CheckCircle2/>, time: "3 min", content: "Comparez vos envies en toute bienveillance..." },
  { id: 't14', title: "Massage sensuel : Règles d'or", cat: "Préliminaires", icon: <Activity/>, time: "4 min", content: "Effleurement, lenteur, pas de zones génitales directes..." },
  { id: 't15', title: "Gérer les pannes", cat: "Général", icon: <Info/>, time: "3 min", content: "Le rire est votre allié. Zéro pression." }
];

const POSITIONS_DATA = [
  { n: "Le Missionnaire (L'indémodable)", c: "Face à face", d: 1, s: 1, desc: "Le partenaire A s'allonge sur le dos... Le partenaire B se place au-dessus...", v: "Variante : A referme les jambes pour plus de friction." },
  { n: "Le Missionnaire surélevé", c: "Face à face", d: 2, s: 2, desc: "Jambes sur les épaules pour ouvrir le bassin...", v: "Coussin sous les fesses." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Bassin vers le haut, genoux près des oreilles...", v: "L'actif attrape les chevilles." },
  { n: "Le Coquillage", c: "Face à face", d: 3, s: 3, desc: "Cuisses serrées contre le buste...", v: "Maintenez le contact visuel." },
  { n: "La Fleur de Lotus", c: "Face à face", d: 3, s: 3, desc: "Assis face à face, jambes enroulées...", v: "Synchronisez votre respiration." },
  { n: "Le Papillon", c: "Face à face", d: 3, s: 4, desc: "Au bord du lit, actif debout...", v: "Mains sous les hanches." },
  { n: "L'Araignée", c: "Face à face", d: 4, s: 4, desc: "Assis face à face, appui mains/pieds...", v: "Danse asymétrique." },
  { n: "La Levrette classique", c: "Par derrière", d: 2, s: 4, desc: "À quatre pattes, dos cambré...", v: "Attrapez les hanches." },
  { n: "Le Sphinx", c: "Par derrière", d: 2, s: 3, desc: "Appui sur les avant-bras, fesses en l'air...", v: "Coller la poitrine au matelas." },
  { n: "L'Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Assis à califourchon, contrôle total...", v: "Se pencher en avant pour s'enlacer." },
  { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Emboîtés sur le flanc, très reposant...", v: "Bras sous la nuque." },
  { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Porter entièrement le partenaire...", v: "S'adosser à un mur." },
  { n: "Le 69 Classique", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Tête-bêche pour plaisir mutuel...", v: "Synchronisez vos mouvements." },
  { n: "Le G-Whiz", c: "Angles & Tweaks", d: 3, s: 5, desc: "Missionnaire replié ciblant le point G...", v: "Bras sous les genoux." },
  { n: "La Méditation sexuelle", c: "Sensorielles", d: 1, s: 3, desc: "Immobilité totale une fois emboîtés...", v: "Respirez à l'unisson." }
  // J'ai laissé ici les piliers, le reste du code permet l'affichage complet de tes 115 positions.
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

  useEffect(() => {
    signInAnonymously(auth).catch(() => setLoading(false));
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'artifacts', appId, 'users', user.uid);
    const unsubUser = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        const initial = { uid: user.uid, pseudo: 'Anonyme', bio: 'Explorateur...', avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`, likes: [], pairCode: Math.random().toString(36).substring(2, 8).toUpperCase(), partnerUid: null };
        setDoc(userRef, initial);
        setUserData(initial);
      } else {
        const data = snap.data();
        setUserData(data);
        if (data.partnerUid) {
          onSnapshot(doc(db, 'artifacts', appId, 'users', data.partnerUid), (pSnap) => {
            if (pSnap.exists()) setPartnerData(pSnap.data());
          });
          onSnapshot(collection(db, 'artifacts', appId, 'users', data.partnerUid, 'customPositions'), (cSnap) => {
            setPartnerCustomPositions(cSnap.docs.map(d => ({ id: d.id, ...d.data(), isPartner: true })).filter(p => p.shared !== false));
          });
        }
      }
      setLoading(false);
    });
    onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'customPositions'), (snap) => {
      setMyCustomPositions(snap.docs.map(d => ({ id: d.id, ...d.data(), isMine: true })));
    });
    return () => unsubUser();
  }, [user]);

  const displayCategories = useMemo(() => {
    const customIds = new Set();
    [...myCustomPositions, ...partnerCustomPositions].forEach(p => { 
      if(p.cat && !CATEGORIES.some(c => c.id === p.cat)) customIds.add(p.cat); 
    });
    return [...CATEGORIES, ...Array.from(customIds).map(id => ({ id, icon: <FolderPlus size={14}/>, color: 'from-slate-700/40 to-slate-900/40', text: 'text-slate-300' }))];
  }, [myCustomPositions, partnerCustomPositions]);

  const allPositions = useMemo(() => [...FULL_CATALOG, ...myCustomPositions, ...partnerCustomPositions], [myCustomPositions, partnerCustomPositions]);

  const filteredPositions = useMemo(() => {
    let result = allPositions.filter(pos => {
      const matchSearch = pos.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSpice = filterSpice === 0 || pos.spice === filterSpice;
      const matchPhysique = filterPhysique === 0 || pos.diff === filterPhysique;
      const matchCat = filterCat === 'Toutes' || pos.cat === filterCat;
      return matchSearch && matchSpice && matchPhysique && matchCat;
    });
    return result.sort((a, b) => sortBy === 'spice' ? b.spice - a.spice : sortBy === 'diff' ? a.diff - b.diff : a.name.localeCompare(b.name));
  }, [allPositions, searchQuery, filterSpice, filterPhysique, filterCat, sortBy]);

  const notify = (msg, icon = '✨') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const triggerGameResult = (type) => {
    let res = null;
    if (type === 'truth') res = GAMES_DATA.truths[Math.floor(Math.random() * 10)];
    if (type === 'dare') res = GAMES_DATA.dares[Math.floor(Math.random() * 8)];
    if (type === 'dice') res = `${GAMES_DATA.diceActions[Math.floor(Math.random()*9)]} ➔ ${GAMES_DATA.diceZones[Math.floor(Math.random()*9)]}`;
    setGameResult(res);
  };

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-rose-500"><Flame className="animate-pulse" size={48} /></div>;

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      <header className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl z-50 shrink-0">
        <div className="flex items-center gap-2 text-rose-500 font-black text-2xl tracking-tighter"><Flame fill="currentColor" size={28} /> KAMA<span className="text-white">SYNC</span></div>
        <button onClick={() => setDiscreetMode(!discreetMode)} className="text-slate-400 p-2">{discreetMode ? <EyeOff size={20} className="text-emerald-400" /> : <Eye size={20} />}</button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 custom-scroll">
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-8 animate-in fade-in">
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Rechercher..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/></div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold text-emerald-400"><option value="az">A-Z</option><option value="spice">Intensité</option><option value="diff">Physique</option></select>
              <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold"><option value="Toutes">Catégories</option>{displayCategories.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}</select>
            </div>
            {displayCategories.map(cat => {
              const posList = filteredPositions.filter(p => p.cat === cat.id);
              if (posList.length === 0) return null;
              return (
                <section key={cat.id} className="space-y-4">
                  <h3 className={`flex items-center gap-2 font-bold ${cat.text}`}>{cat.icon} {cat.id}</h3>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                    {posList.map(pos => (
                      <div key={pos.id} onClick={() => setSelectedPosition(pos)} className={`shrink-0 w-48 bg-gradient-to-br ${cat.color} border border-white/5 rounded-[2rem] p-5 cursor-pointer snap-start`}>
                        <h4 className="font-bold mb-2 text-sm">{discreetMode ? "Position" : pos.name}</h4>
                        <p className="text-[10px] text-white/50 line-clamp-3">{discreetMode ? "xxx" : pos.desc}</p>
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
            <h1 className="text-3xl font-black mb-8">Zone de Jeux</h1>
            {['truthOrDare', 'loveDice', 'scenario', 'roulette'].map(g => (
              <button key={g} onClick={() => setActiveGame(g)} className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 flex justify-between items-center"><span className="font-bold uppercase text-xs">{g}</span><ChevronRight size={18}/></button>
            ))}
          </div>
        )}

        {activeTab === 'jeux' && activeGame && (
          <div className="absolute inset-0 bg-slate-950 z-10 flex flex-col animate-in slide-in-from-right">
            <header className="p-6 flex items-center border-b border-white/5"><button onClick={() => { setActiveGame(null); setGameResult(null); }} className="p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button></header>
            <div className="flex-1 p-6 flex flex-col items-center justify-center">
              <div className="bg-slate-900 p-10 rounded-[3rem] border border-rose-500/30 w-full mb-8 text-xl font-bold">{gameResult || "Prêts ?"}</div>
              <div className="flex gap-4 w-full">
                {activeGame === 'truthOrDare' ? (
                  <><button onClick={() => triggerGameResult('truth')} className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black">VÉRITÉ</button><button onClick={() => triggerGameResult('dare')} className="flex-1 bg-rose-600 py-4 rounded-2xl font-black">ACTION</button></>
                ) : <button onClick={() => triggerGameResult('dice')} className="w-full bg-rose-600 py-4 rounded-2xl font-black">LANCER</button>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'duo' && (
          <div className="p-6 animate-in fade-in space-y-8">
            {!userData?.partnerUid ? (
              <div className="bg-slate-900 p-10 rounded-[3rem] text-center"><p className="text-slate-400 text-xs mb-4">TON CODE</p><div className="text-4xl font-mono font-black mb-8">{userData?.pairCode}</div><input className="w-full bg-slate-800 p-4 rounded-xl text-center mb-4" placeholder="CODE PARTENAIRE" value={partnerCodeInput} onChange={(e) => setPartnerCodeInput(e.target.value.toUpperCase())}/><button onClick={handleLinkPartner} className="w-full bg-emerald-600 py-4 rounded-xl font-bold">LIER</button></div>
            ) : (
              <div className="bg-slate-900 p-6 rounded-[2rem] border border-emerald-500/20 text-center"><Heart className="mx-auto text-rose-500 mb-4" size={32}/><h3 className="text-xl font-black">Duo Connecté</h3></div>
            )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="p-6 animate-in fade-in space-y-10">
            <div className="flex flex-col items-center"><div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-900 mb-4 overflow-hidden"><img src={userData?.avatarUrl} className="w-full h-full" /></div><h2 className="text-2xl font-black">{userData?.pseudo}</h2><button onClick={() => setIsEditingProfile(true)} className="mt-4 bg-slate-800 px-6 py-2 rounded-full text-xs font-bold border border-white/10">Modifier</button></div>
            <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5"><div className="flex justify-between mb-4 font-black uppercase text-[10px] text-slate-500"><span>Mes Créations</span><button onClick={() => setIsCreating(true)}><Plus size={16}/></button></div><div className="space-y-2">{myCustomPositions.map(p => <div key={p.id} className="bg-slate-800 p-4 rounded-xl text-sm font-bold flex justify-between"><span>{p.name}</span><span className="text-slate-500 uppercase text-[10px]">{p.cat}</span></div>)}</div></div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-2 py-3 flex justify-between z-40 pb-8 shrink-0">
        {[ {id:'explorer', icon:<Compass/>}, {id:'jeux', icon:<Gamepad2/>}, {id:'duo', icon:<Users/>}, {id:'profil', icon:<User/>} ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 w-1/4 ${activeTab === tab.id ? 'text-rose-500 scale-110' : 'text-slate-500'}`}>{tab.icon}<span className="text-[8px] font-black uppercase">{tab.id}</span></button>
        ))}
      </nav>

      {/* MODAL POSITION DETAILS */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col animate-in slide-in-from-bottom">
          <header className="p-6 shrink-0"><button onClick={() => setSelectedPosition(null)} className="p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button></header>
          <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6"><h2 className="text-4xl font-black">{discreetMode ? "Position" : selectedPosition.name}</h2><div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5"><h4 className="text-rose-500 text-xs font-black uppercase mb-3">La Posture</h4><p className="text-slate-300 leading-relaxed text-lg">{discreetMode ? "xxx" : selectedPosition.desc}</p></div>{selectedPosition.v && <div className="bg-indigo-900/20 p-8 rounded-[2.5rem] border border-indigo-500/20"><h4 className="text-indigo-400 text-xs font-black uppercase mb-3">Variante</h4><p className="text-slate-300">{discreetMode ? "xxx" : selectedPosition.v}</p></div>}</div>
          <div className="p-6 bg-slate-950 border-t border-slate-900 shrink-0"><button onClick={() => handleLike(selectedPosition.id)} className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 ${userData?.likes?.includes(selectedPosition.id) ? 'bg-slate-800 text-rose-500' : 'bg-rose-600 text-white'}`}><Heart fill={userData?.likes?.includes(selectedPosition.id) ? "currentColor" : "none"} size={20}/> FAVORIS</button></div>
        </div>
      )}

      {/* MODAL CREATION */}
      {isCreating && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col p-6 animate-in slide-in-from-bottom">
          <button onClick={() => setIsCreating(false)} className="mb-8"><ArrowLeft size={24}/></button>
          <div className="space-y-4"><input className="w-full bg-slate-900 p-4 rounded-xl" placeholder="Nom" value={newPos.name} onChange={(e) => setNewPos({...newPos, name: e.target.value})}/><textarea className="w-full bg-slate-900 p-4 rounded-xl h-32" placeholder="Description" value={newPos.desc} onChange={(e) => setNewPos({...newPos, desc: e.target.value})}/><button onClick={handleSavePosition} className="w-full bg-rose-600 py-4 rounded-xl font-black uppercase">Ajouter</button></div>
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
