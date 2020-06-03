window.addEventListener("load", function() {
    let formCadastro = document.getElementById("formCadastro");
    let nome = document.getElementById("nome");
    let email = document.getElementById("email");
    let telefone = document.getElementById("telefone");
    let password = document.getElementById("password");
    
    if ( window.history.replaceState ) {
        window.history.replaceState( null, null, window.location.href );
    }

    var headers = {
        "Content-Type": "application/json",                                                                                                
        "Access-Control-Origin": "*"
     }

    formCadastro.addEventListener("submit", function(e) {
        /*fetch('http://localhost:3000/cadastro', {  
            method: 'POST',  
            headers: headers,
            body: JSON.stringify(
                {
                    name: "a"
                }
            )
        }).then(function (data) {  
            console.log('Request success: ', data);  
        }).catch(function (error) {  
          console.log('Request failure: ', error);  
        });*/
    });
});