$(document).ready(function(){
    var form = $('.login-container')

    form.submit((event)=>{
        
        event.preventDefault()

        //Opération asynchrone pour la connexion (login)

   async function login(){

        //Variables 

        var username = $('#username').val();
        var password = $('#password').val();
        var url = `http://greenvelvet.alwaysdata.net/bugTracker/api/login/${username}/${password}`
        var input = $('input')
        
        await fetch(url, {
            method: "GET"
        })
        .then(response => { 
  
              if(response.ok){
                 return response.json(); 
              }
              throw new Error('Une erreur est survenue')
          })
          .then(data => {
            console.log(data); // affiche la réponse complète dans la console
            const token = data.result.token; //Je récupère le token 
            sessionStorage.setItem("User_token",token) //On conserve la valeur de ce token dans une session (navigateur)
          })
          .then(() => {
            alert('Bienvenue sur Bugtracker ' + username + ' !');
            window.location.href = "list.html"
          })
          .catch(error => {
            alert('Une erreur est survenue');
            input.css("border", "2px solid #E74C3C"); //On change la couleur des bordures des inputs
            $('.group-form-2').append("<span class='error'>*Veuillez vérifiez vos identifiants</span>") //On rajoute dans la div qui a pour classe group-form-2 un span
            console.error(error);
          })
    }

    login() //Appel de la fonction

    })


    
    

})