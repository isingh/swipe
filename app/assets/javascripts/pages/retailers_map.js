$(document).ready(function($) {
  var retailersMap = {
    //Objects
    mapOptions: {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    map: null,
    user_pos: null
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
    console.log("Getting closer retailers for pos: ", this.user_pos.coords.latitude, this.user_pos.coords.longitude);
  };

  retailersMap.printRetailers = function(){

  };

  // Map loading
  google.maps.event.addDomListener(window, 'load', retailersMap.initialize);
});
