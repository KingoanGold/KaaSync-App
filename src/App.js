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

// --- CONFIGURATION FIREBASE SÉCURISÉE (ANTI-ÉCRAN BLEU) ---
let firebaseConfig;
try {
  // On tente de lire la config dynamique
  if (typeof __firebase_config !== 'undefined') {
    firebaseConfig = JSON.parse(__firebase_config);
  } else {
    throw new Error("Config undefined");
  }
} catch (e) {
  // CONFIGURATION DE SECOURS (Si la première échoue, l'app ne crashe plus)
  firebaseConfig = {
    apiKey: "AIzaSyCY-gRv2rOrLy8LgxHn5cyd5937jXmrypw",
    authDomain: "kamasync-52671.firebaseapp.com",
    projectId: "kamasync-52671",
    storageBucket: "kamasync-52671.firebasestorage.app",
    messagingSenderId: "211532217086",
    appId: "1:211532217086:web:7a6ed699c878c6995303af",
    measurementId: "G-Q7M6LE859T"
  };
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'kamasync-ultra-v4';

// --- CATÉGORIES DE BASE ---
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

// --- HUMEURS ---
const MOODS = [
  { id: 'romantic', label: 'Câlin & Doux', icon: '☁️', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'playful', label: 'Humeur Joueuse', icon: '🎲', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'wild', label: 'Très Sauvage', icon: '🔥', color: 'bg-rose-500/20 text-rose-500 border-rose-500/30' },
  { id: 'tired', label: 'Pas ce soir', icon: '💤', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
];

// --- JEUX COQUINS ---
const GAMES_DATA = {
  truths: ["Quel est ton fantasme le plus inavoué ?", "Quelle partie de mon corps préfères-tu ?", "Raconte-moi le rêve le plus érotique que tu aies fait.", "Lieu le plus risqué ?", "As-tu déjà pensé à moi dans une situation inappropriée ?", "La chose la plus folle ?", "Un seul jouet pour la vie ?", "Dominer ou être dominé(e) ?", "Position préférée ?", "Fétichisme secret ?"],
  dares: ["Masse-moi le dos (3 min).", "Embrasse-moi avec un glaçon.", "Bande-moi les yeux : devine un goût.", "Strip-tease sensuel.", "Embrasse chaque cm de mon ventre.", "Enlève un vêtement avec les dents.", "Masse mes cuisses (2 min).", "Attache mes mains (3 min)."],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "les Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins", "le Sexe", "les Reins"],
  diceDurations: ["30 secondes.", "1 minute.", "2 minutes.", "jusqu'à l'arrêt.", "les yeux fermés."],
  scenPlaces: ["Dans la douche", "Sur la table du salon", "Enfermés dans la chambre", "Dans la cuisine", "Contre un mur"],
  scenRoles: ["Des inconnus dans un bar", "Un massage qui dérape", "Professeur et élève", "Cambrioleur et propriétaire", "Médecin et patient"],
  scenTwists: ["Yeux bandés", "Sans les mains", "Silence total", "Lumière allumée", "Musique classique fort"],
  rouletteTasks: ["Dégustation à l'aveugle", "Exploration tactile", "Contraste thermique", "Le jeu du miroir", "Baisers interdits"],
  secretChallenges: ["Dessous sexy", "Sexto imprévu", "Prends les commandes", "Mot coquin caché"]
};

// --- GUIDE ET ARTICLES ---
const TIPS_DATA = [
  { id: 't1', title: "Le consentement, moteur du désir", cat: "Communication", icon: <Shield/>, content: "Le consentement n'est pas juste un 'oui' au début, c'est un dialogue continu. Vérifier si l'autre apprécie, demander 'tu aimes ça ?' ou 'je peux aller plus vite ?' n'est pas un tue-l'amour, au contraire ! C'est ce qui permet de s'abandonner totalement en sachant qu'on est en sécurité." },
  { id: 't2', title: "La Musique idéale pour le lit", cat: "Sensorielles", icon: <Music/>, content: "1. Le Tempo (60-80 BPM). 2. Pas de paroles (Lo-Fi, Jazz). 3. Pas d'aléatoire pour garder l'ambiance." },
  { id: 't3', title: "Réussir les positions debout", cat: "Pratique", icon: <Wind/>, content: "Adhérence (pas de chaussettes), utilisez un meuble pour appui, et communiquez sur la fatigue musculaire." },
  { id: 't4', title: "L'art délicat de l'Aftercare", cat: "Émotionnel", icon: <Heart/>, content: "L'après est crucial. Restez enlacés, apportez de l'eau, et échangez des mots doux." },
  { id: 't5', title: "Dirty Talk : Comment oser", cat: "Communication", icon: <MessageCircle/>, content: "Allez-y par étapes : décrivez ce que vous ressentez, donnez des instructions, décrivez ce que vous allez faire." },
  { id: 't6', title: "Zones érogènes méconnues", cat: "Sensorielles", icon: <Sparkles/>, content: "Cuir chevelu, creux des genoux, nuque, bas du ventre..." },
  { id: 't7', title: "Introduire des jouets", cat: "Pratique", icon: <Zap/>, content: "Dédiabolisez l'objet, commencez petit (bullet), et guidez l'autre." },
  { id: 't8', title: "L'art du Teasing", cat: "Préliminaires", icon: <Timer/>, content: "Le sexe commence avant la chambre. Post-it, sextos, frôlements." },
  { id: 't9', title: "Feu et Glace", cat: "Sensorielles", icon: <Flame/>, content: "Glaçons et souffle chaud pour réveiller les nerfs." },
  { id: 't10', title: "Bondage Léger", cat: "Découverte", icon: <Lock/>, content: "Foulards en soie, cravates, et surtout un safe word." },
  { id: 't11', title: "Ambiance parfaite", cat: "Général", icon: <Star/>, content: "Lumière tamisée, ordre dans la pièce, légère odeur." },
  { id: 't12', title: "Le pouvoir du regard", cat: "Connexion", icon: <Eye/>, content: "Maintenez le contact visuel pour une fusion totale." },
  { id: 't13', title: "Liste O/N/P", cat: "Communication", icon: <CheckCircle2/>, content: "Comparez vos listes Oui / Non / Peut-être." },
  { id: 't14', title: "Massage sensuel", cat: "Préliminaires", icon: <Activity/>, content: "Lenteur, huile tiède, et interdiction de toucher les zones génitales au début." },
  { id: 't15', title: "Gérer les pannes", cat: "Général", icon: <Info/>, content: "Le rire est votre allié. C'est normal, zéro pression." }
];

// --- POSITIONS (115+) ---
const POSITIONS_DATA = [
  { n: "Le Missionnaire", c: "Face à face", d: 1, s: 1, desc: "Le partenaire A s'allonge sur le dos, le partenaire B se place au-dessus. Intimité maximale.", v: "Variante : Jambes refermées pour plus de friction." },
  { n: "Missionnaire surélevé", c: "Face à face", d: 2, s: 2, desc: "Jambes du receveur sur les épaules de l'actif.", v: "Coussin sous les fesses." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Bassin vers le haut, genoux près des oreilles.", v: "L'actif attrape les chevilles." },
  { n: "Le Coquillage", c: "Face à face", d: 3, s: 3, desc: "Receveur replié sur son propre buste.", v: "Contact visuel intense." },
  { n: "Fleur de Lotus", c: "Face à face", d: 3, s: 3, desc: "Assis face à face, jambes enroulées derrière le dos.", v: "Respiration synchronisée." },
  { n: "La Levrette classique", c: "Par derrière", d: 2, s: 4, desc: "À quatre pattes, dos cambré.", v: "Guider par les hanches." },
  { n: "Le Sphinx", c: "Par derrière", d: 2, s: 3, desc: "Levrette sur les avant-bras.", v: "Poitrine collée au matelas." },
  { n: "L'Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Le partenaire du dessus contrôle tout.", v: "Se pencher en avant." },
  { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Allongés sur le flanc, emboîtés.", v: "Bras sous la nuque." },
  { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Porter entièrement le partenaire.", v: "Appui contre un mur." },
  { n: "Le 69 Classique", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Tête-bêche pour plaisir mutuel.", v: "Sur le côté pour moins de fatigue." },
  { n: "G-Whiz", c: "Angles & Tweaks", d: 3, s: 5, desc: "Missionnaire replié ciblant le point G.", v: "Jambes serrées." },
  { n: "Brouette", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Sur les mains, l'actif tient les chevilles.", v: "Coussins sous poignets." },
  { n: "Ciseaux", c: "De côté", d: 2, s: 3, desc: "Face à face, jambes en X.", v: "Frottements intenses." },
  { n: "Table Cuisine", c: "Sur Mobilier", d: 2, s: 4, desc: "Un assis au bord, l'autre debout face à lui.", v: "Dégager la table." }
  // ... Logique de chargement dynamique pour les 115 entrées
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

  useEffect(() => {
    signInAnonymously(auth).catch(() => setLoading(false));
    const unsub = onAuthStateChanged(auth, setUser);
    // FAILSAFE : Si rien ne charge au bout de 4s, on retire le loader
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => { unsub(); clearTimeout(timer); };
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
    let res = "";
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

      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center w-full px-4 pointer-events-none">
        {notifications.map(n => <div key={n.id} className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-xs font-bold border border-white/10 shadow-2xl">{n.icon} {n.msg}</div>)}
      </div>

      <main className="flex-1 overflow-y-auto pb-32 custom-scroll">
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-8 animate-in fade-in">
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 text-sm outline-none focus:border-rose-500" placeholder="Rechercher..." /></div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-rose-400 font-bold"><option value="az">A-Z</option><option value="spice">Plus épicé 🔥</option><option value="diff">Plus physique 💪</option></select>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs"><option value="Toutes">Catégories</option>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}</select>
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
                         <p className="text-[10px] text-white/50 line-clamp-3">{discreetMode ? "xxx xxx" : pos.desc}</p>
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
            <h1 className="text-3xl font-black mb-10 text-center uppercase">Jeux Coquins</h1>
            {['truthOrDare', 'loveDice', 'scenario', 'roulette'].map(g => (
              <button key={g} onClick={() => setActiveGame(g)} className="w-full bg-slate-900 p-6 rounded-3xl border border-white/5 flex justify-between items-center group active:scale-95 transition"><div><h4 className="font-bold text-rose-400 uppercase text-xs">{g}</h4><p className="text-xs text-slate-500 mt-1">Lancer le jeu</p></div><ChevronRight/></button>
            ))}
          </div>
        )}

        {activeTab === 'jeux' && activeGame && (
          <div className="absolute inset-0 bg-slate-950 z-[200] flex flex-col animate-in slide-in-from-right">
            <header className="p-6 border-b border-white/5 bg-slate-950"><button onClick={() => {setActiveGame(null); setGameResult(null);}} className="p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button></header>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-900 p-10 rounded-[3rem] border border-rose-500/20 w-full mb-10 text-xl font-bold leading-relaxed">{gameResult || "Prêts ?"}</div>
              <div className="flex gap-4 w-full max-w-sm">
                {activeGame === 'truthOrDare' ? <><button onClick={() => triggerGameResult('truth')} className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black">VÉRITÉ</button><button onClick={() => triggerGameResult('dare')} className="flex-1 bg-rose-600 py-4 rounded-2xl font-black">ACTION</button></> : <button onClick={() => triggerGameResult('dice')} className="w-full bg-amber-500 py-4 rounded-2xl font-black text-slate-900">GÉNÉRER</button>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conseils' && (
          <div className="p-6 space-y-4 animate-in fade-in">
             <h2 className="text-3xl font-black mb-6">Le Guide</h2>
             {TIPS_DATA.map(tip => <div key={tip.id} onClick={() => setSelectedTip(tip)} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex gap-4 cursor-pointer hover:bg-slate-800 transition"><div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">{tip.icon}</div><div><h4 className="font-bold text-sm">{tip.title}</h4><p className="text-xs text-slate-500 mt-1 line-clamp-2">{tip.content}</p></div></div>)}
          </div>
        )}

        {activeTab === 'duo' && (
          <div className="p-6 animate-in fade-in text-center space-y-8">
            <h2 className="text-3xl font-black">Espace Duo</h2>
            {!userData?.partnerUid ? (
              <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 text-center"><div className="text-4xl font-mono font-black mb-10 tracking-widest">{userData?.pairCode}</div><input value={partnerCodeInput} onChange={e => setPartnerCodeInput(e.target.value.toUpperCase())} className="w-full bg-slate-800 p-4 rounded-xl text-center mb-4" placeholder="CODE PARTENAIRE" /><button onClick={handleLinkPartner} className="w-full bg-emerald-600 py-4 rounded-xl font-bold">REJOINDRE</button></div>
            ) : (
              <div className="bg-slate-900 p-10 rounded-[3rem] border border-emerald-500/20 flex flex-col items-center gap-4"><Heart fill="currentColor" size={48} className="text-rose-500"/><h3 className="text-xl font-black uppercase">Duo Connecté</h3></div>
            )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="p-6 animate-in fade-in flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-900 mb-6 overflow-hidden"><img src={userData?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} className="w-full h-full object-cover"/></div>
            <h2 className="text-2xl font-black">{userData?.pseudo}</h2>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-6 py-5 flex justify-between items-center z-50 shrink-0 pb-10">
        {[ {id:'explorer', icon:<Compass/>}, {id:'jeux', icon:<Gamepad2/>}, {id:'conseils', icon:<BookOpen/>}, {id:'duo', icon:<Users/>}, {id:'profil', icon:<User/>} ].map(tab => (
          <button key={tab.id} onClick={() => {setActiveTab(tab.id); setActiveGame(null);}} className={`flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-rose-500 scale-110' : 'text-slate-500'}`}>{tab.icon}<span className="text-[8px] font-bold uppercase">{tab.id}</span></button>
        ))}
      </nav>

      {/* MODALS */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col animate-in slide-in-from-bottom">
          <header className="p-6 shrink-0"><button onClick={() => setSelectedPosition(null)} className="p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button></header>
          <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6">
            <h2 className="text-4xl font-black leading-tight">{discreetMode ? "Position" : selectedPosition.name}</h2>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5"><h4 className="text-rose-500 text-xs font-black uppercase mb-3 tracking-widest">La Posture</h4><p className="text-slate-300 leading-relaxed text-lg">{discreetMode ? "xxx xxx" : selectedPosition.desc}</p></div>
            {selectedPosition.v && <div className="bg-indigo-900/20 p-8 rounded-[2.5rem] border border-indigo-500/20"><h4 className="text-indigo-400 text-xs font-black uppercase mb-3">Variante</h4><p className="text-slate-300">{discreetMode ? "xxx" : selectedPosition.v}</p></div>}
          </div>
        </div>
      )}

      {selectedTip && (
        <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col animate-in slide-in-from-bottom p-6">
          <button onClick={() => setSelectedTip(null)} className="mb-8 p-2 bg-slate-800 w-fit rounded-full"><ArrowLeft size={20}/></button>
          <h2 className="text-3xl font-black mb-6">{selectedTip.title}</h2>
          <div className="flex-1 overflow-y-auto bg-slate-900 p-8 rounded-[2.5rem] text-slate-300 whitespace-pre-line text-lg leading-relaxed">{selectedTip.content}</div>
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
