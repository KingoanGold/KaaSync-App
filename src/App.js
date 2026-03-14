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

// --- DONNÉES : CONSEILS ET ARTICLES ---
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

// --- DONNÉES : POSITIONS (115+) ---
const POSITIONS_DATA = [
  { n: "Le Missionnaire (L'indémodable)", c: "Face à face", d: 1, s: 1, desc: "Le partenaire A s'allonge sur le dos, les jambes légèrement écartées. Le partenaire B se place au-dessus en appui sur les mains ou les avant-bras. Leurs bassins s'emboîtent parfaitement, favorisant l'intimité et les baisers.", v: "Variante : Le partenaire A referme complètement ses jambes autour de celles du partenaire B pour augmenter les frictions." },
  { n: "Le Missionnaire surélevé", c: "Face à face", d: 2, s: 2, desc: "Position classique du missionnaire, mais les jambes du partenaire allongé reposent sur les épaules de celui qui est au-dessus. Cela ouvre grand le bassin et permet une pénétration bien plus profonde.", v: "Variante : Glissez un gros coussin sous les fesses du partenaire allongé pour basculer le bassin et cibler la paroi antérieure." },
  { n: "L'Enclume", c: "Face à face", d: 3, s: 4, desc: "Le partenaire allongé sur le dos bascule son bassin vers le haut et replie ses genoux près de ses propres oreilles. L'autre partenaire se place à genoux face à lui pour un angle d'entrée très plongeant.", v: "Variante : Le partenaire du dessus peut attraper les chevilles du receveur pour guider le rythme." },
  { n: "Le Coquillage", c: "Face à face", d: 3, s: 3, desc: "Le partenaire allongé replie ses cuisses serrées contre son propre buste. Le partenaire actif se penche en avant en l'enveloppant de tout son corps, créant une bulle intime et étroite.", v: "Variante : Maintenez un contact visuel ininterrompu à quelques centimètres du visage." },
  { n: "La Fleur de Lotus", c: "Face à face", d: 3, s: 3, desc: "Les deux partenaires sont assis face à face, le partenaire B s'asseyant sur les genoux du partenaire A en enroulant ses jambes derrière son dos. Idéal pour des mouvements lents de balancier.", v: "Variante : Synchronisez votre respiration en collant vos fronts l'un contre l'autre." },
  { n: "Le Papillon", c: "Face à face", d: 3, s: 4, desc: "Le partenaire A s'allonge au bord du lit, les fesses au bord du vide, jambes écartées. Le partenaire B se tient debout devant, profitant d'un effet de levier idéal.", v: "Variante : Le partenaire debout peut glisser ses mains sous les hanches du partenaire allongé pour le surélever à chaque mouvement." },
  { n: "L'Araignée", c: "Face à face", d: 4, s: 4, desc: "Les deux partenaires sont assis face à face, en appui arrière sur leurs mains et leurs pieds. Leurs bassins se rejoignent au centre en lévitation.", v: "Variante : Alternez les mouvements d'avant en arrière comme une danse asymétrique." },
  { n: "Le Missionnaire inversé", c: "Face à face", d: 2, s: 3, desc: "Similaire au missionnaire, mais c'est le partenaire du dessus qui garde les jambes serrées à l'intérieur de celles du partenaire allongé. Modifie complètement les points de pression.", v: "Variante : Le partenaire du dessus allonge tout son poids pour un contact peau à peau intégral." },
  { n: "Le Wrap", c: "Face à face", d: 2, s: 3, desc: "Pendant un missionnaire classique, le partenaire allongé croise fermement ses chevilles dans le bas du dos du partenaire actif, le verrouillant contre lui.", v: "Variante : Serrez ou desserrez l'étreinte des jambes pour contrôler vous-même la profondeur." },
  { n: "La Montagne Magique", c: "Face à face", d: 2, s: 2, desc: "Missionnaire où le partenaire allongé plie les genoux et pose ses pieds à plat sur le matelas, formant un pont. L'angle d'entrée devient légèrement ascendant.", v: "Variante : Le partenaire allongé pousse sur ses talons pour faire décoller son bassin à chaque va-et-vient." },
  { n: "L'Étreinte du Panda", c: "Face à face", d: 2, s: 2, desc: "Assis confortablement face à face on un grand canapé, le partenaire B blotti dans les bras du partenaire A, jambes de chaque côté des hanches.", v: "Variante : Mouvements circulaires du bassin très lents, axés sur la tendresse." },
  { n: "L'Araignée Inversée", c: "Face à face", d: 4, s: 4, desc: "Assis face à face, les jambes de l'un passent sous les aisselles de l'autre. Une géométrie complexe qui stimule de nouvelles zones.", v: "Variante : L'un des partenaires s'allonge doucement en arrière tout en gardant l'emboîtement." },
  { n: "La Levrette classique", c: "Par derrière", d: 2, s: 4, desc: "Le receveur se place à quatre pattes, dos cambré. Le partenaire se positionne derrière lui à genoux. Offre une pénétration très profonde et stimule l'instinct primal.", v: "Variante : Le partenaire arrière attrape les hanches pour guider l'impact." },
  { n: "La Levrette plate", c: "Par derrière", d: 1, s: 3, desc: "Le partenaire A s'allonge complètement on le ventre, jambes légèrement écartées. Le partenaire B s'allonge de tout son long par-dessus lui. Fortes frictions clitoridiennes/pubiennes.", v: "Variante : Glissez un petit coussin plat sous le bassin du partenaire allongé on le ventre." },
  { n: "Le Chien de chasse", c: "Par derrière", d: 3, s: 4, desc: "En position de levrette, le receveur tend l'une de ses jambes vers l'arrière, entre les jambes du partenaire actif. L'angle devient asymétrique et très stimulant.", v: "Variante : Tendez la jambe vers le plafond plutôt que vers l'arrière." },
  { n: "Le Sphinx", c: "Par derrière", d: 2, s: 3, desc: "Une levrette où le receveur descend son torse pour s'appuyer on ses avant-bras, les fesses bien en l'air, réduisant la fatigue des poignets.", v: "Variante : Le receveur peut coller sa poitrine au matelas pour cambrer encore plus le dos." },
  { n: "La Grenouille", c: "Par derrière", d: 2, s: 4, desc: "Positionnée à plat ventre, la personne réceptrice écarte les genoux au maximum vers l'extérieur (façon grenouille). Le partenaire s'installe au milieu.", v: "Variante : Pressez légèrement l'intérieur des cuisses du receveur pour augmenter les sensations." },
  { n: "Le Toboggan", c: "Par derrière", d: 3, s: 4, desc: "Le receveur est à genoux mais redresse complètement son buste à la verticale, cambrant le bas du dos en arrière vers le partenaire.", v: "Variante : Le partenaire arrière entoure le buste du receveur de ses bras pour caresser son torse." },
  { n: "La Levrette debout", c: "Par derrière", d: 4, s: 5, desc: "Le partenaire A se tient debout, penché en avant on appui on un mur ou une table. Le partenaire B se place debout derrière lui.", v: "Variante : Le receveur garde les jambes bien droites pour étirer les ischio-jambiers et resserrer l'entrée." },
  { n: "La Levrette au bord du lit", c: "Par derrière", d: 2, s: 4, desc: "Le receveur est à quatre pattes on le matelas, face au mur. Le partenaire se tient debout on le sol, derrière lui, à hauteur idéale.", v: "Variante : Le partenaire debout maintient les cuisses du receveur pour contrôler l'intensité." },
  { n: "Le Lazy Dog", c: "Par derrière", d: 1, s: 2, desc: "Une levrette sans effort : le partenaire arrière s'affale littéralement on le dos du receveur, lui faisant supporter une douce pression de son poids.", v: "Variante : Le partenaire arrière glisse ses mains sous le ventre du receveur pour le soutenir." },
  { n: "La Levrette croisée", c: "Par derrière", d: 3, s: 4, desc: "À quatre pattes, le receveur croise fortement ses cuisses/chevilles l'une on l'autre, créant un canal extrêmement étroit et intense pour l'actif.", v: "Variante : Alternez croisement des jambes gauche/droite toutes les minutes." },
  { n: "La Luge", c: "Par derrière", d: 3, s: 3, desc: "Le receveur est allongé on le ventre. Le partenaire actif s'assoit à califourchon au-dessus de ses cuisses, entrant par un angle plongeant.", v: "Variante : Le partenaire assis se penche en avant pour masser les épaules du receveur." },
  { n: "L'Andromaque", c: "Au-dessus", d: 2, s: 3, desc: "Le partenaire A est allongé on le dos. Le partenaire B s'assoit à califourchon face à lui, genoux posés on le matelas. B contrôle totalement l'intensité et la profondeur.", v: "Variante : Le partenaire du dessus peut se pencher en avant et s'appuyer on le torse de l'autre." },
  { n: "L'Andromaque inversée", c: "Au-dessus", d: 3, s: 4, desc: "Le partenaire du dessus s'assoit à califourchon, mais tourne le dos au partenaire allongé. Le visuel on le dos et les fesses est très stimulant pour le partenaire allongé.", v: "Variante : Le partenaire allongé caresse le ventre et les cuisses du partenaire qui le chevauche." },
  { n: "La Cow-girl rodéo", c: "Au-dessus", d: 3, s: 4, desc: "En position d'Andromaque, le partenaire du dessus effectue des mouvements de rotation circulaire du bassin au lieu de simples va-et-vient.", v: "Variante : Alternez entre rotations lentes et mouvements de haut en bas très rapides." },
  { n: "L'Amazone accroupie", c: "Au-dessus", d: 4, s: 5, desc: "Le partenaire du dessus ne pose pas les genoux, mais s'accroupit on appui on ses plantes de pieds, bondissant grâce à la force de ses cuisses.", v: "Variante : Le partenaire allongé saisit les hanches de l'Amazone pour l'aider à rebondir." },
  { n: "La Cavalière de l'espace", c: "Au-dessus", d: 3, s: 3, desc: "En Andromaque, le partenaire du dessus se penche complètement en arrière jusqu'à poser ses mains (ou sa tête) on les genoux du partenaire allongé.", v: "Variante : Le partenaire allongé soulève son propre bassin pour rencontrer le mouvement descendant." },
  { n: "Le Bridge", c: "Au-dessus", d: 4, s: 4, desc: "Le partenaire du dessus se positionne en forme de pont (mains et pieds au sol) au-dessus du partenaire allongé, nécessitant une grande force musculaire.", v: "Variante : Rapprochez vos mains de vos pieds pour accentuer la courbure du dos." },
  { n: "La Chaise à bascule", c: "Au-dessus", d: 2, s: 2, desc: "En position d'Andromaque, les mouvements ne sont pas de haut en bas, mais d'avant en arrière, dans un glissement continu très doux.", v: "Variante : Maintenez les épaules de votre partenaire pour stabiliser le mouvement de balancier." },
  { n: "Le Rodéo inversé", c: "Au-dessus", d: 4, s: 5, desc: "Andromaque inversée, mais le partenaire du dessus se penche en avant jusqu'à attraper les mollets du partenaire allongé, offrant un angle très plongeant.", v: "Variante : Le partenaire allongé plie légèrement les genoux pour offrir de meilleures prises." },
  { n: "La Sirène", c: "Au-dessus", d: 2, s: 3, desc: "Le partenaire B chevauche le partenaire A, mais garde ses propres jambes serrées et allongées on le côté (en amazone). Les frictions sont très localisées.", v: "Variante : Le partenaire A utilise ses cuisses pour frotter l'extérieur des jambes de la sirène." },
  { n: "La Monteuse", c: "Au-dessus", d: 3, s: 4, desc: "Le partenaire allongé garde les genoux repliés on son propre torse. L'autre le chevauche, s'asseyant pratiquement en l'air, maintenu par les jambes du receveur.", v: "Variante : Le receveur croise ses chevilles derrière le dos du partenaire supérieur." },
  { n: "L'Arc de Triomphe", c: "Au-dessus", d: 4, s: 5, desc: "Le partenaire allongé fait un pont complet avec son corps. L'autre le chevauche en équilibre précaire. Une prouesse physique intense.", v: "Variante : Utilisez un gros traversin on les lombaires pour soutenir le pont sans fatigue." },
  { n: "La Cuillère", c: "De côté", d: 1, s: 2, desc: "Les deux partenaires sont allongés on le flanc, emboîtés l'un dans l'autre (en cuillère). Position très reposante, idéale pour de longs câlins sensuels.", v: "Variante : Le partenaire arrière glisse un bras sous la nuque du receveur pour caresser son torse." },
  { n: "La Cuillère inversée", c: "De côté", d: 1, s: 2, desc: "Les partenaires sont allongés on le flanc mais se font face. La pénétration demande de décaler légèrement les bassins, parfait pour les baisers langoureux.", v: "Variante : Entremêlez une seule jambe pour stabiliser les bassins." },
  { n: "Les Ciseaux", c: "De côté", d: 2, s: 3, desc: "Allongés on le flanc en se faisant face, les partenaires entrelacent leurs jambes en forme de X. Les frottements sont très intenses on les zones érogènes externes.", v: "Variante : Gardez les torses éloignés et ne connectez que vos bassins." },
  { n: "Le 69 latéral", c: "De côté", d: 2, s: 4, desc: "Position tête-bêche pour le sexe oral, mais allongés on le côté (en cuillère inversée). Moins fatigant que le 69 classique.", v: "Variante : Pliez les genoux pour vous rapprocher au maximum de votre partenaire." },
  { n: "Le Tire-bouchon", c: "De côté", d: 3, s: 4, desc: "Le partenaire A est allongé on le dos, tandis que le partenaire B s'allonge perpendiculairement on le côté, une jambe par-dessus le torse de A.", v: "Variante : Le partenaire A utilise ses mains pour tirer les hanches de B vers lui à chaque mouvement." },
  { n: "L'Étau", c: "De côté", d: 2, s: 3, desc: "En cuillère, le partenaire arrière verrouille fermement ses deux jambes autour de la jambe inférieure du partenaire avant.", v: "Variante : Le receveur pousse vers l'arrière à chaque mouvement pour contrer la poussée." },
  { n: "La Cuillère surélevée", c: "De côté", d: 2, s: 3, desc: "En cuillère classique, le partenaire receveur lève sa jambe supérieure (celle du dessus) vers le plafond pour ouvrir largement l'accès.", v: "Variante : Le partenaire arrière attrape cette jambe levée pour stabiliser la position." },
  { n: "Le V incliné", c: "De côté", d: 3, s: 3, desc: "Les deux partenaires sont on le flanc, mais leurs bustes s'éloignent pour former un V, seuls leurs bassins restent connectés au centre.", v: "Variante : Le partenaire avant regarde par-dessus son épaule pour maintenir le contact visuel." },
  { n: "Le Croissant de lune", c: "De côté", d: 2, s: 2, desc: "Une cuillère où les deux partenaires courbent fortement leur dos et rentrent la tête pour former un cocon en arc de cercle.", v: "Variante : Le partenaire arrière masse la nuque du partenaire avant avec des mouvements lents." },
  { n: "Le Noeud amoureux", c: "De côté", d: 3, s: 3, desc: "Face à face on le côté, chaque partenaire enlace ses jambes autour des cuisses de l'autre. Une véritable fusion des corps difficile à dénouer.", v: "Variante : Balancez doucement vos corps d'avant en arrière de façon synchronisée." },
  { n: "L'Étoile Filante", c: "De côté", d: 2, s: 3, desc: "Le partenaire A est on le dos. Le partenaire B est allongé on le côté, formant un T parfait avec le corps de A.", v: "Variante : B glisse une main sous le creux des reins de A pour créer une légère cambrure." },
  { n: "Le Poteau", c: "Debout & Acrobatique", d: 4, s: 4, desc: "Le receveur se tient debout, le dos fermement plaqué contre un mur. Le partenaire actif se tient debout face à lui pour la pénétration.", v: "Variante : Le receveur lève une jambe et l'enroule autour de la hanche du partenaire." },
  { n: "L'Ascenseur", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Le partenaire debout porte entièrement l'autre partenaire. Le porté enroule ses jambes autour de la taille du porteur et s'agrippe à son cou.", v: "Variante : Le porteur peut s'adosser à un mur pour soulager le poids on son dos." },
  { n: "Le Rocking-chair", c: "Debout & Acrobatique", d: 3, s: 3, desc: "Le partenaire actif est assis on une chaise solide. Le receveur s'assoit à califourchon face à lui. Mouvements de va-et-vient horizontaux.", v: "Variante : Le receveur pose ses pieds à plat on l'assise pour rebondir." },
  { n: "La Balançoire", c: "Debout & Acrobatique", d: 4, s: 4, desc: "Le receveur s'assoit on un meuble haut (machine à laver, commode). Le partenaire se tient debout entre ses jambes écartées.", v: "Variante : Le receveur s'allonge en arrière on le meuble, la tête dans le vide." },
  { n: "Le Stand and Deliver", c: "Debout & Acrobatique", d: 3, s: 4, desc: "Le receveur s'allonge on une table solide, les fesses au ras du bord. Le partenaire actif est debout on le sol.", v: "Variante : Le partenaire debout soulève les jambes du receveur et les pose on ses épaules." },
  { n: "La Danse du ventre", c: "Debout & Acrobatique", d: 4, s: 3, desc: "Les deux partenaires sont debout face à face au milieu de la pièce, genoux légèrement fléchis pour s'aligner, et ondulent leur bassin.", v: "Variante : Agrippez-vous par les épaules et tournez lentement on vous-mêmes." },
  { n: "Le T de la victoire", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Le porteur tient le receveur par les hanches. Le receveur est à l'horizontale, formant un T avec le corps du porteur.", v: "Variante : Le receveur s'aide en prenant appui on le mur avec ses bras." },
  { n: "Le X debout", c: "Debout & Acrobatique", d: 4, s: 4, desc: "Le receveur est de dos contre le mur, bras et jambes grands écartés (en X). L'actif vient s'emboîter au centre de l'étoile.", v: "Variante : L'actif maintient les poignets du receveur plaqués contre le mur." },
  { n: "Le Saut de l'ange", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Une fois porté (comme dans l'Ascenseur), le receveur cambre violemment le dos en arrière, la tête vers le sol, s'abandonnant totalement.", v: "Variante : Le porteur soutient fermement le bas du dos du receveur d'une main." },
  { n: "Le Porté en berceau", c: "Debout & Acrobatique", d: 5, s: 4, desc: "Le porteur soulève son partenaire en le portant dans ses bras (une main dans le dos, l'autre sous les genoux), à l'horizontale.", v: "Variante : Marchez très lentement dans la pièce pendant l'acte." },
  { n: "La Brouette", c: "Debout & Acrobatique", d: 5, s: 5, desc: "Le receveur est on appui on ses mains au sol. Le partenaire debout derrière lui attrape ses chevilles et les soulève au niveau de ses hanches.", v: "Variante : Placez des coussins sous les poignets du receveur pour plus de confort." },
  { n: "Le Fauteuil de bureau", c: "Sur Mobilier", d: 2, s: 3, desc: "L'actif s'assoit on un fauteuil à roulettes. Le receveur le chevauche. Profitez du rebond et de la rotation du siège.", v: "Variante : Le receveur pousse avec ses pieds on le sol pour faire tourner le fauteuil." },
  { n: "L'Accoudoir", c: "Sur Mobilier", d: 3, s: 4, desc: "Le receveur s'allonge on le dos en plaçant son bassin pile on l'accoudoir du canapé pour être surélevé. L'actif est à genoux par terre.", v: "Variante : Le receveur laisse tomber sa tête en arrière vers les coussins de l'assise." },
  { n: "La Table de cuisine", c: "Sur Mobilier", d: 2, s: 4, desc: "Le grand classique cinématographique : l'un est assis au bord d'une table solide, l'autre debout face à lui pour un accès direct.", v: "Variante : Dégagez tout ce qu'il y a on la table d'un grand revers de bras (pour le style)." },
  { n: "Le Tabouret de bar", c: "Sur Mobilier", d: 3, s: 3, desc: "L'un est perché on un tabouret haut, l'autre se place debout face à lui. Le dénivelé naturel facilite l'alignement des bassins.", v: "Variante : Le partenaire debout se glisse entre les jambes écartées de la personne assise." },
  { n: "Le Bureau", c: "Sur Mobilier", d: 3, s: 4, desc: "Le receveur se penche en avant, le ventre et la poitrine reposant on un bureau dégagé. Le partenaire entre par derrière en restant debout.", v: "Variante : Le receveur s'agrippe fermement aux rebords du bureau pour encaisser la poussée." },
  { n: "Le Canapé profond", c: "Sur Mobilier", d: 2, s: 2, desc: "Les partenaires s'allongent en angle droit, suivant la forme en L d'un canapé d'angle. L'un est on le dossier, l'autre on la méridienne.", v: "Variante : Utilisez les accoudoirs comme repose-pieds pour surélever les jambes." },
  { n: "Le Repose-pieds", c: "Sur Mobilier", d: 3, s: 3, desc: "Placez un pouf ou un repose-pieds sous le bassin du receveur allongé on le sol. L'actif se place à genoux devant lui.", v: "Variante : Le receveur laisse ses épaules toucher le sol pour une cambrure inversée intense." },
  { n: "L'Escalier", c: "Sur Mobilier", d: 4, s: 5, desc: "Exploitez les marches ! Le receveur est à quatre pattes on une marche supérieure, l'actif debout ou à genoux deux marches plus bas.", v: "Variante : Le receveur s'allonge on le dos, la tête vers le bas de l'escalier." },
  { n: "La Chaise longue", c: "Sur Mobilier", d: 2, s: 3, desc: "Idéal en été, l'inclinaison de la chaise longue offre un angle parfait pour un missionnaire reposant où l'actif reste à genoux au sol.", v: "Variante : L'actif passe ses bras sous le transat pour étreindre fermement le receveur." },
  { n: "Le Lit à baldaquin", c: "Sur Mobilier", d: 3, s: 4, desc: "Le receveur s'agrippe aux montants verticaux du lit pour ouvrir son corps ou gagner en puissance de contre-poussée.", v: "Variante : Utilisez des attaches en soie on les montants pour lier doucement les poignets." },
  { n: "La balade en forêt", c: "Sur Mobilier", d: 3, s: 4, desc: "Le receveur est perché on un rebord de fenêtre large ou un long comptoir de cuisine, l'actif debout devant lui.", v: "Variante : Le receveur s'appuie contre la vitre froide pour un frisson supplémentaire." },
  { n: "Le Plongeoir", c: "Sur Mobilier", d: 4, s: 4, desc: "L'actif se tient debout on le sol, au ras du lit. Le receveur est allongé à plat ventre on le lit, les hanches juste au bord du matelas.", v: "Variante : L'actif soulève les jambes du receveur pour les coincer sous ses propres bras." },
  { n: "Le 69 Classique", c: "Oral & Préliminaires", d: 2, s: 5, desc: "Les partenaires sont allongés tête-bêche (la tête de l'un au niveau du bassin de l'autre), l'un on le dos, l'autre par-dessus.", v: "Variante : Synchronisez vos mouvements de langue pour atteindre le sommet on même temps." },
  { n: "Le 69 Inversé", c: "Oral & Préliminaires", d: 3, s: 5, desc: "Tête-bêche, mais le partenaire du dessus tourne le dos à celui du dessous (regardant ses pieds). Moins d'intimité visuelle, plus de concentration on la sensation.", v: "Variante : Le partenaire du dessus caresse ses propres cuisses pour stimuler visuellement l'autre." },
  { n: "Le 69 Debout", c: "Oral & Préliminaires", d: 5, s: 5, desc: "Le porteur est debout et maintient le receveur la tête en bas, le long de son corps. Très physique et vertigineux.", v: "Variante : Faites-le contre un mur pour aider le porteur à stabiliser le poids." },
  { n: "Le Lotus Oral", c: "Oral & Préliminaires", d: 3, s: 4, desc: "Le partenaire A est assis en tailleur. Le partenaire B s'agenouille devant lui et se penche en avant pour prodiguer le soin.", v: "Variante : Le partenaire A caresse délicatement les cheveux et la nuque de B." },
  { n: "Le 69 sur le côté", c: "Oral & Préliminaires", d: 2, s: 4, desc: "Position tête-bêche mais allongés on le côté. Une version très reposante du 69 classique qui permet de faire durer le plaisir sans fatigue musculaire.", v: "Variante : Pliez la jambe du dessus pour faciliter l'accès à votre partenaire." },
  { n: "La Cascade Orale", c: "Oral & Préliminaires", d: 3, s: 5, desc: "Le receveur est allongé on le lit, la tête pendante dans le vide au bord du matelas. L'actif se tient debout et se penche on lui.", v: "Variante : L'afflux sanguin vers la tête augmente la sensibilité du receveur, allez-y doucement." },
  { n: "Le Trône (sur chaise)", c: "Oral & Préliminaires", d: 1, s: 4, desc: "Le receveur s'installe comme un roi/une reine on un fauteuil. L'actif se met à genoux on le sol devant lui, dans une position de dévotion.", v: "Variante : Le receveur guide la tête de l'actif avec ses mains posées on ses oreilles." },
  { n: "Le Baiser Polaire", c: "Oral & Préliminaires", d: 1, s: 5, desc: "Le partenaire actif prend un glaçon dans sa bouche juste avant de commencer la stimulation orale. Contraste thermique explosif.", v: "Variante : Alternez entre le glaçon et des gorgées d'eau très chaude (thé) pour surprendre." },
  { n: "La Tête Bêche Assise", c: "Oral & Préliminaires", d: 3, s: 4, desc: "Les partenaires forment un 69 tout en étant assis en équilibre on leurs fesses, les torses inclinés vers l'avant.", v: "Variante : Utilisez vos bras libres pour soutenir le dos de l'autre et garder l'équilibre." },
  { n: "Le Plongeon", c: "Oral & Préliminaires", d: 2, s: 4, desc: "Le receveur est allongé à plat ventre on le lit. L'actif se place entre ses jambes par l'arrière pour une stimulation orale audacieuse.", v: "Variante : Le receveur peut écarter une jambe vers l'extérieur pour dégager davantage l'accès." },
  { n: "L'Oral en V", c: "Oral & Préliminaires", d: 2, s: 3, desc: "Le receveur est on le dos, épaules au sol, bassin en l'air avec les chevilles posées on les épaules de l'actif agenouillé.", v: "Variante : L'actif peut masser l'intérieur des cuisses du receveur on même temps." },
  { n: "La Soumission Douce", c: "Oral & Préliminaires", d: 2, s: 4, desc: "Le receveur est allongé on le dos, les poignets attachés au-dessus de sa tête avec une écharpe douce. Il laisse le partenaire actif prendre le contrôle total.", v: "Variante : Bandez également les yeux du receveur pour décupler son sens du toucher." },
  { n: "Le Face à Face Oral", c: "Oral & Préliminaires", d: 4, s: 5, desc: "L'un est assis on un meuble à hauteur de poitrine, l'autre se tient debout devant. Leurs visages sont presque à la même hauteur que le bassin.", v: "Variante : Maintenez un contact visuel brûlant sans cligner des yeux." },
  { n: "La Lèche-Vitrine", c: "Oral & Préliminaires", d: 2, s: 4, desc: "Pratiquez le sexe oral en positionnant le receveur debout ou assis directement face à un grand miroir, pour qu'il puisse regarder la scène.", v: "Variante : L'actif jette des regards vers le miroir pour observer les réactions de son partenaire." },
  { n: "L'Oral Croisé", c: "Oral & Préliminaires", d: 2, s: 3, desc: "Le receveur est allongé on le lit. L'actif s'allonge perpendiculairement à lui, le torse au niveau de son bassin.", v: "Variante : Le receveur utilise ses mains pour masser les épaules ou le dos de l'actif." },
  { n: "Le Souffle Chaud", c: "Oral & Préliminaires", d: 1, s: 3, desc: "Plutôt que d'utiliser la langue immédiatement, l'actif s'approche tout près et souffle de l'air chaud on la zone érogène pour créer l'anticipation.", v: "Variante : Alternez de très légers effleurements des lèvres avec des souffles profonds." },
  { n: "Le 69 Cambré", c: "Oral & Préliminaires", d: 4, s: 5, desc: "Dans un 69, le partenaire du dessous prend appui on sa nuque et ses talons pour lever très haut son bassin vers la bouche de l'autre.", v: "Variante : Le partenaire du dessus soutient le bassin soulevé pour éviter la fatigue lombaire." },
  { n: "Le Dégustateur", c: "Oral & Préliminaires", d: 1, s: 4, desc: "Le partenaire actif explore avec une lenteur extrême, refusant d'accélérer malgré les demandes, comme on déguste un grand cru.", v: "Variante : Utilisez uniquement le bout de la langue pendant les 5 premières minutes." },
  { n: "Le Coussin d'Amour", c: "Oral & Préliminaires", d: 1, s: 3, desc: "Le receveur est on le dos, avec 2 ou 3 gros oreillers glissés sous son bassin. L'élévation offre un accès direct et confortable pour l'actif à genoux.", v: "Variante : Le receveur laisse ses jambes retomber lourdement on les épaules de l'actif." },
  { n: "La Vue Plongeante", c: "Oral & Préliminaires", d: 2, s: 4, desc: "Le receveur se tient debout. L'actif est à genoux on le sol, regardant de bas en haut vers son partenaire.", v: "Variante : Le receveur caresse les cheveux de l'actif et dicte doucement le rythme." },
  { n: "L'Oral Suspendu", c: "Oral & Préliminaires", d: 3, s: 5, desc: "Le receveur s'allonge au bord du lit, la tête et les épaules dans le vide vers le sol. L'actif se place au-dessus pour un oral inversé vertigineux.", v: "Variante : L'actif peut masser doucement la gorge exposée du receveur." },
  { n: "Le 69 Diagonale", c: "Oral & Préliminaires", d: 2, s: 4, desc: "Plutôt que d'être parfaitement alignés, les partenaires forment un X (tête-bêche en diagonale) on un grand lit pour éviter de s'écraser.", v: "Variante : Calez vos têtes on des traversins pour éviter les torsions du cou." },
  { n: "Le Papillon Oral", c: "Oral & Préliminaires", d: 2, s: 4, desc: "Le receveur est on le dos, plie les genoux et laisse tomber ses cuisses de chaque côté (en losange). Grande ouverture et vulnérabilité.", v: "Variante : L'actif glisse ses mains sous les cuisses du receveur pour accentuer l'étirement." },
  { n: "La Dégustation aveugle", c: "Oral & Préliminaires", d: 1, s: 5, desc: "Le partenaire actif a les yeux bandés. Il doit se repérer uniquement au toucher et à l'odorat pour trouver sa cible.", v: "Variante : C'est le receveur qui guide doucement la tête de l'actif vers les bonnes zones." },
  { n: "Le Massage Préliminaire", c: "Oral & Préliminaires", d: 1, s: 3, desc: "Commencez par un massage complet du corps (dos, cuisses) avec de l'huile chauffante, en dérivant de plus en plus près de l'intimité sans y toucher, jusqu'à rendre l'autre fou.", v: "Variante : Utilisez la pulpe des doigts pour un toucher très léger, presque chatouilleux." },
  { n: "Le 69 Incliné", c: "Oral & Préliminaires", d: 3, s: 4, desc: "Réalisé on une chaise longue ou un fauteuil incliné. Le partenaire du dessous est adossé, l'autre par-dessus lui.", v: "Variante : Le partenaire du dessus peut se stabiliser en agrippant le dossier du fauteuil." },
  { n: "La Montée en Puissance", c: "Oral & Préliminaires", d: 1, s: 4, desc: "Un oral basé on le rythme : l'actif commence par des caresses imperceptibles pendant plusieurs minutes, avant d'augmenter brusquement la pression et la vitesse.", v: "Variante : Redescendez en intensité juste avant l'orgasme pour faire du 'edging'." },
  { n: "L'Étoile Orale", c: "Oral & Préliminaires", d: 2, s: 3, desc: "Le receveur s'étale de tout son long on le lit, bras et jambes ouverts en étoile de mer, s'abandonnant totalement aux soins de son partenaire.", v: "Variante : L'actif parcourt chaque branche de l'étoile avec des baisers avant d'atteindre le centre." },
  { n: "Le Pont Oral", c: "Oral & Préliminaires", d: 4, s: 5, desc: "Le receveur se met en position de pont de gymnastique. L'actif se glisse sous lui pour une exploration par en dessous. Très physique.", v: "Variante : Le receveur peut prendre appui on ses avant-bras plutôt que on ses poignets." },
  { n: "L'Éveil des Sens", c: "Oral & Préliminaires", d: 1, s: 4, desc: "Avant tout contact buccal, l'actif utilise des objets (plume, foulard en soie, glaçon) pour effleurer les zones intimes.", v: "Variante : Demandez au receveur de deviner quel objet est en train d'être utilisé." },
  { n: "Le Missionnaire Jambes fermées", c: "Angles & Tweaks", d: 1, s: 3, desc: "Au lieu d'écarter les jambes, le receveur les serre fermement l'une contre l'autre. Le partenaire actif les enjambe. Crée une sensation de friction intense.", v: "Variante : Le receveur peut enrouler une cheville autour de l'autre pour verrouiller ses jambes." },
  { n: "Le Missionnaire Jambes au ciel", c: "Angles & Tweaks", d: 2, s: 4, desc: "Le receveur garde les jambes parfaitement droites et tendues vers le plafond, posées contre le torse de l'actif. Réduit la longueur du canal vaginal/anal.", v: "Variante : L'actif pousse doucement les chevilles du receveur vers sa tête pour cambrer le bas du dos." },
  { n: "La Levrette Genoux surélevés", c: "Angles & Tweaks", d: 3, s: 4, desc: "Le receveur est à quatre pattes mais place ses genoux on une pile de coussins épais. Le dénivelé modifie radicalement l'angle d'impact.", v: "Variante : Écartez davantage les genoux on les coussins pour laisser l'actif s'enfoncer plus loin." },
  { n: "L'Andromaque Mains liées", c: "Angles & Tweaks", d: 2, s: 5, desc: "Le partenaire du dessus place volontairement ses mains derrière son dos (ou au-dessus de sa tête) et laisse le partenaire allongé guider ses hanches.", v: "Variante : Le partenaire allongé utilise une écharpe pour maintenir doucement les poignets de l'Andromaque." },
  { n: "Le G-Whiz", c: "Angles & Tweaks", d: 3, s: 5, desc: "Un missionnaire très replié où le receveur ramène ses genoux presque contre ses épaules, bassin très incliné. Réputé pour cibler précisément la zone antérieure (Point G).", v: "Variante : L'actif place ses bras sous les genoux du receveur pour maintenir fermement la position." },
  { n: "La Catherine", c: "Angles & Tweaks", d: 2, s: 4, desc: "Le receveur est on le dos. Une de ses jambes est allongée à plat, l'autre est levée et repose on l'épaule de l'actif. Une asymétrie très agréable.", v: "Variante : Alternez la jambe levée toutes les quelques minutes pour varier les sensations." },
  { n: "Le Triangle", c: "Angles & Tweaks", d: 3, s: 3, desc: "Le receveur est on le dos, le bassin onélevé par un coussin rigide, formant un triangle avec le lit. L'actif se place à genoux pour un angle d'entrée très droit.", v: "Variante : L'actif peut se redresser complètement on ses genoux pour un effet 'piston'." },
  { n: "L'Angle droit", c: "Angles & Tweaks", d: 2, s: 3, desc: "Le receveur on le dos replie ses genoux à 90 degrés et pose ses mollets on les épaules de l'actif, formant un angle droit parfait.", v: "Variante : L'actif masse les mollets de son partenaire pendant l'action." },
  { n: "La Compression", c: "Angles & Tweaks", d: 3, s: 4, desc: "Quelle que soit la position, le receveur contracte fortement ses muscles pelviens et serre ses cuisses pour créer une sensation d'étreinte maximale.", v: "Variante : Rythmez les contractions pelviennes (Kegel) on les mouvements de va-et-vient." },
  { n: "L'Expansion", c: "Angles & Tweaks", d: 2, s: 2, desc: "L'actif recule presque jusqu'à sortir complètement à chaque mouvement, avant de revenir profondément. Joue on la frustration et l'anticipation.", v: "Variante : Marquez une pause d'une seconde lorsque vous êtes presque sorti, avant la pénétration." },
  { n: "La Méditation sexuelle", c: "Sensorielles", d: 1, s: 3, desc: "Une fois emboîtés, les deux partenaires cessent tout mouvement pendant plusieurs minutes. Fermez les yeux et concentrez-vous uniquement on les micro-pulsations de vos corps.", v: "Variante : Synchronisez votre respiration : l'un inspire quand l'autre expire." },
  { n: "Le Slow-motion", c: "Sensorielles", d: 2, s: 4, desc: "Effectuez l'acte avec une lenteur exagérée, comme au ralenti. Chaque va-et-vient doit prendre plusieurs secondes. Idéal pour faire monter la tension.", v: "Variante : Combinez le ralenti avec un bandeau on les yeux du receveur." },
  { n: "La Respiration synchronisée", c: "Sensorielles", d: 1, s: 2, desc: "Inspirez et expirez exactement on même temps, ventre contre ventre. Cela crée une puissante résonance énergétique et émotionnelle.", v: "Variante : Accélérez progressivement le rythme de la respiration pour faire monter l'excitation." },
  { n: "Le Contact visuel total", c: "Sensorielles", d: 1, s: 4, desc: "Interdiction formelle de fermer les yeux ou de détourner le regard, de la première caresse jusqu'à l'orgasme. Très intense et vulnérable.", v: "Variante : Ne clignez des yeux que lorsque votre partenaire le fait." },
  { n: "Le Miroir", c: "Sensorielles", d: 2, s: 5, desc: "Pratiquez l'amour face à une grande glace lumineuse (ou un miroir au plafond) pour vous observer faire. Le voyeurisme de soi-même est un puissant aphrodisiaque.", v: "Variante : Regardez votre partenaire dans les yeux via le reflet du miroir." },
  { n: "La Douche", c: "Sensorielles", d: 3, s: 4, desc: "Faites l'amour debout sous l'eau chaude. L'eau coulant on les corps modifie les sensations tactiles. Attention : l'eau n'est pas un lubrifiant !", v: "Variante : Alternez brutalement vers l'eau froide pendant quelques secondes pour un choc thermique." },
  { n: "Le Bain", c: "Sensorielles", d: 2, s: 3, desc: "L'un s'assoit au fond de la baignoire remplie, l'autre vient s'asseoir on lui. L'apesanteur de l'eau facilite grandement les mouvements.", v: "Variante : Ajoutez des huiles essentielles ou des bulles pour masquer vos mouvements." },
  { n: "Le Tapis", c: "Sensorielles", d: 1, s: 3, desc: "Quittez le lit confortable pour la rudesse d'un tapis épais devant le salon, ou la chaleur de la moquette. Le changement de texture ravive les sens.", v: "Variante : Allumez un feu de cheminée (ou une vidéo de feu on la TV) pour la lumière tamisée." },
  { n: "La Forêt", c: "Sensorielles", d: 4, s: 5, desc: "L'adrénaline du plein air (dans un lieu isolé et sûr). La brise on la peau nue et la peur d'être surpris décuplent l'excitation sexuelle.", v: "Variante : Adossez-vous à un arbre large pour un missionnaire debout (le Poteau)." },
  { n: "L'Improvisation totale", c: "Sensorielles", d: 2, s: 5, desc: "Désactivez votre cerveau rationnel. Interdiction de planifier la prochaine position : laissez vos corps s'emmêler, rouler et décider eux-mêmes de la suite.", v: "Variante : Laissez la musique dicter le rythme et les changements de position." },
  { n: "Le Double Contact", c: "Sensorielles", d: 2, s: 4, desc: "Pendant le rapport (ex: en missionnaire ou en levrette), un petit vibromasseur est inséré entre les deux corps pour stimuler le clitoris on continu.", v: "Variante : Confiez la télécommande du jouet à votre partenaire pour qu'il gère les vibrations." },
  { n: "Le Papillon de Nuit", c: "Sensorielles", d: 1, s: 5, desc: "Plongez la chambre dans le noir le plus total. Bandez les yeux de l'un des partenaires (ou des deux). La suppression de la vue rendra l'ouïe et le toucher explosifs.", v: "Variante : Murmurez des instructions de plus en plus érotiques à l'oreille de votre partenaire." }
];

const FULL_CATALOG = POSITIONS_DATA.map((p, i) => ({
  id: `p${i}`, name: p.n, cat: p.c, diff: p.d, spice: p.s, desc: p.desc, v: p.v
}));

export default function App() {
  // --- ÉTATS ---
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

  // --- FIREBASE INIT ---
  useEffect(() => {
    signInAnonymously(auth).catch(() => setLoading(false));
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
                  if (Date.now() - pData.pingToPartner < 60000) notify(`${pData.pseudo || 'Votre partenaire'} a envie... 🔥`, '🔔');
                  setLastSeenPing(pData.pingToPartner);
               }
            }
          });
          unsubPartnerCustom = onSnapshot(collection(db, 'artifacts', appId, 'users', data.partnerUid, 'customPositions'), (cSnap) => {
            setPartnerCustomPositions(cSnap.docs.map(d => ({ id: d.id, ...d.data(), isCustom: true, isPartner: true })).filter(p => p.shared !== false));
          });
        }
      }
      setLoading(false);
    });

    const unsubMyCustom = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'customPositions'), (snap) => {
      setMyCustomPositions(snap.docs.map(d => ({ id: d.id, ...d.data(), isCustom: true, isMine: true })));
    });

    return () => { unsubUser(); unsubMyCustom(); unsubPartnerCustom(); };
  }, [user, lastSeenPing]);

  const displayCategories = useMemo(() => {
    const baseCats = [...CATEGORIES];
    const baseIds = baseCats.map(c => c.id);
    const customIds = new Set();
    [...myCustomPositions, ...partnerCustomPositions].forEach(p => { if(p.cat && !baseIds.includes(p.cat)) customIds.add(p.cat); });
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

  const handleSaveProfile = async () => {
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid), { pseudo: profileForm.pseudo, bio: profileForm.bio, avatarUrl: profileForm.avatarUrl });
    setIsEditingProfile(false); notify("Profil mis à jour !", "👤");
  };

  const handleLike = async (id) => {
    const isLiked = userData.likes?.includes(id);
    const newLikes = isLiked ? userData.likes.filter(l => l !== id) : [...userData.likes, id];
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid), { likes: newLikes });
    if (!isLiked && partnerData?.likes?.includes(id)) notify("MATCH PARFAIT !", "🔥");
  };

  const handleSavePosition = async () => {
    let finalCat = newPos.cat === 'NEW' ? (newPos.newCat || 'Personnalisé') : newPos.cat;
    const posData = { name: newPos.name, cat: finalCat, desc: newPos.desc, v: newPos.v, diff: newPos.diff, spice: newPos.spice, shared: newPos.shared, authorId: user.uid };
    if (editPosId) await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'customPositions', editPosId), posData);
    else await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'customPositions'), { ...posData, createdAt: Date.now() });
    setIsCreating(false); setEditPosId(null);
  };

  const triggerGameResult = (type) => {
    let res = null;
    if (type === 'truth') res = GAMES_DATA.truths[Math.floor(Math.random() * 10)];
    if (type === 'dare') res = GAMES_DATA.dares[Math.floor(Math.random() * 8)];
    if (type === 'dice') res = `${GAMES_DATA.diceActions[Math.floor(Math.random()*9)]} ➔ ${GAMES_DATA.diceZones[Math.floor(Math.random()*9)]}\n${GAMES_DATA.diceDurations[Math.floor(Math.random()*5)]}`;
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

      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center w-full px-4">
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
                <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-300 min-w-[120px]"><option value="Toutes">Catégories</option>{displayCategories.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}</select>
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
                        <h3 className="font-bold text-base text-white mb-2">{discreetMode ? "Masqué" : pos.name}</h3>
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
               {['truthOrDare', 'loveDice', 'scenario', 'roulette', 'secretChallenge'].map(g => (
                 <button key={g} onClick={() => setActiveGame(g)} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between group hover:bg-slate-800 transition">
                   <div className="text-left"><h3 className="font-bold text-white uppercase text-xs tracking-widest">{g.replace(/([A-Z])/g, ' $1')}</h3><p className="text-[10px] text-slate-500 mt-1">Cliquez pour lancer</p></div>
                   <ChevronRight className="text-slate-700" />
                 </button>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'jeux' && activeGame && (
          <div className="absolute inset-0 bg-slate-950 z-10 animate-in slide-in-from-right duration-300 flex flex-col">
            <header className="px-6 py-5 flex items-center justify-between border-b border-white/5"><button onClick={() => { setActiveGame(null); setGameResult(null); }} className="text-slate-400 p-2 bg-slate-800 rounded-full"><ArrowLeft size={20}/></button><div className="w-9"/></header>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] w-full max-w-sm mb-8"><h3 className="text-xl font-bold leading-relaxed">{gameResult || "Prêts ?"}</h3></div>
              <div className="flex gap-4 w-full max-w-sm">
                {activeGame === 'truthOrDare' ? (
                  <><button onClick={() => triggerGameResult('truth')} className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black">VÉRITÉ</button><button onClick={() => triggerGameResult('dare')} className="flex-1 bg-rose-600 py-4 rounded-2xl font-black">ACTION</button></>
                ) : <button onClick={() => triggerGameResult('dice')} className="w-full bg-rose-600 py-4 rounded-2xl font-black">GÉNÉRER</button>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conseils' && (
          <div className="p-6 mt-4 animate-in fade-in">{TIPS_DATA.map(tip => <div key={tip.id} onClick={() => setSelectedTip(tip)} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-4 cursor-pointer mb-4"><div><h3 className="font-bold text-white">{tip.title}</h3><p className="text-slate-400 text-xs line-clamp-2 mt-1">{tip.content}</p></div></div>)}</div>
        )}

        {activeTab === 'duo' && (
          <div className="p-6 mt-4 animate-in fade-in">
             {!userData?.partnerUid ? (
               <div className="bg-slate-900 p-8 rounded-[2rem] text-center"><Users className="mx-auto mb-4 text-emerald-500" size={40} /><div className="bg-slate-950 p-4 rounded-xl mb-6 font-mono tracking-widest text-xl">{userData?.pairCode}</div><input className="w-full bg-slate-800 border-none rounded-xl text-center p-4 mb-4" placeholder="CODE PARTENAIRE" value={partnerCodeInput} onChange={(e) => setPartnerCodeInput(e.target.value.toUpperCase())} maxLength={6}/><button onClick={handleLinkPartner} className="w-full bg-emerald-600 py-4 rounded-xl font-bold">LIER</button></div>
             ) : (
               <div className="space-y-6">
                 <div className="bg-slate-900 p-6 rounded-[2rem] flex items-center justify-between border border-emerald-500/20"><div className="flex items-center gap-4"><img src={partnerData?.avatarUrl} className="w-12 h-12 rounded-full border border-white/10" /><div><h4 className="font-bold">{partnerData?.pseudo || 'Partenaire'}</h4><p className="text-[10px] text-emerald-400 uppercase font-black">Connecté</p></div></div><Heart fill="currentColor" className="text-rose-500" /></div>
                 <button onClick={() => updateDoc(doc(db, 'artifacts', appId, 'users', user.uid), { pingToPartner: Date.now() })} className="w-full bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-[2rem] font-black shadow-lg">SIGNAL DISCRET 🔥</button>
                 <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5"><h3 className="text-xs font-black text-slate-500 uppercase mb-4">Favoris Communs</h3>{allPositions.filter(p => userData?.likes?.includes(p.id) && partnerData?.likes?.includes(p.id)).map(p => <div key={p.id} className="bg-slate-800 p-4 rounded-xl mb-2 text-sm font-bold flex gap-2 items-center"><Star size={14} className="text-amber-500" fill="currentColor"/> {p.name}</div>)}</div>
               </div>
             )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="p-6 mt-4 animate-in fade-in">
            <div className="flex flex-col items-center mb-10"><div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-900 mb-4 overflow-hidden relative group cursor-pointer" onClick={() => setIsEditingProfile(true)}><img src={userData?.avatarUrl} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={24} className="text-white" /></div></div><h2 className="text-2xl font-black text-white">{userData?.pseudo}</h2><button onClick={() => setIsEditingProfile(true)} className="mt-4 bg-slate-800 px-6 py-2 rounded-full text-xs font-bold border border-white/10">Modifier Profil</button></div>
            <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5"><div className="flex justify-between mb-4 font-black uppercase text-[10px] text-slate-500 tracking-widest"><span>Mes Créations</span><button onClick={() => setIsCreating(true)}><Plus size={16}/></button></div><div className="space-y-2">{myCustomPositions.map(p => <div key={p.id} onClick={() => { setSelectedPosition(p) }} className="bg-slate-800 p-4 rounded-xl flex justify-between text-sm font-bold"><span>{p.name}</span><span className="text-slate-500">{p.cat}</span></div>)}</div></div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 px-2 py-3 flex justify-between items-center z-40 pb-8">
        {[ {id:'explorer', icon:<Compass/>}, {id:'jeux', icon:<Gamepad2/>}, {id:'conseils', icon:<BookOpen/>}, {id:'duo', icon:<Users/>}, {id:'profil', icon:<User/>} ].map(tab => (
          <button key={tab.id} onClick={() => {setActiveTab(tab.id); setActiveGame(null);}} className={`flex flex-col items-center gap-1 w-1/5 ${activeTab === tab.id ? 'text-rose-500 scale-110' : 'text-slate-500'}`}>{tab.icon}<span className="text-[8px] font-black uppercase">{tab.id}</span></button>
        ))}
      </nav>

      {/* MODAL POSITION DETAILS */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="relative pt-12 pb-8 px-6 bg-gradient-to-b from-rose-950/40 to-slate-950"><button onClick={() => setSelectedPosition(null)} className="absolute top-6 left-6 text-slate-400 bg-slate-900/50 p-2 rounded-full"><ArrowLeft size={20}/></button><div className="text-center mt-6"><span className="px-3 py-1 bg-slate-900 text-rose-400 text-[10px] font-black uppercase rounded-full border border-rose-500/20">{selectedPosition.cat}</span><h2 className="text-3xl font-black text-white mt-4">{discreetMode ? "Masqué" : selectedPosition.name}</h2></div></div>
          <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6"><div className="bg-slate-900/60 p-6 rounded-3xl"><h4 className="text-rose-400 text-xs font-black uppercase flex items-center gap-2 mb-3"><Sparkles size={14}/> La Posture</h4><p className="text-slate-300 text-sm leading-relaxed">{discreetMode ? "xxxx xxxx" : selectedPosition.desc}</p></div>{selectedPosition.v && <div className="bg-indigo-900/20 p-6 rounded-3xl"><h4 className="text-indigo-400 text-xs font-black uppercase flex items-center gap-2 mb-3"><RefreshCw size={14}/> Variante</h4><p className="text-slate-300 text-sm">{discreetMode ? "xxxx" : selectedPosition.v}</p></div>}</div>
          <div className="p-6 bg-slate-950 border-t border-slate-900"><button onClick={() => handleLike(selectedPosition.id)} className={`w-full py-4 rounded-xl font-black uppercase flex items-center justify-center gap-3 ${userData?.likes?.includes(selectedPosition.id) ? 'bg-slate-800 text-rose-500' : 'bg-rose-600 text-white'}`}><Heart fill={userData?.likes?.includes(selectedPosition.id) ? "currentColor" : "none"} size={18}/> {userData?.likes?.includes(selectedPosition.id) ? 'Retirer' : 'Ajouter aux favoris'}</button></div>
        </div>
      )}

      {/* MODAL EDITION PROFIL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 mb-8"><ArrowLeft size={24}/></button>
          <div className="space-y-6"><input className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl" placeholder="Pseudo" value={profileForm.pseudo} onChange={(e) => setProfileForm({...profileForm, pseudo: e.target.value})}/><textarea className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl h-32" placeholder="Bio" value={profileForm.bio} onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}/><button onClick={handleSaveProfile} className="w-full bg-rose-600 py-4 rounded-xl font-black">ENREGISTRER</button></div>
        </div>
      )}

      {/* MODAL CREATION */}
      {isCreating && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setIsCreating(false)} className="text-slate-400 mb-8"><ArrowLeft size={24}/></button>
          <div className="space-y-4 overflow-y-auto pb-20 custom-scroll">
            <input className="w-full bg-slate-900 p-4 rounded-xl" placeholder="Nom" value={newPos.name} onChange={(e) => setNewPos({...newPos, name: e.target.value})}/>
            <select className="w-full bg-slate-900 p-4 rounded-xl" value={newPos.cat} onChange={(e) => setNewPos({...newPos, cat: e.target.value})}>{displayCategories.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}<option value="NEW">+ Nouvelle catégorie</option></select>
            {newPos.cat === 'NEW' && <input className="w-full bg-slate-900 p-4 rounded-xl border border-indigo-500" placeholder="Nom catégorie" value={newPos.newCat} onChange={(e) => setNewPos({...newPos, newCat: e.target.value})}/>}
            <div className="flex gap-4"><div className="flex-1"><label className="text-[10px] uppercase text-slate-500 block mb-2">Physique ({newPos.diff}/5)</label><input type="range" min="1" max="5" value={newPos.diff} onChange={(e) => setNewPos({...newPos, diff: parseInt(e.target.value)})} className="w-full accent-indigo-500"/></div><div className="flex-1"><label className="text-[10px] uppercase text-slate-500 block mb-2">Intensité ({newPos.spice}/5)</label><input type="range" min="1" max="5" value={newPos.spice} onChange={(e) => setNewPos({...newPos, spice: parseInt(e.target.value)})} className="w-full accent-rose-500"/></div></div>
            <textarea className="w-full bg-slate-900 p-4 rounded-xl h-24" placeholder="Description" value={newPos.desc} onChange={(e) => setNewPos({...newPos, desc: e.target.value})}/><button onClick={handleSavePosition} className="w-full bg-rose-600 py-4 rounded-xl font-black">AJOUTER & PARTAGER</button>
          </div>
        </div>
      )}

      {/* MODAL TIP */}
      {selectedTip && (
        <div className="fixed inset-0 z-[200] bg-slate-950 p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <button onClick={() => setSelectedTip(null)} className="text-slate-400 mb-8"><ArrowLeft size={24}/></button>
          <h2 className="text-2xl font-black mb-6">{selectedTip.title}</h2>
          <div className="flex-1 overflow-y-auto bg-slate-900 p-6 rounded-3xl text-slate-300 whitespace-pre-line">{selectedTip.content}</div>
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
