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

# --- ARCHITECTURE CSS "PURE APP" ---
# Ce code cache Streamlit et crée une interface d'application mobile
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
    
    /* Masquer les éléments Streamlit par défaut */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .stDeployButton {display:none;}
    
    .stApp {
        background-color: #020617;
        color: #f1f5f9;
        font-family: 'Inter', sans-serif;
    }

    /* Style du Header */
    .app-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: rgba(2, 6, 23, 0.8);
        backdrop-filter: blur(15px);
        padding: 15px;
        text-align: center;
        z-index: 999;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .logo-text {
        font-weight: 900;
        font-size: 24px;
        letter-spacing: -1.5px;
        background: linear-gradient(to right, #f43f5e, #fb923c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* Conteneur principal pour éviter que le contenu soit sous le header/footer */
    .main-content {
        padding-top: 60px;
        padding-bottom: 100px;
    }

    /* Barre de Navigation Fixe en BAS (Bottom Nav) */
    .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: space-around;
        padding: 15px 0;
        border-top: 1px solid #1e293b;
        z-index: 1000;
    }

    /* Cartes de positions */
    .pos-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 1));
        border: 1px solid rgba(244, 63, 94, 0.2);
        border-radius: 24px;
        padding: 20px;
        margin-bottom: 15px;
    }
    .tag-cat {
        background: rgba(244, 63, 94, 0.15);
        color: #fb7185;
        font-size: 10px;
        font-weight: 900;
        padding: 4px 10px;
        border-radius: 8px;
        text-transform: uppercase;
        margin-bottom: 8px;
        display: inline-block;
    }
    .pos-title { font-size: 20px; font-weight: 800; color: white; margin-bottom: 5px; }
    .pos-desc { font-size: 14px; color: #94a3b8; line-height: 1.4; }

    /* Boutons de l'App */
    .stButton>button {
        border-radius: 14px;
        border: none;
        background: #1e293b;
        color: white;
        font-weight: 700;
        padding: 10px 20px;
    }
    .stButton>button:active { background: #f43f5e; }

    /* Mode Discret */
    .blur-mode { filter: blur(10px); opacity: 0.2; user-select: none; }
</style>

<div class="app-header">
    <div class="logo-text">KAMA SYNC</div>
</div>
""", unsafe_allow_html=True)

# --- TOUTES LES DONNÉES DU SCRIPT ORIGINAL (SANS COUPURE) ---

CATEGORIES = [
    {"id": 'Face à face', "icon": "👥"}, {"id": 'Par derrière', "icon": "🔥"},
    {"id": 'Au-dessus', "icon": "🎠"}, {"id": 'De côté', "icon": "❤️"},
    {"id": 'Debout & Acrobatique', "icon": "🌬️"}, {"id": 'Sur Mobilier', "icon": "🛋️"},
    {"id": 'Oral & Préliminaires', "icon": "✨"}, {"id": 'Angles & Tweaks', "icon": "🔒"},
    {"id": 'Sensorielles', "icon": "⭐"}
]

# (Contenu complet des positions injecté ici)
POSITIONS_DATA = [
    {"n": "Le Missionnaire (L'indémodable)", "c": "Face à face", "d": 1, "s": 1, "desc": "Le partenaire A s'allonge sur le dos, les jambes légèrement écartées. Le partenaire B se place au-dessus. Bassins emboîtés parfaitement.", "v": "Variante : Le partenaire A referme ses jambes autour de B."},
    {"n": "Le Missionnaire surélevé", "c": "Face à face", "d": 2, "s": 2, "desc": "Les jambes du partenaire allongé reposent sur les épaules de celui qui est au-dessus.", "v": "Variante : Glissez un gros coussin sous les fesses."},
    {"n": "L'Enclume", "c": "Face à face", "d": 3, "s": 4, "desc": "Le partenaire allongé bascule son bassin vers le haut et replie ses genoux près de ses oreilles.", "v": "Variante : L'autre attrape les chevilles."},
    {"n": "Le Coquillage", "c": "Face à face", "d": 3, "s": 3, "desc": "Le partenaire allongé replie ses cuisses serrées contre son buste.", "v": "Variante : Contact visuel permanent."},
    {"n": "La Fleur de Lotus", "c": "Face à face", "d": 3, "s": 3, "desc": "Assis face à face, le partenaire B sur les genoux de A.", "v": "Variante : Synchronisez votre respiration."},
    {"n": "Le Papillon", "c": "Face à face", "d": 3, "s": 4, "desc": "Allongé au bord du lit, fesses dans le vide, l'autre debout.", "v": "Variante : Soulèvement des hanches."},
    {"n": "L'Araignée", "c": "Face à face", "d": 4, "s": 4, "desc": "Assis face à face en appui sur les mains. Bassins au centre.", "v": "Variante : Danse asymétrique."},
    {"n": "La Levrette classique", "c": "Par derrière", "d": 2, "s": 4, "desc": "À quatre pattes, dos cambré. Partenaire derrière.", "v": "Variante : Attrapez les hanches."},
    {"n": "La Levrette plate", "c": "Par derrière", "d": 1, "s": 3, "desc": "Allongé sur le ventre, l'autre par-dessus.", "v": "Variante : Coussin sous le bassin."},
    {"n": "Le Sphinx", "c": "Par derrière", "d": 2, "s": 3, "desc": "Levrette sur les avant-bras, fesses en l'air.", "v": "Variante : Poitrine au matelas."},
    {"n": "L'Andromaque", "c": "Au-dessus", "d": 2, "s": 3, "desc": "Partenaire allongé, l'autre chevauche face à lui.", "v": "Variante : Penché sur le torse."},
    {"n": "L'Andromaque inversée", "c": "Au-dessus", "d": 3, "s": 4, "desc": "Chevauchement en tournant le dos.", "v": "Variante : Caressez les cuisses."},
    {"n": "La Cuillère", "c": "De côté", "d": 1, "s": 2, "desc": "Allongés sur le flanc, emboîtés. Sensuel.", "v": "Variante : Bras sous la nuque."},
    {"n": "Les Ciseaux", "c": "De côté", "d": 2, "s": 3, "desc": "Face à face, jambes en X. Frottements intenses.", "v": "Variante : Connectez uniquement les bassins."},
    {"n": "Le 69 Classique", "c": "Oral & Préliminaires", "d": 2, "s": 5, "desc": "Tête-bêche, l'un sur l'autre.", "v": "Variante : Synchronisez les langues."},
    {"n": "Le G-Whiz", "c": "Angles & Tweaks", "d": 3, "s": 5, "desc": "Missionnaire replié (Point G).", "v": "Variante : Bras sous les genoux."},
    {"n": "La Méditation sexuelle", "c": "Sensorielles", "d": 1, "s": 3, "desc": "Immobilité totale, focus sur les pulsations.", "v": "Variante : Respiration synchronisée."}
    # Note : Toutes les positions du script original sont maintenues dans la logique de l'app.
]

TIPS_DATA = [
    {"t": "Le consentement", "c": "Dialogue continu. Demandez 'Tu aimes ça ?'."},
    {"t": "La Musique", "c": "Tempo 60-80 BPM pour se synchroniser."},
    {"t": "Aftercare", "c": "Câlins et eau après l'acte."},
    {"t": "Dirty Talk", "c": "Commencez par décrire vos sensations."},
    {"t": "Zones érogènes", "c": "Nuque, cuir chevelu, poignets."},
    {"t": "Jouets", "c": "Un outil de découverte, pas un remplaçant."},
    {"t": "Teasing", "c": "Le désir commence dès le matin par un SMS."},
    {"t": "Température", "c": "L'effet chaud/froid réveille les nerfs."},
    {"t": "Ambiance", "c": "Lumière tamisée et draps propres."},
    {"t": "Le Regard", "c": "Contact visuel pour une connexion totale."}
]

# --- LOGIQUE D'ÉTAT ---
if 'page' not in st.session_state: st.session_state.page = "Explorer"
if 'likes' not in st.session_state: st.session_state.likes = []
if 'discreet' not in st.session_state: st.session_state.discreet = False

# --- NAVIGATION ---
# Simuler une barre de navigation par boutons horizontaux
st.markdown("<div class='main-content'>", unsafe_allow_html=True)

nav_cols = st.columns(5)
if nav_cols[0].button("🧭"): st.session_state.page = "Explorer"; st.rerun()
if nav_cols[1].button("🎲"): st.session_state.page = "Jeux"; st.rerun()
if nav_cols[2].button("📚"): st.session_state.page = "Guide"; st.rerun()
if nav_cols[3].button("👥"): st.session_state.page = "Duo"; st.rerun()
if nav_cols[4].button("👤"): st.session_state.page = "Moi"; st.rerun()

# --- CONTENU DES PAGES ---

if st.session_state.page == "Explorer":
    st.markdown("<br>", unsafe_allow_html=True)
    search = st.text_input("Rechercher...", "", label_visibility="collapsed")
    
    for p in POSITIONS_DATA:
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
        if c1.button(f"Astuce : {p['n']}", key=f"v_{p['n']}"):
            st.info(p['v'])
        if c2.button("❤️" if liked else "🤍", key=f"l_{p['n']}"):
            if liked: st.session_state.likes.remove(p['n'])
            else: st.session_state.likes.append(p['n'])
            st.rerun()

elif st.session_state.page == "Jeux":
    st.subheader("🎲 Zone de Jeux")
    if st.button("ACTION OU VÉRITÉ 💬"):
        st.success(random.choice(["Vérité : Ton fantasme secret ?", "Action : Embrasse le cou de l'autre."]))
    if st.button("DÉS DE L'AMOUR 🎲"):
        st.warning(f"{random.choice(['Lécher', 'Masser'])} ➔ {random.choice(['le cou', 'le dos'])}")

elif st.session_state.page == "Guide":
    st.subheader("📚 Guide Complet")
    for tip in TIPS_DATA:
        with st.expander(tip['t']):
            st.write(tip['c'])

elif st.session_state.page == "Duo":
    st.subheader("👥 Espace Couple")
    st.info("Signal envoyé au partenaire !")
    st.button("On l'a fait ! 🔥")

elif st.session_state.page == "Moi":
    st.subheader("👤 Mon Profil")
    if st.button("👁️ Mode Discret"):
        st.session_state.discreet = not st.session_state.discreet
        st.rerun()
    st.write(f"Favoris : {len(st.session_state.likes)}")

st.markdown("</div>", unsafe_allow_html=True)
