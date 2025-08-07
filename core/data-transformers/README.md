# Product Features Data Structure for BigCommerce

This document outlines how to set up BigCommerce custom fields for the Product Features component in ryddo-catalyst.

## BigCommerce Setup Overview

The Product Features component can use images in two ways:
1. **🎯 Recommended**: Use BigCommerce product images with descriptors (like performance comparison)
2. **🔄 Fallback**: Use direct image URLs

### Image Mapping Approaches

#### **Approach 1: Descriptor Mapping (Recommended)**
- **How it works**: Use unique identifiers in image alt text and reference them in custom fields
- **Example**: Alt text `"S73-RX-RED-lighting"` → Custom field `feature_1_image_descriptor: "S73-RX-RED-lighting"`
- **Advantage**: Explicit mapping, works like performance comparison system

#### **Approach 2: Index Positioning (Alternative)**
- **How it works**: Use image position in gallery (e.g., 3rd image = feature 1)
- **Example**: Upload feature images in specific order, reference by position
- **Advantage**: Simpler setup, but less flexible

## Method 1: BigCommerce Images with Descriptors (Recommended)

### ✅ Advantages of This Method
- **Centralized Image Management**: All images stored in BigCommerce
- **Automatic Optimization**: BigCommerce handles image compression and CDN
- **Consistent URLs**: Images use BigCommerce's optimized URLs
- **Easier Management**: No need to manage external image hosting
- **Better Performance**: Leverages BigCommerce's image optimization

### Custom Fields Setup

For each feature, create these custom fields:

#### Feature 1
- **Field Name**: `feature_1_title`
- **Field Type**: Text
- **Example Value**: `"Headlight & Tail Light"`

- **Field Name**: `feature_1_description`  
- **Field Type**: Text (or Multi-line Text for longer descriptions)
- **Example Value**: `"Stay safe with the Roxim 24E Elite, 600 Lumen LED headlight & the Roxim R3E LED brake light, both hardwired to your bikes battery for long lasting power."`

- **Field Name**: `feature_1_image_descriptor`
- **Field Type**: Text
- **Example Value**: `"S73-RX-RED-lighting"` (unique image identifier)

- **Field Name**: `feature_1_image_alt` (Optional)
- **Field Type**: Text
- **Example Value**: `"Electric bike LED headlight and brake light system"`

### Image Upload Process

1. **Upload Images to BigCommerce**:
   - Go to your product in BigCommerce admin
   - Upload feature images to the product's image gallery
   - Set a **unique identifier** as alt text (e.g., "S73-RX-RED-lighting", "S73-RX-RED-suspension")

2. **Reference Images in Custom Fields**:
   - Use the unique identifier as the value for `feature_n_image_descriptor` fields
   - The system will automatically find and use the matching image by alt text

## Method 2: Direct Image URLs (Fallback)

If you prefer to use external images or can't use the descriptor method:

#### Feature 1 (URL Method)
- **Field Name**: `feature_1_title`
- **Field Type**: Text
- **Example Value**: `"Headlight & Tail Light"`

- **Field Name**: `feature_1_description`  
- **Field Type**: Text
- **Example Value**: `"Stay safe with advanced lighting systems..."`

- **Field Name**: `feature_1_image_url`
- **Field Type**: Text
- **Example Value**: `"https://cdn.example.com/images/features/headlight.jpg"`

- **Field Name**: `feature_1_image_alt` (Optional)
- **Field Type**: Text
- **Example Value**: `"Electric bike LED headlight system"`

#### Feature 2
- **Field Name**: `feature_2_title`
- **Field Type**: Text
- **Example Value**: `"Adjustable Suspension"`

- **Field Name**: `feature_2_description`
- **Field Type**: Text
- **Example Value**: `"Inverted front coil spring fork w/ air assist and rear mono shock; adjustable preload, compression, and rebound damping."`

- **Field Name**: `feature_2_image_url`
- **Field Type**: Text
- **Example Value**: `"https://cdn.example.com/images/features/suspension.jpg"`

- **Field Name**: `feature_2_image_alt` (Optional)
- **Field Type**: Text
- **Example Value**: `"Electric bike adjustable suspension system"`

#### Feature 3
- **Field Name**: `feature_3_title`
- **Field Type**: Text
- **Example Value**: `"Powerful Braking"`

- **Field Name**: `feature_3_description`
- **Field Type**: Text
- **Example Value**: `"Tektro Hydraulic, 4-piston calipers with 203mm front & 180mm rear extra thick 2.8mm rotors offer superior stopping power under heavy use."`

- **Field Name**: `feature_3_image_url`
- **Field Type**: Text
- **Example Value**: `"https://cdn.example.com/images/features/braking.jpg"`

- **Field Name**: `feature_3_image_alt` (Optional)
- **Field Type**: Text
- **Example Value**: `"Electric bike hydraulic disc brake system"`

### Layout Configuration (Optional)

