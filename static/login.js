window.addEventListener("load", function() {
    let json = [{"email":"a@gmail.com", "senha":"123"}, {"email":"teste@gmail.com", "senha":"senha"}];
    let contas = JSON.parse(JSON.stringify(json));
    let formLogin = document.getElementById("formLogin");
    let lembrar = this.document.getElementById("lembrar");
    

    let teste = function entrar() {
        let usuario = document.getElementById("email").value;
        let senha = document.getElementById("senha").value;
        let contaValida = false;

        contas.forEach(conta => {
            if (conta.email == usuario && conta.senha == senha) {
                contaValida = true;
                if(lembrar.checked == true) {
                    localStorage.setItem('status','loggedIn');
                } else {
                    sessionStorage.setItem('status','loggedIn');
                }
                
                
            }
        });

        return contaValida;
    }

    
    
    formLogin.addEventListener("submit", function(e) {
        if(teste() == false) {
            e.preventDefault();
            alert("Por favor cheque se o seu email ou senha foram inseridos corretamente.");
        }
    });
});