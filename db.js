class LocalDB {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.initDefaultData();
    }

    initDefaultData() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([
                { id: 'admin1', name: 'Admin Principal', email: 'admin@coineleveurs.com', password: 'admin', role: 'admin', status: 'active', createdAt: new Date().toISOString() }
            ]));
        }
        if (!localStorage.getItem('animals')) localStorage.setItem('animals', JSON.stringify([]));
        if (!localStorage.getItem('tickets')) localStorage.setItem('tickets', JSON.stringify([]));
        if (!localStorage.getItem('forum')) localStorage.setItem('forum', JSON.stringify([]));
    }

    get(collection) {
        return JSON.parse(localStorage.getItem(collection)) || [];
    }

    set(collection, data) {
        localStorage.setItem(collection, JSON.stringify(data));
    }

    // --- AUTHENTICATION ---
    async login(email, password, requestedRole) {
        return new Promise((resolve) => {
            const users = this.get('users');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                resolve({ success: false, message: 'Identifiants incorrects' });
                return;
            }
            if (user.status === 'blocked') {
                resolve({ success: false, message: 'Votre compte a été bloqué par un administrateur.' });
                return;
            }
            if (user.role !== 'admin' && user.role !== requestedRole) {
                resolve({ success: false, message: 'Vous n\'avez pas le bon rôle pour vous connecter ici.' });
                return;
            }

            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            resolve({ success: true, user: this.currentUser });
        });
    }

    async register(data) {
        return new Promise((resolve) => {
            const users = this.get('users');
            if (users.find(u => u.email === data.email)) {
                resolve({ success: false, message: 'Cet email est déjà utilisé' });
                return;
            }

            const newUser = {
                id: 'user_' + Date.now().toString(),
                status: 'active',
                subscription: data.role === 'veterinaire' ? 'unlimited' : 'standard',
                createdAt: new Date().toISOString(),
                isVerified: false,
                ...data
            };

            users.push(newUser);
            this.set('users', users);
            
            this.currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            resolve({ success: true, user: this.currentUser });
        });
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async logout() {
        return new Promise((resolve) => {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            resolve(true);
        });
    }

    // --- ADMIN CONTROLS ---
    async getAllUsers() {
        return Promise.resolve(this.get('users'));
    }

    async toggleUserStatus(userId) {
        return new Promise((resolve) => {
            const users = this.get('users');
            const user = users.find(u => u.id === userId);
            if (user && user.role !== 'admin') {
                user.status = user.status === 'blocked' ? 'active' : 'blocked';
                this.set('users', users);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    async grantUnlimited(userId) {
        return new Promise((resolve) => {
            const users = this.get('users');
            const user = users.find(u => u.id === userId);
            if (user) {
                user.subscription = user.subscription === 'unlimited' ? 'standard' : 'unlimited';
                this.set('users', users);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    async updateUser(userId, data) {
        return new Promise((resolve) => {
            const users = this.get('users');
            const index = users.findIndex(u => u.id === userId);
            if (index !== -1) {
                users[index] = { ...users[index], ...data };
                this.set('users', users);
                if (this.currentUser && this.currentUser.id === userId) {
                    this.currentUser = users[index];
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                }
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    async verifyEleveur(userId) {
        return new Promise((resolve) => {
            const users = this.get('users');
            const user = users.find(u => u.id === userId);
            if (user && user.role === 'eleveur') {
                user.isVerified = true;
                this.set('users', users);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    // --- ANIMALS ---
    async getAllAnimals() {
        return Promise.resolve(this.get('animals'));
    }

    async getAnimalById(id) {
        return Promise.resolve(this.get('animals').find(a => a.id === id));
    }

    async getEleveurAnimals(eleveurId) {
        return Promise.resolve(this.get('animals').filter(a => a.eleveurId === eleveurId));
    }

    async addAnimal(data) {
        return new Promise((resolve) => {
            const animals = this.get('animals');
            const newAnimal = {
                id: 'animal_' + Date.now().toString(),
                createdAt: new Date().toISOString(),
                ...data
            };
            animals.push(newAnimal);
            this.set('animals', animals);
            resolve(newAnimal);
        });
    }

    async updateAnimalStatus(id, newStatus) {
        return new Promise((resolve) => {
            const animals = this.get('animals');
            const animal = animals.find(a => a.id === id);
            if (animal) {
                animal.status = newStatus;
                this.set('animals', animals);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    async deleteAnimal(id) {
        return new Promise((resolve) => {
            const animals = this.get('animals');
            this.set('animals', animals.filter(a => a.id !== id));
            resolve(true);
        });
    }

    async updateAnimal(id, data) {
        return new Promise((resolve) => {
            const animals = this.get('animals');
            const index = animals.findIndex(a => a.id === id);
            if (index !== -1) {
                animals[index] = { ...animals[index], ...data };
                this.set('animals', animals);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    // --- FORUM ---
    async getAllForumPosts() {
        return Promise.resolve(this.get('forum'));
    }

    async addForumPost(data) {
        return new Promise((resolve) => {
            const forum = this.get('forum');
            const newPost = {
                id: 'post_' + Date.now().toString(),
                time: 'À l\'instant',
                replies: 0,
                repliesList: [],
                likes: 0,
                createdAt: new Date().toISOString(),
                ...data
            };
            forum.push(newPost);
            this.set('forum', forum);
            resolve(newPost);
        });
    }

    async addForumReply(postId, replyData) {
        return new Promise((resolve) => {
            const forum = this.get('forum');
            const post = forum.find(p => p.id === postId);
            if (post) {
                const reply = {
                    id: 'reply_' + Date.now().toString(),
                    time: 'À l\'instant',
                    createdAt: new Date().toISOString(),
                    ...replyData
                };
                if (!post.repliesList) post.repliesList = [];
                post.repliesList.push(reply);
                post.replies++;
                this.set('forum', forum);
                resolve(reply);
            } else {
                resolve(null);
            }
        });
    }

    async deleteForumPost(id) {
        return new Promise((resolve) => {
            const forum = this.get('forum');
            this.set('forum', forum.filter(p => p.id !== id));
            resolve(true);
        });
    }

    // --- SUPPORT / TICKETS ---
    async getAllTickets() {
        return Promise.resolve(this.get('tickets'));
    }

    async addTicket(data) {
        return new Promise((resolve) => {
            const tickets = this.get('tickets');
            const newTicket = {
                id: 'ticket_' + Date.now().toString(),
                date: 'Aujourd\'hui',
                status: 'pending',
                ...data
            };
            tickets.push(newTicket);
            this.set('tickets', tickets);
            resolve(newTicket);
        });
    }

    async resolveTicket(ticketId) {
        return new Promise((resolve) => {
            const tickets = this.get('tickets');
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
                ticket.status = 'resolved';
                this.set('tickets', tickets);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
}

// Attach to window so it's globally accessible in inline scripts
window.DB = new LocalDB();

window.requireAuth = function(allowedRoles) {
    const user = window.DB.getCurrentUser();
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
