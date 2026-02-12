const https = require('https');
const fs = require('fs');

// API Keys
const LEONARDO_KEY = '55146e28-dd18-4358-b4aa-dda52cc57209';
const PLACID_KEY = 'placid-yyilpbue6aolulzj-lbdgk6uceincqhep';

// Placid Templates
const TEMPLATES = [
  { uuid: 'jtquma1nyyrzl', name: 'Pinterest-y' },
  { uuid: '9oomd8dqdoalt', name: 'Wild' },
  { uuid: '902hhhlczodjr', name: 'Plain' },
  { uuid: 'u5f25yyein3uv', name: 'Whimsical' }
];

// Blog posts with metadata
const BLOG_POSTS = [
  {
    slug: 'meal-prep-beginners-guide',
    url: 'https://www.mealpreponadime.com/blog/meal-prep-beginners-guide',
    topic: 'Meal prep beginner guide with organized containers and fresh ingredients',
    titles: [
      "Meal Prep 101: Start Here",
      "Beginner's Guide to Meal Prep",
      "How to Meal Prep (Complete Guide)",
      "Meal Prep for Beginners",
      "The Ultimate Meal Prep Guide"
    ],
    boards: ['Meal Prep Recipes', 'Meal Prep Tips & Hacks'],
    description: "Learn how to meal prep like a pro! This complete guide covers planning, shopping, cooking, and storage tips to save time and money every week."
  },
  {
    slug: '15-cheap-meal-prep-recipes-under-2-dollars',
    url: 'https://www.mealpreponadime.com/blog/15-cheap-meal-prep-recipes-under-2-dollars',
    topic: 'Budget meal prep containers with chicken rice bowls and affordable ingredients',
    titles: [
      "15 Meals Under $2 Each",
      "Cheap Meal Prep Recipes",
      "Budget Meals That Actually Taste Good",
      "Eat Well for $2 Per Meal",
      "15 Affordable Meal Prep Ideas"
    ],
    boards: ['Budget Meals Under $5', 'Meal Prep Recipes'],
    description: "Every recipe costs less than $2 per serving! 15 delicious, budget-friendly meal prep recipes that prove eating cheap doesn't mean eating boring."
  },
  {
    slug: '25-dollar-weekly-meal-prep-plan',
    url: 'https://www.mealpreponadime.com/blog/25-dollar-weekly-meal-prep-plan',
    topic: 'Weekly meal prep spread with groceries and containers showing $25 budget meals',
    titles: [
      "$25 Weekly Meal Plan",
      "Feed Yourself for $25/Week",
      "The $25 Meal Prep Challenge",
      "Eat for a Week on $25",
      "Ultra Budget Meal Prep Plan"
    ],
    boards: ['Budget Meals Under $5', 'Meal Prep Recipes'],
    description: "Feed yourself for an entire week on just $25! Complete meal plan with shopping list, recipes, and step-by-step prep instructions."
  },
  {
    slug: '50-dollar-weekly-meal-prep-plan',
    url: 'https://www.mealpreponadime.com/blog/50-dollar-weekly-meal-prep-plan',
    topic: 'Colorful weekly meal prep with variety of proteins vegetables and grains in containers',
    titles: [
      "$50 Weekly Meal Plan",
      "Balanced Meals for $50/Week",
      "The $50 Meal Prep Plan",
      "Eat Great for $50 a Week",
      "Our Most Popular Meal Plan"
    ],
    boards: ['Meal Prep Recipes', 'Healthy Meal Prep'],
    description: "Our most popular meal plan! $50 gets you a full week of varied, delicious meals with more protein options and fresh vegetables."
  },
  {
    slug: 'best-meal-prep-containers-2026',
    url: 'https://www.mealpreponadime.com/blog/best-meal-prep-containers-2026',
    topic: 'Various meal prep containers glass and plastic organized on kitchen counter',
    titles: [
      "Best Meal Prep Containers 2026",
      "Top Meal Prep Containers Tested",
      "We Tested 15 Container Brands",
      "Best Containers for Meal Prep",
      "Meal Prep Container Guide"
    ],
    boards: ['Meal Prep Tips & Hacks', 'Grocery Hauls & Shopping Tips'],
    description: "After testing 15 container sets for leaks, durability, and microwave safety, here are the best meal prep containers for every budget."
  }
];

// Helper: Make HTTPS request
function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Generate Leonardo image
async function generateLeonardoImage(prompt, variation) {
  console.log(`  🎨 Generating Leonardo image (variation ${variation})...`);
  
  const fullPrompt = `${prompt}, style variation ${variation}, food photography, bright natural lighting, appetizing, professional quality, overhead shot`;
  
  const postData = JSON.stringify({
    prompt: fullPrompt,
    modelId: '6b645e3a-d64f-4341-a6d8-7a3690fbf042',
    width: 1024,
    height: 1536,
    num_images: 1
  });

  const options = {
    hostname: 'cloud.leonardo.ai',
    path: '/api/rest/v1/generations',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LEONARDO_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const result = await request(options, postData);
  const generationId = result.sdGenerationJob?.generationId;
  
  if (!generationId) {
    console.log('  ❌ Failed to start Leonardo generation:', result);
    return null;
  }

  // Poll for completion (up to 60 seconds)
  for (let i = 0; i < 12; i++) {
    await sleep(5000);
    
    const getOptions = {
      hostname: 'cloud.leonardo.ai',
      path: `/api/rest/v1/generations/${generationId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${LEONARDO_KEY}` }
    };

    const imageResult = await request(getOptions);
    const imageUrl = imageResult.generations_by_pk?.generated_images?.[0]?.url;
    
    if (imageUrl) {
      console.log(`  ✅ Leonardo image ready`);
      return imageUrl;
    }
  }
  
  console.log('  ❌ Leonardo timeout');
  return null;
}

