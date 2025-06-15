'use client';

import { useState, useEffect } from 'react';

interface Experience {
  id: string;
  text: string;
  category: string;
  checked: boolean;
}

const experiences = [
  // 🏠 Childhood + Family
  { id: 'scolded-10-times', text: 'Got scolded by mom 10 times in one day', category: '🏠 Childhood + Family' },
  { id: 'chappal-thrown', text: 'Dad threw chappal (and missed)', category: '🏠 Childhood + Family' },
  { id: 'tv-volume-low', text: 'Watched TV with volume low so dad won\'t yell', category: '🏠 Childhood + Family' },
  { id: 'pretend-sleep-relatives', text: 'Pretended to sleep when relatives came', category: '🏠 Childhood + Family' },
  { id: 'fake-stomach-ache', text: 'Faked stomach ache to skip school', category: '🏠 Childhood + Family' },
  { id: 'five-more-minutes', text: 'Said "just 5 more minutes" and slept for 3 hours', category: '🏠 Childhood + Family' },
  { id: 'tv-remote-fight', text: 'Fought over the TV remote', category: '🏠 Childhood + Family' },
  { id: 'bournvita-protein', text: 'Drank Bournvita and called it protein', category: '🏠 Childhood + Family' },
  { id: 'hide-report-card', text: 'Hid report card from parents', category: '🏠 Childhood + Family' },
  { id: 'slapped-before-reason', text: 'Got slapped before the reason was even asked', category: '🏠 Childhood + Family' },

  // 🍲 Food Chronicles
  { id: 'maggi-three-meals', text: 'Ate Maggi for breakfast, lunch, and dinner', category: '🍲 Food Chronicles' },
  { id: 'kurkure-fingers', text: 'Licked fingers after Kurkure and blamed the pack', category: '🍲 Food Chronicles' },
  { id: 'hide-chocolates', text: 'Hid chocolates in tiffin from hostel roommates', category: '🍲 Food Chronicles' },
  { id: 'pani-puri-challenge', text: 'Ate pani puri challenge and survived', category: '🍲 Food Chronicles' },
  { id: 'gulab-jamun-fight', text: 'Fought over the last piece of gulab jamun', category: '🍲 Food Chronicles' },
  { id: 'milk-forcefully', text: 'Drank milk forcefully while gagging', category: '🍲 Food Chronicles' },
  { id: 'dosa-pizza', text: 'Called a dosa "pizza" to make it cool', category: '🍲 Food Chronicles' },
  { id: 'biryani-argument', text: 'Argued about "best biryani" with a Hyderabadi', category: '🍲 Food Chronicles' },
  { id: 'green-chilli-bite', text: 'Suffered in silence after biting green chilli', category: '🍲 Food Chronicles' },
  { id: 'wedding-meal-sambar', text: 'Survived a wedding meal without spilling sambar', category: '🍲 Food Chronicles' },

  // 🎓 Student Life
  { id: 'bunk-movie', text: 'Bunked class to watch a movie', category: '🎓 Student Life' },
  { id: 'copy-homework', text: 'Copied homework 5 minutes before class', category: '🎓 Student Life' },
  { id: 'give-up-maths', text: 'Gave up on maths after question 2', category: '🎓 Student Life' },
  { id: 'tuition-bhaiya', text: 'Called tuition teacher "bhaiya" or "didi"', category: '🎓 Student Life' },
  { id: 'bullet-points', text: 'Wrote answers in bullet points to look confident', category: '🎓 Student Life' },
  { id: '98-still-scolded', text: 'Got 98/100 and still got scolded', category: '🎓 Student Life' },
  { id: 'one-night-study', text: 'Studied entire syllabus one night before', category: '🎓 Student Life' },
  { id: 'wrong-attendance', text: 'Gave wrong attendance for your best friend', category: '🎓 Student Life' },
  { id: 'hot-glue-burn', text: 'Burned your hands with project hot glue', category: '🎓 Student Life' },
  { id: 'best-friend-essay', text: 'Gave "My Best Friend" essay 7 years in a row', category: '🎓 Student Life' },

  // 🛵 Street Smartness
  { id: 'three-on-bike', text: 'Rode 3 people on a two-wheeler', category: '🛵 Street Smartness' },
  { id: 'escape-police', text: 'Escaped traffic police without helmet', category: '🛵 Street Smartness' },
  { id: 'bargain-10-rupees', text: 'Bargained for ₹10 like life depended on it', category: '🛵 Street Smartness' },
  { id: 'petrol-tank-sit', text: 'Sat on petrol tank like a true desi daredevil', category: '🛵 Street Smartness' },
  { id: 'dadar-parking', text: 'Found a parking spot in Dadar', category: '🛵 Street Smartness' },
  { id: 'cross-traffic', text: 'Crossed road in moving traffic like Frogger IRL', category: '🛵 Street Smartness' },
  { id: 'roadside-chinese', text: 'Ate roadside Chinese with zero regrets', category: '🛵 Street Smartness' },
  { id: 'running-bus', text: 'Boarded a running bus/train like a movie hero', category: '🛵 Street Smartness' },
  { id: 'meter-se-chalo', text: 'Asked auto bhaiya "meter se chalo?"', category: '🛵 Street Smartness' },
  { id: 'wrong-directions', text: 'Gave directions to someone even when unsure', category: '🛵 Street Smartness' },

  // 👪 Social + Family Pressure
  { id: 'sharma-ji-comparison', text: 'Got compared to Sharma ji\'s son', category: '👪 Social + Family Pressure' },
  { id: 'wedding-for-food', text: 'Attended a wedding just for food', category: '👪 Social + Family Pressure' },
  { id: 'unknown-relatives', text: 'Greeted 20 relatives you don\'t recognize', category: '👪 Social + Family Pressure' },
  { id: 'marks-kitne', text: 'Was asked "beta marks kitne aaye?"', category: '👪 Social + Family Pressure' },
  { id: 'touch-feet-confusion', text: 'Touched random aunties\' feet out of confusion', category: '👪 Social + Family Pressure' },
  { id: 'family-tech-support', text: 'Became family tech support', category: '👪 Social + Family Pressure' },
  { id: 'shaadi-kab', text: 'Got asked "Shaadi kab karoge?" at every event', category: '👪 Social + Family Pressure' },
  { id: 'toxic-relatives', text: 'Acted polite to toxic relatives', category: '👪 Social + Family Pressure' },
  { id: 'family-video-call', text: 'Endured 1-hour family WhatsApp video call', category: '👪 Social + Family Pressure' },
  { id: 'sofa-photo', text: 'Took photo with 10 people on sofa for no reason', category: '👪 Social + Family Pressure' },

  // 📱 Desi Internet
  { id: 'good-morning-200', text: 'Sent 200 Good Morning messages in family group', category: '📱 Desi Internet' },
  { id: 'whatsapp-chain', text: 'Fell for fake "forward this or die" WhatsApp chain', category: '📱 Desi Internet' },
  { id: '2g-on-5g', text: 'Got internet speed of 2G on 5G plan', category: '📱 Desi Internet' },
  { id: 'songspk-download', text: 'Downloaded Bollywood songs from "SongsPK"', category: '📱 Desi Internet' },
  { id: 'ram-boosters', text: 'Installed 3 RAM boosters to make phone fast', category: '📱 Desi Internet' },
  { id: 'phone-blanket', text: 'Used phone inside blanket at 2AM', category: '📱 Desi Internet' },
  { id: '1gb-one-hour', text: 'Used 1GB data in one hour, now crying', category: '📱 Desi Internet' },
  { id: 'cricket-text-updates', text: 'Watched cricket score updates on text', category: '📱 Desi Internet' },
  { id: 'movie-three-days', text: 'Downloaded one movie across 3 days', category: '📱 Desi Internet' },
  { id: 'wifi-building', text: 'Shared WiFi password with entire building', category: '📱 Desi Internet' },

  // 🏞️ The Great Indian Vacation
  { id: 'goa-never-happened', text: 'Planned a Goa trip that never happened', category: '🏞️ The Great Indian Vacation' },
  { id: 'grandparents-darker', text: 'Visited grandparents in summer and came back darker', category: '🏞️ The Great Indian Vacation' },
  { id: '45-selfies-monument', text: 'Took 45 selfies in front of one monument', category: '🏞️ The Great Indian Vacation' },
  { id: 'lonavala-traffic', text: 'Got stuck in traffic on way to Lonavala', category: '🏞️ The Great Indian Vacation' },
  { id: 'kerala-gods-country', text: 'Went to Kerala and said "God\'s own country" 5 times', category: '🏞️ The Great Indian Vacation' },
  { id: 'hill-station-tea', text: 'Argued about best tea spot on a hill station', category: '🏞️ The Great Indian Vacation' },
  { id: 'four-bags-two-days', text: 'Packed 4 bags for a 2-day trip', category: '🏞️ The Great Indian Vacation' },
  { id: 'airport-trolley-photo', text: 'Clicked photo with airport trolley', category: '🏞️ The Great Indian Vacation' },
  { id: 'manali-snowman', text: 'Went to Manali and built a 3-inch snowman', category: '🏞️ The Great Indian Vacation' },
  { id: 'flight-food-home', text: 'Took food from home on flight "just in case"', category: '🏞️ The Great Indian Vacation' },

  // 🛕 Spiritual Moments
  { id: 'ring-every-bell', text: 'Rang every bell in the temple', category: '🛕 Spiritual Moments' },
  { id: 'prasad-no-spill', text: 'Got prasad and tried not to spill', category: '🛕 Spiritual Moments' },
  { id: 'satsang-snacks', text: 'Attended satsang for the snacks', category: '🛕 Spiritual Moments' },
  { id: 'chappals-inside', text: 'Took chappals inside to avoid theft', category: '🛕 Spiritual Moments' },
  { id: 'bored-aarti', text: 'Got bored during 2-hour aarti', category: '🛕 Spiritual Moments' },
  { id: 'coconut-vehicle', text: 'Got coconut smashed on vehicle for good luck', category: '🛕 Spiritual Moments' },
  { id: 'fast-forgot-ate', text: 'Told to fast… forgot and ate', category: '🛕 Spiritual Moments' },
  { id: 'new-clothes-god', text: 'Wore new clothes to temple to "show God"', category: '🛕 Spiritual Moments' },
  { id: 'burn-fingers-diya', text: 'Burned fingers while lighting diya', category: '🛕 Spiritual Moments' },
  { id: 'three-rounds-blessings', text: 'Took 3 rounds of temple to ensure blessings', category: '🛕 Spiritual Moments' },

  // 🎉 Festival Mode
  { id: 'crackers-run', text: 'Burst crackers and immediately ran', category: '🎉 Festival Mode' },
  { id: 'holi-enemy-first', text: 'Put color on enemy first in Holi', category: '🎉 Festival Mode' },
  { id: 'puja-thali-sweets', text: 'Used puja thali to serve sweets later', category: '🎉 Festival Mode' },
  { id: '10-laddoos-diwali', text: 'Ate more than 10 laddoos in Diwali', category: '🎉 Festival Mode' },
  { id: 'mehndi-3-hours', text: 'Put mehndi and didn\'t move for 3 hours', category: '🎉 Festival Mode' },
  { id: 'rangoli-olympics', text: 'Competed in Rangoli like it\'s Olympics', category: '🎉 Festival Mode' },
  { id: 'forgot-rakhi', text: 'Forgot Rakhi until sister reminded', category: '🎉 Festival Mode' },
  { id: 'dandiya-stick-hit', text: 'Got hit by stick during Dandiya', category: '🎉 Festival Mode' },
  { id: 'ganpati-visarjan-loud', text: 'Sang loudly during Ganpati visarjan', category: '🎉 Festival Mode' },
  { id: 'durga-pandal-food', text: 'Went Durga pandal hopping for free food', category: '🎉 Festival Mode' },

  // 🎭 Desi Behavior
  { id: 'save-gift-wrap', text: 'Saved gift wrapping for future use', category: '🎭 Desi Behavior' },
  { id: 'sweets-sewing-kit', text: 'Had 5 containers of old sweets, now sewing kit', category: '🎭 Desi Behavior' },
  { id: 'water-spicy-worse', text: 'Drank water after spicy food and made it worse', category: '🎭 Desi Behavior' },
  { id: 'new-clothes-curry', text: 'Wore new clothes and spilled curry', category: '🎭 Desi Behavior' },
  { id: 'bas-2-min-45', text: 'Said "bas 2 min" but took 45', category: '🎭 Desi Behavior' },
  { id: 'newspaper-everything', text: 'Used newspaper as plate/mat/cleaning cloth', category: '🎭 Desi Behavior' },
  { id: 'ask-price-no-buy', text: 'Asked price even when not planning to buy', category: '🎭 Desi Behavior' },
  { id: 'stranger-uncle-aunty', text: 'Made stranger your "uncle/aunty"', category: '🎭 Desi Behavior' },
  { id: 'barefoot-hot-road', text: 'Walked barefoot on hot road and survived', category: '🎭 Desi Behavior' },
  { id: 'selfie-random-things', text: 'Took selfie with cow/auto/train because… why not', category: '🎭 Desi Behavior' },

  // 🚌 Transport Jugaad
  { id: 'train-window-seat-fight', text: 'Fought for train window seat like your life depended on it', category: '🚌 Transport Jugaad' },
  { id: 'bus-conductor-exact-change', text: 'Bus conductor said "change nahi hai" and you said "koi baat nahi"', category: '🚌 Transport Jugaad' },
  { id: 'rickshaw-three-wheeler', text: 'Fit 6 people in a rickshaw meant for 3', category: '🚌 Transport Jugaad' },
  { id: 'train-chai-wala', text: 'Bought chai from train chai-wala in kulhad', category: '🚌 Transport Jugaad' },
  { id: 'auto-meter-broken', text: 'Auto driver said "meter kharab hai, 50 rupees"', category: '🚌 Transport Jugaad' },
  { id: 'bus-hanging-outside', text: 'Traveled hanging outside the bus door', category: '🚌 Transport Jugaad' },
  { id: 'train-berth-sharing', text: 'Shared train berth with complete stranger family', category: '🚌 Transport Jugaad' },
  { id: 'cycle-double-seat', text: 'Two people on cycle, one standing on pedals', category: '🚌 Transport Jugaad' },
  { id: 'bus-roof-luggage', text: 'Put entire household on bus roof', category: '🚌 Transport Jugaad' },
  { id: 'train-tatkal-booking', text: 'Woke up at 10 AM sharp for tatkal booking', category: '🚌 Transport Jugaad' },

  // 🏪 Bazaar Chronicles  
  { id: 'vegetable-market-bargain', text: 'Bargained for 2 rupees in vegetable market', category: '🏪 Bazaar Chronicles' },
  { id: 'shopkeeper-credit', text: 'Shopkeeper gave you items on credit "khata mein likh dena"', category: '🏪 Bazaar Chronicles' },
  { id: 'free-plastic-bag', text: 'Asked for "ek plastic bag extra" for free', category: '🏪 Bazaar Chronicles' },
  { id: 'wholesale-market-bulk', text: 'Went to wholesale market to buy in bulk', category: '🏪 Bazaar Chronicles' },
  { id: 'bhaiya-discount', text: 'Called shopkeeper "bhaiya" for better discount', category: '🏪 Bazaar Chronicles' },
  { id: 'market-price-compare', text: 'Checked prices in 5 shops before buying', category: '🏪 Bazaar Chronicles' },
  { id: 'free-dhaniya-pyaz', text: 'Got free dhaniya-pyaz with vegetables', category: '🏪 Bazaar Chronicles' },
  { id: 'old-newspaper-wrapping', text: 'Got items wrapped in old newspaper', category: '🏪 Bazaar Chronicles' },
  { id: 'market-closing-discount', text: 'Went shopping during market closing time for discount', category: '🏪 Bazaar Chronicles' },
  { id: 'vendor-scale-cheat', text: 'Caught vendor cheating on weighing scale', category: '🏪 Bazaar Chronicles' },

  // 🎬 Bollywood Reality
  { id: 'train-missing-running', text: 'Missed train by 2 seconds, didn\'t run like SRK', category: '🎬 Bollywood Reality' },
  { id: 'romantic-rain-scene', text: 'Got caught in rain, realized it\'s not romantic', category: '🎬 Bollywood Reality' },
  { id: 'college-canteen-proposal', text: 'Someone proposed in college canteen, crowd gathered', category: '🎬 Bollywood Reality' },
  { id: 'bike-without-helmet', text: 'Rode bike without helmet feeling like hero', category: '🎬 Bollywood Reality' },
  { id: 'ganpati-bappa-morya', text: 'Shouted "Ganpati Bappa Morya" during visarjan', category: '🎬 Bollywood Reality' },
  { id: 'college-farewell-tears', text: 'Cried during college farewell like Bollywood movie', category: '🎬 Bollywood Reality' },
  { id: 'roadside-romeo', text: 'Witnessed roadside romeo getting rejected', category: '🎬 Bollywood Reality' },
  { id: 'train-door-hero', text: 'Stood at train door feeling like action hero', category: '🎬 Bollywood Reality' },
  { id: 'cricket-world-cup', text: 'Celebrated cricket World Cup win like personal victory', category: '🎬 Bollywood Reality' },
  { id: 'bollywood-dance-wedding', text: 'Did full Bollywood dance at someone\'s wedding', category: '🎬 Bollywood Reality' },

  // 🏠 Ghar Ka Mamla
  { id: 'dal-chawal-everyday', text: 'Ate dal-chawal for 15 days straight', category: '🏠 Ghar Ka Mamla' },
  { id: 'cooker-whistle-count', text: 'Mom counted pressure cooker whistles from another room', category: '🏠 Ghar Ka Mamla' },
  { id: 'fridge-multiple-visits', text: 'Opened fridge 10 times hoping food appeared', category: '🏠 Ghar Ka Mamla' },
  { id: 'tv-cable-connection', text: 'Hit TV/cable box to fix connection', category: '🏠 Ghar Ka Mamla' },
  { id: 'inverter-load-shedding', text: 'Calculated fan speed during power cut', category: '🏠 Ghar Ka Mamla' },
  { id: 'water-tank-shortage', text: 'Fought over water during shortage', category: '🏠 Ghar Ka Mamla' },
  { id: 'mom-hiding-money', text: 'Found mom\'s hidden money in different places', category: '🏠 Ghar Ka Mamla' },
  { id: 'gas-cylinder-booking', text: 'Booked gas cylinder and waited 15 days', category: '🏠 Ghar Ka Mamla' },
  { id: 'neighbor-noise-complaint', text: 'Complained about neighbor\'s loud music', category: '🏠 Ghar Ka Mamla' },
  { id: 'house-painting-festival', text: 'Painted house before every festival', category: '🏠 Ghar Ka Mamla' },

  // 📺 TV Serial Drama
  { id: 'saas-bahu-serial', text: 'Watched saas-bahu serial and got emotionally invested', category: '📺 TV Serial Drama' },
  { id: 'tv-remote-control', text: 'Became official TV remote controller', category: '📺 TV Serial Drama' },
  { id: 'cricket-match-family', text: 'Entire family watched cricket match together', category: '📺 TV Serial Drama' },
  { id: 'cartoon-network-childhood', text: 'Fought for Cartoon Network during childhood', category: '📺 TV Serial Drama' },
  { id: 'news-channel-debate', text: 'Got angry watching news channel debates', category: '📺 TV Serial Drama' },
  { id: 'reality-show-voting', text: 'Voted for reality show contestant multiple times', category: '📺 TV Serial Drama' },
  { id: 'tv-advertisement-memorized', text: 'Memorized TV advertisement jingles', category: '📺 TV Serial Drama' },
  { id: 'dd-national-childhood', text: 'Watched DD National when cable wasn\'t working', category: '📺 TV Serial Drama' },
  { id: 'cricket-commentary-mute', text: 'Muted TV and did your own cricket commentary', category: '📺 TV Serial Drama' },
  { id: 'serial-episode-discussion', text: 'Discussed TV serial episodes with neighbors', category: '📺 TV Serial Drama' },

  // 🎒 School/College Memories
  { id: 'tiffin-box-sharing', text: 'Shared tiffin with friends and ate their food', category: '🎒 School/College Memories' },
  { id: 'uniform-size-big', text: 'Wore oversized uniform "beta next year fit ho jayega"', category: '🎒 School/College Memories' },
  { id: 'school-bus-fights', text: 'Had territory fights in school bus', category: '🎒 School/College Memories' },
  { id: 'exam-hall-prayer', text: 'Prayed to every god before entering exam hall', category: '🎒 School/College Memories' },
  { id: 'library-sleep', text: 'Slept in library pretending to study', category: '🎒 School/College Memories' },
  { id: 'canteen-credit', text: 'Got food from canteen on credit', category: '🎒 School/College Memories' },
  { id: 'bench-carving', text: 'Carved your name on school/college bench', category: '🎒 School/College Memories' },
  { id: 'hostel-mess-complaint', text: 'Complained about hostel mess food daily', category: '🎒 School/College Memories' },
  { id: 'sports-day-participation', text: 'Participated in sports day for attendance', category: '🎒 School/College Memories' },
  { id: 'teacher-mimicry', text: 'Did teacher mimicry when they left class', category: '🎒 School/College Memories' },

  // 🏥 Medical Adventures
  { id: 'doctor-prescription-unreadable', text: 'Couldn\'t read doctor\'s prescription', category: '🏥 Medical Adventures' },
  { id: 'homeopathy-medicine', text: 'Took homeopathy medicine for months', category: '🏥 Medical Adventures' },
  { id: 'neem-haldi-gharelu', text: 'Mom gave neem-haldi for every problem', category: '🏥 Medical Adventures' },
  { id: 'government-hospital-queue', text: 'Stood in government hospital queue for hours', category: '🏥 Medical Adventures' },
  { id: 'pharmacy-generic-medicine', text: 'Asked for generic medicine to save money', category: '🏥 Medical Adventures' },
  { id: 'ayurvedic-kadha', text: 'Forced to drink ayurvedic kadha', category: '🏥 Medical Adventures' },
  { id: 'doctor-google-search', text: 'Googled symptoms before visiting doctor', category: '🏥 Medical Adventures' },
  { id: 'injection-fear-adult', text: 'Still scared of injections as an adult', category: '🏥 Medical Adventures' },
  { id: 'medical-store-bargain', text: 'Tried to bargain at medical store', category: '🏥 Medical Adventures' },
  { id: 'medicine-expiry-check', text: 'Checked medicine expiry date multiple times', category: '🏥 Medical Adventures' },

  // 💰 Paisa Problems
  { id: 'atm-queue-salary-day', text: 'Stood in ATM queue on salary day', category: '💰 Paisa Problems' },
  { id: 'coin-collection-piggy', text: 'Collected coins in piggy bank', category: '💰 Paisa Problems' },
  { id: 'bank-form-filling', text: 'Filled 10 forms for simple bank work', category: '💰 Paisa Problems' },
  { id: 'loan-against-gold', text: 'Family took loan against gold jewelry', category: '💰 Paisa Problems' },
  { id: 'fixed-deposit-breaking', text: 'Broke fixed deposit for emergency', category: '💰 Paisa Problems' },
  { id: 'money-exchange-wedding', text: 'Exchanged old notes during demonetization', category: '💰 Paisa Problems' },
  { id: 'chillr-paytm-cashback', text: 'Downloaded 5 apps for cashback offers', category: '💰 Paisa Problems' },
  { id: 'emi-calculation-mental', text: 'Calculated EMI mentally before buying', category: '💰 Paisa Problems' },
  { id: 'insurance-agent-avoid', text: 'Avoided insurance agent calls', category: '💰 Paisa Problems' },
  { id: 'budget-month-end', text: 'Survived last week of month on 100 rupees', category: '💰 Paisa Problems' },

  // 🌧️ Mausam Matters
  { id: 'monsoon-first-rain', text: 'Danced in first monsoon rain', category: '🌧️ Mausam Matters' },
  { id: 'summer-cooler-desert', text: 'Used desert cooler in 45-degree heat', category: '🌧️ Mausam Matters' },
  { id: 'winter-razai-sharing', text: 'Fought over razai during winter', category: '🌧️ Mausam Matters' },
  { id: 'ac-electricity-bill', text: 'Scared to use AC because of electricity bill', category: '🌧️ Mausam Matters' },
  { id: 'umbrella-monsoon-broken', text: 'Umbrella broke during heavy monsoon', category: '🌧️ Mausam Matters' },
  { id: 'fan-speed-regulation', text: 'Regulated fan speed based on electricity meter', category: '🌧️ Mausam Matters' },
  { id: 'weather-prediction-mom', text: 'Mom predicted weather better than meteorologist', category: '🌧️ Mausam Matters' },
  { id: 'flood-water-walking', text: 'Walked through flood water during monsoon', category: '🌧️ Mausam Matters' },
  { id: 'summer-afternoon-sleep', text: 'Mandatory afternoon sleep during summer', category: '🌧️ Mausam Matters' },
  { id: 'winter-morning-excuses', text: 'Made excuses to avoid getting up in winter', category: '🌧️ Mausam Matters' }
];

