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
    "Quel est le lieu le plus risqué où tu aimerais faire l'amour ?", "As-tu déjà pensé à moi dans une situation inappropriée ?",
    "Quelle est la chose la plus folle que tu aimerais que je te fasse ?", "Si tu devais choisir un seul jouet sexuel pour le reste de ta vie, ce serait quoi ?",
    "Préfères-tu dominer ou être dominé(e) ?", "Quelle est ta position préférée et pourquoi ?", "As-tu un fétichisme secret ?",
    "Quelle est la chose la plus osée que tu aies faite en public ?", "Y a-t-il une position que tu as peur d'essayer ?", "Quel vêtement m'enlèverais-tu en premier ?"
  ],
  dares: [
    "Masse-moi le dos pendant 3 minutes avec de l'huile.", "Embrasse-moi dans le cou avec un glaçon.",
    "Bande-moi les yeux et fais-moi deviner un goût.", "Fais-moi un strip-tease sensuel.",
    "Embrasse passionnément chaque centimètre de mon ventre.", "Enlève un vêtement avec tes dents.",
    "Masse l'intérieur de mes cuisses sans toucher mon sexe pendant 2 min.", "Attache mes mains et fais ce que tu veux pendant 3 min."
  ],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "les Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins", "le Sexe", "les Reins"],
  diceDurations: ["30 secondes", "1 minute", "2 minutes", "jusqu'à l'orgasme"],
  scenPlaces: ["Dans la douche", "Sur la table", "Dans la chambre", "Dans la cuisine", "Contre un mur"],
  scenRoles: ["Inconnus dans un bar", "Masseur & Client", "Professeur & Élève", "Cambrioleur & Propriétaire", "Médecin & Patient"],
  scenTwists: ["Yeux bandés", "Sans les mains", "Silence total", "Lumière allumée"],
  rouletteTasks: ["Dégustation à l'aveugle", "Exploration tactile", "Contraste thermique", "Jeu du miroir", "Baisers interdits"],
  secretChallenges: ["Porte des dessous sexy", "Sexto surprise", "Prends les commandes", "Mot coquin caché"]
};

