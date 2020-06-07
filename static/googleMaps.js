window.addEventListener("load", function() {
    let markers = [];
    var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -23.644, lng: -46.528},
          zoom: 10
        });
    }

    centralizarMapa("Santo André");
    carregarMarkers();

    function centralizarMapa(address) {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                map = new google.maps.Map(document.getElementById("map"), {zoom: 10, center: results[0].geometry.location} );
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function carregarMarkers() {
        if (map == null) {
            setTimeout(carregarMarkers, 300);
            return;
        }
        let locais = document.querySelectorAll("#local");
        locais.forEach(node => {
            criarMarker(node.innerHTML);
        });
    }

    function criarMarker(address) {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              let marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    title: address
                });
                markers.push(marker);
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

});