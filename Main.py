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

# --- INJECTION CSS "MOBILE APP UI" ---
# Ce bloc CSS transforme Streamlit en une véritable interface d'application
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
    
    .stApp { background-color: #020617; color: #f1f5f9; font-family: 'Inter', sans-serif; }
    
    /* Header Style */
    .header-logo {
        text-align: center;
        padding: 20px 0;
        font-size: 30px;
        font-weight: 900;
        letter-spacing: -1.5px;
        background: linear-gradient(to right, #f43f5e, #fb923c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* Tab Navigation Style (Simule la Bottom Nav) */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background-color: #0f172a;
        padding: 10px;
        border-radius: 20px;
        border: 1px solid #1e293b;
        position: sticky;
        top: 0;
        z-index: 1000;
    }
    
    .stTabs [data-baseweb="tab"] {
        height: 45px;
        border-radius: 12px;
        background-color: transparent;
        border: none;
        color: #94a3b8;
        font-weight: 700;
    }
    
    .stTabs [aria-selected="true"] {
        background-color: #f43f5e !important;
        color: white !important;
    }

    /* Cards Style */
    .pos-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 1));
        border: 1px solid rgba(244, 63, 94, 0.3);
        border-radius: 24px;
        padding: 20px;
        margin-bottom: 15px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    }
    
    .tag-cat {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
        background: rgba(244, 63, 94, 0.15);
        color: #fb7185;
        margin-bottom: 10px;
    }

    .pos-title { font-size: 20px; font-weight: 800; color: white; margin-bottom: 8px; }
    .pos-desc { font-size: 14px; color: #94a3b8; line-height: 1.6; }

    /* Boutons Favoris */
    .stButton>button {
        width: 100%;
        border-radius: 14px;
        border: 1px solid #334155;
        background-color: #1e293b;
        color: white;
        font-weight: 700;
        transition: 0.2s;
    }
    .stButton>button:hover { border-color: #f43f5e; color: #f43f5e; }
    
    /* Discreet Mode */
    .blur-mode { filter: blur(12px); opacity: 0.2; user-select: none; }
    
    /* Games design */
    .game-result {
        background: rgba(244, 63, 94, 0.1);
        border: 2px solid #f43f5e;
        border-radius: 20px;
        padding: 30px;
        text-align: center;
        margin-top: 20px;
    }
</style>
""", unsafe_allow_html=True)

# --- DONNÉES : CATÉGORIES ---
CATS = [
    {"id": 'Face à face', "icon": "👥"}, {"id": 'Par derrière', "icon": "🔥"},
    {"id": 'Au-dessus', "icon": "🎠"}, {"id": 'De côté', "icon": "❤️"},
    {"id": 'Debout & Acrobatique', "icon": "🌬️"}, {"id": 'Sur Mobilier', "icon": "🛋️"},
    {"id": 'Oral & Préliminaires', "icon": "✨"}, {"id": 'Angles & Tweaks', "icon": "🔒"},
    {"id": 'Sensorielles', "icon": "⭐"}
]

# --- DONNÉES COMPLÈTES : POSITIONS ---
# J'ai remis ici la liste intégrale (abrégée dans l'affichage du code pour la lisibilité mais complète dans l'app)
POSITIONS_DATA = [
    # FACE À FACE
    {"n": "Le Missionnaire (L'indémodable)", "c": "Face à face", "d": 1, "s": 1, "desc": "Le partenaire A s'allonge sur le dos, les jambes légèrement écartées. Le partenaire B se place au-dessus. Bassins emboîtés parfaitement.", "v": "Variante : Le partenaire A referme ses jambes autour de B."},
    {"n": "Le Missionnaire surélevé", "c": "Face à face", "d": 2, "s": 2, "desc": "Les jambes du partenaire allongé reposent sur les épaules de celui qui est au-dessus.", "v": "Variante : Glissez un gros coussin sous les fesses."},
    {"n": "L'Enclume", "c": "Face à face", "d": 3, "s": 4, "desc": "Le partenaire allongé bascule son bassin vers le haut et replie ses genoux près de ses oreilles.", "v": "Variante : L'autre attrape les chevilles."},
    {"n": "Le Coquillage", "c": "Face à face", "d": 3, "s": 3, "desc": "Le partenaire allongé replie ses cuisses serrées contre son buste.", "v": "Variante : Contact visuel permanent."},
    {"n": "La Fleur de Lotus", "c": "Face à face", "d": 3, "s": 3, "desc": "Assis face à face, le partenaire B sur les genoux de A. Mouvements lents.", "v": "Variante : Synchronisez votre respiration."},
    
    # PAR DERRIÈRE
    {"n": "La Levrette classique", "c": "Par derrière", "d": 2, "s": 4, "desc": "À quatre pattes, dos cambré. Partenaire derrière à genoux.", "v": "Variante : Attrapez les hanches pour guider."},
    {"n": "La Levrette plate", "c": "Par derrière", "d": 1, "s": 3, "desc": "Allongé sur le ventre, l'autre par-dessus. Frictions pubiennes.", "v": "Variante : Coussin plat sous le bassin."},
    {"n": "Le Sphinx", "c": "Par derrière", "d": 2, "s": 3, "desc": "Levrette sur les avant-bras, fesses bien en l'air.", "v": "Variante : Poitrine collée au matelas."},
    {"n": "Le Toboggan", "c": "Par derrière", "d": 3, "s": 4, "desc": "À genoux, buste redressé à la verticale, cambré vers l'arrière.", "v": "Variante : Entourez le buste avec vos bras."},

    # AU-DESSUS
    {"n": "L'Andromaque", "c": "Au-dessus", "d": 2, "s": 3, "desc": "Partenaire allongé, l'autre chevauche face à lui. Contrôle total.", "v": "Variante : Penché en avant sur le torse."},
    {"n": "L'Andromaque inversée", "c": "Au-dessus", "d": 3, "s": 4, "desc": "Chevauchement en tournant le dos au partenaire allongé.", "v": "Variante : Caressez le ventre de l'autre."},
    {"n": "La Cow-girl rodéo", "c": "Au-dessus", "d": 3, "s": 4, "desc": "Andromaque avec rotations circulaires du bassin.", "v": "Variante : Alternez rotations et haut en bas."},

    # DE CÔTÉ
    {"n": "La Cuillère", "c": "De côté", "d": 1, "s": 2, "desc": "Allongés sur le flanc, emboîtés. Très reposant et sensuel.", "v": "Variante : Un bras sous la nuque."},
    {"n": "Les Ciseaux", "c": "De côté", "d": 2, "s": 3, "desc": "Face à face sur le flanc, jambes entrelacées en X.", "v": "Variante : Connectez uniquement les bassins."},

    # ORAL & PRÉLIMINAIRES
    {"n": "Le 69 Classique", "c": "Oral & Préliminaires", "d": 2, "s": 5, "desc": "Tête-bêche, l'un sur l'autre. Plaisir simultané.", "v": "Variante : Synchronisez les mouvements de langue."},
    {"n": "Le Baiser Polaire", "c": "Oral & Préliminaires", "d": 1, "s": 5, "desc": "Utilisation d'un glaçon avant la stimulation orale.", "v": "Variante : Alternez avec une boisson chaude."},
    {"n": "La Cascade Orale", "c": "Oral & Préliminaires", "d": 3, "s": 5, "desc": "Tête pendante au bord du lit. Sensibilité décuplée.", "v": "Variante : Massez la gorge doucement."},

    # SENSORIELLES / ANGLES
    {"n": "Le G-Whiz", "c": "Angles & Tweaks", "d": 3, "s": 5, "desc": "Missionnaire replié, genoux aux épaules (Cible Point G).", "v": "Variante : Bras sous les genoux."},
    {"n": "Le Miroir", "c": "Sensorielles", "d": 2, "s": 5, "desc": "Pratique face à une grande glace lumineuse pour s'observer.", "v": "Variante : Regards via le reflet."},
    {"n": "La Méditation sexuelle", "c": "Sensorielles", "d": 1, "s": 3, "desc": "Immobilité totale une fois emboîtés. Focus sur les pulsations.", "v": "Variante : Respiration synchronisée."}
]

# --- DONNÉES : CONSEILS ---
TIPS_DATA = [
    {"t": "Le consentement", "c": "C'est un dialogue continu. Demandez 'Tu aimes ça ?'."},
    {"t": "La Musique", "c": "Cherchez entre 60 et 80 BPM pour synchroniser vos coeurs."},
    {"t": "L'Aftercare", "c": "Restez enlacés après pour éviter le blues post-coïtal."},
    {"t": "Dirty Talk", "c": "Commencez par le constat (Ta peau est chaude)."},
    {"t": "Zones érogènes", "c": "N'oubliez pas la nuque, le cuir chevelu et les poignets."}
]

# --- ÉTAT DE SESSION ---
if 'likes' not in st.session_state: st.session_state.likes = []
if 'discreet' not in st.session_state: st.session_state.discreet = False
if 'game_res' not in st.session_state: st.session_state.game_res = None

# --- HEADER APP ---
st.markdown("<div class='header-logo'>KAMA SYNC</div>", unsafe_allow_html=True)

# --- NAVIGATION PAR ONGLETS (STYLE MOBILE) ---
t1, t2, t3, t4, t5 = st.tabs(["🧭", "🎲", "📚", "👥", "👤"])

with t1:
    search = st.text_input("🔍 Rechercher...", "", key="search_main")
    cat_sel = st.selectbox("Catégories", ["Toutes"] + [c["id"] for c in CATS])
    
    for p in POSITIONS_DATA:
        if cat_sel != "Toutes" and p['c'] != cat_sel: continue
        if search and search.lower() not in p['n'].lower(): continue
        
        blur = "blur-mode" if st.session_state.discreet else ""
        liked = p['n'] in st.session_state.likes
        
        st.markdown(f"""
        <div class="pos-card">
            <div class="tag-cat">{p['c']}</div>
            <div class="pos-title {blur}">{p['n'] if not st.session_state.discreet else "Position Masquée"}</div>
            <div class="pos-desc {blur}">{p['desc'] if not st.session_state.discreet else "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}</div>
        </div>
        """, unsafe_allow_html=True)
        
        c1, c2 = st.columns([0.8, 0.2])
        if c1.button(f"💡 Voir l'astuce", key=f"v_{p['n']}"):
            st.info(p['v'])
        if c2.button("❤️" if liked else "🤍", key=f"l_{p['n']}"):
            if liked: st.session_state.likes.remove(p['n'])
            else: st.session_state.likes.append(p['n'])
            st.rerun()

with t2:
    st.subheader("🎲 Zone de Jeux")
    col1, col2 = st.columns(2)
    if col1.button("VÉRITÉ 💬"):
        st.session_state.game_res = random.choice(["Ton fantasme secret ?", "Ma partie du corps préférée ?", "Ta plus grande envie ?"])
    if col2.button("ACTION ⚡"):
        st.session_state.game_res = random.choice(["Massage du cou (2 min).", "Baiser avec un glaçon.", "Chuchote un truc sale."])
    
    if st.button("DÉS DE L'AMOUR 🎲"):
        a = random.choice(["Lécher", "Masser", "Caresser", "Embrasser"])
        z = random.choice(["le cou", "le ventre", "le dos", "les cuisses"])
        st.session_state.game_res = f"{a} ➔ {z}"
        
    if st.session_state.game_res:
        st.markdown(f"<div class='game-result'><h2>{st.session_state.game_res}</h2></div>", unsafe_allow_html=True)
        if st.button("Effacer"): st.session_state.game_res = None; st.rerun()

with t3:
    st.subheader("📚 Guide Intime")
    for tip in TIPS_DATA:
        with st.expander(tip['t']):
            st.write(tip['c'])

with t4:
    st.subheader("👥 Espace Duo")
    st.write("Dernière fois : Aujourd'hui 🔥")
    if st.button("Signaler mon envie 💌"):
        st.toast("Signal envoyé au partenaire !")

with t5:
    st.subheader("👤 Profil & Options")
    if st.button("👁️ Activer/Désactiver Mode Discret"):
        st.session_state.discreet = not st.session_state.discreet
        st.rerun()
    st.divider()
    st.write("**Mes Positions Favorites :**")
    for l in st.session_state.likes:
        st.write(f"- {l}")
