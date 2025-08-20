// Constants for SRM IST NCR Ghaziabad AI Campus Assistant

export const HUGGING_FACE_MODEL = "j-hartmann/emotion-english-distilroberta-base"
export const OPENAI_MODEL = "gpt-3.5-turbo"
export const ATTENDANCE_THRESHOLD = 75

// SRM IST Official Information
export const SRM_INFO = {
  name: "SRM Institute of Science and Technology",
  campus: "Delhi-NCR Campus, Ghaziabad (U.P)",
  motto: "Learn. Leap. Lead.",
  website: "https://www.srmup.in/",
  colors: {
    primary: "#1e40af", // Dark Blue
    secondary: "#fbbf24", // Gold
    accent: "#ffffff", // White
  },
  contact: {
    dean: {
      phone: "1800-889-3496",
      email: "dean.ncr@srmist.edu.in",
    },
    director: {
      phone: "011-41676464",
      email: "director.ncr@srmist.edu.in",
    },
    general: "+91-7455000291",
    admissions: "01232-234300",
  },
}

export const CRISIS_KEYWORDS = [
  "overwhelmed",
  "stressed",
  "anxious",
  "depressed",
  "hopeless",
  "can't cope",
  "giving up",
  "too much",
  "breaking down",
  "help me",
]

// SRM IST Departments and Buildings
export const SRM_DEPARTMENTS = [
  { id: "cse", name: "Computer Science & Engineering", building: "Academic Block A" },
  { id: "auto", name: "Automobile Engineering", building: "Engineering Block" },
  { id: "ece", name: "Electronics & Communications Engineering", building: "Academic Block B" },
  { id: "mech", name: "Mechanical Engineering", building: "Engineering Block" },
  { id: "eee", name: "Electrical & Electronics Engineering", building: "Academic Block C" },
  { id: "physics", name: "Physics", building: "Science Block" },
  { id: "chemistry", name: "Chemistry", building: "Science Block" },
  { id: "math", name: "Mathematics", building: "Science Block" },
  { id: "ca", name: "Computer Applications", building: "IT Block" },
  { id: "mgmt", name: "Management Studies", building: "Management Block" },
  { id: "hotel", name: "Hotel Management", building: "Hospitality Block" },
  { id: "pharmacy", name: "Pharmacy", building: "Pharmacy Block" },
  { id: "english", name: "English and Foreign Languages", building: "Humanities Block" },
  { id: "cdc", name: "Career Development Center", building: "Placement Block" },
  { id: "humanities", name: "Science & Humanities", building: "Humanities Block" },
]

export const SRM_FACILITIES = [
  { id: "library", name: "Central Library", location: "Academic Complex" },
  { id: "hostel-boys", name: "Boys Hostel", location: "Residential Area" },
  { id: "hostel-girls", name: "Girls Hostel", location: "Residential Area" },
  { id: "gym", name: "Gymnasium", location: "Sports Complex" },
  { id: "medical", name: "Medical Center", location: "Campus Center" },
  { id: "cafeteria", name: "Student Cafeteria", location: "Campus Center" },
  { id: "sports", name: "Sports Complex", location: "Recreation Area" },
  { id: "yoga", name: "Yoga Centre", location: "Wellness Center" },
  { id: "guest-house", name: "Netaji Subhash Chandra Bose International Boarding House", location: "Guest Area" },
  { id: "atm", name: "ATM", location: "Campus Center" },
  { id: "stationery", name: "Stationery Shop", location: "Campus Center" },
]

// SRM Bus Routes (Real data from transport department)
export const SRM_BUS_ROUTES = [
  { route: "101", driver: "Mr. Tarun", phone: "+91-9756254016", from: "Janakpuri Metro Station", capacity: 54 },
  {
    route: "102",
    driver: "Mr. Sanjay Pal",
    phone: "+91-9927474919",
    from: "Salwan Public School Mayur Vihar",
    capacity: 42,
  },
  { route: "102A", driver: "Mr. Vijay Pal", phone: "+91-8194076386", from: "Parichowk - Greater Noida", capacity: 54 },
  { route: "103", driver: "Mr. Neeraj", phone: "+91-9927866840", from: "Welcome Metro Station", capacity: 54 },
  { route: "104", driver: "Mr. Anup", phone: "+91-9891281456", from: "Kaushambi D3", capacity: 35 },
  { route: "105", driver: "Mr. Mahaveer", phone: "+91-7302608784", from: "Ghaziabad Old Bus Stand", capacity: 54 },
  { route: "106", driver: "Mr. Harendra", phone: "+91-8859875313", from: "Dwarka Mod Metro Station", capacity: 54 },
  { route: "107", driver: "Mr. Inder Pal", phone: "+91-8923450698", from: "Model Town Metro Station", capacity: 54 },
  { route: "107A", driver: "Mr. Shankar", phone: "+91-9868317266", from: "Peeragarhi Chowk", capacity: 54 },
  {
    route: "108",
    driver: "Mr. Sandeep 02",
    phone: "+91-9258598752",
    from: "Rajendra place metro station",
    capacity: 54,
  },
  { route: "109", driver: "Mr. Bijendra", phone: "+91-9045681325", from: "Mayur Vihar Phase 1", capacity: 54 },
  { route: "110", driver: "Mr. Sat veer Singh", phone: "+91-9045142169", from: "Saket Metro Station", capacity: 35 },
  { route: "111", driver: "Mr. Anup", phone: "+91-9891281456", from: "Rajnagar Extension", capacity: 35 },
  {
    route: "112",
    driver: "Mr. Sandeep",
    phone: "+91-7599449890",
    from: "Jagriti Vihar Shastri Nagar Meerut",
    capacity: 42,
  },
  { route: "112A", driver: "Mr. Kuldeep", phone: "+91-8937015423", from: "Modipurum", capacity: 42 },
  { route: "113", driver: "Mr. Rakesh Pal", phone: "+91-8218159810", from: "Babugarh Chawani", capacity: 35 },
]

export const NFT_CATEGORIES = {
  ATTENDANCE: "Perfect Attendance",
  ENGAGEMENT: "High Engagement",
  ACHIEVEMENT: "Academic Achievement",
  PARTICIPATION: "Active Participation",
}

export const ALERT_TYPES = {
  GAS_LEAK: "Gas Leak Detected",
  FIRE: "Fire Alert",
  SECURITY: "Security Breach",
  MAINTENANCE: "Maintenance Required",
}