// --- DONNÉES MASSIVES : POSITIONS (+100) ---
const POSITIONS_DATA = [
  // FACE À FACE
  { n: "Le Missionnaire", c: "Face à face", d: 1, s: 1, desc: "L'indémodable. Partenaire A sur le dos, B au-dessus. Idéal pour les baisers.", v: "Variante : Jambes refermées pour plus de friction." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Receveur sur le dos, jambes repliées vers les épaules. Très profond.", v: "Variante : L'actif attrape les chevilles pour stabiliser." },
  { n: "La Fleur de Lotus", c: "Face à face", d: 3, s: 3, desc: "Assis face à face, le partenaire B entoure la taille de A avec ses jambes.", v: "Variante : Balancier lent et respiration synchronisée." },
  { n: "Le Coquillage", c: "Face à face", d: 3, s: 3, desc: "Receveur replié sur lui-même, actif enveloppant tout le corps.", v: "Variante : Contact visuel maintenu." },
  { n: "Le Papillon", c: "Face à face", d: 3, s: 4, desc: "Receveur au bord du lit, actif debout devant.", v: "Variante : Surélever le bassin avec les mains." },
  { n: "L'Araignée", c: "Face à face", d: 4, s: 4, desc: "Assis face à face, en appui arrière sur les mains et les pieds.", v: "Variante : Mouvements de va-et-vient asymétriques." },
  { n: "Le Wrap", c: "Face à face", d: 2, s: 3, desc: "Missionnaire où le receveur verrouille ses jambes dans le dos de l'actif.", v: "Variante : Serrez/desserrez pour contrôler la profondeur." },
  { n: "L'Étreinte du Panda", c: "Face à face", d: 2, s: 2, desc: "Assis sur un canapé, blottis l'un contre l'autre.", v: "Variante : Mouvements circulaires lents." },
  { n: "La Montagne Magique", c: "Face à face", d: 2, s: 2, desc: "Missionnaire avec les pieds à plat sur le matelas.", v: "Variante : Pousser sur les talons pour lever le bassin." },
  // PAR DERRIÈRE
  { n: "La Levrette Classique", c: "Par derrière", d: 2, s: 4, desc: "À quatre pattes. Position primale, visuelle et profonde.", v: "Variante : Attraper les hanches pour guider l'impact." },
  { n: "Le Sphinx", c: "Par derrière", d: 2, s: 3, desc: "Receveur allongé à plat ventre, actif par-dessus.", v: "Variante : Coussin sous le bas-ventre." },
  { n: "La Grenouille", c: "Par derrière", d: 2, s: 4, desc: "À plat ventre, genoux écartés au maximum vers l'extérieur.", v: "Variante : Presser l'intérieur des cuisses." },
  { n: "Le Chien de Chasse", c: "Par derrière", d: 3, s: 4, desc: "Levrette avec une jambe du receveur tendue vers l'arrière.", v: "Variante : Jambe tendue vers le plafond." },
  { n: "Le Toboggan", c: "Par derrière", d: 3, s: 4, desc: "Receveur à genoux avec le buste redressé à la verticale.", v: "Variante : L'actif entoure le buste pour caresser le torse." },
  { n: "La Luge", c: "Par derrière", d: 3, s: 3, desc: "Receveur sur le ventre, actif assis à califourchon.", v: "Variante : Penché en avant pour masser les épaules." },
  { n: "Le Lazy Dog", c: "Par derrière", d: 1, s: 2, desc: "Levrette sans effort, l'actif s'allonge sur le dos du receveur.", v: "Variante : Mains sous le ventre pour soutenir." },
  // AU-DESSUS
  { n: "Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Receveur assis au-dessus du partenaire allongé. Contrôle total.", v: "Variante : Se pencher en avant pour s'enlacer." },
  { n: "Andromaque Inversée", c: "Au-dessus", d: 3, s: 4, desc: "Assis au-dessus mais tournant le dos au partenaire.", v: "Variante : Se pencher vers les jambes de l'allongé." },
  { n: "L'Amazone", c: "Au-dessus", d: 4, s: 5, desc: "Accroupi au-dessus sans poser les genoux. Très physique.", v: "Variante : L'allongé aide en tenant les hanches." },
  { n: "La Cow-girl Rodéo", c: "Au-dessus", d: 3, s: 4, desc: "Mouvements de rotation circulaire du bassin.", v: "Variante : Alternez rotations lentes et rebonds rapides." },
  { n: "Le Bridge", c: "Au-dessus", d: 4, s: 4, desc: "Le partenaire supérieur fait le pont au-dessus de l'allongé.", v: "Variante : Rapprochez mains et pieds pour cambrer." },
  // DE CÔTÉ
  { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Allongés sur le flanc, emboîtés l'un derrière l'autre. Très relaxant.", v: "Variante : Bras arrière sous la nuque du receveur." },
  { n: "Les Ciseaux", c: "De côté", d: 2, s: 3, desc: "Face à face, jambes entrelacées en X. Frottements intenses.", v: "Variante : Ne connecter que les bassins." },
  { n: "Le Tire-bouchon", c: "De côté", d: 3, s: 4, desc: "A sur le dos, B sur le flanc perpendiculairement.", v: "Variante : Tirer les hanches vers soi." },
  // DEBOUT
  { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "L'actif porte entièrement le partenaire.", v: "Variante : S'adosser à un mur pour stabiliser." },
  { n: "Le Poteau", c: "Debout & Acrobatique", d: 4, s: 4, desc: "Receveur contre un mur, actif face à lui.", v: "Variante : Lever une jambe autour de la taille." },
  { n: "La Brouette", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Receveur sur les mains, actif tenant les chevilles.", v: "Variante : Coussin sous les poignets." },
  // MOBILIER
  { n: "La Table de Cuisine", c: "Sur Mobilier", d: 2, s: 4, desc: "Assis au bord d'une table, l'autre debout face à lui.", v: "Variante : S'allonger en arrière sur la table." },
  { n: "Le Fauteuil de Bureau", c: "Sur Mobilier", d: 2, s: 3, desc: "Exploitez le rebond et la rotation du siège.", v: "Variante : Pousser sur le sol pour tourner." },
  // ORAL
  { n: "Le 69", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Tête-bêche pour une stimulation mutuelle simultanée.", v: "Variante : Sur le côté pour moins de fatigue." },
  { n: "La Cascade", c: "Oral & Préliminaires", d: 3, s: 5, desc: "Receveur tête au bord du lit vers le bas.", v: "Variante : Massage de la gorge exposé." }
];

// --- DONNÉES ARTICLES CONSEILS ---
const TIPS_DATA = [
  { id: 't1', title: "Le consentement", cat: "Communication", icon: <Shield/>, content: "Le consentement est un dialogue continu. Demander 'tu aimes ça ?' n'est pas un tue-l'amour." },
  { id: 't2', title: "Musique & BPM", cat: "Sensorielles", icon: <Music/>, content: "Cherchez des musiques entre 60 et 80 BPM pour synchroniser les cœurs." },
  { id: 't3', title: "L'Aftercare", cat: "Émotionnel", icon: <Heart/>, content: "Rester enlacés après l'acte aide à gérer la retombée hormonale." },
  { id: 't4', title: "Dirty Talk", cat: "Communication", icon: <MessageCircle/>, content: "Commencez par décrire vos sensations, puis vos intentions." },
  { id: 't5', title: "Zones érogènes", cat: "Sensorielles", icon: <Sparkles/>, content: "N'oubliez pas la nuque, le cuir chevelu et l'intérieur des poignets." }
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

  // --- AUTH ---
  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  // --- FIRESTORE SYNC ---
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubUser = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        const initial = { uid: user.uid, pseudo: 'Anonyme', bio: '', likes: [], pairCode: Math.random().toString(36).substring(2, 8).toUpperCase(), partnerUid: null, mood: 'playful' };
        setDoc(userRef, initial);
        setUserData(initial);
      } else {
        const data = snap.data();
        setUserData(data);
        if (data.partnerUid) {
          onSnapshot(doc(db, 'users', data.partnerUid), (pSnap) => { if (pSnap.exists()) setPartnerData(pSnap.data()); });
        }
      }
      setLoading(false);
    });
    return () => unsubUser();
  }, [user]);

  // --- RECHERCHE ET TRI ---
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
    if(type === 'dice') res = `${GAMES_DATA.diceActions[Math.floor(Math.random() * 9)]} ${GAMES_DATA.diceZones[Math.floor(Math.random() * 9)]} pendant ${GAMES_DATA.diceDurations[Math.floor(Math.random() * 4)]}`;
    if(type === 'scenario') res = `Lieu: ${GAMES_DATA.scenPlaces[Math.floor(Math.random()*5)]}, Rôle: ${GAMES_DATA.scenRoles[Math.floor(Math.random()*5)]}`;
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

      {/* CONTENU SCROLLABLE */}
      <main className="flex-1 overflow-y-auto scrolling-touch pb-32">
        
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 text-sm" placeholder="Rechercher une position..." />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs">
                <option value="Toutes">Catégories</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs">
                <option value="az">A-Z</option>
                <option value="spice">Plus épicé</option>
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
          <div className="p-6 space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black mb-6">Jeux & Défis</h2>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => setActiveGame('truthOrDare')} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex justify-between items-center text-left">
                <div><h4 className="font-bold text-rose-400">Action ou Vérité</h4><p className="text-xs text-slate-500">Défis & Secrets</p></div>
                <Zap className="text-rose-500" />
              </button>
              <button onClick={() => triggerGame('dice')} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex justify-between items-center text-left">
                <div><h4 className="font-bold text-amber-400">Dés Coquins</h4><p className="text-xs text-slate-500">Hasard sensuel</p></div>
                <Dices className="text-amber-500" />
              </button>
              <button onClick={() => triggerGame('scenario')} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex justify-between items-center text-left">
                <div><h4 className="font-bold text-purple-400">Scénario Rapide</h4><p className="text-xs text-slate-500">Rôle + Lieu</p></div>
                <Shuffle className="text-purple-500" />
              </button>
            </div>
            {gameResult && (
              <div className="mt-8 bg-slate-900 p-8 rounded-[2rem] border border-rose-500/30 text-center animate-in zoom-in">
                <p className="text-xl font-bold leading-relaxed">{gameResult}</p>
                <div className="flex gap-4 mt-6">
                   <button onClick={() => triggerGame('truth')} className="flex-1 bg-indigo-600/20 text-indigo-400 py-3 rounded-xl font-bold text-xs">VÉRITÉ</button>
                   <button onClick={() => triggerGame('dare')} className="flex-1 bg-rose-600 py-3 rounded-xl font-bold text-xs">ACTION</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'conseils' && (
          <div className="p-6 space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black mb-6">Le Guide</h2>
            {TIPS_DATA.map(tip => (
              <div key={tip.id} onClick={() => setSelectedTip(tip)} className="bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">{tip.icon}</div>
                <div><h4 className="font-bold text-white">{tip.title}</h4><p className="text-[10px] text-slate-500 uppercase">{tip.cat}</p></div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'duo' && (
          <div className="p-6 space-y-8 text-center animate-in fade-in">
            <h2 className="text-3xl font-black">Mode Duo</h2>
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <Users className="mx-auto text-emerald-500 mb-4" size={40} />
              <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest font-black">Ton code de liaison</p>
              <div className="text-4xl font-mono font-black tracking-widest text-white mb-8">{userData?.pairCode}</div>
              <p className="text-[10px] text-slate-500 px-4">Donne ce code à ton partenaire pour lier vos comptes et voir vos matchs favoris.</p>
            </div>
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="p-6 space-y-10 animate-in fade-in">
            <h2 className="text-3xl font-black">Moi</h2>
            <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Avatar" />
                 </div>
                 <div><h3 className="font-bold text-xl">{userData?.pseudo}</h3><p className="text-xs text-slate-500">{userData?.bio || "Aucune bio..."}</p></div>
               </div>
               <button onClick={() => setIsEditingProfile(true)} className="p-3 bg-slate-800 rounded-full"><Edit2 size={18}/></button>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
               <h4 className="text-xs font-black uppercase text-slate-500 mb-4 tracking-widest">Favoris ({userData?.likes?.length || 0})</h4>
               <div className="grid grid-cols-2 gap-2">
                  {userData?.likes?.map(id => {
                    const p = FULL_CATALOG.find(x => x.id === id);
                    return p ? <div key={id} onClick={() => setSelectedPosition(p)} className="bg-slate-800 p-3 rounded-xl text-[10px] font-bold truncate">{p.name}</div> : null;
                  })}
               </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER NAV FIXE */}
      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-6 py-5 flex justify-between items-center z-50 shrink-0 pb-8">
        <button onClick={() => setActiveTab('explorer')} className={`flex flex-col items-center gap-1 ${activeTab === 'explorer' ? 'text-rose-500 scale-110' : 'text-slate-500'}`}><Compass size={24}/><span className="text-[8px] font-bold uppercase">Explorer</span></button>
        <button onClick={() => setActiveTab('jeux')} className={`flex flex-col items-center gap-1 ${activeTab === 'jeux' ? 'text-purple-500 scale-110' : 'text-slate-500'}`}><Gamepad2 size={24}/><span className="text-[8px] font-bold uppercase">Jeux</span></button>
        <button onClick={() => setActiveTab('conseils')} className={`flex flex-col items-center gap-1 ${activeTab === 'conseils' ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}><BookOpen size={24}/><span className="text-[8px] font-bold uppercase">Guide</span></button>
        <button onClick={() => setActiveTab('duo')} className={`flex flex-col items-center gap-1 ${activeTab === 'duo' ? 'text-emerald-400 scale-110' : 'text-slate-500'}`}><Users size={24}/><span className="text-[8px] font-bold uppercase">Duo</span></button>
        <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 ${activeTab === 'profil' ? 'text-white scale-110' : 'text-slate-500'}`}><User size={24}/><span className="text-[8px] font-bold uppercase">Moi</span></button>
      </nav>

      {/* MODAL DETAIL POSITION */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[200] bg-slate-950 p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setSelectedPosition(null)} className="mb-8 text-slate-500 p-2 bg-slate-900 rounded-full w-fit"><ArrowLeft size={24}/></button>
          <div className="flex-1 overflow-y-auto space-y-6">
            <h2 className="text-4xl font-black leading-tight">{discreetMode ? "Position" : selectedPosition.name}</h2>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
              <h4 className="text-rose-500 font-bold text-xs uppercase mb-3 tracking-widest flex items-center gap-2"><Sparkles size={14}/> La Posture</h4>
              <p className="text-slate-300 leading-relaxed text-lg">{discreetMode ? "xxx xxx xxx xxx xxx" : selectedPosition.desc}</p>
            </div>
            {selectedPosition.v && (
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
                <h4 className="text-indigo-400 font-bold text-xs uppercase mb-3 tracking-widest flex items-center gap-2"><RefreshCw size={14}/> Variante</h4>
                <p className="text-slate-400 italic leading-relaxed">{discreetMode ? "xxx xxx" : selectedPosition.v}</p>
              </div>
            )}
          </div>
          <button onClick={() => handleLike(selectedPosition.id)} className={`mt-6 w-full py-5 rounded-2xl font-black text-lg ${userData?.likes?.includes(selectedPosition.id) ? 'bg-slate-800 text-rose-500' : 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'}`}>
            {userData?.likes?.includes(selectedPosition.id) ? "RETIRER DES FAVORIS" : "AJOUTER AUX FAVORIS"}
          </button>
        </div>
      )}

      {/* MODAL TIP */}
      {selectedTip && (
        <div className="fixed inset-0 z-[200] bg-slate-950 p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setSelectedTip(null)} className="mb-8 text-slate-500"><ArrowLeft size={24}/></button>
          <h2 className="text-3xl font-black mb-6">{selectedTip.title}</h2>
          <div className="flex-1 overflow-y-auto bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 text-slate-300 leading-relaxed whitespace-pre-line">
            {selectedTip.content}
          </div>
        </div>
      )}

      {/* NOTIFS */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[500] flex flex-col gap-2 items-center pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-xs font-bold border border-white/10 shadow-2xl animate-in slide-in-from-top">
            {n.icon} {n.msg}
          </div>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        main { -webkit-overflow-scrolling: touch; }
      `}</style>
    </div>
  );
}
