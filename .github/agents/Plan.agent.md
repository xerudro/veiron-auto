---
description: 'Creating a detailed implementation plan before coding - for Level 2+ complexity tasks in VEIRONAUTO'
tools: []
---

# PLAN Mode - GitHub Copilot Chat Instructions

## Purpose
This mode is used for creating detailed implementation plans BEFORE coding begins. It bridges the gap between task identification and actual implementation, ensuring thorough preparation and reducing development friction.

## When to Use PLAN Mode

**ALWAYS use PLAN Mode before coding when:**
- Working on Level 2+ complexity tasks (enhancements, features, or systems)
- Implementing new components or major modifications
- Tasks involve multiple files or complex interactions
- Dependencies between components need clarification
- Architecture decisions are required

**DON'T use PLAN Mode for:**
- Level 1 tasks (simple bug fixes, typo corrections)
- Minor styling adjustments
- Content updates (text, images)
- Documentation-only changes

## Pre-Planning Requirements

Before entering PLAN mode, ensure you have:

1. **Read the Memory Bank context:**
   ```
   - memory-bank/tasks.md (current task list and dependencies)
   - memory-bank/activeContext.md (current development focus)
   - memory-bank/systemPatterns.md (architectural patterns)
   - .github/copilot-instructions.md (project conventions)
   ```

2. **Understand the task complexity level:**
   - Level 2: Simple enhancements (single component, 1-3 files)
   - Level 3: Features (multiple components, integration points)
   - Level 4: Systems (architectural changes, major features)

3. **Check for BLOCKED dependencies:**
   ```bash
   # Use PowerShell to filter blocked tasks
   .\filter-tasks.ps1 -Filter "BLOCKED"
   ```

## Planning Process by Complexity Level

### Level 2: Simple Enhancement Planning

**Template to follow:**
```markdown
# Implementation Plan: [Task Name]

## Overview
- Brief description of the enhancement
- Expected outcome and user impact

## Files to Modify
- List specific files that need changes
- Indicate new files to be created

## Implementation Steps
1. Step-by-step implementation sequence
2. Include validation points
3. Note any order dependencies

## Potential Challenges
- Technical challenges or unknowns
- Integration points to verify
- Browser compatibility considerations

## Testing Strategy
- How to verify the implementation works
- Key functionality to test

## Dependencies
- Prerequisites that must be completed first
- Other tasks that depend on this completion
```

### Level 3-4: Comprehensive Feature/System Planning

**Template to follow:**
```markdown
# Implementation Plan: [Task Name]

## Requirements Analysis
- Detailed functional requirements
- Non-functional requirements (performance, accessibility)
- User experience considerations

## Components Affected
- Existing components to modify
- New components to create
- Integration points between components

## Architecture Considerations
- Design pattern to follow (from systemPatterns.md)
- Data flow and state management
- API endpoints or data structures needed

## Implementation Strategy
- High-level approach and methodology
- Technology choices and rationale
- Progressive enhancement strategy

## Detailed Implementation Steps
### Phase 1: Foundation
- Core infrastructure changes
- Data structure modifications

### Phase 2: Component Development
- Individual component implementation
- Unit testing as you go

### Phase 3: Integration & Polish
- Component integration
- End-to-end testing
- UI/UX refinements

## Dependencies & Integration Points
- Prerequisites from other tasks
- External library integrations
- Cross-component communication

## Challenges & Mitigations
- Identified risks and solutions
- Alternative approaches if primary fails
- Performance or compatibility concerns

## Creative Phase Components
- Components requiring design decisions
- UI/UX elements needing exploration
- Algorithm or architecture choices requiring creative thinking

## Validation Criteria
- Success metrics and testing approach
- User acceptance criteria
- Performance benchmarks
```

## VEIRONAUTO-Specific Planning Considerations

### Multi-Language Support
Always plan for both RO and EN versions:
```markdown
## Multi-Language Implementation
- RO version: [filename-ro.html or filename.html]
- EN version: [filename-en.html] 
- Shared components: [JavaScript, CSS considerations]
- Currency handling: RON (RO) vs EUR (EN) - 5.07x conversion rate
```

### Responsive Design Planning
Follow desktop-first approach:
```markdown
## Responsive Design Strategy
- Desktop implementation (1400px+): [details]
- Tablet adaptation (768-1400px): [modifications needed]
- Mobile adaptation (<768px): [major changes]
- Breakpoints to test: 480px, 768px, 992px, 1200px, 1400px
```

### CSS Variables & Design System
Always plan for consistent design system usage:
```markdown
## Design System Integration
- Colors: Use only CSS Custom Properties from :root
- Primary color: var(--primary-color) #FF4500
- Spacing: Follow 8px base system (4px, 8px, 16px, 24px, 32px, 48px)
- Components: Reuse existing patterns (car-card, btn classes, form-control)
```

### Booking System Integration
For booking-related features:
```markdown
## Booking System Integration
- State management: Global bookingState object
- Step validation: Multi-step wizard pattern
- Pricing: EUR base prices with RON conversion
- Quick booking: URL parameter handling (?quick=1&carId=X)
- Reservation bar: Fixed positioning with footer overlap prevention
```

## Planning Output Requirements

Your planning output MUST include:

1. **Clear implementation strategy** with step-by-step approach
2. **File modification list** with specific paths and purposes  
3. **Dependency identification** and resolution strategy
4. **Testing approach** for validation
5. **Risk assessment** with mitigation strategies
6. **Multi-language considerations** for user-facing features
7. **Responsive design strategy** following desktop-first approach
8. **Creative phase flagging** for components requiring design decisions

## Integration with Memory Bank System

After planning:

1. **Update tasks.md** with the detailed plan
2. **Update activeContext.md** with planning decisions and next steps
3. **Document architectural decisions** in systemPatterns.md if applicable
4. **Flag dependencies** that might BLOCK other tasks

## Next Mode Recommendations

After planning completion:

- **→ CREATIVE Mode**: If components require design exploration, UI/UX decisions, or algorithm design
- **→ IMPLEMENT Mode**: If plan is complete and straightforward implementation is possible
- **→ VAN Mode**: If planning revealed complexity underestimation requiring re-analysis

## Quality Checklist

Before exiting PLAN mode, verify:

- [ ] All requirements clearly understood and documented
- [ ] Implementation steps are specific and actionable
- [ ] Dependencies identified and documented in tasks.md
- [ ] Multi-language and responsive considerations included
- [ ] Design system compliance planned
- [ ] Testing strategy defined
- [ ] Potential challenges identified with solutions
- [ ] Creative phase components flagged appropriately
- [ ] Memory Bank files updated with planning decisions

## Example Planning Session

```
User: "I need to implement the car filtering system for the catalog page"

Plan Mode Response:
1. Analyze task complexity (Level 3 - multiple components)
2. Review existing catalog structure and filtering patterns
3. Create comprehensive plan following Level 3 template
4. Identify creative phase needs (filter UI design)
5. Document plan in tasks.md
6. Recommend → CREATIVE mode for filter UI exploration
```

Remember: Planning time invested upfront prevents implementation problems and ensures consistency with the VEIRONAUTO design system and architecture patterns.
