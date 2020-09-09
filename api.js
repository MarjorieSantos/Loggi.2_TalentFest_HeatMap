function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: -23.3256, lng: -46.3820 },
    mapTypeId: "hybrid"
  });

  const coords = test.drivers.map((item) => {
    return new google.maps.LatLng(item.lat, item.lng)
  })

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: coords,
    map: map
  });
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)"
  ];
  heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function changeRadius() {
  heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}

const test = {
  "driversCount": 200,
  "readyDriversCount": 139,
  "busyDriversCount": 61,
  "drivers": [
    {
      "lng": -46.63737869262695,
      "lat": -23.55320167541504,
      "busy": false
    },
    {
      "lng": -46.420684814453125,
      "lat": -23.43790054321289,
      "busy": true
    },
  ]
}