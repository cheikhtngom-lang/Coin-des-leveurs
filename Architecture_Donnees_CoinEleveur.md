# Architecture des Données - Plateforme "Coin des Éleveurs"

Ce document décrit l'architecture de la base de données (schéma relationnel) pour la plateforme SaaS "Coin des Éleveurs". Ce format est optimisé pour être copié-collé ou importé directement dans Microsoft Word.

---

## Table des Matières
1. [Utilisateurs et Rôles](#1-utilisateurs-et-rôles)
2. [Animaux et Annonces](#2-animaux-et-annonces)
3. [Transactions et Commandes](#3-transactions-et-commandes)
4. [Espace Communautaire (Forum)](#4-espace-communautaire-forum)
5. [Espace Foire Virtuelle (Live)](#5-espace-foire-virtuelle-live)
6. [Interactions Utilisateurs](#6-interactions-utilisateurs)
7. [Relations et Cardinalités (Résumé)](#7-relations-et-cardinalités-résumé)

---

## 1. Utilisateurs et Rôles

### Table `Users` (Utilisateurs)
Gère tous les comptes de la plateforme.
- `id_user` (PK) : Identifiant unique.
- `nom_complet` : Nom et prénom de l'utilisateur.
- `email` : Adresse email (Unique).
- `mot_de_passe` : Mot de passe haché.
- `telephone` : Numéro de téléphone.
- `role` : Rôle de l'utilisateur (ENUM : 'Acheteur', 'Eleveur', 'Admin').
- `date_inscription` : Date de création du compte.
- `statut` : État du compte (Actif, Suspendu, En attente).

### Table `Eleveur_Profils` (Profils Éleveurs)
Données spécifiques aux éleveurs (Relation 1:1 avec `Users`).
- `id_profil` (PK) : Identifiant unique.
- `id_user` (FK) : Lien vers l'utilisateur.
- `nom_ferme` : Nom de l'exploitation agricole.
- `region` : Région d'élevage (ex: Thiès, Dakar).
- `description` : Présentation de l'éleveur.
- `badge_verifie` : Booléen (True si l'éleveur est certifié par l'admin).
- `abonnement_pro` : Booléen (True si abonnement Premium actif).
- `logo_url` : Lien vers le logo de la ferme.

---

## 2. Animaux et Annonces

### Table `Categories_Animaux` (Types d'animaux)
- `id_categorie` (PK) : Identifiant unique.
- `nom_categorie` : Nom (ex: Bovins, Ovins, Caprins, Volailles).

### Table `Annonces` (Animaux mis en vente)
- `id_annonce` (PK) : Identifiant unique.
- `id_eleveur` (FK) : Référence à `Users` (Rôle Éleveur).
- `id_categorie` (FK) : Référence à la catégorie de l'animal.
- `titre` : Titre de l'annonce (ex: "Mouton Ladoum Mâle").
- `race` : Race spécifique (ex: Gobra, Ladoum).
- `poids_kg` : Poids de l'animal.
- `age_mois` : Âge en mois.
- `prix` : Prix de vente (en FCFA).
- `description` : Détails (vaccins, état de santé).
- `statut` : Statut de l'annonce (Disponible, Vendu, Réservé).
- `date_publication` : Date de mise en ligne.
- `vues` : Compteur du nombre de visites.

### Table `Annonce_Images`
- `id_image` (PK) : Identifiant unique.
- `id_annonce` (FK) : Lien vers l'annonce.
- `url_image` : Chemin/URL de l'image.
- `image_principale` : Booléen (True si c'est la miniature).

---

## 3. Transactions et Commandes

### Table `Commandes`
- `id_commande` (PK) : Identifiant unique.
- `id_acheteur` (FK) : Lien vers l'utilisateur acheteur.
- `id_annonce` (FK) : Lien vers l'animal acheté.
- `montant_total` : Prix final payé.
- `statut_paiement` : État (En attente, Payé, Échoué).
- `methode_paiement` : Mode (Wave, Orange Money, Carte).
- `date_commande` : Timestamp de l'achat.

---

## 4. Espace Communautaire (Forum)

### Table `Forum_Categories`
- `id_categorie` (PK) : Identifiant.
- `nom` : Nom (Santé Animale, Nutrition, etc.).
- `description` : Description de la section.

### Table `Forum_Sujets` (Topics)
- `id_sujet` (PK) : Identifiant du sujet.
- `id_categorie` (FK) : Lien vers la catégorie.
- `id_auteur` (FK) : Lien vers l'éleveur (Auteur).
- `titre` : Titre de la discussion.
- `contenu` : Texte initial du sujet.
- `date_creation` : Date de publication.
- `vues` : Compteur de vues.

### Table `Forum_Reponses` (Messages)
- `id_reponse` (PK) : Identifiant de la réponse.
- `id_sujet` (FK) : Lien vers le sujet parent.
- `id_auteur` (FK) : Lien vers l'auteur (Éleveur).
- `contenu` : Texte de la réponse.
- `date_reponse` : Date de publication.

---

## 5. Espace Foire Virtuelle (Live)

### Table `Foires` (Événements Live)
- `id_foire` (PK) : Identifiant de l'événement.
- `id_eleveur` (FK) : Organisateur de la foire.
- `titre` : Titre du live (ex: "Vente spéciale Tabaski").
- `date_prevue` : Date et heure du live.
- `statut` : État (A venir, En cours, Terminé).
- `url_flux` : URL du flux vidéo (WebRTC, RTMP).

### Table `Foire_Animaux` (Animaux présentés pendant la foire)
- `id_foire_animal` (PK) : Identifiant.
- `id_foire` (FK) : Lien vers l'événement.
- `id_annonce` (FK) : Lien vers l'animal (doit exister dans `Annonces`).
- `ordre_passage` : Numéro d'ordre de présentation (Lot #1, Lot #2).
- `prix_depart_enchere` : Prix de base si c'est une enchère.

### Table `Foire_Encheres` (Offres en direct)
- `id_enchere` (PK) : Identifiant.
- `id_foire_animal` (FK) : L'animal en cours de présentation.
- `id_acheteur` (FK) : Utilisateur faisant l'offre.
- `montant_offre` : Montant proposé.
- `date_offre` : Timestamp exact de l'enchère.

### Table `Foire_Chat` (Messages en direct)
- `id_message` (PK) : Identifiant.
- `id_foire` (FK) : Lien vers le live.
- `id_user` (FK) : Auteur du message (Éleveur ou Acheteur).
- `contenu` : Texte du message.
- `timestamp` : Heure du message.

---

## 6. Interactions Utilisateurs

### Table `Favoris`
Permet aux acheteurs de sauvegarder des annonces.
- `id_favori` (PK) : Identifiant.
- `id_user` (FK) : L'utilisateur acheteur.
- `id_annonce` (FK) : L'annonce sauvegardée.
- `date_ajout` : Date de l'action.

### Table `Avis_Eleveurs`
Notes et avis laissés par les acheteurs après transaction.
- `id_avis` (PK) : Identifiant.
- `id_acheteur` (FK) : Auteur de l'avis.
- `id_eleveur` (FK) : Éleveur évalué.
- `note` : Note sur 5.
- `commentaire` : Texte de l'avis.
- `date_avis` : Date de publication.

---

## 7. Relations et Cardinalités (Résumé)

- Un **Utilisateur (Éleveur)** peut publier plusieurs **Annonces** (1,n).
- Une **Annonce** appartient à un seul **Éleveur** (1,1).
- Un **Acheteur** peut passer plusieurs **Commandes** (0,n).
- Un **Utilisateur (Éleveur)** peut créer plusieurs **Sujets de Forum** et écrire plusieurs **Réponses** (0,n).
- Une **Foire** est organisée par un seul **Éleveur** mais peut contenir plusieurs **Animaux (Annonces)** (1,n).
- Une **Foire (Live)** regroupe de nombreux messages de **Chat** envoyés par de nombreux **Utilisateurs** (Acheteurs et Éleveurs).
