# Project Inquiry Components Documentation

This document provides comprehensive documentation for the Project Inquiry form components, including usage examples, API references, and best practices.

## Overview

The Project Inquiry system consists of a main page component and several supporting components that work together to create a comprehensive, accessible, and mobile-friendly form for collecting project information.

## Components

### 1. ProjectInquiryPage.vue

The main page component that orchestrates the entire project inquiry form.

#### Features
- **Comprehensive Form Validation**: Real-time validation with Korean error messages
- **Mobile Responsive**: Optimized for all device sizes
- **Loading States**: Visual feedback during form submission
- **Success States**: Celebration screen after successful submission
- **Accessibility**: Full screen reader and keyboard navigation support

#### Route
```
/project-inquiry
```

#### Usage
```vue
<template>
  <ProjectInquiryPage />
</template>
```

### 2. DateRangeInput.vue

A component for selecting project start and end dates.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | Object | `{ startDate: '', endDate: '' }` | The date range value |
| `error` | String | `''` | Error message to display |

#### Events
| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | Object | Emitted when date range changes |
| `blur` | - | Emitted when input loses focus |

#### Usage
```vue
<template>
  <DateRangeInput 
    v-model="dateRange" 
    :error="errorMessage"
    @blur="validateDates"
  />
</template>

<script>
import { ref } from 'vue'
import DateRangeInput from '@/components/projectComponents/DateRangeInput.vue'

export default {
  components: { DateRangeInput },
  setup() {
    const dateRange = ref({ startDate: '', endDate: '' })
    const errorMessage = ref('')
    
    const validateDates = () => {
      // Validation logic
    }
    
    return { dateRange, errorMessage, validateDates }
  }
}
</script>
```

### 3. PersonnelCounter.vue

A component for selecting the number of personnel needed for the project.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | Number | `6` | The personnel count |
| `min` | Number | `1` | Minimum allowed value |
| `max` | Number | `99` | Maximum allowed value |
| `error` | String | `''` | Error message to display |

#### Events
| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | Number | Emitted when count changes |
| `change` | Number | Emitted when count changes (for validation) |

#### Usage
```vue
<template>
  <PersonnelCounter 
    v-model="personnel" 
    :min="1"
    :max="50"
    :error="errorMessage"
    @change="validatePersonnel"
  />
</template>
```

### 4. TechStackSelector.vue

A component for selecting multiple technologies from a predefined list.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | Array | `[]` | Array of selected technologies |
| `error` | String | `''` | Error message to display |

#### Events
| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | Array | Emitted when selection changes |
| `change` | Array | Emitted when selection changes (for validation) |

#### Technology Options
```javascript
[
  { id: 1, name: 'Flutter & Dart', category: 'mobile' },
  { id: 2, name: 'React Native', category: 'mobile' },
  { id: 3, name: 'Node.js', category: 'backend' },
  { id: 4, name: 'Swift', category: 'mobile' },
  { id: 5, name: 'Python', category: 'backend' },
  { id: 6, name: 'JAVA', category: 'backend' },
  { id: 7, name: 'MySQL', category: 'database' }
]
```

#### Usage
```vue
<template>
  <TechStackSelector 
    v-model="selectedTech" 
    :error="errorMessage"
    @change="validateTechStack"
  />
</template>
```

### 5. FileUploadArea.vue

A component for uploading multiple files with drag & drop support.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | Array | `[]` | Array of uploaded files |
| `maxFileSize` | Number | `5242880` | Maximum file size in bytes (5MB) |
| `error` | String | `''` | Error message to display |

#### Events
| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | Array | Emitted when files change |
| `change` | Array | Emitted when files change (for validation) |

#### Supported File Types
- PDF: `.pdf`
- Word: `.doc`, `.docx`
- PowerPoint: `.ppt`, `.pptx`
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`

#### Features
- **Drag & Drop**: Visual feedback during drag operations
- **File Validation**: Size and type validation
- **Duplicate Detection**: Prevents uploading the same file twice
- **File Preview**: Shows file icons, names, and sizes
- **Batch Operations**: Clear all files at once

#### Usage
```vue
<template>
  <FileUploadArea 
    v-model="files" 
    :max-file-size="10485760"
    :error="errorMessage"
    @change="validateFiles"
  />
</template>
```

## Form Validation

### useFormValidation.js Composable

A comprehensive form validation composable that provides Korean error messages and validation rules.

#### Features
- **Korean Error Messages**: All error messages in Korean
- **Multiple Validation Rules**: Required, length, custom validation
- **Real-time Validation**: Validate on field blur or change
- **Form-level Validation**: Validate entire form before submission

#### Usage
```javascript
import { useFormValidation } from '@/composables/useFormValidation.js'

