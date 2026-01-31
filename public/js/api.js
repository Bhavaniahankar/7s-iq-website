const API_BASE = '/api';

async function fetchData(filename) {
    try {
        const response = await fetch(`${API_BASE}/${filename}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${filename}:`, error);
        return null;
    }
}

async function sendData(filename, data) {
    try {
        const response = await fetch(`${API_BASE}/${filename}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(`Error sending ${filename}:`, error);
        return { success: false, error: error.message };
    }
}

async function submitCourseRequest(data) {
    try {
        const response = await fetch(`${API_BASE}/course-inquiry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error submitting course request:', error);
        return { success: false, error: 'Failed to submit' };
    }
}

async function registerForEvent(data) {
    try {
        const response = await fetch(`${API_BASE}/event-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error registering for event:', error);
        return { success: false, error: 'Registration failed' };
    }
}
