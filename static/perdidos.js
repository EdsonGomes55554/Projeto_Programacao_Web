window.addEventListener("load", function() {
    let btnCachorro = document.getElementById("cachorro");
    let btnGato = document.getElementById("gato");

    btnCachorro.addEventListener('click', function() {
        post("/perdidos", {cachorro: true});
    });

    btnGato.addEventListener('click', function() {
        post("/perdidos", {gato: true});
    });

    function post(path, params, method='post') {
        const form = document.createElement('form');
        form.method = method;
        form.action = path;
      
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = params[key];
      
            form.appendChild(hiddenField);
          }
        }
      
        document.body.appendChild(form);
        form.submit();
    }
});