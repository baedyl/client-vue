window.onload = init;

function init() {
    new Vue({
        el: '#app',
        data: {
            restaurants: [],
            id: "",
            nom: "",
            cuisine: "",
            pageNumber: 0,  // default to page 0 (first page)
            lastPage: 0,
            goToPage: "",
            pageOptions: [{
                value: '5',
                label: '5',
              }, 
              {
                value: '10',
                label: '10'
              }, 
              {
                value: '20',
                label: '20'
              }
            ],
            pageSize: 10,    // default to 10 elements per page
            modification: false, // Enable the modification button if == true
            ajout: true,        // Disable the adding button if == false
            rechercheInput: "",
            alerte_success: false,  // Afficher un message de reussite après exécution d'une opération
            alerte_error: false,
            alerte_msg: "",

        },
        mounted() {
            console.log("--- MOUNTED, appelée avant le rendu de la vue ---");
            this.getDataFromWebService();
        },
        methods: {

            getDataFromWebService: function () {
                let url = "http://localhost:8886/api/restaurants";
                
                url += "?page=" + this.pageNumber;
                url += "&pagesize=" + this.pageSize;
                                
                fetch(url).then((data) => {
                    console.log("les données sont arrivées !")
                    return data.json();
                }).then((dataEnJavaScript) => {
                    // ici on a bien un objet JS
                    this.restaurants = dataEnJavaScript.data;
                });

                this.getLastPage();
            },
            // Exécute la requête fetch à partir de l'URL, la methode(GET, POST, PUT, DELETE)
            // et les données du formulaire
            doFetch: function(url, methode, data){
                console.log(methode);
                fetch(url, {
                    method: methode,
                    body: data
                })
                .then(function(responseJSON) {
                    responseJSON.json()
                        .then(function(res) {
                            // Maintenant res est un vrai objet JavaScript
                            console.log(res);
                            this.alerte_msg = "Ajout Réussi!"
                            this.alerte = true;

                            
                            
                        }).then(() => {
                            if(methode === "PUT"){
                                // After the UPDATE we reload the page, so that the changes are visible
                                console.log("Reloading...");
                                this.getDataFromWebService();
                                this.alerte_msg = "Modification Réussie!"
                            }
                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                });
            },
            // Activation de l'alerte success et desactivation de l'autre et vis versa
            activateAlerte: function(success, msg){
                if(success === true){
                    this.alerte_error = false;
                    this.alerte_success = true;
                }else{
                    this.alerte_error = true;
                    this.alerte_success = false;
                }
                this.alerte_msg = msg;
            },
            // Vider les inputs du formulaire
            clearInputs : function(){
                this.id = "";
                this.nom = "";
                this.cuisine = "";
            },
            //  Disable the Edit and Delete buttons and activate the Create button
            modificationFalse(){
                this.modification = false;
                this.ajout = true;
            },
            // Ajout d'un restaurant
            addRestaurant: function () {
                console.log("Execution POST Request(addRestaurant)...");
                event.preventDefault();

                var formData = new FormData(); // Currently empty
                var addForm = document.getElementById('addForm');
                formData = new FormData(addForm);

                // Récupération des valeurs des champs du formulaire
                // en prévision d'un envoi multipart en ajax/fetch
                if(this.nom){
                    let donneesFormulaire = formData;      
                    let url = "http://localhost:8886/api/restaurants";
                    this.doFetch(url, "POST", donneesFormulaire);

                    // Nouvelle ligne dans la table HTML
                    this.restaurants.push({ name: this.nom, cuisine: this.cuisine});

                    // Activation de l'alerte success 
                    this.activateAlerte(true, "Nouveau Restaurant ajouté!");
                }else{
                    console.log("Empty Name of restaurant!");

                    // Activation de l'alerte error
                    this.activateAlerte(false, "Nom de restaurant vide!");                   
                }
                // Reset the input values
                this.clearInputs();                                                                                                                                                                                                                                                                                                                                                                                                                                                  this.alerte = false;
                
            },
            modifyRestaurant: function () {
                console.log("Execution PUT Request(modifyRestaurant)...");
                event.preventDefault();

                var formData = new FormData(); // Currently empty
                var addForm = document.getElementById('addForm');
                formData = new FormData(addForm);
                if(this.nom){
                    // Récupération des valeurs des champs du formulaire
                    // en prévision d'un envoi multipart en ajax/fetch
                    let donneesFormulaire = formData;      
                    let url = "http://localhost:8886/api/restaurants/" + this.id;
                    //console.log(this.id);
                    // Not properly working for the update
                    //this.doFetch(url, "PUT", donneesFormulaire);
                    fetch(url, {
                        method: "PUT",
                        body: donneesFormulaire
                    })
                    .then(function(responseJSON) {
                        responseJSON.json()
                            .then(function(res) {
                                // Maintenant res est un vrai objet JavaScript
                                console.log(res);
                            });
                        })
                        .catch(function (err) {
                            console.log(err);
                    }).then(() => {
                        // After the update we reload the page, so that the changes are visible
                        console.log("Reloading...");
                        this.getDataFromWebService();

                        // Activation de l'alerte success 
                        this.activateAlerte(true, "Modification Restaurant Réussie!");
                    });
                }else{
                    console.log("Empty Name of restaurant!");
                    // Activation de l'alerte error
                    this.activateAlerte(false, "Nom de restaurant vide!");
                }
                // Reset the input values and deactivate the Edit button
                this.clearInputs();     
                this.modificationFalse();
            },
            removeRestaurant: function (index) {
                console.log("Execution DELETE Request(removeRestaurant)...");

                event.preventDefault();

                var formData = new FormData(); // Currently empty
                var addForm = document.getElementById('addForm');
                formData = new FormData(addForm);
                if(this.id){
                    // Récupération des valeurs des champs du formulaire
                    // en prévision d'un envoi multipart en ajax/fetch
                    let donneesFormulaire = formData;      
                    let url = "http://localhost:8886/api/restaurants/" + this.id;
                    //console.log(this.id);
                    fetch(url, {
                        method: "DELETE",
                        body: donneesFormulaire
                    })
                    .then(function(responseJSON) {
                        responseJSON.json()
                            .then(function(res) {
                                // Maintenant res est un vrai objet JavaScript
                                console.log(res);
                            });
                        })
                        .catch(function (err) {
                            console.log(err);
                    }).then(() => {
                        // After the update we reload the page, so that the changes are visible
                        console.log("Reloading...");
                        this.getDataFromWebService();

                        // Activation de l'alerte success 
                        this.activateAlerte(true, "Suppression Restaurant Réussie!");
                    });
                }else{
                    console.log("Empty Id of restaurant!");
                    // Activation de l'alerte error 
                    this.activateAlerte(false, "Id du restaurant vide!");
                }
                // Reset the input values and deactivate the Edit, Delete button
                this.clearInputs();
                this.modificationFalse();
            },
            getColor: function (index) {
                return (index % 2) ? 'red' : 'green';
            },
            nextPage(){
                this.pageNumber++;
                this.getDataFromWebService();
            },
            prevPage(){
                 if(this.pageNumber >= 1){
                    this.pageNumber--;
                    this.getDataFromWebService();
                 }             
            },
            // Return a page based on the value of the page number
            getPage(val){   
                this.pageNumber = val;
                this.getDataFromWebService();
            },
            // Divide the number of documents by the pageSize
            getLastPage(){  
                let url = "http://localhost:8886/api/restaurants/count";

                fetch(url).then((data) => {
                    console.log("les données sont arrivées !")
                    return data.json();
                }).then((data) => {
                    // ici on a bien un objet JS
                    this.lastPage = parseInt(Number(data.data) / Number(this.pageSize));
                    console.log(this.lastPage);
                });
            },
            setPageSize(val){
                this.pageSize = val;
                this.getPage(this.pageNumber);
            },
            // Search for a restaurant by it's index in the table
            // or by using the rechercheInput (nom restaurant) if provided
            getRestaurant: function(index){
                var nomResto = "";  // The name of the restaurant
                if(this.rechercheInput == ""){
                    nomResto = this.restaurants[index].name;
                }
                else{
                    nomResto = this.rechercheInput;
                    this.rechercheInput = "";
                }
                console.log(nomResto);
                
                let url = "http://localhost:8886/api/restaurants/search/" + nomResto;
                
                fetch(url).then((data) => {
                    console.log("les données sont arrivées !")
                    return data.json();
                }).then((dataEnJavaScript) => {
                    // ici on a bien un objet JS
                    var resto = dataEnJavaScript.restaurant;
                    console.log(resto);
                    this.nom = resto.name;
                    this.cuisine = resto.cuisine;
                    this.id = resto._id;
                    
                    this.modification = true;
                    this.ajout = false;           
                });
            },
            
        }
    })
}

