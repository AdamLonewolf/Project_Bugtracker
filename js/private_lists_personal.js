$(document).ready(function(){

    var logoutBtn = $('#logout'); //On se connecte au bouton se déconnecter via le DOM

    //Lorsqu'on clique sur le bouton "se déconnecter"
    logoutBtn.click((event)=>{
        event.preventDefault() //On empêche le bouton de rediriger par défaut

        //----Je crée une fonction qui va gérer la déconnexion de l'utilisateur---

       async function logout(){
            var token = sessionStorage.getItem("User_token"); //On récupère la valeur du token stockée dans la clé
            var url = `http://greenvelvet.alwaysdata.net/bugTracker/api/logout/${token}`
            await fetch(url, {
                method:"GET"
            })
            .then(Response => {
                if(Response.ok){
                    sessionStorage.removeItem("User_token"); //On écrase le token dans la session du navigateur
                    sessionStorage.removeItem("User_id"); //On écrase l'id de l'utilisateur dans la session du navigateur
                    alert('Vous avez été déconnecté');
                    return Response.json();
                } else {
                    throw new Error('Une erreur est survenue')
                }
            })
            .then(() => {
                window.location.href = "login.html"
            })
            .catch(error => {
                console.log(error);
            })
            
        }


        logout();

    })

//---Fonction qui va gérer le temps d'inactivité d'un utilisateur.---

    function ActivityWatcher(){


        //Je définis le nombre de secondes 

        var secondsInactivity = 0 //cette variable stocke le temps pendant lequel l'utilisateur est inactif

        //Temps limite

        var timeLimit = 1200 // 1min = 60 secondes, 60 x 20 = 1200, soit 20 minutes.


        async function logoutActivity(){
            var token = sessionStorage.getItem("User_token"); //On récupère la valeur du token stockée dans la clé
            var url = `http://greenvelvet.alwaysdata.net/bugTracker/api/logout/${token}`
            await fetch(url, {
                method:"GET"
            })
            .then(Response => {
                sessionStorage.removeItem("User_token"); //On écrase le token dans la session du navigateur
                sessionStorage.removeItem("User_id"); //On écrase l'id de l'utilisateur dans la session du navigateur
                alert('Vous êtes inactif depuis 20 min. Vous serez deconnecté');
                return Response.json();
                
            })
            .then(() => {
                window.location.href = "login.html"
            })
            .catch(error => {
                console.log(error);
            })          
        }





        //On va initialiser une intervale qui sera notre timer (pour compter le nombre de secondes en étant inactif)
        //Il va effectuer les instructions chaque 1 seconde

      var interval =  setInterval(function(){

            secondsInactivity++ //S'incrémente de 1 à chaque fois
            // console.log("L'utilisateur a été inactif pendant " + secondsInactivity + " secondes")

            //On fait une condition qui déterminera si l'utilisateur a dépassé le temps limite.

            if(secondsInactivity > timeLimit){
                clearInterval(interval); //Une fois le temps limite atteint, on arrête l'intervalle
                logoutActivity();
            }

        },1000)

        //----On crée une fonction qui sera exécutée tant que l'utilisateur est actif-- 

        function isActive(){
            //remet le compteur à zéro
            secondsInactivity = 0;
        }

        //Tableau qui contient tous les évènements qui remettront le compteur à zéro 
        //(Toucher d'un bouton de la souris, scroll, quand on touche l'écran, on glisse la souris, une toucche du clavier est pressée)

        var activityEvents = [
            "mousedown",
            "mousemove",
            "keydown",
            "scroll",
            "touchstart"
        ]

        //On va parcourir chaque élément du tableau et on va leur ajouter un écouteur d'évènement qui va activer la fonction isActive si les condition sont remplies (true)

        activityEvents.forEach(function(eventName){
            document.addEventListener(eventName, isActive);
        })
    }
    
    ActivityWatcher();

    
    //--Fonction qui va retourner la liste des bugs--//

    async function BugList(){
        var token = sessionStorage.getItem("User_token");
        var user_id = sessionStorage.getItem('User_id');
        var url = `http://greenvelvet.alwaysdata.net/bugTracker/api/list/${token}/${user_id}` //Retourne la liste de bugs assignés à l'utilisateur
        var url_user = `http://greenvelvet.alwaysdata.net/bugTracker/api/users/${token}`

        // Requête pour récupérer la liste des utilisateurs

        await fetch(url_user, {
            method: "GET"
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            var user = data.result.user;
            sessionStorage.setItem('users',JSON.stringify(user)) //Je convertis les informations en chaînes de caractères JSON avant de les stocker
        })

        // Requête pour récupérer la liste des bugs assignés à l'utilisateur

        await fetch(url, {
            method: "GET"
        })
        .then(response => {
            return response.json();
        })
        .then(data =>{
          
            //Boucle pour récupérer les informations sur les bugs via la réponse de l'API
            console.log(data)
            for(i = 0; i < data.result.bug.length; i++){
                
                var user = JSON.parse(sessionStorage.getItem('users')); //recupère les données sous forme d'objets javascript

                //Création d'inputs select 

                var select = $('<select>').addClass('select');
                var id_select = `select-element-${[i]}` //Création d'un id différent pour chaque id
                var optionState = [0, 1, 2] //Ce tableau stocke les valeurs des états de bugs
                var etat = data.result.bug[i].state;
                for(nbr = 0; nbr < optionState.length; nbr++){
                    var options = $('<option>');
                    options.val(optionState[nbr]) //Chaque option aura une valeur correspondant au tableau optionState

                    //Contenu textuel des différentes balises options en fonction de la valeur de l'état

                    if(optionState[nbr] == 0){
                        options.text('Non traité');
                    }
                    
                    if (optionState[nbr] === 1) {
                        options.text('En cours');
                    }
                    
                    if (optionState[nbr] === 2){
                        options.text('Terminé')
                    }

                    //Si l'état du bug (sa valeur) correspond à l'une des valeurs des options du select, il est selectionné

                    if(options.val() == etat){
                        options.prop('selected', true); //il ajoute à cet element la propriété selected
                    }

                    select.append(options);
                    select.attr('id', id_select) //donne la valeur de id_select à l'id du select

                }
                
                //On récupère les informations du bug

                var bug_id = data.result.bug[i].id;
                var titre = data.result.bug[i].title;
                var description = data.result.bug[i].description;
                var date =new Date(data.result.bug[i].timestamp * 1000) // Je convertis la valeur numérique en millisecondes
                var dateDay = date.toLocaleDateString() 
                var dateTime = date.toLocaleTimeString()
                var developpeur = user[data.result.bug[i].user_id]; //retourne le nom de l'utilisateur 


                //On crée une ligne pour le bug (<tr>)

                var newRow = $("<tr>");
                var row_id = `bug-${bug_id}` //je crée un id pour chaque row (l'id des <tr> contient l'id de chaque bug)
                newRow.attr('id', row_id)

                // On ajoute les informations du bug dans les cellules <td> de la ligne <tr>

                $("<td>").html(titre + "<br>" + description).appendTo(newRow);
                $("<td>").text(dateDay + " " + dateTime).appendTo(newRow);
                $("<td>").text(developpeur).appendTo(newRow);
                $("<td>").html(select).appendTo(newRow);
                $("<td>").html("<button id='delete-btn'><i class='fa-solid fa-trash-can' style='color: #ffffff;'></i>Supprimer</button>").appendTo(newRow);

                //On ajoute la ligne <tr> dans le <tbody> du tableau

                $('.tbody').append(newRow);


            }
 
    

            //--Fonction de Détection du nombre de bugs(et de leur statut)--//

        
            function bugCount(){

                const bugs = data.result.bug.length; //Compte le nombre de bugs au total
                var countBugState1 = 0 //Compte le nombre de bugs qui sont en cours
                var countBugState2 = 0 //Compte le nombre de bugs qui sont terminés 
                for(j = 0; j < data.result.bug.length; j++){

                    //Il le tableau de bugs ans la Réponse de l'API et énumère tous les bugs qui sont en cours

                    if(data.result.bug[j].state === "1"){
                        countBugState1 ++
                    } else if (data.result.bug[j].state === "2") {
                        countBugState2++;
                    }                 
                    
                    
                }
                $('.nbr-bugs').text(bugs);
                $('.nbr-progress').text(countBugState1);
                $('.nbr-traitement').text(countBugState2);
            }

    

            //--Evènement pour changer le statut du bug--//

           select.each(() => {

                //Pour chaque select on ajoute un ecouteur d'évènement qui va effectuer une requête si on change les options

                //--Fonction pour changer le statut d'un bug--//

                $(document).on('change', 'select', async function changeState(event){

                    var newState = event.target.value //On récupère la valeur de l'option ciblée
                    var bugId = $(event.target).closest('tr').attr('id').replace('bug-', '') //On récupère l'id du tr parent 
                    var token = sessionStorage.getItem("User_token");
                    var url = `http://greenvelvet.alwaysdata.net/bugTracker/api/state/${token}/${bugId}/${newState}`

                    await fetch(url,{
                        method: "GET"
                    })
                    .then(response => {
                        return response.json()
                    })
                    .then(data =>{
                       console.log(data)
                       location.reload(); //refresh la page 
                    })
                    .catch(error =>{
                        console.error(error);
                    })
            });

            //--Evènement pour supprimer un bug--//

            var deleteBtn = $('#delete-btn');
            
            deleteBtn.each(()=>{
                
                $(document).on('click', '#delete-btn', async function deleteBug(event) {

                    var bugId = $(event.target).closest('tr').attr('id').replace('bug-', '') //On récupère l'id du tr parent 
                    var token = sessionStorage.getItem('User_token');
                    var url = `http://greenvelvet.alwaysdata.net/bugTracker/api/delete/${token}/${bugId}`
                    var confirmation = confirm('Voulez vous supprimer ce bug ?'); //Message de confirmation
                    
                    //Si l'utilisateur clique sur Ok, Le script enverra une requête à l'API

                    if(confirmation){
                        await fetch(url , {
                            method:"GET"
                        })
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            location.reload();    
                        })
                        .catch(error =>{
                            console.error(error);
                        });   
                    }
                    
                })
            })

            bugCount(); // Mettre à jour le compteur de bugs après avoir traité toutes les options de sélection et si un bug est supprimé   

           })
        })
        .catch(error => {
            console.error(error)
        })
    }

    BugList();

})