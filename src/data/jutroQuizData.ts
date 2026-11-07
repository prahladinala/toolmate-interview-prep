export interface JutroQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number[];
  category: string;
  explanation: string;
  isMultiSelect: boolean;
}

const rawQuestions = [
  // --- FROM SOURCE 1 ---
  {
    question: "Which of the following is known as the basic building block of a Jutro application?",
    options: ["layout", "floorplan", "component", "pattern", "blueprint"],
    answer: [2],
    category: "Components & Patterns",
    explanation: "Jutro components are the most granular and fundamental building blocks of a Jutro application. Patterns are combinations of components, while layouts and floorplans organize pages."
  },
  {
    question: "If you want your floorplan to have a C shape, which of the following metadata properties should be set to true? (Select three)",
    options: ["showNotifications", "showHeader", "showRightSide", "showLeftSide", "scrollContent"],
    answer: [1, 2, 3],
    category: "Floorplans & Layouts",
    explanation: "A C-shape floorplan consists of a Header (top), Left Navigation/Side, and Right Panel/Side (or Header, Left Side, and Footer/Right Side depending on configuration). showHeader, showRightSide, and showLeftSide together configure the C-shape."
  },
  {
    question: "Which of the following Jutro elements determine the number of columns in the main content area?",
    options: ["blueprints", "patterns", "layouts", "components", "floorplans"],
    answer: [2],
    category: "Floorplans & Layouts",
    explanation: "Layout components (such as ColumnsLayout or GridLayout) determine the grid structure and column count in the main content area, while floorplans organize the overall page wrapper."
  },
  {
    question: "Which of the following statements about components and patterns are correct? (Select three)",
    options: [
      "Jutro components are not accessible.",
      "Jutro components cannot be configured or modified.",
      "Jutro components must be manually updated when you update your version of Jutro.",
      "Jutro patterns consist of several Jutro components that interact together to enable users to perform a task.",
      "Jutro components include support for theming and internationalization.",
      "Jutro components are the most granular building blocks of Jutro applications."
    ],
    answer: [3, 4, 5],
    category: "Components & Patterns",
    explanation: "Jutro components are accessible, themeable, internationalized, and form the most granular building blocks. Jutro patterns combine multiple components to solve recurring user tasks."
  },
  {
    question: "Identify the modifier descriptor in the following design token: jds.color.background.focus",
    options: ["background", "jds", "color", "focus"],
    answer: [3],
    category: "Theming & Design Tokens",
    explanation: "In Jutro design tokens (namespace.property.element.modifier), 'jds' is the system namespace, 'color' is the category, 'background' is the element/property, and 'focus' is the state/modifier."
  },
  {
    question: "Which of the following best completes the following definition. 'Theming is....'",
    options: [
      "A collaborative framework for coordinating with external stakeholders",
      "A process for establishing a single source of truth for designs",
      "A structured process for styling UI elements in Jutro apps",
      "A method to coordinate the implementation of brand and style guidelines in Jutro"
    ],
    answer: [2],
    category: "Theming & Design Tokens",
    explanation: "In the Jutro Design System, theming is officially defined as a structured process for styling UI elements in Jutro apps through design tokens."
  },
  {
    question: "What steps in the theming process are designers responsible for? (Select three)",
    options: [
      "Tokens handoff",
      "Token definition",
      "Theme analysis",
      "Tokens transformation",
      "Theme usage",
      "Tokens retrieval"
    ],
    answer: [0, 1, 2],
    category: "Theming & Design Tokens",
    explanation: "Designers are responsible for Theme analysis, Token definition (in Figma/Tokens Studio), and Tokens handoff (pushing JSON to repository). Developers handle retrieval, transformation (jutro generate:themes), and usage."
  },
  {
    question: "When creating a custom token, what is the recommended practice for the system modifier?",
    options: [
      "Do not use a system modifier at all, only use modifiers for the component and its attributes.",
      "Use a unique system modifier that is meaningful for your specific company or project.",
      "Name the system modifier 'custom' to make it easy to identify.",
      "Always use the 'jds' system modifier to ensure it integrates with the base Jutro system."
    ],
    answer: [1],
    category: "Theming & Design Tokens",
    explanation: "Guidewire recommends using a unique project-specific or company-specific prefix/modifier (e.g., insurer name) instead of 'jds' to avoid namespace collisions with future Jutro releases."
  },
  {
    question: "Identify the property descriptor in the following design token: jds.elevation.shadow.raised",
    options: ["elevation", "raised", "floorplans", "shadow"],
    answer: [3],
    category: "Theming & Design Tokens",
    explanation: "In 'jds.elevation.shadow.raised', 'shadow' represents the specific property descriptor within the elevation category."
  },
  {
    question: "Which statement best describes the core nature of Jutro patterns?",
    options: [
      "They function as a single source of truth for designers and developers.",
      "They are default templates for specific UI elements.",
      "They serve as a comprehensive library of individual UI components.",
      "They provide foundational structures for recurring design challenges in user interfaces."
    ],
    answer: [3],
    category: "Components & Patterns",
    explanation: "Jutro patterns provide reusable, foundational UX and UI structures designed to solve recurring user experience challenges in insurance workflows."
  },
  {
    question: "What is the primary action to change a theme's brand color?",
    options: [
      "Change the name of the semantic brand token to match the new color.",
      "Change the value of a semantic token to reference a different global token.",
      "Edit a global token's hex code to a new color value.",
      "Create a new semantic token for the new color, and delete the old one."
    ],
    answer: [1],
    category: "Theming & Design Tokens",
    explanation: "Following design token architecture, brand colors are customized by updating the semantic token reference to point to the desired global color token."
  },
  {
    question: "An application has a header, footer, and left navigation. What floorplan shape is the application using?",
    options: ["C shape", "I shape", "L shape", "r shape"],
    answer: [2],
    category: "Floorplans & Layouts",
    explanation: "A layout containing a top Header (or Footer) and a Left Navigation bar forms an 'L shape' floorplan."
  },
  {
    question: "Which of the following are ready-to-use, full-page templates that organize page elements including the Header, Footer, Navigation panel, and Content area?",
    options: ["floorplans", "blueprints", "patterns", "layouts", "components"],
    answer: [0],
    category: "Floorplans & Layouts",
    explanation: "Floorplans in Jutro are full-page scaffolding templates that position the Header, SubHeader, Left Navigation, Content area, and Footer."
  },
  {
    question: "Which of the following tools are needed to work with a Jutro app? (Select three)",
    options: [
      "Visual Studio Code",
      "Git",
      "Java Runtime Environment",
      "Guidewire Studio",
      "Node.js",
      "SVN"
    ],
    answer: [0, 1, 4],
    category: "Tooling & Environment",
    explanation: "Standard Jutro development requires Node.js, Git, and a modern code editor such as Visual Studio Code."
  },
  {
    question: "Which of the following is the correct command to start a Jutro app?",
    options: ["npm start", "npm run prebuild", "npm test", "npm launch", "npm run build"],
    answer: [0],
    category: "Tooling & Environment",
    explanation: "'npm start' executes the local development server (Webpack/Babel/dev server) for a Jutro application."
  },
  {
    question: "Which of the following Jutro Platform CLI commands should you run before pushing code changes to Bitbucket and why? (Select two)",
    options: [
      "Run jutro validate:dependencies to check if the project has missing or unused dependencies.",
      "Run jutro validate:lighthouse to generate a Lighthouse report for your app.",
      "Run jutro generate:i18n to generate translation files for all the UI strings in your app.",
      "Run jutro app:build to create an app build.",
      "Run jutro validate:linters to check if the code follows coding and formatting standards."
    ],
    answer: [0, 4],
    category: "Tooling & Environment",
    explanation: "Running 'jutro validate:dependencies' ensures no broken or missing dependencies exist, and 'jutro validate:linters' prevents failing automated Bitbucket pre-commit pipelines."
  },
  {
    question: "What are the steps you must take to set up the local codebase? (Select three)",
    options: [
      "Build the branch code on TeamCity",
      "Access remote source code repository in Bitbucket",
      "Git clone to your local machine",
      "Access the app you want to modify"
    ],
    answer: [1, 2, 3],
    category: "Tooling & Environment",
    explanation: "Local setup involves accessing the app repository in Bitbucket, cloning it locally with git clone, and navigating to the application workspace."
  },
  {
    question: "How many mutable deployments are allowed per branch?",
    options: ["Two", "Three", "Unlimited", "One"],
    answer: [3],
    category: "Jutro Web Apps (JWA) & Deployment",
    explanation: "Jutro Web Apps (JWA) allows exactly one mutable deployment per Git branch (which updates on subsequent pushes to that branch)."
  },
  {
    question: "Which of the following statements best describes how Auth Groups function? (Select two)",
    options: [
      "Auth groups define what UI elements users have access to and are assigned by developers during the build process",
      "Auth Groups are managed by admins in the JWA UI with users assigned via the insurer's identity provider",
      "Auth Groups determine which users or user groups can log into a Jutro app and are defined at the environment level",
      "Auth Groups are used to manage application themes and are defined by individual users within the app settings",
      "Auth Groups are temporary user lists created for testing purposes after each app deployment"
    ],
    answer: [1, 2],
    category: "Jutro Web Apps (JWA) & Deployment",
    explanation: "Auth Groups in JWA determine environment login access and are managed by JWA Admins mapped to the insurer's enterprise IdP."
  },
  {
    question: "What do shared packages typically contain? (Select three)",
    options: ["Tenant", "Utility functions", "Repositories", "UI components", "Business logic"],
    answer: [1, 3, 4],
    category: "Architecture & Packages",
    explanation: "Shared packages in Guidewire cloud apps contain reusable UI components, utility functions, and cross-cutting business logic."
  },
  {
    question: "What is the first action you must complete before you can use an external package?",
    options: [
      "Register the external package on the external package registry",
      "Consume the external package",
      "Open a ticket to obtain a dedicated scope and registry URL",
      "Create a new deployment for the package in JWA"
    ],
    answer: [0],
    category: "Architecture & Packages",
    explanation: "External packages must first be registered and allowed on the external package registry before they can be resolved by npm."
  },
  {
    question: "In the standard development workflow, you have completed your local coding and successfully validated your changes. What is the next step you must take to move your code from your local machine to the Guidewire Cloud environment for deployment?",
    options: [
      "Export a ZIP file and upload it to JWA",
      "Run npm run jutro deploy from the local terminal",
      "Commit and push your changes to the Bitbucket repository",
      "Email the source code to the Cloud Operations team",
      "Run npm run jutro app:build and copy the /dist folder"
    ],
    answer: [2],
    category: "Jutro Web Apps (JWA) & Deployment",
    explanation: "Guidewire Cloud uses GitOps CI/CD pipelines connected to Bitbucket. Committing and pushing code to the remote repository triggers TeamCity builds and JWA deployment."
  },
  {
    question: "Which statements are correct for Jutro Platform CLI? (Select three)",
    options: [
      "Jutro Platform CLI commands must be run from the root of a Jutro project",
      "You must install Jutro Platform CLI globally to run the commands from a Jutro app",
      "Jutro Platform CLI can be used to create a new Jutro app",
      "Jutro Platform CLI can be used to install project dependencies",
      "Jutro Platform CLI can be used to generate translations and themes",
      "Jutro Platform CLI is embedded in all Jutro apps created from a template"
    ],
    answer: [0, 4, 5],
    category: "Tooling & Environment",
    explanation: "Jutro Platform CLI is embedded into Jutro template apps, executed from the project root, and used to generate themes and translations."
  },
  {
    question: "In which folder will you find the app source code in a typical Jutro app project?",
    options: ["html", "platform", ".jutro", "dist", "src"],
    answer: [4],
    category: "Architecture & Packages",
    explanation: "All developer application React source code, components, and pages reside in the 'src' directory."
  },
  {
    question: "An insurer developer needs to test a new feature on a specific branch. They want a unique URL that will not be overwritten by future deployments of that same branch. Which deployment type should they select in Jutro Web Apps?",
    options: [
      "Persistent deployment",
      "Mutable deployment",
      "Immutable deployment",
      "Static deployment",
      "Shared deployment"
    ],
    answer: [2],
    category: "Jutro Web Apps (JWA) & Deployment",
    explanation: "Immutable deployments create permanent, unique URLs tied to a specific commit SHA that are never overwritten by subsequent deployments."
  },
  {
    question: "You are navigating the src folder of your Jutro project to find the entry component for your app. Which file contains the Jutro class used as the app entry component?",
    options: [
      "src/app/App.tsx",
      "src/assets/theme.scss",
      "src/config/config.json",
      "src/index.html",
      "src/app/App.config.js"
    ],
    answer: [0],
    category: "Architecture & Packages",
    explanation: "'src/app/App.tsx' is the root entry component that renders the application floorplan and routing context."
  },
  {
    question: "Which of the following statements are true about standalone apps? (Select three)",
    options: [
      "They cover an entire business use case",
      "They have limited scalability",
      "They are complete, monolithic apps built from a single template",
      "They can be embedded within a larger shell application",
      "They handle a subset of a business use case"
    ],
    answer: [0, 1, 2],
    category: "Architecture & Packages",
    explanation: "Standalone apps in Jutro are monolithic applications built from a single template that handle an entire business use case, but offer less modular scalability compared to micro frontends."
  },
  {
    question: "Which of the following statements are true about micro frontends? (Select three)",
    options: [
      "They use a monolithic architecture",
      "MFEs can be added or removed from shell apps as required",
      "They cover an entire use case",
      "They are treated as several independent projects",
      "They cover a subset of P&C use cases"
    ],
    answer: [1, 3, 4],
    category: "Micro Frontends & Templates",
    explanation: "Micro Frontends (MFEs) are independent projects covering focused subsets of P&C use cases that can dynamically be mounted into or unmounted from shell apps."
  },
  {
    question: "A new developer on your team asks for an explanation of the core components that make up an experience template. Based on your understanding, which of the following accurately describes the composition of a template?",
    options: [
      "A fixed, non-customizable package of code meant for quick deployment, with all functionalities pre-configured and unchangeable.",
      "Includes a UI with multiple web pages, integration with InsuranceSuite through the Digital SDK, and leverages Jutro Design System components.",
      "Offers only backend service integrations and requires extensive front-end development from scratch to allow for maximum design flexibility.",
      "Limits functionality to only one line of business and does not support theming or design system components."
    ],
    answer: [1],
    category: "Micro Frontends & Templates",
    explanation: "Jutro Experience Templates combine pre-built multi-page UIs, Jutro Design System components, and Digital SDK integrations with InsuranceSuite Cloud APIs."
  },
  {
    question: "An insurance startup, PetProtect, is launching a new digital self-service portal for its policyholders... Which of the following experience templates would be the most suitable starting point...?",
    options: [
      "Commercial Auto FNOL",
      "Personal Auto Quote and Buy",
      "Agent Experience",
      "Policyholder Experience"
    ],
    answer: [3],
    category: "Micro Frontends & Templates",
    explanation: "The 'Policyholder Experience' template provides self-service policy management, billing, and document inspection specifically for policyholders."
  },
  {
    question: "What is the primary function of experience templates?",
    options: [
      "To solve business requirements for all digital experiences across any industry, not just P&C.",
      "To accelerate the development of P&C transactional applications on Jutro Digital Platform by providing a foundational starting point.",
      "To offer fully completed, unchangeable applications that eliminate the need for any further custom development.",
      "To provide a library of isolated business patterns that can be independently integrated into any existing application."
    ],
    answer: [1],
    category: "Micro Frontends & Templates",
    explanation: "Experience templates accelerate development by delivering pre-integrated P&C transactional workflows that developers can customize."
  },
  {
    question: "What are the main value propositions of experience templates in JDP? (Select two)",
    options: [
      "Reference implementation for learning and customization",
      "Direct reuse",
      "Pre-approved user interface for all insurance products",
      "Real-time customer feedback collection",
      "Built-in advanced analytics and reporting"
    ],
    answer: [0, 1],
    category: "Micro Frontends & Templates",
    explanation: "Experience templates offer direct code reuse and act as authoritative reference implementations for best architectural practices."
  },
  {
    question: "Succeed Insurance decides to use the sub header for navigation instead of the left side menu. Which of the following configurations for the selected floorplan can fulfil this requirement? (Select two)",
    options: [
      "showLeftSide = true; showSubHeader = true; the sideRoutes prop has several routes with showOnNavBar = true",
      "showLeftSide = false; showSubHeader = true; the routes prop has several routes with showOnNavBar as not specified",
      "showLeftSide is not specified; showSubHeader = true; the subRoutes prop has several routes with showOnNavBar = true",
      "showLeftSide = false; showSubHeader is not specified; the routes prop has several routes with showOnNavBar = true"
    ],
    answer: [1, 3],
    category: "Floorplans & Layouts",
    explanation: "Setting showLeftSide to false disables the left sidebar, and subheader routes with showOnNavBar render navigation items in the subheader."
  },
  {
    question: "Which of these floorplan properties are true by default if not specified? (Select two)",
    options: [
      "showTitle",
      "showUserHeader",
      "showFooter",
      "showRightPanel",
      "showSubHeader"
    ],
    answer: [2, 4],
    category: "Floorplans & Layouts",
    explanation: "By default in standard Jutro floorplans, showFooter and showSubHeader default to true if omitted."
  },
  {
    question: "Which of the following statements are correct about ColumnsLayout? (Select two)",
    options: [
      "ColumnsLayout is used to lay out pages in a column-based shape.",
      "Using the variant property, ColumnsLayout can merge columns on smaller devices.",
      "Each column in ColumnsLayout is represented by a GridItem component.",
      "ColumnsLayout extends the Grid component and wraps each child with a GridItem."
    ],
    answer: [0, 1],
    category: "Floorplans & Layouts",
    explanation: "ColumnsLayout arranges content in responsive columns and uses the variant property to collapse and merge columns on mobile viewports."
  },
  {
    question: "Layout components define the layout for which area of a Jutro app?",
    options: [
      "The entire app.",
      "Header and footer.",
      "The content area and components within it.",
      "Navigation panels."
    ],
    answer: [2],
    category: "Floorplans & Layouts",
    explanation: "Floorplans wrap the entire page skeleton, whereas Layout components govern the arrangement of content within the main content area."
  },
  {
    question: "You want to add a Jutro Button component to a form in your Jutro app. Where would you add the JSX code copied from documentation or Jutro Storybook?",
    options: [
      "To the form component messages file.",
      "To the form component SCSS file.",
      "To the render function of the form component.",
      "To the return block of the form component."
    ],
    answer: [3],
    category: "Components & Patterns",
    explanation: "In modern React function components, JSX markup is added inside the return block of the component."
  },
  {
    question: "The default floorplan has the right panel disabled. A new floorplan was created for the Preference page. It should display the right side, but everything else is the same as the default. Which of the following configurations are correct and recommended for the new floorplan? (Select two)",
    options: [
      "Modify the default floorplan directly without creating a new floorplan.",
      "Add the matches property that points to the path of the Preference page.",
      "Duplicate all properties from the default floorplan to the new floorplan and turn on the right side.",
      "Add the right-side page element and set showRightSide to true in the new floorplan."
    ],
    answer: [1, 3],
    category: "Floorplans & Layouts",
    explanation: "Floorplan overrides use the 'matches' route string and specify only overridden properties (e.g. showRightSide = true) rather than duplicating entire configurations."
  },
  {
    question: "Which configuration step is needed to display a custom element in the default app header of the Jutro starter app?",
    options: [
      "Provide the custom component to the header using the renderCustomComponent property.",
      "Add the custom component renderer function in the classNameMap property of AppFloorPlan in App.js.",
      "Provide the custom component renderer function to the subheader using the renderCustomComponent property.",
      "Add the custom component renderer function in the callbackMap prop of the AppFloorPlan component."
    ],
    answer: [0],
    category: "Floorplans & Layouts",
    explanation: "The default Header configuration accepts 'renderCustomComponent' to inject bespoke React nodes into the header bar."
  },
  {
    question: "Succeed Insurance has requested that you replace the logo in the app header with their new logo (SucceedLogo.svg). Which of the following steps are required to achieve this in the Jutro starter app? (Select two)",
    options: [
      "Add the line 'logoTitle': './images/SucceedLogo.svg' under the 'subHeader' property of 'floorplan.default' in App.config.tsx.",
      "Add the line 'logoSrc': './images/SucceedLogo.svg' under the 'header' property of 'floorplan.welcome' in App.config.tsx.",
      "Add the line 'logoSrc': './images/SucceedLogo.svg' under the 'header' property of 'floorplan.default' in App.config.tsx.",
      "Copy the SucceedLogo.svg file to src/assets/images in the Jutro project."
    ],
    answer: [2, 3],
    category: "Floorplans & Layouts",
    explanation: "Place the asset into 'src/assets/images' and configure 'logoSrc' under the 'header' property of the default floorplan in App.config.tsx."
  },
  {
    question: "To localize an app, what is the preferred way to keep translation costs low?",
    options: [
      "Create a separate code branch for each language",
      "Use machine translation for all content",
      "Extract all UI strings to a single file for translation",
      "Use pre-translated templates that come with apps"
    ],
    answer: [2],
    category: "i18n & Localization (Sherlock)",
    explanation: "Extracting all UI strings into centralized message catalogs avoids duplicate translation costs and enables translation agency batching."
  },
  {
    question: "How does the Jutro app determine the language to display to a user?",
    options: [
      "It uses the user's browser language preference if it is in 'availableLanguages', otherwise it uses 'preferredLanguage'.",
      "It only uses the languages listed in 'availableLanguages' and ignores the user's browser preference.",
      "It defaults to English unless the user manually selects a different language.",
      "It always uses the 'preferredLanguage' from 'config.json'."
    ],
    answer: [0],
    category: "i18n & Localization (Sherlock)",
    explanation: "Jutro inspects browser language preferences and checks if it exists in availableLanguages; if not, it falls back to preferredLanguage."
  },
  {
    question: "What type of object should every UI string be?",
    options: ["intlMessageLocale", "intlMessageShape", "defaultMessage", "defineMessageShape"],
    answer: [1],
    category: "i18n & Localization (Sherlock)",
    explanation: "All localized UI text in Jutro must be defined as an intlMessageShape object containing 'id' and 'defaultMessage'."
  },
  {
    question: "How does Sherlock pseudolanguage make strings that are correctly prepared for translation visually identifiable on the UI?",
    options: [
      "It adds angle brackets around the string and prepends it with a numeric hash",
      "It adds yellow highlighting to the string",
      "It adds the text 'TRANSLATED' to the start of the string",
      "It adds square brackets around the string and prepends it with an alphanumeric hash"
    ],
    answer: [3],
    category: "i18n & Localization (Sherlock)",
    explanation: "Sherlock pseudolanguage wraps localized strings in square brackets with an alphanumeric hash prefix, e.g., '[7xwv12_Policy Number]'."
  },
  {
    question: "When distinguishing between standalone apps and micro frontends (MFEs), which of the following characteristics are true regarding the micro frontend architecture? (Select two)",
    options: [
      "It can be embedded into a larger 'shell' application.",
      "It is typically managed by a single team working on the entire business journey.",
      "It covers a subset of a full business use case.",
      "It uses a monolithic architecture where the entire app is a single unit.",
      "It requires the entire application to be redeployed for a single change."
    ],
    answer: [0, 2],
    category: "Micro Frontends & Templates",
    explanation: "Micro frontends cover focused subsets of use cases and can be embedded dynamically into outer shell applications."
  },
  {
    question: "A developer needs to implement essential frontend capabilities such as routing and internationalization. Match the correct Jutro UI library package to its primary purpose. (Select two)",
    options: [
      "@jutro/theme — provides the testing framework for Jest.",
      "@jutro/router — provides standardized atomic components like Card and Button.",
      "@jutro/auth — provides authentication context and clients.",
      "@jutro/locale — provides locale and translation utilities.",
      "@jutro/components — provides routing guards and helpers.",
      "@jutro/layout — provides the Digital SDK for InsuranceSuite integration."
    ],
    answer: [2, 3],
    category: "Architecture & Packages",
    explanation: "@jutro/auth handles auth clients/contexts, and @jutro/locale provides internationalization and translation helpers."
  },
  {
    question: "You are implementing a 'Pet Details' form and need to place the 'Date of Birth' and 'Gender' fields side-by-side in a two-column structure. Which component is recommended as the simpler and faster way to achieve this without manual CSS Grid property configuration?",
    options: ["FlexItem", "GridLayout", "Grid", "ContentLayout"],
    answer: [1],
    category: "Floorplans & Layouts",
    explanation: "GridLayout wraps children in automatic grid items with configurable columns without needing low-level CSS grid syntax."
  },
  {
    question: "The Jutro Design System includes 'Repeatable UI patterns' which are pre-made solutions for recurring problems, such as adding a vehicle. What is a critical characteristic of these patterns?",
    options: [
      "They are exclusively UX patterns providing design guidance without code.",
      "They are part of the Jutro API contract.",
      "They must be imported from @jutro/patterns.",
      "They include both Figma designs and production-ready code."
    ],
    answer: [0],
    category: "Components & Patterns",
    explanation: "In Jutro, Repeatable UI patterns are design guidance and best practice blueprints in Figma, distinct from coded Jutro components."
  },
  {
    question: "Which of the following elements are considered part of the Jutro API contract? (Select three)",
    options: [
      "Patterns.",
      "Templates.",
      "React version.",
      "CLI commands.",
      "React component props.",
      "CSS class names."
    ],
    answer: [2, 3, 4],
    category: "Cloud Standards & Best Practices",
    explanation: "The Jutro API contract formally guarantees React versions, CLI commands/signatures, and React component props against breaking changes."
  },
  {
    question: "Your development team needs to build a new insurance application from the ground up, but they want to avoid starting with a blank slate. They require the basic scaffolding of a React application, including a standard header and footer. Which group of Jutro templates is most appropriate for this requirement?",
    options: [
      "Starter templates",
      "Use case demonstration templates",
      "Experience templates",
      "Training templates"
    ],
    answer: [0],
    category: "Micro Frontends & Templates",
    explanation: "Starter templates provide clean, minimal scaffolding (Header, Footer, Routing) for greenfield projects without pre-configured business flows."
  },
  {
    question: "Which file contains the floorplan configuration in the Jutro app?",
    options: ["AppFloorPlan.ts", "App.config.tsx", "index.ts", "App.ts"],
    answer: [1],
    category: "Floorplans & Layouts",
    explanation: "'src/app/App.config.tsx' holds the declarative floorplan configurations, route definitions, and element visibility flags."
  },
  {
    question: "Which of the following statements about Digital SDK are correct? (Select two)",
    options: [
      "A Digital SDK provides a set of JavaScript functions you can use to interact with InsuranceSuite Cloud APIs",
      "When using the Digital SDK, you need to wrap request payloads and unwrap response bodies",
      "A Digital SDK is a set of React components for front-end app development",
      "A Digital SDK can be generated using Digital SDK CLI or Jutro Platform CLI",
      "A Digital SDK is generated from the customer-specific OpenAPI definitions and entity schemas"
    ],
    answer: [3, 4],
    category: "Digital SDK & Cloud APIs",
    explanation: "Digital SDK is generated from customer-specific InsuranceSuite OpenAPI schemas using either the Digital SDK CLI or Jutro Platform CLI."
  },
  {
    question: "Which of the following provides initialization and configuration functions?",
    options: ["SDK root module", "Schema functions", "API functions", "TypeScript types"],
    answer: [0],
    category: "Digital SDK & Cloud APIs",
    explanation: "The SDK root module exports core initialization routines such as initSdk and initSdkJutro."
  },
  {
    question: "Which of the following statements about Digital SDK UI extensions are correct? (Select two)",
    options: [
      "Use the Digital SDK UI extensions if you are developing non-React apps in JavaScript or TypeScript.",
      "Use the Digital SDK UI extensions to greatly reduce the manual coding effort needed to implement UI pages which render and validate InsuranceSuite entity fields.",
      "Use the Digital SDK UI extensions when developing React apps that use InsuranceSuite Cloud APIs to integrate with InsuranceSuite apps and that use Jutro Design System.",
      "Do not use the Digital SDK UI extensions when developing React apps that use InsuranceSuite Cloud APIs to integrate with InsuranceSuite apps and that use another design system for UI development."
    ],
    answer: [1, 2],
    category: "Digital SDK & Cloud APIs",
    explanation: "Digital SDK UI extensions drastically reduce boilerplate when rendering and validating InsuranceSuite entity fields in React apps that utilize JDS."
  },
  {
    question: "Which of the following steps must be completed before running the Digital SDK CLI generate command? (Select two)",
    options: [
      "Install the Digital SDK CLI",
      "Stop the InsuranceSuite instance",
      "Install the dependency @digitalsdk/internal",
      "Install the Jutro Platform CLI",
      "Create a configuration file"
    ],
    answer: [0, 4],
    category: "Digital SDK & Cloud APIs",
    explanation: "You must install the Digital SDK CLI and provide a valid generator configuration file targeting the OpenAPI spec endpoints."
  },
  {
    question: "In which of the following locations in the generated code would you find the PolicyCenter API function createAccount?",
    options: [
      "generated\\PcSdk\\account\\api\\accountApi.ts",
      "src\\PcSdk\\account\\api\\accountApi.ts",
      "generated\\CcSdk\\account\\api\\accountApi.ts",
      "generated\\CcSdk\\account\\types\\Account.ts"
    ],
    answer: [0],
    category: "Digital SDK & Cloud APIs",
    explanation: "PolicyCenter API functions are placed in generated/PcSdk/<domain>/api/<domain>Api.ts."
  },
  {
    question: "When should basic authentication be used? (Select two)",
    options: [
      "When using a production cloud environment that allows it",
      "In any environment that allows it",
      "In production environments, in combination with an OAuth password API",
      "When connecting to a local InsuranceSuite instance for convenience",
      "When using a non-production cloud environment that allows it"
    ],
    answer: [3, 4],
    category: "Digital SDK & Cloud APIs",
    explanation: "Basic authentication is restricted to local development or non-production environments that explicitly permit it; OAuth/OIDC is mandatory for production."
  },
  {
    question: "Which of the following statements about the Digital SDK are correct? (Select three)",
    options: [
      "initSdkJutro accepts a required config object with optional parameters",
      "Digital SDK supports API key authentication",
      "The initSdkJutro function should be used to initialize the Digital SDK for use in any app",
      "Digital SDK supports anonymous authentication",
      "For multiple generated SDKs, you must initialize each one",
      "The initSdk function should be used to initialize the Digital SDK for use in any app",
      "For multiple generated SDKs, you must initialize the first one only"
    ],
    answer: [3, 4, 5],
    category: "Digital SDK & Cloud APIs",
    explanation: "The Digital SDK supports anonymous authentication, requires every generated SDK module (e.g. PC, CC, BC) to be initialized individually, and initSdk is the universal initialization entry point."
  },
  {
    question: "What do SDK functions typically return?",
    options: ["XCenter Objects", "HTTP Responses", "Promises", "Awaits"],
    answer: [2],
    category: "Digital SDK & Cloud APIs",
    explanation: "All asynchronous Digital SDK API client calls return JavaScript Promises."
  },
  {
    question: "Which of the following is correct for retrieving a location associated with an account?",
    options: [
      "getLocation('locationId456');",
      "getAccountLocation('accountId123', 'locationId456');",
      "getAccount('accountId123'); getLocation('locationId456');",
      "getAccount('accountId123', fields: ['locationId456']);",
      "getAccount('accountId123', include: ['locationId456']);"
    ],
    answer: [1],
    category: "Digital SDK & Cloud APIs",
    explanation: "Nested sub-resources in the Digital SDK use hierarchical signatures: getAccountLocation(accountId, locationId)."
  },
  {
    question: "Which SDK function is typically used to update a claim?",
    options: ["patchClaim", "createClaim", "updateClaim", "postClaim"],
    answer: [0],
    category: "Digital SDK & Cloud APIs",
    explanation: "InsuranceSuite Cloud REST APIs follow JSON:API / REST PATCH semantics for entity updates (patchClaim)."
  },
  {
    question: "Which of the following APIs are provided by the compositeSdk? (Select two)",
    options: [
      "inclusionRequestSimplified",
      "batchRequest",
      "compositeRequestSimplified",
      "batchRequestSimplified",
      "compositeRequest"
    ],
    answer: [2, 4],
    category: "Digital SDK & Cloud APIs",
    explanation: "compositeSdk provides compositeRequest and compositeRequestSimplified for multi-operation atomic orchestration."
  },
  {
    question: "Which of the following approaches supports passing variables between sub-requests?",
    options: [
      "Request inclusion",
      "Batch request",
      "Composite request",
      "Multiple requests in separate calls"
    ],
    answer: [2],
    category: "Digital SDK & Cloud APIs",
    explanation: "Composite requests allow referencing data and IDs created in prior sub-requests (e.g. @{AccountRef.id}) within subsequent operations."
  },
  {
    question: "Which of the following tasks must you perform to enable autocompletion for the body of each request within a batch request? (Select two)",
    options: [
      "Specify the endpoint you are targeting in the funct property of each request",
      "Specify the API you are targeting in the funct property of each request",
      "Use the batchRequestSimplified API provided by the SDK",
      "Use the batchRequest API provided by the SDK"
    ],
    answer: [1, 2],
    category: "Digital SDK & Cloud APIs",
    explanation: "Using batchRequestSimplified and specifying the targeting API in the funct property enables TypeScript type inference and autocompletion."
  },
  {
    question: "Which of these approaches for overriding field props is type safe?",
    options: [
      "Using the overrideProps prop",
      "Using a component specific prop (such as numberInputProps for a field rendered as a NumberInput)"
    ],
    answer: [1],
    category: "Digital SDK & Cloud APIs",
    explanation: "Component-specific props (e.g., numberInputProps) enforce strict TypeScript type checking against the underlying component's API."
  },
  {
    question: "To render an entity field as a component from another design system, what is the correct sequence of steps?",
    options: [
      "1: Use the entity hook to access all the entity fields, 2: Extract the field you want to render and its props, 3: Populate the design system component props using the extracted field props",
      "1: Extract the field you want to render and its props, 2: Use the entity hook to access all the entity fields, 3: Populate the design system component props using the extracted field props",
      "1: Populate the design system component props, 2: Use the entity hook, 3: Extract the field"
    ],
    answer: [0],
    category: "Digital SDK & Cloud APIs",
    explanation: "First call the entity hook, extract the desired field descriptor and metadata, then wire those properties into your external component."
  },
  {
    question: "Which of the following statements are correct? (Select two.)",
    options: [
      "useUALPersonalVehicle hook must be wrapped by UALPersonalVehicleProvider",
      "UALPersonalVehicle entity must be wrapped by a JobLinesProvider",
      "UALPersonalVehicleProvider must be wrapped by a JobLinesProvider",
      "useUALPersonalVehicle hook must be wrapped by a JobLinesProvider"
    ],
    answer: [0, 2],
    category: "Digital SDK & Cloud APIs",
    explanation: "Line-level entity hooks require their corresponding entity Context Provider, which in turn must reside within the JobLinesProvider context."
  },
  {
    question: "If you set showSchemaValidationErrors to true in the UALPersonalVehicleProvider and to false in the Model entity field component, which statement is correct?",
    options: [
      "Validation error messages will not be shown under the Model field if validation fails",
      "Validation error messages will be shown under the Model field if validation fails"
    ],
    answer: [0],
    category: "Digital SDK & Cloud APIs",
    explanation: "Component-level prop overrides take precedence over parent provider defaults; setting it to false suppresses error display on that field."
  },
  {
    question: "What is the correct sequence of steps to customize the validation error message for a specific field?",
    options: [
      "1: Extract the field from the fields returned by the entity hook, and then extract the validation errors from the field. 2: Extract the validation errors from the field. 3: Transform the validation error message into a custom message. 4: Override the stateMessages prop of the entity field component with the custom error message.",
      "1: Transform the validation error message into a custom message. 2: Override the stateMessages prop of the entity field component with the custom error message. 3: Extract the field from the fields returned by the entity hook. 4: Extract the validation errors from the field.",
      "1: Override the stateMessages prop of the entity field component. 2: Transform the validation error message. 3: Extract the validation errors. 4: Extract the field."
    ],
    answer: [0],
    category: "Digital SDK & Cloud APIs",
    explanation: "Extract the field and its schema errors via the entity hook, map errors into your custom text, and pass them to stateMessages on the field component."
  },
  {
    question: "Order the steps to apply a new custom theme to a Jutro app.",
    options: [
      "1: Design team pushes design token JSON files to a shared repository. 2: Developers pull design token JSON files into app source code. 3: Developers add the custom theme to the .themesConfig.json file. 4: Run the conversion process (npm run jutro generate:themes). 5: In startApp.ts, import the .themesConfig.json file and set the themeConfig property.",
      "1: Developers add the custom theme to the .themesConfig.json file. 2: Run the conversion process. 3: Design team pushes design token JSON files. 4: Developers pull design token JSON files. 5: In startApp.ts, set the themeConfig property.",
      "1: Run the conversion process. 2: In startApp.ts, set the themeConfig property. 3: Design team pushes design token JSON files. 4: Developers pull design token JSON files. 5: Developers add the custom theme to the .themesConfig.json file."
    ],
    answer: [0],
    category: "Theming & Design Tokens",
    explanation: "Handoff $\rightarrow$ Pull $\rightarrow$ Register in themesConfig.json $\rightarrow$ Run generator $\rightarrow$ Wire into startApp.ts."
  },
  {
    question: "Succeed Insurance wants the text color of dropdowns on a particular page in their app to be changed. What is the approach that will most closely adhere to the best practices?",
    options: [
      "The developer overrides the default styles of Jutro components by extracting CSS class names. These are then modified by the designer.",
      "The designer adds a custom token to the appropriate JSON file, then the developer generates the theme, and applies the resulting CSS to a style for dropdowns on the page.",
      "The developer changes the CSS variables value directly in the theme generated CSS file, then applies the variable to a style for dropdowns on the page.",
      "The developer changes the design tokens value directly in the Global.json file, then generates the theme, and applies the resulting CSS to a style for dropdowns on the page."
    ],
    answer: [1],
    category: "Theming & Design Tokens",
    explanation: "Tokens Studio/Figma definition $\rightarrow$ token generation maintains the single source of truth and guarantees upgrade safety."
  },
  {
    question: "What Jutro version should the micro frontends package have?",
    options: [
      "The package is agnostic and should not have a version number.",
      "The exact version matching the Jutro version of the app with ^ for future versions.",
      "The exact version matching the Jutro version of the app with no ^.",
      "The version should be 10.3.0 or 10.4.0-next."
    ],
    answer: [2],
    category: "Micro Frontends & Templates",
    explanation: "To prevent conflicting React runtime singletons and mismatched DOM abstractions, MFEs must pin exact Jutro versions without carats (^)."
  },
  {
    question: "What component should be used to render the embedded micro frontend in a website?",
    options: [
      "JutroMicroFrontends from https://jutroappurl/jutro-micro-frontends.ts",
      "JutroMicroFrontendRenderer from https://jutroappurl/jutro-micro-frontends.ts",
      "JutroMicroFrontends from https://jutroappurl/jutro-micro-frontends.js",
      "JutroMicroFrontendRenderer from https://jutroappurl/jutro-micro-frontends.js"
    ],
    answer: [2],
    category: "Micro Frontends & Templates",
    explanation: "The entry script is compiled as 'jutro-micro-frontends.js' exposing the JutroMicroFrontends web component/renderer."
  },
  {
    question: "When choosing to embed a micro frontend using context sharing, which of the following is true?",
    options: [
      "The @jutro/auth package must be uninstalled to reduce conflicts.",
      "Only the shell app must configured appropriately.",
      "More coordination with shell app development team is required than with other methods.",
      "Both apps must be running on the same port."
    ],
    answer: [2],
    category: "Micro Frontends & Templates",
    explanation: "Context sharing requires tight alignment on shared auth tokens, React versions, and memory state across both host and guest teams."
  },
  {
    question: "Future State Insurance wants to enable their customers to make claims easily. They already have a customer-facing app based on CustomerEngage (version 8.13+). Which option offers the fastest and most efficient development experience?",
    options: [
      "Develop an FNOL flow from scratch and launch it as a standalone app.",
      "Create a Jutro MFE based on the starter micro frontend template and launch it as a standalone app.",
      "Create a Jutro MFE based on the Personal Auto FNOL template and embed it in the customer-facing app.",
      "Develop an FNOL flow from scratch and embed it in the customer-facing app."
    ],
    answer: [2],
    category: "Micro Frontends & Templates",
    explanation: "Customizing the pre-built Personal Auto FNOL experience template and embedding it via MFE saves months of development compared to building from scratch."
  },
  {
    question: "Which of the following methods is suitable for embedding a Jutro MFE (version 10.0+) in a non-Jutro shell? It is not possible to make any changes to the shell app code.",
    options: [
      "Create a Jutro MFE based on the Personal Auto FNOL template and embed it in the customer-facing app.",
      "Jutro MicroFrontend component with mode isolated.",
      "Standard iframe",
      "Jutro MicroFrontend component with mode shared."
    ],
    answer: [2],
    category: "Micro Frontends & Templates",
    explanation: "If the outer shell application cannot be modified, a standard iframe provides total isolation without requiring host-level JS integration."
  },
  {
    question: "You are creating a new custom component named ClaimHistory. To follow Jutro best practices, where should you store the UI strings for the component?",
    options: [
      "In src/components/ClaimHistory/messages/ClaimHistory.ts.",
      "In src/components/ClaimHistory/ClaimHistory.messages.ts.",
      "In a global src/assets/messages.ts file.",
      "Within the ClaimHistory.tsx file."
    ],
    answer: [1],
    category: "i18n & Localization (Sherlock)",
    explanation: "Jutro colocation conventions place messages in <ComponentName>.messages.ts in the component's folder."
  },
  {
    question: "You need to add a new page called PolicyDetails to your Jutro app. According to the recommended naming standards, what is the required folder and file structure?",
    options: [
      "src/pages/PolicyDetails.tsx",
      "src/custom/pages/PolicyDetails.tsx",
      "src/pages/PolicyDetails/PolicyDetails.config.tsx",
      "src/pages/PolicyDetails/PolicyDetails.tsx"
    ],
    answer: [3],
    category: "Architecture & Packages",
    explanation: "Pages follow PascalCase nested directories: 'src/pages/PolicyDetails/PolicyDetails.tsx'."
  },
  {
    question: "You are building a new feature for a Jutro app and need a specialized input field that is not available as a standard component. According to Jutro best practices, which approach should you take to ensure your app remains maintainable and easy to update?",
    options: [
      "Copy the JSX and logic from a similar component in node_modules and modify it.",
      "Use a thin wrapper to compose existing JDS components and pass props through.",
      "Import internal, undocumented functions from @jutro/components to build the field.",
      "Create a custom component by writing bespoke React code from scratch.",
      "Override the internal DOM structure of an existing JDS component using custom CSS."
    ],
    answer: [1],
    category: "Components & Patterns",
    explanation: "Compose standard JDS components inside thin wrappers, forwarding props so that internal styling and future Jutro fixes propagate cleanly."
  },
  {
    question: "A developer is extending a Jutro component and uses the spread operator (...rest) to pass props through to the underlying JDS component. Why is this specific technique considered a best practice for Jutro development?",
    options: [
      "It ensures the component is compatible with new props added in future Jutro releases.",
      "It forces the component to ignore any custom design tokens or themes.",
      "It allows the component to bypass the Jutro non-breaking changes policy.",
      "It simplifies the component's internal state management logic."
    ],
    answer: [0],
    category: "Cloud Standards & Best Practices",
    explanation: "Passing ...rest ensures that new accessibility, ARIA, and behavioral props added in upstream Jutro updates are received by the underlying element."
  },
  {
    question: "You are reviewing a code snippet to ensure UI strings are correctly prepared for translation. Which of the following examples correctly uses an intlMessageShape object and follows best practices for string IDs? (Select two).",
    options: [
      "id: 'jutro-app.pages.claimDetails.save', defaultMessage: 'Save changes'",
      "id: 'save_button', defaultMessage: 'Save'",
      "id: 'jutro-app pages policySearch title', defaultMessage: 'Search for a Policy'",
      "id: 'jutro-app.pages.home.welcome', defaultMessage: 'Welcome to the portal!', description: 'Home page header'",
      "id: 'jutro-app.pages.premiumStatus.title', defaultMessage: 'Your premium is due on ' + dueDate"
    ],
    answer: [0, 3],
    category: "i18n & Localization (Sherlock)",
    explanation: "String IDs must use namespaced dot-notation (e.g. app.domain.element) with static defaultMessages, avoiding runtime string concatenations."
  },
  {
    question: "You have enabled the Sherlock pseudolanguage to test your Jutro app. While navigating the UI, you notice the \"Submit Claim\" label appears exactly as written, while other labels appear in square brackets with a hash prefix, like [7xwv12_Policy Number]. What does this indicate about the \"Submit Claim\" label?",
    options: [
      "The string is hard-coded in the source code and was not correctly extracted by the i18n script.",
      "The string is customer data and therefore cannot be extracted.",
      "The string is correctly prepared and has already been translated to the Sherlock language.",
      "The i18n script is currently running and has not reached that specific file yet."
    ],
    answer: [0],
    category: "i18n & Localization (Sherlock)",
    explanation: "If a UI string does not exhibit the Sherlock brackets and hash prefix, it is hardcoded in JSX without an intlMessageShape and cannot be localized."
  },
  {
    question: "In the Jutro theming process, what are the primary responsibilities of a developer? (Select three)",
    options: [
      "Tokens retrieval from a remote repository",
      "Tokens handoff by pushing JSON files to Bitbucket",
      "Tokens definition using Figma and Tokens Studio",
      "Theme analysis of customer brand assets",
      "Theme implementation in the app",
      "Tokens transformation using the jutro generate:themes command"
    ],
    answer: [0, 4, 5],
    category: "Theming & Design Tokens",
    explanation: "Developers pull token JSON files, transform them into CSS via 'jutro generate:themes', and implement the theme in App.tsx / startApp.ts."
  },
  {
    question: "You need to verify that your application code complies with Jutro cloud standards, such as checking for restricted CSS variables. Which command must you run in your terminal?",
    options: ["npm run lint", "npm run i18n", "npm start", "npm install"],
    answer: [0],
    category: "Cloud Standards & Best Practices",
    explanation: "'npm run lint' runs ESLint and Stylelint with custom Guidewire Jutro rules to flag restricted CSS variables and internal imports."
  },
  {
    question: "You are reviewing a colleague's code and notice the following import statement: import { convertTransport } from '@jutro/transport/internal/util'. Why is this import considered a violation of Guidewire cloud standards?",
    options: [
      "It uses a package that is currently deprecated.",
      "It uses a forward slash instead of a backslash.",
      "It is a shared cross-cutting helper that must live in the src/utils directory.",
      "It uses a deep internal import that can break during updates."
    ],
    answer: [3],
    category: "Cloud Standards & Best Practices",
    explanation: "Importing from '/internal/' paths violates the Jutro API contract because internal paths can change or be deleted without deprecation notices."
  },
  {
    question: "Why is it considered a best practice to use an incognito or private browser window when debugging a React application?",
    options: [
      "It isolates the app from cached data, cookies, and browser extensions.",
      "It automatically enables React DevTools by default in all browsers.",
      "It prevents the IDE from overriding the browser's console with its own log level.",
      "It forces the React build to run in production mode for better performance."
    ],
    answer: [0],
    category: "Tooling & Environment",
    explanation: "Private windows eliminate interference from aggressive service worker caches, stale cookies, and third-party browser extensions."
  },
  {
    question: "Why would a developer use both an IDE and DevTools for debugging?",
    options: [
      "To increase the application's execution speed by utilizing the processing power of both tools.",
      "React applications cannot be rendered in a browser unless the IDE's debugger is active.",
      "It can help reveal the source of more challenging problems by providing different perspectives on the code and state.",
      "To automatically synchronize and save UI style changes from the browser directly into the source code."
    ],
    answer: [2],
    category: "Tooling & Environment",
    explanation: "IDEs excel at source breakpoints and local variable inspection, while browser DevTools provide real-time DOM, network payload, and React fiber inspection."
  },
  {
    question: "A designer provides a new set of token values to align an app with a customer's brand. Where is the \"single source of truth\" for these design tokens?",
    options: [
      "The generated theme CSS file",
      "The src/i18n/lang.json file",
      "Figma and Tokens Studio",
      "The .themesConfig.json file",
      "The component's .module.scss file"
    ],
    answer: [2],
    category: "Theming & Design Tokens",
    explanation: "Figma using the Tokens Studio plugin is the authoritative source of truth from which design token JSON files are exported."
  },
  {
    question: "A developer is refactoring an app to support automated updates. Which of the following folder structures or file-naming patterns represent anti-patterns that you must avoid? (Select two)",
    options: [
      "Reusing the base name across logic, styles, and test files.",
      "Placing a test file in a __tests__ subfolder alongside the component.",
      "Moving App.tsx from src/app/ to the project root.",
      "Putting routing logic inline in App.tsx instead of using App.config.tsx.",
      "Keeping component-specific styles in a <ComponentName>.module.scss file.",
      "Using PascalCase for both folder names and base file names."
    ],
    answer: [2, 3],
    category: "Cloud Standards & Best Practices",
    explanation: "Moving App.tsx to the root breaks Jutro build tooling, and placing routing inline inside App.tsx bypasses the configuration-driven floorplan architecture."
  },
  {
    question: "Why is using the spread operator (...rest or ...props) considered a best practice when creating wrapper components in Jutro?",
    options: [
      "It improves the performance of data-fetching hooks.",
      "It ensures the component is compatible with new props added in future Jutro releases.",
      "It allows the component to bypass Guidewire cloud standards.",
      "It simplifies the component's internal state management."
    ],
    answer: [1],
    category: "Cloud Standards & Best Practices",
    explanation: "Prop forwarding ensures future props added to standard Jutro components are passed through transparently."
  },
  {
    question: "To ensure your Jutro function components remain thin and maintainable, which tasks should the component handle directly? (Select two)",
    options: [
      "Props wiring",
      "Complex business rules",
      "Data-fetching logic",
      "Basic UI behavior",
      "Ad hoc side effects"
    ],
    answer: [0, 3],
    category: "Components & Patterns",
    explanation: "Thin UI components should focus strictly on UI presentation, event binding, and props wiring, delegating business logic to hooks and utilities."
  },
  {
    question: "Which practices are required to keep Jutro function components thin and maintainable? (Select two)",
    options: [
      "Mix data fetching and ad hoc side effects directly within the component rendering.",
      "Export all small, single-use helpers to a global utility directory.",
      "Use class components for legacy patterns to ensure backward compatibility.",
      "Compose user interfaces from standard Jutro components.",
      "Move complex branching and business rules into custom hooks or helpers."
    ],
    answer: [3, 4],
    category: "Components & Patterns",
    explanation: "Composing standard components and delegating complex branching to custom hooks keeps view components lightweight and maintainable."
  },
  {
    question: "Which gateway component for InsuranceSuite backends supports a cookie-based authentication client?",
    options: [
      "Both API gateways",
      "The Backend Gateway",
      "The Digital API Gateway",
      "The GWCP API Gateway"
    ],
    answer: [2],
    category: "Digital SDK & Cloud APIs",
    explanation: "The Digital API Gateway supports cookie-based session authentication for web portal clients."
  },
  {
    question: "What is the API surface for an InsuranceSuite back-end app?",
    options: [
      "The total coverage of a back-end app's data model provided by an API as a percentage.",
      "The number of endpoints available to anyone making a request to the API with a specific URL.",
      "The security details that protect an API from malicious attack.",
      "A specific API that gives only high-level data in responses to protect PII."
    ],
    answer: [1],
    category: "Digital SDK & Cloud APIs",
    explanation: "API surface refers to the collection of reachable REST endpoints exposed by the InsuranceSuite application."
  },
  // --- FROM SOURCE 2 ---
  {
    question: "A colleague is creating a new Jutro app using the Jutro Web Apps (JWA) console and is unclear on the sequence to follow. Following best practices, which sequence of actions should you suggest?",
    options: [
      "Clone the repository, initialize the local codebase, create a new app using JWA console",
      "Create a new app using JWA console, clone the repository, initialize the local codebase",
      "Initialize a new repository in Bitbucket, create a new app using JWA console, clone the repository",
      "Install ESLint and other dependencies, create a new app using JWA console, clone the repository"
    ],
    answer: [1],
    category: "Jutro Web Apps (JWA) & Deployment",
    explanation: "First provision the app via JWA (which generates the Bitbucket repository and CI/CD pipelines), then clone the repo and install dependencies locally."
  },
  {
    question: "When developing a custom component for a specific UI requirement (for example, a dropdown with icons), which theming strategies should be followed to ensure integration with existing Jutro themes? (Select two)",
    options: [
      "Overwrite Jutro CSS variable mappings directly",
      "Define custom design tokens as needed, ensuring they map correctly to new custom CSS variables",
      "Avoid using any Jutro tokens and solely rely on CSS values",
      "Use Jutro design tokens wherever possible for thematic consistency",
      "Change the existing Jutro components to support new functionalities without creating custom tokens"
    ],
    answer: [1, 3],
    category: "Theming & Design Tokens",
    explanation: "Always reuse standard Jutro tokens where possible and introduce custom tokens mapped to custom CSS variables for unique requirements."
  },
  {
    question: "Which steps should be done before applying the theme by editing 'startApp.ts' to set themeConfig to 'havenTheme'? (Select two)",
    options: [
      "Implement the theme variables in the CSS files are under src/assets",
      "Upload generated CSS files to UX designers remote repository",
      "Delete other existing themes' configurations from themesConfig.json",
      "Convert the design tokens to CSS files using 'npm run build-themes'",
      "Check that the generated CSS files are under src/assets"
    ],
    answer: [3, 4],
    category: "Theming & Design Tokens",
    explanation: "Run 'npm run build-themes' to transform JSON tokens into CSS and verify the output files exist in 'src/assets' before registering in startApp.ts."
  },
  {
    question: "When setting up deployment variables, which type is typically generated to ensure the app can communicate securely and correctly in each environment?",
    options: [
      "Dynamic deployment variables generated by the database",
      "User-defined variables for custom configurations",
      "Integration and Authentication variables generated during deployment",
      "Deployment override variables set in the configuration files"
    ],
    answer: [2],
    category: "Jutro Web Apps (JWA) & Deployment",
    explanation: "JWA automatically generates Integration and Authentication variables per deployment environment to securely wire API gateway endpoints."
  },
  {
    question: "As a JWA Admin, you need to promote an application from development to pre-production but ensure that only specific IP addresses can access the app. Which prerequisite must be fulfilled before promotion?",
    options: [
      "Configure a custom IP domain for the app",
      "Ensure the app is updated with the latest CI/CD configurations",
      "Set up an allowlist for the pre-production environment",
      "Modify the app's address metadata in response headers"
    ],
    answer: [2],
    category: "Jutro Web Apps (JWA) & Deployment",
    explanation: "An IP allowlist must be configured on the destination pre-production environment in JWA before promoting the application."
  },
  {
    question: "Where should the 'variableOverrides.css' and 'styleOverrides.css' files be placed when applying a new theme to a Jutro app?",
    options: [
      "src/styles/theme",
      "src/assets/themeFolder/css",
      "src/config/themeFolder",
      "src/assets/styles/themeFolder"
    ],
    answer: [3],
    category: "Theming & Design Tokens",
    explanation: "Theme override CSS files are organized in 'src/assets/styles/<themeFolder>'."
  },
  {
    question: "What is one advantage of using Jutro components over non-Jutro components?",
    options: [
      "Ensuring code compatibility with legacy systems",
      "Ensuring code compatibility with Digital SDK",
      "Providing a custom styling framework",
      "Maintaining design consistency"
    ],
    answer: [3],
    category: "Components & Patterns",
    explanation: "Jutro components enforce enterprise brand guidelines, accessibility compliance, and visual design consistency across all Guidewire applications."
  },
  {
    question: "In Digital SDK, which function would you use to create a new account and simultaneously add an activity and a note for that account in one API call, if you require autocomplete and do not want to manually handle request wrapping and response unwrapping?",
    options: [
      "compositeRequestSimplified",
      "batchRequest",
      "asyncRequest",
      "asyncRequestSimplified",
      "batchRequestSimplified",
      "compositeRequest"
    ],
    answer: [0],
    category: "Digital SDK & Cloud APIs",
    explanation: "'compositeRequestSimplified' automatically unwraps responses, manages dependent object references, and provides full TypeScript autocompletion."
  },
  {
    question: "Succeed Insurance has requested that a single account is displayed in the User Interface. Which of the following SDK functions should you use, following best practices?",
    options: [
      "fetchAccountDetails",
      "retrieveAccount",
      "fetchAccountInfo",
      "getAccounts",
      "getAccount"
    ],
    answer: [4],
    category: "Digital SDK & Cloud APIs",
    explanation: "The canonical Digital SDK function to retrieve a single account by ID is 'getAccount(accountId)'."
  },
  {
    question: "You are asked to create a C-shape floorplan for your Jutro app, what does that translate to in the configuration?",
    options: [
      "Adding a left sidebar, a right sidebar, and a footer",
      "Adding a right sidebar and a footer",
      "Adding a left sidebar and a right sidebar",
      "Adding a left sidebar and a footer"
    ],
    answer: [2],
    category: "Floorplans & Layouts",
    explanation: "In Jutro configuration, a C-shape floorplan translates to enabling both the left sidebar and the right sidebar alongside the header."
  },
  {
    question: "Which of the following statements highlights the importance of Figma during the development of Jutro apps?",
    options: [
      "Figma provides a visual reference that ensures design consistency through the use of Jutro templates and patterns.",
      "Figma is used for version control of Jutro components.",
      "Figma directly generates production-ready React code for Jutro components.",
      "Figma allows designers and developers to collaborate on business requirements before implementation."
    ],
    answer: [0],
    category: "Components & Patterns",
    explanation: "Figma houses the Jutro UI component library and templates, ensuring strict parity between visual designs and implementation."
  },
  {
    question: "Which of the following statements correctly describe how TypeScript types are utilized in the Digital SDK? (Select two)",
    options: [
      "When using JDP, Digital SDK can be used with or without TypeScript",
      "TypeScript types are generated from Open API definitions.",
      "TypeScript types can only be imported from the Digital SDK.",
      "TypeScript types facilitate type safety by defining payload and response types for API requests.",
      "TypeScript types are not used in handling authentication and error parsing."
    ],
    answer: [1, 3],
    category: "Digital SDK & Cloud APIs",
    explanation: "Digital SDK types are compiled directly from OpenAPI specifications to provide end-to-end type safety for request payloads and response models."
  },
  {
    question: "A development team needs to understand how different Jutro components function before integrating them into a P&C insurance app. What tooling or resources are most appropriate for them to use? (Select two)",
    options: [
      "Guidewire Marketplace",
      "Component raw code snippets from the source repository",
      "Jutro component library in Figma",
      "Jutro Storybook",
      "Jutro documentation website"
    ],
    answer: [3, 4],
    category: "Tooling & Environment",
    explanation: "Jutro Storybook provides interactive component sandboxes and props playgrounds, while the Jutro documentation site explains behavioral contracts."
  },
  {
    question: "Succeed Insurance require you to build a responsive layout that simplifies development by automatically wrapping each child element with grid items. Which component would meet this requirement the best?",
    options: ["GridFlex", "GridColumns", "GridLayout", "Grid"],
    answer: [2],
    category: "Floorplans & Layouts",
    explanation: "GridLayout automatically wraps each child in a GridItem and distributes them according to the configured column schema."
  },
  {
    question: "How can a Jutro app use multiple floorplans on different pages?",
    options: [
      "Set a default floorplan for each page group, and override their properties in each page configuration.",
      "One floorplan only can be selected and used for all the pages of the app.",
      "Each page should have its own floorplan.",
      "Create floorplan overrides and use the 'matches' property to specify page paths."
    ],
    answer: [3],
    category: "Floorplans & Layouts",
    explanation: "Jutro supports defining floorplan overrides in App.config.tsx using the 'matches' pattern string to selectively match page paths."
  },
  {
    question: "Which of the following is typically a role of the developers on a Jutro project?",
    options: [
      "Recommend solutions to key usability and accessibility issues based on user research and analysis of existing system",
      "Follow best practices for development",
      "Develop custom components as required",
      "Design interactive and branded app prototypes using Jutro in Figma"
    ],
    answer: [1, 2],
    category: "Cloud Standards & Best Practices",
    explanation: "Developers implement custom components when JDS lacks standard coverage and ensure all implementation follows Guidewire best practices."
  },
  {
    question: "You have generated an SDK using the generate:digital-sdk command. Where would you find the API endpoints associated with the /account/API in the generated code?",
    options: [
      "src\\generated\\PcSdk\\types\\accountApi.ts",
      "src\\generated\\PcSdk\\account\\api\\accountApi.ts",
      "src\\generated\\PcSdk\\schemas\\accountApi.ts",
      "src\\generated\\PcSdk\\common\\api\\accountApi.ts"
    ],
    answer: [1],
    category: "Digital SDK & Cloud APIs",
    explanation: "Endpoints for the account domain are generated in 'src/generated/<SdkName>/account/api/accountApi.ts'."
  },
  {
    question: "What is the expected role of the themesConfig property within the 'start()' method in the 'startApp.ts' file?",
    options: [
      "It sets the global theme state for all Jutro applications",
      "It specifies which theme configuration to use when starting the app",
      "It defines the configuration settings used by the default app theme",
      "It is used to set the root URL for the theming selection"
    ],
    answer: [1],
    category: "Theming & Design Tokens",
    explanation: "themeConfig in start() designates the active theme definition and fallback cascade for the running application instance."
  },
  {
    question: "Identify the statements that correctly describe the use of Figma during the development of Jutro apps. (Select two)",
    options: [
      "Figma allows developers to directly import code to Jutro components.",
      "Figma enables app prototyping which can be directly copied into pages.",
      "Figma enables visual prototyping which can be replicated in the code.",
      "Figma provides design consistency which can be translated into Jutro apps."
    ],
    answer: [2, 3],
    category: "Components & Patterns",
    explanation: "Figma provides visual prototypes and reusable design components that align directly with Jutro React components."
  },
  {
    question: "Which of the following files is crucial for listing all the available themes in a Jutro app?",
    options: [
      "themesConfig.json",
      "styleOverrides.css",
      "variableOverrides.css",
      "config.json",
      "startApp.ts"
    ],
    answer: [0],
    category: "Theming & Design Tokens",
    explanation: "'themesConfig.json' acts as the theme registry listing all available themes, their token directories, and CSS bundles."
  },
  {
    question: "Which of the following practices are recommended when integrating Jutro components into an application? (Select two)",
    options: [
      "Ensuring no reliance on non-API elements in production code",
      "Changing CSS variables directly in the theme's generated CSS file",
      "Applying changes directly in design token JSON files",
      "Using Jutro Storybook to interactively generate JSX code",
      "Wrap Jutro components in HTML DIV elements"
    ],
    answer: [0, 3],
    category: "Cloud Standards & Best Practices",
    explanation: "Never rely on internal non-API markup/classes, and use Jutro Storybook to inspect and generate verified component JSX."
  },
  {
    question: "In the 'themesConfig.json' file, what property is used to specify the location of the design tokens JSON file?",
    options: [
      "path",
      "location",
      "design-token-file",
      "CSS",
      "input-path"
    ],
    answer: [4],
    category: "Theming & Design Tokens",
    explanation: "In 'themesConfig.json', 'input-path' specifies the path to the theme's design token JSON directory."
  },
  {
    question: "Succeed Insurance created a new product feature using APD that needs to be integrated into the frontend app. How would you make this feature available in the Digital SDK?",
    options: [
      "Recompile the backend application",
      "Update the frontend application to use the new SDK endpoints",
      "Modify the SDK directly to include new functionalities",
      "Regenerate the SDK with updated metadata sources"
    ],
    answer: [3],
    category: "Digital SDK & Cloud APIs",
    explanation: "When Advanced Product Designer (APD) or InsuranceSuite entities change, you must regenerate the Digital SDK to fetch the updated OpenAPI schemas."
  },
  {
    question: "Suppose you are working on a Jutro project and need to validate its dependencies and code structure. Which CLI commands do you execute? (Select two)",
    options: [
      "npm run jutro validate:app",
      "npm run jutro build",
      "npm run jutro validate:dependencies",
      "npm run jutro validate:linters",
      "npm run jutro linters:validate",
      "npm run jutro app:validate"
    ],
    answer: [2, 3],
    category: "Tooling & Environment",
    explanation: "'npm run jutro validate:dependencies' checks package parity and 'npm run jutro validate:linters' validates code formatting and cloud rules."
  },
  {
    question: "Which of the following steps correctly describe actions that a developer should perform to apply a custom theme to a Jutro app? (Select three)",
    options: [
      "Run the 'npm run apply-token' command to convert tokens to CSS",
      "Run the 'npm run build-themes' command to convert tokens to CSS",
      "Directly modify CSS files to reflect the new theme",
      "Get the theme JSON design token files and place them in the 'src/tokens' directory",
      "Add theme details to the themesConfig.json file",
      "Create and push design token JSON files to a shared repository"
    ],
    answer: [1, 3, 4],
    category: "Theming & Design Tokens",
    explanation: "Place token JSON files in 'src/tokens', register them in 'themesConfig.json', and compile them using 'npm run build-themes'."
  },
  {
    question: "How does Jutro Digital Platform make it easier to take advantage of Typescript's key features?",
    options: [
      "Overrides Javascript dynamic typing in the Jutro app settings",
      "Jutro library automatically updates with new types",
      "Generated types based on entities in back-end system",
      "Dedicated runtime compilation for Typescript"
    ],
    answer: [2],
    category: "Digital SDK & Cloud APIs",
    explanation: "JDP automatically generates TypeScript types from backend InsuranceSuite entities, giving full type safety across API calls."
  },
  {
    question: "To send a Modification request to update an address for an account contact, which API endpoint and method should be used and what fields are minimally required in the payload?",
    options: [
      "Endpoint: POST /accounts/{accountId}/contacts/{contactId}/address | Payload: addressLine1, city, state, postalCode",
      "Endpoint: PATCH /accounts/{accountId}/contacts/{contactId}/address | Payload: addressLine1, city, state, postalCode",
      "Endpoint: PATCH /accounts/{accountId}/contacts/address | Payload: city, state, postalCode",
      "Endpoint: PATCH /accounts/{accountId}/contacts/address | Payload: addressLine1, city, postalCode"
    ],
    answer: [1],
    category: "Digital SDK & Cloud APIs",
    explanation: "Updating an existing resource requires PATCH on '/accounts/{accountId}/contacts/{contactId}/address' with addressLine1, city, state, and postalCode."
  },
  {
    question: "A development team is tasked with creating a new web application that should cover all insurance lines of business and will be maintained by one team. The app must include a header, footer, layouts, and a settings page. Which of the following Jutro app templates is the most appropriate to use as a starting point?",
    options: [
      "Starter micro frontend",
      "Demo Personal auto quote",
      "Starter standalone",
      "Personal auto FNOL template"
    ],
    answer: [2],
    category: "Micro Frontends & Templates",
    explanation: "The 'Starter standalone' template provides the full scaffolding needed for a single team maintaining a complete multi-line business app."
  },
  {
    question: "You are asked to edit the .npmrc file to add a new registry to your Jutro app. Where would you find this file in the project?",
    options: [
      "In the src/config folder",
      "In the src folder",
      "In the config folder",
      "In the root folder"
    ],
    answer: [3],
    category: "Tooling & Environment",
    explanation: "Package configuration and registry scoping files (.npmrc) live in the project root directory."
  },
  {
    question: "You are preparing UI strings for translation in a new app. Which of the following are valid intlMessageShape properties? (Select three)",
    options: [
      "id: 'welcomeMessage', defaultMessage: 'Welcome to our app'",
      "id: 'loginPrompt', defaultMessage: 'Please log in', description: 'Prompt for user login'",
      "id: 'logoutMessage', description: 'You have logged out'",
      "defaultMessage: 'Enter your username', description: 'Username input field'"
    ],
    answer: [0, 1],
    category: "i18n & Localization (Sherlock)",
    explanation: "Valid intlMessageShape objects require at least 'id' and 'defaultMessage', with 'description' as an optional property."
  },
  {
    question: "Which statements align with the best practices outlined for Jutro theming? (Select two)",
    options: [
      "Evaluate the side effects of custom styling: increased upgradability cost due to breaking changes",
      "Prioritize the use of Design Tokens for all the theming related customizations",
      "Use any internal implementation details of React components for custom theming",
      "Directly modify the CSS variables as needed",
      "Prioritize the use of CSS overrides for all the theming related customizations"
    ],
    answer: [0, 1],
    category: "Theming & Design Tokens",
    explanation: "Always prioritize design tokens over raw CSS overrides and evaluate maintenance costs when introducing bespoke styles."
  },
  {
    question: "Succeed Insurance needs an initial floorplan configuration for new app that should have a header, left navigation panel, and a right sidebar. Which should be defined in src/app/App.config.tsx?",
    options: [
      "{ 'header': true, 'leftNav': false, 'footer': true }",
      "{ 'header': true, 'navigationPanel': true, 'rightSide': true }",
      "{ 'header': true, 'navigationPanel': true, 'rightSidebar': true }"
    ],
    answer: [2],
    category: "Floorplans & Layouts",
    explanation: "In App.config.tsx, the floorplan configuration object specifies 'header: true, navigationPanel: true, rightSidebar: true'."
  },
  {
    question: "Select the correct statements regarding the differences between Composite Requests and Batch Requests. (Select two)",
    options: [
      "In Composite Requests, all sub-requests must succeed for the transaction to be committed",
      "Composite Requests can only be used with GET requests.",
      "Composite Requests are executed as a single transaction, while Batch Requests are not.",
      "Batch Requests are transactional, meaning all requests must succeed for the complete batch to commit.",
      "In Batch Requests, all sub-requests must succeed for the transaction to be committed"
    ],
    answer: [0, 2],
    category: "Digital SDK & Cloud APIs",
    explanation: "Composite requests are all-or-nothing transactions where all sub-requests commit together, whereas Batch requests execute independently."
  },
  {
    question: "When applying query parameters to a Digital SDK request to get a list of accounts, which of the following snippets correctly uses query parameters to include only the field in the response?",
    options: [
      "const accounts = await getAccountsList({ options: {fields: ['accountId']} });",
      "const accounts = await getAccountsList({ params: { fields: ['accountId']} });",
      "const accounts = await getAccountsList({ query: {fields: ['accountId']} });",
      "const accounts = await getAccountsList({ fields: ['accountId'] });"
    ],
    answer: [3],
    category: "Digital SDK & Cloud APIs",
    explanation: "The Digital SDK accepts query options directly on the request parameter object: getAccountsList({ fields: ['accountId'] })."
  },
  {
    question: "Which commands can be used to extract and merge strings, and generate the Sherlock pseudolanguage translation file in a Jutro-based app? (Select two)",
    options: [
      "npm run sherlock",
      "npm run translate",
      "npm run jutro generate:i18n",
      "npm run jutro generate:sherlock",
      "npm run i18n"
    ],
    answer: [2, 4],
    category: "i18n & Localization (Sherlock)",
    explanation: "Both 'npm run i18n' and 'npm run jutro generate:i18n' extract messages, merge catalogs, and generate the Sherlock pseudolanguage file."
  },
  {
    question: "Which of the following is typically a role of the UX designers on a Jutro project? (Select two)",
    options: [
      "Solve accessibility issues",
      "Create user stories for development",
      "Minimize heavy customizations and prioritize base configuration Jutro components to meet requirements",
      "Generate project estimates"
    ],
    answer: [0, 2],
    category: "Cloud Standards & Best Practices",
    explanation: "UX designers ensure accessibility compliance and align designs with standard Jutro components to avoid costly bespoke customizations."
  },
  {
    question: "An urgent requirement has come up to prototype a user interface for a new feature in a P&C insurance app. What tools and resources from the Jutro Design System should you use to accomplish this? (Select three)",
    options: [
      "Jutro Storybook",
      "Raw HTML and CSS",
      "Advanced Product Designer",
      "Guidewire Marketplace",
      "Figma with the Jutro component library",
      "Jutro Documentation"
    ],
    answer: [0, 4, 5],
    category: "Tooling & Environment",
    explanation: "Figma with Jutro component libraries, Jutro Storybook, and the Jutro Documentation site are the standard prototyping resources."
  },
  {
    question: "Given that you need to execute multiple independent requests where each request's success or failure does not affect the execution of others, and all responses must be returned together, which approach is best?",
    options: [
      "Request Inclusion",
      "Batch Request",
      "Sequential Execution",
      "Composite Request",
      "Asynchronous Request"
    ],
    answer: [1],
    category: "Digital SDK & Cloud APIs",
    explanation: "Batch Requests execute a collection of independent operations where failure of one does not roll back the others."
  },
  {
    question: "Which of the following statements accurately describe internationalization (i18n) and localization (l10n)? (Select two)",
    options: [
      "Localization refers to the development process of designing a product to facilitate internationalization",
      "Localization involves translating the user interface and content of an application to different languages and regional settings.",
      "Internationalization focuses on general design and development practices that can support localization.",
      "Localization ensures the product can be easily adapted in the future for different languages and regions."
    ],
    answer: [1, 2],
    category: "i18n & Localization (Sherlock)",
    explanation: "Internationalization (i18n) is the engineering effort to make an app adaptable; Localization (l10n) is the actual translation and cultural adaptation."
  },
  {
    question: "Succeed Insurance needs to develop a Jutro app that allows users to submit insurance claims online, where different teams will handle different sections of the user journey independently. Which architectural pattern would be most suitable for this requirement?",
    options: [
      "Layered frontend",
      "Standalone app",
      "Service-oriented architecture",
      "Monolithic app",
      "Micro frontend"
    ],
    answer: [4],
    category: "Micro Frontends & Templates",
    explanation: "A micro frontend architecture allows autonomous teams to develop, test, and deploy journey slices independently without colliding."
  },
  {
    question: "Which of the following are capabilities of the Jutro Platform CLI? (Select two)",
    options: [
      "Generating translations and themes",
      "Fixing linting issues",
      "Running unit tests for an app",
      "Validating a Jutro project's folder structure and dependencies"
    ],
    answer: [1, 3],
    category: "Tooling & Environment",
    explanation: "Jutro Platform CLI fixes linting issues and validates folder structure, dependencies, and cloud compliance rules."
  },
  {
    question: "You need to align the 'Date of Birth' and 'Gender' fields in the same row in your Jutro app UI. According to best practices, what approach would you use to implement this requirement?",
    options: [
      "Jutro GridLayout with columns attribute",
      "Jutro Row component with alignItems attribute",
      "HTML DIV elements with CSS styles",
      "HTML TABLE, TR and TD elements",
      "Jutro Flex component with flexDirection attribute."
    ],
    answer: [0],
    category: "Floorplans & Layouts",
    explanation: "The Jutro GridLayout component with the columns property provides the responsive, themeable best-practice way to place form fields side-by-side."
  },
  {
    question: "How can a custom component be added to the default app header?",
    options: [
      "Add the custom component directly within the 'floorplan.js' file.",
      "Extend the default app header and make the custom component its child element.",
      "It is not possible to add custom components to the default app header. You need to create a custom header.",
      "Import the custom component and add it to the header using the 'visualizeCustomComponent' property.",
      "Import the custom component and add it to the header using the 'renderCustomComponent' property."
    ],
    answer: [4],
    category: "Floorplans & Layouts",
    explanation: "Use the 'renderCustomComponent' property on the header configuration in App.config.tsx to render custom elements in the header."
  },
  {
    question: "A page UI has been implemented with a header, left navigation panel, content area, and footer. Which floorplan shape is being used in this scenario?",
    options: ["r-Shape", "L-Shape", "C-Shape", "I-Shape"],
    answer: [1],
    category: "Floorplans & Layouts",
    explanation: "Header + Left Navigation + Content Area + Footer constitutes the classic Jutro 'L-Shape' floorplan."
  },
  {
    question: "What actions does the i18n script perform in the Jutro app? (Select two)",
    options: [
      "Generating pseudolanguage translations",
      "Generating a full translation for the new language",
      "Generating a report of untranslated strings",
      "Merging messages into a single file"
    ],
    answer: [1, 3],
    category: "i18n & Localization (Sherlock)",
    explanation: "The i18n script extracts and merges message shapes into unified JSON catalogs and produces Sherlock pseudolanguage files."
  },
  {
    question: "Which of the following statements are true about the use of Request Inclusion with Digital SDK? (Select two)",
    options: [
      "It can include selections that query for data.",
      "It allows a set of unordered sub-requests to be managed as a single transaction.",
      "The resources can be retrieved but not modified in the child requests.",
      "The entire request fails if the parent or any child request fails.",
      "It primarily uses POST and PATCH requests."
    ],
    answer: [3, 4],
    category: "Digital SDK & Cloud APIs",
    explanation: "Request Inclusion embeds related create/update child payloads inside a single POST/PATCH request, failing atomically if any part fails."
  },
  {
    question: "The UX designers have finalized the new styles for the Jutro App and have placed the design token files in the shared repository. What steps will the developers take to implement the new style as the default for the Jutro app? (Select three)",
    options: [
      "Add an entry for the custom theme in the themesConfig.json file",
      "Run the command 'npm run jutro generate:styles' to generate the styles for the custom theme",
      "Run the command 'npm run build-themes' to generate the the styles for the custom theme.",
      "Create a new folder under src/assets/styles for the Token JSON files",
      "Set the themeConfig property in the start() function in the startApp.tsx file to the new theme.",
      "Place the design token JSON files in a new folder under the src/tokens folder"
    ],
    answer: [0, 2, 4],
    category: "Theming & Design Tokens",
    explanation: "Register the theme in themesConfig.json, execute 'npm run build-themes', and configure themeConfig in startApp.tsx."
  },
  {
    question: "Succeed Insurance need to change the current theme in the app. Which files should be modified? (Select two)",
    options: [
      "variableOverrides.css",
      "themesConfig.json",
      "tokens.json",
      "startApp.ts",
      "styleOverrides.css"
    ],
    answer: [1, 3],
    category: "Theming & Design Tokens",
    explanation: "Switching themes involves updating 'themesConfig.json' and setting the active theme identifier in 'startApp.ts'."
  },
  {
    question: "Which of the following are true about the globalization store in Jutro applications? (Select two)",
    options: [
      "It requires the creation of a globalization.json configuration file.",
      "User preferences are automatically loaded from browser's settings.",
      "It can be initiated with 'createG11nMemoryStore' or 'createG11nLocalStorageStore' functions",
      "Globalization store is only used internally by Jutro components.",
      "User preferences stored in it can be accessed outside the React tree."
    ],
    answer: [1, 2],
    category: "i18n & Localization (Sherlock)",
    explanation: "The globalization store loads initial locale preferences from browser settings and provides createG11nMemoryStore/createG11nLocalStorageStore initializers."
  },
  {
    question: "Which of the following elements should be relied on in your code to ensure that it will not break in Jutro version updates? (Select two)",
    options: [
      "Component HTML markup",
      "React component props",
      "CSS class names",
      "CLI commands and signatures",
      "TypeScript definitions"
    ],
    answer: [1, 3],
    category: "Cloud Standards & Best Practices",
    explanation: "Public React component props and CLI command signatures are protected under the Jutro SemVer API contract."
  },
  {
    question: "Which of the following statements best describes a use case for anonymous authentication in a Jutro app?",
    options: [
      "Use it for APIs that allow actions like creating an account or generating a quote without requiring user authentication",
      "Use it to replace JWT authentication in production environments",
      "Use it for APIs that allow actions like interacting with InsuranceSuite to fetch user-specific data",
      "Use it when performing authenticated API requests only"
    ],
    answer: [0],
    category: "Digital SDK & Cloud APIs",
    explanation: "Anonymous authentication is designed for unauthenticated consumer quote-and-buy flows where users create quotes prior to registration."
  },
  {
    question: "To include a field for a microchip number (alphanumeric) in a pet details form, which Jutro component and import statement is appropriate?",
    options: [
      "TextInput; import { TextInput } from '@jutro/components';",
      "MicrochipInput; import { MicrochipInput } from '@jutro/components';",
      "NumberInput; import { NumberInput } from '@jutro/components';",
      "ToggleField; import { ToggleField } from '@jutro/components';"
    ],
    answer: [0],
    category: "Components & Patterns",
    explanation: "Alphanumeric identifiers use TextInput imported from '@jutro/components'."
  },
  {
    question: "Succeed Insurance have asked you to add a text input to a form. Following best practices, what steps should be followed? (Select three)",
    options: [
      "Define a CSS class for the component before using it",
      "Import the 'TextInput' from '@jutro/layout'",
      "Set appropriate props such as label, onChange, and value",
      "Import the TextInput from @jutro/components",
      "Paste the TextInput JSX code within the return block of your form",
      "Assign an id attribute to the component from Jutro Storybook"
    ],
    answer: [2, 3, 4],
    category: "Components & Patterns",
    explanation: "Import TextInput from '@jutro/components', configure standard props (label, value, onChange), and render it inside the JSX return block."
  },
  {
    question: "When developing Jutro apps, there are best practices that you must follow when committing and pushing code. Which of the following must you perform to avoid issues with pre-commit checks? (Select three)",
    options: [
      "Include Jira IDs in commit messages",
      "Validate that the code follows linting rules",
      "Validate that translations are correctly generate",
      "Write meaningful commit messages",
      "Validate the project dependencies",
      "Write commit messages that follow commitlint conventions"
    ],
    answer: [1, 2, 4],
    category: "Tooling & Environment",
    explanation: "Pre-commit hooks validate linting rules (ESLint/Stylelint), dependency integrity, and translation extraction."
  },
  {
    question: "Which of the following tasks can only be performed by an Admin in the JWA console? (Select three)",
    options: [
      "Promote to pre-production and production",
      "Create apps",
      "Deploy and undeploy from development",
      "Update CI/CD configurations",
      "Delete apps"
    ],
    answer: [0],
    category: "Jutro Web Apps (JWA) & Deployment",
    explanation: "Only JWA Admins have authority to promote applications to pre-production/production environments."
  },
  {
    question: "Given a config.json snippet with available locales ('en-US', 'es-ES') and available languages ('en'), which language and locale settings will be applied if the user's browser language is set to French and their locale preference is set to 'es-ES'?",
    options: [
      "Language: French, Locale: Spanish (Spain)",
      "Language: English, Locale: French",
      "Language: English, Locale: English (US)",
      "Language: English, Locale: Spanish (Spain)",
      "Language: French, Locale: English (US)"
    ],
    answer: [3],
    category: "i18n & Localization (Sherlock)",
    explanation: "French is not in available languages ('en'), so it falls back to English. 'es-ES' is an available locale, so it resolves to Language: English, Locale: Spanish (Spain)."
  },
  {
    question: "Succeed Insurance requires you to add a Welcome page that is based on the Settings page of an app, but has a different sidebar configuration, what steps should you take?",
    options: [
      "Create a floorplan configuration with a matches property set to the Welcome page, then set all properties as appropriate for the new page",
      "Create a floorplan configuration with a matches property set to the Settings page, then set only properties for the sidebar of the new page",
      "Create a floorplan configuration with a matches property set to the Settings page, then set all properties as appropriate for the new page",
      "Create a floorplan configuration with a matches property set to the Welcome page, then set only properties for the sidebar of the new page"
    ],
    answer: [1, 2],
    category: "Floorplans & Layouts",
    explanation: "Create a floorplan override with matches pointing to the new page route, and configure the necessary sidebar properties."
  },
  {
    question: "For a one-dimensional layout component displaying several similar items such as a list of notifications or a group of different elements horizontally, which components is best suited, according to best practices?",
    options: ["Grid", "GridLayout", "Flex", "ColumnsLayout"],
    answer: [2],
    category: "Floorplans & Layouts",
    explanation: "The Flex component is the recommended one-dimensional layout abstraction for horizontal or vertical linear sequences."
  },
  {
    question: "To map a custom CSS variable to a token value in a Jutro application, which file should you modify?",
    options: ["styles.css", "tokens.json", "package.json", "customMappings.json"],
    answer: [3],
    category: "Theming & Design Tokens",
    explanation: "'customMappings.json' is the designated configuration file for bridging custom CSS variables to Jutro design tokens."
  },
  {
    question: "Select the statements that accurately describe responsibilities of UX designers and developers when working with custom themes. (Select two)",
    options: [
      "Developers build themes and export them as design tokens for Jutro apps",
      "Developers build themes from design tokens and apply them to Jutro apps",
      "UX designers use Figma and other tools to create/update themes and export them as design tokens",
      "UX designers use Figma and other tools to create/update themes and export CSS classes",
      "UX designers use Design Tokens to create, update and export CSS classes"
    ],
    answer: [1, 2],
    category: "Theming & Design Tokens",
    explanation: "UX designers define and export design tokens via Figma, while developers compile those tokens and wire them into the application."
  },
  {
    question: "When creating a note for an account using a composite request, how do you ensure the note is associated with the correct account?",
    options: [
      "Include the note in the account creation payload",
      "Use the vars attribute to pass the account.id from the account creation sub-request",
      "Execute a separate request for note creation after account creation",
      "Fetch the account details after creating the note",
      "Use a query to retrieve the 'accountId' from a previous sub-request"
    ],
    answer: [1],
    category: "Digital SDK & Cloud APIs",
    explanation: "Composite requests use the 'vars' attribute and reference syntax (e.g. '@{NewAccount.id}') to pass IDs between sub-requests within the same payload."
  }
];

export const jutroQuestions: JutroQuestion[] = rawQuestions.map((q, idx) => ({
  id: `jutro-${idx + 1}`,
  question: q.question,
  options: q.options,
  answer: q.answer,
  category: q.category || "General Jutro",
  explanation: q.explanation || "Official Guidewire Jutro Developer Certification question.",
  isMultiSelect: q.answer.length > 1,
}));

export const jutroCategories = Array.from(
  new Set(jutroQuestions.map((q) => q.category))
);
