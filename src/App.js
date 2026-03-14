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
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
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

// --- HUMEURS INTIMES ---
const MOODS = [
  { id: 'romantic', label: 'Câlin & Doux', icon: '☁️', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'playful', label: 'Humeur Joueuse', icon: '🎲', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'wild', label: 'Très Sauvage', icon: '🔥', color: 'bg-rose-500/20 text-rose-500 border-rose-500/30' },
  { id: 'tired', label: 'Pas ce soir', icon: '💤', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
];

// --- JEUX ---
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
  scenTwists: ["Avec un bandeau on les yeux", "Sans utiliser les mains", "Dans le silence total", "La lumière doit rester allumée", "En écoutant une musique classique très fort"],
  rouletteTasks: ["Dégustation à l'aveugle", "Exploration tactile", "Contraste thermique", "Le jeu du miroir", "Baisers interdits"],
  secretChallenges: ["Porte des dessous sexy", "Sexto imprévu", "Prends les commandes", "Mot coquin caché"]
};

// --- GUIDE ET CONSEILS ---
const TIPS_DATA = [
  { id: 't1', title: "Le consentement, moteur du désir", cat: "Communication", icon: <Shield/>, content: "Le consentement n'est pas juste un 'oui' au début, c'est un dialogue continu. Vérifier si l'autre apprécie, demander 'tu aimes ça ?' ou 'je peux aller plus vite ?' n'est pas un tue-l'amour, au contraire ! C'est ce qui permet de s'abandonner totalement en sachant qu'on est en sécurité. N'hésitez pas à instaurer un 'Safe Word' (mot de sécurité) pour vos jeux les plus intenses." },
  { id: 't2', title: "La Musique idéale pour le lit", cat: "Sensorielles", icon: <Music/>, content: "La musique peut transformer une expérience banale en un moment magique. Voici nos conseils :\n\n1. Le Tempo magique (BPM) : Cherchez des musiques entre 60 et 80 BPM. Cela s'aligne sur le rythme cardiaque au repos, aidant vos corps à se synchroniser.\n2. Pas de paroles : Préférez l'instrumental (Lo-Fi, Trip-Hop, Jazz lent). Les paroles sollicitent la partie analytique du cerveau.\n3. Évitez le mode 'Aléatoire' : Créez une playlist qui évolue. Douce au début, avec un rythme qui s'intensifie, avant de redescendre pour l'aftercare." },
  { id: 't3', title: "Réussir les positions debout", cat: "Pratique", icon: <Wind/>, content: "Les positions debout ou acrobatiques nécessitent quelques précautions pour éviter les accidents.\n\n1. L'adhérence : Ne le faites pas en chaussettes sur du parquet ou dans une douche sans tapis antidérapant.\n2. La hauteur : Si vous devez porter votre partenaire, utilisez un meuble (lit, table) comme appui de départ pour soulager votre dos.\n3. La communication : Si les muscles tremblent, dites-le immédiatement. Il n'y a pas de honte à faire une pause." },
  { id: 't4', title: "L'art délicat de l'Aftercare", cat: "Émotionnel", icon: <Heart/>, content: "L'aftercare (les soins post-coïtaux) est crucial, surtout après un rapport intense. Lors de l'orgasme, le cerveau libère un cocktail d'hormones (ocytocine, dopamine) qui retombe brutalement ensuite. Pour éviter le 'blues post-sexe' :\n\n- Restez enlacés quelques minutes en silence.\n- Apportez un verre d'eau ou une petite collation.\n- Échangez des mots doux ou valorisants sur ce que vous venez de vivre.\n- Préparez une serviette tiède pour vous nettoyer mutuellement avec tendresse." },
  { id: 't5', title: "Dirty Talk : Comment oser se lancer", cat: "Communication", icon: <MessageCircle/>, content: "Le 'Dirty Talk' (parler cru) intimide souvent. Le secret est d'y aller par étapes :\n\n1. Le constat : Décrivez simplement ce que vous ressentez. 'J'adore quand tu fais ça', 'Ta peau est si chaude'.\n2. L'instruction : Donnez des directives douces. 'Plus vite', 'Regarde-moi quand tu le fais'.\n3. L'anticipation : Décrivez ce que vous allez faire. 'Je vais t'embrasser partout jusqu'à ce que tu n'en puisses plus'.\nL'important est d'utiliser un vocabulaire avec lequel vous êtes tous les deux à l'aise." },
  { id: 't6', title: "Les zones érogènes méconnues", cat: "Sensorielles", icon: <Sparkles/>, content: "Ne foncez pas directement vers les zones génitales ! Prenez le temps d'explorer ces zones souvent oubliées :\n\n- Le cuir chevelu : Un massage appuyé libère énormément de tensions.\n- Le creux des genoux et l'intérieur des poignets : La peau y est très fine et sensible.\n- La nuque et le cou : Un souffle chaud ou de légers mordillements y font des merveilles.\n- Le bas du ventre : Tracer des lignes imaginaires juste au-dessus du pubis rend l'attente insoutenable." },
  { id: 't7', title: "Introduire des jouets dans le couple", cat: "Pratique", icon: <Zap/>, content: "Un sex-toy ne remplace pas un partenaire, c'est un outil pour explorer de nouvelles sensations ensemble.\n\n- Dédiabolisez l'objet : Faites du shopping en ligne à deux pour choisir votre premier jouet.\n- Commencez petit : Un anneau vibrant ou un petit stimulateur clitoridien (bullet) est parfait pour débuter sans intimider.\n- Guidez l'autre : C'est encore plus excitant quand c'est le partenaire qui contrôle le jouet sur vous." },
  { id: 't8', title: "L'art du Teasing (Faire monter le désir)", cat: "Préliminaires", icon: <Timer/>, content: "Le sexe commence bien avant d'être dans la chambre. L'anticipation est le plus grand des aphrodisiaques :\n\n- Le matin : Laissez un post-it suggestif sur le miroir de la salle de bain.\n- La journée : Envoyez un message décrivant ce que vous portez ou ce que vous comptez lui faire le soir.\n- Le soir : Frôlez-vous dans la cuisine, embrassez-vous dans le cou, mais refusez d'aller plus loin... pour l'instant. Faites durer la frustration exquise." },
  { id: 't9', title: "Jeux de température : Le Feu et la Glace", cat: "Sensorielles", icon: <Flame/>, content: "Jouer avec le chaud et le froid réveille les terminaisons nerveuses :\n\n- Le froid : Passez un glaçon sur les lèvres de votre partenaire, le long de sa colonne vertébrale, ou gardez-le en bouche pendant le sexe oral (frissons garantis).\n- Le chaud : Utilisez de l'huile de massage chauffante ou buvez une gorgée de thé/café chaud avant d'embrasser le cou ou le ventre de votre partenaire.\n- Le contraste : Alternez immédiatement le souffle chaud de votre bouche après le passage du glaçon." },
  { id: 't10', title: "Initiation au Bondage Léger", cat: "Découverte", icon: <Lock/>, content: "Attacher son partenaire (ou l'être) crée un abandon total très excitant. Pour débuter sereinement :\n\n- N'utilisez jamais de menottes en métal (risque de blessure sans clé). Préférez des foulards en soie, des cravates souples ou des menottes en velcro.\n- Gardez toujours des ciseaux à bouts ronds à portée de main en cas de panique.\n- Ne laissez jamais la personne attachée seule dans la pièce.\n- Fixez un 'Safe Word' (ex: 'Rouge') qui stoppe instantanément le jeu si l'un de vous est mal à l'aise." },
  { id: 't11', title: "Créer l'ambiance parfaite", cat: "Général", icon: <Star/>, content: "L'environnement joue un rôle clé dans la capacité à lâcher prise :\n\n- L'éclairage : Fuyez les plafonniers ! Préférez une lumière tamisée, chaude (lampes de chevet, guirlandes) ou la lueur vacillante de quelques bougies.\n- L'ordre : Un lit défait avec des draps propres, c'est sexy. Des vêtements sales qui traînent au sol, ça l'est moins. Dégagez l'espace.\n- L'odeur : Aérez la pièce, utilisez un léger parfum d'ambiance ou de l'encens, mais sans excès." },
  { id: 't12', title: "Le pouvoir du regard", cat: "Connexion", icon: <Eye/>, content: "Le contact visuel est souvent sous-estimé car il rend très vulnérable. Pourtant, c'est l'outil de connexion ultime :\n\n- Pendant l'acte : Essayez de garder les yeux ouverts et de fixer ceux de votre partenaire pendant plusieurs minutes consécutives. La sensation de fusion est vertigineuse.\n- Le miroir : Placez-vous devant un miroir pour vous regarder faire l'amour. Le côté voyeuriste de votre propre couple est un puissant déclencheur." },
  { id: 't13', title: "La liste Oui / Non / Peut-être", cat: "Communication", icon: <CheckCircle2/>, content: "C'est un exercice génial pour les couples ! Imprimez chacun une liste détaillée de pratiques sexuelles. \n- Cochez 'Oui' (J'ai envie), 'Non' (C'est hors limite) ou 'Peut-être' (J'y réfléchis si on m'accompagne bien).\n- Comparez ensuite vos listes avec bienveillance. Vous découvrirez souvent que vous avez des fantasmes communs inavoués dans la colonne 'Peut-être' ou 'Oui' !" },
  { id: 't14', title: "Massage sensuel : Les règles d'or", cat: "Préliminaires", icon: <Activity/>, content: "Un massage sensuel n'est pas un massage thérapeutique. L'objectif est l'effleurement :\n\n- Utilisez de l'huile (préalablement réchauffée dans vos mains).\n- Ne soyez pas pressé : commencez par les épaules, descendez lentement vers les lombaires, massez les mollets et les pieds.\n- La règle d'or : Interdiction stricte de toucher les zones érogènes primaires (sexe, poitrine) pendant les 10 premières minutes. Le désir va grimper en flèche." },
  { id: 't15', title: "Gérer les pannes et les moments gênants", cat: "Général", icon: <Info/>, content: "Le sexe, ce n'est pas comme dans les films. Il y a des bruits bizarres, des crampes, des pannes d'érection ou des pertes de lubrification. C'est NORMAL.\n\n- Le rire est votre meilleur allié. Une crampe au mollet ? Riez-en ensemble, massez-la, et reprenez.\n- Une baisse de régime ? Ne focalisez pas dessus. Redescendez d'un cran : retournez aux caresses, aux baisers, sans obligation de résultat.\n- La pression de la performance est le pire ennemi de l'érection et du désir." }
];

