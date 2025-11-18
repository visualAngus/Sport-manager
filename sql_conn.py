import sqlite3
from rich.console import Console
from rich.prompt import Prompt

console = Console()

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

def choix_multiple(options, prompt="Please choose an option:"):
    for idx, option in enumerate(options, start=1):
        console.print(f"[cyan]{idx}.[/cyan] {option}")
    choice = Prompt.ask(prompt, choices=[str(i) for i in range(1, len(options) + 1)])
    return options[int(choice) - 1]

choix_multiple(["Option 1", "Option 2", "Option 3"])