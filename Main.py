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

# --- DESIGN CSS "ULTRA V4" ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
    .stApp { background-color: #020617; color: #f1f5f9; font-family: 'Inter', sans-serif; }
    .main-title { font-size: 38px; font-weight: 900; letter-spacing: -2px; text-align: center; background: linear-gradient(to right, #f43f5e, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 5px; }
    .pos-card { background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 1)); border: 1px solid rgba(244, 63, 94, 0.2); border-radius: 28px; padding: 25px; margin-bottom: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
    .pos-title { font-size: 22px; font-weight: 800; color: white; }
    .pos-tag { background: rgba(244, 63, 94, 0.15); color: #fb7185; font-size: 11px; font-weight: 900; padding: 5px 12px; border-radius: 12px; text-transform: uppercase; display: inline-block; margin-bottom: 10px; }
    .stButton>button { border-radius: 15px; border: 1px solid #334155; transition: 0.3s; font-weight: 700; }
    .stButton>button:hover { border-color: #f43f5e; color: #f43f5e; }
    .blur-mode { filter: blur(10px); opacity: 0.15; user-select: none; }
</style>
""", unsafe_allow_html=True)

# --- TOUTES LES DONNÉES : POSITIONS (102 POSITIONS) ---
POSITIONS_DATA = [
    # FACE À FACE
    {"n": "Le Missionnaire (L'indémodable)", "c": "Face à face", "d": 1, "s": 1, "desc": "Le partenaire A s'allonge sur le dos, les jambes légèrement écartées. Le partenaire B se place au-dessus. Bassins emboîtés parfaitement.", "v": "Variante : Le partenaire A referme ses jambes autour de B."},
    {"n": "Le Missionnaire surélevé", "c": "Face à face", "d": 2, "s": 2, "desc": "Les jambes du partenaire allongé reposent sur les épaules de celui qui est au-dessus. Ouverture maximale du bassin.", "v": "Variante : Glissez un gros coussin sous les fesses."},
    {"n": "L'Enclume", "c": "Face à face", "d": 3, "s": 4, "desc": "Le partenaire allongé sur le dos bascule son bassin vers le haut et replie ses genoux près de ses propres oreilles.", "v": "Variante : Le partenaire du dessus attrape les chevilles."},
    {"n": "Le Coquillage", "c": "Face à face", "d": 3, "s": 3, "desc": "Le partenaire allongé replie ses cuisses serrées contre son buste. Corps enveloppé.", "v": "Variante : Contact visuel ininterrompu."},
    {"n": "La Fleur de Lotus", "c": "Face à face", "d": 3, "s": 3, "desc": "Assis face à face, le partenaire B s'asseyant sur les genoux de A. Mouvements lents.", "v": "Variante : Synchronisez votre respiration."},
    {"n": "Le Papillon", "c": "Face à face", "d": 3, "s": 4, "desc": "Le partenaire A s'allonge au bord du lit, fesses au bord du vide. B debout devant.", "v": "Variante : Glissez les mains sous les hanches."},
    {"n": "L'Araignée", "c": "Face à face", "d": 4, "s": 4, "desc": "Assis face à face, en appui arrière sur les mains. Bassins en lévitation.", "v": "Variante : Mouvements de danse asymétrique."},
    {"n": "Le Missionnaire inversé", "c": "Face à face", "d": 2, "s": 3, "desc": "Missionnaire où le partenaire du dessus garde les jambes serrées à l'intérieur.", "v": "Variante : Contact peau à peau intégral."},
    {"n": "Le Wrap", "c": "Face à face", "d": 2, "s": 3, "desc": "Allongé croise fermement ses chevilles dans le bas du dos de l'autre.", "v": "Variante : Serrez ou desserrez l'étreinte."},
    {"n": "La Montagne Magique", "c": "Face à face", "d": 2, "s": 2, "desc": "Missionnaire où le partenaire allongé plie les genoux, pieds à plat.", "v": "Variante : Poussez sur les talons."},
    {"n": "L'Étreinte du Panda", "c": "Face à face", "d": 2, "s": 2, "desc": "Assis face à face sur un canapé, partenaire B blotti dans les bras.", "v": "Variante : Mouvements circulaires très lents."},
    {"n": "L'Araignée Inversée", "c": "Face à face", "d": 4, "s": 4, "desc": "Assis face à face, les jambes de l'un passent sous les aisselles de l'autre.", "v": "Variante : L'un s'allonge doucement en arrière."},
    
    # PAR DERRIÈRE
    {"n": "La Levrette classique", "c": "Par derrière", "d": 2, "s": 4, "desc": "À quatre pattes, dos cambré. Partenaire derrière à genoux.", "v": "Variante : Attrapez les hanches pour guider."},
    {"n": "La Levrette plate", "c": "Par derrière", "d": 1, "s": 3, "desc": "Allongé sur le ventre, l'autre s'allonge par-dessus. Frictions pubiennes.", "v": "Variante : Coussin plat sous le bassin."},
    {"n": "Le Chien de chasse", "c": "Par derrière", "d": 3, "s": 4, "desc": "En levrette, le receveur tend une jambe vers l'arrière entre les jambes de l'autre.", "v": "Variante : Tendez la jambe vers le plafond."},
    {"n": "Le Sphinx", "c": "Par derrière", "d": 2, "s": 3, "desc": "Levrette sur les avant-bras, fesses bien en l'air.", "v": "Variante : Poitrine collée au matelas."},
    {"n": "La Grenouille", "c": "Par derrière", "d": 2, "s": 4, "desc": "Plat ventre, genoux écartés au maximum vers l'extérieur.", "v": "Variante : Pressez l'intérieur des cuisses."},
    {"n": "Le Toboggan", "c": "Par derrière", "d": 3, "s": 4, "desc": "À genoux avec le buste redressé à la verticale, cambré en arrière.", "v": "Variante : Entourez le buste avec vos bras."},
    {"n": "La Levrette debout", "c": "Par derrière", "d": 4, "s": 5, "desc": "Partenaire penché en avant sur un mur ou une table. L'autre debout derrière.", "v": "Variante : Jambes bien droites pour resserrer l'entrée."},
    {"n": "La Levrette au bord du lit", "c": "Par derrière", "d": 2, "s": 4, "desc": "À quatre pattes sur le matelas, l'autre debout sur le sol.", "v": "Variante : Maintenez les cuisses pour l'intensité."},
    {"n": "Le Lazy Dog", "c": "Par derrière", "d": 1, "s": 2, "desc": "Levrette sans effort : l'autre s'affale sur le dos du receveur.", "v": "Variante : Mains sous le ventre pour soutenir."},
    {"n": "La Levrette croisée", "c": "Par derrière", "d": 3, "s": 4, "desc": "À quatre pattes, receveur croise fortement les chevilles.", "v": "Variante : Alternez croisement gauche/droite."},
    {"n": "La Luge", "c": "Par derrière", "d": 3, "s": 3, "desc": "Allongé sur le ventre, l'autre s'assoit à califourchon sur les cuisses.", "v": "Variante : Massez les épaules du receveur."},

    # AU-DESSUS
    {"n": "L'Andromaque", "c": "Au-dessus", "d": 2, "s": 3, "desc": "Partenaire allongé, l'autre chevauche face à lui. Contrôle total.", "v": "Variante : Penché en avant sur le torse."},
    {"n": "L'Andromaque inversée", "c": "Au-dessus", "d": 3, "s": 4, "desc": "Chevauchement en tournant le dos au partenaire allongé.", "v": "Variante : Caressez le ventre de l'autre."},
    {"n": "La Cow-girl rodéo", "c": "Au-dessus", "d": 3, "s": 4, "desc": "Andromaque avec rotations circulaires du bassin.", "v": "Variante : Alternez rotations et haut en bas."},
    {"n": "L'Amazone accroupie", "c": "Au-dessus", "d": 4, "s": 5, "desc": "Chevauchement accroupi sur les pieds, bondissant avec les cuisses.", "v": "Variante : Saisissez les hanches pour aider."},
    {"n": "La Cavalière de l'espace", "c": "Au-dessus", "d": 3, "s": 3, "desc": "Andromaque penché complètement en arrière jusqu'à toucher les genoux.", "v": "Variante : Soulèvement du bassin opposé."},
    {"n": "Le Bridge", "c": "Au-dessus", "d": 4, "s": 4, "desc": "Partenaire supérieur en forme de pont (mains et pieds au sol).", "v": "Variante : Rapprochez mains et pieds."},
    {"n": "La Chaise à bascule", "c": "Au-dessus", "d": 2, "s": 2, "desc": "Andromaque avec mouvements d'avant en arrière (glissement).", "v": "Variante : Stabilisez avec les épaules."},
    {"n": "Le Rodéo inversé", "c": "Au-dessus", "d": 4, "s": 5, "desc": "Andromaque inversé penché en avant vers les mollets.", "v": "Variante : Pliez les genoux pour faire des prises."},
    {"n": "La Sirène", "c": "Au-dessus", "d": 2, "s": 3, "desc": "Chevauchement jambes serrées et allongées sur le côté.", "v": "Variante : Frottement extérieur des jambes."},
    {"n": "La Monteuse", "c": "Au-dessus", "d": 3, "s": 4, "desc": "Allongé genoux repliés sur le torse, l'autre s'assoit en l'air.", "v": "Variante : Croisez les chevilles derrière le dos."},
    {"n": "L'Arc de Triomphe", "c": "Au-dessus", "d": 4, "s": 5, "desc": "Allongé fait un pont complet, l'autre le chevauche.", "v": "Variante : Traversin sous les lombaires."},

    # DE CÔTÉ
    {"n": "La Cuillère", "c": "De côté", "d": 1, "s": 2, "desc": "Allongés sur le flanc, emboîtés. Câlin sensuel.", "v": "Variante : Bras sous la nuque."},
    {"n": "La Cuillère inversée", "c": "De côté", "d": 1, "s": 2, "desc": "Allongés face à face. Pénétration par décalage des bassins.", "v": "Variante : Entremêlez une seule jambe."},
    {"n": "Les Ciseaux", "c": "De côté", "d": 2, "s": 3, "desc": "Face à face, jambes entrelacées en X. Frottements intenses.", "v": "Variante : Éloignez les torses."},
    {"n": "Le 69 latéral", "c": "De côté", "d": 2, "s": 4, "desc": "Tête-bêche pour oral, allongés sur le côté.", "v": "Variante : Pliez les genoux pour approcher."},
    {"n": "Le Tire-bouchon", "c": "De côté", "d": 3, "s": 4, "desc": "L'un sur le dos, l'autre perpendiculaire sur le côté.", "v": "Variante : Tirez les hanches vers vous."},
    {"n": "L'Étau", "c": "De côté", "d": 2, "s": 3, "desc": "En cuillère, jambes verrouillées autour de la jambe inférieure.", "v": "Variante : Contrez la poussée par le recul."},
    {"n": "La Cuillère surélevée", "c": "De côté", "d": 2, "s": 3, "desc": "Cuillère avec jambe supérieure levée vers le plafond.", "v": "Variante : Attrapez la jambe levée."},
    {"n": "Le V incliné", "c": "De côté", "d": 3, "s": 3, "desc": "Sur le flanc, bustes en V, bassins connectés.", "v": "Variante : Regard par-dessus l'épaule."},
    {"n": "Le Croissant de lune", "c": "De côté", "d": 2, "s": 2, "desc": "Cuillère avec corps courbés en arc de cercle.", "v": "Variante : Massez la nuque lentement."},
    {"n": "Le Noeud amoureux", "c": "De côté", "d": 3, "s": 3, "desc": "Face à face, jambes enlacées autour des cuisses.", "v": "Variante : Balancement synchronisé."},
    {"n": "L'Étoile Filante", "c": "De côté", "d": 2, "s": 3, "desc": "L'un sur le dos, l'autre sur le côté formant un T.", "v": "Variante : Main sous le creux des reins."},

    # DEBOUT & ACROBATIQUE
    {"n": "Le Poteau", "c": "Debout & Acrobatique", "d": 4, "s": 4, "desc": "Dos au mur, debout. Accès direct face à face.", "v": "Variante : Enroulez la jambe autour de la hanche."},
    {"n": "L'Ascenseur", "c": "Debout & Acrobatique", "d": 5, "s": 5, "desc": "Le partenaire debout porte entièrement l'autre.", "v": "Variante : Adossez-vous au mur."},
    {"n": "Le Rocking-chair", "c": "Debout & Acrobatique", "d": 3, "s": 3, "desc": "Assis sur une chaise solide, l'autre chevauche face.", "v": "Variante : Pieds sur l'assise pour bondir."},
    {"n": "La Balançoire", "c": "Debout & Acrobatique", "d": 4, "s": 4, "desc": "Assis sur un meuble haut (commode), l'autre debout.", "v": "Variante : Tête dans le vide en arrière."},
    {"n": "Le Stand and Deliver", "c": "Debout & Acrobatique", "d": 3, "s": 4, "desc": "Receveur sur table, fesses au bord. Actif debout.", "v": "Variante : Jambes sur les épaules."},
    {"n": "La Danse du ventre", "c": "Debout & Acrobatique", "d": 4, "s": 3, "desc": "Debout face à face, genoux fléchis, ondulations.", "v": "Variante : Tournez sur vous-mêmes."},
    {"n": "Le T de la victoire", "c": "Debout & Acrobatique", "d": 5, "s": 5, "desc": "Porté à l'horizontale par les hanches.", "v": "Variante : Appui sur le mur avec les bras."},
    {"n": "Le X debout", "c": "Debout & Acrobatique", "d": 4, "s": 4, "desc": "Dos au mur, bras et jambes en X. Actif au centre.", "v": "Variante : Poignets plaqués contre le mur."},
    {"n": "Le Saut de l'ange", "c": "Debout & Acrobatique", "d": 5, "s": 5, "desc": "Porté avec cambrure violente en arrière, tête en bas.", "v": "Variante : Soutien ferme du bas du dos."},
    {"n": "Le Porté en berceau", "c": "Debout & Acrobatique", "d": 5, "s": 4, "desc": "Porté à l'horizontale comme un nouveau-né.", "v": "Variante : Marchez lentement pendant l'acte."},
    {"n": "La Brouette", "c": "Debout & Acrobatique", "d": 5, "s": 5, "desc": "Receveur sur les mains, l'autre tient les chevilles.", "v": "Variante : Coussins sous les poignets."},

    # SUR MOBILIER
    {"n": "Le Fauteuil de bureau", "c": "Sur Mobilier", "d": 2, "s": 3, "desc": "Actif sur siège à roulettes, l'autre chevauche.", "v": "Variante : Poussez pour faire tourner."},
    {"n": "L'Accoudoir", "c": "Sur Mobilier", "d": 3, "s": 4, "desc": "Bassin sur l'accoudoir pour surélévation.", "v": "Variante : Tête vers les coussins."},
    {"n": "La Table de cuisine", "c": "Sur Mobilier", "d": 2, "s": 4, "desc": "Assis au bord d'une table, l'autre debout devant.", "v": "Variante : Dégagez tout d'un revers de bras."},
    {"n": "Le Tabouret de bar", "c": "Sur Mobilier", "d": 3, "s": 3, "desc": "Perché sur tabouret haut, dénivelé naturel.", "v": "Variante : Glissez-vous entre les jambes."},
    {"n": "Le Bureau", "c": "Sur Mobilier", "d": 3, "s": 4, "desc": "Penché en avant sur le bureau, entrée par derrière.", "v": "Variante : Agrippez les rebords."},
    {"n": "Le Canapé profond", "c": "Sur Mobilier", "d": 2, "s": 2, "desc": "Suivant la forme en L d'un canapé d'angle.", "v": "Variante : Accoudoirs comme repose-pieds."},
    {"n": "Le Repose-pieds", "c": "Sur Mobilier", "d": 3, "s": 3, "desc": "Pouf sous le bassin du receveur allongé au sol.", "v": "Variante : Épaules au sol, cambrure inversée."},
    {"n": "L'Escalier", "c": "Sur Mobilier", "d": 4, "s": 5, "desc": "Exploitez les marches pour le dénivelé.", "v": "Variante : Tête vers le bas de l'escalier."},
    {"n": "La Chaise longue", "c": "Sur Mobilier", "d": 2, "s": 3, "desc": "Inclinaison parfaite pour missionnaire reposant.", "v": "Variante : Étreinte par-dessous le transat."},
    {"n": "Le Lit à baldaquin", "c": "Sur Mobilier", "d": 3, "s": 4, "desc": "Agrippez-vous aux montants pour la puissance.", "v": "Variante : Attaches en soie sur les montants."},
    {"n": "La balade en forêt", "c": "Sur Mobilier", "d": 3, "s": 4, "desc": "Sur rebord de fenêtre large ou comptoir.", "v": "Variante : Appui contre la vitre froide."},
    {"n": "Le Plongeoir", "c": "Sur Mobilier", "d": 4, "s": 4, "desc": "Plat ventre sur le lit, hanches au bord du vide.", "v": "Variante : Coincez les jambes sous vos bras."},

    # ORAL & PRÉLIMINAIRES (SUITE)
    {"n": "Le 69 Classique", "c": "Oral & Préliminaires", "d": 2, "s": 5, "desc": "Tête-bêche, l'un sur l'autre. Plaisir simultané.", "v": "Variante : Synchronisez les langues."},
    {"n": "Le 69 Inversé", "c": "Oral & Préliminaires", "d": 3, "s": 5, "desc": "Tête-bêche, partenaire du dessus tourne le dos.", "v": "Variante : Caressez vos propres cuisses."},
    {"n": "Le 69 Debout", "c": "Oral & Préliminaires", "d": 5, "s": 5, "desc": "Porté tête en bas le long du corps. Physique.", "v": "Variante : Contre un mur."},
    {"n": "Le Lotus Oral", "c": "Oral & Préliminaires", "d": 3, "s": 4, "desc": "Assis en tailleur, l'autre s'agenouille devant.", "v": "Variante : Caressez la nuque."},
    {"n": "Le 69 sur le côté", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Tête-bêche sur le côté. Reposant.", "v": "Variante : Pliez la jambe du dessus."},
    {"n": "La Cascade Orale", "c": "Oral & Préliminaires", "d": 3, "s": 5, "desc": "Tête pendante au bord du lit. Afflux sanguin.", "v": "Variante : Allez-y doucement."},
    {"n": "Le Trône (sur chaise)", "c": "Oral & Préliminaires", "d": 1, "s": 4, "desc": "Receveur sur fauteuil, actif à genoux (dévotion).", "v": "Variante : Guidez la tête avec les mains."},
    {"n": "Le Baiser Polaire", "c": "Oral & Préliminaires", "d": 1, "s": 5, "desc": "Glaçon en bouche avant la stimulation. Contraste.", "v": "Variante : Alternez avec du thé chaud."},
    {"n": "La Tête Bêche Assise", "c": "Oral & Préliminaires", "d": 3, "s": 4, "desc": "69 assis en équilibre sur les fesses.", "v": "Variante : Soutien du dos mutuel."},
    {"n": "Le Plongeon", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Allongé plat ventre, oral par l'arrière.", "v": "Variante : Écartez une jambe vers l'extérieur."},
    {"n": "L'Oral en V", "c": "Oral & Préliminaires", "d": 2, "s": 3, "desc": "Sur le dos, chevilles sur les épaules de l'actif.", "v": "Variante : Massage de l'intérieur des cuisses."},
    {"n": "La Soumission Douce", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Poignets attachés, abandon total à l'autre.", "v": "Variante : Bandez les yeux."},
    {"n": "Le Face à Face Oral", "c": "Oral & Préliminaires", "d": 4, "s": 5, "desc": "Assis sur meuble, actif debout. Visages proches.", "v": "Variante : Contact visuel brûlant."},
    {"n": "La Lèche-Vitrine", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Oral face à un miroir pour regarder la scène.", "v": "Variante : Regards via le reflet."},
    {"n": "L'Oral Croisé", "c": "Oral & Préliminaires", "d": 2, "s": 3, "desc": "Allongé, l'autre perpendiculaire au bassin.", "v": "Variante : Massage des épaules."},
    {"n": "Le Souffle Chaud", "c": "Oral & Préliminaires", "d": 1, "s": 3, "desc": "Souffles chauds sur la zone avant la langue.", "v": "Variante : Alternez effleurements et souffles."},
    {"n": "Le 69 Cambré", "c": "Oral & Préliminaires", "d": 4, "s": 5, "desc": "Bas du dessous lève très haut son bassin.", "v": "Variante : Soutenez le bassin levé."},
    {"n": "Le Dégustateur", "c": "Oral & Préliminaires", "d": 1, "s": 4, "desc": "Lenteur extrême, refus d'accélérer (cru).", "v": "Variante : Bout de la langue uniquement."},
    {"n": "Le Coussin d'Amour", "c": "Oral & Préliminaires", "d": 1, "s": 3, "desc": "Coussins sous le bassin pour accès direct.", "v": "Variante : Jambes sur les épaules."},
    {"n": "La Vue Plongeante", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Receveur debout, actif à genoux.", "v": "Variante : Receveur dicte le rythme."},
    {"n": "L'Oral Suspendu", "c": "Oral & Préliminaires", "d": 3, "s": 5, "desc": "Tête dans le vide, actif au-dessus (inversé).", "v": "Variante : Massage de la gorge."},
    {"n": "Le 69 Diagonale", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "En X sur le lit pour éviter l'écrasement.", "v": "Variante : Têtes sur traversins."},
    {"n": "Le Papillon Oral", "c": "Oral & Préliminaires", "d": 2, "s": 4, "desc": "Sur le dos, genoux pliés en losange.", "v": "Variante : Mains sous les cuisses."},
    {"n": "La Dégustation aveugle", "c": "Oral & Préliminaires", "d": 1, "s": 5, "desc": "Actif yeux bandés, repérage au toucher/odorat.", "v": "Variante : Receveur guide la tête."},
    {"n": "Le Massage Préliminaire", "c": "Oral & Préliminaires", "d": 1, "s": 3, "desc": "Massage à l'huile dérivant vers l'intimité.", "v": "Variante : Pulpe des doigts uniquement."},
    {"n": "Le 69 Incliné", "c": "Oral & Préliminaires", "d": 3, "s": 4, "desc": "Sur chaise longue, partenaire adossé.", "v": "Variante : Agrippez le dossier."},
    {"n": "La Montée en Puissance", "c": "Oral & Préliminaires", "d": 1, "s": 4, "desc": "Rythme croissant brusquement.", "v": "Variante : Edging avant l'orgasme."},
    {"n": "L'Étoile Orale", "c": "Oral & Préliminaires", "d": 2, "s": 3, "desc": "Étendu en étoile, abandon total.", "v": "Variante : Baisers sur chaque 'branche'."},
    {"n": "Le Pont Oral", "c": "Oral & Préliminaires", "d": 4, "s": 5, "desc": "Receveur en pont, actif se glisse dessous.", "v": "Variante : Appui sur avant-bras."},
    {"n": "Le Éveil des Sens", "c": "Oral & Préliminaires", "d": 1, "s": 4, "desc": "Utilisation d'objets (plume, soie) avant oral.", "v": "Variante : Faire deviner l'objet."},

    # ANGLES & TWEAKS
    {"n": "Le Missionnaire Jambes fermées", "c": "Angles & Tweaks", "d": 1, "s": 3, "desc": "Receveur serre les jambes, actif enjambe.", "v": "Variante : Verrouillage des chevilles."},
    {"n": "Le Missionnaire Jambes au ciel", "c": "Angles & Tweaks", "d": 2, "s": 4, "desc": "Jambes droites tendues vers le plafond.", "v": "Variante : Poussez chevilles vers la tête."},
    {"n": "La Levrette Genoux surélevés", "c": "Angles & Tweaks", "d": 3, "s": 4, "desc": "Genoux sur pile de coussins épais.", "v": "Variante : Écartez davantage genoux."},
    {"n": "L'Andromaque Mains liées", "c": "Angles & Tweaks", "d": 2, "s": 5, "desc": "Supérieur mains derrière le dos ou la tête.", "v": "Variante : Écharpe pour maintenir."},
    {"n": "Le G-Whiz", "c": "Angles & Tweaks", "d": 3, "s": 5, "desc": "Missionnaire replié, genoux aux épaules (Point G).", "v": "Variante : Bras sous les genoux."},
    {"n": "La Catherine", "c": "Angles & Tweaks", "d": 2, "s": 4, "desc": "Une jambe à plat, l'autre sur l'épaule (asymétrie).", "v": "Variante : Alternez la jambe levée."},
    {"n": "Le Triangle", "c": "Angles & Tweaks", "d": 3, "s": 3, "desc": "Bassin surélevé par coussin rigide.", "v": "Variante : Effet 'piston' redressé."},
    {"n": "L'Angle droit", "c": "Angles & Tweaks", "d": 2, "s": 3, "desc": "Mollets posés sur les épaules, angle à 90°.", "v": "Variante : Massage des mollets."},
    {"n": "La Compression", "c": "Angles & Tweaks", "d": 3, "s": 4, "desc": "Contractions Kegel rythmées sur va-et-vient.", "v": "Variante : Serrez les cuisses."},
    {"n": "L'Expansion", "c": "Angles & Tweaks", "d": 2, "s": 2, "desc": "Sortie presque complète à chaque mouvement.", "v": "Variante : Pause avant pénétration."},

    # SENSORIELLES
    {"n": "La Méditation sexuelle", "c": "Sensorielles", "d": 1, "s": 3, "desc": "Immobilité totale emboîtés, micro-pulsations.", "v": "Variante : Respiration synchronisée."},
    {"n": "Le Slow-motion", "c": "Sensorielles", "d": 2, "s": 4, "desc": "Acte au ralenti extrême (plusieurs secondes).", "v": "Variante : Bandeau sur les yeux."},
    {"n": "La Respiration synchronisée", "c": "Sensorielles", "d": 1, "s": 2, "desc": "Inspire/Expire en même temps, ventre à ventre.", "v": "Variante : Accélérez progressivement."},
    {"n": "Le Contact visuel total", "c": "Sensorielles", "d": 1, "s": 4, "desc": "Interdiction de fermer les yeux jusqu'au bout.", "v": "Variante : Ne clignez qu'avec l'autre."},
    {"n": "Le Miroir", "c": "Sensorielles", "d": 2, "s": 5, "desc": "Amour face à une grande glace (voyeurisme de soi).", "v": "Variante : Regardez l'autre via le reflet."},
    {"n": "La Douche", "c": "Sensorielles", "d": 3, "s": 4, "desc": "Sous l'eau chaude. Tactile modifié.", "v": "Variante : Choc thermique eau froide."},
    {"n": "Le Bain", "c": "Sensorielles", "d": 2, "s": 3, "desc": "Assis au fond de la baignoire, apesanteur.", "v": "Variante : Huiles essentielles/bulles."},
    {"n": "Le Tapis", "c": "Sensorielles", "d": 1, "s": 3, "desc": "Changement de texture sur tapis épais ou moquette.", "v": "Variante : Vidéo de feu de cheminée."},
    {"n": "La Forêt", "c": "Sensorielles", "d": 4, "s": 5, "desc": "Plein air isolé, adrénaline d'être surpris.", "v": "Variante : Adossé à un arbre large."},
    {"n": "L'Improvisation totale", "c": "Sensorielles", "d": 2, "s": 5, "desc": "Laissez les corps décider sans planification.", "v": "Variante : Rythme dicté par la musique."},
    {"n": "Le Double Contact", "c": "Sensorielles", "d": 2, "s": 4, "desc": "Petit vibromasseur inséré entre les deux corps.", "v": "Variante : Télécommande confiée à l'autre."},
    {"n": "Le Papillon de Nuit", "c": "Sensorielles", "d": 1, "s": 5, "desc": "Noir total, yeux bandés, toucher explosif.", "v": "Variante : Instructions murmurées."}
]

# --- DONNÉES : GUIDE (15 ARTICLES) ---
TIPS_DATA = [
    {"id": 't1', "title": "Le consentement, moteur du désir", "cat": "Communication", "content": "Le consentement n'est pas juste un 'oui' au début, c'est un dialogue continu. Demander 'tu aimes ça ?' n'est pas un tue-l'amour, c'est une sécurité. Safe Word recommandé."},
    {"id": 't2', "title": "La Musique idéale pour le lit", "cat": "Sensorielles", "content": "Cherchez des musiques entre 60 et 80 BPM. Pas de paroles (Lo-Fi, Jazz lent). Créez une playlist qui monte en intensité."},
    {"id": 't3', "title": "Réussir les positions debout", "cat": "Pratique", "content": "Pas de chaussettes sur parquet ! Utilisez un meuble comme appui de départ. Communiquez si les muscles tremblent."},
    {"id": 't4', "title": "L'art délicat de l'Aftercare", "cat": "Émotionnel", "content": "Post-orgasme : restez enlacés, apportez de l'eau, mots valorisants. Évitez le contre-coup hormonal brutal."},
    {"id": 't5', "title": "Dirty Talk : Comment oser", "cat": "Communication", "content": "Étapes : 1. Le constat (Ta peau est chaude). 2. L'instruction (Plus vite). 3. L'anticipation (Je vais te faire...)."},
    {"id": 't6', "title": "Les zones érogènes méconnues", "cat": "Sensorielles", "content": "Cuir chevelu, creux des genoux, nuque, intérieur des poignets, bas du ventre."},
    {"id": 't7', "title": "Introduire des jouets", "cat": "Pratique", "content": "Dédiabolisez l'objet : shopping en ligne à deux. Commencez par un bullet vibrant. C'est un outil, pas un remplaçant."},
    {"id": 't8', "title": "L'art du Teasing", "cat": "Préliminaires", "content": "Le sexe commence le matin : post-it, SMS suggestif, frôlements en cuisine le soir sans aller plus loin... pour l'instant."},
    {"id": 't9', "title": "Feu et Glace", "cat": "Sensorielles", "content": "Glaçon sur les lèvres/colonne vertébrale VS huile chauffante ou thé chaud avant d'embrasser."},
    {"id": 't10', "title": "Bondage Léger", "cat": "Découverte", "content": "Pas de métal (menottes). Foulards en soie ou cravates. Safe Word obligatoire. Ne jamais laisser l'autre seul."},
    {"id": 't11', "title": "Ambiance parfaite", "cat": "Général", "content": "Fuyez les plafonniers. Lumière tamisée/bougies. Rangez la pièce (draps propres). Odeur d'encens léger."},
    {"id": 't12', "title": "Le pouvoir du regard", "cat": "Connexion", "content": "Contact visuel ininterrompu = vulnérabilité extrême. Fusion des corps vertigineuse."},
    {"id": 't13', "title": "Liste Oui/Non/Peut-être", "cat": "Communication", "content": "Imprimez une liste de pratiques, cochez chacun de votre côté, comparez avec bienveillance."},
    {"id": 't14', "title": "Massage sensuel : Règles d'or", "cat": "Préliminaires", "content": "Huile réchauffée. Lenteur. Règle d'or : Interdiction de toucher les zones érogènes les 10 premières minutes."},
    {"id": 't15', "title": "Gérer les moments gênants", "cat": "Général", "content": "Bruits, crampes, pannes ? Riez-en. Le rire désamorce la pression de performance. Revenez aux caresses douces."}
]

# --- ÉTAT DE LA SESSION (SESSION STATE) ---
if 'likes' not in st.session_state: st.session_state.likes = []
if 'mood' not in st.session_state: st.session_state.mood = "playful"
if 'discreet' not in st.session_state: st.session_state.discreet = False
if 'game_res' not in st.session_state: st.session_state.game_res = None
if 'last_act' not in st.session_state: st.session_state.last_act = None

# --- UI HEADER ---
st.markdown("<h1 class='main-title'>KAMA SYNC <span style='font-size:12px; color:#94a3b8;'>ULTRA V4</span></h1>", unsafe_allow_html=True)

# Barre latérale simplifiée
with st.sidebar:
    st.title("🔥 OPTIONS")
    if st.button("👁️ Mode Discret"):
        st.session_state.discreet = not st.session_state.discreet
        st.rerun()
    st.divider()
    menu = st.radio("Navigation", ["Explorer", "Jeux", "Guide", "Duo", "Profil"])

# --- TAB : EXPLORER ---
if menu == "Explorer":
    search = st.text_input("🔍 Rechercher une position...", "", key="search_bar")
    
    cat_list = ["Toutes", "Face à face", "Par derrière", "Au-dessus", "De côté", "Debout & Acrobatique", "Sur Mobilier", "Oral & Préliminaires", "Angles & Tweaks", "Sensorielles"]
    cat_sel = st.selectbox("Catégories", cat_list)
    
    # Filtrage
    results = [p for p in POSITIONS_DATA if (cat_sel == "Toutes" or p['c'] == cat_sel) and (search.lower() in p['n'].lower())]
    
    for p in results:
        blur = "blur-mode" if st.session_state.discreet else ""
        liked = p['n'] in st.session_state.likes
        
        st.markdown(f"""
        <div class="pos-card">
            <div class="pos-tag">{p['c']}</div>
            <div class="pos-title {blur}">{p['n'] if not st.session_state.discreet else "Position Masquée"}</div>
            <p class="pos-desc {blur}">{p['desc'] if not st.session_state.discreet else "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}</p>
        </div>
        """, unsafe_allow_html=True)
        
        c1, c2 = st.columns([0.8, 0.2])
        with c1:
            if st.button(f"Astuce : {p['n']}", key=f"v_{p['n']}"):
                st.info(f"**Variante :** {p['v']}")
        with c2:
            if st.button("❤️" if liked else "🤍", key=f"l_{p['n']}"):
                if liked: st.session_state.likes.remove(p['n'])
                else: st.session_state.likes.append(p['n'])
                st.rerun()

# --- TAB : JEUX ---
elif menu == "Jeux":
    st.subheader("🎲 Zone de Jeux")
    
    col1, col2 = st.columns(2)
    if col1.button("VÉRITÉ 💬"):
        truths = ["Ton fantasme inavoué ?", "Partie de mon corps préférée ?", "Ton rêve érotique ?", "Lieu risqué rêvé ?", "Fétichisme secret ?"]
        st.session_state.game_res = random.choice(truths)
    if col2.button("ACTION ⚡"):
        dares = ["Massage du dos (3 min).", "Baiser avec glaçon.", "Bander les yeux et nourrir.", "Strip-tease sensuel.", "Baisers sur le ventre."]
        st.session_state.game_res = random.choice(dares)
        
    if st.button("DÉS DE L'AMOUR 🎲"):
        a = random.choice(["Lécher", "Masser", "Caresser", "Mordiller"])
        z = random.choice(["le cou", "le ventre", "les cuisses", "le dos"])
        d = random.choice(["30 sec", "1 min", "2 min"])
        st.session_state.game_res = f"{a} {z} pendant {d}"
        
    if st.session_state.game_res:
        st.success(st.session_state.game_res)
        if st.button("OK"): st.session_state.game_res = None; st.rerun()

# --- TAB : GUIDE ---
elif menu == "Guide":
    st.subheader("📚 Guide Complet")
    for tip in TIPS_DATA:
        with st.expander(f"{tip['title']} ({tip['cat']})"):
            st.write(tip['content'])

# --- TAB : DUO ---
elif menu == "Duo":
    st.subheader("👥 Espace Duo")
    
    st.write("### Humeur du jour")
    h_cols = st.columns(4)
    moods_lib = {"romantic":"☁️ Doux", "playful":"🎲 Joueur", "wild":"🔥 Sauvage", "tired":"💤 Pas ce soir"}
    for i, (k, v) in enumerate(moods_lib.items()):
        if h_cols[i].button(v, type="primary" if st.session_state.mood == k else "secondary"):
            st.session_state.mood = k
            st.rerun()
            
    st.divider()
    if st.button("LOG INTIMITÉ 🔥 (On l'a fait !)"):
        st.session_state.last_act = datetime.now().strftime("%d/%m/%Y")
        st.balloons()
        
    if st.session_state.last_act:
        st.write(f"Dernier moment enregistré : **{st.session_state.last_act}**")

# --- TAB : PROFIL ---
elif menu == "Profil":
    st.subheader("👤 Mon Profil")
    st.write(f"Positions favorites : **{len(st.session_state.likes)}**")
    for l in st.session_state.likes:
        st.write(f"- {l}")

st.markdown("<br><br><br><br>", unsafe_allow_html=True)
