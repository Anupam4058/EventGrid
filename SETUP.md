# Setup Guide

## Quick Start

### 1. Backend Setup

1. **Navigate to Backend directory**:
   ```bash
   cd Backend
   ```

2. **Create `.env` file** with the following content:
   ```env
   PORT=3000
   DB_CONNECT=mongodb://localhost:3000/event-management
   ```
   
   **Note**: If you're using MongoDB Atlas, replace with your connection string:
   ```env
   DB_CONNECT=mongodb+srv://username:password@cluster.mongodb.net/event-management
   ```

3. **Install dependencies** (already done):
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   The server should start on `http://localhost:3000`

### 2. Frontend Setup

1. **Navigate to Frontend directory**:
   ```bash
   cd Frontend
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   The app should start on `http://localhost:5173`

### 3. Access the Application

Open your browser and navigate to: `http://localhost:5173`

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add your IP address to the IP whitelist
4. Create a database user
5. Get your connection string and update the `.env` file

## Testing the Application

### Create Your First Profile

1. When you first open the app, you'll see a welcome screen
2. Click "Create Your First Profile"
3. Enter a name (e.g., "John Doe")
4. Select a timezone (e.g., "America/New_York")
5. Click "Create Profile"

### Create an Event

1. After creating a profile, click "Create Event"
2. Fill in the event details:
   - Title: "Team Meeting"
   - Description: "Quarterly review meeting"
   - Timezone: Select your preferred timezone
   - Start Date & Time: Choose a date and time
   - End Date & Time: Choose an end time
   - Profiles: Select one or more profiles
3. Click "Create Event"

### Test Timezone Conversion

1. Create multiple profiles with different timezones
2. Create an event assigned to multiple profiles
3. Switch between profiles using the dropdown
4. Notice how the event times automatically adjust to each profile's timezone

### Test Event Updates

1. Click the edit icon on an event
2. Modify any field (e.g., change the title or time)
3. Save the changes
4. Click the info icon to view event details
5. Scroll down to see the update history

## Troubleshooting

### Backend won't start

- **Error: DB_CONNECT is undefined**
  - Make sure you created the `.env` file in the Backend directory
  - Check that the file contains the `DB_CONNECT` variable

- **Error: Connection to MongoDB failed**
  - If using local MongoDB, make sure MongoDB is running
  - If using MongoDB Atlas, check your connection string and IP whitelist

### Frontend won't start

- **Error: Cannot find module**
  - Run `npm install` in the Frontend directory

### CORS Errors

- Make sure the backend is running on port 3000
- Check that the frontend API base URL in `Frontend/src/services/api.js` is correct

### Events not displaying

- Check browser console for errors
- Make sure a profile is selected
- Verify the backend is running and responding

## Project Structure

```
EventGrid/
├── Backend/
│   ├── controllers/      # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── validators/      # Input validation
│   ├── middleware/      # Express middleware
│   ├── utils/           # Helper functions
│   ├── database/        # DB connection
│   ├── .env             # Environment variables (create this)
│   └── app.js           # Express setup
│
└── Frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── stores/      # State management
    │   ├── services/    # API calls
    │   ├── utils/       # Helper functions
    │   └── App.jsx      # Main component
    └── tailwind.config.js

```

## API Endpoints

### Profiles
- `POST /api/profiles` - Create profile
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get one profile
- `PUT /api/profiles/:id` - Update profile

### Events
- `POST /api/events` - Create event
- `GET /api/events?profileId=xxx` - Get events (filtered by profile)
- `GET /api/events/:id` - Get one event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/:id/logs` - Get event update logs

## Development Tips

1. **Hot Reload**: Both servers support hot reload. Changes will reflect automatically.

2. **API Testing**: Use tools like Postman or Thunder Client to test API endpoints directly.

3. **MongoDB GUI**: Use MongoDB Compass to view and manage your database visually.

4. **React DevTools**: Install React DevTools browser extension for debugging.

5. **State Inspection**: Zustand store states can be inspected using React DevTools.

## Next Steps

- Test creating events across different timezones
- Try updating events and viewing the change logs
- Create multiple profiles and assign events to them
- Change a profile's timezone and watch events update automatically