// Generate Placid pin
async function generatePlacidPin(template, imageUrl, title) {
  console.log(`  📌 Creating Placid pin (${template.name})...`);
  
  let layers = {};
  
  // Map layers based on template
  if (template.name === 'Pinterest-y') {
    layers = {
      'img': { image: imageUrl },
      'cta-bg': { color: '#22c55e' },
      'cta-text': { text: 'GET RECIPE' },
      'title': { text: title }
    };
  } else if (template.name === 'Wild') {
    layers = {
      'bg-img': { image: imageUrl },
      'title': { text: title },
      'subline': { text: 'Budget-Friendly Recipes' },
      'url': { text: 'MealPrepOnADime.com' }
    };
  } else if (template.name === 'Plain') {
    layers = {
      'img': { image: imageUrl },
      'title': { text: title },
      'subline': { text: 'MealPrepOnADime.com' }
    };
  } else if (template.name === 'Whimsical') {
    layers = {
      'img': { image: imageUrl },
      'title': { text: title },
      'url': { text: 'MealPrepOnADime.com' }
    };
  }

  const postData = JSON.stringify({
    template_uuid: template.uuid,
    layers: layers
  });

  const options = {
    hostname: 'api.placid.app',
    path: '/api/rest/images',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PLACID_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const result = await request(options, postData);
  const imageId = result.id;
  
  if (!imageId) {
    console.log('  ❌ Failed to create Placid pin:', result);
    return null;
  }

  // Poll for completion (up to 30 seconds)
  for (let i = 0; i < 6; i++) {
    await sleep(5000);
    
    const getOptions = {
      hostname: 'api.placid.app',
      path: `/api/rest/images/${imageId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${PLACID_KEY}` }
    };

    const pinResult = await request(getOptions);
    
    if (pinResult.status === 'finished' && pinResult.image_url) {
      console.log(`  ✅ Placid pin ready`);
      return pinResult.image_url;
    }
  }
  
  console.log('  ❌ Placid timeout');
  return null;
}

// Main function
async function main() {
  console.log('🚀 Starting bulk pin generation (25 pins)...\n');
  console.log('⏱️  Estimated time: 15-20 minutes\n');
  
  const allPins = [];
  let pinCount = 0;
  let templateIndex = 0;

  for (const post of BLOG_POSTS) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📝 Blog: ${post.slug}`);
    console.log(`${'='.repeat(50)}`);

    for (let i = 0; i < 5; i++) {
      pinCount++;
      const template = TEMPLATES[templateIndex % TEMPLATES.length];
      templateIndex++;
      
      console.log(`\n🔢 Pin ${pinCount}/25: "${post.titles[i]}"`);
      
      // Generate unique Leonardo image
      const leonardoUrl = await generateLeonardoImage(post.topic, i + 1);
      
      if (!leonardoUrl) {
        console.log('  ⚠️  Skipping - Leonardo failed');
        continue;
      }

      // Generate Placid pin
      const pinUrl = await generatePlacidPin(template, leonardoUrl, post.titles[i]);

      if (!pinUrl) {
        console.log('  ⚠️  Skipping - Placid failed');
        continue;
      }

      // Add to results
      allPins.push({
        imageUrl: pinUrl,
        title: post.titles[i],
        description: post.description,
        destinationUrl: post.url,
        board: post.boards[i % post.boards.length],
        template: template.name
      });

      console.log(`  🎉 Pin ${pinCount} DONE!`);
    }
  }

  // Generate Tailwind CSV
  console.log('\n\n📄 Generating Tailwind CSV...');
  
  const csvHeader = 'Image URL,Title,Description,Link,Board';
  const csvRows = allPins.map(pin => 
    `"${pin.imageUrl}","${pin.title}","${pin.description.replace(/"/g, '""')}","${pin.destinationUrl}","${pin.board}"`
  );
  
  const csvContent = [csvHeader, ...csvRows].join('\n');
  
  fs.writeFileSync('/Users/jimmy/clawd/apps/mealpreponadime/pinterest-pins/tailwind-upload.csv', csvContent);
  fs.writeFileSync('/Users/jimmy/clawd/apps/mealpreponadime/pinterest-pins/pins-data.json', JSON.stringify(allPins, null, 2));
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ COMPLETE! Generated ${allPins.length}/25 pins`);
  console.log(`📁 CSV: pinterest-pins/tailwind-upload.csv`);
  console.log(`📁 JSON: pinterest-pins/pins-data.json`);
  console.log(`${'='.repeat(50)}`);
}

main().catch(console.error);
