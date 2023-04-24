$(document).ready(() => {

    var btnSave= $('#btn-save'); 

    btnSave.click((event) =>{
        event.preventDefault();

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
                    if(Response.ok){
                        sessionStorage.removeItem("User_token"); //On écrase le token dans la session du navigateur
                        sessionStorage.removeItem("User_id"); //On écrase l'id de l'utilisateur dans la session du navigateur
                        alert('Vous êtes inactif depuis 20 min. Vous serez deconnecté');
                        return Response.json();
                    } else {
                        throw new Error('Une erreur est survenue')
                    }
                })
                .then(() => {
                    window.location.href = "index.html"
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

        //--Fonction qui va envoyer les informations du formulaire--//

        async function sendBug(){
            var token = sessionStorage.getItem('User_token');
            var user_id = sessionStorage.getItem('User_id') //Je récupère mon id d'utilisateur
            var url = `http://greenvelvet.alwaysdata.net/bugTracker/api/add/${token}/${user_id}`
            var titre = $('#titre').val();
            var description = $('#description').val();

            //On envoie les données avec la méthode POST et on les convertit en chaînes de caractères Json

            await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    title:titre,
                    description:description,
                  })
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                alert('Bug ajouté avec succès !')
                window.location.href = "list.html"
            })
            .catch(error => {
                console.error(error);
            })
        }

        sendBug() //on appelle la fonction sendBug

    })
    

})