document.addEventListener('DOMContentLoaded', async () => {
  const futureEventsContainer = document.querySelector('.future-events');
  const pastEventsContainer = document.querySelector('.past-events');

  async function fetchEventData() {
    try {
      const response = await fetch('https://sheet.best/api/sheets/1e3ac16b-2b20-4c0f-a327-d10f43f42eae');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  }

  function createEventElement(eventData) {
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event');

    const eventImage = document.createElement('img');
    eventImage.src = eventData['Image URL'];
    eventImage.alt = 'Event Image';

    const eventDetails = document.createElement('div');
    eventDetails.classList.add('details');

    const eventTitle = document.createElement('h1');
    eventTitle.textContent = eventData.Title;

    const eventLocation = document.createElement('p');
    eventLocation.textContent = `Location: ${eventData.Location}`;

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

    eventDetails.appendChild(eventTitle);
    eventDetails.appendChild(eventLocation);
    eventDetails.appendChild(eventTime);

    eventDiv.appendChild(eventImage);
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
