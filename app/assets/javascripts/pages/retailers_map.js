$(document).ready(function($) {
  var retailersMap = {
    //Objects
    mapOptions: {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    map: null,
    user_pos: null,
    retailers: [],
    markers: [],
    iw: new google.maps.InfoWindow()
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

        var image = 'http://code.google.com/apis/maps/documentation/javascript/examples/images/beachflag.png';
        var beachMarker = new google.maps.Marker({
          position: pos,
          map: retailersMap.map,
          icon: image
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
    for(var i=0; i<20; i++){
      var aux = {
        name: "<div style='margin: 0 10px;'><h3>StarBucks #"+(i+1)+"</h3></div>",
        description: "<div style='margin: 0 10px;'>Get a free coffee at any of our locations!</div>",
        img_src: "http://fc05.deviantart.net/fs71/f/2011/214/d/a/starbucks_logo_icon_by_mahesh69a-d42twe0.png",
        coords: {
          latitude: this.user_pos.coords.latitude - 0.005 + Math.random()*0.01,
          longitude: this.user_pos.coords.longitude - 0.005 + Math.random()*0.01
        }
      }
      retailersMap.retailers.push(aux);
    }

    retailersMap.printRetailers();
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
        retailersMap.retailers = data;
        retailersMap.printRetailers();
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log("ERROR retrieving retailers");
      }
    });

  };

  retailersMap.printRetailers = function(){
    retailersMap.clearMarkers();
    for (var i = 0; i < retailersMap.retailers.length; i++) {
      retailersMap.markers[i] = new google.maps.Marker({
        position: new google.maps.LatLng(retailersMap.retailers[i].coords.latitude, retailersMap.retailers[i].coords.longitude),
        animation: google.maps.Animation.DROP
      });
      google.maps.event.addListener(retailersMap.markers[i], 'click', retailersMap.showInfoWindow(i));
      setTimeout(retailersMap.dropMarker(i), i * 100);
    }
  };

  retailersMap.dropMarker = function(i) {
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

  retailersMap.showInfoWindow = function(i) {
    return function(){
      retailersMap.iw.setContent(retailersMap.getIWContent(retailersMap.retailers[i]));
      retailersMap.iw.setPosition(retailersMap.markers[i].getPosition());
      retailersMap.iw.open(retailersMap.map);
    }
  };

  retailersMap.getIWContent = function(retailer) {
    var content = '<table style="border:0"><tr><td style="border:0;">';
    content += '<img class="placeIcon" src="' + retailer.img_src + '" style="width: 50px"></td>';
    content += '<td style="border:0;"><strong>' + retailer.name + '</strong>';
    content += '<p>' + retailer.description + '</p>';
    content += '</td></tr></table>';
    return content;
  }

  // Map loading
  google.maps.event.addDomListener(window, 'load', retailersMap.initialize);
});
