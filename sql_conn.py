import sqlite3
from rich.console import Console
from rich.prompt import Prompt

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
    cursor.execute(f"SELECT id FROM manageur WHERE NOM = '{nom}'")
    return cursor.fetchall()

def get_data_equipes_by_managers(conn,id_manager):
    cursor = conn.cursor()
    cursor.execute(f"""SELECT E.NOM , SUM(j.BLESSE), COUNT(j.NOM), E.id
                        FROM EQUIPES E 
                        INNER JOIN JOUEURS j on j.id_equipe = E.id 
                        where E.id_manageur = {id_manager}
                        GROUP BY E.NOM""")
    return cursor.fetchall()



def get_equipes_by_manageur(conn, manageur_id):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM equipes WHERE id_manageur = ?", (manageur_id,))
    return cursor.fetchall()

def get_all_joueurs_by_equipe(conn, equipe_id):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM joueurs WHERE id_equipe = ?", (equipe_id,))
    return cursor.fetchall()

def create_player(conn,nom,prenom,poste):
    cursor = conn.cursor()
    # [viteesse, endurance, force, technique]
    random = [random.randint(50, 100) for _ in range(4)]
    cursor.execute(f"INSERT INTO JOUEURS (NOM, PRENOM, POSTE, BLESSE, id_equipe, vitesse, endurance, force, technique) VALUES ('{nom}', '{prenom}', '{poste}', 0, NULL, {random[0]}, {random[1]}, {random[2]}, {random[3]})")
    conn.commit()
    return cursor.lastrowid

def get_all_postes(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT POSTE FROM JOUEURS")
    return [row[0] for row in cursor.fetchall()]

def get_all_sans_equipe(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM JOUEURS WHERE id_equipe IS NULL")
    return cursor.fetchall()

def choix_multiple(options, prompt="Please choose an option:"):
    for idx, option in enumerate(options, start=1):
        console.print(f"[cyan]{idx}.[/cyan] {option}")
    choice = Prompt.ask(prompt, choices=[str(i) for i in range(1, len(options) + 1)])
    return options[int(choice) - 1]
