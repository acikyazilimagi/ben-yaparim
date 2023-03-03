<div align="center">

![Ben Yaparım Logo](/public/images/logo.png)

</div>

---

## The project uses the tech stack below:

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)

## Getting Started

- Clone this repo.

  - If you want to use docker (recommended):

    To build container:

    ```bash
    docker compose build
    ```

    or

    ```bash
    docker compose build --no-cache
    ```

    To run containers:

    ```bash
    docker compose up
    ```

    To start with deamon mode add "-d" flag:

    ```bash
    docker compose up -d
    ```

    To stop containers:

    ```bash
    docker compose down
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

  - Or run the development server directly:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- To connect your Firebase Backend;
  - Sign in to you Firebase Console <a href="https://console.firebase.google.com/u/0/">https://console.firebase.google.com/u/0/</a>

  - Create a new project and save your credentials.
  - Find "Authentication" tab and enable and in "Sign-in method" tab enable "Email/Password" signin option.
  - Find "Firestore Database" tab and create your database.
  - In codebase rename ".env.local" enviorement file as ".env" and replace placeholder text with your credentials.
  - Choose your hosting provider to make you fork live. (Tested in Netlify **[Netlify](https://www.netlify.com/)**)

---

## Code of Conduct

Before contributing to this repository please make sure to read our **[Code of Conduct](./.github/code_of_conduct.md)**.

## Contribute

If you would like to work on this project and develop new features, fixes and tests please check out our [Contribution Guide](./.github/contribute.md)
