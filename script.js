document.addEventListener('DOMContentLoaded', async () => {
  const futureEventsContainer = document.querySelector('.future-events');
  const pastEventsContainer = document.querySelector('.past-events');

  const API_KEY = 'YOUR_ACTUAL_API_KEY';
  const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
  const SHEET_NAME = 'Sheet1';

  async function fetchEventData() {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${1Y7-F9gCfa16R73lnh_ALXdLTLr9OZmSrnIqkx0g2TtQ}/values/${EventDatabaseEvrloot}?key=${AIzaSyAxSUaEX5hAPxNC8SLBSht1OP23wnQJwBo}`;
      const response = await fetch(url);
      const data = await response.json();
      const headers = data.values[0];
      const rows = data.values.slice(1);
      const formattedData = rows.map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
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

    const eventImageContainer = document.createElement('div');
    eventImageContainer.classList.add('image-container');

    const eventImage = document.createElement('img');
    eventImage.src = eventData['Image URL'];
    eventImage.alt = 'Event Image';

    eventImageContainer.appendChild(eventImage);

    const eventTime = document.createElement('p');
    const eventDate = new Date(eventData.Time);
    const germanFormattedTime = new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(eventDate);
    eventTime.textContent = `Zeit: ${germanFormattedTime}`;
    eventTime.classList.add('event-time');

    const eventDetails = document.createElement('div');
    eventDetails.classList.add('details');

    const eventTitle = document.createElement('h1');
    eventTitle.textContent = eventData.Title;

    const eventLocation = document.createElement('p');
    eventLocation.textContent = `Location: ${eventData.Location}`;

    eventDetails.appendChild(eventTitle);
    eventDetails.appendChild(eventLocation);

    eventDiv.appendChild(eventImageContainer);
    eventDiv.appendChild(eventTime);
    eventDiv.appendChild(eventDetails);

    return eventDiv;
  }

  function compareDates(a, b) {
    const dateA = new Date(a.Time);
    const dateB = new Date(b.Time);
    return dateA - dateB;
  }

  function isPastEvent(eventData) {
    const eventDate = new Date(eventData.Time);
    const currentDate = new Date();
    return eventDate < currentDate;
  }

  async function displayEvents() {
    const eventsData = await fetchEventData();
    const sortedEventsData = eventsData.sort(compareDates);

    sortedEventsData.forEach((eventData) => {
      const eventElement = createEventElement(eventData);

      if (isPastEvent(eventData)) {
        pastEventsContainer.appendChild(eventElement);
      } else {
        futureEventsContainer.appendChild(eventElement);
      }
    });
  }

  displayEvents();
});
