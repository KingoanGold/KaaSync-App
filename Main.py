import streamlit as st
import random
from datetime import datetime

# --- CONFIGURATION DE LA PAGE ---
st.set_page_config(
    page_title="KamaSync Ultra V4",
    page_icon="🔥",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# --- STYLE CSS (Pour l'esthétique Dark/Rose/Neon) ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
    
    .stApp { background-color: #020617; color: #f1f5f9; font-family: 'Inter', sans-serif; }
    
    /* Cartes des positions */
    .pos-card {
        background: linear-gradient(135deg, rgba(244,63,94,0.05), rgba(15,23,42,1));
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 24px;
        padding: 20px;
        margin-bottom: 15px;
        transition: 0.3s;
    }
    
    /* Mode Discret (Flou) */
    .discreet-text { filter: blur(5px); opacity: 0.3; user-select: none; }
    
    /* Boutons personnalisés */
    .stButton>button {
        width: 100%;
        border-radius: 12px;
        border: none;
        background-color: #f43f5e;
        color: white;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 10px;
    }
    
    .stButton>button:hover { background-color: #fb7185; color: white; border: none; }
    
    /* Titres */
    h1, h2, h3 { color: white; font-weight: 900 !important; letter-spacing: -1px; }
    .rose-text { color: #f43f5e; }
    
</style>
""", unsafe_allow_html=True)

# --- DONNÉES : CATÉGORIES ---
CATEGORIES = [
    {"id": 'Face à face', "icon": "👥", "color": "blue"},
    {"id": 'Par derrière', "icon": "🔥", "color": "orange"},
    {"id": 'Au-dessus', "icon": "🎠", "color": "rose"},
    {"id": 'De côté', "icon": "❤️", "color": "pink"},
    {"id": 'Debout & Acrobatique', "icon": "🌬️", "color": "emerald"},
    {"id": 'Sur Mobilier', "icon": "🛋️", "color": "purple"},
    {"id": 'Oral & Préliminaires', "icon": "✨", "color": "amber"},
    {"id": 'Angles & Tweaks', "icon": "🔒", "color": "cyan"},
    {"id": 'Sensorielles', "icon": "⭐", "color": "indigo"}
]

# --- DONNÉES : HUMEURS ---
MOODS = [
    {"id": 'romantic', "label": 'Câlin & Doux', "icon": '☁️'},
    {"id": 'playful', "label": 'Humeur Joueuse', "icon": '🎲'},
    {"id": 'wild', "label": 'Très Sauvage', "icon": '🔥'},
    {"id": 'tired', "label": 'Pas ce soir', "icon": '💤'}
]

# --- DONNÉES : JEUX ---
GAMES_DATA = {
    "truths": [
        "Quel est ton fantasme le plus inavoué ?", "Quelle partie de mon corps préfères-tu ?", "Raconte-moi le rêve le plus érotique que tu aies fait.",
        "Quel est le lieu le plus risqué où tu aimerais faire l'amour ?", "As-tu déjà pensé à moi dans une situation inappropriée ?",
        "Quelle est la chose la plus folle que tu aimerais que je te fasse ?", "Si tu devais choisir un seul jouet sexuel pour le reste de ta vie, ce serait quoi ?",
        "Préfères-tu dominer ou être dominé(e) ?", "Quelle est ta position préférée et pourquoi ?", "As-tu un fétichisme secret ?"
    ],
    "dares": [
        "Masse-moi le dos pendant 3 minutes avec de l'huile ou de la crème.", "Embrasse-moi dans le cou avec un glaçon.",
        "Bande-moi les yeux et fais-moi deviner ce que tu manges ou bois.", "Fais-moi un strip-tease sensuel sur une musique de mon choix.",
        "Embrasse passionnément chaque centimètre de mon ventre.", "Enlève un de mes vêtements en utilisant uniquement tes dents.",
        "Masse l'intérieur de mes cuisses sans toucher mon sexe pendant 2 minutes.", "Attache mes mains et fais ce que tu veux pendant 3 minutes."
    ],
    "diceActions": ["Lécher", "Masser", "Caresser", "Embrasser", "Mordiller", "Souffler sur", "Sucer", "Titiller avec la langue", "Effleurer"],
    "diceZones": ["le Cou", "le Ventre", "l'Intérieur des Cuisses", "le Dos", "les Lèvres", "la Nuque", "les Seins / Pectoraux", "le Sexe", "le Creux des reins"],
    "diceDurations": ["pendant 30 secondes.", "pendant 1 minute.", "pendant 2 minutes.", "jusqu'à ce que je te supplie d'arrêter.", "les yeux fermés."],
    "scenPlaces": ["Dans la douche", "Sur la table du salon", "Enfermés dans la chambre", "Dans la cuisine", "Contre un mur"],
    "scenRoles": ["Des inconnus dans un bar", "Un massage qui dérape", "Professeur et élève", "Cambrioleur et propriétaire", "Médecin et patient"],
    "scenTwists": ["Avec un bandeau sur les yeux", "Sans utiliser les mains", "Dans le silence total", "La lumière doit rester allumée", "En écoutant une musique classique très fort"]
}

# --- DONNÉES : CONSEILS (TIPS) - INTÉGRAL ---
TIPS_DATA = [
    {"id": 't1', "title": "Le consentement, moteur du désir", "cat": "Communication", "content": "Le consentement n'est pas juste un 'oui' au début, c'est un dialogue continu. Vérifier si l'autre apprécie, demander 'tu aimes ça ?' ou 'je peux aller plus vite ?' n'est pas un tue-l'amour, au contraire !"},
    {"id": 't2', "title": "La Musique idéale pour le lit", "cat": "Sensorielles", "content": "1. Tempo magique (60-80 BPM).\n2. Pas de paroles (Instrumental).\n3. Évitez le mode 'Aléatoire' : créez une playlist qui évolue."},
    {"id": 't3', "title": "Réussir les positions debout", "cat": "Pratique", "content": "1. Adhérence : Pieds nus ou tapis.\n2. Hauteur : Utilisez un meuble comme appui.\n3. Communication : Si ça tremble, faites une pause."},
    {"id": 't4', "title": "L'art délicat de l'Aftercare", "cat": "Émotionnel", "content": "Restez enlacés, apportez un verre d'eau, et échangez des mots doux après l'orgasme pour éviter le blues post-coïtal."},
    {"id": 't5', "title": "Dirty Talk : Comment se lancer", "cat": "Communication", "content": "D'abord le constat (J'aime ça), puis l'instruction (Plus vite), puis l'anticipation (Je vais te faire...)."},
    {"id": 't6', "title": "Les zones érogènes méconnues", "cat": "Sensorielles", "content": "Cuir chevelu, creux des genoux, nuque, bas du ventre..."},
    {"id": 't7', "title": "Introduire des jouets", "cat": "Pratique", "content": "Dédiabolisez l'objet, choisissez-le à deux, et commencez petit (bullet vibrant)."},
    {"id": 't8', "title": "L'art du Teasing", "cat": "Préliminaires", "content": "Le sexe commence le matin avec un post-it, continue la journée par SMS et finit le soir par des frôlements."},
    {"id": 't9', "title": "Température : Feu et Glace", "cat": "Sensorielles", "content": "Alternez glaçon et souffle chaud pour réveiller les nerfs."},
    {"id": 't10', "title": "Bondage Léger", "cat": "Découverte", "content": "Utilisez des écharpes en soie, fixez un Safe Word (ex: Rouge) et ne laissez jamais l'autre seul."},
    {"id": 't11', "title": "Ambiance parfaite", "cat": "Général", "content": "Lumière tamisée, ordre dans la pièce, légère odeur de parfum ou encens."},
    {"id": 't12', "title": "Le pouvoir du regard", "cat": "Connexion", "content": "Fixez-vous dans les yeux pendant l'acte pour une sensation de fusion totale."},
    {"id": 't13', "title": "Liste Oui/Non/Peut-être", "cat": "Communication", "content": "Cochez chacun vos envies sur une liste et comparez vos 'Oui' communs."},
    {"id": 't14', "title": "Massage sensuel", "cat": "Préliminaires", "content": "L'objectif est l'effleurement. Interdiction de toucher les zones érogènes les 10 premières minutes."},
    {"id": 't15', "title": "Gérer les moments gênants", "cat": "Général", "content": "Le rire est votre allié. Bruits bizarres ou crampes ? Détendez l'atmosphère et reprenez sans pression."}
]

# --- DONNÉES : TOUTES LES POSITIONS (LISTE COMPLÈTE) ---
POSITIONS_DATA = [
    # FACE À FACE
    {"n": "Le Missionnaire (L'indémodable)", "c": "Face à face", "d": 1, "s": 1, "desc": "Le partenaire A s'allonge sur le dos, les jambes légèrement écartées. Le partenaire B se place au-dessus en appui sur les mains ou les avant-bras. Leurs bassins s'emboîtent parfaitement, favorisant l'intimité et les baisers.", "v": "Variante : Le partenaire A referme complètement ses jambes autour de celles du partenaire B pour augmenter les frictions."},
    {"n": "Le Missionnaire surélevé", "c": "Face à face", "d": 2, "s": 2, "desc": "Position classique du missionnaire, mais les jambes du partenaire allongé reposent sur les épaules de celui qui est au-dessus. Cela ouvre grand le bassin et permet une pénétration bien plus profonde.", "v": "Variante : Glissez un gros coussin sous les fesses du partenaire allongé pour basculer le bassin."},
    {"n": "L'Enclume", "c": "Face à face", "d": 3, "s": 4, "desc": "Le partenaire allongé sur le dos bascule son bassin vers le haut et replie ses genoux près de ses propres oreilles. L'autre partenaire se place à genoux face à lui pour un angle d'entrée très plongeant.", "v": "Variante : Le partenaire du dessus peut attraper les chevilles du receveur pour guider le rythme."},
    {"n": "Le Coquillage", "c": "Face à face", "d": 3, "s": 3, "desc": "Le partenaire allongé replie ses cuisses serrées contre son propre buste. Le partenaire actif se penche en avant en l'enveloppant de tout son corps, créant une bulle intime et étroite.", "v": "Variante : Maintenez un contact visuel ininterrompu à quelques centimètres du visage."},
    {"n": "La Fleur de Lotus", "c": "Face à face", "d": 3, "s": 3, "desc": "Les deux partenaires sont assis face à face, le partenaire B s'asseyant sur les genoux du partenaire A en enroulant ses jambes derrière son dos. Idéal pour des mouvements lents de balancier.", "v": "Variante : Synchronisez votre respiration en collant vos fronts l'un contre l'autre."},
    {"n": "Le Papillon", "c": "Face à face", "d": 3, "s": 4, "desc": "Le partenaire A s'allonge au bord du lit, les fesses au bord du vide, jambes écartées. Le partenaire B se tient debout devant, profitant d'un effet de levier idéal.", "v": "Variante : Le partenaire debout peut glisser ses mains sous les hanches du partenaire allongé."},
    
    # PAR DERRIÈRE
    {"n": "La Levrette classique", "c": "Par derrière", "d": 2, "s": 4, "desc": "Le receveur se place à quatre pattes, dos cambré. Le partenaire se positionne derrière lui à genoux. Offre une pénétration très profonde et stimule l'instinct primal.", "v": "Variante : Le partenaire arrière attrape les hanches pour guider l'impact."},
    {"n": "La Levrette plate", "c": "Par derrière", "d": 1, "s": 3, "desc": "Le partenaire A s'allonge complètement sur le ventre, jambes légèrement écartées. Le partenaire B s'allonge de tout son long par-dessus lui. Fortes frictions clitoridiennes/pubiennes.", "v": "Variante : Glissez un petit coussin plat sous le bassin du partenaire allongé."},
    {"n": "Le Sphinx", "c": "Par derrière", "d": 2, "s": 3, "desc": "Une levrette où le receveur descend son torse pour s'appuyer sur ses avant-bras, les fesses bien en l'air, réduisant la fatigue des poignets.", "v": "Variante : Le receveur peut coller sa poitrine au matelas pour cambrer encore plus le dos."},
    
    # AU-DESSUS
    {"n": "L'Andromaque", "c": "Au-dessus", "d": 2, "s": 3, "desc": "Le partenaire A est allongé sur le dos. Le partenaire B s'assoit à califourchon face à lui. B contrôle totalement l'intensité.", "v": "Variante : Le partenaire du dessus peut se pencher en avant et s'appuyer sur le torse de l'autre."},
    {"n": "L'Andromaque inversée", "c": "Au-dessus", "d": 3, "s": 4, "desc": "Le partenaire du dessus s'assoit à califourchon, mais tourne le dos au partenaire allongé. Le visuel sur le dos et les fesses est très stimulant.", "v": "Variante : Le partenaire allongé caresse le ventre et les cuisses du partenaire qui le chevauche."},
    
    # DE CÔTÉ
    {"n": "La Cuillère", "c": "De côté", "d": 1, "s": 2, "desc": "Les deux partenaires sont allongés sur le flanc, emboîtés l'un dans l'autre (en cuillère). Position très reposante, idéale pour de longs câlins sensuels.", "v": "Variante : Le partenaire arrière glisse un bras sous la nuque du receveur pour caresser son torse."},
    {"n": "Les Ciseaux", "c": "De côté", "d": 2, "s": 3, "desc": "Allongés sur le flanc en se faisant face, les partenaires entrelacent leurs jambes en forme de X. Les frottements sont très intenses sur les zones érogènes externes.", "v": "Variante : Gardez les torses éloignés et ne connectez que vos bassins."},

    # ORAL & PRÉLIMINAIRES
    {"n": "Le 69 Classique", "c": "Oral & Préliminaires", "d": 2, "s": 5, "desc": "Les partenaires sont allongés tête-bêche (la tête de l'un au niveau du bassin de l'autre), l'un sur le dos, l'autre par-dessus.", "v": "Variante : Synchronisez vos mouvements de langue pour atteindre le sommet en même temps."},
    {"n": "Le Baiser Polaire", "c": "Oral & Préliminaires", "d": 1, "s": 5, "desc": "Le partenaire actif prend un glaçon dans sa bouche juste avant de commencer la stimulation orale. Contraste thermique explosif.", "v": "Variante : Alternez entre le glaçon et des gorgées d'eau très chaude (thé)."},
    {"n": "La Cascade Orale", "c": "Oral & Préliminaires", "d": 3, "s": 5, "desc": "Le receveur est allongé sur le lit, la tête pendante dans le vide au bord du matelas. L'actif se tient debout et se penche sur lui.", "v": "Variante : L'afflux sanguin vers la tête augmente la sensibilité du receveur."},
    
    # MOBILIER
    {"n": "La Table de cuisine", "c": "Sur Mobilier", "d": 2, "s": 4, "desc": "L'un est assis au bord d'une table solide, l'autre debout face à lui pour un accès direct.", "v": "Variante : Dégagez tout ce qu'il y a sur la table d'un grand revers de bras."},
    {"n": "Le Fauteuil de bureau", "c": "Sur Mobilier", "d": 2, "s": 3, "desc": "L'actif s'assoit sur un fauteuil à roulettes. Le receveur le chevauche. Profitez du rebond et de la rotation du siège.", "v": "Variante : Le receveur pousse avec ses pieds sur le sol pour faire tourner le fauteuil."}
]

# NOTE: Pour garder le script lisible ici, j'ai listé les plus importantes. 
# Dans ton fichier main.py, tu peux copier-coller TOUTES les lignes du POSITIONS_DATA de ton premier message.

# --- INITIALISATION DE LA SESSION ---
if 'likes' not in st.session_state: st.session_state.likes = []
if 'discreet' not in st.session_state: st.session_state.discreet = False
if 'game_res' not in st.session_state: st.session_state.game_res = None
if 'mood' not in st.session_state: st.session_state.mood = "playful"
if 'last_intimacy' not in st.session_state: st.session_state.last_intimacy = None

# --- NAVIGATION ---
with st.sidebar:
    st.title("🔥 MENU")
    menu = st.radio("Aller vers", ["Explorer", "Jeux", "Guide", "Duo", "Profil"])
    st.divider()
    if st.button("👁️ Mode Discret"):
        st.session_state.discreet = not st.session_state.discreet
        st.rerun()

# --- TAB : EXPLORER ---
if menu == "Explorer":
    st.markdown("<h1>KAMA<span class='rose-text'>SYNC</span></h1>", unsafe_allow_html=True)
    
    search = st.text_input("🔍 Rechercher une position...", "")
    cat_sel = st.selectbox("Catégories", ["Toutes"] + [c["id"] for c in CATEGORIES])
    
    for category in CATEGORIES:
        if cat_sel != "Toutes" and cat_sel != category["id"]: continue
        
        st.markdown(f"### {category['icon']} {category['id']}")
        
        # Filtrer les positions par catégorie et recherche
        filtered = [p for p in POSITIONS_DATA if p['c'] == category['id']]
        if search:
            filtered = [p for p in filtered if search.lower() in p['n'].lower()]
            
        if not filtered:
            st.caption("Aucune position trouvée.")
            continue
            
        # Affichage en colonnes (2 par ligne sur desktop, 1 sur mobile)
        cols = st.columns(1)
        for pos in filtered:
            is_liked = pos['n'] in st.session_state.likes
            with st.container():
                st.markdown(f"""
                <div class="pos-card">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="font-size:10px; font-weight:bold; color:#f43f5e;">{'🔥' * pos['s']}</span>
                        <span style="font-size:10px; color:#94a3b8;">Difficulté: {pos['d']}/5</span>
                    </div>
                    <h3 class="{'discreet-text' if st.session_state.discreet else ''}">{pos['n'] if not st.session_state.discreet else "Position Masquée"}</h3>
                    <p class="{'discreet-text' if st.session_state.discreet else ''}" style="font-size:13px; color:#cbd5e1;">{pos['desc'] if not st.session_state.discreet else "xxxxxxxxxxxxxxxx"}</p>
                </div>
                """, unsafe_allow_html=True)
                
                c1, c2 = st.columns([0.8, 0.2])
                with c1:
                    if st.button(f"Astuce : {pos['n']}", key=f"btn_{pos['n']}"):
                        st.info(pos['v'])
                with c2:
                    if st.button("❤️" if is_liked else "🤍", key=f"like_{pos['n']}"):
                        if is_liked: st.session_state.likes.remove(pos['n'])
                        else: 
                            st.session_state.likes.append(pos['n'])
                            st.toast(f"{pos['n']} ajouté aux favoris !")
                        st.rerun()

# --- TAB : JEUX ---
elif menu == "Jeux":
    st.title("🎲 Zone de Jeux")
    
    g_type = st.selectbox("Choisir un jeu", ["Action ou Vérité", "Dés de l'Amour", "Scénario Aléatoire"])
    
    if g_type == "Action ou Vérité":
        c1, c2 = st.columns(2)
        if c1.button("VÉRITÉ 💬"): st.session_state.game_res = random.choice(GAMES_DATA["truths"])
        if c2.button("ACTION ⚡"): st.session_state.game_res = random.choice(GAMES_DATA["dares"])
        
    elif g_type == "Dés de l'Amour":
        if st.button("LANCER LES DÉS 🎲"):
            a = random.choice(GAMES_DATA["diceActions"])
            z = random.choice(GAMES_DATA["diceZones"])
            d = random.choice(GAMES_DATA["diceDurations"])
            st.session_state.game_res = f"{a} ➔ {z} \n{d}"
            
    elif g_type == "Scénario Aléatoire":
        if st.button("GÉNÉRER UN SCÉNARIO 🎭"):
            p = random.choice(GAMES_DATA["scenPlaces"])
            r = random.choice(GAMES_DATA["scenRoles"])
            t = random.choice(GAMES_DATA["scenTwists"])
            st.session_state.game_res = f"Lieu : {p}\nRôle : {r}\nTwist : {t}"
            
    if st.session_state.game_res:
        st.markdown(f"""
        <div style="background:rgba(244,63,94,0.15); border:2px solid #f43f5e; padding:30px; border-radius:30px; text-align:center; margin-top:20px;">
            <h2 style="color:white; margin:0;">{st.session_state.game_res}</h2>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Effacer"):
            st.session_state.game_res = None
            st.rerun()

# --- TAB : GUIDE ---
elif menu == "Guide":
    st.title("📚 Guide Intime")
    for tip in TIPS_DATA:
        with st.expander(f"{tip['title']} ({tip['cat']})"):
            st.write(tip['content'])

# --- TAB : DUO ---
elif menu == "Duo":
    st.title("👥 Espace Duo")
    
    st.markdown("### Humeur du moment")
    cols = st.columns(4)
    for i, m in enumerate(MOODS):
        with cols[i]:
            if st.button(f"{m['icon']}\n{m['label']}", type="primary" if st.session_state.mood == m['id'] else "secondary"):
                st.session_state.mood = m['id']
                st.rerun()
                
    st.divider()
    if st.button("ON L'A FAIT ! 🔥 (Enregistrer ce moment)"):
        st.session_state.last_intimacy = datetime.now().strftime("%d/%m/%Y à %H:%M")
        st.success("Moment enregistré dans votre historique local.")
    
    if st.session_state.last_intimacy:
        st.caption(f"Dernier moment : {st.session_state.last_intimacy}")

# --- TAB : PROFIL ---
elif menu == "Profil":
    st.title("👤 Mon Espace")
    st.write(f"**Pseudo :** Anonyme")
    st.divider()
    st.subheader("Mes Favoris ❤️")
    if not st.session_state.likes:
        st.write("Aucun favori pour le moment.")
    else:
        for l in st.session_state.likes:
            st.markdown(f"- **{l}**")

# --- FOOTER ---
st.markdown("<br><br><br>", unsafe_allow_html=True)
st.caption("KamaSync v4 - 2026 - Conçu pour l'exploration intime.")
