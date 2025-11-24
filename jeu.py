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
    # ajouter la possiblité de creer une équipe
    rq.append(('Créer une nouvelle équipe','','',''))
    choix = affichage_equipes(rq)
    if choix == str(len(rq)):
        nom_equipe = Prompt.ask(" Entrez le NOM de votre nouvelle équipe :")
        equipe_id = sql_conn.create_team(conn, nom_equipe, id_manager)
        console.print(f"[green]L'équipe {nom_equipe} a été créée avec succès.[/green]")
    else:
        equipe_id = rq[int(choix)-1][3]
        nom_equipe = rq[int(choix)-1][0]

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
            gestion_match_progression(equipe_id)


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
    if not liste_joueurs:
        console.print("[red]Aucun joueur dans cette équipe pour modifier.[/red]")
        Prompt.ask(" Appuyez sur Entrée pour revenir au menu gestion équipe.")
        return
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
    liste_possibilites = ["Ajouter un joueur", "Changer la composition de l'équipe","Afficher mes joueurs", "Retour au menu principal"]
    choix = choix_multiple(liste_possibilites, prompt=" Que voulez-vous faire ?")
    if choix == "Ajouter un joueur":
        ajouter_joueur(equipe_id)
    elif choix == "Changer la composition de l'équipe":
        changement_joueur(equipe_id=equipe_id)
    elif choix == "Afficher mes joueurs":
        affichage_joueurs_par_equipe(equipe_id)

def affichage_joueurs_par_equipe(equipe_id=None):
    """
    Afficher la liste des joueurs de l'équipe.
    Retour au menu gestion équipe.
    """
    if equipe_id == None:
        return 'Aucune équipe sélectionnée pour afficher les joueurs.'
    print("\033c", end="")
    console.print(Panel.fit(" MES JOUEURS ", title="SPORT MANAGER", border_style="white"))
    liste_joueurs = sql_conn.get_all_joueurs_by_equipe(conn, equipe_id, True)
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("Nom", style="dim", min_width=10)
    table.add_column("Poste", min_width=10)
    table.add_column("Blessé", justify="center")
    table.add_column("Vitesse", justify="right")
    table.add_column("Endurance", justify="right")
    table.add_column("Technique", justify="right")

    for joueur in liste_joueurs:
        table.add_row(
            f"[cyan]{joueur[1]}[/cyan]", 
            joueur[2], 
            "Oui" if joueur[3] == 1 else "Non", 
            str(joueur[4]), 
            str(joueur[5]), 
            str(joueur[6])
        )

    console.print(table)
    Prompt.ask(" Appuyez sur Entrée pour revenir au menu gestion équipe.")
def mes_matchs(equipe_id):
    """
    Afficher les matchs de l'équipe.
    Retour au menu gestion matchs et progression.
    """

    print("\033c", end="")
    console.print(Panel.fit(" MES MATCHS ", title="SPORT MANAGER", border_style="white"))
    matchs = sql_conn.get_all_matchs_by_equipe(conn, equipe_id)
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("ID", style="dim", width=6)
    table.add_column("Équipe 1", min_width=20)
    table.add_column("Équipe 2", min_width=20)
    table.add_column("Score 1", justify="right")
    table.add_column("Score 2", justify="right")
    for match in matchs:
        if match[3] > match[4]:  # Équipe 1 a gagné
            table.add_row(str(match[0]), f"[green]{match[1]}[/green]", match[2], str(match[3]), str(match[4]))
        elif match[3] < match[4]:  # Équipe 2 a gagné
            table.add_row(str(match[0]), match[1], f"[green]{match[2]}[/green]", str(match[3]), str(match[4]))
        else:  # Match nul
            table.add_row(str(match[0]), match[1], match[2], str(match[3]), str(match[4]))
    console.print(table)
    Prompt.ask(" Appuyez sur Entrée pour revenir au menu gestion matchs et progression.")
    
def choix_equipe():
    """
    Choisir la composition de l'équipe.
    Offensive, Défensive, Polyvalente.
    Retour au menu gestion équipe.
    """
    choix = Prompt.ask(" Quelle composition voulez-vous jouer ? (Offensive/Défensive/Milieu)", choices=["o", "d", "p"])
    if choix == "o":
        print(" Votre équipe sera offensive")
    elif choix == "d":
        print(" Votre équipe sera défensive")
    else:
        print(" Votre équipe sera polyvalente")

    choix_equipe()
    
