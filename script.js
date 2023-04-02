document.addEventListener('DOMContentLoaded', async () => {
  const eventsContainer = document.querySelector('.container');

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
    eventTime.textContent = `Time: ${eventData.Time}`;

    eventDetails.appendChild(eventTitle);
    eventDetails.appendChild(eventLocation);
    eventDetails.appendChild(eventTime);

    eventDiv.appendChild(eventImage);
    eventDiv.appendChild(eventDetails);

    return eventDiv;
  }

  async function displayEvents() {
    const eventsData = await fetchEventData();

    eventsData.forEach((eventData) => {
      const eventElement = createEventElement(eventData);
      eventsContainer.appendChild(eventElement);
    });
  }

  displayEvents();
});
