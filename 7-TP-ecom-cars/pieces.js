new Vue({
    el: "#app",
    data: {
        pieces: [], // Stocker les pièces depuis le JSON
        search: "",
        selectedCategory: "",
        inStockOnly: false,
        cart: []
    },
    computed: {
        // Récupérer les catégories uniques
        categories() {
            return [...new Set(this.pieces.map(piece => piece.categorie))];
        },
        // Filtrer les pièces en fonction des critères
        filteredPieces() {
            return this.pieces.filter(piece => {
                const matchesSearch = piece.nom.toLowerCase().includes(this.search.toLowerCase());
                const matchesCategory = this.selectedCategory ? piece.categorie === this.selectedCategory : true;
                const matchesStock = this.inStockOnly ? piece.disponible : true;
                return matchesSearch && matchesCategory && matchesStock;
            });
        }
    },
    methods: {
        // Charger les pièces depuis le JSON
        fetchPieces() {
            fetch("pieces-autos.json")
                .then(response => response.json())
                .then(data => {
                    this.pieces = data;
                });
        },
        // Trier les pièces
        sortByPrice(order) {
            this.pieces.sort((a, b) => order === "asc" ? a.prix - b.prix : b.prix - a.prix);
        },
        // Ajouter un article au panier
        addToCart(piece) {
            this.cart.push(piece);
            alert(piece.nom + " ajouté au panier !");
        }
    },
    mounted() {
        this.fetchPieces(); // Charger les pièces au démarrage
    }
});
