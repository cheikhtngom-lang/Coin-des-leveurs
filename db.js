// db.js - Simulated Database Backend using LocalStorage

class LocalDB {
    constructor() {
        this.prefix = 'ce_'; // Coin Eleveur prefix
        this.init();
    }

    init() {
        // Initialize default collections if empty
        let users = this.get('users');
        if (!users) {
            users = [
                { id: 'u1', name: 'Amadou Ndiaye', email: 'eleveur@test.com', password: '123', role: 'eleveur', farmName: 'Élevage Diallo', status: 'active', subscription: 'standard', isVerified: false },
                { id: 'u2', name: 'Awa Sow', email: 'user@test.com', password: '123', role: 'user', status: 'active', subscription: 'standard' },
                { id: 'u3', name: 'Admin', email: 'adminshewu', password: '0000', role: 'admin', status: 'active', subscription: 'unlimited' },
                { id: 'v1', name: 'Dr. Ousmane Diop', email: 'vet1@test.com', password: '123', role: 'veterinaire', cabinet: 'Clinique Vétérinaire de Dakar', location: '14.6928° N, 17.4467° W (Dakar, Sénégal)', status: 'active', subscription: 'unlimited' },
                { id: 'v2', name: 'Dr. Fatou Kane', email: 'vet2@test.com', password: '123', role: 'veterinaire', cabinet: 'Cabinet Santé Animale', location: '14.7928° N, 16.9267° W (Thiès, Sénégal)', status: 'active', subscription: 'unlimited' }
            ];
            this.set('users', users);
        } else {
            // Mettre à jour l'admin de force s'il existe déjà dans le localStorage
            let adminIndex = users.findIndex(u => u.role === 'admin');
            if (adminIndex !== -1) {
                users[adminIndex].email = 'adminshewu';
                users[adminIndex].password = '0000';
            } else {
                users.push({ id: 'u3', name: 'Admin', email: 'adminshewu', password: '0000', role: 'admin' });
            }
            this.set('users', users);
        }
        if (!this.get('animals')) {
            this.set('animals', [
                { id: 'a1', eleveurId: 'u1', title: 'Ladoum Mâle Reproducteur', category: 'Ovin', race: 'Mouton Ladoum', price: 850000, weight: 85, age: 24, status: 'disponible', image: 'https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?auto=format&fit=crop&w=800&q=80', location: 'Thiès' },
                { id: 'a2', eleveurId: 'u1', title: 'Vache Laitière Gobra', category: 'Bovin', race: 'Gobra', price: 450000, weight: 250, age: 48, status: 'disponible', image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80', location: 'Louga' },
                { id: 'a3', eleveurId: 'u1', title: 'Étalon Arabe-Barbe', category: 'Cheval', race: 'Arabe-Barbe', price: 1200000, weight: 400, age: 36, status: 'vendu', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=800&q=80', location: 'Dakar' }
            ]);
        }
        
        if (!this.get('transactions')) {
            this.set('transactions', [
                { id: 't1', userId: 'u1', userName: 'Amadou Ndiaye', amount: 15000, type: 'Abonnement Premium', date: '2023-10-01', status: 'completed' },
                { id: 't2', userId: 'u2', userName: 'Awa Sow', amount: 4500, type: 'Frais de livraison', date: '2023-10-05', status: 'completed' },
                { id: 't3', userId: 'u1', userName: 'Amadou Ndiaye', amount: 22500, type: 'Commission Vente', date: '2023-10-10', status: 'pending' }
            ]);
        }

        if (!this.get('tickets')) {
            this.set('tickets', [
                { id: 'tk1', userId: 'u2', userName: 'Awa Sow', subject: 'Problème de paiement', message: 'Je n\'arrive pas à payer par Orange Money.', date: '2023-10-12', status: 'open' },
                { id: 'tk2', userId: 'u1', userName: 'Amadou Ndiaye', subject: 'Modification de mon profil', message: 'Pouvez-vous changer le nom de ma ferme ?', date: '2023-10-10', status: 'resolved' }
            ]);
        }
        if (!this.get('favorites')) this.set('favorites', []);
        if (!this.get('forum')) {
            this.set('forum', [
                { id: 'f1', eleveurId: 'u1', category: 'Santé Animale', categoryColor: 'red', time: 'Il y a 2 heures', title: 'Quel est le meilleur vaccin contre la clavelée pour les Ladoum ?', content: 'Bonjour à tous, j\'ai récemment acquis de jeunes béliers Ladoum et je voudrais savoir quel protocole vaccinal vous recommandez spécifiquement pour cette race très fragile en période d\'hivernage.', replies: 14, likes: 5 },
                { id: 'f2', eleveurId: 'u1', category: 'Prix du Marché', categoryColor: 'blue', time: 'Il y a 5 heures', title: 'Prévisions des prix pour la Tabaski 2026', content: 'Les prix des aliments ont augmenté de 15% ce trimestre. Pensez-vous que cela va se répercuter directement sur le prix moyen des moutons de taille moyenne (40-50kg) cette année ?', replies: 45, likes: 32 },
                { id: 'f3', eleveurId: 'u1', category: 'Nutrition', categoryColor: 'yellow', time: 'Hier', title: 'Fournisseur d\'aliment concentré fiable sur Thiès ?', content: 'Je cherche un fournisseur sérieux pour de grandes quantités de tourteau d\'arachide et de son de blé. Des recommandations ?', replies: 8, likes: 2 }
            ]);
        }
    }

    get(key) {
        return JSON.parse(localStorage.getItem(this.prefix + key));
    }

    set(key, data) {
        localStorage.setItem(this.prefix + key, JSON.stringify(data));
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /* --- AUTHENTICATION --- */
    login(email, password, requestedRole) {
        const users = this.get('users');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            if (user.status === 'blocked') {
                return { success: false, message: 'Votre compte a été bloqué par un administrateur.' };
            }
            // L'administrateur peut se connecter via n'importe quel formulaire
            if (user.role === 'admin' || user.role === requestedRole) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                return { success: true, user };
            }
            return { success: false, message: 'Vous n\'avez pas le bon rôle pour vous connecter ici.' };
        }
        return { success: false, message: 'Identifiants incorrects' };
    }

    register(data) {
        const users = this.get('users');
        if (users.find(u => u.email === data.email)) {
            return { success: false, message: 'Cet email existe déjà' };
        }
        const newUser = { 
            id: this.generateId(), 
            status: 'active', 
            subscription: data.role === 'veterinaire' ? 'unlimited' : 'standard',
            ...data 
        };
        users.push(newUser);
        this.set('users', users);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return { success: true, user: newUser };
    }

    /* --- ADMIN CONTROLS --- */
    getAllUsers() {
        return this.get('users');
    }

    toggleUserStatus(userId) {
        const users = this.get('users');
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1 && users[index].role !== 'admin') {
            users[index].status = users[index].status === 'blocked' ? 'active' : 'blocked';
            this.set('users', users);
            return true;
        }
        return false;
    }

