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
    "Quelle est la chose la plus osée que tu aies faite en public ?", "Y a-t-il une position que tu as peur d'essayer ?", "Quel vêtement m'enlèverais-tu en premier là maintenant ?"
  ],
  dares: [
    "Masse-moi le dos pendant 3 minutes avec de l'huile ou de la crème.", "Embrasse-moi dans le cou avec un glaçon.",
    "Bande-moi les yeux et fais-moi deviner ce que tu manges ou bois.", "Fais-moi un strip-tease sensuel sur une musique de mon choix.",
    "Embrasse passionnément chaque centimètre de mon ventre.", "Enlève un de mes vêtements en utilisant uniquement tes dents.",
    "Masse l'intérieur de mes cuisses sans toucher mon sexe pendant 2 minutes.", "Attache mes mains et fais ce que tu veux pendant 3 minutes.",
    "Murmure-moi ton fantasme le plus sale à l'oreille.", "Enlève tes sous-vêtements sans enlever tes vêtements restants."
  ],
  diceActions: ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller avec la langue", "Effleurer"],
  diceZones: ["le Cou", "le Ventre", "l'Intérieur des Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins", "le Sexe", "le Creux des reins"],
  diceDurations: ["pendant 1 minute.", "pendant 2 minutes.", "jusqu'à ce que je te supplie d'arrêter.", "les yeux fermés."],
  scenPlaces: ["Dans la douche", "Sur la table du salon", "Enfermés dans la chambre", "Dans la cuisine", "Contre un mur"],
  scenRoles: ["Des inconnus dans un bar", "Un massage qui dérape", "Professeur et élève", "Cambrioleur et propriétaire", "Médecin et patient"],
  scenTwists: ["Avec un bandeau sur les yeux", "Sans utiliser les mains", "Dans le silence total", "La lumière doit rester allumée"],
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

