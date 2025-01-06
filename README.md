
# Real-Time Messaging App with Friend Requests  👋

✨ This project is a real-time messaging application built with **Next.js**. It allows users to send and receive friend requests, chat in real-time, and view recent conversations. The app uses **Redis** for managing friend requests and **Pusher** for real-time messaging.

## Features

- **Friend Requests**: Users can send, accept, and reject friend requests.
- **Real-Time Messaging**: Chat in real-time with friends using Pusher for instant message delivery.
- **User Authentication**: Secure user authentication using NextAuth.js.

## Technologies Used

- **Next.js**: A React framework for building the application.
- **Redis**: Used for managing incoming friend requests and storing chat messages.
- **Pusher**: For real-time messaging functionality.
- **NextAuth.js**: For user authentication.
- **Tailwind CSS**: For styling the UI components.

## Installation and Setup

Follow the steps below to set up the project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (version 16 or higher)
- [Redis](https://redis.io/download) (installed and running)
- [Pusher account](https://pusher.com/) (for real-time messaging)

### 1. Clone the repository

```bash
git clone https://github.com/lvnh2003/moodchat.git
cd real-time-messaging-app
```

### 2. Install dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Redis
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL=your-redis-url
NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN=your-redis-token

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret

#Github
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
NEXT_PUBLIC_GITHUB_CLIENT_SECRET=your-github-client-secret

# Pusher
NEXT_PUBLIC_PUSHER_APP_ID=your-pusher-app-id
NEXT_PUBLIC_PUSHER_APP_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_APP_SECRET=your-pusher-secret
NEXT_PUBLIC_PUSHER_CLUSTER=your-pusher-cluster


```

Replace the values with your actual Redis and Pusher credentials.

### 4. Start the development server

Run the following command to start the development server:

```bash
npm run dev
```

This will start the application on [http://localhost:3000](http://localhost:3000).

### 5. Set up Redis

Ensure that Redis is running on your machine. You can download and install Redis from the official website or use a Redis service provider like [RedisLabs](https://redislabs.com/).

### 6. Set up Pusher

- Sign up for a [Pusher account](https://pusher.com/).
- Create a new app and get your **App ID**, **Key**, **Secret**, and **Cluster**.
- Add these credentials to your `.env.local` file as shown in step 3.

### 7. Testing the Application

Once everything is set up and the development server is running, you can open the app in your browser:

- **Homepage**: Displays the list of friends and recent chats.
- **Add Friend**: Send friend requests to other users.
- **Real-Time Chat**: Send and receive messages instantly using Pusher.

### 8. Deployment

You can deploy the app to platforms like **Vercel** or **Netlify** for production. For Redis, you can use managed Redis services like **RedisLabs** or **Heroku Redis**.

### 9. Troubleshooting

- **Redis connection issues**: Ensure Redis is running locally or connected to a Redis cloud service.
- **Pusher not working**: Double-check your Pusher credentials and ensure you're using the correct cluster.
- **Authentication issues**: If you encounter authentication problems, verify that the `NEXTAUTH_SECRET` is set correctly in your `.env.local`.

## Contributing

👤 If you'd like to contribute to the project, feel free to fork the repository and submit pull requests. Please make sure to follow the code style and add tests for new features.
