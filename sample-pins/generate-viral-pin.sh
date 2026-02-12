#!/bin/bash
# Viral Food Pin Generator - Based on top-performing Pinterest research
MAGICK="/opt/homebrew/opt/imagemagick-full/bin/magick"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Pin 1: AI meal prep - Hook at top, specific numbers
$MAGICK "$DIR/ai-1-mealprep.jpg" \
  -resize 1000x1500^ -gravity center -extent 1000x1500 \
  \( +clone -fill 'rgba(0,0,0,0.7)' -draw 'rectangle 0,0 1000,420' \) -composite \
  \( +clone -fill 'rgba(0,0,0,0.5)' -draw 'rectangle 0,1350 1000,1500' \) -composite \
  -font "Helvetica-Bold" -pointsize 52 -fill white -gravity north \
  -annotate +0+60 "THIS \$25 GROCERY HAUL" \
  -pointsize 48 -fill '#FFE135' \
  -annotate +0+130 "FED ME FOR 7 DAYS" \
  -pointsize 32 -fill white \
  -annotate +0+200 "5 meals • 15 min prep each" \
  -pointsize 28 -fill white \
  -annotate +0+260 "Full breakdown below ↓" \
  -gravity south -pointsize 24 -fill 'rgba(255,255,255,0.9)' \
  -annotate +0+40 "MEALPREPONADIME.COM" \
  "$DIR/viral-pin-1.jpg"

# Pin 2: Mason jars - Transformation hook
$MAGICK "$DIR/ai-2-jars.jpg" \
  -resize 1000x1500^ -gravity center -extent 1000x1500 \
  \( +clone -fill 'rgba(0,0,0,0.75)' -draw 'rectangle 0,0 1000,380' \) -composite \
  \( +clone -fill 'rgba(0,0,0,0.5)' -draw 'rectangle 0,1350 1000,1500' \) -composite \
  -font "Helvetica-Bold" -pointsize 46 -fill white -gravity north \
  -annotate +0+50 "STOP BUYING LUNCH" \
  -pointsize 52 -fill '#4ADE80' \
  -annotate +0+115 "SAVE \$200/MONTH" \
  -pointsize 34 -fill white \
  -annotate +0+190 "Mason jar salads that" \
  -annotate +0+235 "stay fresh for 5 days" \
  -pointsize 26 -fill '#FFE135' \
  -annotate +0+300 "→ recipes + shopping list" \
  -gravity south -pointsize 24 -fill 'rgba(255,255,255,0.9)' \
  -annotate +0+40 "MEALPREPONADIME.COM" \
  "$DIR/viral-pin-2.jpg"

# Pin 3: Stock salad - Budget angle
$MAGICK "$DIR/stock-1-salad.jpg" \
  -resize 1000x1500^ -gravity center -extent 1000x1500 \
  \( +clone -fill 'rgba(0,0,0,0.8)' -draw 'rectangle 0,0 1000,400' \) -composite \
  \( +clone -fill 'rgba(0,0,0,0.5)' -draw 'rectangle 0,1350 1000,1500' \) -composite \
  -font "Helvetica-Bold" -pointsize 38 -fill 'rgba(255,255,255,0.8)' -gravity north \
  -annotate +0+50 "I MEAL PREP EVERY SUNDAY" \
  -pointsize 54 -fill '#FFE135' \
  -annotate +0+100 "\$2.50 PER MEAL" \
  -pointsize 38 -fill white \
  -annotate +0+175 "Here's exactly how" \
  -pointsize 32 -fill white \
  -annotate +0+230 "🥗 5 lunches ready in 1 hour" \
  -annotate +0+280 "📋 Free shopping list included" \
  -annotate +0+330 "💰 Under \$20 total" \
  -gravity south -pointsize 24 -fill 'rgba(255,255,255,0.9)' \
  -annotate +0+40 "MEALPREPONADIME.COM" \
  "$DIR/viral-pin-3.jpg"

# Pin 4: Stock bowls - Time-saving angle  
$MAGICK "$DIR/stock-2-bowls.jpg" \
  -resize 1000x1500^ -gravity center -extent 1000x1500 \
  \( +clone -fill 'rgba(0,0,0,0.75)' -draw 'rectangle 0,0 1000,420' \) -composite \
  \( +clone -fill 'rgba(0,0,0,0.5)' -draw 'rectangle 0,1350 1000,1500' \) -composite \
  -font "Helvetica-Bold" -pointsize 40 -fill white -gravity north \
  -annotate +0+45 "THE 15-MINUTE MEAL PREP" \
  -pointsize 50 -fill '#4ADE80' \
  -annotate +0+105 "THAT CHANGED MY LIFE" \
  -pointsize 32 -fill white \
  -annotate +0+180 "No more takeout" \
  -annotate +0+225 "No more decision fatigue" \
  -annotate +0+270 "No more food waste" \
  -pointsize 28 -fill '#FFE135' \
  -annotate +0+340 "Save this before you forget ↓" \
  -gravity south -pointsize 24 -fill 'rgba(255,255,255,0.9)' \
  -annotate +0+40 "MEALPREPONADIME.COM" \
  "$DIR/viral-pin-4.jpg"

echo "Generated 4 viral-style pins!"
ls -la "$DIR"/viral-pin-*.jpg
