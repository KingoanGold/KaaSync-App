  import streamlit as st
import random
from datetime import datetime

# --- CONFIGURATION INITIALE ---
st.set_page_config(page_title="KamaSync Ultra V4", page_icon="🔥", layout="centered", initial_sidebar_state="collapsed")

# --- DESIGN "PURE APP" (CSS AVANCÉ) ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
    
    /* Supprimer l'interface Streamlit */
    #MainMenu {visibility: hidden;}
    header {visibility: hidden;}
    footer {visibility: hidden;}
    .stDeployButton {display:none;}
    [data-testid="stHeader"] {display:none;}
    .block-container {padding-top: 0rem; padding-bottom: 0rem; max-width: 100%;}

    .stApp { background-color: #020617; color: #f1f5f9; font-family: 'Inter', sans-serif; }

    /* HEADER FIXE (LOGO + RECHERCHE) */
    .sticky-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: rgba(2, 6, 23, 0.9);
        backdrop-filter: blur(20px);
        z-index: 1000;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        padding: 10px 15px;
        text-align: center;
    }
    .logo-text { font-weight: 900; font-size: 22px; background: linear-gradient(to right, #f43f5e, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    /* MENU FIXE EN BAS (BOTTOM NAV) */
    .fixed-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #0f172a;
        display: flex;
        justify-content: space-around;
        padding: 15px 0;
        border-top: 1px solid #1e293b;
        z-index: 1000;
    }

    /* ZONE DE CONTENU DÉFILANTE */
    .scroll-content {
        margin-top: 110px; /* Espace pour le header fixe */
        margin-bottom: 100px; /* Espace pour le menu fixe */
        padding: 15px;
    }

    /* CARTES DES POSITIONS */
    .pos-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 1));
        border: 1px solid rgba(244, 63, 94, 0.2);
        border-radius: 25px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.4);
    }
    .tag-cat { background: rgba(244, 63, 94, 0.15); color: #fb7185; font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 10px; text-transform: uppercase; margin-bottom: 8px; display: inline-block; }
    .pos-title { font-size: 20px; font-weight: 800; color: white; margin-bottom: 5px; }
    .pos-desc { font-size: 14px; color: #94a3b8; line-height: 1.4; }

    /* BOUTONS NAVIGATION */
    .nav-btn { background: none; border: none; color: #64748b; font-size: 20px; cursor: pointer; }
    .nav-btn.active { color: #f43f5e; transform: scale(1.2); }

    /* MODE DISCRET */
    .blur-active { filter: blur(12px) grayscale(1); opacity: 0.1; user-select: none; }
</style>
""", unsafe_allow_html=True)

# --- ÉTAT DE L'APPLICATION ---
if 'page' not in st.session_state: st.session_state.page = "Explore"
if 'likes' not in st.session_state: st.session_state.likes = []
if 'discreet' not in st.session_state: st.session_state.discreet = False
if 'game_res' not in st.session_state: st.session_state.game_res = None
if 'query' not in st.session_state: st.session_state.query = ""

# --- TOUTES LES POSITIONS (LISTE INTÉGRALE) ---
POSITIONS_DATA = [
    # FACE À FACE
    {"n": "Le Missionnaire (L'indémodable)", "c": "Face à face", "d": 1, "s": 1, "desc": "Le partenaire A s'allonge sur le dos, les jambes légèrement écartées. Le partenaire B se place au-dessus. Bassins emboîtés parfaitement.", "v": "Variante : Le partenaire A referme ses jambes autour de B."},
    {"n": "Le Missionnaire surélevé", "c": "Face à face", "d": 2, "s": 2, "desc": "Les jambes du partenaire allongé reposent sur les épaules de celui qui est au-dessus. Ouverture maximale du bassin.", "v": "Variante : Glissez un gros coussin sous les fesses."},
    {"n": "L'Enclume", "c": "Face à face", "d": 3, "s": 4, "desc": "Le partenaire allongé sur le dos bascule son bassin vers le haut et replie ses genoux près de ses propres oreilles.", "v": "Variante : Le partenaire du dessus attrape les chevilles."},
    {"n": "Le Coquillage", "c": "Face à face", "d": 3, "s": 3, "desc": "Le partenaire allongé replie ses cuisses serrées contre son propre buste. Corps enveloppé.", "v": "Variante : Contact visuel permanent."},
    {"n": "La Fleur de Lotus", "c": "Face à face", "d": 3, "s": 3, "desc": "Assis face à face, le partenaire B s'asseyant sur les genoux de A. Mouvements lents.", "v": "Variante : Synchronisez votre respiration."},
    {"n": "Le Papillon", "c": "Face à face", "d": 3, "s": 4, "desc": "Allongé au bord du lit, fesses dans le vide, l'autre debout.", "v": "Variante : Soulèvement des hanches."},
    {"n": "L'Araignée", "c": "Face à face", "d": 4, "s": 4, "desc": "Assis face à face en appui sur les mains. Bassins au centre.", "v": "Variante : Danse asymétrique."},
    {"n": "Le Missionnaire inversé", "c": "Face à face", "d": 2, "s": 3, "desc": "Missionnaire où le partenaire du dessus garde les jambes serrées à l'intérieur.", "v": "Variante : Contact peau à peau intégral."},
    {"n": "Le Wrap", "c": "Face à face", "d": 2, "s": 3, "desc": "Allongé croise fermement ses chevilles dans le bas du dos de l'autre.", "v": "Variante : Serrez ou desserrez l'étreinte."},
    {"n": "La Montagne Magique", "c": "Face à face", "d": 2, "s": 2, "desc": "Missionnaire où le partenaire allongé plie les genoux, pieds à plat.", "v": "Variante : Poussez sur les talons."},
    {"n": "L'Étreinte du Panda", "c": "Face à face", "d": 2, "s": 2, "desc": "Assis face à face sur un canapé, partenaire B blotti dans les bras.", "v": "Variante : Mouvements circulaires très lents."},
    {"n": "L'Araignée Inversée", "c": "Face à face", "d": 4, "s": 4, "desc": "Assis face à face, les jambes de l'un passent sous les aisselles de l'autre.", "v": "Variante : L'un s'allonge doucement en arrière."},
    
    # PAR DERRIÈRE
    {"n": "La Levrette classique", "c": "Par derrière", "d": 2, "s": 4, "desc": "À quatre pattes, dos cambré. Partenaire derrière à genoux.", "v": "Variante : Attrapez les hanches pour guider."},
    {"n": "La Levrette plate", "c": "Par derrière", "d": 1, "s": 3, "desc": "Allongé sur le ventre, l'autre par-dessus.", "v": "Variante : Coussin plat sous le bassin."},
    {"n": "Le Chien de chasse", "c": "Par derrière", "d": 3, "s": 4, "desc": "En levrette, le receveur tend une jambe vers l'arrière.", "v": "Variante : Tendez la jambe vers le plafond."},
    {"n": "Le Sphinx", "c": "Par derrière", "d": 2, "s": 3, "desc": "Levrette sur les avant-bras, fesses bien en l'air.", "v": "Variante : Poitrine au matelas."},
    {"n": "La Grenouille", "c": "Par derrière", "d": 2, "s": 4, "desc": "Plat ventre, genoux écartés au maximum vers l'extérieur.", "v": "Variante : Pressez l'intérieur des cuisses."},
    {"n": "Le Toboggan", "c": "Par derrière", "d": 3, "s": 4, "desc": "À genoux avec buste redressé, cambré en arrière.", "v": "Variante : Entourez le buste."},
    {"n": "La Levrette debout", "c": "Par derrière", "d": 4, "s": 5, "desc": "Penché en avant sur un mur ou une table. L'autre debout derrière.", "v": "Variante : Jambes bien droites."},
    {"n": "La Levrette au bord du lit", "c": "Par derrière", "d": 2, "s": 4, "desc": "À quatre pattes sur le matelas, l'autre debout sur le sol.", "v": "Variante : Maintenez les cuisses."},
    {"n": "Le Lazy Dog", "c": "Par derrière", "d": 1, "s": 2, "desc": "Levrette sans effort : l'autre s'affale sur le dos.", "v": "Variante : Mains sous le ventre."},
    {"n": "La Levrette croisée", "c": "Par derrière", "d": 3, "s": 4, "desc": "À quatre pattes, receveur croise les chevilles.", "v": "Variante : Alternez croisement."},
    {"n": "La Luge", "c": "Par derrière", "d": 3, "s": 3, "desc": "Allongé sur le ventre, l'autre à califourchon.", "v": "Variante : Massez les épaules."},

    # AU-DESSUS
    {"n": "L'Andromaque", "c": "Au-dessus", "d": 2, "s": 3, "desc": "Partenaire allongé, l'autre chevauche face à lui.", "v": "Variante : Penché sur le torse."},
    {"n": "L'Andromaque inversée", "c": "Au-dessus", "d": 3, "s": 4, "desc": "Chevauchement en tournant le dos.", "v": "Variante : Caressez les cuisses."},
    {"n": "La Cow-girl rodéo", "c": "Au-dessus", "d": 3, "s": 4, "desc": "Andromaque avec rotations du bassin.", "v": "Variante : Haut en bas alternatif."},
    {"n": "L'Amazone accroupie", "c": "Au-dessus", "d": 4, "s": 5, "desc": "Chevauchement accroupi sur les pieds.", "v": "Variante : Saisissez les hanches."},
    {"n": "La Cavalière de l'espace", "c": "Au-dessus", "d": 3, "s": 3, "desc": "Penché en arrière jusqu'à toucher les genoux.", "v": "Variante : Soulèvement du bassin."},
    {"n": "Le Bridge", "c": "Au-dessus", "d": 4, "s": 4, "desc": "Partenaire supérieur en forme de pont.", "v": "Variante : Rapprochez mains et pieds."},
    {"n": "La Chaise à bascule", "c": "Au-dessus", "d": 2, "s": 2, "desc": "Andromaque avec mouvements d'avant en arrière.", "v": "Variante : Stabilisez avec les épaules."},
    {"n": "Le Rodéo inversé", "c": "Au-dessus", "d": 4, "s": 5, "desc": "Andromaque inversé penché vers les mollets.", "v": "Variante : Pliez les genoux."},
    {"n": "La Sirène", "c": "Au-dessus", "d": 2, "s": 3, "desc": "Chevauchement jambes serrées sur le côté.", "v": "Variante : Frottement extérieur."},
    {"n": "La Monteuse", "c": "Au-dessus", "d": 3, "s": 4, "desc": "Allongé genoux repliés, l'autre s'assoit en l'air.", "v": "Variante : Croisez les chevilles."},
    {"n": "L'Arc de Triomphe", "c": "Au-dessus", "d": 4, "s": 5, "desc": "Allongé fait un pont complet, l'autre chevauche.", "v": "Variante : Traversin sous les lombaires."},

    # DE CÔTÉ
    {"n": "La Cuillère", "c": "De côté", "d": 1, "s": 2, "desc": "Allongés sur le flanc, emboîtés. Sensuel.", "v": "Variante : Bras sous la nuque."},
    {"n": "La Cuillère inversée", "c": "De côté", "d": 1, "s": 2, "desc": "Allongés face à face. Pénétration par décalage.", "v": "Variante : Entremêlez une jambe."},
    {"n": "Les Ciseaux", "c": "De côté", "d": 2, "s": 3, "desc": "Face à face, jambes en X. Frottements.", "v": "Variante : Éloignez les torses."},
    {"n": "Le 69 latéral", "c": "De côté", "d": 2, "s": 4, "desc": "Tête-bêche pour oral, sur le côté.", "v": "Variante : Pliez les genoux."},
    {"n": "Le Tire-bouchon", "c": "De côté", "d": 3, "s": 4, "desc": "L'un sur le dos, l'autre perpendiculaire.", "v": "Variante : Tirez les hanches."},
    {"n": "L'Étau", "c": "De côté", "d": 2, "s": 3, "desc": "En cuillère, jambes verrouillées autour.", "v": "Variante : Contrez la poussée."},
    {"n": "La Cuillère surélevée", "c": "De côté", "d": 2, "s": 3, "desc": "Cuillère avec jambe supérieure levée.", "v": "Variante : Attrapez la jambe."},
    {"n": "Le V incliné", "c": "De côté", "d": 3, "s": 3, "desc": "Sur le flanc, bustes en V, bassins connectés.", "v": "Variante : Regard par-dessus l'épaule."},
    {"n": "Le Croissant de lune", "c": "De côté", "d": 2, "s": 2, "desc": "Cuillère avec corps courbés en arc.", "v": "Variante : Massez la nuque."},
    {"n": "Le Noeud amoureux", "c": "De côté", "d": 3, "s": 3, "desc": "Face à face, jambes enlacées.", "v": "Variante : Balancement synchronisé."},
    {"n": "L'Étoile Filante", "c": "De côté", "d": 2, "s": 3, "desc": "Sur le dos, l'autre sur le côté en T.", "v": "Variante : Main sous les reins."},

    # DEBOUT & ACROBATIQUE
    {"n": "Le Poteau", "c": "Debout & Acrobatique", "d": 4, "s": 4, "desc": "Dos au mur, debout. Face à face.", "v": "Variante : Enroulez la jambe."},
    {"n": "L'Ascenseur", "c": "Debout & Acrobatique", "d": 5, "s": 5, "desc": "Le partenaire debout porte l'autre.", "v": "Variante : Adossez-vous au mur."},
    {"n": "Le Rocking-chair", "c": "Debout & Acrobatique", "d": 3, "s": 3, "desc": "Sur chaise solide, l'autre chevauche.", "v": "Variante : Pieds sur l'assise."},
    {"n": "La Balançoire", "c": "Debout & Acrobatique", "d": 4, "s": 4, "desc": "Sur meuble haut, l'autre debout.", "v": "Variante : Tête en arrière dans le vide."},
    {"n": "Le Stand and Deliver", "c": "Debout & Acrobatique", "d": 3, "s": 4, "desc": "Receveur sur table, fesses au bord.", "v": "Variante : Jambes sur les épaules."},
    {"n": "La Danse du ventre", "c": "Debout & Acrobatique", "d": 4, "s": 3, "desc": "Debout face à face, ondulations.", "v": "Variante : Tournez sur vous-mêmes."},
    {"n": "Le T de la victoire", "c": "Debout & Acrobatique", "d": 5, "s": 5, "desc": "Porté à l'horizontale par les hanches.", "v": "Variante : Appui sur le mur."},
    {"n": "Le X debout", "c": "Debout & Acrobatique", "d": 4, "s": 4, "desc": "Dos au mur, bras et jambes en X.", "v": "Variante : Poitrine contre mur."},
    {"n": "Le Saut de l'ange", "c": "Debout & Acrobatique", "d": 5, "s": 5, "desc": "Porté avec cambrure en arrière.", "v": "Variante : Soutien du bas du dos."},
    {"n": "Le Porté en berceau", "c": "Debout & Acrobatique", "d": 5, "s": 4, "desc": "Porté à l'horizontale dans les bras.", "v": "Variante : Marchez lentement."},
    {"n": "La Brouette", "c": "Debout & Acrobatique", "d": 5, "s": 5, "desc": "Sur les mains, l'autre tient les chevilles.", "v": "Variante : Coussins sous les poignets."},

    # SUR MOBILIER
    {"n": "Le Fauteuil de bureau", "c": "Sur Mobilier", "d": 2, "s": 3, "desc": "Actif sur siège à roulettes, l'autre chevauche.", "v": "Variante : Poussez avec les pieds."},
    {"n": "L'Accoudoir", "c": "Sur Mobilier", "d": 3, "s": 4, "desc": "Bassin sur l'accoudoir pour surélever.", "v": "Variante : Tête vers l'assise."},
    {"n": "La Table de cuisine", "c": "Sur Mobilier", "d": 2, "s": 4, "desc": "Assis au bord de table, l'autre debout.", "v": "Variante : Dégagez tout d'un revers."},
    {"n": "Le Tabouret de bar", "c": "Sur Mobilier", "d": 3, "s": 3, "desc": "Perché sur tabouret haut.", "v": "Variante : Glissement entre jambes."},
    {"n": "Le Bureau", "c": "Sur Mobilier", "d": 3, "s": 4, "desc": "Penché en avant, entrée par derrière.", "v": "Variante : Agrippez les rebords."},
    {"n": "Le Canapé profond", "c": "Sur Mobilier", "d": 2, "s": 2, "desc": "Suivant la forme en L d'angle.", "v": "Variante : Accoudoirs repose-pieds."},
    {"n": "Le Repose-pieds", "c": "Sur Mobilier", "d": 3, "s": 3, "desc": "Pouf sous le bassin au sol.", "v": "Variante : Épaules au sol."},
    {"n": "L'Escalier", "c": "Sur Mobilier", "d": 4, "s": 5, "desc": "Exploitez les marches.", "v": "Variante : Tête vers le bas."},
    {"n": "La Chaise longue", "c": "Sur Mobilier", "d": 2, "s": 3, "desc": "Inclinaison parfaite reposante.", "v": "Variante : Étreinte sous transat."},
    {"n": "Le Lit à baldaquin", "c": "Sur Mobilier", "d": 3, "s": 4, "desc": "Agrippez-vous aux montants.", "v": "Variante : Attaches en soie."},
    {"n": "La balade en forêt", "c": "Sur Mobilier", "d": 3, "s": 4, "desc": "Rebord de fenêtre ou comptoir.", "v": "Variante : Appui contre vitre froide."},
    {"n": "Le Plongeoir", "c": "Sur Mobilier", "d": 4, "s": 4, "desc": "Hanches au bord du matelas, vide.", "v": "Variante : Coincez les jambes."},

    # ORAL & PRÉLIMINAIRES
    {"n": "Le 69 Classique", "c": "Oral & Préliminaires", "d": 2, "s": 5, "desc": "Tête-bêche, l'un sur l'autre.", "v": "Variante : Synchronisez langues."},
    {"n": "Le 69 Inversé", "c": "Oral & Préliminaires", "d": 3, "s": 5, "desc": "Tête-bêche, dessus tourne le dos.", "v": "Variante : Caressez vos cuisses."},
    {"n": "Le 69 Debout", "c": "Oral & Préliminaires", "d": 5, "s": 5, "desc": "Porté tête en bas le long du corps.", "v": "Variante : Contre un mur."},
    {"n": "Le Lotus Oral", "c": "Oral & Préliminaires", "d": 3, "s": 4, "desc": "Assis en tailleur, l'autre devant.", "v": "Variante : Caressez la nuque."},
    {"n": "Le 69 sur le côté", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Tête-bêche sur le côté. Reposant.", "v": "Variante : Pliez jambe du dessus."},
    {"n": "La Cascade Orale", "c": "Oral & Préliminaires", "d": 3, "s": 5, "desc": "Tête pendante au bord du lit.", "v": "Variante : Doucement."},
    {"n": "Le Trône (sur chaise)", "c": "Oral & Préliminaires", "d": 1, "s": 4, "desc": "Receveur sur fauteuil, actif genoux.", "v": "Variante : Guidez tête avec mains."},
    {"n": "Le Baiser Polaire", "c": "Oral & Préliminaires", "d": 1, "s": 5, "desc": "Glaçon en bouche avant stimulation.", "v": "Variante : Alternez thé chaud."},
    {"n": "La Tête Bêche Assise", "c": "Oral & Préliminaires", "d": 3, "s": 4, "desc": "69 assis en équilibre sur fesses.", "v": "Variante : Soutien dos mutuel."},
    {"n": "Le Plongeon", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Plat ventre, oral par arrière.", "v": "Variante : Jambe vers extérieur."},
    {"n": "L'Oral en V", "c": "Oral & Préliminaires", "d": 2, "s": 3, "desc": "Sur dos, chevilles sur épaules.", "v": "Variante : Massage intérieur cuisses."},
    {"n": "La Soumission Douce", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Poignets attachés, abandon total.", "v": "Variante : Yeux bandés."},
    {"n": "Le Face à Face Oral", "c": "Oral & Préliminaires", "d": 4, "s": 5, "desc": "Sur meuble, visages proches.", "v": "Variante : Contact visuel."},
    {"n": "La Lèche-Vitrine", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Oral face à miroir pour regarder.", "v": "Variante : Regard reflet."},
    {"n": "L'Oral Croisé", "c": "Oral & Préliminaires", "d": 2, "s": 3, "desc": "Allongé, l'autre perpendiculaire.", "v": "Variante : Massage épaules."},
    {"n": "Le Souffle Chaud", "c": "Oral & Préliminaires", "d": 1, "s": 3, "desc": "Souffles avant la langue.", "v": "Variante : Effleurements/souffles."},
    {"n": "Le 69 Cambré", "c": "Oral & Préliminaires", "d": 4, "s": 5, "desc": "Lève très haut son bassin.", "v": "Variante : Soutenez bassin."},
    {"n": "Le Dégustateur", "c": "Oral & Préliminaires", "d": 1, "s": 4, "desc": "Lenteur extrême, refus d'accélérer.", "v": "Variante : Bout de langue."},
    {"n": "Le Coussin d'Amour", "c": "Oral & Préliminaires", "d": 1, "s": 3, "desc": "Coussins sous bassin, accès direct.", "v": "Variante : Jambes sur épaules."},
    {"n": "La Vue Plongeante", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Receveur debout, actif genoux.", "v": "Variante : Receveur dicte rythme."},
    {"n": "L'Oral Suspendu", "c": "Oral & Préliminaires", "d": 3, "s": 5, "desc": "Tête dans vide, actif au-dessus.", "v": "Variante : Massage gorge."},
    {"n": "Le 69 Diagonale", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "En X sur lit, évite écrasement.", "v": "Variante : Têtes sur traversins."},
    {"n": "Le Papillon Oral", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Sur dos, genoux en losange.", "v": "Variante : Mains sous cuisses."},
    {"n": "La Dégustation aveugle", "c": "Oral & Préliminaires", "d": 1, "s": 5, "desc": "Yeux bandés, toucher/odorat.", "v": "Variante : Guidez tête."},
    {"n": "Le Massage Préliminaire", "c": "Oral & Préliminaires", "d": 1, "s": 3, "desc": "Massage dérivant vers intimité.", "v": "Variante : Pulpe doigts."},
    {"n": "Le 69 Incliné", "c": "Oral & Préliminaires", "d": 3, "s": 4, "desc": "Sur chaise longue, adossé.", "v": "Variante : Agrippez dossier."},
    {"n": "La Montée en Puissance", "c": "Oral & Préliminaires", "d": 1, "s": 4, "desc": "Rythme croissant brusquement.", "v": "Variante : Edging."},
    {"n": "L'Étoile Orale", "c": "Oral & Préliminaires", "d": 2, "s": 3, "desc": "Étendu en étoile, abandon.", "v": "Variante : Baisers sur branches."},
    {"n": "Le Pont Oral", "c": "Oral & Préliminaires", "d": 4, "s": 5, "desc": "Receveur en pont, actif dessous.", "v": "Variante : Appui avant-bras."},
    {"n": "Le Éveil des Sens", "c": "Oral & Préliminaires", "d": 1, "s": 4, "desc": "Objets (plume, soie) avant oral.", "v": "Variante : Faire deviner."},

    # ANGLES & TWEAKS
    {"n": "Le Missionnaire Jambes fermées", "c": "Angles & Tweaks", "d": 1, "s": 3, "desc": "Jambes serrées, actif enjambe.", "v": "Variante : Verrouillage chevilles."},
    {"n": "Le Missionnaire Jambes au ciel", "c": "Angles & Tweaks", "d": 2, "s": 4, "desc": "Jambes droites vers plafond.", "v": "Variante : Poussez vers tête."},
    {"n": "La Levrette Genoux surélevés", "c": "Angles & Tweaks", "d": 3, "s": 4, "desc": "Genoux sur coussins épais.", "v": "Variante : Écartez genoux."},
    {"n": "L'Andromaque Mains liées", "c": "Angles & Tweaks", "d": 2, "s": 5, "desc": "Mains derrière dos ou tête.", "v": "Variante : Écharpe maintien."},
    {"n": "Le G-Whiz", "c": "Angles & Tweaks", "d": 3, "s": 5, "desc": "Missionnaire replié (Point G).", "v": "Variante : Bras sous genoux."},
    {"n": "La Catherine", "c": "Angles & Tweaks", "d": 2, "s": 4, "desc": "Une jambe plat, l'autre sur épaule.", "v": "Variante : Alternez jambe."},
    {"n": "Le Triangle", "c": "Angles & Tweaks", "d": 3, "s": 3, "desc": "Bassin surélevé par coussin.", "v": "Variante : Effet piston."},
    {"n": "L'Angle droit", "c": "Angles & Tweaks", "d": 2, "s": 3, "desc": "Mollets sur épaules, angle 90°.", "v": "Variante : Massage mollets."},
    {"n": "La Compression", "c": "Angles & Tweaks", "d": 3, "s": 4, "desc": "Contractions Kegel rythmées.", "v": "Variante : Serrez cuisses."},
    {"n": "L'Expansion", "c": "Angles & Tweaks", "d": 2, "s": 2, "desc": "Sortie presque complète.", "v": "Variante : Pause avant."},

    # SENSORIELLES
    {"n": "La Méditation sexuelle", "c": "Sensorielles", "d": 1, "s": 3, "desc": "Immobile emboîtés, pulsations.", "v": "Variante : Respiration synchro."},
    {"n": "Le Slow-motion", "c": "Sensorielles", "d": 2, "s": 4, "desc": "Acte au ralenti extrême.", "v": "Variante : Bandeau yeux."},
    {"n": "La Respiration synchronisée", "c": "Sensorielles", "d": 1, "s": 2, "desc": "Inspire/Expire en même temps.", "v": "Variante : Accélérez."},
    {"n": "Le Contact visuel total", "c": "Sensorielles", "d": 1, "s": 4, "desc": "Interdiction fermer yeux.", "v": "Variante : Ne clignez qu'avec l'autre."},
    {"n": "Le Miroir", "c": "Sensorielles", "d": 2, "s": 5, "desc": "Face à glace lumineuse (voyeurisme).", "v": "Variante : Regard reflet."},
    {"n": "La Douche", "c": "Sensorielles", "d": 3, "s": 4, "desc": "Sous eau chaude. Tactile modifié.", "v": "Variante : Choc eau froide."},
    {"n": "Le Bain", "c": "Sensorielles", "d": 2, "s": 3, "desc": "Baignoire remplie, apesanteur.", "v": "Variante : Huiles/bulles."},
    {"n": "Le Tapis", "c": "Sensorielles", "d": 1, "s": 3, "desc": "Texture sur tapis ou moquette.", "v": "Variante : Vidéo feu."},
    {"n": "La Forêt", "c": "Sensorielles", "d": 4, "s": 5, "desc": "Plein air isolé, adrénaline.", "v": "Variante : Adossé arbre."},
    {"n": "L'Improvisation totale", "c": "Sensorielles", "d": 2, "s": 5, "desc": "Corps décident sans plan.", "v": "Variante : Musique rythme."},
    {"n": "Le Double Contact", "c": "Sensorielles", "d": 2, "s": 4, "desc": "Vibromasseur inséré entre deux.", "v": "Variante : Télécommande l'autre."},
    {"n": "Le Papillon de Nuit", "c": "Sensorielles", "d": 1, "s": 5, "desc": "Noir total, yeux bandés.", "v": "Variante : Instructions murmures."}
]

# --- DONNÉES : GUIDE (15 ARTICLES) ---
TIPS_DATA = [
    {"t": "Le consentement", "c": "Dialogue continu. Demandez 'Tu aimes ça ?'."},
    {"t": "La Musique", "c": "Tempo 60-80 BPM pour se synchroniser."},
    {"t": "Aftercare", "c": "Câlins et eau après l'acte."},
    {"t": "Dirty Talk", "c": "Commencez par décrire sensations."},
    {"t": "Zones érogènes", "c": "Nuque, cuir chevelu, poignets."},
    {"t": "Jouets", "c": "Outil de découverte, pas remplaçant."},
    {"t": "Teasing", "c": "SMS suggestif dès le matin."},
    {"t": "Feu et Glace", "c": "Glaçon VS huile chauffante."},
    {"t": "Ambiance", "c": "Lumière tamisée et draps propres."},
    {"t": "Le Regard", "c": "Fusion des corps par les yeux."},
    {"t": "Acrobaties", "c": "Pas de chaussettes sur parquet."},
    {"t": "Dirty Talk 2", "c": "Vocabulaire confortable mutuel."},
    {"t": "Oui/Non/Peut-être", "c": "Liste de pratiques à comparer."},
    {"t": "Massage", "c": "Effleurements. Interdit de toucher le sexe 10 min."},
    {"t": "Pannes", "c": "Normal. Riez-en ensemble."}
]

# --- HEADER FIXE ---
st.markdown(f"""
<div class="sticky-header">
    <div class="logo-text">KAMA SYNC</div>
</div>
""", unsafe_allow_html=True)

# --- ZONE DE CONTENU ---
st.markdown('<div class="scroll-content">', unsafe_allow_html=True)

if st.session_state.page == "Explore":
    search_q = st.text_input("🔍 Rechercher une position...", value=st.session_state.query, key="main_search", label_visibility="collapsed")
    st.session_state.query = search_q
    
    # Filtrer les positions
    results = [p for p in POSITIONS_DATA if search_q.lower() in p['n'].lower()]
    
    for pos in results:
        blur_css = "blur-active" if st.session_state.discreet else ""
        liked = pos['n'] in st.session_state.likes
        
        st.markdown(f"""
        <div class="pos-card">
            <div class="tag-cat">{pos['c']}</div>
            <div class="pos-title {blur_css}">{pos['n'] if not st.session_state.discreet else "Position Masquée"}</div>
            <p class="pos-desc {blur_css}">{pos['desc'] if not st.session_state.discreet else "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}</p>
        </div>
        """, unsafe_allow_html=True)
        
        c1, c2 = st.columns([0.8, 0.2])
        with c1:
            if st.button(f"Astuce : {pos['n']}", key=f"tip_{pos['n']}"):
                st.info(pos['v'])
        with c2:
            if st.button("❤️" if liked else "🤍", key=f"lk_{pos['n']}"):
                if liked: st.session_state.likes.remove(pos['n'])
                else: st.session_state.likes.append(pos['n'])
                st.rerun()

elif st.session_state.page == "Jeux":
    st.subheader("🎲 Zone de Jeux")
    col1, col2 = st.columns(2)
    if col1.button("VÉRITÉ 💬"):
        st.session_state.game_res = random.choice(["Ton fantasme secret ?", "Ma partie du corps préférée ?", "Ta plus grande envie ?"])
    if col2.button("ACTION ⚡"):
        st.session_state.game_res = random.choice(["Massage du cou (2 min).", "Baiser avec glaçon.", "Chuchote un truc sale."])
    
    if st.button("DÉS DE L'AMOUR 🎲"):
        a = random.choice(["Lécher", "Masser", "Caresser", "Embrasser"])
        z = random.choice(["le cou", "le ventre", "le dos", "les cuisses"])
        st.session_state.game_res = f"{a} ➔ {z}"
        
    if st.session_state.game_res:
        st.success(st.session_state.game_res)
        if st.button("Effacer"): st.session_state.game_res = None; st.rerun()

elif st.session_state.page == "Guide":
    st.subheader("📚 Guide Complet")
    for item in TIPS_DATA:
        with st.expander(item['t']):
            st.write(item['c'])

elif st.session_state.page == "Duo":
    st.subheader("👥 Espace Duo")
    st.info("Signal envoyé au partenaire !")
    if st.button("On l'a fait ! 🔥"):
        st.session_state.last_act = datetime.now().strftime("%d/%m/%Y")
        st.balloons()

elif st.session_state.page == "Moi":
    st.subheader("👤 Profil")
    if st.button("👁️ Mode Discret"):
        st.session_state.discreet = not st.session_state.discreet
        st.rerun()
    st.write(f"Positions Favorites : {len(st.session_state.likes)}")
    for l in st.session_state.likes:
        st.write(f"- {l}")

st.markdown('</div>', unsafe_allow_html=True)

# --- NAVIGATION FIXE (BOTTOM NAV) ---
st.markdown('<div class="fixed-nav">', unsafe_allow_html=True)
c_nav = st.columns(5)
with c_nav[0]:
    if st.button("🧭", key="nav_exp", type="secondary"): st.session_state.page = "Explore"; st.rerun()
with c_nav[1]:
    if st.button("🎲", key="nav_game", type="secondary"): st.session_state.page = "Jeux"; st.rerun()
with c_nav[2]:
    if st.button("📚", key="nav_guide", type="secondary"): st.session_state.page = "Guide"; st.rerun()
with c_nav[3]:
    if st.button("👥", key="nav_duo", type="secondary"): st.session_state.page = "Duo"; st.rerun()
with c_nav[4]:
    if st.button("👤", key="nav_me", type="secondary"): st.session_state.page = "Moi"; st.rerun()
st.markdown('</div>', unsafe_allow_html=True)
