
📌 Project Overview
The Student Task Planner is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, and Node.js). It is designed to help students manage their academic tasks efficiently by providing a structured platform for task organization, scheduling, and progress tracking.

✨ Features

✅ Task Management – Create, update, and delete tasks with due dates.

📅 Schedule & Reminders – Set deadlines and receive notifications for upcoming tasks.

📊 Progress Tracking – Mark tasks as completed and track productivity.

🏷 Categorization – Organize tasks by subject, priority, or status.

🔍 Search & Filter – Quickly find tasks using search and filter options.

🎨 User-Friendly UI – A responsive and intuitive interface built with React.

🔒 Secure Authentication – User registration and login system with JWT authentication.

☁️ Data Persistence – All tasks are stored securely in a MongoDB database.

🛠 Tech Stack
Frontend: React (Vite)

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT (JSON Web Token)

State Management: React Hooks & Context API

Styling: CSS & Material UI

🚀 Installation & Setup
Follow these steps to set up the Student Task Planner on your local machine:

1️⃣ Clone the Repository
git clone https://github.com/your-username/student-task-planner.git
cd student-task-planner


2️⃣ Backend Setup
Navigate to the backend folder and install dependencies:
cd backend
npm install

Create a .env file in the backend directory and add the following:
ini
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start the backend server:
npm run dev

3️⃣ Frontend Setup
Navigate to the frontend folder and install dependencies:

cd frontend
npm install

Run the React development server:
npm run dev

⚡ API Endpoints
Method	Endpoint	Description
POST	/api/users/register	Register a new user
POST	/api/users/login	Authenticate user & get token
GET	/api/tasks	Get all tasks for logged-in user
POST	/api/tasks	Create a new task
PUT	/api/tasks/:id	Update a task
DELETE	/api/tasks/:id	Delete a task

📌 Usage
Sign Up/Login – Create an account or log in.

Add Tasks – Create new tasks with deadlines and categories.

Track Progress – Mark tasks as completed or update statuses.

Organize – Use filters to sort tasks based on priority, deadlines, or subjects.

🛠 Future Enhancements

📌 Calendar View – Visualize tasks on a calendar.

📲 Mobile App – React Native version for mobile users.

📊 Task Analytics – Insights into task completion and study patterns.

🔔 Email & Push Notifications – Get reminders via email or mobile notifications.

💡 Contributing
Feel free to fork this repository, create a feature branch, and submit a pull request!

📜 License
This project is open-source and available under the MIT License.

