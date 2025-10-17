# Event Management System

A full-stack event management application that allows admin to create multiple profiles and manage events across different users and timezones.

## Features

- **Profile Management**: Create and manage multiple user profiles with timezone preferences
- **Multi-timezone Support**: All events are stored in UTC and displayed in each user's preferred timezone
- **Event CRUD Operations**: Create, read, update, and delete events
- **Multi-profile Assignment**: Assign events to multiple profiles simultaneously
- **Event Update Logging**: Track all changes made to events with detailed logs
- **Responsive Design**: Modern, clean UI that works on all devices
- **Real-time Timezone Conversion**: Automatic conversion when users change their timezone

## Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Day.js** - Date/time manipulation with timezone support
- **React Icons** - Icon library
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Zod** - Schema validation
- **Day.js** - Timezone utilities
- **Morgan** - HTTP request logger

## Project Structure

```
EventGrid/
├── Backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── validators/       # Zod validation schemas
│   ├── middleware/       # Express middleware
│   ├── utils/           # Utility functions
│   ├── database/        # Database connection
│   ├── app.js           # Express app configuration
│   ├── server.js        # Server entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── stores/      # Zustand stores
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```env
PORT=3000
DB_CONNECT=mongodb://localhost:3000/event-management
```

4. Start the development server:
```bash
npm run dev
```

The backend server will start on `http://localhost:3000`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

## API Endpoints

### Profiles
- `POST /api/profiles` - Create a new profile
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get a single profile
- `PUT /api/profiles/:id` - Update a profile

### Events
- `POST /api/events` - Create a new event
- `GET /api/events` - Get all events (optional query: `?profileId=xxx`)
- `GET /api/events/:id` - Get a single event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `GET /api/events/:id/logs` - Get update logs for an event

## Key Features Explained

### Timezone Handling
- All event times are stored in UTC in the database
- When displaying events, times are converted to the user's selected timezone
- When a user changes their timezone, all times automatically update
- Timezone abbreviations (EST, PST, etc.) are shown alongside times

### Multi-profile Events
- A single event can be assigned to multiple profiles
- When an event is updated, the changes apply to all assigned profiles
- Event logs track which profile made each update

### Event Update Logging
- Every change to an event is logged
- Logs show:
  - What field was changed
  - Old value vs new value
  - Who made the change
  - When the change was made (in user's timezone)

## Usage Guide

### Creating a Profile
1. Click "Create Profile" or the settings icon in the navbar
2. Enter a name and select a timezone
3. Click "Create Profile"

### Creating an Event
1. Select a profile from the dropdown
2. Click "Create Event"
3. Fill in the event details:
   - Title (required)
   - Description (optional)
   - Timezone for the event
   - Start date & time
   - End date & time
   - Select one or more profiles to assign
4. Click "Create Event"

### Viewing Events
- Events are displayed in a card layout
- Events are grouped by date
- Search events using the search bar
- Sort events by start time or title

### Updating an Event
1. Click the edit icon on an event card
2. Modify the event details
3. Click "Update Event"
4. The change will be logged in the event's update history

### Changing Timezone
1. Click the settings icon in the navbar
2. Click on a profile's timezone
3. Select a new timezone
4. All times will automatically update to the new timezone

## Development

### Backend Development
```bash
cd Backend
npm run dev
```

### Frontend Development
```bash
cd Frontend
npm run dev
```

### Building for Production

#### Backend
```bash
cd Backend
npm start
```

#### Frontend
```bash
cd Frontend
npm run build
npm run preview
```

## License

MIT

## Author

Built as a demonstration of multi-timezone event management with React and Express.js

