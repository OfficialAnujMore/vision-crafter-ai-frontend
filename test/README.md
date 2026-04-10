# VisionCrafterAI Frontend - Testing Documentation

## 📁 Folder Structure

```
test/
├── unit/                              # Unit tests organized by module
│   ├── components/
│   │   ├── CustomComponents/
│   │   │   └── CustomComponents.test.tsx
│   │   ├── ImageUploadModal.test.tsx
│   │   └── ProjectsCard.test.tsx
│   ├── pages/
│   │   ├── Dashboard.test.tsx
│   │   ├── Editor.test.tsx
│   │   └── SignUp.test.tsx
│   └── services/
│       └── api/
│           ├── authService.test.ts
│           └── projectService.test.ts
├── integration/                       # Integration and cross-cutting tests
│   └── Accessibility.test.tsx
├── reports/                           # Generated test and coverage reports
│   ├── VisionCrafterAI_Frontend_Unit_Test_Report.docx
│   ├── VisionCrafterAI_Frontend_Unit_Test_Report.md
│   ├── VisionCrafterAI_Frontend_Coverage_Report.docx
│   └── VisionCrafterAI_Frontend_Coverage_Report.md
├── scripts/                           # Test automation scripts
│   └── generateReports.js            # Generates Word documents from test/coverage data
├── utils/                            # Shared testing utilities
│   ├── setup.ts                      # Vitest setup configuration
│   └── test-utils.tsx                # Custom render functions and test helpers
└── README.md                          # This file
```

## 🧪 Test Files Summary

### Unit Tests

#### Components (3 test files)
| File | Component | Tests |
|------|-----------|-------|
| `unit/components/CustomComponents/CustomComponents.test.tsx` | CustomButton, CustomText | 11 |
| `unit/components/ImageUploadModal.test.tsx` | ImageUploadModal | 13 |
| `unit/components/ProjectsCard.test.tsx` | ProjectCard | 13 |

#### Pages (3 test files)
| File | Page | Tests |
|------|------|-------|
| `unit/pages/SignUp.test.tsx` | SignUp | 6 |
| `unit/pages/Dashboard.test.tsx` | Dashboard | 15 |
| `unit/pages/Editor.test.tsx` | Editor | 8 |

#### Services (2 test files)
| File | Service | Tests |
|------|---------|-------|
| `unit/services/api/authService.test.ts` | authService | 10 |
| `unit/services/api/projectService.test.ts` | projectService | 9 |

### Integration Tests

#### Accessibility & Cross-Cutting (1 test file)
| File | Coverage | Tests |
|------|----------|-------|
| `integration/Accessibility.test.tsx` | A11Y, Performance, LoaderContext | 19 |

**Total: 9 test files with 104 test cases**

## 📊 Reports Overview

### 1. VisionCrafterAI_Frontend_Unit_Test_Report
**Type:** Comprehensive test case documentation
**Contents:**
- 41+ test cases across 8 categories (Render, Auth, Project, ImageKit, Edge Cases, Integration, Performance, Accessibility)
- Test-to-component mapping
- Known issues and coverage gaps
- Recommendations and next steps
- GitHub Actions CI/CD integration template

**Location:** `test/reports/VisionCrafterAI_Frontend_Unit_Test_Report.docx`

### 2. VisionCrafterAI_Frontend_Coverage_Report
**Type:** Detailed code coverage analysis
**Contents:**
- Current coverage: 45% (target: 90%+)
- Per-module breakdown for services, pages, components, context, and utilities
- Missing coverage details with line-by-line analysis
- 5-phase improvement roadmap
- Test-to-component mapping

**Location:** `test/reports/VisionCrafterAI_Frontend_Coverage_Report.docx`

## 🚀 Running Tests

### Install Dependencies
```bash
npm install
```

