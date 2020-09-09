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
    zoom: 11,
    center: { lat: -23.5506, lng: -46.6333 },
    mapTypeId: "hybrid"
  });

  const response = await consumeLoggiApi(endPoint, graphQL)

  const totalDrivers = response.data.closestDrivers.drivers;

  response.data.closestDrivers.drivers.map(item => {
    if (item.busy === true) {
      console.log('indisponivel')
    } else if (item.busy === false) {
      console.log('disponivel')
    }
  })

  const coords = totalDrivers.map(heatpoint => {
    return new google.maps.LatLng(heatpoint.lat, heatpoint.lng)
  })

  const readyDrivers = response.data.closestDrivers.readyDriversCount
  const busyDrivers = response.data.closestDrivers.busyDriversCount
  const driversCount = response.data.closestDrivers.driversCount

  const busyDriversCount = document.querySelector('#busy-drivers')
  busyDriversCount.innerText = `Mensageiros indisponíveis ❯ ${busyDrivers}`;

  const driversCountTotal = document.querySelector('#drivers-count')
  driversCountTotal.innerText = `Total de mensageiros ❯ ${driversCount}`;

  const readyDriversCount = document.querySelector('#ready-drivers')
  readyDriversCount.innerText = `Mensageiros disponíveis ❯ ${readyDrivers}`;

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: coords,
    map: map
  });
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeRadius() {
  heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}
