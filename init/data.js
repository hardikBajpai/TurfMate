const sampleTurfs = [
  {
    name: "PowerPlay Arena",
    location: "Kanpur",
    price: 1200,
    image: "https://5.imimg.com/data5/SELLER/Default/2022/1/ZW/MQ/CO/15068556/box-cricket-500x500.png"
  },
  {
    name: "Boundary Blasters",
    location: "Lucknow",
    price: 1500,
    image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a"
  },
  {
    name: "Champion Turf",
    location: "Delhi",
    price: 1800,
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e"
  },
  {
    name: "Night Riders Arena",
    location: "Noida",
    price: 1300,
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d"
  },
  {
    name: "Super Over Ground",
    location: "Ghaziabad",
    price: 1400,
    image: "https://images.unsplash.com/photo-1505842465776-3d90f616310d"
  },
  {
    name: "Victory Turf",
    location: "Mumbai",
    price: 2200,
    image: "https://images.unsplash.com/photo-1486286701208-1d58e9338013"
  },
  {
    name: "Hitman Arena",
    location: "Pune",
    price: 1600,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc"
  },
  {
    name: "Sky Shot Turf",
    location: "Hyderabad",
    price: 1700,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b"
  },
  {
    name: "Sixer Point",
    location: "Bangalore",
    price: 2000,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55"
  },
  {
    name: "Greenfield Arena",
    location: "Chennai",
    price: 1450,
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20"
  },

  {
    name: "Thunder Turf",
    location: "Jaipur",
    price: 1350,
    image: "https://images.unsplash.com/photo-1508098682722-e99c643e7485"
  },
  {
    name: "Elite Cricket Hub",
    location: "Ahmedabad",
    price: 1750,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12"
  },
  {
    name: "Rapid Fire Turf",
    location: "Indore",
    price: 1250,
    image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0"
  },
  {
    name: "Royal Strikers",
    location: "Patna",
    price: 1150,
    image: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402"
  },
  {
    name: "Cricket Hub",
    location: "Bhopal",
    price: 1550,
    image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460"
  },
  {
    name: "Master Blasters",
    location: "Surat",
    price: 1650,
    image: "https://images.unsplash.com/photo-1502904550040-7534597429ae"
  },
  {
    name: "Turf Titans",
    location: "Nagpur",
    price: 1400,
    image: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5"
  },
  {
    name: "Prime Sports Arena",
    location: "Chandigarh",
    price: 1900,
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e"
  },
  {
    name: "Spin Masters Turf",
    location: "Ranchi",
    price: 1500,
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68"
  },
  {
    name: "Box Cricket Zone",
    location: "Kolkata",
    price: 2100,
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974"
  },

  {
    name: "Stadium Edge",
    location: "Meerut",
    price: 1300,
    image: ""
  },
  {
    name: "Game Changers Arena",
    location: "Agra",
    price: 1250,
    image: ""
  },
  {
    name: "All Stars Turf",
    location: "Varanasi",
    price: 1450,
    image: ""
  },
  {
    name: "Winning Shot Arena",
    location: "Prayagraj",
    price: 1550,
    image: ""
  },
  {
    name: "Urban Cricket Box",
    location: "Dehradun",
    price: 1750,
    image: ""
  },
  {
    name: "Fast Track Turf",
    location: "Amritsar",
    price: 1600,
    image: ""
  },
  {
    name: "Legends Arena",
    location: "Jodhpur",
    price: 1800,
    image: ""
  },
  {
    name: "BlueSky Turf",
    location: "Udaipur",
    price: 1400,
    image: ""
  },
  {
    name: "CricKing Arena",
    location: "Raipur",
    price: 1500,
    image: ""
  },
  {
    name: "Turf Warriors",
    location: "Gwalior",
    price: 1350,
    image: ""
  },

  {
    name: "Dream11 Arena",
    location: "Nashik",
    price: 1700,
    image: ""
  },
  {
    name: "Street Cricket Hub",
    location: "Aurangabad",
    price: 1200,
    image: ""
  },
  {
    name: "Golden Wickets",
    location: "Faridabad",
    price: 1450,
    image: ""
  },
  {
    name: "Boundary Kings",
    location: "Sonipat",
    price: 1500,
    image: ""
  },
  {
    name: "Power Hitters Turf",
    location: "Panipat",
    price: 1350,
    image: ""
  },
  {
    name: "Victory Ground",
    location: "Shimla",
    price: 2000,
    image: ""
  },
  {
    name: "The Cricket Bay",
    location: "Mysore",
    price: 1650,
    image: ""
  },
  {
    name: "Ultimate Turf Zone",
    location: "Coimbatore",
    price: 1550,
    image: ""
  },
  {
    name: "Arena 11",
    location: "Visakhapatnam",
    price: 1750,
    image: ""
  },
  {
    name: "Turbo Turf",
    location: "Vijayawada",
    price: 1500,
    image: ""
  },

  {
    name: "Pitch Masters",
    location: "Trivandrum",
    price: 1600,
    image: ""
  },
  {
    name: "Cricket Square",
    location: "Kochi",
    price: 1800,
    image: ""
  },
  {
    name: "SportsVille Turf",
    location: "Madurai",
    price: 1450,
    image: ""
  },
  {
    name: "Kingdom Arena",
    location: "Salem",
    price: 1300,
    image: ""
  },
  {
    name: "GamePoint Turf",
    location: "Hubli",
    price: 1400,
    image: ""
  },
  {
    name: "The Turf Spot",
    location: "Belgaum",
    price: 1500,
    image: ""
  },
  {
    name: "Victory Box Cricket",
    location: "Jammu",
    price: 1700,
    image: ""
  },
  {
    name: "Champion Sports Hub",
    location: "Srinagar",
    price: 2100,
    image: ""
  },
  {
    name: "Cricket Fever Arena",
    location: "Guwahati",
    price: 1550,
    image: ""
  },
  {
    name: "Mega Turf Arena",
    location: "Shillong",
    price: 1650,
    image: ""
  }
];

module.exports = { data: sampleTurfs };