### Test Commands (from root directory)

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with interactive UI
npm run test:ui
```

### Test Discovery
Tests are automatically discovered from:
- `test/unit/**/*.test.{ts,tsx}`
- `test/integration/**/*.test.{ts,tsx}`

### Configuration
- **Config File:** `vitest.config.ts` (root level)
- **Setup File:** `test/utils/setup.ts`
- **Test Utilities:** `test/utils/test-utils.tsx`

## 📈 Coverage Targets

| Metric | Target | Current |
|--------|--------|---------|
| Lines | 90% | 45% |
| Functions | 90% | ~48% |
| Branches | 85% | ~42% |
| Statements | 90% | 45% |

## 🔄 Generating Reports

The `generateReports.js` script creates both Word documents automatically.

### Run Report Generation
```bash
node test/scripts/generateReports.js
```

### Output
- `test/reports/VisionCrafterAI_Frontend_Unit_Test_Report.docx`
- `test/reports/VisionCrafterAI_Frontend_Coverage_Report.docx`

### Report Styling
- Dark navy (#1F4E79) section headers
- Blue (#2E75B6) underlined subheadings
- Light blue (#BDD7EE) table headers
- Color-coded status cells (green/yellow/red)
- Professional formatting with headers and footers

## 📝 Test Categories

### TC-RENDER (10 tests)
Page and component rendering verification
- SignUp page, Dashboard layout, Custom components
- Empty states and UI element presence

### TC-AUTH (6 tests)
Authentication flow and token management
- Google OAuth integration, localStorage handling
- Login/logout state validation

### TC-PROJ (7 tests)
Project management CRUD operations
- Create, read, update, delete projects
- API error handling

### TC-IMK (5 tests)
ImageKit integration and file uploads
- Upload modal, drag-drop functionality
- File validation and preview

### TC-EDGE (5 tests)
Edge cases and security
- Extreme input sizes, XSS protection
- Malformed data handling

### TC-INT (3 tests)
Integration and workflow testing
- Cross-component interactions
- Full user workflows

### TC-PERF (2 tests)
Performance benchmarking
- Large dataset rendering
- Filter performance

### TC-A11Y (3 tests)
Accessibility compliance
- Keyboard navigation, alt text
- Form label associations

## 🎯 Next Steps

1. **Review Reports:** Open the Word documents to review findings
2. **Phase 1 Coverage:** Fix mock imports in service tests
3. **Expand Tests:** Add authentication and project service tests
4. **Canvas Testing:** Implement Fabric.js mocking for editor features
5. **CI/CD Setup:** Configure GitHub Actions for automated coverage checks

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Test Utilities Guide](./utils/test-utils.tsx)
- [Setup Configuration](./utils/setup.ts)

## 🤝 Contributing

When adding new tests:

1. **Place tests in correct location:**
   - Component tests → `test/unit/components/`
   - Page tests → `test/unit/pages/`
   - Service tests → `test/unit/services/`
   - Integration tests → `test/integration/`

2. **Use testing utilities** from `test/utils/test-utils.tsx`

3. **Follow naming conventions:**
   - Test files: `ComponentName.test.tsx` or `service.test.ts`
   - Test cases: Use category prefixes (TC-RENDER-001, TC-AUTH-001, etc.)

4. **Ensure tests pass:**
   ```bash
   npm run test:run
   ```

5. **Check coverage impact:**
   ```bash
   npm run test:coverage
   ```

6. **Aim for 90%+ coverage** on new code

## 📊 File Organization Benefits

✅ **Centralized Testing** - All tests in one location
✅ **Clear Structure** - Unit vs Integration tests separated
✅ **Easy Navigation** - Mirror structure helps find related tests
✅ **Shared Utilities** - Common setup and helpers in `test/utils/`
✅ **Automated Reporting** - Scripts and reports co-located with tests

---

**Last Updated:** 2026-04-10
**Test Framework:** Vitest 4.1.4
**Coverage Tool:** @vitest/coverage-v8
**Total Test Files:** 9
**Total Test Cases:** 104