    grantUnlimited(userId) {
        const users = this.get('users');
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index].subscription = users[index].subscription === 'unlimited' ? 'standard' : 'unlimited';
            this.set('users', users);
            return true;
        }
        return false;
    }

    verifyEleveur(userId) {
        const users = this.get('users');
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1 && users[index].role === 'eleveur') {
            users[index].isVerified = true;
            this.set('users', users);
            return true;
        }
        return false;
    }

    deleteAnimal(animalId) {
        let animals = this.get('animals');
        animals = animals.filter(a => a.id !== animalId);
        this.set('animals', animals);
        return true;
    }

    getAllTransactions() {
        return this.get('transactions') || [];
    }

    getAllTickets() {
        return this.get('tickets') || [];
    }

    resolveTicket(ticketId) {
        const tickets = this.get('tickets');
        const index = tickets.findIndex(t => t.id === ticketId);
        if (index !== -1) {
            tickets[index].status = 'resolved';
            this.set('tickets', tickets);
            return true;
        }
        return false;
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    logout() {
        localStorage.removeItem('currentUser');
    }

    /* --- ANIMALS --- */
    getAllAnimals() {
        return this.get('animals');
    }

    getEleveurAnimals(eleveurId) {
        return this.get('animals').filter(a => a.eleveurId === eleveurId);
    }

    addAnimal(data) {
        const animals = this.get('animals');
        const newAnimal = { id: this.generateId(), ...data };
        animals.unshift(newAnimal); // add to top
        this.set('animals', animals);
        return newAnimal;
    }

    updateAnimalStatus(id, newStatus) {
        const animals = this.get('animals');
        const index = animals.findIndex(a => a.id === id);
        if (index !== -1) {
            animals[index].status = newStatus;
            this.set('animals', animals);
            return true;
        }
        return false;
    }

    deleteAnimal(id) {
        const animals = this.get('animals');
        this.set('animals', animals.filter(a => a.id !== id));
    }

    /* --- FORUM --- */
    getAllForumPosts() {
        return this.get('forum');
    }

    addForumPost(data) {
        const posts = this.get('forum');
        const newPost = { 
            id: this.generateId(), 
            time: 'À l\'instant',
            replies: 0,
            repliesList: [],
            likes: 0,
            ...data 
        };
        posts.unshift(newPost);
        this.set('forum', posts);
        return newPost;
    }

    addForumReply(postId, replyData) {
        const posts = this.get('forum');
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (!post.repliesList) post.repliesList = [];
            post.repliesList.push({
                id: this.generateId(),
                time: 'À l\'instant',
                ...replyData
            });
            post.replies = post.repliesList.length;
            this.set('forum', posts);
        }
    }

    likeForumPost(postId) {
        const posts = this.get('forum');
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.likes = (post.likes || 0) + 1;
            this.set('forum', posts);
        }
    }
}

// Global instance
const DB = new LocalDB();

// Global Protection Middleware
function requireAuth(allowedRoles) {
    const user = DB.getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}
