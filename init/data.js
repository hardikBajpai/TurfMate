const turfs = [
  {
    name: "Green Arena",
    location: "Swaroop Nagar, Kanpur",
    price: 800,
    image: "https://ahmadboxcricket.com/assets/box-cricket-turf-UKr9cJhH.png",
    description:
      "Green Arena is one of Kanpur's premier box cricket facilities, nestled in the heart of Swaroop Nagar. Built on a fully synthetic grass pitch with high-mast LED floodlights and professional-grade cricket nets, it caters to corporate matches, weekend tournaments, and casual games with equal ease. The turf is regularly maintained to ensure consistent bounce and a clean playing surface throughout the year.\n\nThe venue comfortably accommodates up to 14 players per session and comes equipped with a spacious spectator gallery, clean changing rooms with lockers, and an in-house refreshment counter serving chai, cold drinks, and light snacks. The management is known for punctual slot handovers and a hassle-free booking experience.",
  },
  {
    name: "Thunder Ground",
    location: "Vikas Nagar, Lucknow",
    price: 1200,
    image: "https://tse4.mm.bing.net/th/id/OIP.PVljzDao3U_MJYF5rW947AHaEK?pid=Api&P=0&h=180",
    description:
      "Thunder Ground in Vikas Nagar is a sprawling outdoor cricket facility built for both serious players and casual enthusiasts in Lucknow. The ground features a premium red-clay pitch with a full run-up space, alongside a dual-net practice zone that is ideal for dedicated batting and bowling drills. The spacious outfield and generous boundary dimensions make matches feel authentic and exciting.\n\nWith dedicated parking for 30+ vehicles, high-wattage floodlights for seamless evening matches, and a lively canteen serving hot meals and refreshments, Thunder Ground has established itself as a go-to cricket destination in the Vikas Nagar belt. It's a popular choice for school and college-level tournaments held throughout the year.",
  },
  {
    name: "Pitch Perfect Arena",
    location: "Kidwai Nagar, Kanpur",
    price: 900,
    image: "https://blog.playo.co/wp-content/uploads/2018/07/DSC_5239-1024x684.jpg",
    description:
      "Pitch Perfect Arena in Kidwai Nagar is a compact yet thoroughly equipped box cricket facility designed for quick evening games, college tournaments, and corporate outings in Kanpur. The astroturf surface ensures consistent bounce and comfortable play even during light drizzle, making it a reliable option throughout the season. The enclosed format keeps the game tight and competitive, which players love.\n\nThe facility offers AC changing rooms, a comfortable lounge area with ample seating, CCTV coverage across all playing zones, and equipment rental for teams who prefer travelling light. Capacity is capped at 12 players per match to maintain a quality playing experience. It's one of the most well-reviewed mid-range turfs in the city.",
  },
  {
    name: "SportZone Arena",
    location: "Gomti Nagar, Lucknow",
    price: 1500,
    image: "https://5.imimg.com/data5/SELLER/Default/2022/8/VR/WV/DB/111042024/box-cricket-setup-1000x1000.jpeg",
    description:
      "SportZone Arena in Gomti Nagar is among the most premium cricket facilities in Lucknow's rapidly developing eastern corridor. Spread across a large complex, it houses two independent box cricket pitches with international-standard synthetic turf, pro-level net enclosures, and a digital scoreboard that adds a professional touch to every match. The pitches are maintained by a full-time groundskeeping crew.\n\nThe venue has regularly hosted inter-corporate and college-level tournaments and attracts coaching camps owing to its world-class infrastructure. With spectator seating for 30, clean and modern restrooms, and a fully stocked sports café serving protein snacks, smoothies, and full meals, SportZone Arena is worth every rupee for teams that want the best experience Lucknow has to offer.",
  },
  {
    name: "Elite Turf Co.",
    location: "Harsh Nagar, Kanpur",
    price: 950,
    image: "https://www.turfpe.in/images/g5.jpg",
    description:
      "Elite Turf Co. in Harsh Nagar is a mid-size box cricket ground known for its impeccable turf maintenance and warm, player-friendly management. The facility runs all-day slots from 6 AM to midnight, making it a favourite for both early-morning fitness enthusiasts and the late-night cricket crowd that Kanpur is famous for. Bookings fill up quickly on weekends, so advance reservation is strongly advised.\n\nAmenities include free on-site parking, drinking water stations at multiple points around the ground, a modest refreshment kiosk, and optional cricket equipment hire for teams that need bats, gloves, or pads. The turf comfortably fits teams of up to 12 players and is brilliantly lit with stadium-grade floodlights that eliminate shadows across the pitch.",
  },
  {
    name: "Crease Club",
    location: "Alambagh, Lucknow",
    price: 850,
    image: "https://5.imimg.com/data5/SELLER/Default/2021/8/OJ/ID/YQ/133158695/ae-artificial-cricket-turf-pitch-1000x1000.jpg",
    description:
      "Crease Club is Alambagh's most beloved neighbourhood cricket ground, offering an affordable and consistently well-maintained outdoor turf experience just minutes from the busy Alambagh bus station. The pitch is laid on high-quality artificial grass that closely mimics natural playing conditions, making it a hit among players who prefer the feel of traditional outdoor cricket in a managed setting.\n\nIdeal for Sunday league games, birthday matches, or casual knockouts with friends, Crease Club supports up to 16 players per match and provides shaded seating for spectators, a small chilled-drinks stall, and ample street parking on the adjoining lane. Its affordable pricing and central location make it the top choice for value-conscious cricket enthusiasts across Lucknow.",
  },
  {
    name: "Kings Cricket Hub",
    location: "Govind Nagar, Kanpur",
    price: 1100,
    image: "https://media.hudle.in/venues/de73e0db-949d-4c37-b7d5-145f93cb9bcd/photo/f1da100a2d65a4821b1df615f601f79107fe0ea7",
    description:
      "Kings Cricket Hub in Govind Nagar is a fully enclosed turf facility built with serious cricket in mind. Featuring reinforced net walls, a cushioned astroturf pitch with a non-slip rubberised base, and automated LED lighting with no dead zones, every element of the venue has been designed to deliver the ideal playing experience. The pitch strip itself has been professionally laid to simulate match-day conditions.\n\nThe venue offers locker facilities, a dedicated player lounge with fans and comfortable benches, and on-site coaching sessions available on weekends with qualified BCCI-certified coaches. With a match capacity of 14 players and slots bookable in one-hour increments online or via phone, Kings Cricket Hub is widely regarded as the most efficiently run facility in the Govind Nagar–Kalyanpur corridor.",
  },
  {
    name: "The Turf Station",
    location: "Hazratganj, Lucknow",
    price: 1350,
    image: "https://5.imimg.com/data5/SELLER/Default/2022/9/GO/PS/LG/11336583/box-cricket-ground-constrcution-1000x1000.jpg",
    description:
      "The Turf Station in Hazratganj is a premium multi-sport complex with a dedicated state-of-the-art box cricket ground right in the heart of Lucknow's most vibrant commercial district. The cricket turf features imported synthetic grass, a precisely laid pitch strip, and surrounding nets constructed to international specifications — all maintained to consistently high standards season after season.\n\nBeyond cricket, the complex features a well-furnished sports lounge, charging stations for devices, and a modern cafeteria serving freshly prepared snacks and beverages throughout operating hours. It is a preferred venue for inter-school tournaments, private leagues, and corporate team-building events. Groups of up to 14 players can take the field comfortably, and the facility accepts both walk-in and advance bookings through its online platform.",
  },
  {
    name: "Ace Grounds",
    location: "Kalyanpur, Kanpur",
    price: 1000,
    image: "https://tse1.mm.bing.net/th/id/OIP.SFuNOH7ZHPQtoySzn6pTZwHaEK?pid=Api&P=0&h=180",
    description:
      "Ace Grounds in Kalyanpur is a well-loved local turf that consistently punches above its price point, offering a premium experience at a very reasonable rate. The facility boasts a freshly relaid synthetic grass pitch, bright dual-pole floodlights that illuminate every corner of the ground, and a completely renovated changing room block finished earlier this year with new flooring and lockers.\n\nOwned and managed by former club-level cricketers, the staff here genuinely understands what players need — smooth and fast check-ins, strict and honest timekeeping, and a clean pitch every single time. It has built a strong loyal base of regulars from IIT Kanpur, HBTU, and nearby corporate parks. Slots fill up exceptionally fast on Saturdays and Sundays, so early booking is strongly recommended. Capacity is 12 players per match.",
  },
  {
    name: "StrikeZone Cricket",
    location: "Aliganj, Lucknow",
    price: 2000,
    image: "https://5.imimg.com/data5/SELLER/Default/2025/7/528127238/YS/HH/CK/163558603/box-cricket-setup-1000x1000.jpg",
    description:
      "StrikeZone Cricket in Aliganj is the most premium turf experience available in Lucknow's northern suburbs, catering to players who refuse to compromise on quality. The facility houses two full-sized box cricket pitches side by side, a professional-grade batting simulator with adjustable speed and trajectory settings, and a dedicated warm-up and stretching zone with rubber flooring. Both pitches have been constructed using the same turf specification used in national-level box cricket events.\n\nThe venue is equipped with HD cameras on every angle for full match recording, a digital player stats display board showing live run rates and wicket counts, and a fully air-conditioned spectator lounge with comfortable stadium-style seating. Private tournaments, corporate team events, and residential coaching academies are hosted here on a regular basis. Team capacity is 16 players per ground, and the facility operates from 5 AM to 1 AM daily.",
  },
];

module.exports = turfs;