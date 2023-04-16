$(document).ready(function(){


    var input_password = $('#password'); // l'input password
  
    //Validité du mot de passe
    input_password.focusout(function(){ //Perte de focus de l'input password

    
        var errorMessage = ''; //contiendra les messages d'erreur
        var password = $('#password').val(); //récupère la valeur du champ password

      //Vérification de la taille du mot de passe 

      
      if(password.length < 5){
        errorMessage += "*Le mot de passe doit avoir plus de 5 caractères."
        $('#password').css('border', '2px solid #E74C3C');
        $('.verification').text(errorMessage);
      } else {
        $('#password').css('border', '2px solid #20262E');
        $('.verification').text('');
      }

    });
  
    var form = $('.signup-container');

    form.submit(function(event){ 
      event.preventDefault();
  
      //Définition des variables 
      
      var password = $('#password').val(); 
      var password_confirm = $('#confirm-password').val()
      
      //Vérification de la correspondance mot de passe 
      if(password !== password_confirm){
        $('.confirmation').text('*Vos mots de passe ne correspondent pas.');
        $('#confirm-password').css('border', '2px solid #E74C3C');
      } else {
        $('.confirmation').text('');
        $('#confirm-password').css('border', '2px solid #20262E');
      }

      //Opération asynchrone pour l'inscription 

      async function signUp(){
        var username = $('#username').val(); 
        var password = $('#password').val(); 
        var url = `http://greenvelvet.alwaysdata.net/bugTracker/api/signup/${username}/${password}` //Je crée une url contenant les valeurs username et password

        await fetch(url, {
            method: "GET",
        })
        .then(response => { 

          //Si une reponse a été donnée, je signale cela via une alerte et je redirige l'utilisateur dans le login. Dans le cas contraire, il y'aura une erreur

            if(response.ok){
               alert('Vous avez été inscrit avec succès !') 
               return response.json(); 
            }
            throw new Error('Une erreur est survenue')
        })
        .then(data => console.log(data))
        .then(() => {
          window.location.href = "login.html"
        })
        .catch(error => {
          alert('Une erreur est survenue');
          console.error(error);
        })
        
        
      }

      signUp(); //On appelle la fonction 

    

    });



  });