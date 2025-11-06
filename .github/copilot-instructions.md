# VEIRONAUTO - AI Coding Agent Instructions

## Project Overview
VEIRONAUTO is a multi-language (RO/EN) car rental platform with a sophisticated Memory Bank workflow system. This is NOT a typical web project - it's a frontend-focused application with automated task management and complex development workflows.

### Architecture Components
- **Frontend**: `public_html/` - Multi-language HTML/CSS/JS with UIkit framework
- **Backend**: `app/` - PHP/MariaDB (currently excluded from active development)  
- **Memory Bank**: `memory-bank/` - Central workflow and task management system
- **Workflow Automation**: PowerShell scripts for progress tracking and batch operations
- **Custom Development Modes**: Specialized AI modes via `custom_modes/` directory

## Essential Workflow System

### Memory Bank Structure (CRITICAL)
The `memory-bank/` directory is the project's neural center:
- `tasks.md` & `todo.md` - Task tracking with dependency management and BLOCKED status
- `progress.md` - Automated progress calculation (updated by PowerShell scripts)
- `activeContext.md` - Current development focus and recent decisions
- `systemPatterns.md` - Architectural patterns and technical decisions
- `solution-log.md` - Debug fixes and solutions (ALWAYS document fixes here)

### Task Management Patterns
```powershell
# Progress updates (run after completing tasks)
.\update-progress.ps1

# Batch task completion
.\update-tasks.ps1 -Batch "Create booking.js,Create home.css"

# Automatic BLOCKED marking for unresolved dependencies
.\update-tasks.ps1
```

### Development Modes System
This project uses specialized development modes via `custom_modes/`:
- **VAN**: Project initialization and complexity analysis (`van_instructions.md`)
- **PLAN**: Detailed implementation planning (`plan_instructions.md`)
- **CREATIVE**: Design exploration for complex components (`creative_instructions.md`) 
- **IMPLEMENT**: Systematic build process (`implement_instructions.md`)
- **QA/REFLECT**: Validation and documentation

**Usage**: Activate modes by referencing the instruction files before starting work phases.

## Critical Conventions

### File Organization
- Multi-language files follow pattern: `index-ro.html` / `index-en.html`
- Assets structured: `public_html/assets/{css,js,images,json,libs}/`
- CSS organized: `css/{pages/,common/,components/,themes/}` with dedicated files per component
- JS organized: `js/{core/,components/,pages/}` with page-specific scripts
- Dependencies tracked explicitly in task files (🔴 BLOCKED, 🟢 independent)

### Task Dependency System
```markdown
## Taskuri BLOCKER (🔴)
- Create base.css with CSS variables [depende de directory structure]
- Create layout.css [depende de base.css]
```

### Solution Documentation (MANDATORY)
When fixing bugs, document in `memory-bank/solution-log.md`:
```markdown
> Problem: Quick booking button crash in booking-en.html
> Old Code: updateStepDisplay() called before DOM ready
> New Code: Moved initialization after DOM load
> Files: booking-en.js, booking-en.html
```

## Key Automation Scripts
- `update-progress.ps1` - Calculates progress from [x] marked tasks and generates daily logs
- `update-tasks.ps1` - Batch task completion and automatic BLOCKED marking for dependencies
- `filter-tasks.ps1` - Show BLOCKED or independent tasks for focused work
- `check-files.ps1` - Verify physical file existence against task requirements
- `ONBOARDING.ps1` - Quick setup guide for new contributors

## Tech Stack Specifics
- **Frontend Framework**: UIkit (not Bootstrap/Tailwind) - planned integration
- **Languages**: Vanilla HTML/CSS/JS (avoid modern frameworks)
- **Styling**: Component-based CSS with CSS variables (desktop-first approach)
- **Multi-language**: Separate HTML files, shared JS translation system
- **Backend**: PHP/MariaDB (minimal current involvement)

## Critical Design System Rules
- **Colors**: ALL colors MUST use CSS Custom Properties from `:root` - never hardcode colors
- **Primary Color**: `--primary-color: #FF4500` (orangered brand color)
- **Layout**: Desktop-first responsive design (not mobile-first)
- **Typography**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Spacing**: 8px base system (4px, 8px, 16px, 24px, 32px, 48px)
- **Breakpoints**: 480px, 768px, 992px, 1200px, 1400px (desktop-first)

## Development Workflow
1. Check `memory-bank/tasks.md` for current priorities and BLOCKED items
2. Use dependency filtering to find actionable tasks
3. Document all fixes in `solution-log.md` 
4. Run progress scripts after completing work
5. Update `activeContext.md` when changing focus areas

## Common Pitfalls
- Don't ignore the dependency system - tasks have explicit prerequisites
- Always run PowerShell scripts after task completion for accurate progress
- Multi-language support requires parallel file creation (RO then EN typically)
- Solution documentation is mandatory, not optional
- The Memory Bank system is central to productivity - don't bypass it

## Critical Patterns from Design Guide
- **Component Pattern**: Car cards use dark gradient background with white image containers
- **Responsive Grid**: 4 → 3 → 2 → 1 columns (desktop to mobile)
- **Booking Flow**: Multi-step wizard with state management and reservation bar
- **Quick Booking Mode**: URL pattern `booking.html?quick=1&carId=X` skips car selection
- **Language/Currency Pairing**: RO pages show RON prices, EN pages show EUR prices
- **Footer Overlap Prevention**: Reservation bar adjusts position to avoid covering footer

## Key Code Patterns
- **JavaScript Structure**: Always cache DOM elements, use try-catch for critical functions, validate inputs
- **CSS Variables**: Use `:root` variables for all colors, spacing, and shared values
- **Error Handling**: Document solutions in `memory-bank/solution-log.md` with before/after code
- **Responsive**: Desktop-first CSS with `@media (max-width: Xpx)` breakpoints
- **Multi-language**: File naming `page-ro.html` / `page-en.html`, currency conversion EUR→RON (5.07x)
- **Booking State**: Global `bookingState` object manages multi-step flow and pricing calculations

[byterover-mcp]
You are given two tools from Byterover MCP server, including
## 1. `byterover-store-knowledge`
You `MUST` always use this tool when:
+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques  
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

## 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:
+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase

## Important Notes
Always check the directory structure and file naming conventions before creating or modifying files. Adhering to the established patterns is crucial for maintaining project consistency and ensuring smooth workflow automation and task tracking.
Always check directories you are working in to ensure that the file you edit was not previously created. 
Additionally, be mindful of the task dependency system and ensure that any changes you make do not inadvertently break existing functionality.

The frontend folder is `public_html/` and the backend folder is `app/`. The backend is currently excluded from active development, so focus primarily on the frontend and memory-bank directories.
