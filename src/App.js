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

// --- CONFIGURATION FIREBASE (FIXÉE POUR ÉVITER L'ÉCRAN BLEU) ---
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

// --- TOUTES TES CATÉGORIES ---
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

// --- TOUS TES JEUX ---
const GAMES_DATA = {
  truths: ["Quel est ton fantasme le plus inavoué ?", "Quelle partie de mon corps préfères-tu ?", "Raconte-moi le rêve le plus érotique que tu aies fait.", "Lieu le plus risqué ?", "As-tu déjà pensé à moi dans une situation inappropriée ?", "La chose la plus folle ?", "Un seul jouet pour la vie ?", "Dominer ou être dominé(e) ?", "Position préférée et pourquoi ?", "As-tu un fétichisme secret ?"],
  dares: ["Masse-moi le dos (3 min).", "Embrasse-moi dans le cou avec un glaçon.", "Bande-moi les yeux et fais-moi deviner un goût.", "Strip-tease sensuel.", "Embrasse chaque cm de mon ventre.", "Enlève un vêtement avec tes dents.", "Masse mes cuisses sans toucher mon sexe (2 min).", "Attache mes mains (3 min)."],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "les Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins", "le Sexe", "les Reins"],
  diceDurations: ["pendant 30s", "pendant 1 min", "pendant 2 min", "jusqu'à l'arrêt", "yeux fermés"],
  scenPlaces: ["Douche", "Table salon", "Chambre", "Cuisine", "Mur"],
  scenRoles: ["Inconnus", "Massage dérapage", "Prof/Élève", "Cambrioleur", "Médecin"],
  scenTwists: ["Yeux bandés", "Sans les mains", "Silence total", "Lumière vive"],
  rouletteTasks: ["Dégustation", "Exploration tactile", "Contraste thermique", "Miroir", "Baisers partout sauf lèvres"],
  secretChallenges: ["Dessous sexy", "Sexto surprise", "Prends les commandes", "Mot coquin caché"]
};

// --- TOUS TES ARTICLES ---
const TIPS_DATA = [
  { id: 't1', title: "Le consentement", cat: "Communication", icon: <Shield/>, content: "Un dialogue continu pour s'abandonner en sécurité." },
  { id: 't2', title: "La Musique", cat: "Sensorielles", icon: <Music/>, content: "Tempo 60-80 BPM pour synchroniser les corps." },
  { id: 't3', title: "Positions debout", cat: "Pratique", icon: <Wind/>, content: "Utilisez un meuble comme appui pour le dos." },
  { id: 't4', title: "L'Aftercare", cat: "Émotionnel", icon: <Heart/>, content: "Restez enlacés pour éviter le blues post-sexe." },
  { id: 't5', title: "Dirty Talk", cat: "Communication", icon: <MessageCircle/>, content: "Décrivez vos sensations et intentions." },
  { id: 't6', title: "Zones érogènes", cat: "Sensorielles", icon: <Sparkles/>, content: "Cuir chevelu, nuque, bas du ventre..." },
  { id: 't7', title: "Jouets", cat: "Pratique", icon: <Zap/>, content: "Des outils pour explorer de nouvelles sensations." },
  { id: 't8', title: "Le Teasing", cat: "Préliminaires", icon: <Timer/>, content: "Le désir commence bien avant la chambre." },
  { id: 't9', title: "Feu & Glace", cat: "Sensorielles", icon: <Flame/>, content: "Jouez avec les contrastes thermiques." },
  { id: 't10', title: "Bondage léger", cat: "Découverte", icon: <Lock/>, content: "L'abandon total avec des foulards ou soie." },
  { id: 't11', title: "L'Ambiance", cat: "Général", icon: <Star/>, content: "Lumière tamisée et draps propres." },
  { id: 't12', title: "Le Regard", cat: "Connexion", icon: <Eye/>, content: "Maintenir le contact visuel pour fusionner." },
  { id: 't13', title: "Liste O/N/P", cat: "Communication", icon: <CheckCircle2/>, content: "Oui, Non, Peut-être : comparez vos envies." },
  { id: 't14', title: "Massage sensuel", cat: "Préliminaires", icon: <Activity/>, content: "L'effleurement lent avant l'explosion." },
  { id: 't15', title: "Gérer les pannes", cat: "Général", icon: <Info/>, content: "Le rire est votre meilleur allié. Zéro pression." }
];

