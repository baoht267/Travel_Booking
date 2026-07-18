# GOCHIP Travel Booking

ReactJS assignment project built with Vite, React Router, Redux Toolkit, and a local REST API.

## Run

Open two terminals in the project folder.

```bash
npm run api
```

```bash
npm run dev
```

Frontend: `http://127.0.0.1:5173/`

REST API: `http://localhost:4000/destinations`

## Demo Admin Account

- Email: `admin@gochip.vn`
- Password: `Admin@123`

Only this admin account can see and access the destination management routes. Newly registered accounts receive the `user` role.

## Assignment CRUD Module

The assignment CRUD requirements are implemented in the Travel Destination Management module:

- List page: `http://127.0.0.1:5173/manage-destinations`
- Add page: `http://127.0.0.1:5173/manage-destinations/new`
- Detail page: `http://127.0.0.1:5173/manage-destinations/:destinationId`
- Edit page: `http://127.0.0.1:5173/manage-destinations/:destinationId/edit`

Supported REST methods:

- `GET /destinations`
- `GET /destinations/:id`
- `POST /destinations`
- `PUT /destinations/:id`
- `DELETE /destinations/:id`

The module includes loading states, error handling, controlled forms, validation, React Router navigation, `useParams`, `useNavigate`, and Redux Toolkit async thunks.
