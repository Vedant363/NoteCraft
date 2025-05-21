# TaskMaster Pro: Your Ultimate Productivity Hub

TaskMaster Pro is a comprehensive productivity application designed to streamline your workflow and help you stay organized. It combines note-taking, task management, and calendar functionalities into a single, user-friendly interface.

**Key Features:**

*   **Notes:** Create, edit, and organize your notes with a rich text editor.
*   **Tasks:** Manage your to-do lists, set priorities, and track your progress.
*   **Calendar:** Schedule events, set reminders, and visualize your upcoming appointments.
*   **User Authentication:** Securely access your data with user accounts.
*   **Theming:** Customize the application's appearance with different themes.

## Setup and Installation

### Prerequisites

*   Node.js and npm (or yarn) installed on your system.
*   A Supabase account (you can create one at [https://supabase.com/](https://supabase.com/)).

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/taskmaster-pro.git
    cd taskmaster-pro
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Supabase:**
    *   Create a new project on Supabase.
    *   Go to your project's "Settings" > "API".
    *   Find your **Project URL** and **anon public API Key**.
    *   Create a `.env.local` file in the root of your project and add the following, replacing the placeholders with your actual Supabase credentials:
        ```env
        NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```
    *   In your Supabase project, navigate to the "SQL Editor" and run the SQL statements found in `supabase_schemas.sql` (we will create this file in a later step) to set up the necessary tables (users, notes, tasks, etc.).

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Tech Stack

TaskMaster Pro is built with a modern and robust tech stack:

*   **Framework:** [Next.js](https://nextjs.org/) (React framework for server-side rendering, static site generation, and more)
*   **Backend & Database:** [Supabase](https://supabase.com/) (open-source Firebase alternative for database, authentication, and real-time subscriptions)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (utility-first CSS framework)
*   **UI Components:** [Shadcn/ui](https://ui.shadcn.com/) (re-usable UI components built with Radix UI and Tailwind CSS)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) (superset of JavaScript that adds static typing)
*   **Core Library:** [React](https://reactjs.org/) (JavaScript library for building user interfaces)
*   **Form Management:** [React Hook Form](https://react-hook-form.com/) (for performant, flexible, and extensible forms)
*   **Schema Validation:** [Zod](https://zod.dev/) (TypeScript-first schema declaration and validation library)
*   **Markdown Rendering:** [React Markdown](https://github.com/remarkjs/react-markdown) (for rendering Markdown content in notes)
*   **Date & Time:** [date-fns](https://date-fns.org/) and [React Big Calendar](http://jquense.github.io/react-big-calendar/) (for calendar functionalities)

## Contributing

Contributions are welcome! If you'd like to contribute to TaskMaster Pro, please follow these steps:

1.  **Fork the Repository:**
    *   Click the "Fork" button at the top right of the repository page on GitHub.
    *   This will create a copy of the repository in your own GitHub account.

2.  **Clone Your Fork:**
    *   Clone the forked repository to your local machine:
        ```bash
        git clone https://github.com/YOUR_USERNAME/taskmaster-pro.git
        cd taskmaster-pro
        ```
        (Replace `YOUR_USERNAME` with your GitHub username)

3.  **Create a New Branch:**
    *   Create a new branch for your feature or bug fix. Use a descriptive name for your branch (e.g., `feat/add-new-feature` or `fix/resolve-bug-123`).
        ```bash
        git checkout -b your-branch-name
        ```

4.  **Make Your Changes:**
    *   Implement your changes, new features, or bug fixes in your local branch.
    *   Ensure your code follows the project's coding style and conventions.
    *   Add or update tests as necessary.

5.  **Commit Your Changes:**
    *   Commit your changes with a clear and concise commit message:
        ```bash
        git add .
        git commit -m "Your meaningful commit message"
        ```

6.  **Push to Your Fork:**
    *   Push your changes to your forked repository on GitHub:
        ```bash
        git push origin your-branch-name
        ```

7.  **Submit a Pull Request (PR):**
    *   Go to the original TaskMaster Pro repository on GitHub.
    *   You should see a prompt to create a Pull Request from your recently pushed branch. If not, go to the "Pull requests" tab and click "New pull request".
    *   Ensure the base repository is the original `taskmaster-pro` and the head repository is your fork and branch.
    *   Provide a clear title and description for your PR, explaining the changes you've made and why.
    *   Submit the PR. Your changes will be reviewed, and once approved, they will be merged into the main project.

We appreciate your contributions to making TaskMaster Pro better!

## License

TaskMaster Pro is released under the MIT License.

See the [LICENSE](LICENSE) file for more details. (We will create this `LICENSE` file in a later step).
