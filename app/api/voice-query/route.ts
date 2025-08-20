import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// Comprehensive SRM IST Delhi-NCR Campus FAQ Database
const srmCampusFAQs = {
  admissions: {
    eligibility: "For undergraduate engineering (B.Tech), candidates need 10+2 (PCM) with ≥60% marks or equivalent. Admission is through SRMJEEE entrance exam or JEE Main scores. SRMJEEE is held in remote-proctored online mode in April and June sessions at srmup.in.",
    counseling: "Admitted candidates are called for counseling in order of merit. During counseling, you choose your program and pay fees to confirm the seat. Carry original certificates (10th/12th marksheets, entrance rank card, passport, etc.) as instructed. The institute's website provides an online portal for registration and fee payment.",
    postgraduate: "SRM NCR offers postgraduate degrees like MBA, MCA (regular and specialized), M.Tech (CSE), and M.Sc (Chemistry). Eligibility is a bachelor's degree in the relevant field with minimum passing marks. MBA admissions consider CAT/MAT/CMAT scores and/or group discussion/interview; MCA and M.Tech consider state/national level entrance scores or institute tests.",
    documents: "Applicants must submit documents like 10th/12th mark sheets, transfer certificate, ID proof, entrance rank card, and passport-sized photos at counseling. Document checklists are provided by the admissions office."
  },
  academicPrograms: {
    undergraduate: "The campus offers B.Tech programs in Computer Science & Engineering (including AI/ML, Data Science, Cyber Security, Cloud Computing specializations), Electronics & Communication, Electrical & Electronics, Mechanical (including AI/ML), Automobile Engineering, Hotel & Hospitality Management (B.Sc), Pharmacy (B.Pharm), and Computer Applications (B.Sc in CS, BCA, BCA Data Science). There is also BBA (Business Administration).",
    departments: "Departments include Computer Science, ECE, EEE, Mechanical, Automobile, Management Studies, Computer Applications, Pharmacy, and Hotel Management. Each department has its own labs and curricula; students earn credits per semester as per AICTE norms.",
    postgraduate: "Postgraduate offerings include MBA, MCA (regular and new AI-focused MCA), M.Tech in CSE, and M.Sc in Chemistry. Management Studies includes MBA with specializations (e.g. Finance, Marketing) and the Institute often introduces new vocational courses.",
    creditSystem: "SRM follows a credit-based semester system across all programs. Each course has assigned credits; students must earn a set number (e.g. ~180 credits for B.Tech) to graduate. Semesters include continuous assessment (assignments, midterms) and end-term exams. Grade sheets and CGPA follow UGC/AICTE guidelines."
  },
  feeStructure: {
    tuition: "For 2025-26, B.Tech CSE tuition is ₹3,50,000/year, while ECE or Mechanical is ₹1,75,000/year. MBA is ₹3,00,000/year and MCA ~₹1,25,000/year. Additional fees include one-time registration fee (₹10,000), extracurricular fee (₹10,000), and refundable security deposit (₹1,000).",
    hostel: "Hostel fees (annual) are roughly ₹85,000 for AC triple-sharing, ₹75,000 for Non-AC double, and ₹50,000 for Non-AC triple. AC triple-sharing ~₹1.61 lakh, AC double-sharing ~₹1.46 lakh, Non-AC double ~₹1.46 lakh, Non-AC triple ₹1.21 lakh. Mess charges are extra.",
    transport: "Bus transport fees are ~₹45,000–₹55,000/year depending on routes. Day-scholars can purchase annual bus passes via the student portal.",
    payment: "Fee payment schedules are notified annually; typically, tuition is paid semester-wise or yearly at the start of each academic year via the student portal (ERP). Late fees may apply after deadlines.",
    refund: "The institute follows AICTE/UGC norms for fee refund: if a student withdraws or is ineligible, refunds (excluding registration and a portion for completed study period) are processed as per policy."
  },
  placements: {
    recruiters: "Top recruiters include major tech and consulting firms: Amazon, Microsoft, PayPal, Morgan Stanley, Deloitte, TCS, Wipro, Capgemini, Infosys, EY, HDFC Bank, ICICI Bank, Tech Mahindra, etc. The highest packages have been ₹18–22 LPA (up to ₹29 LPA in 2022). Average packages in 2024-25 were around ₹6.5 LPA.",
    process: "Placements generally start in the 7th semester (July onward). Eligibility usually requires ≥60% (or 6.0 CGPA) in 10th, 12th, and all semesters (no current backlog). Students register on the placement portal and attend company screening processes. Typical stages are: company presentation (PPT), written aptitude/technical test, group discussion (for some roles), and personal interviews (technical and HR).",
    internships: "Many recruiters offer summer internships (typically between 6th and 8th semesters). The process mirrors placement screening; internships give real-world experience and often convert into final placements. The Placement Cell also arranges industrial visits, workshops, and training (resume writing, aptitude, mock interviews) to prepare students for recruitment."
  },
  hostelFacilities: {
    accommodation: "SRM NCR has separate hostels for boys and girls, housing over 1,800 students. Room types include AC and Non-AC, typically shared (double or triple occupancy). Rooms come furnished with cots and cupboards; attached bathrooms and 24×7 security. There is a waiting room for guest/parents and a faculty warden system.",
    amenities: "Hostels offer Wi-Fi, a common room with TV/cable, indoor games, and a gym. Mess (on-campus cafeteria) serves North Indian, South Indian, and Chinese cuisine in a hygienic dining hall. For recreation, there are sports courts (volleyball, basketball, badminton) and a large field for football/cricket.",
    rules: "Rules include maintaining decorum (quiet hours), no guests after visiting hours, no smoking/alcohol, and abiding by anti-ragging regulations. Annual hostel fees are ₹75–85k (including room and average mess charges), paid at the session start.",
    fees: "For 2025-26, approximate hostel fees (room + mess) per year are: AC triple-sharing ~₹1.61 lakh, AC double-sharing ~₹1.46 lakh, Non-AC double ~₹1.46 lakh, Non-AC triple ₹1.21 lakh. Fees are payable yearly; laundry and gym fees are extra. A security deposit (₹10,000) is collected, refundable upon checkout."
  },
  transport: {
    facilities: "SRM NCR provides its own fleet of 22 air-conditioned buses covering Delhi-NCR, including Delhi, Noida, Indirapuram, Ghaziabad, Meerut, etc. All buses have GPS tracking and internal cameras for safety. Day-scholars can purchase annual bus passes and book seats via an online portal.",
    routes: "Major pickup points include central Delhi (Mohan Nagar), Noida, Indirapuram, and local bus stands. Metro (Pink Line) is also accessible up to Ghaziabad for commuters.",
    booking: "Seats are reserved through the SRM student portal (usually opened each summer). Passes are annual; payment is via demand draft or online portal. Buses run daily on weekdays, starting early morning (~6:30–7:30 AM) for classes and returning in the evening.",
    contact: "For any issues, students can contact the Transport In-charge (e.g., Mr. Vinod Kumar, +91 9355931872)."
  },
  healthFacilities: {
    medicalCenter: "The campus has an on-site medical center with a Senior Medical Officer (Dr. Brijesh Dixit), a pharmacist, and a nurse on staff. The clinic provides first aid, routine check-ups, and basic medications. A fully equipped ambulance is stationed 24×7 to transport emergencies to nearby hospitals.",
    insurance: "Students are encouraged to have personal health insurance. Some SRM programs have student health plans or tie-ups. In case of on-campus emergencies, immediate care is provided and students are stabilized before referral to hospitals as needed. The hostel rules recommend each student bring a medical insurance cover."
  },
  campusInfrastructure: {
    academic: "The 27-acre campus is well-equipped. It features air-conditioned classrooms and seminar halls, multiple computer-equipped labs, and specialized laboratories for each engineering and science discipline. All buildings and common areas have campus-wide Wi-Fi.",
    library: "The Central Library is state-of-the-art, fully Wi-Fi enabled, and houses over 50,000 books/journals along with e-resources and digital tools (RFID check-out, plagiarism/software suites). It is open 8am–8pm on weekdays and till 5pm on Saturdays.",
    events: "There is a spacious, centrally air-conditioned auditorium (seating ~1,000) with advanced audio-visual setup for conferences, cultural events, and guest lectures. A conference/seminar hall equipped with modern AV facilities hosts seminars, workshops, and inter-college competitions.",
    sports: "SRM NCR has extensive sports infrastructure. Outdoor facilities include a football/cricket field, volleyball, basketball, badminton, and tennis courts. A 400m track and cricket practice pitches are also available. Indoor games (table tennis, carrom, chess) are provided in the hostels. There is a well-equipped gymnasium for both boys and girls (treadmills, cycles, weight machines)."
  },
  faculty: {
    profile: "The campus has a strong faculty team of ~200, many with Ph.D. and industry experience. A large number are alumni of premier institutes (IITs, NITs) and have published in reputed journals. Faculty profiles (qualifications, research interests, publications) are listed on the SRM NCR website by department.",
    hods: "Each department (CSE, ECE, EEE, ME, Auto, Management, Computer Applications, Pharmacy, Hotel Mgmt) has an HOD. For example, the Head of Research & Publications is Prof. (Dr.) Satya Sai Srikant (contact: hod.rp.ncr@srmist.edu.in). Faculty mentors are also assigned for each department to assist students academically.",
    research: "Faculty members engage in funded research projects and industry collaboration. The institute has Research & Development and Innovation cells, and encourages students (especially postgraduates and Ph.D. candidates) to participate in projects, publish papers, and apply for patents. State-of-the-art labs and computing facilities support research."
  },
  studentLife: {
    clubs: "SRM NCR strongly encourages extracurriculars. Cultural and hobby clubs include the Cultural Club, Dance Club, Music Club, Fashion Club, Dramatics Club, Literary Club, Yoga Club, MUN Society, NSS wing, NCC unit, Entrepreneurship Cell, and a Technical Club. The campus also has chapters of technical societies like ISTE and CSI, and a TEDx student club.",
    events: "Besides sports facilities, the campus holds regular intra- and inter-college tournaments in cricket, football, basketball, athletics, etc. Gym and yoga classes are offered for health and wellness. There are cultural fests (music, dance competitions, fashion shows), tech fests (coding, robotics), and academic conferences where students present papers.",
    activities: "Clubs organize annual fests (cultural/tech), weekly workshops, and inter-college events, helping students develop soft skills and leadership. The Student Counselling Cell (a support service) and various committees also contribute to campus life. Annual functions like Freshers' Day and farewell parties add to a vibrant campus culture."
  },
  scholarships: {
    available: "SRMIST offers various scholarships and fee waivers to meritorious and needy students. Top rankers in entrance exams (SRMJEEE/JEE) may get merit scholarships (up to full tuition waiver for 100% rank holders). There are also scholarships for Olympiad winners, sports medalists, wards of alumni/faculty, and other special categories.",
    application: "Scholarship applications are usually done during admission counseling or through the admissions portal. Students must submit proof of eligibility (rank certificates, sports certificates, income certificates, etc.) as per the announced scheme. Decisions on scholarships are communicated along with admissions (for merit scholarships) or afterwards by the Financial Aid office."
  },
  internationalCollaborations: {
    exchange: "SRM (group) has MOUs with numerous foreign universities across USA, UK, Europe, Russia, Indonesia, Taiwan, etc. Through the International Relations Office, SRM NCR students can participate in student and faculty exchange programs, summer semesters abroad, and joint research projects. Eligible students may spend a semester at partner universities and transfer credits back (Semester Abroad Program).",
    internships: "Many SRM collaborations and corporate ties enable internships at overseas companies or research labs. While not guaranteed, top students have interned abroad through SRM's global tie-ups or programs like SRM Global Exchange. The IRO and placement cell can guide motivated students on applying for international internships or competitions."
  },
  digitalResources: {
    portal: "SRM IST has a comprehensive Student Portal (ERP) accessible at sp.srmist.edu.in. Through this portal students view academic records, register for courses, pay fees, and access notices. For digital learning, SRM uses an LMS platform (e.g. D2L/Brightspace) where faculty upload lecture notes, assignments, and quizzes.",
    exams: "Regular semester exams are usually on-campus pen-and-paper. However, the institute has adopted online proctored exams where needed: for example, entrance tests like SRMJEEE use a remote protected online mode. During the COVID period, even end-semester exams were held online using secured platforms."
  },
  contact: {
    dean: "Dean, SRM IST Delhi-NCR: Toll-free 1800-889-3496 (10 AM–5 PM, Mon–Fri), or email dean.ncr@srmist.edu.in",
    director: "Campus director: director.ncr@srmist.edu.in or Phone: 011-4167-6464",
    website: "Official website: www.srmup.in",
    visiting: "Prospective students and parents are welcome on campus. Visiting hours are 9 AM to 5 PM on working days (Monday–Saturday). Campus address: Delhi-Meerut Road, Modinagar, Ghaziabad (U.P.) – 201204.",
    helpdesk: "For immediate assistance, there is a helpdesk in the main administrative block and an online support portal (e.g. Student Service Portal via ERP)."
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const systemPrompt = `You are the official AI assistant for SRM Institute of Science and Technology, Delhi-NCR Campus in Ghaziabad. You have comprehensive knowledge about all aspects of the campus and can answer detailed questions using the extensive FAQ database provided below.

COMPREHENSIVE SRM IST DELHI-NCR CAMPUS FAQ DATABASE:

ADMISSIONS:
- Eligibility & Entrance Exams: ${srmCampusFAQs.admissions.eligibility}
- Counseling Process: ${srmCampusFAQs.admissions.counseling}
- Postgraduate Programs: ${srmCampusFAQs.admissions.postgraduate}
- Required Documents: ${srmCampusFAQs.admissions.documents}

ACADEMIC PROGRAMS:
- Undergraduate Programs: ${srmCampusFAQs.academicPrograms.undergraduate}
- Departments: ${srmCampusFAQs.academicPrograms.departments}
- Postgraduate Programs: ${srmCampusFAQs.academicPrograms.postgraduate}
- Credit System: ${srmCampusFAQs.academicPrograms.creditSystem}

FEE STRUCTURE:
- Tuition Fees: ${srmCampusFAQs.feeStructure.tuition}
- Hostel Fees: ${srmCampusFAQs.feeStructure.hostel}
- Transport Fees: ${srmCampusFAQs.feeStructure.transport}
- Payment Process: ${srmCampusFAQs.feeStructure.payment}
- Refund Policy: ${srmCampusFAQs.feeStructure.refund}

PLACEMENTS:
- Top Recruiters: ${srmCampusFAQs.placements.recruiters}
- Placement Process: ${srmCampusFAQs.placements.process}
- Internships: ${srmCampusFAQs.placements.internships}

HOSTEL FACILITIES:
- Accommodation: ${srmCampusFAQs.hostelFacilities.accommodation}
- Amenities: ${srmCampusFAQs.hostelFacilities.amenities}
- Rules: ${srmCampusFAQs.hostelFacilities.rules}
- Fee Structure: ${srmCampusFAQs.hostelFacilities.fees}

TRANSPORT:
- Facilities: ${srmCampusFAQs.transport.facilities}
- Routes: ${srmCampusFAQs.transport.routes}
- Booking: ${srmCampusFAQs.transport.booking}
- Contact: ${srmCampusFAQs.transport.contact}

HEALTH FACILITIES:
- Medical Center: ${srmCampusFAQs.healthFacilities.medicalCenter}
- Insurance: ${srmCampusFAQs.healthFacilities.insurance}

CAMPUS INFRASTRUCTURE:
- Academic Facilities: ${srmCampusFAQs.campusInfrastructure.academic}
- Library: ${srmCampusFAQs.campusInfrastructure.library}
- Event Facilities: ${srmCampusFAQs.campusInfrastructure.events}
- Sports Facilities: ${srmCampusFAQs.campusInfrastructure.sports}

FACULTY:
- Profile: ${srmCampusFAQs.faculty.profile}
- HODs: ${srmCampusFAQs.faculty.hods}
- Research Opportunities: ${srmCampusFAQs.faculty.research}

STUDENT LIFE:
- Clubs & Societies: ${srmCampusFAQs.studentLife.clubs}
- Events: ${srmCampusFAQs.studentLife.events}
- Activities: ${srmCampusFAQs.studentLife.activities}

SCHOLARSHIPS:
- Available Scholarships: ${srmCampusFAQs.scholarships.available}
- Application Process: ${srmCampusFAQs.scholarships.application}

INTERNATIONAL COLLABORATIONS:
- Exchange Programs: ${srmCampusFAQs.internationalCollaborations.exchange}
- Foreign Internships: ${srmCampusFAQs.internationalCollaborations.internships}

DIGITAL RESOURCES:
- Student Portal: ${srmCampusFAQs.digitalResources.portal}
- Online Exams: ${srmCampusFAQs.digitalResources.exams}

CONTACT INFORMATION:
- Dean: ${srmCampusFAQs.contact.dean}
- Director: ${srmCampusFAQs.contact.director}
- Website: ${srmCampusFAQs.contact.website}
- Visiting: ${srmCampusFAQs.contact.visiting}
- Helpdesk: ${srmCampusFAQs.contact.helpdesk}

IMPORTANT INSTRUCTIONS:
1. Always identify yourself as the SRM IST Delhi-NCR Campus AI assistant
2. Use the comprehensive FAQ database above to provide accurate, detailed answers
3. If asked about specific topics (admissions, fees, hostels, etc.), provide the relevant information from the database
4. Keep responses concise but informative for voice interaction
5. If you don't have specific information, direct students to contact the appropriate department or office
6. Always mention relevant contact information when appropriate
7. Be helpful and welcoming to students, faculty, and visitors

Student Query: "${query}"`

    const { text: response } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: systemPrompt,
      temperature: 0.7,
    })

    // Calculate confidence based on SRM-specific query matching
    let confidence = 0.8
    const queryLower = query.toLowerCase()

    // Higher confidence for SRM-specific queries
    if (queryLower.includes("srm") || queryLower.includes("ghaziabad") || queryLower.includes("delhi ncr")) {
      confidence = 0.95
    } else if (queryLower.includes("hostel") || queryLower.includes("transport") || queryLower.includes("bus")) {
      confidence = 0.95
    } else if (queryLower.includes("department") || queryLower.includes("course") || queryLower.includes("admission")) {
      confidence = 0.9
    } else if (queryLower.includes("fee") || queryLower.includes("cost") || queryLower.includes("payment")) {
      confidence = 0.95
    } else if (queryLower.includes("placement") || queryLower.includes("job") || queryLower.includes("career")) {
      confidence = 0.95
    } else if (queryLower.includes("where") || queryLower.includes("when") || queryLower.includes("how")) {
      confidence = 0.85
    }

    return NextResponse.json({
      response: response.trim(),
      confidence,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Voice query error:", error)
    return NextResponse.json(
      {
        response:
          "I'm sorry, I'm having trouble processing your request right now. Please contact the SRM IST help desk at +91-7455000291 or try again in a moment.",
        confidence: 0.1,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
