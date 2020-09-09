const graphQL = `query AppQuery {
  closestDrivers(productType: 2, transportType: "1", lat: -23.55, lng: -46.63, radius: 10.0, limit: 200, citySlug:"sp") {
    driversCount
    readyDriversCount
    busyDriversCount
    drivers {
      lng
      lat
      busy
    }
  }
}`;

const endPoint = 'https://www.loggi.com/graphql';

const consumeLoggiApi = async (endPointGraphql, query, variable = {}) => {
  const res = await fetch(endPointGraphql,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'ApiKey larissa.miyaji@gmail.com:690606c72dd744f76826a04630a8a16268ac2560',
      },
      body: JSON.stringify({ query, variable }),
    })
  return res.json();
}

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: -23.3256, lng: -46.3820 },
    mapTypeId: "hybrid"
  });

  const response = await consumeLoggiApi(endPoint, graphQL)

  console.log(response.data)

  const coords = response.data.closestDrivers.drivers.map(heatpoint => {
    return new google.maps.LatLng(heatpoint.lat, heatpoint.lng)
  })

  // const coords = test.drivers.map((item) => {
  //   return new google.maps.LatLng(item.lat, item.lng)
  // })

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

// consumeLoggiApi(endPoint, graphQL).then(res => {
//   console.log(res)
//   res.data.closestDrivers.drivers.map(pontodecalor => {
//     return console.log(pontodecalor.lat, pontodecalor.lng)
//   })
// })