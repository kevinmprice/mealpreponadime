const https = require('https');
const fs = require('fs');
const path = require('path');

// Cloudinary config
const CLOUD_NAME = 'dym2t17hd';
const UPLOAD_PRESET = 'ml_default';

// Pin templates
const templates = {
  // Style 1: Bold Text Overlay - dark gradient with big text at bottom
  boldOverlay: (imageUrl, headline, badge) => {
    const encodedHeadline = encodeURIComponent(headline);
    const encodedBadge = badge ? encodeURIComponent(badge) : '';
    
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/w_1000,h_1500,c_fill,g_center/` +
      `l_fetch:${Buffer.from(imageUrl).toString('base64')},w_1000,h_1500,c_fill/` +
      `e_gradient_fade,y_0.7/` +
      `l_text:Arial_70_bold:${encodedHeadline},co_white,w_900,c_fit,g_south_west,x_50,y_100/` +
      (badge ? `l_text:Arial_32_bold:${encodedBadge},co_white,g_south_west,x_50,y_280,bo_4px_solid_rgb:22c55e,b_rgb:22c55e,r_30/` : '') +
      `${CLOUD_NAME}/sample`;
  },
  
  // Style 2: White Card Overlay - white card at bottom
  whiteCard: (imageUrl, headline, subtitle, cta) => {
    const encodedHeadline = encodeURIComponent(headline);
    const encodedSubtitle = subtitle ? encodeURIComponent(subtitle) : '';
    const encodedCta = cta ? encodeURIComponent(cta) : '';
    
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/w_1000,h_1500,c_fill,g_center/` +
      `l_fetch:${Buffer.from(imageUrl).toString('base64')},w_1000,h_1500,c_fill/` +
      // White card background at bottom
      `l_text:Arial_1_bold:%20,co_white,b_white,w_900,h_350,g_south,y_30,r_20/` +
      // Headline
      `l_text:Arial_52_bold:${encodedHeadline},co_rgb:1a1a1a,w_850,c_fit,g_south,y_200/` +
      // Subtitle
      (subtitle ? `l_text:Arial_28:${encodedSubtitle},co_rgb:666666,w_850,c_fit,g_south,y_120/` : '') +
      // CTA button
      (cta ? `l_text:Arial_24_bold:${encodedCta},co_white,b_rgb:e11d48,r_30,g_south,y_50/` : '') +
      `${CLOUD_NAME}/sample`;
  }
};

// Blog posts data
const posts = [
  {
    slug: 'meal-prep-beginners-guide',
    title: 'Meal Prep 101',
    pins: [
      { 
        template: 'boldOverlay',
        headline: 'Meal Prep 101: Complete Beginner Guide',
        badge: '2 HOUR PREP',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
      },
      {
        template: 'whiteCard',
        headline: 'How to Start Meal Prepping',
        subtitle: 'Save time & money with this step-by-step guide',
        cta: 'GET THE GUIDE →',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200'
      }
    ]
  },
  {
    slug: '25-dollar-weekly-meal-prep-plan',
    title: '$25 Weekly Plan',
    pins: [
      {
        template: 'boldOverlay',
        headline: '$25 Weekly Meal Prep Plan',
        badge: '$1.67 PER MEAL',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
      },
      {
        template: 'whiteCard',
        headline: 'Eat Well for $25/Week',
        subtitle: 'Complete meal plan with shopping list',
        cta: 'GET THE PLAN →',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200'
      },
      {
        template: 'boldOverlay',
        headline: 'How I Eat for Under $4/Day',
        badge: 'BUDGET MEAL PREP',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200'
      }
    ]
  },
  {
    slug: '50-dollar-weekly-meal-prep-plan',
    title: '$50 Weekly Plan',
    pins: [
      {
        template: 'boldOverlay',
        headline: '$50 Weekly Meal Prep',
        badge: '21 MEALS + SNACKS',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200'
      },
      {
        template: 'whiteCard',
        headline: 'The $50 Meal Plan',
        subtitle: 'Balanced meals without breaking the bank',
        cta: 'SEE THE PLAN →',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200'
      }
    ]
  },
  {
    slug: 'best-meal-prep-containers-2026',
    title: 'Best Containers',
    pins: [
      {
        template: 'boldOverlay',
        headline: 'Best Meal Prep Containers 2026',
        badge: 'WE TESTED 15 BRANDS',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200'
      },
      {
        template: 'whiteCard',
        headline: 'The Best Meal Prep Containers',
        subtitle: 'Tested & ranked — here\'s what actually works',
        cta: 'SEE THE WINNERS →',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200'
      }
    ]
  },
  {
    slug: '15-cheap-meal-prep-recipes-under-2-dollars',
    title: '15 Cheap Recipes',
    pins: [
      {
        template: 'boldOverlay',
        headline: '15 Meals Under $2 Each',
        badge: 'BUDGET RECIPES',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
      },
      {
        template: 'whiteCard',
        headline: '15 Cheap Meal Prep Recipes',
        subtitle: 'Every recipe under $2 per serving',
        cta: 'GET THE RECIPES →',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200'
      },
      {
        template: 'boldOverlay',
        headline: 'Cheap Meals That Actually Taste Good',
        badge: 'UNDER $2/SERVING',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200'
      }
    ]
  }
];

// Simple URL-based pin generation (Cloudinary transformation URLs)
function generatePinUrl(pin) {
  const baseUrl = pin.image;
  
  // For now, return the base image - we'll enhance with overlays
  // In production, use Cloudinary's URL-based transformations
  return baseUrl;
}

// Generate pins data
const pinsData = [];
let pinId = 1;

posts.forEach(post => {
  post.pins.forEach((pin, index) => {
    pinsData.push({
      id: `pin_${String(pinId).padStart(3, '0')}`,
      postSlug: post.slug,
      postTitle: post.title,
      template: pin.template,
      headline: pin.headline,
      badge: pin.badge || null,
      subtitle: pin.subtitle || null,
      cta: pin.cta || null,
      sourceImage: pin.image,
      destinationUrl: `https://mealpreponadime.com/blog/${post.slug}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    pinId++;
  });
});

// Save pins data
const outputPath = path.join(__dirname, 'pins-data.json');
fs.writeFileSync(outputPath, JSON.stringify(pinsData, null, 2));

console.log(`Generated ${pinsData.length} pins for ${posts.length} posts`);
console.log(`Data saved to: ${outputPath}`);

// Output summary
console.log('\n📌 Pin Summary:');
posts.forEach(post => {
  const postPins = pinsData.filter(p => p.postSlug === post.slug);
  console.log(`  ${post.title}: ${postPins.length} pins`);
});
