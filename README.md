# Cloud File Storage and Sharing System

A web-based application to **upload, organize, share, and manage files** with folder support, built using **React, Node.js, MongoDB, and AWS S3**.

---

##  Features

- **File Upload**  
  Upload multiple files at once. Files can be uploaded into specific folders or the Root folder by default.

- **Folder Management**  
  Create, rename, and delete folders dynamically.

- **File Management**  
  - Download files  
  - Delete files  
  - Generate shareable links (with expiration)  
  - Copy share links to clipboard

- **Cloud Storage**  
  Files are stored in **AWS S3**, while metadata is stored in **MongoDB**.

- **Responsive UI**  
  Built with **React** and Tailwind CSS.

---

##  Tech Stack

- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Cloud Storage:** AWS S3  
- **Authentication (Optional):** JWT / Session  
- **Utilities:** Axios, react-hot-toast  

---

##  Installation

### **Clone the repository**
```bash
git clone https://github.com/Sinchana258/Cloud-file-storage-and-sharing-system.git
cd Cloud-file-storage-and-sharing-system
cd backend
npm install
cp .env.example .env
# Update your AWS, MongoDB, and BASE_URL configs in .env
npm run dev
cd frontend
npm install
npm start
