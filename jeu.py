import time
import sql_conn
import random
import os
from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich.panel import Panel 
from rich.text import Text
from rich.prompt import Prompt



def choix_multiple(options, prompt=" Choisissez votre MANAGER :", r=True):
    if r:
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

def affichage_joueurs(liste_joueurs, prompt=" Choisissez votre JOUEUR :",r=True):
    if r:
        print("\033c", end="")
    for idx, option in enumerate(liste_joueurs, start=1):
        console.print(f"[cyan]{idx}.[/cyan] {option[1]} - {option[2]}")
    choice = Prompt.ask(prompt, choices=[str(i) for i in range(1, len(liste_joueurs) + 1)])
    return choice
    
def question_generale(prompt="",question= None):
    if question:
        console.print(Panel.fit(question, title="QUESTION", border_style="yellow"))
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
    ret = sql_conn.get_manager_id_from_nom(conn,choix_user)[0]
    id_manager = ret[0]
    nom_manager = ret[1]
    prenom_manager = ret[2]
    print(f" Vous avez choisi : {choix_user}")

    return id_manager, nom_manager, prenom_manager



def menu_principal(id_manager,nom_manager,prenom_manager):
    """
    - Le joueur peut gérer son équipe, gérer sa progression et ses matchs, ou quitter.
    """
    print("\033c", end="")

    rq = sql_conn.get_data_equipes_by_managers(conn,id_manager)
    equipe_id = rq[0][3]
    nom_equipe = rq[0][0]
    affichage_equipes(rq)

    while True:
        time.sleep(0.1)
        print("\033c", end="")
        console.print(Panel(Text(" MENU PRINCIPAL ", justify="center"), title="SPORT MANAGER", border_style="white", expand=True))
        # affichage du nom du manager et de l'équipe
        console.print(f"[bold green]Manager:[/bold green] {nom_manager} {prenom_manager} | [bold blue]Équipe:[/bold blue] {nom_equipe}\n")
        liste_possibilites = ["Gérer mon équipe", "Gérer mes matchs et ma progression", "Quitter le jeu"]
        choix = choix_multiple(liste_possibilites, prompt=" Que voulez-vous faire ?",r = False)
        if choix == "Quitter le jeu":
            quitter()
            break
        elif choix == "Gérer mon équipe":
            gestion_equipe(equipe_id)
        elif choix == "Gérer mes matchs et ma progression":
            gestion_match_progression()


def ajouter_joueur(equipe_id=None):
    """
    Ajouter un joueur sans équipe.
    Demander le nom, prénom et poste.
    Créer le joueur dans la base de données.
    Confirmer l'ajout.
    Retour au menu gestion équipe.
    """
    if equipe_id == None:
        return 'Aucune équipe sélectionnée pour ajouter un joueur.'
    liste_postes = sql_conn.get_all_postes(conn)
    nom = Prompt.ask(" Entrez le NOM du joueur :")
    prenom = Prompt.ask(" Entrez le PRENOM du joueur :")
    poste = choix_multiple(liste_postes, prompt=" Choisissez le POSTE du joueur :")
    new_player_id = sql_conn.create_player(conn,nom,prenom,poste,equipe_id)
    if new_player_id is None:
        console.print("[red]Erreur : Le joueur n'a pas pu être créé car aucune équipe n'a été fournie.[/red]")
    else:
        console.print(f"[green]Le joueur {nom} {prenom} a été ajouté avec succès à l'équipe.[/green]")
    Prompt.ask(" Appuyez sur Entrée pour revenir au menu gestion équipe.")
    
def changement_joueur(equipe_id=None):
    """
    Changer la composition de l'équipe.
    Afficher la liste des joueurs de l'équipe.
    Demander quel joueur modifier.
    Appeler la fonction modif_joueur avec l'ID du joueur sélectionné.
    Retour au menu gestion équipe.
    """
    if equipe_id == None:
        return 'Aucune équipe sélectionnée pour changer un joueur.'
    liste_joueurs = sql_conn.get_all_joueurs_by_equipe(conn, equipe_id)
    choix_joueur = affichage_joueurs(liste_joueurs, prompt=" Choisissez le JOUEUR à modifier :")
    joueur_id = liste_joueurs[int(choix_joueur)-1][0]
    modif_joueur(joueur_id=joueur_id)

def modif_joueur(joueur_id=None):
    """
    Modifier le poste d'un joueur.
    Demander le nouveau poste.
    Mettre à jour le poste du joueur dans la base de données.
    Confirmer la modification.
    Retour au menu gestion équipe.
    """
    if joueur_id == None:
        return 'Aucun joueur sélectionné pour modification.'
    liste_postes = sql_conn.get_all_postes(conn)
    poste = choix_multiple(liste_postes, prompt=" Choisissez le NOUVEAU POSTE du joueur :")
    poste_id = sql_conn.get_poste_id_by_nom(conn, poste)
    sql_conn.update_joueur_poste(conn, joueur_id, poste_id)
    # Mettre à jour le poste du joueur dans la base de données
    console.print(f"[green]Le poste du joueur a été mis à jour avec succès.[/green]")
    Prompt.ask(" Appuyez sur Entrée pour revenir au menu gestion équipe.")

def gestion_equipe(equipe_id=None):
    """
    Afficher menu gestion équipe.
    Gérer les entités (joueurs, équipes, postes).
    Si le manager modifie les joueurs, demander à l'utilisateur ce qu'il veut modifier (poste).
    Retour au menu principal.
    """
    if equipe_id == None:
        return 'Aucune équipe sélectionnée pour ajouter un joueur.'
    liste_possibilites = ["Ajouter un joueur", "Changer la composition de l'équipe", "Retour au menu principal"]
    choix = choix_multiple(liste_possibilites, prompt=" Que voulez-vous faire ?")
    if choix == "Ajouter un joueur":
        ajouter_joueur(equipe_id)
    elif choix == "Changer la composition de l'équipe":
        changement_joueur(equipe_id=equipe_id)
    
    
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
    id_manager,nom_manager,prenom_manager = menu_accueil()
    menu_principal(id_manager,nom_manager,prenom_manager)