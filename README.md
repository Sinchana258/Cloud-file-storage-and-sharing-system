# Cloud File Storage and Sharing System

A web-based application to **upload, organize, share, and manage files** with folder support, built using **React, Node.js, MongoDB, and AWS S3**.

---

##  Features

- **File Upload**  
  Upload multiple files at once. Files can be uploaded into specific folders or the Root folder by default.

- **Folder Management**  
  Create and delete folders dynamically.

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
##  ScreenShots
<img width="1919" height="1018" alt="image" src="https://github.com/user-attachments/assets/b2ce1999-bf86-415c-874b-1f77c5a966cd" />
<img width="1919" height="1004" alt="image" src="https://github.com/user-attachments/assets/0d484141-e0fa-4c55-9122-0443fb2eabca" />
<img width="1919" height="1015" alt="image" src="https://github.com/user-attachments/assets/bf7b6c17-6dcc-4e29-a66b-f8638b311941" />
<img width="1914" height="930" alt="image" src="https://github.com/user-attachments/assets/cbac3627-473e-4190-ba51-4eb5db6f45ab" />


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

```
### **backend**
```bash
cd backend
npm install
cp .env.example .env
# Update your AWS, MongoDB, and BASE_URL configs in .env
nodemon  src/server.js
```
### **frontend**
```bash
cd frontend
cd vite-project
npm install
npm run dev
```
