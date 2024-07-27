# CollabCode

[Screencast from 2024-07-27 15-27-33.webm](https://github.com/user-attachments/assets/9c6846f5-c91b-405b-940b-64325f4fac7e)


[Website URL](http://52.66.45.134:5173/)

CollabCode is a real-time collaborative coding platform that allows users to collaborate on coding projects in real-time. It enables multiple users to edit code simultaneously, providing features like formatting options, and real-time updates as well few problem statements to work on.
It is deployed on aws ec2 instance and allows users to run and save code on aws s3 container. It currently supports C, C++ , Java and Python code.

## Features

- Real-time collaboration: Multiple users can edit code simultaneously, and changes are reflected in real-time for all participants.
- Formatting options: Users can apply formatting options such as bold, italic, and underline to the code.
- File upload: Users can upload files to work on projects together.
- Problem Statements for Users to Solve
- Support for users to code in various programming languages (C, C++, Java, Python)

## Technologies Used

- **Frontend**: React.js, Socket.IO, Axios
- **Backend**: Node.js, Express.js, Socket.IO, AWS SDK
- **Deployment**: AWS EC2
- **Other**: Multer (for file uploads), AWS S3 (for file storage)

## Getting Started

To get started with CollabCode, follow these steps:

1. Clone the repository: `git clone https://github.com/eshan1347/CollabCode.git`
2. Navigate to the project directory: `cd CollabCode`
3. Install dependencies:
   - Frontend: `cd frontend && npm install`
   - Backend: `cd backend && npm install`
4. Set up environment variables:
   - Create a `.env` file in the backend directory and add your environment variables, such as AWS credentials.
5. Start the frontend and backend servers:
   - Frontend: `cd frontend && npm start`
   - Backend: `cd backend && npm start`
6. Access CollabCode in your web browser at `http://localhost:3000`.
7. If the server is up : directly browse to and start : http://52.66.45.134:5173/

## Contributing

Contributions are welcome! If you'd like to contribute to CollabCode, please fork the repository, make your changes, and submit a pull request. Make sure to follow the existing code style and conventions.
