# Thread-clone

A full-stack clone of the Threads application built using **Next.js** for both frontend and backend. This project includes core features like posting, quoting, and reposting threads, as well as user authentication with email verification. Additionally, it supports image uploads via Cloudinary and utilizes **ShadCN** for the user interface.

Unlike traditional API routes, **server actions** are used for most operations (except authentication), simplifying interactions with the backend.

## Features

- **User Authentication**:
  - Sign up and log in functionality.
  - Email verification using **Resend mail** service.
  - Forgot password functionality using **Resend mail** for password reset.

- **Posting & Interaction**:
  - Create posts (threads) with text and/or images.
  - Quote posts and repost content.
  - View posts by all users in a centralized feed.

- **Media Support**:
  - Image uploads are handled using **Cloudinary**, allowing users to attach media to their threads.

- **Responsive Design**:
  - Fully responsive UI built with **ShadCN**, ensuring a seamless experience across all device sizes.

- **Server Actions**:
  - Leveraging Next.js **server actions** for most backend operations, improving performance and reducing complexity.

## Technologies Used

### Frontend
- **Next.js**: Server-side rendering and full-stack capabilities.
- **ShadCN**: UI components library for building the interface.
- **Tailwind CSS**: For styling the user interface.
- **React**: Core frontend library for building interactive UIs.

### Backend
- **Next.js Server Actions**: Handling most server-side interactions, except for authentication.
- **Next.js API routes**: Specifically used for user authentication (login, email verification, and forgot password).
- **MongoDB**: NoSQL database for data storage.
- **Cloudinary**: For managing image uploads.
- **Resend Mail**: For handling email verification and password reset.

### State Management
- **Redux**: For managing global state throughout the application.

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or cloud-based like MongoDB Atlas)
- Cloudinary account for managing image uploads
- Resend Mail account for email verification and password reset

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Santosh9009/Thread-clone.git
   cd Thread-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:
   ```bash
   MONGO_URI=<Your MongoDB URI>
   NEXTAUTH_SECRET=<Your NextAuth secret>
   RESEND_API_KEY=<Your Resend Mail API key>
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<Your Cloudinary cloud name>
   NEXT_PUBLIC_CLOUDINARY_API_KEY=<Your Cloudinary API key>
   CLOUDINARY_API_SECRET=<Your Cloudinary API secret>
   NEXT_PUBLIC_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

- Sign up with an email address and verify it through the email link sent via Resend Mail.
- If you forget your password, use the "Forgot Password" feature to receive a reset link via email using Resend Mail.
- Once logged in, users can create threads, quote other users' threads, and repost them.
- Attach images to posts using the image upload feature powered by Cloudinary.

## Contributing

Contributions are welcome! Feel free to submit issues, fork the repository, and make pull requests.
