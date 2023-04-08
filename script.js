document.addEventListener('DOMContentLoaded', async () => {
  const futureEventsContainer = document.querySelector('.future-events');
  const pastEventsContainer = document.querySelector('.past-events');

  const API_KEY = 'AIzaSyCiIHjuNf7gMLvBDk6IN9MGC5zQgpsoEas';
  const SPREADSHEET_ID = '1Y7-F9gCfa16R73lnh_ALXdLTLr9OZmSrnIqkx0g2TtQ';
  const SHEET_NAME = 'EventDatabaseEvrloot';
  const FALLBACK_IMAGE_URL = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';

  function parseDate(dateString) {
    const [day, month, year, hour, minute] = dateString.split(/[- :]/);
    return new Date(year, month - 1, day, hour, minute);
  }

  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
  }

  async function fetchEventData() {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const headers = data.values[0];
      const rows = data.values.slice(1);
      const formattedData = rows.map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          if (header === 'Time') {
            obj[header] = parseDate(row[index]);
          } else {
            obj[header] = row[index];
          }
        });
        return obj;
      });

      return formattedData;
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  }
function createEventElement(eventData) {
  const eventDiv = document.createElement('div');
  eventDiv.classList.add('event');

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');
  const eventImage = document.createElement('img');
  eventImage.src = eventData.ImageURL !== '' ? eventData.ImageURL : FALLBACK_IMAGE_URL;
  imageContainer.appendChild(eventImage);

  const eventTime = document.createElement('div');
  eventTime.classList.add('event-time');
  const eventDate = eventData.Time;
  const formattedDate = formatDate(eventDate);
  eventTime.textContent = formattedDate;
  imageContainer.appendChild(eventTime);
  
  // Add this code after appending the eventTime element to the imageContainer
  const freeSlots = document.createElement('div');
  freeSlots.classList.add('free-slots');
  freeSlots.textContent = `Freie Plätze: ${eventData['Free Slots']}`;
  imageContainer.appendChild(freeSlots);


  const detailsDiv = document.createElement('div');
  detailsDiv.classList.add('details');

  const title = document.createElement('h1');
  title.textContent = eventData.Title;
  detailsDiv.appendChild(title);

  const location = document.createElement('p');
  location.textContent = `Ort: ${eventData.Location}`;
  detailsDiv.appendChild(location);

  const signUpButton = document.createElement('a');
  signUpButton.href = 'mailto:team@evrloot.io?subject=Anmeldung zum Event: ' + eventData.Title;
  signUpButton.textContent = 'Anmelden ';
  signUpButton.classList.add('sign-up-button');
  const mailIcon = document.createElement('span');
  mailIcon.innerHTML = '📩';
  signUpButton.appendChild(mailIcon);
  detailsDiv.appendChild(signUpButton);

  eventDiv.appendChild(imageContainer);
  eventDiv.appendChild(detailsDiv);

  return eventDiv;
}

 function displayEvents() {
  fetchEventData().then((eventDataArray) => {
    let upcomingEventsExist = false;

    eventDataArray.forEach((eventData) => {
      const eventElement = createEventElement(eventData);
      const now = new Date();

      if (eventData.Time >= now) {
        futureEventsContainer.appendChild(eventElement);
        upcomingEventsExist = true;
      } else {
        pastEventsContainer.appendChild(eventElement);
      }
    });

    if (!upcomingEventsExist) {
      const noEventsMessage = document.createElement('p');
      noEventsMessage.innerHTML = 'Aktuell sind keine Events eingetragen. Das wird sich aber schnell ändern. Diese Seite wird wöchentlich aktualisiert.';
      noEventsMessage.classList.add('no-events-message');

      const evrlootSignature = document.createElement('p');
      evrlootSignature.innerHTML = '<br>Das Evrloot Team';
      evrlootSignature.classList.add('evrloot-signature');

      futureEventsContainer.appendChild(noEventsMessage);
      futureEventsContainer.appendChild(evrlootSignature);
    }
  });
}


  displayEvents();
});