interface StoredAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const allPossibleAchievements = [
  // Progress-based achievements
  { id: 'first-experience', name: 'शुरुआत', description: 'Checked your first experience', icon: '🌟', rarity: 'common' as const },
  { id: 'lauki-level', name: 'Lauki Level Unlocked', description: 'Completed 10 experiences', icon: '🥒', rarity: 'common' as const },
  { id: 'sharma-ji-approves', name: 'Sharma ji Approves', description: 'Completed 25 experiences', icon: '👨‍🏫', rarity: 'rare' as const },
  { id: 'sanskari-certified', name: 'Sanskari Certified', description: 'Completed 50 experiences', icon: '🕉️', rarity: 'epic' as const },
  { id: 'whatsapp-guru', name: 'WhatsApp Guru', description: 'Completed 75 experiences', icon: '📱', rarity: 'epic' as const },
  { id: 'desi-champion', name: 'Fully Desi Champion', description: 'Completed 100 experiences', icon: '🏆', rarity: 'legendary' as const },
  { id: 'peak-indian', name: 'Peak Indian Achieved', description: 'Completed 150 experiences', icon: '🇮🇳', rarity: 'legendary' as const },
  { id: 'master-of-experiences', name: 'अनुभव मास्टर', description: 'Completed all 200 experiences', icon: '👑', rarity: 'legendary' as const },

  // Category-based achievements
  { id: 'transport-master', name: 'Transport Jugaad Master', description: 'Completed all Transport experiences', icon: '🚌', rarity: 'rare' as const },
  { id: 'food-connoisseur', name: 'Food Chronicles Expert', description: 'Completed all Food experiences', icon: '🍛', rarity: 'rare' as const },
  { id: 'bollywood-fan', name: 'Bollywood Reality King', description: 'Completed all Bollywood experiences', icon: '🎬', rarity: 'rare' as const },
  { id: 'family-member', name: 'Ghar Ka Beta/Beti', description: 'Completed all Family experiences', icon: '🏠', rarity: 'rare' as const },
  { id: 'student-veteran', name: 'Student Life Survivor', description: 'Completed all Student experiences', icon: '🎒', rarity: 'rare' as const },
  { id: 'festival-enthusiast', name: 'Festival Mode Activated', description: 'Completed all Festival experiences', icon: '🎉', rarity: 'rare' as const },

  // Speed-based achievements
  { id: 'quick-clicker', name: 'Speed Checker', description: 'Checked 20 experiences in 5 minutes', icon: '⚡', rarity: 'epic' as const },
  { id: 'marathon-checker', name: 'Marathon Checker', description: 'Checked 50 experiences in one session', icon: '🏃', rarity: 'epic' as const },

  // Time-based achievements
  { id: 'night-owl', name: 'रात का उल्लू', description: 'Checked experiences after midnight', icon: '🦉', rarity: 'rare' as const },
  { id: 'early-bird', name: 'सुबह का तारा', description: 'Checked experiences before 6 AM', icon: '🌅', rarity: 'rare' as const },
  { id: 'weekend-warrior', name: 'Weekend Nostalgia', description: 'Used the app on weekend', icon: '🌴', rarity: 'common' as const },

  // Special achievements
  { id: 'perfectionist', name: 'Perfectionist', description: 'Unchecked and rechecked 10 experiences', icon: '🔄', rarity: 'epic' as const },
  { id: 'indecisive', name: 'Confused Desi', description: 'Changed mind on same experience 5 times', icon: '🤔', rarity: 'rare' as const },
  { id: 'category-hopper', name: 'Category Explorer', description: 'Checked experiences from all categories', icon: '🗺️', rarity: 'epic' as const },
  { id: 'social-sharer', name: 'Story Teller', description: 'Opened achievement showcase', icon: '📢', rarity: 'common' as const },

  // Milestone achievements
  { id: 'half-way', name: 'अध आधा रास्ता', description: 'Reached 50% completion', icon: '🎯', rarity: 'epic' as const },
  { id: 'three-quarters', name: 'Almost There', description: 'Reached 75% completion', icon: '📈', rarity: 'epic' as const },
  { id: 'ninety-percent', name: 'So Close!', description: 'Reached 90% completion', icon: '🔥', rarity: 'legendary' as const },

  // Fun achievements
  { id: 'nostalgic', name: 'Nostalgic Soul', description: 'Spent more than 10 minutes on the page', icon: '💭', rarity: 'common' as const },
  { id: 'memory-master', name: 'Memory Master', description: 'Checked 25 childhood experiences', icon: '🧠', rarity: 'rare' as const },
  { id: 'culture-keeper', name: 'संस्कृति रक्षक', description: 'Checked 20 traditional experiences', icon: '🏺', rarity: 'epic' as const },
];

