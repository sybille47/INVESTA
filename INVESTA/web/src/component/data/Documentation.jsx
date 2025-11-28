import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import userStoryMap from "./assets/userStoryMap.svg";
import newOrderChart from "./assets/newOrderChart.svg";
import e2eFlowChart from "./assets/e2eFlowChart.svg";
import useCaseMap from "./assets/useCaseMap.svg";
import projectStructure from "./assets/projectStructure.svg";
import repoStructure from "./assets/repoStructure.svg";
import apiEndpoints from "./assets/apiEndpoints.svg";
import erd from "./assets/erd.svg";

const docPages = [
  { id: 'overview', title: 'Overview', icon: 'book' },
  { id: 'getting-started', title: 'Getting Started', icon: 'rocket' },
  { id: 'architecture', title: 'Architecture', icon: 'diagram-project' },
  { id: 'business-analysis', title: 'Business Analysis', icon: 'briefcase' },
  { id: 'data', title: 'Data and API Reference', icon: 'database'}
];

const useCases = [
  {
    id: 'uc-1',
    number: '1',
    name: 'Sign up of a new user',
    subjectArea: 'Authentication',
    actors: 'User',
    overview: 'A new user signs up and creates credentials to log in to INVESTA',
    preconditions: 'The user does not have an account yet, i.e. the email address has not been used as user name for an existing account',
    description: `A user opens the Investa log in page and presses the 'Log in' button. In the Welcome page, the user clicks on the 'Sign up' link to create a new account. The email address will serve as the user name, and has to comply with the following conditions:

1. A valid email address has to be used, i.e. it has to contain '@ (there is no further verification of an email address)'
2. The email address has not been used to create a user account on the app

After entering a valid email address, the new page opens to either create a passkey or a password. The password has to comply with the standards that are laid out and ticked off while the user is typing a password. Once either the passkey or password are set, the user is successfully signed up.`,
    associations: 'All use cases are associated as the successful sign up is a prerequisite to access and use the app',
    inputSummary: 'Email address and password or passkey creation',
    outputSummary: 'Successful sign up and authentication; access to the app'
  },
  {
    id: 'uc-2',
    number: '2',
    name: 'Log in of existing user',
    subjectArea: 'Authentication',
    actors: 'User',
    overview: 'A user enters existing credentials to log in to INVESTA',
    preconditions: 'The user has successfully signed up and created valid credentials',
    description: `A user opens the Investa log in page and presses the 'Log in' button. In the Welcome page, the user enters the email address. Clicking on 'Continue' will bring up the password or the passkey depending what was set up during the account creation.`,
    associations: 'All use cases are associated as the successful log in is a prerequisite to access and use the app',
    inputSummary: 'Email address and password or passkey',
    outputSummary: 'Successful log in and authentication; access to the app'
  },
  {
    id: 'uc-3',
    number: '3',
    name: 'View Fund Portfolio',
    subjectArea: 'Information / review of investment activity',
    actors: 'User',
    overview: 'A user can view the list of funds they are invested into and a pie chart to provide a visual analysis of the investments. Clicking on a fund row opens the order history for the specific fund.',
    preconditions: 'The user has successfully signed up and logged in',
    description: `Once the user has logged in successfully, the Fund Portfolio page is displayed. This page can also be opened by pressing on the 'Funds' or on the logo button in the navigation bar. The page provides the user with a general overview of the investment and the corresponding values:

• The 'Total Value' of the investments, i.e. the cumulated value of all investments in the list of funds below. The value is calculated based on the no of units multiplied with the latest NAV for the fund available.
• A list of funds shows the fund information (fund name, and share class, ISIN, fund type) and the cumulative number of units held along with their value as of the latest NAV on file
• Clicking on a fund row opens the corresponding order history in the Order History page
• A pie chart visualises the holdings by showing the breakdown of the investment into different funds. Hovering over the pie chart shows the fund name, value and number of units.`,
    associations: 'Use case ID 4: View Order history, Use case ID 5: Place New Order',
    inputSummary: 'n/a',
    outputSummary: 'n/a',
    notes: "In case a user has not placed any orders, the Fund Portfolio page is displayed empty with a comment: 'Your fund portfolio will be shown here once you have placed your first order.'"
  },
  {
    id: 'uc-4',
    number: '4',
    name: 'View Order History',
    subjectArea: 'Information / review of investment activity',
    actors: 'User',
    overview: 'A user can view the order history grouped by month and trade date of the order',
    preconditions: 'The user has successfully signed up and created valid credentials',
    description: `The Order History page can be accessed either by clicking on the 'Orders' button in the navigation bar. The page can also be opened by clicking on a row of a fund in the Fund Portfolio page to bring up a list of orders filtered by ISIN.

The Order History page is view only, and provides the user with a list of orders grouped by month of the trade date. The following details are available for the orders:

• Fund information like fund name and ISIN
• Order information like unique order ID, order type, trade and value date, NAV, units, amount and order status
• For orders placed in units, the corresponding amount is an estimate calculated based on the latest NAV
• For orders placed in amount, the corresponding units are estimated based on the latest NAV stored on the db`,
    associations: 'Use case ID 3: View Fund Portfolio, Use case ID 5: Place New Order',
    inputSummary: 'n/a',
    outputSummary: 'n/a',
    notes: "In case a user has not placed any orders, the Order History page is displayed empty with a comment: 'Your order history will be shown here once you've placed your first order.'"
  },
  {
    id: 'uc-5',
    number: '5',
    name: 'Place New Order',
    subjectArea: 'Data input',
    actors: 'User',
    overview: 'A user can place a new order by opening the "Place New Order" page and entering the required details',
    preconditions: 'The user has successfully signed up and created valid credentials',
    description: `The Place New Order page can be accessed by clicking on the 'New Order' button in the navigation bar.

The page provides the user with a list of fields to populate; mandatory details are marked with an asterisk. Some fields can be populated by selecting a value from a drop down menu that pops up when clicking into the input field:

• Order type: the user can choose a type ('Subscription'/'Redemption') from a drop down menu
• ISIN: the user can choose the correct ISIN from a drop down menu. Once the ISIN has been provided, the 'Fund Name', 'Current Holdings' in units and the fund currency are retrieved and displayed
• Trade date: once the trade date has been entered, the corresponding value date is calculated based on the fund rules stored in the funds table, and displayed for information purposes
• Amount or Units: for order type 'Subscription', orders can be placed in either amount or units. 'Redemptions' can only be placed in units, and the 'Amount' field is deactivated for this order type

Once all mandatory details have been entered, the 'Submit order' button becomes active. When the order has been successfully submitted, a message is shown on the top of the screen confirming the order ID. The initial status of all orders is 'Pending'. The order will be included in the Order History page and in the cumulated values for the fund displayed in the Fund Portfolio page.

In case a redemption is placed for a number of units exceeding the current holdings, a message is shown on top of the screen advising the rejection reason.`,
    associations: 'Use case ID 3: View Fund Portfolio, Use case ID 4: View Order History',
    inputSummary: 'Order details: order type, ISIN, trade date, amount or units',
    outputSummary: '1. Fund data corresponding to user input: fund name, current holdings in units, value date, fund currency 2. After pressing "Submit order": confirmation or rejection message 3. Order details are included in Order History and Fund Portfolio pages',
    notes: 'Once the user has left the "Place New Order" page, the order data is removed from the fields and the page should be blank again once the user opens the page again'
  },
  {
    id: 'uc-6',
    number: '6',
    name: 'View Analytics',
    subjectArea: 'Information / review of investment activity',
    actors: 'User',
    overview: 'A user can view charts on the development of their investments by opening the "Analytics" page',
    preconditions: 'The user has successfully signed up and created valid credentials',
    description: `The 'Analytics' page aims at visualising the following:

1. 'Fund NAV development' for a general view of the funds the user is invested into. The y-axis shows the value of the NAV, the x-axis shows the NAV date. If the user holds investments in different funds, each fund's NAV development is shown in a separate line in a different colour.

2. 'Portfolio Value Development' for a view of the development of the total value of the invested amounts over the full investment period. The y-axis shows the cumulative value, the x-axis shows the NAV dates. If the user holds investments in more than one fund, the cumulative value is the total of all investments at any given NAV date.`,
    associations: 'Use case ID 4: View Order History, Use case ID 5: Place New Order',
    inputSummary: 'n/a',
    outputSummary: 'n/a',
    notes: "In case a user has not placed any orders, the Analytics page is displayed empty with a comment: 'Chart will be generated once you have placed your first order.'"
  },
  {
    id: 'uc-7',
    number: '7',
    name: 'View Profile',
    subjectArea: 'Information / review of investment activity',
    actors: 'User',
    overview: 'A user can view their profile data by opening the "Profile Settings" page',
    preconditions: 'The user has successfully signed up and created valid credentials',
    description: `The user can view their profile data by opening the 'Profile Settings' page. The 'User Name' field is populated with the email address that has been used to sign up.`,
    associations: 'Use case ID 1: Sign up of a new user',
    inputSummary: 'n/a',
    outputSummary: 'n/a',
    notes: 'Edit of profile data is optional; the user name (email address) field cannot be updated'
  },
  {
    id: 'uc-8',
    number: '8',
    name: 'Update Profile',
    subjectArea: 'Data input',
    actors: 'User',
    overview: 'A user can edit their profile data by opening the "Profile Settings" page',
    preconditions: 'The user has successfully signed up and created valid credentials',
    description: `The user can optionally add or edit data in the Profile Settings page by clicking on the 'Edit' button. All fields become editable except for the 'User name' field that contains the email address used for the sign up and the 'Account holder' field. When a user provides a first and last name, the Account Holder field is populated automatically.`,
    associations: 'Use case ID 1: Sign up of a new user',
    inputSummary: 'Personal Information: first name, last name; Address: street, house no, postal code, city, country; Bank Account Details: IBAN, bank name, BIC',
    outputSummary: 'n/a'
  },
  {
    id: 'uc-9',
    number: '9',
    name: 'Search Fund and / or Order Details',
    subjectArea: 'Information / review of investment activity',
    actors: 'User',
    overview: 'A user can search for any details by entering a search term',
    preconditions: 'The user has successfully signed up and created valid credentials; at least one order has been placed on the account',
    description: `The user can enter a search value into the search bar in the Fund Portfolio or the Order History page. Any row in the list of funds or list of orders that match the search value in any of their fields should be displayed. The search filter is applied dynamically while the user is inputting the search.`,
    associations: 'Use case ID 3: View Fund Portfolio, Use case ID 4: View Order History, Use case ID 5: Place New Order',
    inputSummary: 'Search term',
    outputSummary: 'Search result matching the input in the Search field'
  },
  {
    id: 'uc-10',
    number: '10',
    name: 'Download csv Export',
    subjectArea: 'Reporting',
    actors: 'User',
    overview: 'A user can download fund and order details in csv format',
    preconditions: 'The user has successfully signed up and created valid credentials; at least one order has been placed on the account',
    description: `The user clicks on the download icon in the Fund Portfolio page or in the Order History page. The data in the fund list or the order list that is currently displayed on screen is compiled in csv format and downloaded. Users can access the csv file on their machine, e.g. in their Downloads folder.`,
    associations: 'Use case ID 3: View Fund Portfolio, Use case ID 4: View Order History, Use case ID 5: Place New Order, Use case ID 9: Search Fund and / or Order Details',
    inputSummary: 'n/a',
    outputSummary: 'n/a',
    notes: 'If the user has filtered the data displayed on the page by using the search bar, only the filtered data is included in the csv export.'
  },
  {
    id: 'uc-11',
    number: '11',
    name: 'Log out',
    subjectArea: 'Authentication',
    actors: 'User',
    overview: 'A user can log out of the app',
    preconditions: 'The user has successfully signed up, created valid credentials and is logged in',
    description: `After clicking on the 'Logout' button, the Login page is shown again. All other details including the navigation bar cannot be accessed anymore.`,
    associations: 'Use case ID 1: Sign up of a new user, Use case ID 2: Log in of existing user',
    inputSummary: 'n/a',
    outputSummary: 'n/a'
  }
];

