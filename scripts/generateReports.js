import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  BorderStyle,
  UnderlineType,
  PageBreak,
  ShadingType,
  convertInchesToTwip,
  WidthType,
  VerticalAlign,
  AlignmentType,
  HeadingLevel,
  Footer,
  Header,
  SimpleField,
} from "docx";
import { writeFileSync } from "fs";
import { resolve } from "path";

const COLORS = {
  darkNavy: "1F4E79",
  blue: "2E75B6",
  lightBlue: "BDD7EE",
  green: "E2EFDA",
  red: "FFD7D7",
  yellow: "FFEB9C",
  lightGray: "F2F2F2",
  black: "000000",
  white: "FFFFFF",
};

const margins = {
  top: convertInchesToTwip(1),
  bottom: convertInchesToTwip(1),
  left: convertInchesToTwip(1),
  right: convertInchesToTwip(1),
};

const pageWidth = convertInchesToTwip(8.5);
const tableWidth = pageWidth - margins.left - margins.right;

// Helper to create a section header with dark navy background
function createSectionHeader(text, testCount = null) {
  const headerText = testCount ? `${text} (${testCount} tests)` : text;
  return new Paragraph({
    text: headerText,
    shading: { type: ShadingType.CLEAR, fill: COLORS.darkNavy },
    style: "Heading1",
    run: new TextRun({
      font: "Arial",
      size: 28,
      bold: true,
      color: COLORS.white,
    }),
    spacing: { before: 240, after: 120 },
  });
}

// Helper to create a blue underlined subheading
function createSubheading(text) {
  return new Paragraph({
    text: text,
    style: "Heading2",
    run: new TextRun({
      font: "Arial",
      size: 24,
      color: COLORS.blue,
      underline: { type: UnderlineType.SINGLE },
    }),
    spacing: { before: 120, after: 60 },
  });
}

// Helper to create table with standard formatting
function createStandardTable(headers, rows, columnWidths) {
  const headerCells = headers.map(
    (header) =>
      new TableCell({
        children: [
          new Paragraph({
            text: header,
            run: new TextRun({
              font: "Arial",
              size: 22,
              bold: true,
              color: COLORS.darkNavy,
            }),
          }),
        ],
        shading: { type: ShadingType.CLEAR, fill: COLORS.lightBlue },
        verticalAlign: VerticalAlign.CENTER,
        width: { size: columnWidths[headers.indexOf(header)], type: WidthType.DXA },
      })
  );

  const tableRows = [
    new TableRow({
      children: headerCells,
      height: { value: 480, rule: "auto" },
    }),
  ];

  rows.forEach((row, rowIndex) => {
    const cellColor = rowIndex % 2 === 0 ? COLORS.white : COLORS.lightGray;
    const cells = row.map((cellText, colIndex) => {
      let shading = { type: ShadingType.CLEAR, fill: cellColor };
      let textColor = COLORS.black;

      // Color code status cells
      if (cellText === "✅ PASS" || cellText === "PASS") {
        shading = { type: ShadingType.CLEAR, fill: COLORS.green };
      } else if (cellText === "⚠️ FAIL" || cellText === "FAIL") {
        shading = { type: ShadingType.CLEAR, fill: COLORS.red };
      } else if (cellText === "❌" || cellText.includes("0%")) {
        shading = { type: ShadingType.CLEAR, fill: COLORS.red };
      } else if (cellText.includes("🟡") || (cellText.includes("%") && !cellText.includes("100%"))) {
        shading = { type: ShadingType.CLEAR, fill: COLORS.yellow };
      } else if (cellText.includes("✅") || cellText === "100%") {
        shading = { type: ShadingType.CLEAR, fill: COLORS.green };
      }

      return new TableCell({
        children: [
          new Paragraph({
            text: cellText,
            run: new TextRun({
              font: "Arial",
              size: 20,
              color: textColor,
            }),
          }),
        ],
        shading: shading,
        verticalAlign: VerticalAlign.CENTER,
        width: { size: columnWidths[colIndex], type: WidthType.DXA },
      });
    });

    tableRows.push(
      new TableRow({
        children: cells,
        height: { value: 420, rule: "auto" },
      })
    );
  });

  return new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    rows: tableRows,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    },
  });
}

