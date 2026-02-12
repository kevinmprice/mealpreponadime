const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

async function generatePin(inputPath, outputPath, title, subtitle, tagline) {
  // Load the source image
  const img = await loadImage(inputPath);
  
  // Pinterest pin dimensions
  const width = 1000;
  const height = 1500;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Draw image (cover fit)
  const scale = Math.max(width / img.width, height / img.height);
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;
  const x = (width - scaledWidth) / 2;
  const y = (height - scaledHeight) / 2;
  
  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  
  // Add gradient overlay at bottom
  const gradient = ctx.createLinearGradient(0, height - 500, 0, height);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(0.3, 'rgba(0,0,0,0.7)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, height - 500, width, 500);
  
  // Title
  ctx.fillStyle = 'white';
  ctx.font = 'bold 64px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, height - 280);
  
  // Subtitle (green)
  ctx.fillStyle = '#4ADE80';
  ctx.font = 'bold 48px Arial';
  ctx.fillText(subtitle, width / 2, height - 200);
  
  // Tagline
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '28px Arial';
  ctx.fillText(tagline, width / 2, height - 130);
  
  // Brand
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('MEALPREPONADIME.COM', width / 2, height - 70);
  
  // Save
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.92 });
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created: ${outputPath}`);
}

async function main() {
  const dir = __dirname;
  
  // Stock 1
  await generatePin(
    path.join(dir, 'stock-1-salad.jpg'),
    path.join(dir, 'pin-stock-1-final.jpg'),
    '5-Day Meal Prep',
    'Under $25/Week',
    'Quick • Healthy • Budget-Friendly'
  );
  
  // Stock 2
  await generatePin(
    path.join(dir, 'stock-2-bowls.jpg'),
    path.join(dir, 'pin-stock-2-final.jpg'),
    'Meal Prep Made Easy',
    '15 Minutes to Prep',
    'Healthy Lunches All Week'
  );
  
  // AI 1
  await generatePin(
    path.join(dir, 'ai-1-mealprep.jpg'),
    path.join(dir, 'pin-ai-1-final.jpg'),
    'Weekly Meal Prep',
    '$3 Per Meal',
    'Chicken, Veggies & Grains'
  );
  
  // AI 2
  await generatePin(
    path.join(dir, 'ai-2-jars.jpg'),
    path.join(dir, 'pin-ai-2-final.jpg'),
    'Mason Jar Salads',
    'Stays Fresh 5 Days',
    'Grab & Go Lunches'
  );
  
  console.log('\nAll 4 pins generated!');
}

main().catch(console.error);
