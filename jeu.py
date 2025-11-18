import sql_conn
import random
import os
from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich.panel import Panel 
from rich.text import Text

console = Console()

def menu_accueil():
    """
    Affiche le menu d'accueil du jeu.

    - Choisir son manager et commencer la partie.
    """

    print(" BIENVENUE DANS SPORT MANAGER ")
    choix_manager = input( " Choisissez votre MANAGER :")
    


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