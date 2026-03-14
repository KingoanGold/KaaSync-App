import streamlit as st
import random
from datetime import datetime

# --- CONFIGURATION APP ---
st.set_page_config(page_title="KamaSync Ultra V4", layout="centered", initial_sidebar_state="collapsed")

# --- LE MOTEUR CSS "NATIVE APP" ---
# Ce code force l'interface à se comporter comme une application mobile
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
    
    /* Masquer les bordures et menus Streamlit */
    [data-testid="stHeader"], footer, #MainMenu {display:none !important;}
    .block-container {padding: 0 !important; max-width: 100% !important;}
    .stApp { background-color: #020617; font-family: 'Inter', sans-serif; }

    /* HEADER FIXE (Logo + Recherche) */
    .app-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 120px;
        background: rgba(2, 6, 23, 0.95);
        backdrop-filter: blur(10px);
        z-index: 999;
        border-bottom: 1px solid #1e293b;
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .logo-text { font-weight: 900; font-size: 26px; background: linear-gradient(to right, #f43f5e, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }

    /* MENU FIXE EN BAS (Bottom Nav) */
    .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 75px;
        background: #0f172a;
        border-top: 1px solid #1e293b;
        z-index: 999;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    /* ZONE DE CONTENU DÉFILANTE */
    .main-scroll {
        margin-top: 130px; /* Espace pour le header */
        margin-bottom: 85px; /* Espace pour le footer */
        padding: 20px;
        overflow-y: auto;
    }

    /* CARTES DES POSITIONS */
    .card {
        background: linear-gradient(135deg, #1e293b, #0f172a);
        border: 1px solid rgba(244, 63, 94, 0.2);
        border-radius: 25px;
        padding: 20px;
        margin-bottom: 20px;
    }
    .tag { background: rgba(244, 63, 94, 0.15); color: #fb7185; font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 8px; text-transform: uppercase; margin-bottom: 8px; display: inline-block; }
    .title { font-size: 20px; font-weight: 800; color: white; margin-bottom: 5px; }
    .desc { font-size: 14px; color: #94a3b8; line-height: 1.4; }

    /* BOUTONS NAVIGATION */
    .stButton>button { width: 100%; border-radius: 12px; height: 50px; background: #1e293b; border: 1px solid #334155; color: white; }
    .stButton>button:active { background: #f43f5e; border: none; }
    
    /* MODE DISCRET */
    .blur { filter: blur(15px); opacity: 0.1; }
</style>

<div class="app-header">
    <div class="logo-text">KAMA SYNC</div>
</div>
""", unsafe_allow_html=True)

# --- DONNÉES COMPLÈTES ---
if 'page' not in st.session_state: st.session_state.page = "Explorer"
if 'likes' not in st.session_state: st.session_state.likes = []
if 'discreet' not in st.session_state: st.session_state.discreet = False

POSITIONS = [
    {"n": "Le Missionnaire", "c": "Face à face", "d": 1, "s": 1, "desc": "Position classique favorisant l'intimité et les baisers.", "v": "Variante : Le partenaire A referme ses jambes autour de B."},
    {"n": "Le Missionnaire surélevé", "c": "Face à face", "d": 2, "s": 2, "desc": "Jambes sur les épaules pour une pénétration profonde.", "v": "Variante : Glissez un coussin sous les fesses."},
    {"n": "L'Enclume", "c": "Face à face", "d": 3, "s": 4, "desc": "Bassin basculé vers le haut, genoux près des oreilles.", "v": "Variante : Attrapez les chevilles."},
    {"n": "La Levrette classique", "c": "Par derrière", "d": 2, "s": 4, "desc": "À quatre pattes, dos cambré. Instinct primal.", "v": "Variante : Maintenez les hanches."},
    {"n": "La Levrette plate", "c": "Par derrière", "d": 1, "s": 3, "desc": "Allongé sur le ventre, l'autre par-dessus.", "v": "Variante : Coussin plat sous le bassin."},
    {"n": "L'Andromaque", "c": "Au-dessus", "d": 2, "s": 3, "desc": "Le partenaire chevauche face à l'autre. Contrôle total.", "v": "Variante : Penché sur le torse."},
    {"n": "La Cuillère", "c": "De côté", "d": 1, "s": 2, "desc": "Emboîtés sur le flanc. Très sensuel et calme.", "v": "Variante : Un bras sous la nuque."},
    {"n": "Le 69 Classique", "c": "Oral", "d": 2, "s": 5, "desc": "Tête-bêche pour un plaisir simultané.", "v": "Variante : Synchronisez les langues."},
    {"n": "Le G-Whiz", "c": "Angles", "d": 3, "s": 5, "desc": "Missionnaire replié ciblant le point G.", "v": "Variante : Bras sous les genoux."},
    {"n": "Le Miroir", "c": "Sensorielles", "d": 2, "s": 5, "desc": "Pratique face à une glace pour s'observer.", "v": "Variante : Regards via le reflet."}
]

TIPS = [
    {"t": "Consentement", "c": "Le dialogue est le moteur du désir."},
    {"t": "Musique", "c": "60-80 BPM pour synchroniser les cœurs."},
    {"t": "Aftercare", "c": "Câlins et eau après l'orgasme."},
    {"t": "Teasing", "c": "Le sexe commence le matin par un SMS."}
]

# --- CONTENU ---
st.markdown('<div class="main-scroll">', unsafe_allow_html=True)

if st.session_state.page == "Explorer":
    # Barre de recherche fixe dans le header (visuellement)
    search = st.text_input("🔍 Rechercher une position...", label_visibility="collapsed", placeholder="Rechercher une position...")
    
    for p in POSITIONS:
        if search and search.lower() not in p['n'].lower(): continue
        
        is_liked = p['n'] in st.session_state.likes
        blur_css = "blur" if st.session_state.discreet else ""
        
        st.markdown(f"""
        <div class="card">
            <div class="tag">{p['c']}</div>
            <div class="title {blur_css}">{p['n'] if not st.session_state.discreet else "Position Masquée"}</div>
            <div class="desc {blur_css}">{p['desc'] if not st.session_state.discreet else "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}</div>
        </div>
        """, unsafe_allow_html=True)
        
        c1, c2 = st.columns([0.8, 0.2])
        if c1.button(f"Astuce : {p['n']}", key=f"btn_{p['n']}"):
            st.info(p['v'])
        if c2.button("❤️" if is_liked else "🤍", key=f"lk_{p['n']}"):
            if is_liked: st.session_state.likes.remove(p['n'])
            else: st.session_state.likes.append(p['n'])
            st.rerun()

elif st.session_state.page == "Jeux":
    st.markdown("<h2 style='text-align:center;'>🎲 Jeux</h2>", unsafe_allow_html=True)
    if st.button("ACTION OU VÉRITÉ 💬"):
        st.success(random.choice(["Vérité : Quel est ton fantasme ?", "Action : Masse ses épaules."]))
    if st.button("DÉS DE L'AMOUR 🎲"):
        st.warning(f"{random.choice(['Lécher', 'Masser'])} ➔ {random.choice(['le cou', 'le dos'])}")

elif st.session_state.page == "Guide":
    st.markdown("<h2 style='text-align:center;'>📚 Guide</h2>", unsafe_allow_html=True)
    for tip in TIPS:
        with st.expander(tip['t']):
            st.write(tip['c'])

elif st.session_state.page == "Profil":
    st.markdown("<h2 style='text-align:center;'>👤 Profil</h2>", unsafe_allow_html=True)
    if st.button("👁️ Mode Discret : ON/OFF"):
        st.session_state.discreet = not st.session_state.discreet
        st.rerun()
    st.write(f"Tes Favoris : {len(st.session_state.likes)}")
    for l in st.session_state.likes:
        st.write(f"- {l}")

st.markdown('</div>', unsafe_allow_html=True)

# --- BOTTOM NAVIGATION (MENU FIXE) ---
st.markdown('<div class="bottom-nav">', unsafe_allow_html=True)
c1, c2, c3, c4 = st.columns(4)
with c1:
    if st.button("🧭"): st.session_state.page = "Explorer"; st.rerun()
with c2:
    if st.button("🎲"): st.session_state.page = "Jeux"; st.rerun()
with c3:
    if st.button("📚"): st.session_state.page = "Guide"; st.rerun()
with c4:
    if st.button("👤"): st.session_state.page = "Profil"; st.rerun()
st.markdown('</div>', unsafe_allow_html=True)
