$(document).ready(function(){

    var logoutBtn = $('#logout'); //On se connecte au bouton se déconnecter via le DOM

    //Lorsqu'on clique sur le bouton "se déconnecter"
    logoutBtn.click((event)=>{
        event.preventDefault() //On empêche le bouton de rediriger par défaut

        //Je crée une fonction qui va gérer la déconnexion de l'utilisateur 

       async function logout(){
            var token = sessionStorage.getItem("User_token"); //On récupère la valeur du token stockée dans la clé
            var url = `http://greenvelvet.alwaysdata.net/bugTracker/api/logout/${token}`
            await fetch(url, {
                method:"GET"
            })
            .then(Response => {
                if(Response.ok){
                    sessionStorage.removeItem("User_token"); //On écrase le token dans la session du navigateur
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

//Fonction qui va gérer le temps d'inactivité d'un utilisateur.

    function ActivityWatcher(){


        //Je définis le nombre de secondes 

        var secondsInactivity = 0 //cette variable stocke le temps pendant lequel l'utilisateur est inactif

        //Temps limite

        var timeLimit = 10 // 1min = 60 secondes, 60 x 20 = 1200, soit 20 minutes.


        async function logoutActivity(){
            var token = sessionStorage.getItem("User_token"); //On récupère la valeur du token stockée dans la clé
            var url = `http://greenvelvet.alwaysdata.net/bugTracker/api/logout/${token}`
            await fetch(url, {
                method:"GET"
            })
            .then(Response => {
                if(Response.ok){
                    sessionStorage.removeItem("User_token"); //On écrase le token dans la session du navigateur
                    alert('Vous êtes inactif depuis 20 min. Vous serez deconnecté');
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





        //On va initialiser une intervale qui sera notre timer (pour compter le nombre de secondes en étant inactif)
        //Il va effectuer les instructions chaque 1 seconde

      var interval =  setInterval(function(){

            secondsInactivity++ //S'incrémente de 1 à chaque fois
            console.log("L'utilisateur a été inactif pendant " + secondsInactivity + " secondes")

            //On fait une condition qui déterminera si l'utilisateur a dépassé le temps limite.
            //On le redirige sur une autre page si c'est le cas 

            if(secondsInactivity > timeLimit){
                clearInterval(interval); //Une fois le temps limite atteint, on arrête l'intervalle
                logoutActivity();
            }

        },1000)

        //On crée une fonction qui sera exécutée tant que l'utilisateur est actif 

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

    

})


