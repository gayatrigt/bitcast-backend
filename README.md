# Bitcast Backend



## Table of Contents

- [Getting Started](#getting-started)
- [Learn More](#learn-more)
- [Contributing](#contributing)
- [License](#license)


## Getting Started

### Prerequisites

- Node.js (version 14 or above)
- npm (version 6 or above) or yarn
- MongoDB
- AWS S3

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/saucecodee/bitcast-backend.git
    cd bitcast-backend
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following:

    ```env
    MONGODB_URI=mongodb://localhost:27017/mydatabase
    PORT=6900
    JWT_SECRET=
    AWS_S3_ACCESS_KEY_ID=
    AWS_S3_SECRET_ACCESS_KEY=
    ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
# or
yarn dev
```

The server will start on `http://localhost:6900`.

### Building for Production

To build the project for production, run:

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

### Running the Production Build

To run the production build locally, run:

```bash
npm run start
# or
yarn start
```

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request to contribute.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.