- **Field Name**: `feature_layout_pattern`
- **Field Type**: Text
- **Example Value**: `"normal,reverse,normal"`
- **Description**: Defines the alternating layout pattern. Use "normal" for image-right/text-left, "reverse" for image-left/text-right.
- **Default**: If not provided, defaults to `"normal,reverse,normal"`

## Supported Features

The transformer supports up to **6 features** per product. Simply continue the pattern:
- `feature_4_title`, `feature_4_description`, `feature_4_image_url`, `feature_4_image_alt`
- `feature_5_title`, `feature_5_description`, `feature_5_image_url`, `feature_5_image_alt`
- `feature_6_title`, `feature_6_description`, `feature_6_image_url`, `feature_6_image_alt`

## Image Requirements

### Recommended Image Specifications
- **Aspect Ratio**: 16:9 or 4:3 works best
- **Resolution**: Minimum 800x600px, recommended 1200x800px
- **Format**: JPG, PNG, or WebP
- **File Size**: Keep under 500KB for optimal loading
- **Content**: High-quality product photography showing the specific feature

### Image Hosting Options
1. **BigCommerce CDN**: Upload images to your BigCommerce store's image library
2. **External CDN**: Use services like Cloudinary, AWS S3, etc.
3. **Relative Paths**: `/images/features/feature-name.jpg` (if hosted on your domain)

## Example BigCommerce Setup

### Method 1: Using BigCommerce Images with Descriptors

**Step 1: Upload Images to Product Gallery**
```
Product: "Ryddo Elite E-Bike" - Image Gallery:
├── Image 1: src="https://cdn.bigcommerce.com/.../lighting.jpg", alt="S73-RX-RED-lighting"
├── Image 2: src="https://cdn.bigcommerce.com/.../suspension.jpg", alt="S73-RX-RED-suspension"
├── Image 3: src="https://cdn.bigcommerce.com/.../braking.jpg", alt="S73-RX-RED-braking"
└── ... (other product images)
```

**Step 2: Create Custom Fields**
```
Custom Fields:
├── feature_1_title: "Advanced LED Lighting"
├── feature_1_description: "Premium 600-lumen headlight with integrated brake lights..."
├── feature_1_image_descriptor: "S73-RX-RED-lighting" (matches alt text above)
├── feature_2_title: "Smart Suspension"
├── feature_2_description: "Fully adjustable front and rear suspension..."
├── feature_2_image_descriptor: "S73-RX-RED-suspension" (matches alt text above)
├── feature_3_title: "Regenerative Braking"
├── feature_3_description: "Advanced hydraulic brakes with regenerative technology..."
├── feature_3_image_descriptor: "S73-RX-RED-braking" (matches alt text above)
└── feature_layout_pattern: "normal,reverse,normal"
```

### Method 2: Using Direct URLs (Fallback)

```
Custom Fields:
├── feature_1_title: "Advanced LED Lighting"
├── feature_1_description: "Premium 600-lumen headlight..."
├── feature_1_image_url: "https://cdn.ryddo.com/images/features/elite-lighting.jpg"
├── feature_1_image_alt: "Ryddo Elite LED lighting system"
├── feature_2_title: "Smart Suspension"
├── feature_2_description: "Fully adjustable suspension..."
├── feature_2_image_url: "https://cdn.ryddo.com/images/features/elite-suspension.jpg"
└── ... (continue pattern)
```

## Fallback Behavior

If no custom fields are found, the component will:
1. **Hide completely** - No features section will be displayed
2. **Use defaults** - You can modify the `defaultProductFeatures` in the transformer to show fallback content

## Best Practices

### Content Guidelines
- **Titles**: Keep under 25 characters for best responsive display
- **Descriptions**: Aim for 100-200 characters for optimal readability
- **Features**: Focus on the top 3-4 most important product features
- **Consistency**: Use similar writing style and tone across all features

### Image Guidelines
- **Consistency**: Use similar lighting, background, and style across feature images
- **Focus**: Each image should clearly show the specific feature being described
- **Quality**: Use high-resolution, professional product photography
- **Alt Text**: Always provide descriptive alt text for accessibility

### Performance Considerations
- **Image Optimization**: Compress images and use modern formats (WebP) when possible
- **CDN Usage**: Host images on a CDN for faster loading
- **Lazy Loading**: The component uses Next.js Image component with built-in lazy loading
- **Caching**: BigCommerce custom fields are cached, so changes may take time to reflect

## Troubleshooting

### Features Not Displaying
1. **Check Field Names**: Ensure custom field names match exactly (case-sensitive)
2. **Verify Required Fields**: All three fields (title, description, image_url) must be present
3. **Image URLs**: Ensure image URLs are accessible and return valid images
4. **Product Type**: Features only display on bike and scooter products

### Layout Issues
1. **Layout Pattern**: Check `feature_layout_pattern` field for valid values
2. **Image Dimensions**: Ensure images have consistent aspect ratios
3. **Content Length**: Very long titles or descriptions may cause layout issues

### Performance Issues
1. **Image Size**: Large images can slow page loading
2. **Too Many Features**: Consider limiting to 3-4 features for optimal UX
3. **External Images**: Ensure external image hosts have good performance