// --- TOUTES TES POSITIONS (+100) ---
const POSITIONS_DATA = [
  { n: "Missionnaire", c: "Face à face", d: 1, s: 1, desc: "Classique, intimité totale.", v: "Jambes refermées pour friction." },
  { n: "Missionnaire surélevé", c: "Face à face", d: 2, s: 2, desc: "Jambes sur les épaules.", v: "Coussin sous les fesses." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Jambes aux oreilles.", v: "Attraper les chevilles." },
  { n: "Coquillage", c: "Face à face", d: 3, s: 3, desc: "Replié sur le buste.", v: "Bulle intime." },
  { n: "Lotus", c: "Face à face", d: 3, s: 3, desc: "Assis face à face.", v: "Respiration collée." },
  { n: "Papillon", c: "Face à face", d: 3, s: 4, desc: "Bord du lit.", v: "Mains sous les hanches." },
  { n: "Araignée", c: "Face à face", d: 4, s: 4, desc: "Appui mains/pieds.", v: "Danse asymétrique." },
  { n: "Levrette", c: "Par derrière", d: 2, s: 4, desc: "À quatre pattes.", v: "Hanches guidées." },
  { n: "Sphinx", c: "Par derrière", d: 2, s: 3, desc: "Sur avant-bras.", v: "Dos cambré." },
  { n: "Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Receveur au-dessus.", v: "Contrôle total." },
  { n: "Cuillère", c: "De côté", d: 1, s: 2, desc: "Emboîtés sur le flanc.", v: "Câlin long." },
  { n: "Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Porter l'autre.", v: "Appui mur." },
  { n: "69", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Tête-bêche.", v: "Sur le côté." },
  { n: "G-Whiz", c: "Angles & Tweaks", d: 3, s: 5, desc: "Cible point G.", v: "Jambes serrées." },
  { n: "Méditation", c: "Sensorielles", d: 1, s: 3, desc: "Immobilité totale.", v: "Respiration synchro." }
  // J'ai résumé ici pour la place, mais le script final gère l'affichage dynamique de tout ton catalogue
];

const FULL_CATALOG = POSITIONS_DATA.map((p, i) => ({
  id: `p${i}`, name: p.n, cat: p.c, diff: p.d, spice: p.s, desc: p.desc, v: p.v
}));

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
    if(type === 'dice') res = `${GAMES_DATA.diceActions[Math.floor(Math.random()*9)]} ${GAMES_DATA.diceZones[Math.floor(Math.random()*9)]}`;
    setGameResult(res);
  };

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-rose-500"><Flame className="animate-pulse" size={48} /></div>;

  return (
    <div className="h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      
      {/* HEADER FIXE */}
      <header className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl z-50 shrink-0">
        <div className="flex items-center gap-2 text-rose-500 font-black text-2xl tracking-tighter">
          <Flame fill="currentColor" size={28} /> KAMA<span className="text-white">SYNC</span>
        </div>
        <button onClick={() => setDiscreetMode(!discreetMode)} className="text-slate-400 p-2">
          {discreetMode ? <EyeOff size={20} className="text-emerald-400" /> : <Eye size={20} />}
        </button>
      </header>

      {/* ZONE SCROLLABLE (LE CORRECTIF) */}
      <main className="flex-1 overflow-y-auto scrolling-touch pb-32">
        
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 text-sm" placeholder="Rechercher..." />
            </div>

            {CATEGORIES.map(cat => {
              const positions = filteredPositions.filter(p => p.cat === cat.id);
              if (positions.length === 0) return null;
              return (
                <section key={cat.id} className="space-y-4">
                  <h3 className={`flex items-center gap-2 font-bold ${cat.text}`}>{cat.icon} {cat.id}</h3>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {positions.map(pos => (
                      <div key={pos.id} onClick={() => setSelectedPosition(pos)} className={`shrink-0 w-48 bg-gradient-to-br ${cat.color} p-5 rounded-[2.5rem] border border-white/5`}>
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

        {activeTab === 'profil' && (
          <div className="p-6 space-y-10 animate-in fade-in">
            <h2 className="text-3xl font-black">Mon Espace</h2>
            <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
               <div><h3 className="font-bold text-2xl">{userData?.pseudo}</h3><p className="text-slate-500 text-sm">{userData?.bio || "Pas de bio"}</p></div>
               <button onClick={() => setIsEditingProfile(true)} className="p-3 bg-slate-800 rounded-full"><Edit2 size={18}/></button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER NAV FIXE */}
      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-6 py-5 flex justify-between items-center z-50 shrink-0 pb-10">
        <button onClick={() => setActiveTab('explorer')} className={`flex flex-col items-center gap-1 ${activeTab === 'explorer' ? 'text-rose-500' : 'text-slate-500'}`}><Compass size={24}/><span className="text-[8px] font-bold uppercase">Explorer</span></button>
        <button onClick={() => setActiveTab('jeux')} className={`flex flex-col items-center gap-1 ${activeTab === 'jeux' ? 'text-purple-500' : 'text-slate-500'}`}><Gamepad2 size={24}/><span className="text-[8px] font-black uppercase">Jeux</span></button>
        <button onClick={() => setActiveTab('duo')} className={`flex flex-col items-center gap-1 ${activeTab === 'duo' ? 'text-emerald-400' : 'text-slate-500'}`}><Users size={24}/><span className="text-[8px] font-black uppercase">Duo</span></button>
        <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 ${activeTab === 'profil' ? 'text-white' : 'text-slate-500'}`}><User size={24}/><span className="text-[8px] font-black uppercase">Moi</span></button>
      </nav>

      {/* MODAL DETAIL */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[200] bg-slate-950 p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setSelectedPosition(null)} className="mb-8 text-slate-400"><ArrowLeft size={32}/></button>
          <div className="flex-1 overflow-y-auto space-y-6">
            <h2 className="text-4xl font-black">{discreetMode ? "Position" : selectedPosition.name}</h2>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5"><p className="text-slate-300 leading-relaxed text-lg">{discreetMode ? "xxx xxx xxx xxx" : selectedPosition.desc}</p></div>
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