// --- POSITIONS (EXTRAIT DES 115+) ---
const POSITIONS_DATA = [
  { n: "Le Missionnaire (L'indémodable)", c: "Face à face", d: 1, s: 1, desc: "Le partenaire A s'allonge sur le dos, les jambes légèrement écartées. Le partenaire B se place au-dessus en appui sur les mains ou les avant-bras.", v: "Variante : Le partenaire A referme complètement ses jambes autour de celles du partenaire B pour augmenter les frictions." },
  { n: "Le Missionnaire surélevé", c: "Face à face", d: 2, s: 2, desc: "Position classique du missionnaire, mais les jambes du partenaire allongé reposent sur les épaules de celui qui est au-dessus.", v: "Variante : Glissez un gros coussin sous les fesses du partenaire allongé pour basculer le bassin." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Le partenaire allongé sur le dos bascule son bassin vers le haut et replie ses genoux près de ses propres oreilles.", v: "Variante : Le partenaire du dessus peut attraper les chevilles du receveur pour guider le rythme." },
  { n: "Le Coquillage", c: "Face à face", d: 3, s: 3, desc: "Le partenaire allongé replie ses cuisses serrées contre son propre buste.", v: "Variante : Maintenez un contact visuel ininterrompu." },
  { n: "La Fleur de Lotus", c: "Face à face", d: 3, s: 3, desc: "Les deux partenaires sont assis face à face, le partenaire B s'asseyant sur les genoux du partenaire A.", v: "Variante : Synchronisez votre respiration en collant vos fronts." },
  { n: "La Levrette classique", c: "Par derrière", d: 2, s: 4, desc: "Le receveur se place à quatre pattes, dos cambré. Le partenaire se positionne derrière lui à genoux.", v: "Variante : Le partenaire arrière attrape les hanches pour guider l'impact." },
  { n: "Le Sphinx", c: "Par derrière", d: 2, s: 3, desc: "Une levrette où le receveur descend son torse pour s'appuyer sur ses avant-bras, les fesses bien en l'air.", v: "Variante : Le receveur peut coller sa poitrine au matelas." },
  { n: "L'Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Le partenaire A est allongé sur le dos. Le partenaire B s'assoit à califourchon face à lui.", v: "Variante : Le partenaire du dessus peut se pencher en avant." },
  { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Les deux partenaires sont allongés sur le flanc, emboîtés l'un dans l'autre.", v: "Variante : Le partenaire arrière glisse un bras sous la nuque du receveur." },
  { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Le partenaire debout porte entièrement l'autre partenaire.", v: "Variante : Le porteur peut s'adosser à un mur pour soulager le poids." },
  { n: "Le 69 Classique", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Les partenaires sont allongés tête-bêche pour un plaisir mutuel.", v: "Variante : Synchronisez vos mouvements de langue." },
  { n: "Le G-Whiz", c: "Angles & Tweaks", d: 3, s: 5, desc: "Un missionnaire très replié où le receveur ramène ses genoux presque contre ses épaules.", v: "Variante : L'actif place ses bras sous les genoux du receveur." },
  { n: "La Méditation sexuelle", c: "Sensorielles", d: 1, s: 3, desc: "Une fois emboîtés, les deux partenaires cessent tout mouvement pendant plusieurs minutes.", v: "Variante : Synchronisez votre respiration." }
  // ... Le script complet inclut la logique pour filtrer et afficher la totalité du catalogue.
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
  const [lastSeenPing, setLastSeenPing] = useState(Date.now());

  // --- FIREBASE INIT ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) { setLoading(false); }
    };
    initAuth();
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'artifacts', appId, 'users', user.uid);
    let unsubPartnerCustom = () => {};

    const unsubUser = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        const initial = { uid: user.uid, pseudo: 'Anonyme', bio: 'Explorateur...', avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`, likes: [], pairCode: Math.random().toString(36).substring(2, 8).toUpperCase(), partnerUid: null, mood: 'playful', lastIntimacy: 0, pingToPartner: 0 };
        setDoc(userRef, initial);
        setUserData(initial);
      } else {
        const data = snap.data();
        setUserData(data);
        if (data.partnerUid) {
          onSnapshot(doc(db, 'artifacts', appId, 'users', data.partnerUid), (pSnap) => {
            if (pSnap.exists()) {
               const pData = pSnap.data();
               setPartnerData(pData);
               if (pData.pingToPartner && pData.pingToPartner > lastSeenPing) {
                  if (Date.now() - pData.pingToPartner < 60000) notify(`${pData.pseudo || 'Votre partenaire'} a très envie de vous... 🔥`, '🔔');
                  setLastSeenPing(pData.pingToPartner);
               }
            }
          });
          unsubPartnerCustom = onSnapshot(collection(db, 'artifacts', appId, 'users', data.partnerUid, 'customPositions'), (cSnap) => {
            setPartnerCustomPositions(cSnap.docs.map(d => ({ id: d.id, ...d.data(), isPartner: true })).filter(p => p.shared !== false));
          });
        }
      }
      setLoading(false);
    });

    onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'customPositions'), (snap) => {
      setMyCustomPositions(snap.docs.map(d => ({ id: d.id, ...d.data(), isMine: true })));
    });

    return () => { unsubUser(); unsubPartnerCustom(); };
  }, [user, lastSeenPing]);

  const displayCategories = useMemo(() => {
    const baseCats = [...CATEGORIES];
    const customIds = new Set();
    [...myCustomPositions, ...partnerCustomPositions].forEach(p => { 
       if(!baseCats.some(c => c.id === p.cat)) customIds.add(p.cat);
    });
    return [...baseCats, ...Array.from(customIds).map(id => ({ id, icon: <FolderPlus size={14}/>, color: 'from-slate-700/40 to-slate-900/40', text: 'text-slate-300' }))];
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
    return result.sort((a, b) => {
      if (sortBy === 'spice') return b.spice - a.spice; 
      if (sortBy === 'diff') return a.diff - b.diff;    
      return a.name.localeCompare(b.name);              
    });
  }, [allPositions, searchQuery, filterSpice, filterPhysique, filterCat, sortBy]);

  const notify = (msg, icon = '✨') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const handleLinkPartner = async () => {
    if (!partnerCodeInput || partnerCodeInput.length !== 6) return notify("Code invalide", "❌");
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid), { partnerUid: partnerCodeInput });
    notify("Liaison envoyée !", "🔗");
  };

  const triggerGameResult = (type) => {
    let res = null;
    if (type === 'truth') res = GAMES_DATA.truths[Math.floor(Math.random() * 10)];
    if (type === 'dare') res = GAMES_DATA.dares[Math.floor(Math.random() * 8)];
    if (type === 'dice') res = `${GAMES_DATA.diceActions[Math.floor(Math.random()*9)]} ➔ ${GAMES_DATA.diceZones[Math.floor(Math.random()*9)]}`;
    if (type === 'scenario') res = `Lieu : ${GAMES_DATA.scenPlaces[Math.floor(Math.random()*5)]}\nRôle : ${GAMES_DATA.scenRoles[Math.floor(Math.random()*5)]}`;
    setGameResult(res);
  };

  const applyDiscreet = (text) => discreetMode ? text.replace(/[a-zA-Z]/g, "x") : text;

  if (loading) return <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-rose-500"><Flame className="animate-pulse" size={48} /></div>;

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      
      <header className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2 text-rose-500 font-black text-2xl tracking-tighter">
          <Flame fill="currentColor" size={28} /> KAMA<span className="text-white">SYNC</span>
        </div>
        <button onClick={() => setDiscreetMode(!discreetMode)} className="text-slate-400 p-2">
          {discreetMode ? <EyeOff size={20} className="text-emerald-400" /> : <Eye size={20} />}
        </button>
      </header>

      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none items-center w-full px-4">
        {notifications.map(n => <div key={n.id} className="bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-3 border border-white/10"><span>{n.icon}</span> {n.msg}</div>)}
      </div>

      <main className="flex-1 overflow-y-auto custom-scroll pb-32">
        {activeTab === 'explorer' && (
          <div className="animate-in fade-in duration-500">
            <div className="px-6 py-8"><div onClick={() => setSelectedPosition(FULL_CATALOG[0])} className="bg-gradient-to-br from-rose-600 to-orange-500 rounded-3xl p-6 relative cursor-pointer"><h2 className="text-2xl font-black text-white">Position du jour</h2><p className="text-white/80 text-sm mt-1">{applyDiscreet(FULL_CATALOG[0].name)}</p></div></div>
            <div className="px-6 mb-8 space-y-4">
              <div className="relative"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Rechercher..." className="w-full bg-slate-900 border border-slate-800 rounded-3xl py-4 pl-14 outline-none focus:border-rose-500 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/></div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold text-emerald-400 min-w-[120px]"><option value="az">A-Z</option><option value="spice">Intensité 🔥</option><option value="diff">Physique 💪</option></select>
                <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold min-w-[120px]"><option value="Toutes">Catégories</option>{displayCategories.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}</select>
              </div>
            </div>
            {displayCategories.map(category => {
              const posList = filteredPositions.filter(p => p.cat === category.id);
              if (posList.length === 0) return null;
              return (
                <section key={category.id} className="mb-10 px-6">
                  <h2 className={`text-lg font-black flex items-center gap-2 mb-4 ${category.text}`}>{category.icon} {category.id}</h2>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                    {posList.map(pos => (
                      <div key={pos.id} onClick={() => setSelectedPosition(pos)} className={`shrink-0 w-48 bg-gradient-to-br ${category.color} border border-white/5 rounded-[2rem] p-5 cursor-pointer snap-start`}>
                        <div className="flex justify-between items-start mb-4"><div className="flex gap-0.5">{[...Array(pos.spice)].map((_, i) => <div key={i} className="w-1 h-1.5 rounded-full bg-rose-500"></div>)}</div>{userData?.likes?.includes(pos.id) && <Heart size={14} fill="#f43f5e" className="text-rose-500"/>}</div>
                        <h3 className="font-bold text-base text-white mb-2">{applyDiscreet(pos.name)}</h3>
                        <p className="text-[10px] text-white/50 line-clamp-3">{applyDiscreet(pos.desc)}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {activeTab === 'jeux' && !activeGame && (
          <div className="p-6 mt-4 animate-in fade-in">
             <div className="text-center mb-10"><Gamepad2 className="mx-auto text-purple-500 mb-4" size={48} /><h1 className="text-3xl font-black text-white">Zone de Jeux</h1></div>
             <div className="grid grid-cols-1 gap-4">
               {['truthOrDare', 'loveDice', 'scenario', 'roulette'].map(g => (
                 <button key={g} onClick={() => setActiveGame(g)} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between hover:bg-slate-800 transition">
                   <div className="text-left"><h3 className="font-bold text-white uppercase text-xs tracking-widest">{g}</h3></div><ChevronRight className="text-slate-700" />
                 </button>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'jeux' && activeGame && (
          <div className="absolute inset-0 bg-slate-950 z-10 animate-in slide-in-from-right duration-300 flex flex-col">
            <header className="px-6 py-5 flex items-center border-b border-white/5"><button onClick={() => { setActiveGame(null); setGameResult(null); }} className="text-slate-400 p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button></header>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] w-full mb-8 text-xl font-bold leading-relaxed">{gameResult || "Prêts ?"}</div>
              <div className="flex gap-4 w-full max-w-sm">
                {activeGame === 'truthOrDare' ? (
                  <><button onClick={() => triggerGameResult('truth')} className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black">VÉRITÉ</button><button onClick={() => triggerGameResult('dare')} className="flex-1 bg-rose-600 py-4 rounded-2xl font-black">ACTION</button></>
                ) : <button onClick={() => triggerGameResult('dice')} className="w-full bg-rose-600 py-4 rounded-2xl font-black">GÉNÉRER</button>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'duo' && (
          <div className="p-6 mt-4 animate-in fade-in text-center">
            <h1 className="text-3xl font-black mb-8">Espace Duo</h1>
             {!userData?.partnerUid ? (
               <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
                 <Users className="mx-auto mb-4 text-emerald-500" size={40} /><div className="bg-slate-950 p-4 rounded-xl mb-6 font-mono tracking-widest text-xl">{userData?.pairCode}</div><input className="w-full bg-slate-800 border-none rounded-xl text-center p-4 mb-4" placeholder="CODE PARTENAIRE" value={partnerCodeInput} onChange={(e) => setPartnerCodeInput(e.target.value.toUpperCase())}/><button onClick={handleLinkPartner} className="w-full bg-emerald-600 py-4 rounded-xl font-bold">LIER</button>
               </div>
             ) : (
               <div className="bg-slate-900 p-6 rounded-[2rem] flex items-center gap-4 justify-center border border-emerald-500/20"><Heart fill="currentColor" className="text-rose-500" /> <h3 className="font-bold">Connecté avec votre partenaire</h3></div>
             )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="p-6 mt-4 animate-in fade-in">
            <div className="flex flex-col items-center mb-10"><div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-900 mb-4 overflow-hidden"><img src={userData?.avatarUrl} className="w-full h-full object-cover" /></div><h2 className="text-2xl font-black text-white">{userData?.pseudo}</h2><button onClick={() => setIsEditingProfile(true)} className="mt-4 bg-slate-800 px-6 py-2 rounded-full text-xs font-bold border border-white/10">Modifier Profil</button></div>
          </div>
        )}

        {activeTab === 'conseils' && (
          <div className="p-6 mt-4 animate-in fade-in space-y-4">
            {TIPS_DATA.map(tip => <div key={tip.id} onClick={() => setSelectedTip(tip)} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-800/50"><div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">{tip.icon}</div><div><h3 className="font-bold text-white text-base mb-1">{tip.title}</h3><p className="text-slate-400 text-xs line-clamp-2">{tip.content}</p></div></div>)}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-2 py-3 flex justify-between items-center z-40 pb-8">
        {[ {id:'explorer', icon:<Compass/>}, {id:'jeux', icon:<Gamepad2/>}, {id:'conseils', icon:<BookOpen/>}, {id:'duo', icon:<Users/>}, {id:'profil', icon:<User/>} ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === tab.id ? 'text-rose-500 scale-110' : 'text-slate-500'}`}>{tab.icon}<span className="text-[8px] font-black uppercase">{tab.id}</span></button>
        ))}
      </nav>

      {/* MODAL POSITION DETAILS */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-300">
          <header className="px-6 py-5 shrink-0"><button onClick={() => setSelectedPosition(null)} className="text-slate-400 bg-slate-900 p-2 rounded-full"><ArrowLeft size={20}/></button></header>
          <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6">
            <h2 className="text-3xl font-black text-white leading-tight">{applyDiscreet(selectedPosition.name)}</h2>
            <div className="bg-slate-900 p-6 rounded-3xl"><h4 className="text-rose-400 font-bold text-xs uppercase mb-3 tracking-widest">Posture</h4><p className="text-slate-300 leading-relaxed">{applyDiscreet(selectedPosition.desc)}</p></div>
            {selectedPosition.v && <div className="bg-indigo-900/20 p-6 rounded-3xl"><h4 className="text-indigo-400 font-bold text-xs uppercase mb-3">Variante</h4><p className="text-slate-300">{applyDiscreet(selectedPosition.v)}</p></div>}
          </div>
          <div className="p-6 bg-slate-950 border-t border-slate-900 shrink-0"><button className="w-full bg-rose-600 py-4 rounded-xl font-black uppercase">FAVORIS</button></div>
        </div>
      )}

      {/* MODAL TIP */}
      {selectedTip && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-300">
          <header className="px-6 py-5"><button onClick={() => setSelectedTip(null)} className="text-slate-400 bg-slate-800 p-2 rounded-full"><ArrowLeft size={20}/></button></header>
          <div className="flex-1 overflow-y-auto px-6 py-8 custom-scroll pb-32"><h2 className="text-3xl font-black text-white mb-6 leading-tight">{selectedTip.title}</h2><div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{selectedTip.content}</div></div>
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
