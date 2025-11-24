import sqlite3
from rich.console import Console
from rich.prompt import Prompt
import random

console = Console()

def init_connection():
    conn = sqlite3.connect("sport_manager.db")
    return conn

def get_all_manageurs(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT NOM FROM manageur")
    return cursor.fetchall()

def get_manager_id_from_nom(conn,nom):
    cursor = conn.cursor()
    cursor.execute(f"SELECT id, NOM, PRENOM FROM manageur WHERE NOM = '{nom}'")
    return cursor.fetchall()

def get_data_equipes_by_managers(conn,id_manager):
    cursor = conn.cursor()
    cursor.execute(f"""SELECT E.NOM , SUM(j.BLESSE), COUNT(j.NOM), E.id
                        FROM EQUIPES E 
                        LEFT JOIN JOUEURS j on j.id_equipe = E.id 
                        where E.id_manageur = {id_manager}
                        GROUP BY E.NOM""")
    return cursor.fetchall()



def get_equipes_by_manageur(conn, manageur_id):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM equipes WHERE id_manageur = ?", (manageur_id,))
    return cursor.fetchall()

def get_all_joueurs_by_equipe(conn, equipe_id,a = False):
    if a:
        cursor = conn.cursor()
        cursor.execute("""
                        SELECT j.id ,CONCAT(NOM, ' ', PRENOM) AS NOM_COMPLET,p.nom_poste, j.BLESSE,j.vitesse,j.endurence,j.force,j.technique
                        FROM joueurs  j
                        INNER JOIN POSTES p on p.id = j.id_1 
                        WHERE id_equipe = ?""", (equipe_id,))
        return cursor.fetchall()
    else:
        cursor = conn.cursor()
        cursor.execute("""
                        SELECT joueurs.id ,CONCAT(NOM, ' ', PRENOM) AS NOM_COMPLET,p.nom_poste 
                        FROM joueurs 
                        INNER JOIN POSTES p on p.id = joueurs.id_1 
                        WHERE id_equipe = ?""", (equipe_id,))
        return cursor.fetchall()

def get_poste_id_by_nom(conn, poste_nom):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM POSTES WHERE nom_poste = ?", (poste_nom,))
    return cursor.fetchone()[0]

def create_player(conn,nom,prenom,poste_id,equipe_id=None):
    if equipe_id is None:
        # Fail-safe: if no team is provided, do not create the player
        return None
    cursor = conn.cursor()
    # [viteesse, endurance, force, technique]
    random_ = [random.randint(50, 100) for _ in range(4)]
    poste = get_poste_id_by_nom(conn, poste_id)
    cursor.execute(f"INSERT INTO JOUEURS (NOM, PRENOM, id_1, BLESSE, id_equipe, vitesse, endurence, force, technique) VALUES ('{nom}', '{prenom}', '{poste}', 0, {equipe_id}, {random_[0]}, {random_[1]}, {random_[2]}, {random_[3]})")
    conn.commit()
    return cursor.lastrowid

def get_all_postes(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT nom_poste FROM POSTES")
    return [row[0] for row in cursor.fetchall()]

def get_all_sans_equipe(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM JOUEURS WHERE id_equipe IS NULL")
    return cursor.fetchall()

def get_equipes_name_by_id(conn, equipe_id):
    cursor = conn.cursor()
    cursor.execute("SELECT NOM FROM EQUIPES WHERE id = ?", (equipe_id,))
    return cursor.fetchone()[0]

def get_all_equipes_except_id(conn, equipe_id):
    cursor = conn.cursor()
    cursor.execute("""
                    WITH nb_joueur_by_nom AS (
                    SELECT 
                            e.id,
                            e.nom,
                            (COUNT(j.nom) - SUM(j.blesse)) AS nb_joueur_dispo,
                            COUNT(j.nom) as nb_joueur
                        FROM equipes e
                        INNER JOIN joueurs j ON j.id_equipe = e.id
                        WHERE e.id != ?
                        GROUP BY e.id, e.nom
                    )
                    SELECT nom
                    FROM nb_joueur_by_nom
                    WHERE nb_joueur_dispo >= 5 and nb_joueur >= 5
                    """, (equipe_id,))
    return [row[0] for row in cursor.fetchall()]

def get_equipe_id_by_name(conn, equipe_name):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM EQUIPES WHERE NOM = ?", (equipe_name,))
    return cursor.fetchone()[0]

def get_all_matchs_by_equipe(conn, equipe_id):
    cursor = conn.cursor()
    cursor.execute("""
                    SELECT 
                        m.id,
                        e1.NOM AS equipe1,
                        e2.NOM AS equipe2,
                        m.SCORE1,
                        m.SCORE2
                    FROM MATCHS m
                    INNER JOIN EQUIPES e1 ON m.id_equipe1 = e1.id
                    INNER JOIN EQUIPES e2 ON m.id_equipe2 = e2.id
                    WHERE m.id_equipe1 = ? OR m.id_equipe2 = ?
                    """, (equipe_id, equipe_id))
    return cursor.fetchall()

def get_poste_name_by_id(conn, poste_id):
    cursor = conn.cursor()
    cursor.execute("SELECT nom_poste FROM POSTES WHERE id = ?", (poste_id,))
    return cursor.fetchone()[0]

def update_joueur_blessure(conn, joueur_id, blessure_status):
    cursor = conn.cursor()
    cursor.execute("UPDATE JOUEURS SET BLESSE = ? WHERE id = ?", (blessure_status, joueur_id))
    conn.commit()

def update_joueur_blessure_temps(conn):
    cursor = conn.cursor()
    cursor.execute("""
                    UPDATE JOUEURS
                    SET BLESSE = 0
                    WHERE BLESSE = 1
                    """)
    conn.commit()

def ajout_match(conn, equipe_a_id, equipe_b_id, score_a, score_b):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO MATCHS (id_equipe1, id_equipe2, SCORE1, SCORE2) VALUES (?, ?, ?, ?)", (equipe_a_id, equipe_b_id, score_a, score_b))
    conn.commit()
    return cursor.lastrowid

def choix_multiple(options, prompt="Please choose an option:"):
    for idx, option in enumerate(options, start=1):
        console.print(f"[cyan]{idx}.[/cyan] {option}")
    choice = Prompt.ask(prompt, choices=[str(i) for i in range(1, len(options) + 1)])
    return options[int(choice) - 1]

def update_joueur_poste(conn, joueur_id, nouveau_poste_id):
    cursor = conn.cursor()
    cursor.execute("UPDATE JOUEURS SET id_1 = ? WHERE id = ?", (nouveau_poste_id, joueur_id))
    conn.commit()

def create_team(conn, nom_equipe, id_manager):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO EQUIPES (NOM, id_manageur) VALUES (?, ?)", (nom_equipe, id_manager))
    conn.commit()
    return cursor.lastrowid