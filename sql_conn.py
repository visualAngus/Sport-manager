import sqlite3

def init_connection():
    conn = sqlite3.connect("sport_manager.db")
    return conn

def get_all_manageurs(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM manageur")
    return cursor.fetchall()

def get_equipes_by_manageur(conn, manageur_id):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM equipes WHERE id_manageur = ?", (manageur_id,))
    return cursor.fetchall()

def get_all_joueurs_by_equipe(conn, equipe_id):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM joueurs WHERE id_equipe = ?", (equipe_id,))
    return cursor.fetchall()

conn = init_connection()
for i in get_all_joueurs_by_equipe(conn, get_equipes_by_manageur(conn, 1)[0][0]):
    print(i)