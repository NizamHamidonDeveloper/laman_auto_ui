# Laman Auto UI

A modern automotive platform built with Next.js, focusing on vehicle management, loan applications, and dealer interactions.

## Landing Page Structure

The landing page is organized in the following directory structure:

```
src/
├── app/
│   └── (main)/
│       └── page.tsx              # Main landing page
│       └── components/
│           ├── Hero.tsx         # Hero section with main CTA
│           ├── Features.tsx     # Key features section
│           ├── VehicleShowcase.tsx  # Featured vehicles display
│           ├── Testimonials.tsx # Customer testimonials
│           ├── HowItWorks.tsx   # Process explanation section
│           └── CTA.tsx          # Call-to-action section
```

### Key Components

1. **Hero Section** (`Hero.tsx`)
   - Main headline and subheadline
   - Search functionality for vehicles
   - Primary call-to-action buttons

2. **Features Section** (`Features.tsx`)
   - Key platform features
   - Benefits for users
   - Visual icons and descriptions

3. **Vehicle Showcase** (`VehicleShowcase.tsx`)
   - Featured vehicles display
   - Filtering options
   - Quick view functionality

4. **Testimonials** (`Testimonials.tsx`)
   - Customer success stories
   - Rating display
   - User feedback

5. **How It Works** (`HowItWorks.tsx`)
   - Step-by-step process explanation
   - Visual guides
   - Interactive elements

6. **Call to Action** (`CTA.tsx`)
   - Secondary conversion points
   - Newsletter signup
   - Contact information

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd laman-auto-ui
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Development Guidelines

### Landing Page Development

1. **Component Structure**
   - Each section is a separate component
   - Components are located in `src/app/(main)/components/`
   - Use TypeScript for type safety

2. **Styling**
   - Uses Tailwind CSS for styling
   - Follow the existing design system
   - Maintain responsive design

3. **Best Practices**
   - Keep components modular and reusable
   - Implement proper error handling
   - Follow accessibility guidelines
   - Optimize images and assets

### Key Files to Focus On

- `src/app/(main)/page.tsx` - Main landing page layout
- `src/app/(main)/components/*` - Individual section components
- `src/types/` - TypeScript type definitions
- `src/lib/` - Utility functions and helpers

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request
4. Ensure all tests pass
5. Update documentation as needed

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide Icons
- Supabase (Backend)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
