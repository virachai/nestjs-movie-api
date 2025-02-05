# NestJS Movie API Gateway

This project is a RESTful API for managing movies, built with [NestJS](https://nestjs.com/). It provides a comprehensive set of features for reading movie data, including fetching trending, must-watch, exclusive movies, and integration with external APIs like TMDB (The Movie Database).

## Features

- **Movie Management**:

  - Read movie details and metadata.
  - Search for movies by title, genre, or other attributes.
  - Fetch trending, must-watch, and exclusive movies.
  - Continue watching and manage a personal watchlist.

- **Authentication & Authorization**:

  - User login with JWT (JSON Web Token) authentication.
  - Role-based access control for specific endpoints.

- **Integration with TMDB**:

  - Fetch movie data from TMDB using the TMDB API.
  - Sync movie details, posters, and metadata.

- **Demo Users**:
  - Pre-configured demo users for testing purposes.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nestjs-movie-api.git
   cd nestjs-movie-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the required environment variables:

   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   TMDB_API_KEY=your_tmdb_api_key
   TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
   TMDB_ACCOUNT_ID=your_tmdb_account_id
   DEMO_USERNAME_01=virachai
   DEMO_PASSWORD_01=hashedPassword
   DEMO_USERNAME_02=netflix
   DEMO_PASSWORD_02=hashedPassword
   SALT_ROUNDS=10
   ```

4. Run the application:

   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:4000`.

---

## Endpoints

### Movies

- **GET `/movies/billboard`** - Get movies currently featured in the billboard.
- **GET `/movies/trending`** - Get trending movies.
- **GET `/movies/must-watch`** - Get must-watch movies.
- **GET `/movies/exclusive`** - Get exclusive movies.
- **GET `/movies/search`** - Search for movies by title or genre.
- **GET `/movies/show`** - Get TV show.
- **GET `/movies/movies`** Get the movies.
- **GET `/movies/latest`** - Get the latest movies.
- **GET `/movies/continue-watching`** - Get movies for the "Continue Watching" section.
- **GET `/movies/my-list`** - Get movies in the user's watchlist.
- **GET `/movies/:id`** - Get details of a specific movie.

### Authentication

- **POST `/auth/login`** - Log in to the application and receive a JWT token.

## Environment Variables

| Variable Name            | Description                                 |
| ------------------------ | ------------------------------------------- |
| `DATABASE_URL`           | URL for the database connection.            |
| `JWT_SECRET`             | Secret key for JWT token generation.        |
| `TMDB_API_KEY`           | API key for TMDB integration.               |
| `TMDB_READ_ACCESS_TOKEN` | Read access token for TMDB.                 |
| `TMDB_ACCOUNT_ID`        | TMDB account ID for API requests.           |
| `DEMO_USERNAME_01`       | Username for the first demo user.           |
| `DEMO_PASSWORD_01`       | Password for the first demo user.           |
| `DEMO_USERNAME_02`       | Username for the second demo user.          |
| `DEMO_PASSWORD_02`       | Password for the second demo user.          |
| `SALT_ROUNDS`            | Number of salt rounds for password hashing. |

## Demo Users

Two demo users are pre-configured for testing:

1. **Username**: `virachai`  
   **Password**: `hashedPassword`

2. **Username**: `netflix`  
   **Password**: `hashedPassword`

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [NestJS](https://nestjs.com/) for the framework.
- [TMDB](https://www.themoviedb.org/) for movie data.
- Contributors and open-source community.
