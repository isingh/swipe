$(document).ready(function($) {
  var retailersMap = {
    //Objects
    mapOptions: {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    map: null,
    user_pos: null,
    markers: []
  };
    //Methods
  retailersMap.initialize = function() {
    $('#map').height($('.content.container-fluid').height());

    retailersMap.map = new google.maps.Map(document.getElementById("map"), retailersMap.mapOptions);

    // Try HTML5 geolocation
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        retailersMap.user_pos = position;

        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var infowindow = new google.maps.InfoWindow({
          map: retailersMap.map,
          position: pos,
          content: "You are here. We'll show you places to go around this place."
        });

        //Setting map center
        retailersMap.map.setCenter(pos);
        //Looking for commerces
        retailersMap.getCloserRetailers(position.coords.latitude,position.coords.longitude);
      }, function() {
        retailersMap.handleNoGeolocation(true);
      });
    } else {
      retailersMap.handleNoGeolocation(false); // Browser doesn't support Geolocation
    }
  };

  retailersMap.handleNoGeolocation = function(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  };

  retailersMap.getCloserRetailers = function(){
    /* ----- TEST ONLY init ----- */
    var data = [
      {
        name: "StarBucks",
        coords: {
          latitude: this.user_pos.coords.latitude,
          longitude: this.user_pos.coords.longitude
        }
      }
    ]

    for(var i=0; i<20; i++){
      var aux = {
        name: "StarBucks #"+(i+1),
        coords: {
          latitude: this.user_pos.coords.latitude - 0.005 + Math.random()*0.01,
          longitude: this.user_pos.coords.longitude - 0.005 + Math.random()*0.01
        }
      }
      data.push(aux);
    }

    retailersMap.printRetailers(data);
    return;
    /* ----- TEST ONLY end ----- */

    var lat = this.user_pos.coords.latitude;
    var long = this.user_pos.coords.longitude;

    console.log("Getting closer retailers for pos: ", lat, long);
    $.ajax({
      url: '/retailers',
      type: 'POST',
      dataType: 'json',
      data: {lat: lat, long: long},
      success: function(data, textStatus, xhr) {
        console.log("OK!", data);
        retailersMap.printRetailers(data);
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log("ERROR retrieving retailers");
      }
    });

  };

  retailersMap.printRetailers = function(retailers){
    console.log("retailers", retailers, retailers.length);
    retailersMap.clearMarkers();
    for (var i = 0; i < retailers.length; i++) {
      retailersMap.markers[i] = new google.maps.Marker({
        position: new google.maps.LatLng(retailers[i].coords.latitude, retailers[i].coords.longitude),
        animation: google.maps.Animation.DROP
      });
      //google.maps.event.addListener(retailersMap.markers[i], 'click', retailersMap.getDetails(retailers[i], i));
      setTimeout(retailersMap.dropMarker(i), i * 100);
    }
  };

  retailersMap.dropMarker = function(i) {
    console.log("drop", i);
    return function() {
      retailersMap.markers[i].setMap(retailersMap.map);
    }
  };

  retailersMap.clearMarkers = function() {
    for (var i = 0; i < retailersMap.markers.length; i++) {
      if (retailersMap.markers[i]) {
        retailersMap.markers[i].setMap(null);
        retailersMap.markers[i] == null;
      }
    }
  };

  // Map loading
  google.maps.event.addDomListener(window, 'load', retailersMap.initialize);
});