const pageContent = {
  'overview': {
    title: 'Project Overview',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: `INVESTA is a comprehensive investment management platform built with React and Vite.
                  It provides users with an intuitive interface to manage their investment portfolios, place and monitor orders, and visualize performance data over time.`
      },
        {
        id: 'key-features',
        title: 'Key Features',
        content: `The platform offers a range of features designed to simulate end-to-end investment management:

                    • User authentication and profile management — Users can register, log in, and maintain a personal profile. Authentication and secure access are handled via Auth0.
                    • Fund and order management — Users can view available funds, place subscription and redemption orders, and see a summary of their holdings on the home page.
                    • Data export — Displayed data can be downloaded in CSV format for offline use or analysis.
                    • Interactive charts — Historical valuations and performance data are visualized using dynamic charts for clear insight into investment trends.

                    Note: The application uses mock data for demonstration; no real financial transactions or email verifications are performed.
        `,
      },
      {
        id: 'technology-stack',
        title: 'Technology Stack',
        content: `Backend: Express, PostgreSQL, Auth0, dotenv
                  Frontend: React, Vite, Tailwind CSS, React Router, Auth0 React SDK, Recharts
                `
      }
    ]
  },
  'getting-started': {
    title: 'Getting Started',
    sections: [
      {
        id: 'access-to-app',
        title: 'User Access to the INVESTA app',
        content: `To get access to the INVESTA app, please use the below credentials:
                  Email address: user@mail.com
                  Password: useRma!l0
                  `
      },
      {
        id: 'access-to-repo',
        title: 'Access to Repo',
        content: `Please see details in GitHub [in this repo.](https://github.com/sybille47/INVESTA/blob/main/README.md)`
      },
    ]
  },
  'business-analysis': {
    title: 'Business Analysis',
    sections: [
      {
        id: 'ba-overview',
        title: 'Overview',
        content: `This section contains business analysis artifacts including use cases, user flows, and process documentation. These artifacts demonstrate the functional requirements and user interactions within the INVESTA platform.`
      },
      {
          id: 'user-story-map',
          title: 'User Story Map',
          content: <img src={userStoryMap} alt="user story map"/>
      },
      {
        id: 'use-case-map',
        title: 'Use Case Map',
        content: <img src={useCaseMap} alt="use case map" />
      },
      {
        id: 'e2e-flow-chart',
        title: 'E2E Process Flow',
        content: <img src={e2eFlowChart} alt="E2E process flow" />
      },
      {
        id: 'order-placement',
        title: 'New Order Placement Flow',
        content: <img src={newOrderChart} alt="new order placement flow" />
      },
      {
        id: 'use-cases',
        title: 'Use Cases',
        content: `The following use cases document the functional requirements and user interactions within the INVESTA platform. Each use case includes detailed information about actors, preconditions, workflows, and expected outcomes.`
      }
    ]
  },
  'architecture': {
    title: 'Architecture',
    sections: [
      {
        id: 'intro',
        content: `The Business Analysis section defines the functional requirements and user interactions within the INVESTA platform.
                  Building on those functional specifications, this Architecture section describes how the system is technically designed and implemented to support those use cases, including folder structure, routing, state management, data flow,
                  and integration with external services such as Auth0 and PostgreSQL.
                  `,
      },
      {
        id: 'folder-structure',
        title: 'Folder Structure',
        content: `The project is organized into separate directories for the frontend and backend, following a clean separation of concerns:
                  • Frontend (web/): Built with React (JavaScript), structured into subfolders for components, pages, hooks, and service modules.
                  • Backend (server/): Implemented with Express.js and PostgreSQL, containing routers, middleware, and data models.`,
        subsections: [
          {
            id: 'project-structure',
            content: <img
                        src={projectStructure}
                        alt="project structure"
                        style={{
                            width: "400px",
                            height: "auto",
                            borderRadius: "8px",
                            display: "block",
                            margin: "0 auto"
                        }}
                    />
          }
        ]
      },
      {
        id: 'routing',
        title: 'Routing',
        content: 'Client-side routing is handled by React Router, which provides dynamic navigation and protected routes for authenticated users.'
      },
      {
        id: 'state-management',
        title: 'State Management',
        content: `Application state is managed using React hooks (e.g. useState, useEffect, custom hooks).
                  Global or shared state is accessed via external providers such as Auth0 (for authentication) and React Router (for navigation state).`
      }
    ]
  },
    'data': {
    title: 'Data and API Reference',
    sections: [
      {
        id: 'data',
        title: 'Data Overview',
        content: `All data displayed in the application is mock data used for demonstration purposes.
                  This includes information about investment funds, NAVs (Net Asset Values), user profiles, and order activity.
                  Users can:

                  • View mock fund and NAV data
                  • Place simulated buy/sell orders
                  • Edit profile information

                  Note: The email address used to sign up or log in can be fictitious — no verification emails are sent.
                `
      },
      {
        id: 'database',
        title: 'Database',
        content: `Data is stored in a PostgreSQL database, which models core entities such as users, funds, and transactions.
                  Below is the Entity Relationship Diagram (ERD) illustrating the database structure:`,
      },
      {
        // id: 'erd',
        // title: 'Entity Relationship Diagramme',
        content: <img
                    src={erd}
                    alt="ERD"
                    style={{
                      width: "450px",
                      height: "auto",
                      margin: "0 auto",
                    }}
                />
        },
      {
        id: 'endpoints',
        title: 'API Endpoints',
        content: `The backend exposes a RESTful API that provides access to fund, user, and order data.
                  Endpoints are organized by resource type and follow standard HTTP methods (GET, POST, PUT).`,
        subsections: [
          {
            id: 'api',
            content:
                    <img
                              src={apiEndpoints}
                              alt="api endpoints"
                              style={{
                                width: "250px",
                                height: "auto",
                                margin: "0 auto",
                              }}
                              />
          }
        ]
      },
      {
        id: 'authentication-api',
        title: 'Authentication',
        content: `API access is secured using JWT (JSON Web Tokens) issued by Auth0.
                  Authenticated users receive a token upon login, which must be included in the Authorization header of subsequent API requests.`
      },
      {
        id: 'data-flow',
        title: 'Data Flow',
        content: `The application follows a client–server architecture, where data flows between the React frontend, the Express backend, and the PostgreSQL database.

                  1. User Interaction (Frontend)
                  Users interact with the React-based frontend such as placing an order, updating a profile, or viewing fund data.
                  Actions trigger HTTP requests through the app’s service layer.

                  2. API Requests (Backend)
                  The Express.js backend receives these requests, processes them through defined routes, and applies middleware for authentication and validation.
                  Protected routes verify the user’s JWT token via Auth0 middleware.
                  Once validated, the request is routed to the appropriate controller or service.

                  3. Database Operations (PostgreSQL)
                  The backend communicates with the PostgreSQL database through data models using raw SQL queries.
                  It retrieves or updates data in tables such as users, funds, and transactions.

                  4. Response Handling
                  The backend sends a structured JSON response back to the frontend.
                  The React app updates its state using React hooks (e.g. useState, useEffect) and re-renders the affected components.`
      }

    ]
  },
};