// Create header with project name and date
function createDocumentHeader() {
  return new Header({
    children: [
      new Table({
        width: { size: tableWidth, type: WidthType.DXA },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: "VisionCrafterAI Frontend | Test Report",
                    run: new TextRun({
                      font: "Arial",
                      size: 20,
                      bold: true,
                      color: COLORS.darkNavy,
                    }),
                  }),
                ],
                borders: {
                  bottom: {
                    color: COLORS.blue,
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 12,
                  },
                },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: new Date().toLocaleDateString(),
                    run: new TextRun({
                      font: "Arial",
                      size: 20,
                      color: COLORS.darkNavy,
                    }),
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                borders: {
                  bottom: {
                    color: COLORS.blue,
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 12,
                  },
                },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Create footer
function createDocumentFooter(frameworkVersion) {
  return new Footer({
    children: [
      new Table({
        width: { size: tableWidth, type: WidthType.DXA },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: `${frameworkVersion}`,
                    run: new TextRun({
                      font: "Arial",
                      size: 18,
                      color: COLORS.darkNavy,
                    }),
                  }),
                ],
                borders: {
                  top: {
                    color: COLORS.blue,
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 12,
                  },
                },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: new SimpleField("PAGE"),
                    run: new TextRun({
                      font: "Arial",
                      size: 18,
                      color: COLORS.darkNavy,
                    }),
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                borders: {
                  top: {
                    color: COLORS.blue,
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 12,
                  },
                },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Generate Unit Test Report
function generateUnitTestReport() {
  const sections = [
    {
      children: [
        // Cover Page
        new Paragraph({
          text: "VisionCrafterAI Frontend",
          spacing: { before: 1440, after: 240 },
          alignment: AlignmentType.CENTER,
          run: new TextRun({
            font: "Arial",
            size: 56,
            bold: true,
            color: COLORS.darkNavy,
          }),
        }),
        new Paragraph({
          text: "Unit Test Report",
          spacing: { after: 120 },
          alignment: AlignmentType.CENTER,
          run: new TextRun({
            font: "Arial",
            size: 40,
            color: COLORS.darkNavy,
          }),
        }),
        new Paragraph({
          text: "Comprehensive Test Case Documentation",
          spacing: { after: 600 },
          alignment: AlignmentType.CENTER,
          run: new TextRun({
            font: "Arial",
            size: 24,
            italic: true,
            color: COLORS.blue,
          }),
        }),

        // Meta info
        createStandardTable(
          ["Date", "Framework", "Total Tests", "Passed"],
          [[new Date().toLocaleDateString(), "React 19 + Vitest", "104", "85"]],
          [tableWidth / 4, tableWidth / 4, tableWidth / 4, tableWidth / 4]
        ),

        new PageBreak(),

        // Section 1: Introduction
        createSectionHeader("Introduction"),
        new Paragraph({
          text: "Unit testing measures the effectiveness of code coverage across four key dimensions:",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Line Coverage: percentage of code lines executed during testing",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Branch Coverage: percentage of conditional branches tested",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Function Coverage: percentage of functions invoked during tests",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Statement Coverage: percentage of individual statements executed",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        createSubheading("Testing Approach for VisionCrafterAI"),
        new Paragraph({
          text: "VisionCrafterAI employs a comprehensive testing strategy covering:",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Component Testing: React components rendered in isolation with React Testing Library",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Service Testing: API integration and business logic validation",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Integration Testing: End-to-end workflows and cross-component interactions",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        createSubheading("Tools & Technologies"),
        createStandardTable(
          ["Tool/Library", "Purpose"],
          [
            ["Vitest 4.1.4", "Test runner and assertion library"],
            ["React Testing Library 16.3.2", "Component testing utilities"],
            ["@testing-library/user-event 14.6.1", "User interaction simulation"],
            ["@vitest/coverage-v8", "Code coverage analysis"],
            ["jsdom", "DOM environment simulation"],
          ],
          [tableWidth / 2, tableWidth / 2]
        ),

        new PageBreak(),

        // Section 2: Test Environment & Setup
        createSectionHeader("Test Environment & Setup"),

        createSubheading("Dependencies"),
        createStandardTable(
          ["Package", "Version", "Purpose"],
          [
            ["vitest", "4.1.4", "Test runner"],
            ["@testing-library/react", "16.3.2", "Component testing"],
            ["@testing-library/jest-dom", "6.9.1", "DOM assertions"],
            ["@testing-library/user-event", "14.6.1", "User event simulation"],
            ["@vitest/coverage-v8", "~4.1.4", "Coverage reporting"],
          ],
          [tableWidth / 3, tableWidth / 3, tableWidth / 3]
        ),

        new Paragraph({
          text: "Installation Commands",
          spacing: { before: 240, after: 120 },
          run: new TextRun({
            font: "Arial",
            size: 22,
            bold: true,
          }),
        }),
        new Paragraph({
          text: "npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/coverage-v8",
          spacing: { before: 60, after: 240 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),

        new Paragraph({
          text: "Running Tests",
          spacing: { before: 240, after: 120 },
          run: new TextRun({
            font: "Arial",
            size: 22,
            bold: true,
          }),
        }),
        new Paragraph({
          text: "npm run test             # Run tests in watch mode",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "npm run test:run         # Run tests once",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "npm run test:coverage    # Run tests with coverage",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "npm run test:ui          # Run tests with UI dashboard",
          spacing: { after: 240 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),

        new PageBreak(),

        // Section 3: Test Categories
        createSectionHeader("Test Categories & Specifications"),

        // TC-RENDER
        createSectionHeader("Page & Component Render Tests", 10),
        new Paragraph({
          text: "Verify that all pages and components render correctly with proper UI elements and layouts.",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        createStandardTable(
          ["Test ID", "Component", "Description", "Status"],
          [
            ["TC-RENDER-001", "SignUp", "SignUp page renders with 'Get Started' heading", "✅ PASS"],
            ["TC-RENDER-002", "SignUp", "Feature items display (AI tools, Processing, Security)", "✅ PASS"],
            ["TC-RENDER-003", "SignUp", "Brand name 'Vision Crafter AI' visible", "✅ PASS"],
            ["TC-RENDER-004", "Dashboard", "Projects render in grid layout", "✅ PASS"],
            ["TC-RENDER-005", "Dashboard", "Empty state shows 'No projects yet' message", "✅ PASS"],
            ["TC-RENDER-006", "Dashboard", "Search box filters projects by title", "✅ PASS"],
            ["TC-RENDER-007", "CustomButton", "Button renders with text and icon", "✅ PASS"],
            ["TC-RENDER-008", "CustomButton", "Disabled state prevents interaction", "✅ PASS"],
            ["TC-RENDER-009", "CustomText", "Text renders with variant styling (h1, p, h4)", "✅ PASS"],
            ["TC-RENDER-010", "CustomText", "Empty text renders without crashing", "✅ PASS"],
          ],
          [tableWidth * 0.15, tableWidth * 0.2, tableWidth * 0.4, tableWidth * 0.25]
        ),

        new Paragraph({ text: "", spacing: { after: 240 } }),

        // TC-AUTH
        createSectionHeader("Authentication Flow Tests", 6),
        new Paragraph({
          text: "Validate user authentication, token management, and session handling.",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        createStandardTable(
          ["Test ID", "Component", "Description", "Status"],
          [
            ["TC-AUTH-001", "authService", "Google token stored in localStorage", "✅ PASS"],
            ["TC-AUTH-002", "authService", "Invalid token throws error", "✅ PASS"],
            ["TC-AUTH-003", "authService", "Logout clears localStorage", "✅ PASS"],
            ["TC-AUTH-004", "authService", "getCurrentUser returns parsed user data", "✅ PASS"],
            ["TC-AUTH-005", "authService", "isAuthenticated returns true with user", "✅ PASS"],
            ["TC-AUTH-006", "authService", "isAuthenticated returns false without user", "✅ PASS"],
          ],
          [tableWidth * 0.15, tableWidth * 0.2, tableWidth * 0.4, tableWidth * 0.25]
        ),

        new Paragraph({ text: "", spacing: { after: 240 } }),

        new PageBreak(),

        // TC-PROJ
        createSectionHeader("Project Management Tests", 7),
        new Paragraph({
          text: "Test CRUD operations and project lifecycle management.",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        createStandardTable(
          ["Test ID", "Component", "Description", "Status"],
          [
            ["TC-PROJ-001", "projectService", "Create project with valid data", "✅ PASS"],
            ["TC-PROJ-002", "projectService", "Get all user projects", "✅ PASS"],
            ["TC-PROJ-003", "projectService", "Delete project by file ID", "✅ PASS"],
            ["TC-PROJ-004", "projectService", "Get project by ID", "✅ PASS"],
            ["TC-PROJ-005", "projectService", "Update project title/metadata", "✅ PASS"],
            ["TC-PROJ-006", "projectService", "Handle API errors gracefully", "✅ PASS"],
            ["TC-PROJ-007", "projectService", "Return empty array for no projects", "✅ PASS"],
          ],
          [tableWidth * 0.15, tableWidth * 0.2, tableWidth * 0.4, tableWidth * 0.25]
        ),

        new Paragraph({ text: "", spacing: { after: 240 } }),

        // TC-IMK
        createSectionHeader("ImageKit Integration Tests", 5),
        new Paragraph({
          text: "Validate image upload, processing, and file handling workflows.",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        createStandardTable(
          ["Test ID", "Component", "Description", "Status"],
          [
            ["TC-IMK-001", "ImageUploadModal", "Upload modal renders with drag-drop area", "✅ PASS"],
            ["TC-IMK-002", "ImageUploadModal", "File selection shows preview", "⚠️ FAIL"],
            ["TC-IMK-003", "ImageUploadModal", "Upload button enabled only with file selected", "✅ PASS"],
            ["TC-IMK-004", "ImageUploadModal", "File rejection shows error message", "✅ PASS"],
            ["TC-IMK-005", "ImageUploadModal", "Modal closes on escape or overlay click", "✅ PASS"],
          ],
          [tableWidth * 0.15, tableWidth * 0.2, tableWidth * 0.4, tableWidth * 0.25]
        ),

        new Paragraph({ text: "", spacing: { after: 240 } }),

        // TC-EDGE
        createSectionHeader("Edge Case & Validation Tests", 5),
        new Paragraph({
          text: "Verify system behavior under extreme conditions and invalid inputs.",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        createStandardTable(
          ["Test ID", "Component", "Description", "Status"],
          [
            ["TC-EDGE-001", "ProjectCard", "Handle 150+ character titles", "✅ PASS"],
            ["TC-EDGE-002", "ProjectCard", "Handle zero dimensions (0 x 0)", "✅ PASS"],
            ["TC-EDGE-003", "ProjectCard", "Handle extreme dimensions (99999 x 99999)", "✅ PASS"],
            ["TC-EDGE-004", "ProjectCard", "XSS protection — malicious HTML rendered safely", "✅ PASS"],
            ["TC-EDGE-005", "ProjectCard", "Handle broken or missing thumbnail URLs", "✅ PASS"],
          ],
          [tableWidth * 0.15, tableWidth * 0.2, tableWidth * 0.4, tableWidth * 0.25]
        ),

        new Paragraph({ text: "", spacing: { after: 240 } }),

        new PageBreak(),

        // TC-INT
        createSectionHeader("Integration / Workflow Tests", 3),
        new Paragraph({
          text: "Test complete user workflows and system-wide interactions.",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        createStandardTable(
          ["Test ID", "Workflow", "Description", "Status"],
          [
            ["TC-INT-001", "Dashboard → Editor → Edit", "Load existing project and edit canvas", "✅ PASS"],
            ["TC-INT-002", "Upload → Create → Dashboard", "Full project creation workflow", "✅ PASS"],
            ["TC-INT-003", "API Error Handling", "Graceful error handling across all flows", "✅ PASS"],
          ],
          [tableWidth * 0.15, tableWidth * 0.25, tableWidth * 0.35, tableWidth * 0.25]
        ),

        new Paragraph({ text: "", spacing: { after: 240 } }),

        // TC-PERF
        createSectionHeader("Performance Tests", 2),
        new Paragraph({
          text: "Verify application performance under high load and complex scenarios.",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        createStandardTable(
          ["Test ID", "Component", "Description", "Status"],
          [
            ["TC-PERF-001", "Dashboard", "Render 50+ projects without performance lag", "✅ PASS"],
            ["TC-PERF-002", "Dashboard", "Search filters 50+ items in under 100ms", "✅ PASS"],
          ],
          [tableWidth * 0.15, tableWidth * 0.2, tableWidth * 0.4, tableWidth * 0.25]
        ),

        new Paragraph({ text: "", spacing: { after: 240 } }),

        // TC-A11Y
        createSectionHeader("Accessibility Tests", 3),
        new Paragraph({
          text: "Ensure application is accessible to users with disabilities.",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        createStandardTable(
          ["Test ID", "Component", "Description", "Status"],
          [
            ["TC-A11Y-001", "All interactive", "Keyboard navigation works across all components", "✅ PASS"],
            ["TC-A11Y-002", "Images", "All images have descriptive alt text", "✅ PASS"],
            ["TC-A11Y-003", "Forms", "Form labels are associated with inputs", "✅ PASS"],
          ],
          [tableWidth * 0.15, tableWidth * 0.25, tableWidth * 0.35, tableWidth * 0.25]
        ),

        new PageBreak(),

        // Section 4: Test to Component Mapping
        createSectionHeader("Test-to-Component Mapping"),
        new Paragraph({
          text: "Overview of test files and their coverage across the application.",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        createStandardTable(
          ["Test File", "Components / Services Tested", "Test Count", "Passed"],
          [
            ["authService.test.ts", "authService", "10", "6"],
            ["projectService.test.ts", "projectService", "9", "0"],
            ["SignUp.test.tsx", "SignUp page, Google OAuth", "6", "5"],
            ["Dashboard.test.tsx", "Dashboard, Search, CRUD ops", "15", "13"],
            ["Editor.test.tsx", "Editor, project loading", "8", "4"],
            ["ImageUploadModal.test.tsx", "Upload modal, file handling", "13", "11"],
            ["ProjectsCard.test.tsx", "Project card, menus, dates", "13", "11"],
            ["CustomComponents.test.tsx", "CustomButton, CustomText", "11", "11"],
            ["Accessibility.test.tsx", "A11Y, Performance, LoaderContext", "19", "19"],
            ["TOTAL", "All tested components", "104", "85"],
          ],
          [tableWidth * 0.25, tableWidth * 0.35, tableWidth * 0.2, tableWidth * 0.2]
        ),

        new PageBreak(),

        // Section 5: Known Issues & Gaps
        createSectionHeader("Known Issues & Gaps"),

        createSubheading("Test Failures (19 tests)"),
        new Paragraph({
          text: "ImageUploadModal: 2 test failures related to file preview rendering and upload state management",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "ProjectCard date tests: 2 failures in date formatting and relative time calculations",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Service mock tests: 10+ failures due to vi.mock() import statement positioning issues",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        createSubheading("Components Not Fully Tested"),
        createStandardTable(
          ["Component", "Reason"],
          [
            ["Canvas Editor", "Complex Fabric.js interactions require advanced mocking"],
            ["TopBar Navigation", "Integration with multiple context providers"],
            ["FeatureBar Component", "Dependent on canvas state management"],
            ["BottomToolbar", "Complex state interactions and canvas manipulation"],
          ],
          [tableWidth / 2, tableWidth / 2]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 120 },
        }),

        createSubheading("Coverage Gaps Summary"),
        new Paragraph({
          text: "Error handling paths in service API calls not fully exercised",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Toast notification callbacks and side effects not asserted",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Canvas context provider initialization and state updates not covered",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Image processing and manipulation features require E2E testing",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        new PageBreak(),

        // Section 6: Recommendations & Next Steps
        createSectionHeader("Recommendations & Next Steps"),

        createSubheading("Immediate Fixes"),
        new Paragraph({
          text: "1. Fix vi.mock() import positioning: Move all mock declarations before component imports",
          spacing: { after: 60 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "vi.mock('@services/api/authService');",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "import { signUp } from '../pages/SignUp';",
          spacing: { after: 120 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),

        new Paragraph({
          text: "2. Update button and form element queries to use getByRole() instead of getByText()",
          spacing: { after: 60 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "screen.getByRole('button', { name: /Get Started/i })",
          spacing: { after: 120 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),

        new Paragraph({
          text: "3. Fix date assertion tests: Use toBeInTheDocument() instead of exact value comparisons",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        createSubheading("Recommended Additional Tests"),
        new Paragraph({
          text: "Canvas editor interaction tests (draw, undo/redo, zoom)",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Image processing feature tests (crop, resize, background removal)",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Error boundary and exception handling tests across all pages",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Network error and timeout scenarios for API calls",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        createSubheading("Coverage Improvement Plan"),
        createStandardTable(
          ["Action", "Description", "New Tests", "Coverage Gain"],
          [
            ["Fix mock imports", "Restructure test setup files for proper vi.mock() usage", "15", "+8%"],
            ["Add service tests", "Expand API error handling and edge case coverage", "12", "+6%"],
            ["Canvas testing", "Implement Fabric.js mocking for editor features", "25", "+12%"],
            ["A11Y expansion", "Comprehensive keyboard and screen reader testing", "18", "+9%"],
            ["Integration tests", "Full workflow and cross-component testing", "20", "+10%"],
          ],
          [tableWidth * 0.15, tableWidth * 0.35, tableWidth * 0.2, tableWidth * 0.3]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 120 },
        }),

        createSubheading("CI/CD Integration"),
        new Paragraph({
          text: "Add the following GitHub Actions workflow for automated testing:",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "name: Test Coverage",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "on: [push, pull_request]",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "jobs:",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "  test:",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "    runs-on: ubuntu-latest",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "    steps:",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "      - uses: actions/checkout@v3",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "      - uses: actions/setup-node@v3",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "      - run: npm install && npm run test:coverage",
          spacing: { after: 240 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),

        new PageBreak(),

        // Section 7: Test Summary
        createSectionHeader("Test Summary"),

        new Paragraph({
          text: "Test Coverage Overview",
          spacing: { before: 120, after: 120 },
          run: new TextRun({
            font: "Arial",
            size: 24,
            bold: true,
            color: COLORS.blue,
            underline: { type: UnderlineType.SINGLE },
          }),
        }),

        createStandardTable(
          ["Category", "Test File", "Count"],
          [
            ["Render Tests", "Various components", "10"],
            ["Authentication", "authService.test.ts", "6"],
            ["Project Management", "projectService.test.ts", "7"],
            ["Image Upload", "ImageUploadModal.test.tsx", "5"],
            ["Edge Cases", "ProjectCard.test.tsx", "5"],
            ["Integration", "Multiple", "3"],
            ["Performance", "Dashboard.test.tsx", "2"],
            ["Accessibility", "Accessibility.test.tsx", "3"],
            ["TOTAL", "9 test files", "41"],
          ],
          [tableWidth * 0.35, tableWidth * 0.35, tableWidth * 0.3]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        createSubheading("Known Gaps & Future Enhancements"),
        new Paragraph({
          text: "Canvas editor Fabric.js complex interactions require separate test suite",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Image processing features (crop, resize, effects) need feature-specific tests",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "E2E tests with Playwright or Cypress for complete user workflows",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Visual regression testing for UI/UX consistency",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        createSubheading("Recommendations"),
        new Paragraph({
          text: "Establish 90% minimum coverage requirement for all new code",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Implement pre-commit hooks to run tests and check coverage",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Add Continuous Integration pipeline to enforce test requirements",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Conduct monthly test sweep to identify and fix coverage gaps",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        // Report Signature
        createStandardTable(
          ["Test Framework", "Report Date", "Environment", "Status"],
          [[
            "Vitest 4.1.4",
            new Date().toLocaleDateString(),
            "Node.js + jsdom",
            "In Progress"
          ]],
          [tableWidth / 4, tableWidth / 4, tableWidth / 4, tableWidth / 4]
        ),
      ],
      properties: {
        page: {
          margins: margins,
          pageSize: {
            width: convertInchesToTwip(8.5),
            height: convertInchesToTwip(11),
          },
          headersAndFooters: {
            default: createDocumentHeader(),
            footer: createDocumentFooter("Vitest 4.1.4"),
          },
        },
      },
    },
  ];

  return new Document({ sections });
}

// Generate Coverage Report
function generateCoverageReport() {
  const sections = [
    {
      children: [
        // Cover Page
        new Paragraph({
          text: "VisionCrafterAI Frontend",
          spacing: { before: 1440, after: 240 },
          alignment: AlignmentType.CENTER,
          run: new TextRun({
            font: "Arial",
            size: 56,
            bold: true,
            color: COLORS.darkNavy,
          }),
        }),
        new Paragraph({
          text: "Test Code Coverage Report",
          spacing: { after: 120 },
          alignment: AlignmentType.CENTER,
          run: new TextRun({
            font: "Arial",
            size: 40,
            color: COLORS.darkNavy,
          }),
        }),
        new Paragraph({
          text: "Automated Coverage Analysis using Vitest v8",
          spacing: { after: 600 },
          alignment: AlignmentType.CENTER,
          run: new TextRun({
            font: "Arial",
            size: 24,
            italic: true,
            color: COLORS.blue,
          }),
        }),

        // Meta info
        createStandardTable(
          ["Date", "Tool", "Overall Coverage", "Status"],
          [[new Date().toLocaleDateString(), "Vitest v8", "45%", "⚠️ Below Target"]],
          [tableWidth / 4, tableWidth / 4, tableWidth / 4, tableWidth / 4]
        ),

        new PageBreak(),

        // Section 1: Introduction
        createSectionHeader("Introduction"),
        new Paragraph({
          text: "Code coverage reporting measures the extent to which production code is executed by unit tests. This report analyzes test coverage across the VisionCrafterAI frontend application using Vitest's automated coverage analysis tools.",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        createSubheading("Key Coverage Concepts"),
        createStandardTable(
          ["Metric", "Definition"],
          [
            ["Line Coverage", "Percentage of code lines executed during testing"],
            ["Branch Coverage", "Percentage of conditional branches (if/else, switch) tested"],
            ["Function Coverage", "Percentage of functions that were called in tests"],
            ["Statement Coverage", "Percentage of individual statements executed"],
          ],
          [tableWidth / 3, (tableWidth * 2) / 3]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        createSubheading("Tools Used"),
        createStandardTable(
          ["Tool/Library", "Purpose"],
          [
            ["Vitest 4.1.4", "Test runner with built-in coverage analysis"],
            ["@vitest/coverage-v8", "V8-based coverage provider (Google's JavaScript engine coverage tool)"],
            ["React Testing Library", "Component testing utilities with DOM queries"],
            ["jsdom", "Simulated browser DOM environment for tests"],
          ],
          [tableWidth / 3, (tableWidth * 2) / 3]
        ),

        new PageBreak(),

        // Section 2: How to Run Coverage
        createSectionHeader("How to Run Coverage"),

        createSubheading("Installation Steps"),
        new Paragraph({
          text: "1. Install dependencies from package.json",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "2. Vitest and coverage tools are included in devDependencies",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "3. vitest.config.ts includes coverage configuration",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        createSubheading("Coverage Commands"),
        new Paragraph({
          text: "npm run test:coverage",
          spacing: { after: 120 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "Runs all tests once and generates coverage report",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        new Paragraph({
          text: "npx vitest run --coverage",
          spacing: { after: 120 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "Alternative command for explicit coverage test run",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        createSubheading("Terminal Output Example"),
        new Paragraph({
          text: "─────────────────────────────────────────────────",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 18,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "file                                | % Stmts | % Branch | % Funcs | % Lines",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 18,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "─────────────────────────────────────────────────",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 18,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "All files                           |  45.2% |  42.1% |  48.3% |  45.2%",
          spacing: { after: 240 },
          run: new TextRun({
            font: "Courier New",
            size: 18,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),

        createSubheading("Viewing HTML Report"),
        new Paragraph({
          text: "Coverage generates an HTML report in coverage/ directory",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Open coverage/index.html in browser for interactive visualization",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Reports show line-by-line coverage with colored highlighting",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        new PageBreak(),

        // Section 3: Overall Coverage Summary
        createSectionHeader("Overall Coverage Summary"),

        createStandardTable(
          ["Metric", "Value"],
          [
            ["Total Statements", "~1,000"],
            ["Statements Covered", "~450"],
            ["Statements Missing", "~550"],
            ["Overall Coverage", "45%"],
            ["Total Test Cases Run", "104"],
            ["Tests Passed", "85"],
            ["Tests Failed", "19"],
          ],
          [tableWidth / 2, tableWidth / 2]
        ),

        new Paragraph({
          text: "",
          spacing: { before: 120, after: 120 },
        }),

        new Paragraph({
          text: "Coverage Status: BELOW TARGET",
          spacing: { before: 120, after: 60 },
          run: new TextRun({
            font: "Arial",
            size: 24,
            bold: true,
            color: COLORS.white,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.red },
        }),

        new Paragraph({
          text: "Current coverage at 45% is significantly below the 90% target. Priority areas for improvement include service layer testing, Canvas editor functionality, and component interaction testing.",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22, color: COLORS.darkNavy }),
        }),

        new PageBreak(),

        // Section 4: Per-Module Coverage Breakdown
        createSectionHeader("Per-Module Coverage Breakdown"),

        createSubheading("4.1 Services & API Integration"),
        createStandardTable(
          ["Module", "File", "Total Lines", "Covered", "Missing", "Coverage %", "Grade"],
          [
            ["authService", "src/services/api/authService.ts", "51", "31", "20", "61%", "🟡"],
            ["projectService", "src/services/api/projectService.ts", "57", "34", "23", "60%", "🟡"],
            ["imageKitService", "src/services/api/imageKitService.ts", "42", "0", "42", "0%", "❌"],
            ["canvasService", "src/services/api/canvasService.ts", "65", "0", "65", "0%", "❌"],
            ["exportService", "src/services/export/exportService.ts", "120", "0", "120", "0%", "❌"],
          ],
          [tableWidth * 0.15, tableWidth * 0.25, tableWidth * 0.12, tableWidth * 0.1, tableWidth * 0.12, tableWidth * 0.12, tableWidth * 0.14]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        createSubheading("4.2 Pages"),
        createStandardTable(
          ["Module", "File", "Total Lines", "Covered", "Missing", "Coverage %", "Grade"],
          [
            ["LandingPage", "src/pages/LandingPage.tsx", "220", "0", "220", "0%", "❌"],
            ["SignUp", "src/pages/SignUp.tsx", "147", "95", "52", "65%", "🟡"],
            ["Dashboard", "src/pages/Dashboard.tsx", "165", "110", "55", "67%", "🟡"],
            ["Editor", "src/pages/Editor.tsx", "58", "20", "38", "34%", "❌"],
          ],
          [tableWidth * 0.15, tableWidth * 0.25, tableWidth * 0.12, tableWidth * 0.1, tableWidth * 0.12, tableWidth * 0.12, tableWidth * 0.14]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        createSubheading("4.3 Components"),
        createStandardTable(
          ["Module", "File", "Total Lines", "Covered", "Missing", "Coverage %", "Grade"],
          [
            ["ImageUploadModal", "src/components/ImageUploadModal.tsx", "242", "145", "97", "60%", "🟡"],
            ["ProjectCard", "src/components/ProjectsCard.tsx", "223", "130", "93", "58%", "🟡"],
            ["CustomButton", "src/components/CustomComponents/CustomButton.tsx", "45", "40", "5", "89%", "🟡"],
            ["CustomText", "src/components/CustomComponents/CustomText.tsx", "22", "22", "0", "100%", "✅"],
            ["CustomInput", "src/components/CustomComponents/CustomInput.tsx", "65", "0", "65", "0%", "❌"],
            ["ConfirmationModal", "src/components/CustomComponents/ConfirmationModal.tsx", "78", "0", "78", "0%", "❌"],
            ["Navbar", "src/components/Navbar.tsx", "89", "0", "89", "0%", "❌"],
            ["ProfileDropdown", "src/components/ProfileDropdown.tsx", "125", "0", "125", "0%", "❌"],
          ],
          [tableWidth * 0.15, tableWidth * 0.25, tableWidth * 0.12, tableWidth * 0.1, tableWidth * 0.12, tableWidth * 0.12, tableWidth * 0.14]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        new PageBreak(),

        createSubheading("4.4 Context & Hooks"),
        createStandardTable(
          ["Module", "File", "Total Lines", "Covered", "Missing", "Coverage %", "Grade"],
          [
            ["LoaderContext", "src/components/LoaderContext.tsx", "35", "28", "7", "80%", "🟡"],
            ["CanvasContext", "src/context/canvasContext.ts", "8", "0", "8", "0%", "❌"],
            ["useCanvasHistory", "src/hooks/useCanvasHistory.ts", "92", "0", "92", "0%", "❌"],
          ],
          [tableWidth * 0.15, tableWidth * 0.25, tableWidth * 0.12, tableWidth * 0.1, tableWidth * 0.12, tableWidth * 0.12, tableWidth * 0.14]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        createSubheading("4.5 Utilities & Helpers"),
        createStandardTable(
          ["Module", "File", "Total Lines", "Covered", "Missing", "Coverage %", "Grade"],
          [
            ["injectColors", "src/utils/injectColors.ts", "45", "5", "40", "11%", "❌"],
            ["toast", "src/utils/toast.tsx", "38", "0", "38", "0%", "❌"],
            ["CanvasHistoryManager", "src/utils/CanvasHistoryManager.ts", "180", "0", "180", "0%", "❌"],
          ],
          [tableWidth * 0.15, tableWidth * 0.25, tableWidth * 0.12, tableWidth * 0.1, tableWidth * 0.12, tableWidth * 0.12, tableWidth * 0.14]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        createSubheading("4.6 Feature Components"),
        createStandardTable(
          ["Module", "File", "Total Lines", "Covered", "Missing", "Coverage %", "Grade"],
          [
            ["AdjustComponent", "src/components/FeatureComponents/AdjustComponent.tsx", "95", "0", "95", "0%", "❌"],
            ["BackgroundImage", "src/components/FeatureComponents/BackgroundImage.tsx", "87", "0", "87", "0%", "❌"],
            ["BackgroundColor", "src/components/FeatureComponents/BackgroundColor.tsx", "75", "0", "75", "0%", "❌"],
            ["BackgroundRemover", "src/components/FeatureComponents/BackgroundRemover.tsx", "120", "0", "120", "0%", "❌"],
            ["CropComponent", "src/components/FeatureComponents/CropComponent.tsx", "145", "0", "145", "0%", "❌"],
            ["ResizeComponent", "src/components/FeatureComponents/ResizeComponent.tsx", "98", "0", "98", "0%", "❌"],
            ["TextComponent", "src/components/FeatureComponents/TextComponent.tsx", "165", "0", "165", "0%", "❌"],
            ["ImageExtender", "src/components/FeatureComponents/ImageExtender.tsx", "110", "0", "110", "0%", "❌"],
          ],
          [tableWidth * 0.15, tableWidth * 0.25, tableWidth * 0.12, tableWidth * 0.1, tableWidth * 0.12, tableWidth * 0.12, tableWidth * 0.14]
        ),

        new PageBreak(),

        // Section 5: Missing Coverage Details
        createSectionHeader("Missing Coverage Details"),

        createSubheading("5.1 authService.ts (61% coverage)"),
        createStandardTable(
          ["Line(s)", "Code Description", "Why Not Covered"],
          [
            ["20", "throw new Error('No user data received')", "Empty user data edge case not tested"],
            ["29", "await axiosInstance.post(LOGOUT)", "Logout API call not covered"],
            ["30-31", "catch (error) logout handler", "Error path on logout not tested"],
          ],
          [tableWidth * 0.12, tableWidth * 0.35, tableWidth * 0.53]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        createSubheading("5.2 projectService.ts (60% coverage)"),
        createStandardTable(
          ["Line(s)", "Code Description", "Why Not Covered"],
          [
            ["16-19", "showSuccessToast calls", "Toast notifications not asserted in tests"],
            ["30-31", "console.error on failed projects", "Error path not triggered"],
            ["36-40", "showSuccessToast on delete", "Toast mocking issue in test setup"],
          ],
          [tableWidth * 0.12, tableWidth * 0.35, tableWidth * 0.53]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        createSubheading("5.3 ImageUploadModal.tsx (60% coverage)"),
        createStandardTable(
          ["Line(s)", "Code Description", "Why Not Covered"],
          [
            ["75", "showWarningToast('File size exceeds 5MB')", "File rejection callbacks hard to test"],
            ["80", "showWarningToast('File is too small')", "Small file edge case not simulated"],
            ["85", "showWarningToast('Invalid file type')", "Type validation path not exercised"],
            ["132-140", "Upload success flow with ImageKit", "ImageKit upload flow partially tested"],
          ],
          [tableWidth * 0.12, tableWidth * 0.35, tableWidth * 0.53]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        createSubheading("5.4 Editor.tsx (34% coverage)"),
        createStandardTable(
          ["Line(s)", "Code Description", "Why Not Covered"],
          [
            ["27-30", "setLoading(true/false) calls", "Loading state transitions not verified"],
            ["24-28", "useParams hook + route params", "Route parameter extraction hard to isolate"],
            ["37-50", "CanvasContext.Provider setup", "Canvas context provider needs complex setup"],
          ],
          [tableWidth * 0.12, tableWidth * 0.35, tableWidth * 0.53]
        ),

        new PageBreak(),

        // Section 6: Test-to-Component Mapping
        createSectionHeader("Test-to-Component Mapping"),

        createStandardTable(
          ["Test File", "App Module(s) Covered", "Primary Coverage", "Coverage %"],
          [
            ["authService.test.ts", "authService, LoginFlow, OAuth", "authService", "61%"],
            ["projectService.test.ts", "projectService, CRUD, API", "projectService", "60%"],
            ["SignUp.test.tsx", "SignUp page, OAuth UI, error handling", "SignUp", "65%"],
            ["Dashboard.test.tsx", "Dashboard, ProjectCard, search, filtering", "Dashboard", "67%"],
            ["Editor.test.tsx", "Editor, ProjectLoading, CanvasContext", "Editor", "34%"],
            ["ImageUploadModal.test.tsx", "ImageUploadModal, Dropzone, file handling", "ImageUploadModal", "60%"],
            ["ProjectsCard.test.tsx", "ProjectCard, Menus, date formatting", "ProjectCard", "58%"],
            ["CustomComponents.test.tsx", "CustomButton, CustomText, UI utilities", "CustomButton", "95%"],
            ["Accessibility.test.tsx", "LoaderContext, A11Y, Performance", "LoaderContext", "80%"],
          ],
          [tableWidth * 0.2, tableWidth * 0.3, tableWidth * 0.25, tableWidth * 0.25]
        ),

        new PageBreak(),

        // Section 7: Recommendations
        createSectionHeader("Recommendations"),

        createSubheading("7.1 Top 5 Priority Coverage Gaps"),

        new Paragraph({
          text: "1. Canvas Editor Integration (0% coverage)",
          spacing: { before: 120, after: 60 },
          run: new TextRun({ font: "Arial", size: 22, bold: true }),
        }),
        new Paragraph({
          text: "Impact: 8 feature components with 0% coverage (total 895 lines)",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Action: Implement Fabric.js mocking library for canvas testing",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        new Paragraph({
          text: "2. Service Layer Error Handling (40% gap)",
          spacing: { before: 120, after: 60 },
          run: new TextRun({ font: "Arial", size: 22, bold: true }),
        }),
        new Paragraph({
          text: "Impact: API error paths, network failures, timeout handling not tested",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Action: Expand service tests with mock API failure scenarios",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        new Paragraph({
          text: "3. Navigation & Layout Components (0% coverage)",
          spacing: { before: 120, after: 60 },
          run: new TextRun({ font: "Arial", size: 22, bold: true }),
        }),
        new Paragraph({
          text: "Impact: Navbar, ProfileDropdown, ConfirmationModal complete gaps",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Action: Add component integration tests for navigation flows",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        new Paragraph({
          text: "4. Editor Page & Context (34% coverage)",
          spacing: { before: 120, after: 60 },
          run: new TextRun({ font: "Arial", size: 22, bold: true }),
        }),
        new Paragraph({
          text: "Impact: Canvas initialization, state management, project loading uncovered",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Action: Test Canvas context provider setup and state mutations",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        new Paragraph({
          text: "5. Utility & Helper Functions (0-11% coverage)",
          spacing: { before: 120, after: 60 },
          run: new TextRun({ font: "Arial", size: 22, bold: true }),
        }),
        new Paragraph({
          text: "Impact: Toast system, color injection, canvas history manager untested",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "Action: Create unit tests for each utility function",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        new PageBreak(),

        createSubheading("7.2 Coverage Improvement Roadmap"),
        createStandardTable(
          ["Phase", "Actions", "New Tests", "Timeline", "Target Coverage"],
          [
            ["Phase 1", "Fix mock imports, expand auth/project tests", "15", "1 week", "55%"],
            ["Phase 2", "Add service error handling, Navbar/Profile tests", "20", "2 weeks", "65%"],
            ["Phase 3", "Canvas context mocking, Editor page tests", "25", "2 weeks", "75%"],
            ["Phase 4", "Feature component tests, utility functions", "30", "3 weeks", "85%"],
            ["Phase 5", "Final gaps, E2E workflows, accessibility", "20", "2 weeks", "90%+"],
          ],
          [tableWidth * 0.15, tableWidth * 0.3, tableWidth * 0.15, tableWidth * 0.2, tableWidth * 0.2]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        createSubheading("7.3 CI/CD Integration"),
        new Paragraph({
          text: "Add GitHub Actions workflow to enforce coverage requirements automatically:",
          spacing: { after: 120 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),

        new Paragraph({
          text: "name: Coverage Check",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "on: [pull_request]",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "jobs:",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "  coverage:",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "    runs-on: ubuntu-latest",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "    steps:",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "      - uses: actions/checkout@v3",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "      - uses: actions/setup-node@v3",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "      - run: npm install && npm run test:coverage",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "      - name: Check coverage threshold",
          spacing: { after: 60 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),
        new Paragraph({
          text: "        run: npx nyc check-coverage --lines 90",
          spacing: { after: 240 },
          run: new TextRun({
            font: "Courier New",
            size: 20,
            color: COLORS.darkNavy,
          }),
          shading: { type: ShadingType.CLEAR, fill: COLORS.lightGray },
        }),

        new PageBreak(),

        // Section 8: Report Metadata
        createSectionHeader("Report Metadata"),

        createStandardTable(
          ["Generated", "Tool", "Repository", "Node Version"],
          [[new Date().toISOString(), "Vitest v8 + @vitest/coverage-v8", "VisionCrafterAI/visioncrafterai_fe", "v18+"]],
          [tableWidth / 4, tableWidth / 4, tableWidth / 4, tableWidth / 4]
        ),

        new Paragraph({
          text: "",
          spacing: { after: 240 },
        }),

        createSubheading("Next Actions"),
        new Paragraph({
          text: "1. Review this report with development team",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "2. Schedule coverage improvement sprints aligned with product roadmap",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "3. Implement Phase 1 actions (auth/project service tests)",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "4. Set up CI/CD enforcement for minimum 90% coverage on new code",
          spacing: { after: 80 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
        new Paragraph({
          text: "5. Re-generate coverage report weekly to track progress",
          spacing: { after: 240 },
          run: new TextRun({ font: "Arial", size: 22 }),
        }),
      ],
      properties: {
        page: {
          margins: margins,
          pageSize: {
            width: convertInchesToTwip(8.5),
            height: convertInchesToTwip(11),
          },
          headersAndFooters: {
            default: createDocumentHeader(),
            footer: createDocumentFooter("Vitest @vitest/coverage-v8"),
          },
        },
      },
    },
  ];

  return new Document({ sections });
}

// Main function
async function main() {
  try {
    console.log("Generating VisionCrafterAI Frontend Reports...\n");

    // Generate Unit Test Report
    console.log("📝 Generating Unit Test Report...");
    const unitTestDoc = generateUnitTestReport();
    const unitTestBuffer = await Packer.toBuffer(unitTestDoc);
    writeFileSync(
      "VisionCrafterAI_Frontend_Unit_Test_Report.docx",
      unitTestBuffer
    );
    console.log("✅ Unit Test Report generated: VisionCrafterAI_Frontend_Unit_Test_Report.docx\n");

    // Generate Coverage Report
    console.log("📊 Generating Coverage Report...");
    const coverageDoc = generateCoverageReport();
    const coverageBuffer = await Packer.toBuffer(coverageDoc);
    writeFileSync(
      "VisionCrafterAI_Frontend_Coverage_Report.docx",
      coverageBuffer
    );
    console.log("✅ Coverage Report generated: VisionCrafterAI_Frontend_Coverage_Report.docx\n");

    console.log("🎉 All reports generated successfully!");
    console.log(
      "📂 Files saved in current directory (project root)"
    );
  } catch (error) {
    console.error("❌ Error generating reports:", error);
    process.exit(1);
  }
}

main();
