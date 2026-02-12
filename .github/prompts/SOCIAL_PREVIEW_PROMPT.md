# Social Preview Image Generation Prompt

## Image Specifications
- **Dimensions**: 1280×640px (2:1 aspect ratio)
- **Format**: PNG or JPG
- **Purpose**: GitHub repository social preview card

---

## Comprehensive Image Generation Prompt

Create a professional, modern social preview image for a GitHub repository with the following specifications:

### Layout & Composition (1280×640px)

**Background:**
- Deep gradient background transitioning from dark blue (#0F1419) on the left to dark purple (#1E1B4B) on the right
- Subtle grid pattern overlay suggesting data/analytics, very low opacity (5-10%)
- Soft glow effects around key elements to add depth

**Main Elements:**

1. **Title Section (Top-Center, with safe margins):**
   - **Important**: Keep 80px margin from all edges to avoid truncation on social media platforms
   - Position: Centered horizontally in upper third of image (Y: ~120px from top)
   - Text: "Advanced Audit History"
   - Font: Bold, modern sans-serif (similar to Inter or Segoe UI)
   - Color: White (#FFFFFF)
   - Size: Large, prominent (~64px equivalent)
   - Subtext: "PCF Control"
   - Subtext color: Light blue (#60A5FA)
   - Subtext size: ~32px equivalent
   - Alignment: Center-aligned for better visibility across platforms

2. **Visual Centerpiece (Center, below title):**
   - Position: Centered horizontally, Y: ~280px from top
   - Floating 3D mockup of a modern dashboard interface showing:
     - Timeline visualization with nodes and connecting lines
     - Bar charts showing audit activity
     - Data cards with icons
   - Glass morphism effect (semi-transparent, frosted glass look)
   - Subtle shadow and depth
   - Size: ~600×280px to ensure visibility
   - Color scheme: Blues (#3B82F6, #60A5FA), purples (#8B5CF6), with white accents

3. **Feature Icons (Bottom-Center-Left, arranged horizontally):**
   - Position: X: ~150px from left, Y: ~560px from top (80px from bottom)
   - 4-5 small circular icons representing key features:
     - 📊 Analytics dashboard icon
     - 🔍 Search/filter icon
     - 📥 Export icon
     - 🔔 Notification bell icon
     - 🔐 Security shield icon
   - Each icon in a circular container with gradient border
   - Size: ~40px circles
   - Spacing: 16px between icons
   - Semi-transparent glow effect

4. **Technology Badges (Bottom-Center-Right, arranged horizontally):**
   - Position: X: ~780px from left, Y: ~560px from top (80px from bottom)
   - Small rounded rectangle badges showing:
     - "Power Platform" badge - Microsoft blue (#00A4EF)
     - "TypeScript" badge - TypeScript blue (#3178C6)
     - "React" badge - React cyan (#61DAFB)
   - Each badge: rounded corners, solid fill, white text
   - Size: ~100×28px each
   - Spacing: 8px between badges

5. **Accent Elements:**
   - Subtle geometric shapes in background (circles, hexagons) at very low opacity
   - Particle effects or dots scattered around the dashboard mockup suggesting data flow
   - Gradient orb in top-right corner (purple/blue gradient, 15% opacity, large ~400px)
   - Ensure all decorative elements have 60px minimum margin from edges

6. **Footer Text (Bottom, centered):**
   - Small text: "Enterprise-grade audit management for Dynamics 365 & Power Platform"
   - Font: Regular sans-serif
   - Color: Light gray (#94A3B8)
   - Size: ~18px equivalent

### Style Guidelines:
- **Overall aesthetic**: Modern, professional, tech-focused, enterprise software
- **Color palette**: 
  - Primary: Blues (#3B82F6, #60A5FA, #DBEAFE)
  - Secondary: Purples (#8B5CF6, #A78BFA)
  - Accent: White (#FFFFFF), Light gray (#94A3B8)
  - Background: Dark blue-purple gradient (#0F1419 → #1E1B4B)
- **Design style**: Glass morphism, depth with shadows, subtle animations feeling (static image but designed to look dynamic)
- **Typography**: Clean, modern, high contrast for readability
- **Spacing**: Generous padding, not cluttered
- **Effects**: Subtle glows, soft shadows, transparency, gradients

### Technical Details for AI Generation:

```
A professional GitHub social preview card (1280x640px) for "Advanced Audit History PCF Control". 

IMPORTANT: Keep 80px safe margins from all edges to prevent truncation on social platforms.

Background: Deep blue to purple gradient (#0F1419 to #1E1B4B) with subtle grid pattern and large purple-blue gradient orb in top-right corner.

Top-center (120px from top): Bold white centered text "Advanced Audit History" (64px) with light blue subtext "PCF Control" (32px) underneath, both center-aligned.

Center (280px from top): Large 3D isometric dashboard mockup (600x280px) with glass morphism effect showing an interactive timeline with connected nodes, bar charts, and data cards in blues and purples. Floating particles around it suggesting data flow. Centered horizontally.

Bottom area (80px from bottom edge):
- Left side: 5 circular icons (40px each) with glowing edges showing analytics, search, export, notification, and security symbols
- Center: Small gray text "Enterprise-grade audit management for Dynamics 365 & Power Platform"
- Right side: Three technology badges showing "Power Platform", "TypeScript", and "React" in their brand colors

Style: Modern tech interface, glass morphism, depth with shadows, professional enterprise software aesthetic, clean and not cluttered, all elements properly spaced with safe margins.
```

---

## Alternative Simplified Prompt (For Quick Generation):

```
Create a 1280x640px GitHub repository social preview image with 80px safe margins from all edges. Dark blue-purple gradient background. Top-center has large white centered text "Advanced Audit History" (64px) with blue subtext "PCF Control" (32px). Center shows a modern 3D dashboard mockup (600x280px) with timeline charts and analytics in blue and purple tones with glass effect. Bottom has circular feature icons on left, descriptive text in center, and tech badges ("Power Platform", "TypeScript", "React") on right. Professional, modern, enterprise software style with subtle glow effects. All text and elements centered with proper spacing.
```

---

## Tools You Can Use:
1. **DALL-E 3** - Use the comprehensive prompt
2. **Midjourney** - Use the comprehensive prompt with `/imagine` command
3. **Stable Diffusion** - Use the technical details section
4. **Figma/Canva** - Use the layout specifications to design manually
5. **Adobe Firefly** - Use the comprehensive prompt

---

## Post-Generation Steps:
1. Generate the image using the prompt above
2. Save as PNG format
3. Verify dimensions are exactly 1280×640px
4. Upload to GitHub repository settings:
   - Go to repository Settings
   - Scroll to "Social preview"
   - Click "Edit" and upload the image
5. Verify preview appears correctly when sharing repository link

---

## Example File Name:
`social-preview-1280x640.png`