function ProjectDocumentation() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [activeHeading, setActiveHeading] = useState('');

  const generateTOC = () => {
    const content = pageContent[currentPage];
    if (!content) return [];

    const toc = [];
    content.sections.forEach(section => {
      toc.push({ id: section.id, title: section.title, level: 2 });
      if (section.subsections) {
        section.subsections.forEach(subsection => {
          toc.push({ id: subsection.id, title: subsection.title, level: 3 });
        });
      }
    });

    if (currentPage === 'business-analysis') {
      useCases.forEach(useCase => {
        toc.push({ id: useCase.id, title: `UC-${useCase.number}: ${useCase.name}`, level: 3 });
      });
    }

    return toc;
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveHeading(id);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    const headings = document.querySelectorAll('h2[id], h3[id]');
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [currentPage]);

  const toc = generateTOC();
  const content = pageContent[currentPage];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar - Page Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-full overflow-y-auto pt-20">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Documentation
          </h2>
          <nav className="space-y-1">
            {docPages.map((page) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  currentPage === page.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FontAwesomeIcon icon={page.icon} className="mr-3 w-4" />
                {page.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 mr-64 px-8 py-20">
        <article className="max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {content?.title}
          </h1>

          {content?.sections.map((section) => (
            <div key={section.id} className="mb-8">
              <h2
                id={section.id}
                className="text-2xl font-semibold text-gray-900 mb-4 pt-4 border-t border-gray-200 mt-8"
              >
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                {section.content}
              </p>

              {section.subsections?.map((subsection) => (
                <div key={subsection.id} className="ml-6 mb-6">
                  <h3
                    id={subsection.id}
                    className="text-xl font-semibold text-gray-800 mb-3 pt-2"
                  >
                    {subsection.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {subsection.content}
                  </p>
                </div>
              ))}
            </div>
          ))}

          {/* Render Use Cases for Business Analysis page */}
          {currentPage === 'business-analysis' && (
            <div className="mt-12">
              {useCases.map((useCase) => (
                <div key={useCase.id} id={useCase.id} className="mb-12 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Use Case {useCase.number}: {useCase.name}
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold font-medium text-gray-600">Use Case ID:</span>
                        <p className="text-gray-900">{useCase.number}</p>
                      </div>
                      <div>
                        <span className="font-semibold font-medium text-gray-600">Subject Area:</span>
                        <p className="text-gray-900">{useCase.subjectArea}</p>
                      </div>
                      <div>
                        <span className="font-semibold font-medium text-gray-600">Actors:</span>
                        <p className="text-gray-900">{useCase.actors}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-600 mb-1">Use Case Overview</h4>
                      <p className="text-gray-700 text-sm">{useCase.overview}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-600 mb-1">Preconditions</h4>
                      <p className="text-gray-700 text-sm">{useCase.preconditions}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-600 mb-1">Use Case Description</h4>
                      <p className="text-gray-700 text-sm whitespace-pre-line">{useCase.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-600 mb-1">Use Case Associations</h4>
                      <p className="text-gray-700 text-sm">{useCase.associations}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-600 mb-1">Input Summary</h4>
                        <p className="text-gray-700 text-sm">{useCase.inputSummary}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-600 mb-1">Output Summary</h4>
                        <p className="text-gray-700 text-sm">{useCase.outputSummary}</p>
                      </div>
                    </div>

                    {useCase.notes && (
                      <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <h4 className="font-medium text-blue-900 mb-1 text-sm">Notes</h4>
                        <p className="text-blue-800 text-sm">{useCase.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </main>

      {/* Right Sidebar - Table of Contents */}
      <aside className="w-64 bg-white border-l border-gray-200 fixed right-0 top-0 h-full overflow-y-auto pt-20">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            On This Page
          </h2>
          <nav className="space-y-2">
            {toc.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left text-sm py-1 transition-colors ${
                  item.level === 3 ? 'pl-4' : ''
                } ${
                  activeHeading === item.id
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default ProjectDocumentation;