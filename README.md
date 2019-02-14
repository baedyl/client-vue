# client-vue
How to use this client in Vue.Js:

Requirements: A recent version  of Node JS, MongoDB, a Web Server and Internet connection!

Supposing that you are in your home directory
Step 1: Clone or download the repository => 
#               >git clone https://github.com/baedyl/client-vue.git 

Step 2: Enter the server directory => 
#               >cd client-vue/serveur

Step 3: Install the required Node modules => 
#               >npm install
Step 4: Start the server => 
#               >node serverCrudWithMongo.js
We should get the following message in the terminal: "Serveur lancé sur le port : 8886"
Step 5: Make sure mongod is running or in another terminal start it up => 
#               >mongod 
Step 6: Using your web server publish the client-vue folder on your local machine, 
        if you are using Google Chrome web server you will probably get an URL like this one: http://127.0.0.1:port/ .

The page support all CRUD operations on the restaurant collection, dynamic pagination and the search of a restaurant using its name. We used the Element library for some of the inputs, the el-select and el-table tags did not worked so well so we sticked to pure HTML for those...
