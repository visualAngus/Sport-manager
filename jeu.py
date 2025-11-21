import sql_conn
import random
import os
from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich.panel import Panel 
from rich.text import Text
from rich.prompt import Prompt



def choix_multiple(options, prompt=" Choisissez votre MANAGER :"):
    print("\033c", end="")
    for idx, option in enumerate(options, start=1):
        console.print(f"[cyan]{idx}.[/cyan] {option}")
    choice = Prompt.ask(prompt, choices=[str(i) for i in range(1, len(options) + 1)])
    return options[int(choice) - 1]

def affichage_equipes(liste_equipe, prompt=" Choisissez votre EQUIPE :"):
    for idx, option in enumerate(liste_equipe, start=1):
        console.print(f"[cyan]{idx}.[/cyan] {option[0]} {option[1]}/{option[2]}")
    choice = Prompt.ask(prompt, choices=[str(i) for i in range(1, len(liste_equipe) + 1)])
    return choice
    
def question_generale(prompt="",question= None):
    if question:
        console.print(Panel.fit(question, title="QUESTION", border_style="red"))
    choix = Prompt.ask(prompt, choices=["o", "n"])
    if choix == "o":
        return True
    else:
        return False


def menu_accueil():
    """
    Affiche le menu d'accueil du jeu.

    - Choisir son manager et commencer la partie.
    """
    print("\033c", end="")

    print(" BIENVENUE DANS SPORT MANAGER ")

    liste_manager = sql_conn.get_all_manageurs(conn)
    liste_prenom = []
    for manager in liste_manager:
        liste_prenom.append(manager[0])

    choix_user =choix_multiple(liste_prenom)
    id_manager = sql_conn.get_manager_id_from_nom(conn,choix_user)[0][0]
    print(f" Vous avez choisi : {choix_user}")

    return id_manager



def menu_principal(id_manager):
    """
    - Le joueur peut gérer son équipe, gérer sa progression et ses matchs, ou quitter.
    """
    print("\033c", end="")

    rq = sql_conn.get_data_equipes_by_managers(conn,id_manager)
    affichage_equipes(rq)

    # changer_equipe = Prompt.ask(" Voulez-vous gérer votre équipe ? (o/n)", choices=["o", "n"])
    gerer_equipe = question_generale(question=" Voulez-vous gérer votre équipe ?")
    if gerer_equipe:
        gestion_equipe()
    else:
        gestion_match_progression()
    
    

def gestion_equipe():
    """
    Afficher menu gestion équipe.
    Gérer les entités (joueurs, équipes, postes).
    Si le manager modifie les joueurs, demander à l'utilisateur ce qu'il veut modifier (poste).
    Retour au menu principal.
    """
    liste_possibilites = ["Ajouter un joueur", "Changer la composition de l'équipe", "Retour au menu principal"]
    choix = choix_multiple(liste_possibilites, prompt=" Que voulez-vous faire ?")
    print(choix)



    

def changement_joueur():
    changement_joueur = Prompt.ask(" Voulez-vous changer un joueur ? (Oui/Non)", choices=["o", "n"])
    
        
    
    
def choix_equipe():
    choix = Prompt.ask(" Quelle composition voulez-vous jouer ? (Offensive/Défensive/Milieu)", choices=["o", "d", "p"])
    if choix == "o":
        print(" Votre équipe sera offensive")
    elif choix == "d":
        print(" Votre équipe sera défensive")
    else:
        print(" Votre équipe sera polyvalente")

    choix_equipe()
    


    

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
    console = Console()
    conn = sql_conn.init_connection()
    id_manager = menu_accueil()
    menu_principal(id_manager)