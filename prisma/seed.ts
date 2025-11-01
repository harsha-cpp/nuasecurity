import { PrismaClient } from '@prisma/client'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

// Load .env.flags if present from project root (ESM-safe __dirname)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const envPath = path.resolve(root, '..', '.env.flags')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

const prisma = new PrismaClient()

async function main() {
  await prisma.$transaction([
    prisma.adminComment.deleteMany({}),
    prisma.draftExtra.deleteMany({}),
    prisma.post.deleteMany({}),
    prisma.contact.deleteMany({}),
    prisma.secret.deleteMany({}),
    prisma.$executeRawUnsafe(`DELETE FROM Product`),
  ])

  const categories = ['Technology', 'Lifestyle', 'Business', 'Travel', 'Health', 'Education']

  const postsData = [
    { 
      title: 'The Future of Artificial Intelligence in Everyday Life', 
      category: categories[0], 
      body: 'Artificial Intelligence is rapidly transforming how we interact with technology in our daily lives. From smart home devices that learn our preferences to AI-powered personal assistants that help manage our schedules, the integration of AI into everyday applications is becoming seamless and intuitive.\n\nMachine learning algorithms are now capable of predicting our needs before we even realize them ourselves. Smart thermostats adjust temperature based on our routines, streaming services recommend content tailored to our tastes, and navigation apps optimize routes in real-time based on traffic patterns.\n\nThe healthcare industry is experiencing a revolution through AI-powered diagnostic tools that can detect diseases earlier and more accurately than traditional methods. Wearable devices continuously monitor our vital signs and can alert us to potential health issues before they become serious.\n\nAs we move forward, the key challenge will be ensuring that AI development remains ethical and beneficial for all of humanity. Privacy concerns, job displacement, and algorithmic bias are important considerations that must be addressed as AI becomes more prevalent in our society.\n\nThe future promises even more exciting developments: autonomous vehicles, personalized education platforms, and AI companions that can provide emotional support and companionship to those who need it most.'
    },
    { 
      title: 'Sustainable Living: Small Changes, Big Impact', 
      category: categories[1], 
      body: 'Living sustainably doesn\'t require dramatic lifestyle overhauls. Small, consistent changes in our daily habits can collectively make a significant environmental impact while often saving money and improving our quality of life.\n\nStart with energy consumption in your home. LED light bulbs use 75% less energy than traditional incandescent bulbs and last 25 times longer. Smart power strips can eliminate phantom energy draw from electronics in standby mode. Simple adjustments to your thermostat - just 2 degrees lower in winter and higher in summer - can reduce energy bills by up to 10%.\n\nTransportation choices offer another avenue for positive change. Walking, cycling, or using public transportation for short trips not only reduces carbon emissions but also provides health benefits and can be more economical than driving. For longer distances, carpooling or ride-sharing can significantly reduce individual environmental impact.\n\nIn the kitchen, reducing food waste is both environmentally and financially beneficial. Planning meals, storing food properly, and composting organic waste can cut household food waste by up to 40%. Choosing locally sourced, seasonal produce supports local economies and reduces transportation-related emissions.\n\nWater conservation through simple measures like fixing leaks, taking shorter showers, and collecting rainwater for gardens can reduce water usage by 20-30%. These small actions, when adopted by many, create substantial positive environmental change.'
    },
    { 
      title: 'Remote Work Revolution: Building Effective Virtual Teams', 
      category: categories[2], 
      body: 'The shift to remote work has fundamentally changed how businesses operate, requiring new strategies for team collaboration, communication, and culture building. Successful remote teams don\'t just replicate in-office practices digitally; they reimagine how work gets done.\n\nCommunication becomes the cornerstone of remote team success. Clear, documented processes replace casual hallway conversations. Regular check-ins, both formal and informal, help maintain team cohesion. Video calls for important discussions preserve non-verbal communication cues that text-based communication lacks.\n\nTechnology infrastructure must support seamless collaboration. Cloud-based project management tools, shared document platforms, and reliable video conferencing systems are essential. However, technology alone isn\'t sufficient - teams need established protocols for when and how to use different communication channels.\n\nTrust and autonomy become more critical in remote environments. Managers must shift from monitoring activity to measuring outcomes. Clear goal-setting, regular feedback, and results-oriented performance metrics help maintain accountability while preserving flexibility.\n\nMaintaining company culture requires intentional effort. Virtual coffee chats, online team-building activities, and digital social spaces help preserve the human connections that drive engagement and innovation. Some companies are adopting hybrid models that combine remote flexibility with periodic in-person collaboration.\n\nThe future of work is likely to be increasingly flexible, with organizations that master remote collaboration gaining competitive advantages in talent acquisition and retention.'
    },
    { 
      title: 'Hidden Gems: Discovering Europe\'s Lesser-Known Destinations', 
      category: categories[3], 
      body: 'While Paris, Rome, and London captivate millions of visitors annually, Europe\'s true treasures often lie in its lesser-known destinations. These hidden gems offer authentic cultural experiences, stunning landscapes, and rich histories without the overwhelming crowds of major tourist centers.\n\nEstonia\'s capital, Tallinn, presents a perfectly preserved medieval old town surrounded by modern innovation. The city\'s digital infrastructure is among the world\'s most advanced, yet its cobblestone streets and Gothic architecture transport visitors back centuries. The nearby Lahemaa National Park offers pristine forests, coastal cliffs, and traditional fishing villages.\n\nPortugal\'s Azores archipelago provides volcanic landscapes, natural hot springs, and some of Europe\'s most pristine lakes. São Miguel island features colorful crater lakes, tea plantations, and charming towns with Portuguese colonial architecture. The islands offer excellent hiking, whale watching, and thermal spa experiences.\n\nSlovenia\'s Lake Bled may be gaining recognition, but the country\'s Soča Valley remains relatively undiscovered. The emerald Soča River winds through dramatic Alpine scenery, offering world-class kayaking, hiking, and photography opportunities. The region\'s World War I history adds depth to its natural beauty.\n\nNorth Macedonia\'s Ohrid combines ancient history with stunning natural beauty. This UNESCO World Heritage site sits on one of Europe\'s oldest and deepest lakes, surrounded by mountains and dotted with Byzantine churches and Ottoman-era architecture.\n\nThese destinations offer travelers the opportunity to experience authentic European culture while supporting local communities that benefit from sustainable tourism development.'
    },
    { 
      title: 'Mental Health in the Digital Age: Finding Balance', 
      category: categories[4], 
      body: 'The digital revolution has transformed how we work, communicate, and entertain ourselves, but it has also created new challenges for mental health and well-being. Understanding these challenges and developing healthy digital habits is crucial for maintaining psychological balance in our connected world.\n\nConstant connectivity can create an "always-on" mentality that makes it difficult to truly disconnect and recharge. The expectation of immediate responses to emails, messages, and notifications can generate chronic stress and anxiety. Setting clear boundaries around digital communication helps preserve mental space for rest and reflection.\n\nSocial media platforms, while connecting us with others, can also fuel comparison and inadequacy feelings. The curated nature of online content often presents unrealistic standards of success, happiness, and lifestyle. Practicing mindful consumption of social media - being selective about follows, limiting usage time, and remembering that online presentations rarely reflect complete reality - helps maintain perspective.\n\nScreen time before bed can significantly impact sleep quality due to blue light exposure and mental stimulation. Establishing device-free bedrooms and implementing digital curfews can improve sleep hygiene and overall mental health. Many people find that reading physical books or practicing meditation before bed creates better sleep conditions.\n\nThe digital world offers valuable mental health resources: meditation apps, online therapy platforms, and supportive communities for various challenges. The key is using technology intentionally rather than passively consuming digital content.\n\nRegular digital detoxes - periods of intentional disconnection - can help reset our relationship with technology and remind us of the value of offline experiences and face-to-face connections.'
    },
    { 
      title: 'The Art of Lifelong Learning: Strategies for Continuous Growth', 
      category: categories[5], 
      body: 'In our rapidly evolving world, the ability to continuously learn and adapt has become more valuable than any specific skill or knowledge set. Lifelong learning isn\'t just about career advancement; it\'s about maintaining curiosity, cognitive health, and personal fulfillment throughout life.\n\nEffective learning strategies have evolved beyond traditional classroom models. Microlearning - consuming information in small, focused chunks - aligns with how our brains naturally process and retain information. Spending 15-20 minutes daily on a new subject can lead to substantial knowledge accumulation over time.\n\nThe concept of "learning how to learn" has become fundamental. Understanding your personal learning style, whether visual, auditory, or kinesthetic, helps optimize study methods. Active recall techniques, spaced repetition, and teaching others what you\'ve learned significantly improve retention compared to passive reading or listening.\n\nTechnology has democratized access to high-quality education. Online platforms offer courses from world-renowned institutions, often for free or at minimal cost. Podcasts, YouTube channels, and educational apps make learning possible during commutes, exercise, or other routine activities.\n\nCross-disciplinary learning often yields the most innovative insights. Combining knowledge from different fields - such as applying design principles to business problems or using psychological insights in technology development - creates unique perspectives and solutions.\n\nBuilding learning communities, whether online or offline, provides motivation, accountability, and diverse perspectives. Study groups, book clubs, and professional development networks create supportive environments for intellectual growth.\n\nThe goal isn\'t to become an expert in everything, but to maintain intellectual curiosity and adaptability that enables continuous personal and professional development.'
    },
    { 
      title: 'Blockchain Beyond Cryptocurrency: Real-World Applications', 
      category: categories[0], 
      body: 'While cryptocurrency dominates blockchain headlines, the underlying technology offers transformative potential across numerous industries. Blockchain\'s core features - decentralization, transparency, and immutability - address fundamental challenges in trust, verification, and data integrity.\n\nSupply chain management represents one of blockchain\'s most promising applications. Companies can track products from origin to consumer, ensuring authenticity and ethical sourcing. Walmart uses blockchain to trace food products, enabling rapid identification of contamination sources during food safety incidents. This transparency builds consumer trust and reduces waste.\n\nHealthcare systems benefit from blockchain\'s secure, interoperable data sharing capabilities. Patient records stored on blockchain networks can be accessed by authorized healthcare providers while maintaining privacy and security. This eliminates duplicate tests, reduces medical errors, and enables more comprehensive treatment approaches.\n\nVoting systems built on blockchain technology could address concerns about election integrity and accessibility. Immutable vote records, transparent counting processes, and remote voting capabilities could increase democratic participation while maintaining security and verifiability.\n\nIntellectual property protection becomes more robust with blockchain-based timestamp services. Artists, writers, and inventors can establish creation dates and ownership rights in ways that are difficult to dispute or forge. This democratizes intellectual property protection for individual creators.\n\nReal estate transactions, traditionally complex and paper-heavy, can be streamlined through smart contracts on blockchain platforms. Property transfers, escrow services, and title verification can be automated, reducing costs and processing times while increasing transparency.\n\nThe technology\'s potential extends to carbon credit trading, digital identity verification, and decentralized internet infrastructure, promising a more transparent and equitable digital future.'
    },
    { 
      title: 'Minimalism: The Philosophy of Intentional Living', 
      category: categories[1], 
      body: 'Minimalism extends far beyond decluttering physical spaces; it\'s a philosophy of intentional living that prioritizes what truly matters while eliminating excess that distracts from meaningful experiences and relationships.\n\nThe journey often begins with physical possessions. The process of evaluating each item\'s value and purpose reveals patterns of consumption and attachment. Many discover that owning fewer, higher-quality items brings more satisfaction than accumulating numerous possessions. This shift from quantity to quality applies to clothing, furniture, technology, and decorative objects.\n\nDigital minimalism addresses the overwhelming nature of modern information consumption. Curating social media feeds, unsubscribing from unnecessary emails, and organizing digital files creates mental space for focused thinking and creativity. Many practitioners find that reducing digital noise improves concentration and reduces anxiety.\n\nTime minimalism involves saying no to commitments that don\'t align with personal values or goals. This creates space for activities and relationships that bring genuine fulfillment. The practice often reveals how much time was previously spent on obligations that provided little value or joy.\n\nFinancial minimalism focuses on conscious spending aligned with personal values. Rather than restricting all purchases, it involves thoughtful consideration of how money can best support desired lifestyle and goals. This often leads to increased savings and reduced financial stress.\n\nThe psychological benefits of minimalism include reduced decision fatigue, increased focus, and greater appreciation for experiences over possessions. Many practitioners report improved mental clarity, stronger relationships, and a greater sense of purpose.\n\nMinimalism isn\'t about deprivation; it\'s about creating space for what matters most by removing what doesn\'t serve your authentic self and goals.'
    },
    { 
      title: 'The Gig Economy: Navigating Freelance Success', 
      category: categories[2], 
      body: 'The gig economy has transformed traditional employment models, offering flexibility and autonomy while requiring new skills in self-management, marketing, and financial planning. Success in freelance work demands both professional expertise and entrepreneurial mindset.\n\nBuilding a sustainable freelance career starts with identifying marketable skills and target clients. Specialization often proves more profitable than generalization, as clients pay premium rates for specific expertise. Developing a niche allows freelancers to become recognized authorities in their fields, leading to referrals and higher-value projects.\n\nPersonal branding becomes crucial in competitive freelance markets. A professional online presence, including portfolio websites, social media profiles, and client testimonials, establishes credibility and attracts potential clients. Consistent messaging across platforms reinforces expertise and reliability.\n\nPricing strategies significantly impact freelance success. Many new freelancers undervalue their services, leading to unsustainable workloads and financial stress. Researching market rates, calculating true hourly costs including taxes and benefits, and confidently communicating value helps establish profitable pricing structures.\n\nClient relationship management extends beyond project delivery. Clear communication, established boundaries, and professional contracts protect both parties and build long-term partnerships. Satisfied clients become sources of repeat business and referrals, reducing marketing efforts over time.\n\nFinancial management requires discipline and planning. Irregular income demands emergency funds, separate business accounts, and quarterly tax planning. Many successful freelancers diversify income streams through multiple clients, passive income sources, or hybrid employment arrangements.\n\nThe gig economy offers unprecedented opportunities for those willing to develop both professional skills and business acumen necessary for independent success.'
    },
    { 
      title: 'Culinary Adventures: Exploring Global Street Food Culture', 
      category: categories[3], 
      body: 'Street food represents the authentic heart of global culinary traditions, offering travelers and food enthusiasts access to local flavors, cooking techniques, and cultural experiences that restaurants often cannot replicate. These humble food stalls and mobile vendors preserve centuries-old recipes while adapting to modern tastes and ingredients.\n\nAsia\'s street food scene showcases incredible diversity and innovation. Bangkok\'s floating markets serve boat noodles and mango sticky rice from vendors who have perfected their recipes over generations. Tokyo\'s yakitori stands offer perfectly grilled skewers paired with cold beer, creating intimate dining experiences in bustling urban environments. Mumbai\'s chaat vendors combine sweet, sour, and spicy flavors in complex dishes that challenge Western palate expectations.\n\nLatin American street food reflects indigenous ingredients and colonial influences. Mexico City\'s taco stands serve authentic preparations using traditional techniques like nixtamalized corn and slow-cooked meats. Lima\'s anticucho vendors grill marinated beef heart skewers that represent Peru\'s fusion of indigenous and immigrant culinary traditions.\n\nMiddle Eastern street food emphasizes fresh ingredients and aromatic spices. Istanbul\'s döner kebab vendors slice perfectly seasoned meat from rotating spits, while falafel stands throughout the region serve crispy chickpea fritters with tahini and fresh vegetables.\n\nEuropean street food traditions range from German currywurst to Belgian waffles, each reflecting local ingredients and cultural preferences. These foods often represent comfort and community, bringing people together around shared culinary experiences.\n\nExploring street food safely requires basic precautions: choosing busy stalls with high turnover, observing food handling practices, and starting with small portions to test tolerance. The rewards include authentic flavors, cultural connections, and memorable travel experiences that expensive restaurants rarely provide.'
    },
    { 
      title: 'The Science of Sleep: Optimizing Rest for Peak Performance', 
      category: categories[4], 
      body: 'Sleep science has revealed that quality rest is not a luxury but a fundamental requirement for physical health, cognitive function, and emotional well-being. Understanding sleep mechanisms and optimizing sleep habits can dramatically improve quality of life and performance in all areas.\n\nSleep occurs in cycles lasting approximately 90 minutes, progressing through light sleep, deep sleep, and REM (Rapid Eye Movement) phases. Each stage serves specific functions: light sleep facilitates the transition between wakefulness and deeper rest, deep sleep enables physical recovery and memory consolidation, while REM sleep processes emotions and enhances creativity.\n\nCircadian rhythms, our internal biological clocks, regulate sleep-wake cycles based on light exposure and daily activities. Maintaining consistent sleep and wake times, even on weekends, helps stabilize these rhythms. Exposure to natural light during the day and minimizing blue light exposure in the evening supports healthy circadian function.\n\nSleep environment significantly impacts rest quality. Optimal conditions include cool temperatures (65-68°F), complete darkness, and minimal noise. Comfortable mattresses and pillows that support proper spinal alignment prevent discomfort that can fragment sleep. Many people benefit from blackout curtains, white noise machines, or earplugs.\n\nPre-sleep routines signal the body to prepare for rest. Activities like reading, gentle stretching, or meditation help transition from daily stress to relaxation. Avoiding caffeine after 2 PM, limiting alcohol consumption, and finishing meals at least three hours before bedtime prevent substances from interfering with sleep quality.\n\nSleep debt - the cumulative effect of insufficient rest - cannot be fully repaid through weekend sleeping. Chronic sleep deprivation impairs immune function, increases accident risk, and contributes to numerous health problems including obesity, diabetes, and cardiovascular disease.\n\nPrioritizing sleep as essential self-care rather than viewing it as time lost to productivity creates the foundation for sustained high performance and well-being.'
    },
    { 
      title: 'Digital Photography: Mastering Composition in the Smartphone Era', 
      category: categories[5], 
      body: 'The democratization of photography through smartphone technology has made high-quality image creation accessible to everyone. However, technical accessibility doesn\'t automatically translate to compelling photographs. Understanding composition principles and developing visual awareness elevates smartphone photography from casual snapshots to meaningful artistic expression.\n\nThe rule of thirds provides a foundational framework for balanced compositions. Imagining a grid that divides the frame into nine equal sections, placing subjects along these lines or at their intersections creates more dynamic and visually interesting images than centering subjects. Most smartphone cameras include grid overlays to assist with this technique.\n\nLeading lines guide viewers\' eyes through photographs, creating depth and directing attention to focal points. Natural elements like rivers, paths, or architectural features can serve as leading lines, while urban environments offer opportunities through streets, bridges, and building edges. Diagonal lines often create more dynamic compositions than horizontal or vertical ones.\n\nLighting dramatically affects mood and image quality. The "golden hour" - the period shortly after sunrise or before sunset - provides warm, soft light that flatters subjects and creates appealing shadows. Overcast conditions offer even, diffused lighting ideal for portraits and detailed subjects. Understanding how different lighting conditions affect photographs enables intentional mood creation.\n\nForeground, middle ground, and background elements create depth in two-dimensional images. Including interesting foreground elements while maintaining focus on the main subject adds layers that engage viewers and create three-dimensional feel. This technique works particularly well in landscape and architectural photography.\n\nPost-processing applications allow fine-tuning of exposure, contrast, and color balance. However, the goal should be enhancing rather than dramatically altering reality. Subtle adjustments often produce more compelling results than heavy filtering or manipulation.\n\nDeveloping photographic vision involves practicing observation, studying light and shadow, and experimenting with different perspectives and angles to discover unique ways of seeing familiar subjects.'
    }
  ]

  // Create all published posts
  const createdPosts = await Promise.all(
    postsData.map((p) => prisma.post.create({ data: { ...p, isPublished: true } }))
  )

  // Add some sample admin comments for blog management
  await prisma.adminComment.createMany({
    data: [
      { comment: 'Remember to review new posts before publishing.', hidden: true },
      { comment: 'Consider adding more categories as the blog grows.', hidden: true },
      { comment: 'Great engagement on the AI and minimalism posts!', hidden: true },
    ],
  })

  // Add a sample contact message
  await prisma.contact.create({
    data: { 
      name: 'Sarah Johnson', 
      email: 'sarah.johnson@email.com', 
      message: 'Love the blog! The article on sustainable living really inspired me to make changes in my daily routine. Keep up the great work!' 
    },
  })

  // Seed products
  const products = [
    { title: 'Wireless Headphones', category_id: 1, price: 199.99 },
    { title: 'Travel Backpack', category_id: 3, price: 89.5 },
    { title: 'Yoga Mat', category_id: 5, price: 24.99 },
    { title: 'Smartwatch', category_id: 1, price: 149.0 },
    { title: 'Business Notebook', category_id: 2, price: 12.99 },
    { title: 'Photo Tripod', category_id: 4, price: 59.0 },
  ]
  for (const p of products) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO Product (title, category_id, price) VALUES ('${p.title}', ${p.category_id}, ${p.price})`
    )
  }

  // Add secrets
  await prisma.secret.create({ data: { kind: 'blog', sflag: 'BLOG_ADMIN_SECRET_2024' } })
  await prisma.secret.create({ data: { kind: 'sqli', sflag: process.env.SQLI_FLAG_A || 'CTF_SQLI_FLAG_A_PLACEHOLDER' } })

  console.log('Seed completed successfully:', {
    posts: createdPosts.length,
    categories: categories.length,
    adminComments: 3,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })



