import sql_conn
import random
import os
from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich.panel import Panel 
from rich.text import Text
from rich.prompt import Prompt

console = Console()

conn = sql_conn.init_connection()

def choix_multiple(options, prompt=" Choisissez votre MANAGER :"):
    for idx, option in enumerate(options, start=1):
        console.print(f"[cyan]{idx}.[/cyan] {option}")
    choice = Prompt.ask(prompt, choices=[str(i) for i in range(1, len(options) + 1)])
    return options[int(choice) - 1]

def menu_accueil():
    """
    Affiche le menu d'accueil du jeu.

    - Choisir son manager et commencer la partie.
    """

    print(" BIENVENUE DANS SPORT MANAGER ")

    liste_manager = sql_conn.get_all_manageurs(conn)
    liste_prenom = []
    for manager in liste_manager:
        liste_prenom.append(manager[0])

    choix_user =choix_multiple(liste_prenom)
    id_manager = sql_conn.get_manager_id_from_nom(conn,choix_user)[0][0]
    print(f" Vous avez choisi :" {choix_user}"")

    return id_manager


menu_accueil()


def menu_principal():
    """
    - Le joueur peut gérer son équipe, gérer sa progression et ses matchs, ou quitter.
    """

def gestion_equipe():
    """
    Afficher menu gestion équipe.
    Gérer les entités (joueurs, équipes, postes).
    Si le manager modifie les joueurs, demander à l'utilisateur ce qu'il veut modifier (poste).
    Retour au menu principal.
    """


def gestion_match_progression():
    """
    Afficher menu gestion match équipe.
    - Séléctionner / composer équipe.
    Le match se joue.
    Voir si il y a des blessures, si oui, enregistrer la blessure, si non saisir le score et les performances.
    Mettre à jour les compétences et décompter les blessures.
    Retour au menu principal.
    """


def quitter():
    """
    Le joueur quitte le jeu.
    """




if __name__ == "__main__":
    menu_accueil