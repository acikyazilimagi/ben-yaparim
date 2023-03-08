<div align="center">

![Ben Yaparım Logo](/public/images/logo.png)

</div>

---

## Ben Yaparım! (I'll do it!) - Volunteer Network Portal 

### About
Volunteering is an integral part of society, and it plays a significant role in community development. The role of Non-Governmental Organizations (NGOs) is to identify and address social problems and mobilize resources for development. The success of NGOs relies on the support of volunteers who are willing to dedicate their time and energy to make a positive impact in society. To facilitate this process, a volunteer portal is needed that will enable NGOs to create open calls for volunteers, allow volunteers to apply for calls, and create a profile for NGOs.

### Objective
The primary objective of this project is to create a volunteer portal that will provide a platform for NGOs to connect with volunteers. The portal will allow NGOs to create open calls for volunteers, and volunteers can apply for the calls and create a profile to showcase their skills and interests.

### Project Status

The project is currently in development. The project is currently in the design phase. The project will be implemented using the MERN stack.

### Features
The volunteer portal will have the following features:

1. Dashboard: The dashboard will be the main interface for NGOs and volunteers to access the portal's features. It will provide quick access to open calls, applications, and profiles.
2. Open Calls: NGOs can create open calls for volunteers to participate in their projects. The calls will contain information such as the project description, location, duration, and required skills.
3. Applications: Volunteers can apply for open calls by submitting their application. The application will include their personal information, skills, and experience.
4. Profile: Volunteers can create a profile that will showcase their skills, experience, and interests. NGOs can view these profiles to identify potential volunteers for their projects.
5. Search: NGOs can search for volunteers based on their skills, location, and availability. Volunteers can also search for open calls based on their interests and availability.
6. Notifications: The portal will send notifications to volunteers and NGOs regarding new open calls, application status updates, and other relevant information.

### Screenshots
_TODO_

### Milestones
_TODO_

---
## Development

### The project uses the tech stack below:

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)

### Getting Started

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

## License

This project is licensed under the terms of the **[Apache License 2.0](./LICENSE)** license.