const {
  errors,
  isSubmitting,
  validateField,
  validateForm,
  hasErrors,
  getError
} = useFormValidation()

// Define validation schema
const validationSchema = {
  projectTitle: [
    'required',
    { minLength: 5 },
    { maxLength: 100 }
  ],
  personnel: ['personnel'],
  techStack: ['techStack']
}

// Validate individual field
validateField('projectTitle', formData.projectTitle, validationSchema.projectTitle)

// Validate entire form
const isValid = validateForm(formData, validationSchema)
```

#### Available Validation Rules

| Rule | Parameters | Description |
|------|------------|-------------|
| `required` | - | Field is required |
| `email` | - | Valid email format |
| `minLength` | number | Minimum character length |
| `maxLength` | number | Maximum character length |
| `personnel` | - | Valid personnel count (1-99) |
| `techStack` | - | At least one technology selected |
| `fileSize` | number | Maximum file size validation |
| `fileType` | array | Allowed file extensions |
| `dateRange` | - | Valid date range (end > start) |

## Styling and Theming

### CSS Custom Properties

The components use CSS custom properties for consistent theming:

```css
:root {
  --www-freemoa-net-pumpkin: #FF7D12;
  --color-orange-57: #FE7C25;
  --color-grey-15: #262626;
  --color-grey-67: #AAA;
  --color-grey-85: #D9D9D9;
  --color-white-solid: #FFF;
  /* ... more variables */
}
```

### Mobile Responsiveness

All components are designed with mobile-first approach:

- **Breakpoints**: 
  - Desktop: > 1200px
  - Tablet: 768px - 1200px
  - Mobile: < 768px
  - Small Mobile: < 480px

- **Responsive Features**:
  - Flexible layouts
  - Touch-friendly controls
  - Optimized typography
  - Proper spacing

### Accessibility Features

- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Support**: Enhanced visibility in high contrast mode
- **Reduced Motion**: Respects user's motion preferences
- **Focus Management**: Clear focus indicators

## Error Handling

### Client-side Validation
- Real-time validation on field blur
- Visual error indicators
- Korean error messages
- Form-level error summary

### File Upload Validation
- File size limits (5MB default)
- File type restrictions
- Duplicate file detection
- Batch validation

### Network Error Handling
- Loading states during submission
- Error messages for failed submissions
- Retry mechanisms

## Performance Optimizations

- **Lazy Loading**: Components load only when needed
- **Debounced Validation**: Prevents excessive validation calls
- **Optimized Re-renders**: Minimal DOM updates
- **File Size Optimization**: Compressed assets

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 74+, Safari 13+, Edge 80+
- **Mobile Browsers**: iOS Safari 13+, Chrome Mobile 80+
- **Polyfills**: None required for supported browsers

## Testing

### Unit Tests
```bash
npm run test:unit
```

### E2E Tests
```bash
npm run test:e2e
```

### Accessibility Tests
```bash
npm run test:a11y
```

## Development Guide

### Local Development
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

### Component Development
1. Create component in `src/components/projectComponents/`
2. Add proper TypeScript/JSDoc comments
3. Include accessibility features
4. Write unit tests
5. Update documentation

## Best Practices

### Component Design
- Use semantic HTML elements
- Include proper ARIA attributes
- Support keyboard navigation
- Provide visual feedback for interactions

### Form Validation
- Validate on field blur, not on every keystroke
- Provide clear, actionable error messages
- Support real-time validation without being intrusive

### Performance
- Use `v-memo` for expensive re-renders
- Implement proper cleanup in composables
- Optimize asset loading

### Accessibility
- Test with screen readers
- Ensure proper color contrast
- Support keyboard-only navigation
- Provide alternative text for images

## Troubleshooting

### Common Issues

1. **Validation not working**
   - Check validation schema syntax
   - Ensure proper event binding
   - Verify composable usage

2. **File upload failures**
   - Check file size limits
   - Verify file type restrictions
   - Test with different file types

3. **Mobile layout issues**
   - Test on real devices
   - Check viewport meta tag
   - Verify CSS media queries

### Debug Mode
Set `NODE_ENV=development` to enable debug logging:

```javascript
console.log('Form validation state:', { errors, isSubmitting })
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure accessibility compliance
5. Update documentation
6. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.
