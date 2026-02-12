const fs = require('fs');
const path = require('path');
const https = require('https');

const CLOUD_NAME = 'dym2t17hd';

// Helper to encode text for Cloudinary URL
function encodeText(text) {
  return encodeURIComponent(text).replace(/%20/g, '%20').replace(/'/g, '%27');
}

// Generate Bold Overlay pin URL
function boldOverlayUrl(imageUrl, headline, badge) {
  const base64Image = Buffer.from(imageUrl).toString('base64');
  const headlineEncoded = encodeText(headline);
  
  let url = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/` +
    `w_1000,h_1500,c_fill,g_auto/` +
    `e_gradient_fade:symmetric,y_-0.3/` +
    `co_white,l_text:arial_64_bold:${headlineEncoded}/fl_layer_apply,g_south_west,x_50,y_80/`;
  
  if (badge) {
    const badgeEncoded = encodeText(badge);
    url += `co_rgb:22c55e,l_text:arial_28_bold:${badgeEncoded}/fl_layer_apply,g_south_west,x_50,y_220/`;
  }
  
  url += imageUrl;
  return url;
}

// Generate White Card pin URL  
function whiteCardUrl(imageUrl, headline, subtitle, cta) {
  const headlineEncoded = encodeText(headline);
  
  let url = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/` +
    `w_1000,h_1500,c_fill,g_auto/` +
    `l_text:arial_1:%2520,b_white,co_white,w_940,h_300/fl_layer_apply,g_south,y_20/` +
    `co_rgb:222222,l_text:arial_48_bold:${headlineEncoded}/fl_layer_apply,g_south,y_180/`;
  
  if (subtitle) {
    const subtitleEncoded = encodeText(subtitle);
    url += `co_rgb:666666,l_text:arial_24:${subtitleEncoded}/fl_layer_apply,g_south,y_100/`;
  }
  
  if (cta) {
    const ctaEncoded = encodeText(cta);
    url += `b_rgb:e11d48,co_white,l_text:arial_20_bold:${ctaEncoded},r_20/fl_layer_apply,g_south,y_40/`;
  }
  
  url += imageUrl;
  return url;
}

// Read pins data
const pinsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'pins-data.json')));

// Generate URLs for each pin
const pinsWithUrls = pinsData.map(pin => {
  let pinUrl;
  
  if (pin.template === 'boldOverlay') {
    pinUrl = boldOverlayUrl(pin.sourceImage, pin.headline, pin.badge);
  } else if (pin.template === 'whiteCard') {
    pinUrl = whiteCardUrl(pin.sourceImage, pin.headline, pin.subtitle, pin.cta);
  }
  
  return {
    ...pin,
    pinUrl
  };
});

// Save updated data
fs.writeFileSync(
  path.join(__dirname, 'pins-with-urls.json'),
  JSON.stringify(pinsWithUrls, null, 2)
);

console.log('✅ Generated pin URLs!\n');
console.log('📌 Pin URLs:');
pinsWithUrls.forEach(pin => {
  console.log(`\n${pin.id} - ${pin.headline}`);
  console.log(`Template: ${pin.template}`);
  console.log(`URL: ${pin.pinUrl.substring(0, 100)}...`);
});

// Output for quick copy
console.log('\n\n=== PINS FOR PINTEREST ===\n');
pinsWithUrls.forEach(pin => {
  console.log(`📌 ${pin.headline}`);
  console.log(`Link: ${pin.destinationUrl}`);
  console.log(`Image: ${pin.pinUrl}`);
  console.log('---');
});
