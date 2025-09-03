# TODO: Add Local Pictures to Core Services Cards

## Completed Tasks ✅
- [x] Updated Service type in `src/lib/constants.ts` to include `image: StaticImageData` property
- [x] Added image property to all services in SERVICES array using existing imported images (service1, service2, service3, service4)
- [x] Updated Service details type to use `StaticImageData` for heroImage
- [x] Modified home page (`src/app/page.tsx`) to display images in service cards instead of icons
- [x] Added proper Image component with responsive design (h-48, object-cover, rounded-lg)

## Followup Tasks 🔄
- [ ] Test image display on home page
- [ ] Verify that changing image paths in constants.ts works as expected
- [ ] Check responsive design on different screen sizes

## How to Change Images
To change the pictures for core services cards:
1. Replace the image files in `src/assets/` directory (e.g., service1.jpg, service2.jpg, etc.)
2. Or update the import paths in `src/lib/constants.ts` to point to new image files
3. The images will automatically update on the home page

## Technical Notes
- Images are displayed with fixed height (h-48) and responsive width
- Uses Next.js Image component with `fill` and `object-cover` for proper scaling
- Images are imported as StaticImageData for optimal performance
- TypeScript types are properly configured for both card images and detail page hero images