export default function IndianExperiences() {
  const [checkedExperiences, setCheckedExperiences] = useState<{ [key: string]: boolean }>({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [achievementUnlocked, setAchievementUnlocked] = useState<string | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<StoredAchievement[]>([]);
  const [showAchievementShowcase, setShowAchievementShowcase] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    sessionStart: Date.now(),
    rapidClicks: 0,
    toggleCount: new Map<string, number>(),
    categoriesVisited: new Set<string>()
  });

  // Load achievements from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('indian-achievements');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUnlockedAchievements(parsed.map((a: any) => ({
          ...a,
          unlockedAt: new Date(a.unlockedAt)
        })));
      }

      // Load checked experiences
      const storedExperiences = localStorage.getItem('indian-experiences-checked');
      if (storedExperiences) {
        setCheckedExperiences(JSON.parse(storedExperiences));
      }
    }

    // Time-based achievements
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) {
      unlockAchievementById('early-bird');
    } else if (hour >= 23 || hour < 2) {
      unlockAchievementById('night-owl');
    }

    const day = new Date().getDay();
    if (day === 0 || day === 6) {
      unlockAchievementById('weekend-warrior');
    }

    // Nostalgic achievement timer
    setTimeout(() => {
      unlockAchievementById('nostalgic');
    }, 10 * 60 * 1000); // 10 minutes
  }, []);

  useEffect(() => {
    const checkedCount = Object.values(checkedExperiences).filter(Boolean).length;
    const percentage = Math.round((checkedCount / experiences.length) * 100);
    setCompletionPercentage(percentage);

    // Save checked experiences
    if (typeof window !== 'undefined') {
      localStorage.setItem('indian-experiences-checked', JSON.stringify(checkedExperiences));
    }

    // Progress-based achievements
    if (checkedCount === 1) unlockAchievementById('first-experience');
    if (checkedCount === 10) unlockAchievementById('lauki-level');
    if (checkedCount === 25) unlockAchievementById('sharma-ji-approves');
    if (checkedCount === 50) unlockAchievementById('sanskari-certified');
    if (checkedCount === 75) unlockAchievementById('whatsapp-guru');
    if (checkedCount === 100) unlockAchievementById('desi-champion');
    if (checkedCount === 150) unlockAchievementById('peak-indian');
    if (checkedCount === 200) unlockAchievementById('master-of-experiences');

    // Percentage-based achievements
    if (percentage === 50) unlockAchievementById('half-way');
    if (percentage === 75) unlockAchievementById('three-quarters');
    if (percentage === 90) unlockAchievementById('ninety-percent');

    // Category completion achievements
    categories.forEach(category => {
      const categoryExperiences = experiences.filter(exp => exp.category === category);
      const categoryChecked = categoryExperiences.every(exp => checkedExperiences[exp.id]);
      
      if (categoryChecked && categoryExperiences.length > 0) {
        if (category.includes('Transport')) unlockAchievementById('transport-master');
        if (category.includes('Food')) unlockAchievementById('food-connoisseur');
        if (category.includes('Bollywood')) unlockAchievementById('bollywood-fan');
        if (category.includes('Ghar')) unlockAchievementById('family-member');
        if (category.includes('School') || category.includes('Student')) unlockAchievementById('student-veteran');
        if (category.includes('Festival')) unlockAchievementById('festival-enthusiast');
      }
    });

    // Special category tracking
    const childhoodExps = experiences.filter(exp => 
      exp.category.includes('Childhood') || exp.category.includes('School')
    ).filter(exp => checkedExperiences[exp.id]).length;
    
    if (childhoodExps >= 25) unlockAchievementById('memory-master');

    const traditionalExps = experiences.filter(exp => 
      exp.category.includes('Spiritual') || exp.category.includes('Festival')
    ).filter(exp => checkedExperiences[exp.id]).length;
    
    if (traditionalExps >= 20) unlockAchievementById('culture-keeper');

    // Category explorer achievement
    const visitedCategories = categories.filter(category => 
      experiences.filter(exp => exp.category === category)
        .some(exp => checkedExperiences[exp.id])
    );
    
    if (visitedCategories.length === categories.length) {
      unlockAchievementById('category-hopper');
    }

    // Speed achievements
    const now = Date.now();
    const timeSinceStart = now - sessionStats.sessionStart;
    
    if (checkedCount >= 20 && timeSinceStart <= 5 * 60 * 1000) {
      unlockAchievementById('quick-clicker');
    }
    
    if (checkedCount >= 50 && timeSinceStart <= 60 * 60 * 1000) {
      unlockAchievementById('marathon-checker');
    }
  }, [checkedExperiences]);

  const unlockAchievementById = (id: string) => {
    const achievement = allPossibleAchievements.find(a => a.id === id);
    if (!achievement) return;

    const alreadyUnlocked = unlockedAchievements.find(a => a.id === id);
    if (alreadyUnlocked) return;

    const newAchievement: StoredAchievement = {
      ...achievement,
      unlockedAt: new Date()
    };

    setUnlockedAchievements(prev => {
      const updated = [...prev, newAchievement];
      if (typeof window !== 'undefined') {
        localStorage.setItem('indian-achievements', JSON.stringify(updated));
      }
      return updated;
    });

    setAchievementUnlocked(achievement.name);
    setTimeout(() => setAchievementUnlocked(null), 4000);
  };

  const handleCheck = (id: string) => {
    const wasChecked = checkedExperiences[id];
    const experience = experiences.find(exp => exp.id === id);
    
    setCheckedExperiences(prev => ({
      ...prev,
      [id]: !prev[id]
    }));

    // Track toggling for indecisive achievement
    setSessionStats(prev => {
      const newToggleCount = new Map(prev.toggleCount);
      const currentCount = newToggleCount.get(id) || 0;
      newToggleCount.set(id, currentCount + 1);
      
      if (currentCount + 1 >= 5) {
        unlockAchievementById('indecisive');
      }

      // Track categories visited
      const newCategoriesVisited = new Set(prev.categoriesVisited);
      if (experience) {
        newCategoriesVisited.add(experience.category);
      }

      return {
        ...prev,
        toggleCount: newToggleCount,
        categoriesVisited: newCategoriesVisited
      };
    });

    // Track perfectionist behavior (unchecking and rechecking)
    if (wasChecked) {
      const toggles = Array.from(sessionStats.toggleCount.values()).reduce((sum, count) => sum + count, 0);
      if (toggles >= 10) {
        unlockAchievementById('perfectionist');
      }
    }
  };

  const categories = [...new Set(experiences.map(exp => exp.category))];
  const checkedCount = Object.values(checkedExperiences).filter(Boolean).length;

  return (
    <div className="min-h-screen relative" style={{
      backgroundColor: '#2c1810',
      backgroundImage: `
        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E"),
        linear-gradient(45deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 69, 19, 0.1) 100%)
      `
    }}>
      {/* Vintage film grain overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}></div>

      {/* Bollywood poster decorative borders */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-600 opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-600 opacity-80"></div>
        <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-b from-yellow-600 via-red-600 to-yellow-600 opacity-80"></div>
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-b from-yellow-600 via-red-600 to-yellow-600 opacity-80"></div>
      </div>

      {/* Vintage torn paper effect for categories */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              width: '200px',
              height: '150px',
              background: '#d4af37',
              transform: `rotate(${Math.random() * 45 - 22.5}deg)`,
              clipPath: 'polygon(0% 0%, 90% 0%, 95% 25%, 100% 50%, 85% 75%, 90% 100%, 10% 100%, 5% 75%, 0% 50%, 15% 25%)'
            }}
          />
        ))}
      </div>

      {/* Achievement notification - Vintage style */}
      {achievementUnlocked && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="relative bg-yellow-100 text-black p-6 border-8 border-red-800 shadow-2xl max-w-sm transform -rotate-2" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23d4af37" fill-opacity="0.1"%3E%3Cpath d="M0 0h20v20H0z"/%3E%3C/g%3E%3C/svg%3E")',
            fontFamily: 'serif',
            boxShadow: '10px 10px 0px #8b4513, 15px 15px 0px rgba(0,0,0,0.3)'
          }}>
            <div className="absolute -top-2 -left-2 bg-red-600 text-yellow-100 px-2 py-1 text-xs font-bold transform rotate-12">
              AWARD
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 animate-bounce">★</div>
              <div className="text-sm uppercase tracking-wide font-bold text-red-800">पुरस्कार मिला!</div>
              <div className="text-lg font-bold text-black">{achievementUnlocked}</div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto p-4 pt-20">
        {/* Header - Bollywood Poster Style */}
        <div className="text-center mb-16">
          {/* Main title with vintage cinema styling */}
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 transform -rotate-1 rounded-lg opacity-80"></div>
            <h1 className="relative text-6xl font-bold text-yellow-100 px-8 py-4" style={{
              fontFamily: 'serif',
              textShadow: '4px 4px 0px #8b4513, 8px 8px 0px rgba(0,0,0,0.5)',
              letterSpacing: '2px'
            }}>
              भारतीय अनुभव
            </h1>
          </div>
          
          <div className="mt-4 text-3xl font-bold text-yellow-400" style={{
            fontFamily: 'serif',
            textShadow: '2px 2px 0px #8b4513'
          }}>
            200 Relatable Indian Moments
          </div>
          
          <div className="mt-6 bg-yellow-100 border-4 border-red-800 p-6 max-w-lg mx-auto transform rotate-1" style={{
            fontFamily: 'serif',
            boxShadow: '8px 8px 0px #8b4513'
          }}>
            <div className="text-red-800 text-xl font-bold mb-2">
              आपका स्कोर: {completionPercentage}%
            </div>
            <div className="bg-red-800 h-6 border-2 border-black">
              <div 
                className="bg-yellow-400 h-full transition-all duration-500 border-r-2 border-black"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-black text-sm mt-2 font-bold">
              {checkedCount} / {experiences.length} experiences
            </div>
            
            {/* Achievement showcase button */}
            <button
              onClick={() => {
                setShowAchievementShowcase(true);
                unlockAchievementById('social-sharer');
              }}
              className="mt-4 bg-red-800 text-yellow-100 px-4 py-2 font-bold border-2 border-black hover:bg-red-700 transition-all"
            >
              🏆 देखें Achievements ({unlockedAchievements.length})
            </button>
          </div>

          {/* Movie-style tagline */}
          <div className="mt-8 text-yellow-300 text-lg italic" style={{
            fontFamily: 'serif',
            textShadow: '1px 1px 0px #8b4513'
          }}>
            "हर भारतीय की कहानी है यही..."
          </div>
        </div>

        {/* Categories - Vintage Newspaper Style */}
        {categories.map((category, categoryIndex) => (
          <div key={category} className="mb-12">
            {/* Category header with vintage movie poster styling */}
            <div className="relative mb-8">
              <div className="bg-red-800 text-yellow-100 p-4 border-4 border-yellow-400 transform -rotate-1 inline-block" style={{
                fontFamily: 'serif',
                boxShadow: '6px 6px 0px #8b4513'
              }}>
                <h2 className="text-2xl font-bold" style={{
                  textShadow: '2px 2px 0px #000'
                }}>
                  {category}
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences
                .filter(exp => exp.category === category)
                .map((experience, index) => (
                  <div
                    key={experience.id}
                    className={`relative bg-yellow-50 border-4 border-black p-4 transition-all duration-300 cursor-pointer hover:scale-105 transform ${
                      index % 2 === 0 ? 'rotate-1' : '-rotate-1'
                    } ${
                      checkedExperiences[experience.id] 
                        ? 'bg-green-100 border-green-600' 
                        : 'hover:bg-yellow-100'
                    }`}
                    onClick={() => handleCheck(experience.id)}
                    style={{
                      fontFamily: 'serif',
                      boxShadow: '4px 4px 0px #8b4513',
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23d4af37" fill-opacity="0.05"%3E%3Cpath d="M0 0h20v20H0z"/%3E%3C/g%3E%3C/svg%3E")'
                    }}
                  >
                    {/* Vintage stamp effect for checked items */}
                    {checkedExperiences[experience.id] && (
                      <div className="absolute -top-2 -right-2 bg-red-600 text-yellow-100 px-2 py-1 text-xs font-bold transform rotate-12 border-2 border-black">
                        ✓ DONE
                      </div>
                    )}
                    
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-5 md:w-6 h-5 md:h-6 border-2 border-black flex items-center justify-center transition-all text-xs md:text-sm ${
                          checkedExperiences[experience.id]
                            ? 'bg-green-600 text-yellow-100'
                            : 'bg-yellow-100'
                        }`}>
                          {checkedExperiences[experience.id] && '★'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs md:text-sm leading-relaxed transition-all font-medium ${
                          checkedExperiences[experience.id] 
                            ? 'text-green-800' 
                            : 'text-black'
                        }`}>
                          {experience.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Footer stats - Vintage Cinema Style */}
        <div className="text-center mt-16">
          <div className="bg-yellow-100 border-8 border-red-800 p-8 transform -rotate-1" style={{
            fontFamily: 'serif',
            boxShadow: '12px 12px 0px #8b4513'
          }}>
            <div className="text-red-800 text-2xl font-bold mb-6">
              🎬 FINAL STATISTICS 🎬
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-red-800 text-yellow-100 p-4 border-2 border-black">
                <div className="text-3xl font-bold">{checkedCount}</div>
                <div className="text-sm font-bold">अनुभव</div>
              </div>
              <div className="bg-red-800 text-yellow-100 p-4 border-2 border-black">
                <div className="text-3xl font-bold">{completionPercentage}%</div>
                <div className="text-sm font-bold">देसी लेवल</div>
              </div>
              <div className="bg-red-800 text-yellow-100 p-4 border-2 border-black">
                <div className="text-3xl font-bold">
                  {completionPercentage >= 90 ? '★★★' : 
                   completionPercentage >= 75 ? '★★☆' : 
                   completionPercentage >= 50 ? '★☆☆' : 
                   completionPercentage >= 25 ? '☆☆☆' : '???'}
                </div>
                <div className="text-sm font-bold">रेटिंग</div>
              </div>
              <div className="bg-red-800 text-yellow-100 p-4 border-2 border-black">
                <div className="text-3xl font-bold">
                  {typeof window !== 'undefined' ? Math.floor(Object.keys(localStorage).filter(key => key.startsWith('achievement-')).length) : 0}
                </div>
                <div className="text-sm font-bold">पुरस्कार</div>
              </div>
            </div>
            
            <div className="mt-8 bg-yellow-200 border-4 border-black p-4 transform rotate-1">
              <p className="text-lg font-bold text-black">
                {completionPercentage >= 90 && "🎉 आप तो पूरे भारतीय हैं! Complete Desi Champion! 🇮🇳"}
                {completionPercentage >= 75 && completionPercentage < 90 && "🔥 Bohot Accha! Almost Full Indian Experience!"}
                {completionPercentage >= 50 && completionPercentage < 75 && "👍 Thik Hai Yaar! Pretty Indian, Keep Going!"}
                {completionPercentage >= 25 && completionPercentage < 50 && "🤔 Kuch Toh Karo! More Indian Experiences Needed!"}
                {completionPercentage < 25 && "😱 Kya Baat Hai! Are You Sure You're Indian?"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Showcase Modal */}
      {showAchievementShowcase && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-yellow-100 border-8 border-red-800 max-w-4xl w-full max-h-[80vh] overflow-auto" style={{
            fontFamily: 'serif',
            boxShadow: '15px 15px 0px #8b4513'
          }}>
            {/* Header */}
            <div className="bg-red-800 text-yellow-100 p-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold">🏆 आपके पुरस्कार 🏆</h2>
              <button
                onClick={() => setShowAchievementShowcase(false)}
                className="text-yellow-100 hover:text-red-200 text-2xl font-bold border-2 border-yellow-100 px-3 py-1"
              >
                ✕
              </button>
            </div>

            {/* Achievement Stats */}
            <div className="p-6 bg-yellow-200 border-b-4 border-red-800">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-red-800 text-yellow-100 p-3 border-2 border-black">
                  <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
                  <div className="text-xs">UNLOCKED</div>
                </div>
                <div className="bg-red-800 text-yellow-100 p-3 border-2 border-black">
                  <div className="text-2xl font-bold">{allPossibleAchievements.length}</div>
                  <div className="text-xs">TOTAL</div>
                </div>
                <div className="bg-red-800 text-yellow-100 p-3 border-2 border-black">
                  <div className="text-2xl font-bold">
                    {Math.round((unlockedAchievements.length / allPossibleAchievements.length) * 100)}%
                  </div>
                  <div className="text-xs">COMPLETE</div>
                </div>
                <div className="bg-red-800 text-yellow-100 p-3 border-2 border-black">
                  <div className="text-2xl font-bold">
                    {unlockedAchievements.filter(a => a.rarity === 'legendary').length}
                  </div>
                  <div className="text-xs">LEGENDARY</div>
                </div>
              </div>
            </div>

            {/* Achievement Grid */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPossibleAchievements.map((achievement) => {
                  const unlocked = unlockedAchievements.find(u => u.id === achievement.id);
                  const rarityColors = {
                    common: 'bg-gray-200 border-gray-600',
                    rare: 'bg-blue-200 border-blue-600',
                    epic: 'bg-purple-200 border-purple-600',
                    legendary: 'bg-yellow-200 border-yellow-600'
                  };

                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 border-4 transition-all ${
                        unlocked 
                          ? `${rarityColors[achievement.rarity]} transform rotate-1` 
                          : 'bg-gray-100 border-gray-400 opacity-50'
                      }`}
                      style={{
                        boxShadow: unlocked ? '4px 4px 0px #8b4513' : 'none'
                      }}
                    >
                      {unlocked && (
                        <div className="absolute -top-2 -right-2 bg-green-600 text-white px-2 py-1 text-xs font-bold transform rotate-12">
                          ✓
                        </div>
                      )}
                      
                      <div className="text-center">
                        <div className="text-3xl mb-2">
                          {unlocked ? achievement.icon : '🔒'}
                        </div>
                        <div className="font-bold text-black text-sm mb-1">
                          {unlocked ? achievement.name : '???'}
                        </div>
                        <div className="text-xs text-gray-700 mb-2">
                          {unlocked ? achievement.description : 'अभी तक अनलॉक नहीं हुआ'}
                        </div>
                        <div className={`text-xs font-bold uppercase px-2 py-1 ${
                          unlocked ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {achievement.rarity}
                        </div>
                        {unlocked && (
                          <div className="text-xs text-gray-600 mt-1">
                            {unlocked.unlockedAt.toLocaleDateString('hi-IN')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer message */}
            <div className="bg-red-800 text-yellow-100 p-4 text-center">
              <p className="font-bold">
                {unlockedAchievements.length === allPossibleAchievements.length 
                  ? "🎉 वाह! आपने सभी पुरस्कार जीते हैं! 🎉" 
                  : `अभी भी ${allPossibleAchievements.length - unlockedAchievements.length} पुरस्कार बाकी हैं!`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}