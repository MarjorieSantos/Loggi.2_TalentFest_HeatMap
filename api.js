let map, heatmap;

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
  });

  function chosenRegion({ lat, lng, zoom }) {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: zoom,
      center: { lat, lng },
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: coords,
      map: map
    });
  }

  const zoom = 13;

  document.querySelector('#sul-sp').addEventListener('click', () => chosenRegion({ lat: -23.5838, lng: -46.7938, zoom }))
  document.querySelector('#center-sp').addEventListener('click', () => chosenRegion({ lat: -23.5507, lng: -46.6331, zoom }))
  document.querySelector('#north-sp').addEventListener('click', () => chosenRegion({ lat: -23.4777, lng: -46.6021, zoom }))
  document.querySelector('#lest-sp').addEventListener('click', () => chosenRegion({ lat: -23.5676, lng: -46.5431, zoom }))
  document.querySelector('#oeste-sp').addEventListener('click', () => chosenRegion({ lat: -23.5475, lng: -46.7018, zoom }));

  const regionmap = {
    sul: {
      center: { lat: -23.5838, lng: -46.7938 },

    },
    norte: {
      center: { lat: -23.4777, lng: -46.6021 },
    },
    leste: {
      center: { lat: -23.5676, lng: -46.5431 },
    },
    oeste: {
      center: { lat: -23.5475, lng: -46.7018 },
    },
    centro: {
      center: { lat: -23.5507, lng: -46.6331 },
    },
  };

  for (const region in regionmap) {
    const cityCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: regionmap[region].center,
      radius: Math.sqrt(700) * 100
    });
  }

  const response = await consumeLoggiApi(endPoint, graphQL)
  const totalDrivers = response.data.closestDrivers.drivers;

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
