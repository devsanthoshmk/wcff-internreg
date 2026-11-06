# WCFF internship registration portal and student application form for web agency internship candidates

A web platform and REST API for collecting and managing student internship applications.

The WCFF internship registration portal provides a structured student application form for applicants seeking a web agency internship. The portal processes candidate contact information, domain preferences across 8 technical and media tracks, availability schedules for 2025, and participation modes.

## Architecture

The system consists of a static client frontend, an Express API server, and a PostgreSQL database.

### Frontend

The client interface runs in the browser using HTML5, CSS3, and JavaScript.

- `index.html` redirects visitors to `/home`.
- `home/index.html` presents the internship landing page, program domains, team members, FAQ entries, a contact form, and a newsletter subscription field.
- `registration/index.html` contains the student registration form with input fields for full name, email, phone number, domain selection, date ranges, and training mode.
- `assets/js/reg.js` handles form validation, month order checks, status banners, and JSON submissions to the backend API.
- `assets/js/form.js` handles contact form submissions to the email endpoint.
- `assets/css/` contains stylesheets for layout, responsive design, and registration form components.
- Vendor dependencies include Bootstrap 5.3.3, Bootstrap Icons, AOS, GLightbox, Swiper, and Isotope.

### Backend API

The backend runs on Node.js and Express in the `server/` directory.

- `server/server.js` starts an HTTP server on port 3000, connects to PostgreSQL with SSL encryption, and exposes REST endpoints.
- `server/mail.js` creates a Nodemailer transport using Gmail SMTP to deliver contact form messages.
- `server/schema.sql` defines the relational database schema.
- `server/prod-ca-2021.crt` provides the root certificate authority certificate for secure PostgreSQL connections.

### Database schema

The PostgreSQL database stores records in two tables:

1. `applications`: stores student applications with 8 columns:
   - `id`: serial integer primary key.
   - `name`: character varying 100 for applicant full name.
   - `mobile_number`: character varying 20 for applicant telephone number.
   - `email`: character varying 100 with a unique constraint.
   - `domain`: character varying 50 for the chosen domain.
   - `available_period`: character varying 100 for the selected month range.
   - `mode`: character varying 10 with a check constraint allowing only `online` or `offline`.
   - `created_at`: timestamp defaulting to current timestamp.

2. `newsletter`: stores email addresses subscribed to announcements.

### API endpoints

The Express server exposes the following HTTP endpoints:

- `POST /api/applications`: creates a new application record after validating fields and email formatting. Returns HTTP 201 on success or HTTP 409 if the email exists.
- `GET /api/applications`: returns all submitted applications ordered by creation date descending.
- `GET /api/applications/:id`: returns a single application record matching the specified identifier.
- `PUT /api/applications/:id`: updates all fields of an existing application record.
- `DELETE /api/applications/:id`: deletes the application record matching the specified identifier.
- `POST /api/send-email`: delivers contact form inquiries to administrators via Nodemailer.
- `POST /api/newsletter`: registers an email address in the newsletter table.

## Setup

### Prerequisites

- Node.js version 18 or higher
- npm package manager
- PostgreSQL database version 14 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devsanthoshmk/wcff-internreg.git
   cd wcff-internreg
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Initialize the database schema:
   ```bash
   psql -U postgres -d wcff_db -f schema.sql
   ```

4. Create the environment configuration file:
   Create a `.env` file inside the `server/` directory:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://username:password@hostname:5432/wcff_db
   email_app_pass=your_gmail_app_password
   ```

## Usage

### Run the backend server

To run the server in development mode with Nodemon auto-reload:
```bash
cd server
npm run dev
```

To run the server in production mode:
```bash
cd server
npm start
```

The server listens on `http://localhost:3000`.

### Serve the frontend

Host the repository root directory with any HTTP web server. For local development:
```bash
npx serve .
```

Navigate to `http://localhost:3000` or the port allocated by the static file server. The root path forwards users to `/home/`, and the register buttons link to `/registration/`.

## Configuration

The application reads configuration values from environment variables defined in `server/.env`:

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Network port for the Express HTTP server | `3000` |
| `DATABASE_URL` | PostgreSQL connection string including credentials and host | None |
| `email_app_pass` | Gmail application-specific password for Nodemailer notifications | None |

The database connection in `server/server.js` requires `server/prod-ca-2021.crt` to establish SSL connections with the remote PostgreSQL host.