// --- DONNÉES MASSIVES : POSITIONS ---
const POSITIONS_DATA = [
    { n: "Le Missionnaire", c: "Face à face", d: 1, s: 1, desc: "La base de l'intimité. Les corps sont totalement en contact, idéal pour les baisers.", v: "Variante : Placez un coussin sous les hanches pour changer l'angle." },
    { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Sur le dos, ramenez vos jambes vers vos épaules. Offre une pénétration très profonde.", v: "Variante : Le partenaire actif attrape les chevilles pour stabiliser." },
    { n: "La Fleur de Lotus", c: "Face à face", d: 3, s: 2, desc: "Assis face à face, le partenaire B entoure la taille du partenaire A avec ses jambes.", v: "Variante : Synchronisez votre respiration en vous regardant dans les yeux." },
    { n: "La Levrette", c: "Par derrière", d: 2, s: 4, desc: "À quatre pattes. C'est la position la plus instinctive et profonde.", v: "Variante : Appuyez-vous sur les avant-bras pour moins de fatigue." },
    { n: "Le Sphinx", c: "Par derrière", d: 1, s: 3, desc: "Allongé à plat ventre, le partenaire actif se place par-dessus vous.", v: "Variante : Glissez un coussin sous le bassin pour plus de confort." },
    { n: "Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Le partenaire A est allongé, le partenaire B est assis au-dessus et contrôle le rythme.", v: "Variante : Face au partenaire ou dos tourné (Andromaque inversée)." },
    { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Allongés sur le flanc, emboîtés l'un derrière l'autre. Très relaxant et sensuel.", v: "Variante : Le partenaire arrière utilise ses mains pour explorer le torse." },
    { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 4, s: 5, desc: "Le partenaire actif porte l'autre, qui enroule ses jambes autour de sa taille.", v: "Variante : Appuyez-vous contre un mur pour aider le porteur." },
    { n: "Le 69 Classique", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Tête-bêche pour une stimulation mutuelle simultanée.", v: "Variante : Allongés sur le côté pour éviter d'étouffer le partenaire du dessous." },
    { n: "Le G-Whiz", c: "Angles & Tweaks", d: 3, s: 5, desc: "Missionnaire très replié pour cibler le point G.", v: "Variante : Gardez les jambes serrées pour plus de friction." },
    { n: "La Cascade", c: "Sur Mobilier", d: 3, s: 4, desc: "Allongé au bord du lit, les jambes pendantes ou sur les épaules du partenaire debout.", v: "Variante : Utilisez une table solide pour une hauteur différente." }
    // Ajoute ici autant de positions que tu veux en suivant ce modèle
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

const MOODS = [
  { id: 'romantic', label: 'Câlin & Doux', icon: '☁️', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'playful', label: 'Humeur Joueuse', icon: '🎲', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'wild', label: 'Très Sauvage', icon: '🔥', color: 'bg-rose-500/20 text-rose-500 border-rose-500/30' },
  { id: 'tired', label: 'Pas ce soir', icon: '💤', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [activeTab, setActiveTab] = useState('explorer'); 
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [discreetMode, setDiscreetMode] = useState(false);
  const [pairCodeInput, setPairCodeInput] = useState('');

  // AUTH
  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  // DATA SYNC
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubUser = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        const initial = { 
          uid: user.uid, pseudo: 'Anonyme', likes: [], 
          pairCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          partnerUid: null, mood: 'playful'
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
    return () => unsubUser();
  }, [user]);

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
    if (!isLiked && partnerData?.likes?.includes(id)) notify("MATCH ! Vous aimez tous les deux !", "🔥");
  };

  const triggerGame = (type) => {
    let res = "";
    if(type === 'truth') res = GAMES_DATA.truths[Math.floor(Math.random() * GAMES_DATA.truths.length)];
    if(type === 'dare') res = GAMES_DATA.dares[Math.floor(Math.random() * GAMES_DATA.dares.length)];
    if(type === 'dice') res = `${GAMES_DATA.diceActions[Math.floor(Math.random() * 9)]} ${GAMES_DATA.diceZones[Math.floor(Math.random() * 9)]} ${GAMES_DATA.diceDurations[Math.floor(Math.random() * 4)]}`;
    setGameResult(res);
  };

  const linkPartner = async () => {
    if(!pairCodeInput) return;
    // Note: Logique simplifiée pour l'exemple. En réel, il faudrait chercher l'UID correspondant au code.
    notify("Lien envoyé ! (En attente)", "🔗");
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
      <div className="fixed top-20 left-0 w-full z-[100] pointer-events-none flex flex-col items-center gap-2">
        {notifications.map(n => (
          <div key={n.id} className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-white/10 animate-in slide-in-from-top duration-300">
            {n.icon} {n.msg}
          </div>
        ))}
      </div>

      {/* MAIN CONTENT - LE SCROLL SE PASSE ICI */}
      <main className="flex-1 overflow-y-auto pb-32 touch-pan-y">
        
        {activeTab === 'explorer' && (
          <div className="p-6 space-y-10">
            <h2 className="text-3xl font-black">Explorer</h2>
            {CATEGORIES.map(cat => (
              <section key={cat.id} className="space-y-4">
                <h3 className={`flex items-center gap-2 font-bold ${cat.text}`}>{cat.icon} {cat.id}</h3>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {FULL_CATALOG.filter(p => p.cat === cat.id).map(pos => (
                    <div key={pos.id} onClick={() => setSelectedPosition(pos)} className={`shrink-0 w-48 bg-gradient-to-br ${cat.color} p-5 rounded-[2rem] border border-white/5`}>
                       <h4 className="font-bold mb-2">{discreetMode ? "Position" : pos.name}</h4>
                       <p className="text-[10px] text-white/50 line-clamp-2">{discreetMode ? "xxx xxx xxx" : pos.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {activeTab === 'jeux' && !activeGame && (
          <div className="p-6 space-y-6">
            <h2 className="text-3xl font-black">Jeux</h2>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => setActiveGame('truthOrDare')} className="bg-slate-900 p-6 rounded-3xl border border-white/5 flex justify-between items-center">
                <div className="text-left"><h4 className="font-bold text-rose-400">Action ou Vérité</h4><p className="text-xs text-slate-500">Défis & Secrets</p></div>
                <Zap className="text-rose-500" />
              </button>
              <button onClick={() => setActiveGame('dice')} className="bg-slate-900 p-6 rounded-3xl border border-white/5 flex justify-between items-center">
                <div className="text-left"><h4 className="font-bold text-amber-400">Dés Coquins</h4><p className="text-xs text-slate-500">Le hasard décide</p></div>
                <Dices className="text-amber-500" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'jeux' && activeGame && (
          <div className="p-6 h-full flex flex-col items-center justify-center text-center">
            <button onClick={() => {setActiveGame(null); setGameResult(null);}} className="mb-8 text-slate-500 flex items-center gap-2"><ArrowLeft size={16}/> Retour</button>
            <div className="bg-slate-900 p-8 rounded-[3rem] border border-rose-500/20 w-full max-w-sm mb-8">
              <p className="text-xl font-bold leading-relaxed">{gameResult || "Prêt ?"}</p>
            </div>
            <div className="flex gap-4 w-full max-w-sm">
              {activeGame === 'truthOrDare' ? (
                <>
                  <button onClick={() => triggerGame('truth')} className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black">VÉRITÉ</button>
                  <button onClick={() => triggerGame('dare')} className="flex-1 bg-rose-600 py-4 rounded-2xl font-black">ACTION</button>
                </>
              ) : (
                <button onClick={() => triggerGame('dice')} className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl font-black">LANCER LES DÉS</button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'duo' && (
          <div className="p-6 space-y-8 text-center">
            <h2 className="text-3xl font-black">Mode Duo</h2>
            <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5">
              <Users className="mx-auto text-emerald-500 mb-4" size={40} />
              <p className="text-slate-400 text-xs mb-2">Ton code unique :</p>
              <div className="text-3xl font-mono font-black tracking-widest text-white mb-8">{userData?.pairCode}</div>
              <input value={pairCodeInput} onChange={e => setPairCodeInput(e.target.value.toUpperCase())} className="w-full bg-slate-800 p-4 rounded-xl text-center mb-4 outline-none focus:border-emerald-500 border border-transparent" placeholder="CODE PARTENAIRE" />
              <button onClick={linkPartner} className="w-full bg-emerald-600 py-4 rounded-xl font-black">LIER</button>
            </div>
            {partnerData && (
              <div className="bg-indigo-600 p-6 rounded-3xl flex items-center justify-between">
                <div className="text-left"><h4 className="font-bold">Partenaire lié</h4><p className="text-xs opacity-70">{partnerData.pseudo}</p></div>
                <BellRing onClick={() => notify("Signal envoyé !", "💌")} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER NAV */}
      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-6 py-4 flex justify-between items-center z-50">
        <button onClick={() => setActiveTab('explorer')} className={`flex flex-col items-center gap-1 ${activeTab === 'explorer' ? 'text-rose-500' : 'text-slate-500'}`}><Compass size={24}/><span className="text-[8px] font-bold uppercase">Explorer</span></button>
        <button onClick={() => setActiveTab('jeux')} className={`flex flex-col items-center gap-1 ${activeTab === 'jeux' ? 'text-purple-500' : 'text-slate-500'}`}><Gamepad2 size={24}/><span className="text-[8px] font-bold uppercase">Jeux</span></button>
        <button onClick={() => setActiveTab('duo')} className={`flex flex-col items-center gap-1 ${activeTab === 'duo' ? 'text-emerald-400' : 'text-slate-500'}`}><Users size={24}/><span className="text-[8px] font-bold uppercase">Duo</span></button>
        <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 ${activeTab === 'profil' ? 'text-white' : 'text-slate-500'}`}><User size={24}/><span className="text-[8px] font-bold uppercase">Moi</span></button>
      </nav>

      {/* MODAL POSITION DETAIL */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[200] bg-slate-950 p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setSelectedPosition(null)} className="mb-8 text-slate-500"><ArrowLeft size={24}/></button>
          <div className="flex-1 overflow-y-auto space-y-6">
            <h2 className="text-3xl font-black">{discreetMode ? "Position" : selectedPosition.name}</h2>
            <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
              <h4 className="text-rose-500 font-bold text-xs uppercase mb-2">Description</h4>
              <p className="text-slate-300 leading-relaxed">{discreetMode ? "xxx xxx xxx xxx xxx" : selectedPosition.desc}</p>
            </div>
            {selectedPosition.v && (
              <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
                <h4 className="text-indigo-400 font-bold text-xs uppercase mb-2">Variante</h4>
                <p className="text-slate-400 italic text-sm">{discreetMode ? "xxx xxx" : selectedPosition.v}</p>
              </div>
            )}
          </div>
          <button onClick={() => handleLike(selectedPosition.id)} className={`mt-6 w-full py-4 rounded-2xl font-black ${userData?.likes?.includes(selectedPosition.id) ? 'bg-slate-800 text-rose-500' : 'bg-rose-600 text-white'}`}>
            {userData?.likes?.includes(selectedPosition.id) ? "RETIRER DES FAVORIS" : "AJOUTER AUX FAVORIS"}
          </button>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
