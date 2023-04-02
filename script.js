document.addEventListener('DOMContentLoaded', async () => {
  const futureEventsContainer = document.querySelector('.future-events');
  const pastEventsContainer = document.querySelector('.past-events');

  const API_KEY = 'AIzaSyAxSUaEX5hAPxNC8SLBSht1OP23wnQJwBo';
  const SPREADSHEET_ID = '1Y7-F9gCfa16R73lnh_ALXdLTLr9OZmSrnIqkx0g2TtQ';
  const SHEET_NAME = 'EventDatabaseEvrloot';
  const FALLBACK_IMAGE_URL = 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';

  function parseDate(dateString) {
    const [day, month, year, hour, minute] = dateString.split(/[- :]/);
    return new Date(year, month - 1, day, hour, minute);
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
    eventImage.src = eventData.ImageURL || FALLBACK_IMAGE_URL;
    imageContainer.appendChild(eventImage);

    const eventTime = document.createElement('div');
    eventTime.classList.add('event-time');
    const eventDate = eventData.Time;
    const formattedDate = `${eventDate.getDate()}-${eventDate.getMonth() + 1}-${eventDate.getFullYear()} ${eventDate.getHours()}:${eventDate.getMinutes()}`;
    eventTime.textContent = formattedDate;
    imageContainer.appendChild(eventTime);

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details');

    const title = document.createElement('h1');
    title.textContent = eventData.Title;
    detailsDiv.appendChild(title);

    const location = document.createElement('p');
    location.textContent = `Ort: ${eventData.Location}`;
    detailsDiv.appendChild(location);

    eventDiv.appendChild(imageContainer);
    eventDiv.appendChild(detailsDiv);

    return eventDiv;
  }

  function displayEvents() {
    fetchEventData().then((eventDataArray) => {
      const now = new Date();
      eventDataArray.forEach((eventData) => {
        const eventElement = createEventElement(eventData);
        if (eventData.Time > now) {
          futureEventsContainer.appendChild(eventElement);
        } else {
          pastEventsContainer.appendChild(eventElement);
        }
      });
    });
  }

  displayEvents();
});
