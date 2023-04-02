document.addEventListener('DOMContentLoaded', async () => {
  const futureEventsContainer = document.querySelector('.future-events');
  const pastEventsContainer = document.querySelector('.past-events');

  const API_KEY = 'YOUR_ACTUAL_API_KEY';
  const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
  const SHEET_NAME = 'Sheet1';

  function parseDate(dateString) {
    const [day, month, year] = dateString.split('-');
    return new Date(year, month - 1, day);
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

    const eventImageContainer = document.createElement('div');
    eventImageContainer.classList.add('image-container');

    const eventImage = document.createElement('img');
    eventImage.src = eventData['Image URL'];
    eventImage.alt = 'Event Image';

    eventImageContainer.appendChild(eventImage);

    const eventTime = document.createElement('p');
    const eventDate = eventData.Time;
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
    const dateA = a.Time;
    const dateB = b.Time;
    return dateA - dateB;
  }

  function isPastEvent(eventData) {
    const eventDate = eventData.Time;
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
