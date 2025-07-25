# Portfolio Feature Documentation

## Overview

The Portfolio feature provides a comprehensive personal portfolio page for developers, designers, and other professionals on the platform. It showcases their work experience, skills, projects, and testimonials from colleagues.

## Features

### 1. Portfolio Header
- Profile picture and basic information
- Professional title and handle
- Contact and like functionality
- Social proof with like counter

### 2. Self Introduction
- Editable personal introduction section
- Currently shows placeholder when empty

### 3. Career Timeline
- Visual timeline of work experience
- Company details, positions, and duration
- Interactive markers for different career stages

### 4. Skills Section
- Hard skills with proficiency levels
- Categorized technical competencies
- Visual skill tags with ratings (A, B, C levels)

### 5. Projects Showcase
- Project cards with images and descriptions
- Project badges (achievements, status)
- Role and duration information
- Project statistics

### 6. Team Feedback
- Colleague testimonials and reviews
- Team collaboration feedback
- Time-stamped comments

## Navigation

The portfolio can be accessed via:
- `/portfolio` - Default portfolio (currently jamie's)
- `/portfolio/:userId` - Specific user's portfolio

## Components Structure

```
src/
├── views/
│   └── PortfolioPage.vue           # Main portfolio page
└── components/
    └── portfolio/
        ├── PortfolioHeader.vue     # Header with profile info
        ├── CareerTimeline.vue      # Career experience timeline
        ├── SkillsSection.vue       # Skills and competencies
        ├── ProjectsSection.vue     # Projects showcase
        ├── FeedbackSection.vue     # Team feedback/testimonials
        └── ContactModal.vue        # Contact form modal
```

## Interactive Features

### Contact Functionality
- Contact modal for project proposals
- Form validation and submission
- Email integration ready

### Like System
- Like/unlike portfolio functionality
- Real-time like counter
- Visual feedback with heart animation
- Toast notifications for user feedback
- Persistent like state (API-ready)

### Social Sharing
- LinkedIn sharing with custom title
- Twitter sharing with custom text
- Direct link copying to clipboard
- Dropdown sharing menu
- Toast notifications for sharing feedback
- Responsive sharing interface

### Project Applications
- Portfolio can be submitted when applying to projects
- Integration with project application system
- Portfolio showcases relevant experience

## Responsive Design

The portfolio is fully responsive and includes:
- Desktop-first design (1200px max-width)
- Tablet optimization (768px breakpoint)
- Mobile optimization (480px breakpoint)
- Touch-friendly interactions

## Styling

### CSS Variables
All colors and spacing use CSS custom properties:
- `--color-blue-55: #4F59CA` (Primary brand color)
- `--color-grey-22: #38383A` (Primary text)
- `--color-grey-44: #6F6F72` (Secondary text)
- And more...

### Typography
- Primary font: Inter (for UI elements)
- Secondary font: NanumGothic (for content)
- Consistent font weights and sizes

## API Integration Points

The portfolio is designed to integrate with:

1. **User Profile API** - Fetch user data and portfolio content
2. **Contact API** - Send contact messages to portfolio owners
3. **Like API** - Handle portfolio likes/unlikes
4. **Projects API** - Fetch and display user projects
5. **Feedback API** - Retrieve team feedback and testimonials

## Usage Examples

### Basic Portfolio View
```vue
<template>
  <PortfolioPage :userId="'jamie'" />
</template>
```

### With Custom Data
```vue
<template>
  <PortfolioPage
    :userId="currentUser.id"
    :isOwnProfile="true"
  />
</template>
```

## Future Enhancements

1. **Edit Mode** - Allow portfolio owners to edit their content
2. **Export** - PDF export functionality
3. **Sharing** - Social media sharing integration
4. **Analytics** - Portfolio view statistics
5. **Templates** - Multiple portfolio layout options

## Implementation Notes

- All components use Vue 3 Composition API
- Responsive design with mobile-first approach
- Accessibility features included (semantic HTML, ARIA attributes)
- Performance optimized with lazy loading for images
- SEO-friendly with proper meta tags (when implemented)

## Related Files

- Router configuration: `src/router/index.js`
- Global styles: `src/style.css`
- Header navigation: `src/components/layout/AppHeader.vue`
