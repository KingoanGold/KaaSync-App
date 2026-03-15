/* eslint-disable */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, collection, 
  onSnapshot, updateDoc, arrayUnion, addDoc, deleteDoc,
  query, where, getDocs, orderBy, limit
} from 'firebase/firestore';
import { 
  Heart, Flame, Plus, Sparkles, ChevronRight, 
  Search, Info, Users, ArrowLeft, Gamepad2, 
  Star, Dices, Lock, Activity, Wind, BookOpen, 
  Compass, User, Shield, EyeOff, Eye, Calendar, 
  MessageCircle, Filter, Music, CheckCircle2, 
  Shuffle, RefreshCw, Edit2, Timer, Gift, Zap, 
  Trash2, Edit3, FolderPlus, BellRing, HeartHandshake,
  CalendarHeart, Send, LogIn, MessageSquare, Smartphone
} from 'lucide-react';

// --- CONFIGURATION FIREBASE ULTRA-SÉCURISÉE (ANTI-CRASH) ---
let firebaseConfig;
try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    firebaseConfig = typeof __firebase_config === 'string' ? JSON.parse(__firebase_config) : __firebase_config;
  } else {
    throw new Error("Config absente");
  }
} catch (error) {
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

// --- HUMEURS INTIMES ---
const MOODS = [
  { id: 'romantic', label: 'Câlin & Doux', icon: '☁️', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'playful', label: 'Humeur Joueuse', icon: '🎲', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'wild', label: 'Très Sauvage', icon: '🔥', color: 'bg-rose-500/20 text-rose-500 border-rose-500/30' },
  { id: 'tired', label: 'Pas ce soir', icon: '💤', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
];

// --- DONNÉES MASSIVES DES JEUX COQUINS ---
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

const TIPS_DATA = [
  { id: 't1', title: "Le consentement, moteur du désir", cat: "Communication", icon: <Shield/>, time: "2 min", content: "Le consentement n'est pas juste un 'oui' au début, c'est un dialogue continu. Vérifier si l'autre apprécie, demander 'tu aimes ça ?' ou 'je peux aller plus vite ?' n'est pas un tue-l'amour, au contraire ! C'est ce qui permet de s'abandonner totalement en sachant qu'on est en sécurité. N'hésitez pas à instaurer un 'Safe Word' (mot de sécurité) pour vos jeux les plus intenses." },
  { id: 't2', title: "La Musique idéale pour le lit", cat: "Sensorielles", icon: <Music/>, time: "4 min", content: "La musique peut transformer une expérience banale en un moment magique. Voici nos conseils :\n\n1. Le Tempo magique (BPM) : Cherchez des musiques entre 60 et 80 BPM. Cela s'aligne sur le rythme cardiaque au repos, aidant vos corps à se synchroniser.\n2. Pas de paroles : Préférez l'instrumental (Lo-Fi, Trip-Hop, Jazz lent). Les paroles sollicitent la partie analytique du cerveau.\n3. Évitez le mode 'Aléatoire' : Créez une playlist qui évolue. Douce au début, avec un rythme qui s'intensifie, avant de redescendre pour l'aftercare." },
  { id: 't3', title: "Réussir les positions debout", cat: "Pratique", icon: <Wind/>, time: "3 min", content: "Les positions debout ou acrobatiques nécessitent quelques précautions pour éviter les accidents.\n\n1. L'adhérence : Ne le faites pas en chaussettes sur du parquet ou dans une douche sans tapis antidérapant.\n2. La hauteur : Si vous devez porter votre partenaire, utilisez un meuble (lit, table) comme appui de départ pour soulager votre dos.\n3. La communication : Si les muscles tremblent, dites-le immédiatement. Il n'y a pas de honte à faire une pause." },
  { id: 't4', title: "L'art délicat de l'Aftercare", cat: "Émotionnel", icon: <Heart/>, time: "3 min", content: "L'aftercare (les soins post-coïtaux) est crucial, surtout après un rapport intense. Lors de l'orgasme, le cerveau libère un cocktail d'hormones (ocytocine, dopamine) qui retombe brutalement ensuite. Pour éviter le 'blues post-sexe' :\n\n- Restez enlacés quelques minutes en silence.\n- Apportez un verre d'eau ou une petite collation.\n- Échangez des mots doux ou valorisants sur ce que vous venez de vivre.\n- Préparez une serviette tiède pour vous nettoyer mutuellement avec tendresse." },
  { id: 't5', title: "Dirty Talk : Comment oser se lancer", cat: "Communication", icon: <MessageCircle/>, time: "4 min", content: "Le 'Dirty Talk' (parler cru) intimide souvent. Le secret est d'y aller par étapes :\n\n1. Le constat : Décrivez simplement ce que vous ressentez. 'J'adore quand tu fais ça', 'Ta peau est si chaude'.\n2. L'instruction : Donnez des directives douces. 'Plus vite', 'Regarde-moi quand tu le fais'.\n3. L'anticipation : Décrivez ce que vous allez faire. 'Je vais t'embrasser partout jusqu'à ce que tu n'en puisses plus'.\nL'important est d'utiliser un vocabulaire avec lequel vous êtes tous les deux à l'aise." },
  { id: 't6', title: "Les zones érogènes méconnues", cat: "Sensorielles", icon: <Sparkles/>, time: "5 min", content: "Ne foncez pas directement vers les zones génitales ! Prenez le temps d'explorer ces zones souvent oubliées :\n\n- Le cuir chevelu : Un massage appuyé libère énormément de tensions.\n- Le creux des genoux et l'intérieur des poignets : La peau y est très fine et sensible.\n- La nuque et le cou : Un souffle chaud ou de légers mordillements y font des merveilles.\n- Le bas du ventre : Tracer des lignes imaginaires juste au-dessus du pubis rend l'attente insoutenable." },
  { id: 't7', title: "Introduire des jouets dans le couple", cat: "Pratique", icon: <Zap/>, time: "4 min", content: "Un sex-toy ne remplace pas un partenaire, c'est un outil pour explorer de nouvelles sensations ensemble.\n\n- Dédiabolisez l'objet : Faites du shopping en ligne à deux pour choisir votre premier jouet.\n- Commencez petit : Un anneau vibrant ou un petit stimulateur clitoridien (bullet) est parfait pour débuter sans intimider.\n- Guidez l'autre : C'est encore plus excitant quand c'est le partenaire qui contrôle le jouet sur vous." },
  { id: 't8', title: "L'art du Teasing (Faire monter le désir)", cat: "Préliminaires", icon: <Timer/>, time: "3 min", content: "Le sexe commence bien avant d'être dans la chambre. L'anticipation est le plus grand des aphrodisiaques :\n\n- Le matin : Laissez un post-it suggestif sur le miroir de la salle de bain.\n- La journée : Envoyez un message décrivant ce que vous portez ou ce que vous comptez lui faire le soir.\n- Le soir : Frôlez-vous dans la cuisine, embrassez-vous dans le cou, mais refusez d'aller plus loin... pour l'instant. Faites durer la frustration exquise." },
  { id: 't9', title: "Jeux de température : Le Feu et la Glace", cat: "Sensorielles", icon: <Flame/>, time: "3 min", content: "Jouer avec le chaud et le froid réveille les terminaisons nerveuses :\n\n- Le froid : Passez un glaçon sur les lèvres de votre partenaire, le long de sa colonne vertébrale, ou gardez-le en bouche pendant le sexe oral (frissons garantis).\n- Le chaud : Utilisez de l'huile de massage chauffante ou buvez une gorgée de thé/café chaud avant d'embrasser le cou ou le ventre de votre partenaire.\n- Le contraste : Alternez immédiatement le souffle chaud de votre bouche après le passage du glaçon." },
  { id: 't10', title: "Initiation au Bondage Léger", cat: "Découverte", icon: <Lock/>, time: "4 min", content: "Attacher son partenaire (ou l'être) crée un abandon total très excitant. Pour débuter sereinement :\n\n- N'utilisez jamais de menottes en métal (risque de blessure sans clé). Préférez des foulards en soie, des cravates souples ou des menottes en velcro.\n- Gardez toujours des ciseaux à bouts ronds à portée de main en cas de panique.\n- Ne laissez jamais la personne attachée seule dans la pièce.\n- Fixez un 'Safe Word' (ex: 'Rouge') qui stoppe instantanément le jeu si l'un de vous est mal à l'aise." },
  { id: 't11', title: "Créer l'ambiance parfaite", cat: "Général", icon: <Star/>, time: "2 min", content: "L'environnement joue un rôle clé dans la capacité à lâcher prise :\n\n- L'éclairage : Fuyez les plafonniers ! Préférez une lumière tamisée, chaude (lampes de chevet, guirlandes) ou la lueur vacillante de quelques bougies.\n- L'ordre : Un lit défait avec des draps propres, c'est sexy. Des vêtements sales qui traînent au sol, ça l'est moins. Dégagez l'espace.\n- L'odeur : Aérez la pièce, utilisez un léger parfum d'ambiance ou de l'encens, mais sans excès." },
  { id: 't12', title: "Le pouvoir du regard", cat: "Connexion", icon: <Eye/>, time: "3 min", content: "Le contact visuel est souvent sous-estimé car il rend très vulnérable. Pourtant, c'est l'outil de connexion ultime :\n\n- Pendant l'acte : Essayez de garder les yeux ouverts et de fixer ceux de votre partenaire pendant plusieurs minutes consécutives. La sensation de fusion est vertigineuse.\n- Le miroir : Placez-vous devant un miroir pour vous regarder faire l'amour. Le côté voyeuriste de votre propre couple est un puissant déclencheur." },
  { id: 't13', title: "La liste Oui / Non / Peut-être", cat: "Communication", icon: <CheckCircle2/>, time: "3 min", content: "C'est un exercice génial pour les couples ! Imprimez chacun une liste détaillée de pratiques sexuelles. \n- Cochez 'Oui' (J'ai envie), 'Non' (C'est hors limite) ou 'Peut-être' (J'y réfléchis si on m'accompagne bien).\n- Comparez ensuite vos listes avec bienveillance. Vous découvrirez souvent que vous avez des fantasmes communs inavoués dans la colonne 'Peut-être' ou 'Oui' !" },
  { id: 't14', title: "Massage sensuel : Les règles d'or", cat: "Préliminaires", icon: <Activity/>, time: "4 min", content: "Un massage sensuel n'est pas un massage thérapeutique. L'objectif est l'effleurement :\n\n- Utilisez de l'huile (préalablement réchauffée dans vos mains).\n- Ne soyez pas pressé : commencez par les épaules, descendez lentement vers les lombaires, massez les mollets et les pieds.\n- La règle d'or : Interdiction stricte de toucher les zones érogènes primaires (sexe, poitrine) pendant les 10 premières minutes. Le désir va grimper en flèche." },
  { id: 't15', title: "Gérer les pannes et les moments gênants", cat: "Général", icon: <Info/>, time: "3 min", content: "Le sexe, ce n'est pas comme dans les films. Il y a des bruits bizarres, des crampes, des pannes d'érection ou des pertes de lubrification. C'est NORMAL.\n\n- Le rire est votre meilleur allié. Une crampe au mollet ? Riez-en ensemble, massez-la, et reprenez.\n- Une baisse de régime ? Ne focalisez pas dessus. Redescendez d'un cran : retournez aux caresses, aux baisers, sans obligation de résultat.\n- La pression de la performance est le pire ennemi de l'érection et du désir." }
];

const POSITIONS_DATA = [
  { n: "Le Missionnaire (L'indémodable)", c: "Face à face", d: 1, s: 1, desc: "Le partenaire A s'allonge sur le dos, les jambes légèrement écartées. Le partenaire B se place au-dessus en appui sur les mains ou les avant-bras. Leurs bassins s'emboîtent parfaitement.", v: "Variante : Le partenaire A referme complètement ses jambes autour de celles du partenaire B." },
  { n: "La Levrette classique", c: "Par derrière", d: 2, s: 4, desc: "Le receveur se place à quatre pattes, dos cambré. Le partenaire se positionne derrière lui à genoux. Offre une pénétration très profonde et stimule l'instinct primal.", v: "Variante : Le partenaire arrière attrape les hanches pour guider l'impact." },
  { n: "L'Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Le partenaire A est allongé sur le dos. Le partenaire B s'assoit à califourchon face à lui, genoux posés sur le matelas. B contrôle totalement l'intensité et la profondeur.", v: "Variante : Le partenaire du dessus peut se pencher en avant et s'appuyer sur le torse de l'autre." },
  { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Les deux partenaires sont allongés sur le flanc, emboîtés l'un dans l'autre (en cuillère). Position très reposante, idéale pour de longs câlins sensuels.", v: "Variante : Le partenaire arrière glisse un bras sous la nuque du receveur pour caresser son torse." },
  { n: "Le 69 Classique", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Les partenaires sont allongés tête-bêche (la tête de l'un au niveau du bassin de l'autre), l'un sur le dos, l'autre par-dessus.", v: "Variante : Synchronisez vos mouvements de langue pour atteindre le sommet en même temps." },
  { n: "Le Poteau", c: "Debout & Acrobatique", d: 4, s: 4, desc: "Le receveur se tient debout, le dos fermement plaqué contre un mur. Le partenaire actif se tient debout face à lui pour la pénétration.", v: "Variante : Le receveur lève une jambe et l'enroule autour de la hanche du partenaire." },
  { n: "Le Fauteuil de bureau", c: "Sur Mobilier", d: 2, s: 3, desc: "L'actif s'assoit sur un fauteuil à roulettes. Le receveur le chevauche. Profitez du rebond et de la rotation du siège.", v: "Variante : Le receveur pousse avec ses pieds sur le sol pour faire tourner le fauteuil." },
  { n: "La Méditation sexuelle", c: "Sensorielles", d: 1, s: 3, desc: "Une fois emboîtés, les deux partenaires cessent tout mouvement pendant plusieurs minutes. Fermez les yeux et concentrez-vous uniquement sur les micro-pulsations de vos corps.", v: "Variante : Synchronisez votre respiration : l'un inspire quand l'autre expire." },
  { n: "L'Expansion", c: "Angles & Tweaks", d: 2, s: 2, desc: "L'actif recule presque jusqu'à sortir complètement à chaque mouvement, avant de revenir profondément. Joue sur la frustration et l'anticipation.", v: "Variante : Marquez une pause d'une seconde lorsque vous êtes presque sorti, avant la pénétration." }
];

const FULL_CATALOG = POSITIONS_DATA.map((p, i) => ({
  id: `p${i}`, name: p.n, cat: p.c, diff: p.d, spice: p.s, desc: p.desc, v: p.v
}));

export default function App() {
  const [user, setUser] = useState(null);
  const [requireLogin, setRequireLogin] = useState(false); // GESTION DE LA CONNEXION OBLIGATOIRE
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
  const [showInstallTutorial, setShowInstallTutorial] = useState(false);
  
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
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const chatEndRef = useRef(null);
  
  // REFS POUR LES NOTIFICATIONS SYSTÈMES SANS RECHARGEMENT
  const lastSeenPingRef = useRef(Date.now());
  const prevPartnerLikesRef = useRef([]);
  const myLikesRef = useRef([]);

  // --- SYSTÈME DE NOTIFICATION NATIVE (OS) ---
  const fireSystemNotification = (title, body) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body });
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
          navigator.serviceWorker.ready.then(reg => {
             reg.showNotification(title, { body }).catch(e=>e);
          }).catch(e=>e);
        }
      } catch (e) {
        console.log("Erreur notification système:", e);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // --- INIT AUTHENTIFICATION FIXÉE ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setRequireLogin(false);
      } else {
        setUser(null);
        setRequireLogin(true); // OBLIGE LA CONNEXION GOOGLE AU DEMARRAGE
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // --- LOGIQUE PRINCIPALE DONNÉES ---
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'artifacts', appId, 'users', user.uid);
    let unsubPartner = () => {};
    let unsubPartnerCustom = () => {};
    let unsubGlobalChat = () => {};

    const unsubUser = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        const initial = { 
          uid: user.uid, 
          pseudo: user.displayName || 'Anonyme', 
          bio: 'Explorateur de sensations...',
          avatarUrl: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}&backgroundColor=1e293b`,
          likes: [], 
          pairCode: Math.random().toString(36).substring(2, 8).toUpperCase(), 
          partnerUid: null,
          mood: 'playful',
          lastIntimacy: 0,
          pingToPartner: 0
        };
        setDoc(userRef, initial);
        setUserData(initial);
        myLikesRef.current = [];
      } else {
        const data = snap.data();
        setUserData(data);
        myLikesRef.current = data.likes || [];

        if (data.partnerUid) {
          unsubPartner = onSnapshot(doc(db, 'artifacts', appId, 'users', data.partnerUid), (pSnap) => {
            if (pSnap.exists()) {
               const pData = pSnap.data();
               setPartnerData(pData);
               
               // NOTIFICATION SYSTÈME 1: SIGNAL DISCRET
               if (pData.pingToPartner && pData.pingToPartner > lastSeenPingRef.current) {
                  if (Date.now() - pData.pingToPartner < 60000) {
                     notify(`${pData.pseudo || 'Votre partenaire'} a très envie de vous... 🔥`, '🔔');
                     fireSystemNotification("Nouveau Signal 🔥", `${pData.pseudo || 'Votre partenaire'} a très envie de vous...`);
                  }
                  lastSeenPingRef.current = pData.pingToPartner;
               }

               // NOTIFICATION SYSTÈME 2: NOUVEAU MATCH
               const pLikes = pData.likes || [];
               const newlyLiked = pLikes.filter(id => !prevPartnerLikesRef.current.includes(id));
               newlyLiked.forEach(likedId => {
                 if (myLikesRef.current.includes(likedId)) {
                    notify("NOUVEAU MATCH PARFAIT !", "🔥");
                    fireSystemNotification("Nouveau Match ! 🔥", `${pData.pseudo || 'Votre partenaire'} a aimé la même position que vous !`);
                 }
               });
               prevPartnerLikesRef.current = pLikes;
            }
          });

          // NOTIFICATION SYSTÈME 3: CHAT GLOBAL
          const chatId = [user.uid, data.partnerUid].sort().join('_');
          const chatRef = collection(db, 'artifacts', appId, 'chats', chatId, 'messages');
          const qChat = query(chatRef, orderBy('createdAt', 'desc'), limit(1));
          unsubGlobalChat = onSnapshot(qChat, (cSnap) => {
             if (!cSnap.empty) {
                const msg = cSnap.docs[0].data();
                if (msg.uid === data.partnerUid && msg.createdAt > Date.now() - 5000) {
                   notify("Nouveau message secret 💌", "💬");
                   fireSystemNotification("Message Intime 💌", msg.text);
                }
             }
          });

          const partnerCustomCol = collection(db, 'artifacts', appId, 'users', data.partnerUid, 'customPositions');
          unsubPartnerCustom = onSnapshot(partnerCustomCol, (cSnap) => {
            const partnerPositions = cSnap.docs
              .map(d => ({ id: d.id, ...d.data(), isCustom: true, isPartner: true }))
              .filter(p => p.shared !== false); 
            setPartnerCustomPositions(partnerPositions);
          });
        } else {
          setPartnerCustomPositions([]);
          setPartnerData(null);
        }
      }
      setLoading(false);
    });

    const myCustomCol = collection(db, 'artifacts', appId, 'users', user.uid, 'customPositions');
    const unsubMyCustom = onSnapshot(myCustomCol, (snap) => {
      setMyCustomPositions(snap.docs.map(d => ({ id: d.id, ...d.data(), isCustom: true, isMine: true })));
    });

    return () => { unsubUser(); unsubPartner(); unsubPartnerCustom(); unsubGlobalChat(); };
  }, [user]);

  // --- LOGIQUE CATÉGORIES DYNAMIQUES ---
  const displayCategories = useMemo(() => {
    const baseCats = [...CATEGORIES];
    const baseIds = baseCats.map(c => c.id);
    const customIds = new Set();
    
    [...myCustomPositions, ...partnerCustomPositions].forEach(p => {
       if(p.cat && !baseIds.includes(p.cat)) customIds.add(p.cat);
    });

    const newCats = Array.from(customIds).map(id => ({
       id, icon: <FolderPlus size={14}/>, color: 'from-slate-700/40 to-slate-900/40', text: 'text-slate-300'
    }));

    return [...baseCats, ...newCats];
  }, [myCustomPositions, partnerCustomPositions]);

  // --- LOGIQUE FILTRAGE & TRI ---
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

  const positionDuJour = useMemo(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return FULL_CATALOG[dayOfYear % FULL_CATALOG.length];
  }, []);

  const resetFilters = () => {
    setSearchQuery(''); setFilterSpice(0); setFilterPhysique(0); setFilterCat('Toutes'); setSortBy('az');
  };

  const notify = (msg, icon = '✨') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  // --- ACTIONS DUO ---
  const sendSignal = async () => {
    if (!user || !userData?.partnerUid) return;
    notify("Signal envoyé à votre partenaire !", "💌");
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid), { pingToPartner: Date.now() });
  };

  const updateMyMood = async (moodId) => {
    if (!user) return;
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid), { mood: moodId });
    notify("Humeur mise à jour", "🎭");
  };

  const logIntimacy = async () => {
    if (!user) return;
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid), { lastIntimacy: Date.now() });
    notify("Moment intime enregistré dans votre calendrier", "❤️");
  };

  const getDaysSinceIntimacy = () => {
    const myDate = userData?.lastIntimacy || 0;
    const partnerDate = partnerData?.lastIntimacy || 0;
    const maxDate = Math.max(myDate, partnerDate);
    if (maxDate === 0) return "Aucun moment enregistré";
    
    const days = Math.floor((Date.now() - maxDate) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Aujourd'hui 🔥";
    if (days === 1) return "Hier";
    return `Il y a ${days} jours`;
  };

  // --- LOGIN GOOGLE OBLIGATOIRE ---
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // L'utilisateur est connecté, le useEffect onAuthStateChanged se chargera du reste
    } catch (error) {
      console.error(error);
      notify("Erreur lors de la connexion", "❌");
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      notify("Votre navigateur ne supporte pas les notifications.", "❌");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        notify("Notifications activées avec succès !", "🔔");
      } else {
        notify("Permission refusée. Vérifiez vos paramètres.", "❌");
      }
    } catch (e) {
      notify("Erreur lors de l'activation.", "❌");
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const userRef = doc(db, 'artifacts', appId, 'users', user.uid);
    await updateDoc(userRef, { pseudo: profileForm.pseudo, bio: profileForm.bio, avatarUrl: profileForm.avatarUrl });
    setIsEditingProfile(false);
    notify("Profil mis à jour !", "👤");
  };

  const generateNewAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setProfileForm({ ...profileForm, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}&backgroundColor=1e293b` });
  };

  const handleLike = async (id) => {
    if (!user || !userData) return;
    const userRef = doc(db, 'artifacts', appId, 'users', user.uid);
    const isLiked = userData.likes?.includes(id);
    if (isLiked) {
      await updateDoc(userRef, { likes: userData.likes.filter(l => l !== id) });
    } else {
      await updateDoc(userRef, { likes: arrayUnion(id) });
      if (partnerData?.likes?.includes(id)) {
        notify("MATCH PARFAIT !", "🔥");
        fireSystemNotification("Match Parfait ! 🔥", "Vous avez la même envie...");
      }
    }
  };

  const handleOpenEdit = (pos) => {
    const isKnownCat = displayCategories.some(c => c.id === pos.cat);
    setNewPos({
      name: pos.name,
      cat: isKnownCat ? pos.cat : 'NEW',
      newCat: isKnownCat ? '' : pos.cat,
      desc: pos.desc,
      v: pos.v || '',
      diff: pos.diff,
      spice: pos.spice,
      shared: pos.shared !== false
    });
    setEditPosId(pos.id);
    setSelectedPosition(null);
    setShowDeleteConfirm(false);
    setIsCreating(true);
  };

  const handleSavePosition = async () => {
    if (!newPos.name || !newPos.desc) {
      notify("Veuillez remplir le nom et la description.", "⚠️");
      return;
    }
    
    let finalCat = newPos.cat;
    if (newPos.cat === 'NEW') {
      finalCat = newPos.newCat.trim() !== '' ? newPos.newCat.trim() : 'Personnalisé';
    }

    const posData = { 
      name: newPos.name, cat: finalCat, desc: newPos.desc, v: newPos.v, 
      diff: newPos.diff, spice: newPos.spice, shared: newPos.shared, authorId: user.uid 
    };

    if (editPosId) {
      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'customPositions', editPosId), posData);
      notify("Création modifiée !", "✏️");
    } else {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'customPositions'), { ...posData, createdAt: Date.now() });
      notify("Nouvelle position créée !", "🌟");
    }
    
    setIsCreating(false);
    setEditPosId(null);
    setNewPos({ name: '', cat: 'Face à face', newCat: '', desc: '', v: '', diff: 3, spice: 3, shared: true });
    
    setActiveTab('explorer');
  };

  const handleDeletePosition = async () => {
    if(!selectedPosition || !selectedPosition.isMine) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'customPositions', selectedPosition.id));
    setSelectedPosition(null);
    setShowDeleteConfirm(false);
    notify("Création supprimée", "🗑️");
  };

  const handleLinkPartner = async () => {
    if (!partnerCodeInput || partnerCodeInput.length !== 6) {
      notify("Code invalide", "❌");
      return;
    }

    if (partnerCodeInput === userData.pairCode) {
      notify("Vous ne pouvez pas vous lier à vous-même", "⚠️");
      return;
    }

    try {
      const q = query(collection(db, 'artifacts', appId, 'users'), where("pairCode", "==", partnerCodeInput));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        notify("Ce code n'appartient à personne. Vérifiez les lettres.", "❌");
        return;
      }

      const partnerDoc = querySnapshot.docs[0];
      const actualPartnerUid = partnerDoc.id;

      const userRef = doc(db, 'artifacts', appId, 'users', user.uid);
      await updateDoc(userRef, { partnerUid: actualPartnerUid });
      notify("Liaison réussie !", "🔗");
      
    } catch (error) {
      notify("Une erreur est survenue lors de la recherche.", "❌");
    }
  };

  const handleUnlinkPartner = async () => {
    if (!user) return;
    if (window.confirm("⚠️ Attention : Voulez-vous vraiment vous séparer de ce partenaire ? Vous ne verrez plus vos données communes.")) {
      const userRef = doc(db, 'artifacts', appId, 'users', user.uid);
      await updateDoc(userRef, { partnerUid: null });
      notify("Partenaire délié avec succès", "🔓");
    }
  };

  // --- LOGIQUE DU CHAT ---
  useEffect(() => {
    if (!isChatOpen || !user || !userData?.partnerUid) return;
    
    const chatId = [user.uid, userData.partnerUid].sort().join('_');
    const q = query(collection(db, 'artifacts', appId, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'), limit(50));
    
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    return () => unsub();
  }, [isChatOpen, user, userData?.partnerUid]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !userData?.partnerUid) return;
    
    const chatId = [user.uid, userData.partnerUid].sort().join('_');
    const msgText = newMessage.trim();
    setNewMessage(''); 
    
    await addDoc(collection(db, 'artifacts', appId, 'chats', chatId, 'messages'), {
      text: msgText,
      uid: user.uid,
      createdAt: Date.now()
    });
  };

  const applyDiscreet = (text, type = 'desc') => discreetMode ? (type === 'title' ? "Masqué" : text.replace(/[a-zA-Z]/g, "x")) : text;

  const triggerGameResult = (type) => {
    let result = null;
    switch(type) {
      case 'truth': result = GAMES_DATA.truths[Math.floor(Math.random() * GAMES_DATA.truths.length)]; break;
      case 'dare': result = GAMES_DATA.dares[Math.floor(Math.random() * GAMES_DATA.dares.length)]; break;
      case 'dice':
        const action = GAMES_DATA.diceActions[Math.floor(Math.random() * GAMES_DATA.diceActions.length)];
        const zone = GAMES_DATA.diceZones[Math.floor(Math.random() * GAMES_DATA.diceZones.length)];
        const time = GAMES_DATA.diceDurations[Math.floor(Math.random() * GAMES_DATA.diceDurations.length)];
        result = `${action} ➔ ${zone} \n${time}`;
        break;
      case 'scenario':
        const place = GAMES_DATA.scenPlaces[Math.floor(Math.random() * GAMES_DATA.scenPlaces.length)];
        const role = GAMES_DATA.scenRoles[Math.floor(Math.random() * GAMES_DATA.scenRoles.length)];
        const twist = GAMES_DATA.scenTwists[Math.floor(Math.random() * GAMES_DATA.scenTwists.length)];
        result = `Lieu : ${place}\nRôle : ${role}\nTwist : ${twist}`;
        break;
      case 'roulette': result = GAMES_DATA.rouletteTasks[Math.floor(Math.random() * GAMES_DATA.rouletteTasks.length)]; break;
      case 'secret': result = GAMES_DATA.secretChallenges[Math.floor(Math.random() * GAMES_DATA.secretChallenges.length)]; break;
      default: break;
    }
    setGameResult(result);
  };

  // --- RENDU : CHARGEMENT ET LOGIN ---
  if (loading) return <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-rose-500"><Flame className="animate-pulse" size={48} /></div>;

  // NOUVEAU ECRAN DE LOGIN OBLIGATOIRE
  if (requireLogin) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center z-[999]">
        <Flame className="text-rose-500 mb-6 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" size={64} />
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">KAMA<span className="text-rose-500">SYNC</span></h1>
        <p className="text-slate-400 mb-10 text-sm">Connectez-vous pour synchroniser vos données sur tous vos appareils sans rien perdre.</p>
        <button 
          onClick={handleGoogleLogin} 
          className="w-full max-w-xs bg-white text-slate-900 px-6 py-4 rounded-2xl font-black transition hover:bg-slate-200 shadow-xl shadow-white/10 flex items-center justify-center gap-3"
        >
          <LogIn size={20} /> Connexion avec Google
        </button>
      </div>
    );
  }

  const sharedLikes = allPositions.filter(p => userData?.likes?.includes(p.id) && partnerData?.likes?.includes(p.id));

  return (
    <div className="fixed inset-0 bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden" style={{ WebkitTapHighlightColor: 'transparent' }}>
      
      {/* HEADER GLOBAL AVEC SAFE AREA IOS */}
      <header 
        className="px-6 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl z-50 shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 1.25rem)', paddingBottom: '1.25rem' }}
      >
        <div className="flex items-center gap-2 text-rose-500 font-black text-2xl tracking-tighter">
          <Flame fill="currentColor" size={28} className="drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" /> 
          KAMA<span className="text-white">SYNC</span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setDiscreetMode(!discreetMode)} className="text-slate-400 p-2">
            {discreetMode ? <EyeOff size={20} className="text-emerald-400" /> : <Eye size={20} />}
          </button>
        </div>
      </header>

      {/* TOASTS (Notifications) */}
      <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none items-center w-full px-4">
        {notifications.map(n => (
          <div key={n.id} className="bg-slate-800/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-3 border border-white/10">
            <span className="text-lg">{n.icon}</span> {n.msg}
          </div>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto custom-scroll relative" style={{ WebkitOverflowScrolling: 'touch', paddingBottom: 'calc(env(safe-area-inset-bottom) + 120px)' }}>
        
        {/* --- TAB 1: EXPLORER --- */}
        {activeTab === 'explorer' && (
          <div className="animate-in fade-in duration-500">
            <div className="px-6 py-8">
              <div 
                onClick={() => setSelectedPosition(positionDuJour)}
                className="bg-gradient-to-br from-rose-600 to-orange-500 rounded-3xl p-6 relative overflow-hidden cursor-pointer shadow-lg shadow-rose-900/20 active:scale-[0.98] transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="flex items-center gap-2 text-white/80 text-xs font-black uppercase tracking-widest mb-3">
                  <Calendar size={14} /> Position du jour
                </div>
                <h2 className="text-2xl font-black text-white mb-1">
                  {discreetMode ? "Masqué" : positionDuJour.name}
                </h2>
                <p className={`text-white/80 text-sm line-clamp-2 ${discreetMode ? 'blur-sm select-none opacity-50' : ''}`}>
                  {applyDiscreet(positionDuJour.desc)}
                </p>
              </div>
            </div>

            <div className="px-6 mb-8 space-y-4">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" placeholder="Rechercher une position..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-3xl py-4 pl-14 pr-4 outline-none focus:border-rose-500 text-base"
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Filter size={12}/> Filtres & Tri
                  </span>
                  {(searchQuery || filterSpice > 0 || filterPhysique > 0 || filterCat !== 'Toutes' || sortBy !== 'az') && (
                    <button onClick={resetFilters} className="text-[10px] font-black text-rose-500 uppercase">Réinitialiser</button>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold text-emerald-400 min-w-[120px] text-base">
                    <option value="az">Trier : A-Z</option>
                    <option value="spice">Trier : Plus épicé</option>
                    <option value="diff">Trier : Moins physique</option>
                  </select>
                  <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-300 min-w-[120px] text-base">
                    <option value="Toutes">Catégories</option>
                    {displayCategories.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* RÉSULTATS */}
            {displayCategories.map(category => {
              if (filterCat !== 'Toutes' && category.id !== filterCat) return null;
              const categoryPositions = filteredPositions.filter(p => p.cat === category.id);
              if (categoryPositions.length === 0) return null;

              return (
                <section key={category.id} className="mb-10 px-6">
                  <h2 className={`text-lg font-black tracking-tight flex items-center gap-2 mb-4 ${category.text}`}>
                    {category.icon} {category.id}
                  </h2>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                    {categoryPositions.map(pos => {
                      const isMatch = userData?.likes?.includes(pos.id) && partnerData?.likes?.includes(pos.id);
                      return (
                        <div key={pos.id} onClick={() => setSelectedPosition(pos)} className={`relative snap-center shrink-0 w-48 bg-gradient-to-br ${category.color} border ${isMatch ? 'border-amber-500/50' : 'border-white/5'} rounded-[2rem] p-5 cursor-pointer hover:scale-[1.02] transition-all`}>
                          
                          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                            {pos.isPartner && <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">De {partnerData?.pseudo || 'Partenaire'}</span>}
                            {pos.isMine && <span className="bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-indigo-500/30">Moi</span>}
                            {pos.isMine && pos.shared === false && <span className="bg-slate-800 text-slate-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-slate-700">Privé</span>}
                          </div>

                          <div className="flex justify-between items-start mb-4">
                             <div className="flex flex-col gap-1">
                               <div className="flex gap-0.5 mt-1">
                                 {[...Array(5)].map((_, i) => <div key={i} className={`w-1 h-1.5 rounded-full ${i < pos.spice ? 'bg-rose-500' : 'bg-white/10'}`}></div>)}
                               </div>
                             </div>
                             {isMatch ? <Star size={14} fill="#f59e0b" className="text-amber-500 mt-1" /> : userData?.likes?.includes(pos.id) && <Heart size={14} fill="#f43f5e" className="text-rose-500 mt-1" />}
                          </div>
                          <h3 className="font-bold text-base text-white mb-2 pr-6">{discreetMode ? "Masqué" : pos.name}</h3>
                          <p className={`text-[10px] text-white/50 line-clamp-3 ${discreetMode ? 'blur-[3px] opacity-40 select-none' : ''}`}>{applyDiscreet(pos.desc)}</p>
                        </div>
                      )
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* --- TAB 2: MINI JEUX COQUINS --- */}
        {activeTab === 'jeux' && !activeGame && (
          <div className="animate-in fade-in duration-500 p-6 mt-4">
             <div className="text-center mb-10">
               <Gamepad2 className="mx-auto text-purple-500 mb-4" size={48} />
               <h1 className="text-3xl font-black text-white mb-2">Zone de Jeux</h1>
               <p className="text-slate-400 text-sm">Choisissez votre expérience pour ce soir.</p>
             </div>

             <div className="grid grid-cols-1 gap-4">
               <button onClick={() => setActiveGame('truthOrDare')} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-left flex items-center justify-between group hover:bg-slate-800 transition">
                 <div>
                  <h3 className="font-bold text-white flex items-center gap-2 mb-1"><Zap size={18} className="text-rose-500"/> Action ou Vérité</h3>
                  <p className="text-xs text-slate-400">Des confessions intimes et des défis charnels.</p>
                 </div>
                 <ChevronRight className="text-slate-700 group-hover:text-white" />
               </button>
               <button onClick={() => setActiveGame('loveDice')} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-left flex items-center justify-between group hover:bg-slate-800 transition">
                 <div>
                  <h3 className="font-bold text-white flex items-center gap-2 mb-1"><Dices size={18} className="text-amber-500"/> Dés de l'Amour</h3>
                  <p className="text-xs text-slate-400">Laissez le hasard dicter vos caresses.</p>
                 </div>
                 <ChevronRight className="text-slate-700 group-hover:text-white" />
               </button>
               <button onClick={() => setActiveGame('scenario')} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-left flex items-center justify-between group hover:bg-slate-800 transition">
                 <div>
                  <h3 className="font-bold text-white flex items-center gap-2 mb-1"><Shuffle size={18} className="text-purple-500"/> Scénario Aléatoire</h3>
                  <p className="text-xs text-slate-400">Lieu + Rôle + Twist inattendu.</p>
                 </div>
                 <ChevronRight className="text-slate-700 group-hover:text-white" />
               </button>
               <button onClick={() => setActiveGame('roulette')} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-left flex items-center justify-between group hover:bg-slate-800 transition">
                 <div>
                  <h3 className="font-bold text-white flex items-center gap-2 mb-1"><Timer size={18} className="text-pink-500"/> Roulette Préliminaires</h3>
                  <p className="text-xs text-slate-400">Des tâches sensorielles pour faire monter le désir.</p>
                 </div>
                 <ChevronRight className="text-slate-700 group-hover:text-white" />
               </button>
               <button onClick={() => setActiveGame('secretChallenge')} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-left flex items-center justify-between group hover:bg-slate-800 transition">
                 <div>
                  <h3 className="font-bold text-white flex items-center gap-2 mb-1"><Gift size={18} className="text-emerald-500"/> Défi Secret (24h)</h3>
                  <p className="text-xs text-slate-400">Un défi à accomplir en cachette.</p>
                 </div>
                 <ChevronRight className="text-slate-700 group-hover:text-white" />
               </button>
             </div>
          </div>
        )}

        {/* MODAL JEUX (FIX iOS Scroll) */}
        {activeTab === 'jeux' && activeGame && (
          <div className="absolute inset-0 bg-slate-950 z-10 animate-in slide-in-from-right duration-300 flex flex-col">
            <header className="px-6 flex items-center justify-between border-b border-white/5 bg-slate-900/50" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.25rem)', paddingBottom: '1.25rem' }}>
              <button onClick={() => { setActiveGame(null); setGameResult(null); }} className="text-slate-400 p-2 bg-slate-800 rounded-full hover:text-white"><ArrowLeft size={20}/></button>
              <div className="w-9"/>
            </header>
            
            <div className="flex-1 overflow-y-auto p-6 pb-32 flex flex-col items-center justify-start pt-8 text-center custom-scroll">
              {activeGame === 'truthOrDare' && (
                <div className="w-full max-w-md">
                  <Zap size={64} className="text-rose-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-black text-white mb-8">Action ou Vérité</h2>
                  {gameResult ? (
                    <div className="bg-rose-900/20 border border-rose-500/30 p-8 rounded-[2rem] animate-in zoom-in duration-300 mb-8">
                      <h3 className="text-xl font-bold text-white leading-relaxed">{gameResult}</h3>
                    </div>
                  ) : <p className="text-slate-400 mb-8">Osez révéler vos secrets ou passez à l'action.</p>}
                  <div className="flex gap-4">
                    <button onClick={() => triggerGameResult('truth')} className="flex-1 bg-slate-800 py-4 rounded-2xl font-black text-indigo-400 hover:bg-slate-700">VÉRITÉ</button>
                    <button onClick={() => triggerGameResult('dare')} className="flex-1 bg-rose-600 py-4 rounded-2xl font-black text-white shadow-lg shadow-rose-900/50 hover:bg-rose-500">ACTION</button>
                  </div>
                </div>
              )}
              {activeGame === 'loveDice' && (
                <div className="w-full max-w-md">
                  <Dices size={64} className="text-amber-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-black text-white mb-8">Dés de l'Amour</h2>
                  {gameResult ? (
                    <div className="bg-amber-900/20 border border-amber-500/30 p-8 rounded-[2rem] animate-in zoom-in duration-300 mb-8">
                      <h3 className="text-xl font-bold text-white leading-relaxed whitespace-pre-line">{gameResult}</h3>
                    </div>
                  ) : <p className="text-slate-400 mb-8">Laissez les dés choisir votre prochaine étape.</p>}
                  <button onClick={() => triggerGameResult('dice')} className="w-full bg-amber-500 py-4 rounded-2xl font-black text-slate-900 shadow-lg shadow-amber-900/50 hover:bg-amber-400">LANCER LES DÉS</button>
                </div>
              )}
              {activeGame === 'scenario' && (
                <div className="w-full max-w-md">
                  <Shuffle size={64} className="text-purple-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-black text-white mb-8">Scénario Aléatoire</h2>
                  {gameResult ? (
                    <div className="bg-purple-900/20 border border-purple-500/30 p-8 rounded-[2rem] animate-in zoom-in duration-300 mb-8">
                      <h3 className="text-lg font-bold text-white leading-relaxed whitespace-pre-line text-left">{gameResult}</h3>
                    </div>
                  ) : <p className="text-slate-400 mb-8">Prêts à jouer un rôle ce soir ?</p>}
                  <button onClick={() => triggerGameResult('scenario')} className="w-full bg-purple-600 py-4 rounded-2xl font-black text-white shadow-lg shadow-purple-900/50 hover:bg-purple-500">GÉNÉRER UN SCÉNARIO</button>
                </div>
              )}
              {activeGame === 'roulette' && (
                <div className="w-full max-w-md">
                  <Timer size={64} className="text-pink-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-black text-white mb-8">Préliminaires</h2>
                  {gameResult ? (
                    <div className="bg-pink-900/20 border border-pink-500/30 p-8 rounded-[2rem] animate-in zoom-in duration-300 mb-8">
                      <h3 className="text-xl font-bold text-white leading-relaxed">{gameResult}</h3>
                    </div>
                  ) : <p className="text-slate-400 mb-8">Faites monter la température lentement.</p>}
                  <button onClick={() => triggerGameResult('roulette')} className="w-full bg-pink-600 py-4 rounded-2xl font-black text-white shadow-lg shadow-pink-900/50 hover:bg-pink-500">TOURNER LA ROULETTE</button>
                </div>
              )}
              {activeGame === 'secretChallenge' && (
                <div className="w-full max-w-md">
                  <Gift size={64} className="text-emerald-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-black text-white mb-8">Défi Secret (24h)</h2>
                  {gameResult ? (
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-8 rounded-[2rem] animate-in zoom-in duration-300 mb-8">
                      <h3 className="text-lg font-bold text-emerald-400 mb-4 uppercase text-[10px] tracking-widest">À réaliser d'ici demain</h3>
                      <p className="text-xl font-bold text-white leading-relaxed">{gameResult}</p>
                    </div>
                  ) : <p className="text-slate-400 mb-8">Tirez un défi personnel à accomplir en cachette de votre partenaire pour le/la surprendre plus tard.</p>}
                  <button onClick={() => triggerGameResult('secret')} className="w-full bg-emerald-600 py-4 rounded-2xl font-black text-white shadow-lg shadow-emerald-900/50 hover:bg-emerald-500">RÉVÉLER MON DÉFI</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 3: CONSEILS --- */}
        {activeTab === 'conseils' && (
          <div className="animate-in fade-in duration-500 p-6 mt-4">
            <h1 className="text-3xl font-black text-white mb-2">Le Guide Intime.</h1>
            <div className="grid grid-cols-1 gap-4 mt-8">
              {TIPS_DATA.map(tip => (
                <div key={tip.id} onClick={() => setSelectedTip(tip)} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-800/50">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">{tip.icon}</div>
                  <div>
                    <h3 className="font-bold text-white text-base mb-1">{tip.title}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2">{tip.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: DUO AVANCÉ --- */}
        {activeTab === 'duo' && (
          <div className="animate-in fade-in duration-500 p-6 mt-4">
             <h1 className="text-3xl font-black text-white mb-8 text-center">Espace Duo</h1>
             
             {!userData?.partnerUid ? (
               <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-center mb-8">
                 <Users className="mx-auto mb-4 text-emerald-500" size={40} />
                 <p className="text-slate-400 text-sm mb-6">Associez vos comptes pour débloquer la communication intime et partager vos créations.</p>
                 <div className="bg-slate-950 p-4 rounded-xl mb-6">
                   <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Votre Code Unique</span>
                   <div className="text-2xl font-mono font-black text-white tracking-widest">{userData?.pairCode}</div>
                 </div>
                 <div className="flex gap-2">
                   {/* TEXT-BASE iOS ZOOM FIX */}
                   <input 
                     className="flex-1 bg-slate-800 border-none rounded-xl text-center font-mono uppercase text-white outline-none px-4 text-base"
                     placeholder="CODE PARTENAIRE"
                     value={partnerCodeInput}
                     onChange={(e) => setPartnerCodeInput(e.target.value.toUpperCase())}
                     maxLength={6}
                   />
                   <button onClick={handleLinkPartner} className="bg-emerald-600 px-6 py-3 rounded-xl font-bold text-white text-xs hover:bg-emerald-500 transition-all">LIER</button>
                 </div>
               </div>
             ) : (
               <div className="space-y-6">
                 
                 {/* NOUVEAU: RAPPEL DU CODE DUO */}
                 <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-[2rem] flex items-center justify-between shadow-lg">
                   <div>
                     <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Mon Code Unique</span>
                     <div className="text-lg font-mono font-black text-white tracking-widest">{userData?.pairCode}</div>
                   </div>
                   <div className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                     En Duo
                   </div>
                 </div>

                 {/* COMPTEUR INTIME & SIGNAL */}
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] text-center flex flex-col justify-center items-center">
                     <CalendarHeart className="text-rose-500 mb-2" size={24} />
                     <div className="text-xs text-slate-400 font-bold mb-1">Dernière fois</div>
                     <div className="text-lg font-black text-white mb-4">{getDaysSinceIntimacy()}</div>
                     <button onClick={logIntimacy} className="bg-slate-800 hover:bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-full transition w-full">On l'a fait !</button>
                   </div>
                   
                   <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-5 rounded-[2rem] text-center flex flex-col justify-center items-center cursor-pointer shadow-lg shadow-indigo-900/30 active:scale-95 transition" onClick={sendSignal}>
                     <BellRing className="text-white mb-2 animate-pulse" size={28} />
                     <div className="text-white font-black text-sm leading-tight">Envoyer un signal<br/>discret</div>
                     <div className="text-indigo-200 text-[9px] uppercase mt-2 font-bold tracking-widest">Je te veux</div>
                   </div>
                 </div>

                 {/* NOUVEAU: BOUTON CHAT PRIVÉ */}
                 <div 
                   onClick={() => setIsChatOpen(true)}
                   className="bg-slate-900 border border-slate-800 p-4 rounded-[2rem] flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all shadow-lg"
                 >
                   <div className="flex items-center gap-4">
                     <div className="bg-rose-500/20 p-3 rounded-full text-rose-500">
                       <MessageSquare size={24} />
                     </div>
                     <div>
                       <h3 className="font-bold text-white text-sm">Ouvrir le Chat Secret</h3>
                       <p className="text-slate-400 text-xs">Discutez en privé avec {partnerData?.pseudo || 'votre partenaire'}</p>
                     </div>
                   </div>
                   <ChevronRight className="text-slate-600" />
                 </div>

                 {/* HUMEUR DU JOUR */}
                 <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6">
                    <h3 className="text-sm font-black text-white mb-4 uppercase tracking-widest text-center flex items-center justify-center gap-2"><HeartHandshake size={16}/> Notre Humeur</h3>
                    
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-center flex-1">
                        <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden mb-2">
                          <img src={userData?.avatarUrl} alt="Me" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-xs font-bold text-slate-300">Moi</div>
                        {userData?.mood && MOODS.find(m => m.id === userData.mood) && (
                          <div className={`text-[10px] font-bold px-2 py-1 rounded-full mt-1 border ${MOODS.find(m => m.id === userData.mood).color}`}>
                            {MOODS.find(m => m.id === userData.mood).icon} {MOODS.find(m => m.id === userData.mood).label}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-slate-600 font-black px-4">VS</div>
                      
                      <div className="text-center flex-1">
                        <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden mb-2">
                          <img src={partnerData?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=partner&backgroundColor=1e293b`} alt="Partner" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-xs font-bold text-slate-300">{partnerData?.pseudo || 'Partenaire'}</div>
                        {partnerData?.mood && MOODS.find(m => m.id === partnerData.mood) ? (
                          <div className={`text-[10px] font-bold px-2 py-1 rounded-full mt-1 border ${MOODS.find(m => m.id === partnerData.mood).color}`}>
                            {MOODS.find(m => m.id === partnerData.mood).icon} {MOODS.find(m => m.id === partnerData.mood).label}
                          </div>
                        ) : (
                          <div className="text-[10px] font-bold px-2 py-1 rounded-full mt-1 border border-slate-700 text-slate-500 bg-slate-800">
                            Mystère...
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <div className="text-[10px] font-bold text-slate-500 uppercase text-center mb-3 tracking-widest">Changer mon humeur</div>
                      <div className="grid grid-cols-2 gap-2">
                        {MOODS.map(mood => (
                          <button 
                            key={mood.id} 
                            onClick={() => updateMyMood(mood.id)}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all ${userData?.mood === mood.id ? mood.color : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                          >
                            {mood.icon} {mood.label}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>

                 <div className="text-center mb-2 mt-8">
                   <Star size={32} fill="currentColor" className="mx-auto text-amber-500 mb-2" />
                   <h2 className="text-xl font-black text-white">Vos Matchs Parfaits</h2>
                 </div>
                 
                 {sharedLikes.length === 0 ? (
                   <div className="text-center py-6 opacity-50 text-slate-400 text-sm border border-dashed border-slate-700 rounded-3xl p-6">
                     Aucun match pour le moment.
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 gap-3">
                     {sharedLikes.map(pos => (
                       <div key={pos.id} onClick={() => setSelectedPosition(pos)} className="bg-slate-900 p-4 rounded-xl flex items-center justify-between cursor-pointer border border-amber-500/20">
                         <div className="flex items-center gap-3">
                           <Flame className="text-amber-500" size={18} />
                           <span className="font-bold text-sm text-white">{discreetMode ? "Masqué" : pos.name}</span>
                         </div>
                         <ChevronRight className="text-slate-600" size={16} />
                       </div>
                     ))}
                   </div>
                 )}

                 {/* BOUTON ÉVIDENT POUR DÉLIER LE PARTENAIRE */}
                 <div className="pt-8 pb-4">
                   <button 
                     onClick={handleUnlinkPartner} 
                     className="w-full bg-rose-600/20 border border-rose-500 text-rose-500 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2"
                   >
                     ⚠️ Délier mon partenaire
                   </button>
                 </div>

               </div>
             )}
          </div>
        )}

        {/* --- TAB 5: PROFIL --- */}
        {activeTab === 'profil' && (
          <div className="animate-in fade-in duration-500 p-6 mt-4">
            <h1 className="text-3xl font-black text-white mb-8">Mon Espace</h1>
            
            <div className="flex flex-col items-center mb-10 relative">
               <div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-900 mb-4 overflow-hidden shadow-xl relative group cursor-pointer"
                    onClick={() => {
                      setProfileForm({ pseudo: userData?.pseudo || '', bio: userData?.bio || '', avatarUrl: userData?.avatarUrl || '' });
                      setIsEditingProfile(true);
                    }}>
                  <img src={userData?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}&backgroundColor=1e293b`} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 size={24} className="text-white" />
                  </div>
               </div>
               <h2 className="text-2xl font-black text-white mb-2">{userData?.pseudo || 'Anonyme'}</h2>
               <p className="text-slate-400 text-sm text-center max-w-xs">{userData?.bio || 'Explorateur de sensations...'}</p>
               
               <div className="flex flex-col w-full max-w-xs items-center gap-3 mt-6">
                 <button 
                   onClick={() => {
                     setProfileForm({ pseudo: userData?.pseudo || '', bio: userData?.bio || '', avatarUrl: userData?.avatarUrl || '' });
                     setIsEditingProfile(true);
                   }}
                   className="flex items-center justify-center gap-2 bg-slate-800 text-white px-5 py-3 rounded-full text-xs font-black transition border border-slate-700 hover:bg-slate-700 w-full"
                 >
                   <Edit2 size={14} /> Modifier mon profil
                 </button>

                 {/* NOUVEAU: BOUTON DEMANDE NOTIFICATIONS */}
                 <button 
                   onClick={requestNotificationPermission}
                   className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-black transition border shadow-lg w-full mt-2 ${notificationsEnabled ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-600/40' : 'bg-rose-600/20 text-rose-400 border-rose-500/50 hover:bg-rose-600/40'}`}
                 >
                   <BellRing size={14} /> 
                   {notificationsEnabled ? 'Notifications Activées' : 'Autoriser les notifications'}
                 </button>

                 {/* BOUTON INSTALLATION */}
                 <button 
                   onClick={() => setShowInstallTutorial(true)}
                   className="flex items-center justify-center gap-2 bg-indigo-600/20 text-indigo-400 px-5 py-3 rounded-full text-xs font-black transition border border-indigo-500/50 hover:bg-indigo-600/40 shadow-lg w-full"
                 >
                   <Smartphone size={14} /> Ajouter à l'écran d'accueil
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
                <Heart className="mx-auto text-rose-500 mb-2" size={24} />
                <div className="text-2xl font-black text-white">{userData?.likes?.length || 0}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Favoris</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center cursor-pointer hover:bg-slate-800 transition relative overflow-hidden group" onClick={() => {
                  setNewPos({ name: '', cat: 'Face à face', newCat: '', desc: '', v: '', diff: 3, spice: 3, shared: true });
                  setEditPosId(null);
                  setIsCreating(true);
              }}>
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={16} className="text-emerald-500"/>
                </div>
                <Plus className="mx-auto text-emerald-500 mb-2" size={24} />
                <div className="text-2xl font-black text-white">{myCustomPositions.length}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mes Créations</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- BOTTOM NAV (Avec Safe Area d'iOS) --- */}
      <nav 
        className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-2 flex justify-between items-center z-40"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)', paddingTop: '0.75rem' }}
      >
        <button onClick={() => {setActiveTab('explorer'); setActiveGame(null);}} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === 'explorer' ? 'text-rose-500 scale-110' : 'text-slate-500'}`}><Compass size={22}/><span className="text-[8px] font-black uppercase">Catalogue</span></button>
        <button onClick={() => {setActiveTab('jeux'); setActiveGame(null);}} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === 'jeux' ? 'text-purple-500 scale-110' : 'text-slate-500'}`}><Gamepad2 size={24}/><span className="text-[8px] font-black uppercase">Jeux</span></button>
        <button onClick={() => {setActiveTab('conseils'); setActiveGame(null);}} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === 'conseils' ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}><BookOpen size={22}/><span className="text-[8px] font-black uppercase">Guide</span></button>
        <button onClick={() => {setActiveTab('duo'); setActiveGame(null);}} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === 'duo' ? 'text-emerald-400 scale-110' : 'text-slate-500'}`}><Users size={22}/><span className="text-[8px] font-black uppercase">Duo</span></button>
        <button onClick={() => {setActiveTab('profil'); setActiveGame(null);}} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === 'profil' ? 'text-white scale-110' : 'text-slate-500'}`}><User size={22}/><span className="text-[8px] font-black uppercase">Moi</span></button>
      </nav>

      {/* --- MODALS --- */}

      {/* NOUVEAU: MODAL DU CHAT */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col animate-in slide-in-from-right duration-300">
          <header className="px-6 flex items-center justify-between border-b border-white/5 bg-slate-950/90 backdrop-blur-xl z-10 shrink-0" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.25rem)', paddingBottom: '1.25rem' }}>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 p-2 bg-slate-900 rounded-full hover:text-white"><ArrowLeft size={20}/></button>
            <div className="flex flex-col items-center">
              <h2 className="font-black text-white tracking-tight flex items-center gap-2">
                {partnerData?.pseudo || 'Partenaire'}
              </h2>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Connexion sécurisée</span>
            </div>
            <div className="w-10"></div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-4 flex flex-col bg-slate-950" style={{ WebkitOverflowScrolling: 'touch' }}>
            {messages.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm space-y-4 opacity-50">
                  <MessageSquare size={48} className="text-slate-700" />
                  <p>Envoyez votre premier message...</p>
               </div>
            ) : (
               messages.map((msg, i) => {
                 const isMe = msg.uid === user?.uid;
                 return (
                   <div key={msg.id || i} className={`max-w-[80%] flex ${isMe ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
                     <div className={`px-4 py-3 text-sm ${isMe ? 'bg-rose-600 text-white rounded-l-2xl rounded-tr-2xl' : 'bg-slate-800 text-slate-200 rounded-r-2xl rounded-tl-2xl'}`}>
                       {msg.text}
                     </div>
                   </div>
                 );
               })
            )}
            {/* Élément invisible pour forcer le scroll vers le bas */}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900 shrink-0 flex gap-2 items-end" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
             <textarea 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrire un message secret..."
                className="flex-1 bg-slate-900 border border-slate-800 text-white p-3 rounded-2xl outline-none text-base resize-none max-h-32 min-h-[50px] custom-scroll"
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
             />
             <button type="submit" disabled={!newMessage.trim()} className="bg-rose-600 p-3.5 rounded-2xl text-white disabled:opacity-50 disabled:bg-slate-800 transition-colors shrink-0">
               <Send size={20} className={newMessage.trim() ? 'translate-x-0.5' : ''} />
             </button>
          </form>
        </div>
      )}

      {/* MODAL EDITION PROFIL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <header className="px-6 flex items-center justify-between" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.25rem)', paddingBottom: '1.25rem' }}>
            <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 bg-slate-900 p-2 rounded-full"><ArrowLeft size={20}/></button>
            <h2 className="font-black text-white tracking-tight">Profil</h2>
            <div className="w-9"/>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scroll" style={{ WebkitOverflowScrolling: 'touch', paddingBottom: 'calc(env(safe-area-inset-bottom) + 100px)' }}>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
                  <img src={profileForm.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button onClick={generateNewAvatar} className="absolute bottom-0 right-0 bg-rose-600 text-white p-2 rounded-full shadow-lg border-2 border-slate-950 hover:scale-110 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <span className="text-xs text-slate-400 font-medium">Avatar aléatoire</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Pseudo</label>
                <input 
                  className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 p-4 rounded-xl outline-none text-white text-base" 
                  placeholder="Votre pseudonyme" value={profileForm.pseudo} onChange={(e) => setProfileForm({...profileForm, pseudo: e.target.value})} maxLength={20}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Biographie</label>
                <textarea 
                  className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 p-4 rounded-xl outline-none h-32 text-base leading-relaxed text-slate-300 resize-none" 
                  placeholder="Dites-en plus sur vous..." value={profileForm.bio} onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})} maxLength={150}
                />
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-950 border-t border-slate-900" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}>
            <button onClick={handleSaveProfile} className="w-full bg-rose-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 active:scale-95 transition">Enregistrer</button>
          </div>
        </div>
      )}

      {/* MODAL POSITION DETAILS */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="relative pb-8 px-6 bg-gradient-to-b from-rose-950/40 to-slate-950 shrink-0" style={{ paddingTop: 'max(env(safe-area-inset-top), 3rem)' }}>
            <button onClick={() => {setSelectedPosition(null); setShowDeleteConfirm(false);}} className="absolute left-6 text-slate-400 bg-slate-900/50 p-2 rounded-full backdrop-blur-md hover:bg-slate-800 transition" style={{ top: 'max(env(safe-area-inset-top), 1.5rem)' }}><ArrowLeft size={20}/></button>
            
            {/* BOUTONS ACTIONS POUR SES PROPRES CRÉATIONS */}
            {selectedPosition.isMine && (
              <div className="absolute right-6 flex gap-2" style={{ top: 'max(env(safe-area-inset-top), 1.5rem)' }}>
                 <button onClick={() => handleOpenEdit(selectedPosition)} className="text-indigo-400 bg-indigo-900/40 p-2 rounded-full backdrop-blur-md border border-indigo-500/20 hover:bg-indigo-900/60 transition"><Edit3 size={18}/></button>
                 <button onClick={() => setShowDeleteConfirm(true)} className="text-rose-400 bg-rose-900/40 p-2 rounded-full backdrop-blur-md border border-rose-500/20 hover:bg-rose-900/60 transition"><Trash2 size={18}/></button>
              </div>
            )}

            <div className="text-center mt-6">
              <span className="inline-block px-3 py-1 bg-slate-900 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-500/20 mb-3">{selectedPosition.cat}</span>
              <h2 className="text-3xl font-black text-white leading-tight">{discreetMode ? "Masqué" : selectedPosition.name}</h2>
              {selectedPosition.isPartner && <div className="mt-2 text-xs text-emerald-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1"><Users size={12}/> Création de {partnerData?.pseudo || 'votre partenaire'}</div>}
              {selectedPosition.isMine && selectedPosition.shared === false && <div className="mt-2 text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1"><EyeOff size={12}/> Privé (non partagé)</div>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 custom-scroll" style={{ WebkitOverflowScrolling: 'touch', paddingBottom: '20px' }}>
            
            {showDeleteConfirm && (
              <div className="bg-rose-900/20 border border-rose-500/30 rounded-3xl p-6 mb-6 text-center animate-in zoom-in">
                <h3 className="text-white font-bold mb-4">Êtes-vous sûr de vouloir supprimer cette création ?</h3>
                <div className="flex gap-2">
                  <button onClick={handleDeletePosition} className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold">Oui, Supprimer</button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold">Annuler</button>
                </div>
              </div>
            )}

            <div className={`space-y-6 ${discreetMode ? 'blur-md opacity-50 select-none' : ''}`}>
               <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                  <Info className="absolute -top-4 -right-4 text-white/5" size={120} />
                  <h4 className="text-rose-400 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                     <Sparkles size={14}/> La Posture
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed relative z-10 whitespace-pre-line">{applyDiscreet(selectedPosition.desc)}</p>
               </div>

               {selectedPosition.v && (
                 <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-3xl p-6">
                    <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                       <RefreshCw size={14}/> Variante & Astuce
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{applyDiscreet(selectedPosition.v)}</p>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 text-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Physique</span>
                <div className="flex justify-center gap-1.5">{[...Array(5)].map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i < selectedPosition.diff ? 'bg-indigo-500' : 'bg-slate-800'}`}/>)}</div>
              </div>
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 text-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Intensité</span>
                <div className="flex justify-center gap-1.5">{[...Array(5)].map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i < selectedPosition.spice ? 'bg-rose-500' : 'bg-slate-800'}`}/>)}</div>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-950 border-t border-slate-900 shrink-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}>
            <button onClick={() => handleLike(selectedPosition.id)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${userData?.likes?.includes(selectedPosition.id) ? 'bg-slate-800 text-rose-500' : 'bg-rose-600 text-white'}`}>
              <Heart fill={userData?.likes?.includes(selectedPosition.id) ? "currentColor" : "none"} size={18} />
              {userData?.likes?.includes(selectedPosition.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL CREATION & EDITION */}
      {isCreating && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <header className="px-6 flex items-center justify-between" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.25rem)', paddingBottom: '1.25rem' }}>
            <button onClick={() => {setIsCreating(false); setEditPosId(null);}} className="text-slate-400 bg-slate-900 p-2 rounded-full hover:text-white transition"><ArrowLeft size={20}/></button>
            <h2 className="font-black text-white">{editPosId ? 'Modifier' : 'Créer'}</h2>
            <div className="w-9"/>
          </header>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll" style={{ WebkitOverflowScrolling: 'touch', paddingBottom: '20px' }}>
            
            {/* BOUTON DE PARTAGE (PRIVÉ VS PARTENAIRE) */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
               <div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Visibilité</span>
                 <span className={`text-sm font-bold ${newPos.shared ? 'text-emerald-400' : 'text-slate-400'}`}>
                   {newPos.shared ? 'Partagée avec mon partenaire' : 'Privée (Moi uniquement)'}
                 </span>
               </div>
               <button 
                 onClick={() => setNewPos({...newPos, shared: !newPos.shared})} 
                 className={`w-14 h-8 rounded-full relative transition-colors ${newPos.shared ? 'bg-emerald-500' : 'bg-slate-700'}`}
               >
                 <div className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform ${newPos.shared ? 'translate-x-7' : 'translate-x-1'}`}/>
               </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nom de la position</label>
              <input className="w-full bg-slate-900 border border-slate-800 focus:border-rose