def match_progression(list_noms_equipes=None):
    print("\033c", end="")
    tmp_temps = random.randint(30,250)
    print(" Le match commence dans ")
    for i in range(3,0,-1):
        print(f" {i} ")
        time.sleep(1)
        print("\033c", end="")
    print("\n\n")
    list_scorre_possible = [1,2,3,0]
    scorea = 0
    scoreb = 0
    for _ in range(tmp_temps):
        time.sleep(0.01)
        if random.choice([True, False]):
            scorea += random.choice(list_scorre_possible)
        if random.choice([True, False]):
            scoreb += random.choice(list_scorre_possible)
        print("\033c", end="")
        print(f" {list_noms_equipes[0]} : {scorea}")
        print(f" {list_noms_equipes[1]} : {scoreb}")
    return scorea, scoreb

def gestion_match_progression(equipe_id):
    """
    Afficher menu gestion matchs et progression.
    Gérer les matchs (lancer un match).
    Gérer la progression de l'équipe (voir la progression).
    Retour au menu principal.
    """

    liste_possibilites = ["Lancer un match", "Voir la progression de l'équipe", "Retour au menu principal"]
    choix = choix_multiple(liste_possibilites, prompt=" Que voulez-vous faire ?")

    if choix == "Lancer un match":
        sql_conn.update_joueur_blessure_temps(conn)
        nb_joueurs_disponibles = sql_conn.get_nb_joueurs_disponibles(conn, equipe_id)
        if nb_joueurs_disponibles < 5:
            console.print(f"[red]Vous n'avez pas assez de joueurs disponibles pour lancer un match (5 minimum). Vous en avez {nb_joueurs_disponibles}.[/red]")
            Prompt.ask(" Appuyez sur Entrée pour revenir au menu gestion matchs et progression.")
            return
        nom_equipe = sql_conn.get_equipes_name_by_id(conn, equipe_id)
        adversaires = sql_conn.get_all_equipes_except_id(conn, equipe_id)
        adversaire = random.choice(adversaires)
        list_noms_equipes = [nom_equipe, adversaire]
        scorea, scoreb = match_progression(list_noms_equipes)
        id_equipeb = sql_conn.get_equipe_id_by_name(conn, adversaire)
        list_joueura = sql_conn.get_all_joueurs_by_equipe(conn, equipe_id)
        list_joueurb = sql_conn.get_all_joueurs_by_equipe(conn,id_equipeb)
        list_joueur = list_joueura + list_joueurb
        for joueur in list_joueur:
            random_chance = random.randint(1, 100)
            if random_chance <= 5:  # 5% de chance de blessure
                joueur_nom = joueur[1]
                console.print(f"[red]{joueur_nom} s'est blessé pendant le match ![/red]")
                sql_conn.update_joueur_blessure(conn, joueur[0], 1)

        console.print(f"[bold green]Match terminé ! Score final : {scorea}/{scoreb}[/bold green]")
        if scorea > scoreb:
            console.print(f"[green]Félicitations ! Votre équipe {nom_equipe} a gagné contre {adversaire}.[/green]")
        elif scorea < scoreb:
            console.print(f"[red]Dommage ! Votre équipe {nom_equipe} a perdu contre {adversaire}.[/red]")
        else:
            console.print(f"[yellow]Match nul entre {nom_equipe} et {adversaire}.[/yellow]")
        sql_conn.ajout_match(conn, equipe_id, id_equipeb, scorea, scoreb)
        Prompt.ask(" Appuyez sur Entrée pour revenir au menu gestion matchs et progression.")
    
    elif choix == "Voir la progression de l'équipe":
        mes_matchs(equipe_id)

def quitter():
    """
    Le joueur quitte le jeu.
    """

if __name__ == "__main__":
    console = Console()
    conn = sql_conn.init_connection()
    id_manager,nom_manager,prenom_manager = menu_accueil()
    menu_principal(id_manager,nom_manager,prenom_manager)