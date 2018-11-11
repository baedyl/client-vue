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
            alerte: false,  // Afficher un message de reussite après exécution d'une opération
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
            addRestaurant: function () {
                this.restaurants.push({ name: this.nom, cuisine: this.cuisine});

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
                
                    /*fetch(url, {
                        method: "POST",
                        body: donneesFormulaire
                    })
                    .then(function(responseJSON) {
                        responseJSON.json()
                            .then(function(res) {
                                // Maintenant res est un vrai objet JavaScript
                                console.log(res);
                                this.alerte_msg = "Ajout Réussi!"
                                this.alerte = true;
                            });
                        })
                        .catch(function (err) {
                            console.log(err);
                    });*/
                }else{
                    console.log("Empty Name of restaurant!");
                }

                // Reset the input values
                this.nom = "";
                this.cuisine = "";
                //                                                                                                                                                                                                                                                                                                                                                                                                                                                      this.alerte = false;
                
            },
            modifyRestaurant: function () {
                //this.restaurants.push({ name: this.nom, cuisine: this.cuisine});
                
                console.log("Execution POST Request(modifyRestaurant)...");

                event.preventDefault();

                var formData = new FormData(); // Currently empty
                var addForm = document.getElementById('addForm');
                formData = new FormData(addForm);
                //console.log(addForm);
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
                        this.alerte_msg = "Modification Réussie!"
                        this.alerte = true;
                    });
                }else{
                    console.log("Empty Name of restaurant!");
                }
                // Reset the input values
                this.nom = "";
                this.cuisine = "";
                this.id = "";

                this.modification = false;
                this.ajout = true;
                this.alerte = false;
            },
            removeRestaurant: function (index) {
                //console.log(index)
                //this.restaurants.splice(index, 1);
                console.log("Execution DELETE Request(removeRestaurant)...");

                event.preventDefault();

                var formData = new FormData(); // Currently empty
                var addForm = document.getElementById('addForm');
                formData = new FormData(addForm);
                //console.log(addForm);
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
                    });
                }else{
                    console.log("Empty Id of restaurant!");
                }
                // Reset the input values
                this.nom = "";
                this.cuisine = "";
                this.id = "";

                this.modification = false;
                this.ajout = true;
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
            getPage(val){   // return a page based on the value of the page number
                this.pageNumber = val;
                this.getDataFromWebService();
            },
            getLastPage(){  // Divide the number of documents by the pageSize
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
            clearInputs : function(){
                this.modification = false;
                this.ajout = true;

                this.id = "";
                this.nom = "";
                this.cuisine = "";
            }
        }
    })
}

