# Library Management System

A complete full-stack Library Management System with a Java Spring Boot REST API backend and a React (Vite) frontend.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router, Axios, Bootstrap 5 |
| Backend | Java 17, Spring Boot 3.3, Spring Data JPA / Hibernate |
| Database | H2 (in-memory, default) — MySQL config included and ready to switch |
| API | RESTful JSON APIs |

## Features

- **Dashboard** — total books, available books, borrowed books, total members, overdue count, and recent transactions
- **Book Management** — add, view, search, update, delete books
- **Member Management** — add, view, search, update, delete members
- **Book Issue** — select member + book, set issue/due dates, automatically decrements available quantity
- **Book Return** — records return date, auto-calculates overdue days and fine (₹5/day), increments available quantity
- **Transactions** — full history with filters (All / Issued / Overdue / Returned)
- Responsive sidebar layout, confirmation modals before delete, toast success/error messages, loading spinners throughout

## Project Structure

```
library-management-system/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/library/lms/
│       │   ├── controller/     # REST controllers
│       │   ├── service/        # Business logic
│       │   ├── repository/     # Spring Data JPA repositories
│       │   ├── model/          # JPA entities
│       │   ├── dto/            # Request/response DTOs
│       │   ├── exception/      # Custom exceptions + global handler
│       │   ├── config/         # CORS configuration
│       │   └── LmsApplication.java
│       └── resources/
│           ├── application.properties
│           └── data.sql        # Sample seed data
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── components/         # Sidebar, Header, Loader, ConfirmModal, Toast
│       ├── pages/              # Dashboard, Books, AddBook, Members, AddMember, IssueBook, ReturnBook, Transactions
│       ├── services/           # Axios API service modules
│       ├── App.jsx
│       └── main.jsx
│
└── README.md
```

## Prerequisites

- Java 17+
- Maven 3.8+ (or use the included `mvn` wrapper if you add one)
- Node.js 18+ and npm

## Getting Started

### 1. Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

The API starts at **http://localhost:8080**. On first run, `data.sql` seeds the database with sample books, members, and transactions automatically (H2 in-memory database — resets on every restart).

- H2 console (optional, for inspecting data): http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:librarydb`
  - Username: `sa`, Password: *(blank)*

#### Switching to MySQL

1. Create a MySQL database (or let the app create it — `createDatabaseIfNotExist=true` is set).
2. In `backend/src/main/resources/application.properties`, comment out the H2 block and uncomment the MySQL block, then set your username/password.
3. Re-run `mvn spring-boot:run`.

### 2. Frontend (React + Vite)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app starts at **http://localhost:5173** and proxies all `/api/**` calls to the backend at `http://localhost:8080` (configured in `vite.config.js`).

Open http://localhost:5173 in your browser.

## REST API Endpoints

### Books
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | List all books (optional `?search=keyword`) |
| GET | `/api/books/{id}` | Get a book by ID |
| POST | `/api/books` | Create a new book |
| PUT | `/api/books/{id}` | Update a book |
| DELETE | `/api/books/{id}` | Delete a book (blocked if copies are issued) |

### Members
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/members` | List all members (optional `?search=keyword`) |
| GET | `/api/members/{id}` | Get a member by ID |
| POST | `/api/members` | Create a new member |
| PUT | `/api/members/{id}` | Update a member |
| DELETE | `/api/members/{id}` | Delete a member (blocked if they have active loans) |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | List all transactions |
| GET | `/api/transactions/{id}` | Get a transaction by ID |
| GET | `/api/transactions/overdue` | List currently overdue transactions |
| POST | `/api/transactions/issue` | Issue a book — body: `{ bookId, memberId, issueDate, dueDate }` |
| PUT | `/api/transactions/{id}/return` | Return a book — body: `{ returnDate }` (optional, defaults to today) |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Aggregate stats: total/available/borrowed books, total members, overdue count, recent transactions |

## Business Rules

- Default loan period: **14 days** from issue date (used when no due date is supplied)
- Fine: **₹5 per day** overdue, calculated automatically on return
- A book's `availableQuantity` auto-decrements on issue and auto-increments on return
- A book cannot be deleted while any copies are currently issued
- A member cannot be deleted while they have an active (unreturned) loan
- ISBNs and member emails must be unique

## Error Handling

The backend uses a global exception handler (`GlobalExceptionHandler`) that returns consistent JSON error responses:

```json
{
  "timestamp": "2026-08-20T10:15:30",
  "status": 400,
  "error": "Bad Request",
  "message": "A book with ISBN 9780132350884 already exists",
  "path": "/api/books"
}
```

Validation errors additionally include a `validationErrors` map of field → message. The frontend surfaces all of these as toast notifications and inline field errors.

## Sample Data

`data.sql` seeds 10 books, 5 members, and 4 transactions (2 active loans, 1 returned on time, 1 returned overdue) so the dashboard and tables are populated immediately on first run.

## Building for Production

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/lms-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm run build
```
This outputs a static build in `frontend/dist` which you can serve with any static file server, or copy into the Spring Boot backend's `src/main/resources/static` folder to serve both from one process.
