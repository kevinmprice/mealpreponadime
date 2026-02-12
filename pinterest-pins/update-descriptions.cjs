const fs = require("fs");
const pins = JSON.parse(fs.readFileSync("/Users/jimmy/clawd/apps/mealpreponadime/pinterest-pins/pins-data.json"));

// Unique descriptions for each blog post (5 variations each)
const descriptions = {
  "meal-prep-beginners-guide": [
    "New to meal prep? This complete guide covers everything from planning to storage. Save hours and hundreds every month!",
    "Learn meal prep the easy way! Step-by-step instructions for beginners who want to save time and money.",
    "Stop wasting money on takeout. This beginners guide to meal prep will change how you eat forever.",
    "Meal prep 101: Everything you need to know to start prepping like a pro. Free shopping list included!",
    "The ultimate meal prep guide for beginners. Plan, shop, cook, store — all covered in one post."
  ],
  "15-cheap-meal-prep-recipes-under-2-dollars": [
    "15 delicious meals under $2 each! Budget meal prep that actually tastes amazing.",
    "Eating cheap doesnt mean eating boring. These 15 recipes prove it — all under $2/serving.",
    "Save money with these budget meal prep recipes. Every single one costs less than $2!",
    "Broke but hungry? These 15 meal prep recipes cost under $2 and taste incredible.",
    "The best cheap meal prep recipes on the internet. 15 meals, all under $2 per serving."
  ],
  "25-dollar-weekly-meal-prep-plan": [
    "Feed yourself for an entire week on just $25! Complete meal plan with shopping list.",
    "The $25 weekly meal prep challenge. Breakfast, lunch, and dinner — all covered.",
    "How I eat for $25 a week. Full meal plan with recipes and step-by-step prep guide.",
    "Ultra budget meal prep: $25 feeds you for 7 days. Shopping list + recipes included!",
    "This $25 meal plan changed my life. Complete guide to eating well on a tight budget."
  ],
  "50-dollar-weekly-meal-prep-plan": [
    "Our most popular meal plan! $50 gets you a full week of delicious, balanced meals.",
    "Eat great for $50 a week. More protein, more variety, more flavor. Full plan inside!",
    "The $50 weekly meal prep plan: balanced nutrition without breaking the bank.",
    "Level up your meal prep with this $50 weekly plan. More variety than our $25 version!",
    "Feed yourself well for $50/week. Complete meal plan with shopping list and recipes."
  ],
  "best-meal-prep-containers-2026": [
    "We tested 15 meal prep container brands. Here are the best ones for every budget.",
    "Stop buying bad containers! Our 2026 guide to the best meal prep containers.",
    "Leak-proof, microwave-safe, budget-friendly. The best meal prep containers of 2026.",
    "Which meal prep containers are actually worth it? We tested 15 brands to find out.",
    "The ultimate guide to meal prep containers. Glass vs plastic, budget vs premium — all covered."
  ]
};

// Map slugs to blog posts
const slugMap = {
  "https://www.mealpreponadime.com/blog/meal-prep-beginners-guide": "meal-prep-beginners-guide",
  "https://www.mealpreponadime.com/blog/15-cheap-meal-prep-recipes-under-2-dollars": "15-cheap-meal-prep-recipes-under-2-dollars",
  "https://www.mealpreponadime.com/blog/25-dollar-weekly-meal-prep-plan": "25-dollar-weekly-meal-prep-plan",
  "https://www.mealpreponadime.com/blog/50-dollar-weekly-meal-prep-plan": "50-dollar-weekly-meal-prep-plan",
  "https://www.mealpreponadime.com/blog/best-meal-prep-containers-2026": "best-meal-prep-containers-2026"
};

// Track which description index to use per blog
const descIndex = {};

// Update each pin with unique description
pins.forEach(pin => {
  const slug = slugMap[pin.destinationUrl];
  if (!descIndex[slug]) descIndex[slug] = 0;
  
  pin.description = descriptions[slug][descIndex[slug]];
  descIndex[slug]++;
});

// Save updated JSON
fs.writeFileSync("/Users/jimmy/clawd/apps/mealpreponadime/pinterest-pins/pins-data.json", JSON.stringify(pins, null, 2));

// Generate new CSV
const csvHeader = "Image URL,Title,Description,Link,Board";
const csvRows = pins.map(pin => {
  const desc = pin.description.replace(/"/g, '""');
  return `"${pin.imageUrl}","${pin.title}","${desc}","${pin.destinationUrl}","${pin.board}"`;
});
const csvContent = [csvHeader, ...csvRows].join("\n");
fs.writeFileSync("/Users/jimmy/clawd/apps/mealpreponadime/pinterest-pins/tailwind-upload.csv", csvContent);

console.log("✅ Updated 25 pins with unique descriptions!\n");
console.log("Sample descriptions (one per blog):");
[0, 5, 10, 15, 20].forEach(i => {
  console.log(`${i+1}. ${pins[i].title}: "${pins[i].description}"`);
});
