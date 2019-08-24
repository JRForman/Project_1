// geolocation
var zipcode = '';
function writeAddressName(latLng) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    "location": latLng
  },
    function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      }
      else
        document.getElementById("error").innerHTML += "Unable to retrieve your address" + "<br />";
    });
}

// multiple users
var userLocations = [];
var lat;
var lng;

database.ref("userLocations").on("child_added", function (snapshot) {
  userLocations.push(snapshot.val().tempUserLoc);
  lat = 0;
  lng = 0;
  // console.log(userLocations);
  for (x in userLocations) {
    lat += (JSON.parse(userLocations[x]).lat)
    lng += (JSON.parse(userLocations[x]).lng)
  }

  lat /= userLocations.length;
  lng /= userLocations.length;
  // userCenter = {"lat":lat, "lng":lng};
});

// !____________________________________________________
setTimeout(function () {

  var latlng = new google.maps.LatLng(lat, lng);
  // This is making the Geocode request
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'latLng': latlng }, function (results, status) {
    if (status !== google.maps.GeocoderStatus.OK) {
      alert(status);
    }

    // This is checking to see if the Geoeode Status is OK before proceeding
    if (status == google.maps.GeocoderStatus.OK) {

      var address = results[0].address_components;
      for (var i = 0; i < address.length; i++) {
        if (address[i].types.includes("postal_code")) { zipcode = address[i].short_name; }
      }
      console.log(zipcode);
    }
  });


}, 1000)
// !____________________________________________________


// location retrieved
function geolocationSuccess(position) {
  var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  // Write the formatted address
  for (x in userLocations) {
    userLat = JSON.parse(JSON.stringify(userLatLng)).lat
    userLng = JSON.parse(JSON.stringify(userLatLng)).lng
    if ((Math.abs(lat - userLat) < .01) && (Math.abs(lng - userLng) < .01)) {
      console.log("User too close");
      break;
    } else if (x == userLocations.length - 1) {
      var tempUserLoc = JSON.stringify(userLatLng)
      database.ref("userLocations").push({
        tempUserLoc
      });
    }
  }


  userLocations.push(JSON.stringify(userLatLng))
  var tempUserLoc = JSON.stringify(userLatLng)
  // database.ref("userLocations").push({
  //   tempUserLoc
  // });
  writeAddressName(userLatLng);
  var myOptions = {
    zoom: 10,
    center: userLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#0294a5' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#03353e' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
      }
    ]


  };
  // Draw the map
  var mapObject = new google.maps.Map(document.getElementById("map"), myOptions, {

  });
  // Place the marker
  var marker, i;


  for (var i = 0; i < userLocations.length; i++) {
    tempUserLoc = JSON.parse(userLocations[i])
    marker = new google.maps.Marker({
      position: tempUserLoc,
      // position:userLocations[i],
      map: mapObject,
      title: 'userMarker',
      zoom: 10,
      icon: {
        url: "assets/images/Flag_2.svg",
        scaledSize: new google.maps.Size(64, 64)
      }
      // fillColor: '#c1403d',
    });
    var infowindow = new google.maps.InfoWindow({

    });
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {

        infowindow.setContent(tempUserLoc[0]);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }

  //multi user cirle
  for (var j = 0; j < userLocations.length; j++) {
    tempUserLoc = JSON.parse(userLocations[j])
    circle = new google.maps.Circle({
      center: tempUserLoc,
      radius: position.coords.accuracy,
      map: mapObject,
      fillColor: '#a79c93',
      fillOpacity: 0.5,
      strokeColor: '#c1403d',
      strokeOpacity: 1.0
    });
    mapObject.fitBounds(circle.getBounds());
    // console.log("working " + userLocations[j]);
    google.maps.event.addListener(circle, 'click', (function (circle, j) {
      return function () {
        infowindow.setContent(userLocations[j][0]);
        infowindow.open(map, circle);
      }
    })(circle, j));
  };
}

// Error
function geolocationError(positionError) {
  document.getElementById("error").innerHTML += "Error: " + positionError.message + "<br />";
}

// geolocate user
function geolocateUser() {
  // If the browser supports the Geolocation API
  if (navigator.geolocation) {
    var positionOptions = {
      enableHighAccuracy: true,
      timeout: 10 * 1000 // 10 seconds
    };
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
  }
  else
    document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
}

//load on window
window.onload = geolocateUser;