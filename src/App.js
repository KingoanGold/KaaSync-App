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

// --- CONFIGURATION FIREBASE (TES CLÉS) ---
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

// --- HUMEURS INTIMES ---
const MOODS = [
  { id: 'romantic', label: 'Câlin & Doux', icon: '☁️', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'playful', label: 'Humeur Joueuse', icon: '🎲', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'wild', label: 'Très Sauvage', icon: '🔥', color: 'bg-rose-500/20 text-rose-500 border-rose-500/30' },
  { id: 'tired', label: 'Pas ce soir', icon: '💤', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
];

// --- DONNÉES JEUX COQUINS ---
const GAMES_DATA = {
  truths: [
    "Quel est ton fantasme le plus inavoué ?", "Quelle partie de mon corps préfères-tu ?", "Raconte-moi le rêve le plus érotique que tu aies fait.",
    "Quel est le lieu le plus risqué où tu aimerais faire l'amour ?", "As-tu déjà pensé à moi dans une situation inappropriée ?",
    "Quelle est la chose la plus folle que tu aimerais que je te fasse ?", "Si tu devais choisir un seul jouet sexuel pour le reste de ta vie, ce serait quoi ?",
    "Préfères-tu dominer ou être dominé(e) ?", "Quelle est ta position préférée et pourquoi ?", "As-tu un fétichisme secret ?"
  ],
  dares: [
    "Masse-moi le dos pendant 3 minutes avec de l'huile ou de la crème.", "Embrasse-moi dans le cou avec un glaçon.",
    "Bande-moi les yeux et fais-moi deviner ce que tu manges ou bois.", "Fais-moi un strip-tease sensuel sur une musique de mon choix.",
    "Embrasse passionnément chaque centimètre de mon ventre.", "Enlève un de mes vêtements en utilisant uniquement tes dents.",
    "Masse l'intérieur de mes cuisses sans toucher mon sexe pendant 2 minutes.", "Attache mes mains et fais ce que tu veux pendant 3 minutes."
  ],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller avec la langue", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "l'Intérieur des Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins / Pectoraux", "le Sexe", "le Creux des reins"],
  diceDurations: ["pendant 30 secondes.", "pendant 1 minute.", "pendant 2 minutes.", "jusqu'à ce que je te supplie d'arrêter.", "les yeux fermés."],
  scenPlaces: ["Dans la douche", "Sur la table du salon", "Enfermés dans la chambre", "Dans la cuisine", "Contre un mur"],
  scenRoles: ["Des inconnus dans un bar", "Un massage qui dérape", "Professeur et élève", "Cambrioleur et propriétaire", "Médecin et patient"],
  scenTwists: ["Avec un bandeau sur les yeux", "Sans utiliser les mains", "Dans le silence total", "La lumière doit rester allumée", "En écoutant une musique classique très fort"],
  rouletteTasks: [
    "Dégustation à l'aveugle : Fais-moi goûter 3 choses.",
    "Exploration tactile : Caresses avec une plume ou un tissu doux.",
    "Contraste thermique : Souffle chaud et glaçon sur le torse.",
    "Le jeu du miroir : Place-nous devant un miroir.",
    "Baisers interdits : Embrasse tout mon corps SAUF mes lèvres."
  ],
  secretChallenges: [
    "Porte des sous-vêtements sexy dehors sans me le dire.",
    "Envoie-moi un message explicite quand je ne m'y attends pas.",
    "Ce soir, prends totalement les commandes au lit.",
    "Glisse un mot coquin dans ma poche aujourd'hui."
  ]
};

// --- DONNÉES CONSEILS ---
const TIPS_DATA = [
  { id: 't1', title: "Le consentement", cat: "Communication", icon: <Shield/>, time: "2 min", content: "Le consentement n'est pas juste un 'oui' au début, c'est un dialogue continu..." },
  { id: 't2', title: "La Musique idéale", cat: "Sensorielles", icon: <Music/>, time: "4 min", content: "Cherchez des musiques entre 60 et 80 BPM pour synchroniser les corps..." },
  { id: 't3', title: "Positions debout", cat: "Pratique", icon: <Wind/>, time: "3 min", content: "Utilisez un meuble comme appui de départ pour soulager votre dos." },
  { id: 't4', title: "L'Aftercare", cat: "Émotionnel", icon: <Heart/>, time: "3 min", content: "Restez enlacés quelques minutes en silence après l'acte." }
];

// --- DONNÉES POSITIONS ---
const POSITIONS_DATA = [
  { n: "Le Missionnaire", c: "Face à face", d: 1, s: 1, desc: "Position classique favorisant l'intimité et les baisers.", v: "Variante : Placez un coussin sous les hanches." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Sur le dos, ramenez les genoux vers les oreilles.", v: "Variante : Attrapez les chevilles." },
  { n: "La Levrette", c: "Par derrière", d: 2, s: 4, desc: "À quatre pattes, dos cambré. Profondeur maximale.", v: "Variante : Appuyé sur les avant-bras (Le Sphinx)." },
  { n: "Le Sphinx", c: "Par derrière", d: 2, s: 3, desc: "Une levrette où le receveur descend sur les avant-bras.", v: "Variante : Poitrine collée au matelas." },
  { n: "Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Assis à califourchon, le partenaire du dessus contrôle tout.", v: "Variante : Penché en avant pour s'enlacer." },
  { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Allongés sur le flanc, emboîtés. Très tendres.", v: "Variante : Le partenaire arrière masse le torse." },
  { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "L'un porte l'autre contre un mur ou au milieu de la pièce.", v: "Variante : S'adosser à un mur pour stabiliser." },
  { n: "Le 69 Classique", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Tête-bêche pour une stimulation mutuelle.", v: "Variante : Réalisé sur le côté pour moins de fatigue." }
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
  const [lastSeenPing, setLastSeenPing] = useState(Date.now());

  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    let unsubPartnerCustom = () => {};

    onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        const initial = { 
          uid: user.uid, pseudo: 'Anonyme', bio: 'Explorateur...', 
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          likes: [], pairCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          partnerUid: null, mood: 'playful', lastIntimacy: 0, pingToPartner: 0
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
        }
      }
      setLoading(false);
    });

    const myCol = collection(db, 'users', user.uid, 'customPositions');
    onSnapshot(myCol, (s) => setMyCustomPositions(s.docs.map(d => ({ id: d.id, ...d.data(), isMine: true }))));

    return () => { unsubPartnerCustom(); };
  }, [user]);

  const allPositions = useMemo(() => [...FULL_CATALOG, ...myCustomPositions, ...partnerCustomPositions], [myCustomPositions, partnerCustomPositions]);

  const triggerGameResult = (type) => {
    let result = "";
    if (type === 'truth') result = GAMES_DATA.truths[Math.floor(Math.random() * GAMES_DATA.truths.length)];
    if (type === 'dare') result = GAMES_DATA.dares[Math.floor(Math.random() * GAMES_DATA.dares.length)];
    if (type === 'dice') result = `${GAMES_DATA.diceActions[Math.floor(Math.random() * 9)]} ${GAMES_DATA.diceZones[Math.floor(Math.random() * 9)]}`;
    setGameResult(result);
  };

  const notify = (msg, icon = '✨') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-rose-500"><Flame className="animate-pulse" size={48} /></div>;

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      
      {/* HEADER */}
      <header className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2 text-rose-500 font-black text-2xl tracking-tighter">
          <Flame fill="currentColor" size={28} /> KAMA<span className="text-white">SYNC</span>
        </div>
        <button onClick={() => setDiscreetMode(!discreetMode)} className="text-slate-400 p-2">
          {discreetMode ? <EyeOff size={20} className="text-emerald-400" /> : <Eye size={20} />}
        </button>
      </header>

      {/* NOTIFS */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full px-4 items-center">
        {notifications.map(n => (
          <div key={n.id} className="bg-slate-800/90 text-white px-6 py-3 rounded-2xl text-xs font-bold border border-white/10 shadow-2xl">
            {n.icon} {n.msg}
          </div>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto pb-32">
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black">Catalogue</h2>
            <div className="grid grid-cols-1 gap-4">
              {allPositions.map(pos => (
                <div key={pos.id} onClick={() => setSelectedPosition(pos)} className="bg-slate-900 p-5 rounded-3xl border border-white/5 hover:border-rose-500/50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest">{pos.cat}</span>
                    <Heart size={14} className={userData?.likes?.includes(pos.id) ? "text-rose-500 fill-current" : "text-slate-700"} />
                  </div>
                  <h3 className="font-bold text-lg">{discreetMode ? "Masqué" : pos.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{discreetMode ? "xxx xxx xxx" : pos.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jeux' && !activeGame && (
          <div className="p-6 space-y-4 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black mb-6">Jeux Coquins</h2>
            <button onClick={() => setActiveGame('truthOrDare')} className="w-full bg-slate-900 p-6 rounded-3xl text-left border border-white/5 flex items-center justify-between">
              <div><h3 className="font-bold text-rose-400">Action ou Vérité</h3><p className="text-xs text-slate-500">Défis et secrets...</p></div>
              <Zap size={20} className="text-rose-500" />
            </button>
            <button onClick={() => setActiveGame('dice')} className="w-full bg-slate-900 p-6 rounded-3xl text-left border border-white/5 flex items-center justify-between">
              <div><h3 className="font-bold text-amber-400">Dés de l'Amour</h3><p className="text-xs text-slate-500">Laissez le hasard décider...</p></div>
              <Dices size={20} className="text-amber-500" />
            </button>
          </div>
        )}

        {activeTab === 'jeux' && activeGame && (
          <div className="p-6 flex flex-col items-center justify-center h-full text-center">
            <button onClick={() => {setActiveGame(null); setGameResult(null);}} className="absolute top-24 left-6 text-slate-400"><ArrowLeft/></button>
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-rose-500/20 shadow-2xl mb-8 w-full max-w-sm">
              <h2 className="text-2xl font-black mb-6 text-white">{activeGame === 'dice' ? "Dés" : "Action/Vérité"}</h2>
              <p className="text-xl font-bold text-rose-100">{gameResult || "Prêt ?"}</p>
            </div>
            <div className="flex gap-4 w-full max-w-sm">
              {activeGame === 'truthOrDare' ? (
                <>
                  <button onClick={() => triggerGameResult('truth')} className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black">VÉRITÉ</button>
                  <button onClick={() => triggerGameResult('dare')} className="flex-1 bg-rose-600 py-4 rounded-2xl font-black">ACTION</button>
                </>
              ) : (
                <button onClick={() => triggerGameResult('dice')} className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl font-black">LANCER LES DÉS</button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'duo' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-500 text-center">
             <h2 className="text-3xl font-black">Espace Duo</h2>
             {!userData?.partnerUid ? (
               <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/5">
                 <Users className="mx-auto text-emerald-500 mb-4" size={40} />
                 <p className="text-slate-400 text-sm mb-6">Votre code de liaison :</p>
                 <div className="text-3xl font-mono font-black text-white tracking-widest mb-8">{userData?.pairCode}</div>
                 <input className="w-full bg-slate-800 p-4 rounded-xl text-center mb-4" placeholder="CODE PARTENAIRE" value={partnerCodeInput} onChange={(e)=>setPartnerCodeInput(e.target.value.toUpperCase())}/>
                 <button className="w-full bg-emerald-600 py-4 rounded-xl font-bold">LIER LES COMPTES</button>
               </div>
             ) : (
               <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-lg">
                 <BellRing className="mx-auto mb-4" size={40} />
                 <h3 className="text-xl font-black">Signal Discret</h3>
                 <p className="text-xs text-indigo-200 mb-6">Envoyez une vibration à votre partenaire</p>
                 <button onClick={() => notify("Signal envoyé !", "💌")} className="bg-white text-indigo-600 px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest">Je te veux</button>
               </div>
             )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 overflow-hidden mb-4">
                <img src={userData?.avatarUrl} alt="Me" />
              </div>
              <h2 className="text-2xl font-black">{userData?.pseudo}</h2>
              <button onClick={()=>setIsEditingProfile(true)} className="mt-4 text-xs font-bold text-slate-500 border border-slate-800 px-4 py-2 rounded-full">Modifier le profil</button>
            </div>
          </div>
        )}
      </main>

      {/* NAV */}
      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-2 py-3 flex justify-between items-center z-40">
        <button onClick={() => setActiveTab('explorer')} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === 'explorer' ? 'text-rose-500' : 'text-slate-500'}`}><Compass size={22}/><span className="text-[8px] font-black uppercase">Catalogue</span></button>
        <button onClick={() => setActiveTab('jeux')} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === 'jeux' ? 'text-purple-500' : 'text-slate-500'}`}><Gamepad2 size={24}/><span className="text-[8px] font-black uppercase">Jeux</span></button>
        <button onClick={() => setActiveTab('duo')} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === 'duo' ? 'text-emerald-400' : 'text-slate-500'}`}><Users size={22}/><span className="text-[8px] font-black uppercase">Duo</span></button>
        <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === 'profil' ? 'text-white' : 'text-slate-500'}`}><User size={22}/><span className="text-[8px] font-black uppercase">Moi</span></button>
      </nav>

      {/* MODAL POSITION */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[200] bg-slate-950 p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setSelectedPosition(null)} className="text-slate-400 mb-8"><ArrowLeft/></button>
          <div className="text-center mb-10">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">{selectedPosition.cat}</span>
            <h2 className="text-3xl font-black mt-2">{discreetMode ? "Masqué" : selectedPosition.name}</h2>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/5 space-y-6">
            <h4 className="text-rose-400 text-xs font-black uppercase tracking-widest">La Position</h4>
            <p className="text-slate-300 leading-relaxed">{discreetMode ? "xxx xxx xxx xxx" : selectedPosition.desc}</p>
            {selectedPosition.v && (
              <div className="pt-6 border-t border-white/5">
                <h4 className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">Variante</h4>
                <p className="text-slate-400 text-sm italic">{discreetMode ? "xxx xxx" : selectedPosition.v}</p>
              </div>
            )}
          </div>
          <button onClick={()=>notify("Ajouté aux favoris")} className="mt-auto w-full bg-rose-600 py-4 rounded-2xl font-black">AJOUTER AUX FAVORIS</button>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
