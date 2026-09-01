import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Deterministic pseudo-random so re-seeds are stable (no Math.random).
let _s = 1337;
function rnd() {
  _s = (_s * 1103515245 + 12345) & 0x7fffffff;
  return _s / 0x7fffffff;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rnd() * arr.length)];
}
function code6() {
  return String(100000 + Math.floor(rnd() * 899999));
}

async function main() {
  console.log("Seeding Emerald H2 database...");

  // ---- wipe (order matters for FKs) ----
  await prisma.transaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.carApplication.deleteMany();
  await prisma.member.deleteMany();
  await prisma.station.deleteMany();
  await prisma.question.deleteMany();
  await prisma.trainingScreen.deleteMany();
  await prisma.content.deleteMany();
  await prisma.newsMedia.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.forumCategory.deleteMany();
  await prisma.webTraining.deleteMany();
  await prisma.fractionalSignup.deleteMany();
  await prisma.carInterest.deleteMany();
  await prisma.mailTemplate.deleteMany();
  await prisma.sentMail.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.setting.deleteMany();

  // ---- admin ----
  await prisma.adminUser.create({
    data: {
      email: "admin@ogrelogic.com",
      name: "Emerald H2 Admin",
      passwordHash: await bcrypt.hash("emrald@ogre1", 10),
    },
  });

  // ---- settings ----
  await prisma.setting.create({
    data: {
      id: 1,
      companyName: "Emerald H2",
      copyright: "Copyright © MREH2.COM. All rights reserved.",
      contactEmail: "info@emeraldh2.com",
      contactPhone: "(937) 479-1994",
      contactAddress: "530 N. Main St., Dayton, Ohio 45405, United States",
      androidUrl: "",
      iosUrl: "",
      fromEmail: "info@emeraldh2.com",
      fromName: "Emerald H2",
    },
  });

  // ---- safety quiz questions (verbatim from the live app) ----
  const questions: { text: string; status: string }[] = [
    {
      text:
        "I have read and fully understand the instructions for fueling my vehicle safely and I agree that in order to help promote a less costly and more efficient method of developing the much-needed hydrogen fueling infrastructure, I voluntarily wish to become a Level 1 Member of Emerald H2 hydrogen fueling network, and will do my best to adhere to the safety guidelines and take good care of the Emerald equipment I am gaining access to.",
      status: "active",
    },
    {
      text:
        "I understand and agree that I will not fuel at another station for at least 45 minutes after fueling at an Emerald H2 station in order to allow my vehicle's storage receiver to cool down to levels that would be acceptable to the next station I go to.",
      status: "active",
    },
    {
      text:
        "As a member of Emerald H2, is it your responsibility to operate the station in a safe manner and follow the written instructions found in the phone app, the station and the web site?",
      status: "active",
    },
    {
      text:
        "As a member of Emerald H2, is it your responsibility to report any challenges with functionality of the station or observations like when you arrive the door was already open?",
      status: "active",
    },
    {
      text:
        "As a member of Emerald H2, is it your responsibility to properly close the station door when fueling is completed?",
      status: "active",
    },
    {
      text:
        "As a member of Emerald H2, is it your responsibility to properly hang up the nozzle when fueling is completed?",
      status: "active",
    },
    { text: "Can you have an open flame around a hydrogen fueling station?", status: "active" },
    { text: "Can you smoke around a hydrogen fueling station?", status: "active" },
    { text: "Where are the directions on how to fuel your vehicle located?", status: "active" },
    { text: "How do you get directions to the station?", status: "active" },
    { text: "How do you reserve your fuel?", status: "active" },
    { text: "How do you locate an Emerald H2 hydrogen fueling station?", status: "active" },
  ];
  for (const q of questions) await prisma.question.create({ data: q });

  // ---- stations ----
  const stationSeed = [
    { code: "10KFS0004SOH", title: "Hill Fuel Station", address: "Shirley Chisholm State Park", pricePerKg: 15, status: "active", latitude: 40.6663, longitude: -73.8896 },
    { code: "10KFS0005SOH", title: "Hill Fuel Station 1", address: "Shirley Chisholm State Park", pricePerKg: 15, status: "active", latitude: 40.6671, longitude: -73.888 },
    { code: "10KFS0006SOH", title: "Hill Fuel Station 2", address: "Shirley Chisholm State Park", pricePerKg: 15, status: "maintenance", latitude: 40.668, longitude: -73.8905 },
    { code: "10KFS0007SOH", title: "Hill Fuel Station 3", address: "Shirley Chisholm State Park", pricePerKg: 15, status: "offline", latitude: 40.669, longitude: -73.887 },
    { code: "10KFS0008DOH", title: "MRE Shop Station", address: "530 N. Main St., Dayton, OH 45405", pricePerKg: 15, status: "active", latitude: 39.7808, longitude: -84.1916 },
    { code: "10KFS0009DOH", title: "Springfield Station", address: "1019 S. Fountain Ave, Springfield, OH 45506", pricePerKg: 15, status: "active", latitude: 39.911, longitude: -83.808 },
  ];
  const stations = [];
  for (const s of stationSeed) {
    stations.push(
      await prisma.station.create({
        data: { ...s, capacityKg: 10, description: `Emerald H2 ${s.title} — 5,000 / 10,000 PSI hydrogen fueling appliance.` },
      })
    );
  }

  // ---- members ----
  // Real names observed in the live console, plus generated fillers to reach ~35.
  const realMembers = [
    { name: "Chris McWhinney", email: "chris@mreh2.com", phone: "9374791994", city: "Dayton", state: "OH", zip: "45405", approved: true },
    { name: "Kris Mcinney", email: "hydrogenchris@gmail.com", phone: "9378329840", city: "Dayton", state: "OH", zip: "45405", approved: true },
    { name: "Kimby Royalty", email: "kimby@mreh2.com", phone: "9375551020", city: "Dayton", state: "OH", zip: "45405", approved: true },
    { name: "Benjamin Babian", email: "bjbabian@gmail.com", phone: "9374087103", city: "Springfield", state: "OH", zip: "45506", approved: true },
    { name: "Tim Glockner", email: "timglockner@glockner.com", phone: "2395551188", city: "Naples", state: "FL", zip: "34102", approved: true },
    { name: "Donald Knoth", email: "deknoth@gmail.com", phone: "6235559090", city: "Sun City West", state: "AZ", zip: "85375", approved: true },
    { name: "Danielle Mclean", email: "d@hy-sky.net", phone: "8176008548", city: "Fort Worth", state: "TX", zip: "76102", approved: true },
    { name: "Arun Singh", email: "arun.singh@ogrelogic.com", phone: "9991112222", city: "Noida", state: "UP", zip: "201301", approved: true },
    { name: "Ankit Chaudhary", email: "ankit.chaudhary@ogrelogic.com", phone: "6534534534", city: "Noida", state: "UP", zip: "201301", approved: true },
    { name: "Harshit Saxena", email: "harshit.saxena@ogrelogic.com", phone: "9991239999", city: "Noida", state: "UP", zip: "201301", approved: true },
    { name: "Douglas Hawley", email: "dhawley@gmail.com", phone: "5135550143", city: "Cincinnati", state: "OH", zip: "45202", approved: true },
    { name: "Arne Dahl", email: "arne.dahl@gmail.com", phone: "6125550177", city: "Minneapolis", state: "MN", zip: "55401", approved: true },
    { name: "Miles Mcwhinney", email: "miles@mreh2.com", phone: "9375552244", city: "Dayton", state: "OH", zip: "45405", approved: true },
    { name: "David Molinaro", email: "dmolinaro@gmail.com", phone: "7185550198", city: "Brooklyn", state: "NY", zip: "11201", approved: true },
    { name: "Alester Magnus", email: "amagnus@gmail.com", phone: "3125550166", city: "Chicago", state: "IL", zip: "60601", approved: false },
    { name: "Try New", email: "try@gmail.com", phone: "8848483833", city: "", state: "", zip: "", approved: false },
    { name: "Demo Android", email: "demo.android@ogrelogic.com", phone: "9991239999", city: "Noida", state: "UP", zip: "201301", approved: true },
  ];
  const fillerFirst = ["Jason", "Maria", "Kevin", "Laura", "Peter", "Nancy", "Frank", "Olivia", "George", "Rachel", "Henry", "Sofia", "Walter", "Diane", "Carl", "Emma", "Ralph", "Grace"];
  const fillerLast = ["Turner", "Bishop", "Warren", "Foster", "Grant", "Hayes", "Reed", "Cole", "Barnes", "Fox", "Shaw", "Rhodes", "Palmer", "Watts", "Dixon", "Mercer", "Boyd", "Nash"];
  const cities = [["Columbus", "OH", "43215"], ["Portsmouth", "OH", "45662"], ["Cincinnati", "OH", "45202"], ["Indianapolis", "IN", "46204"], ["Louisville", "KY", "40202"]];

  const memberInputs = [...realMembers];
  while (memberInputs.length < 35) {
    const fn = pick(fillerFirst);
    const ln = pick(fillerLast);
    const c = pick(cities);
    memberInputs.push({
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${memberInputs.length}@example.com`,
      phone: `${String(200 + Math.floor(rnd() * 700))}555${String(1000 + Math.floor(rnd() * 8999))}`,
      city: c[0],
      state: c[1],
      zip: c[2],
      approved: rnd() > 0.25,
    });
  }

  const members: Awaited<ReturnType<typeof prisma.member.create>>[] = [];
  for (let i = 0; i < memberInputs.length; i++) {
    const m = memberInputs[i];
    const referrer = i > 4 && rnd() > 0.6 ? members[Math.floor(rnd() * members.length)] : null;
    members.push(
      await prisma.member.create({
        data: {
          name: m.name,
          email: m.email,
          phone: m.phone,
          membershipCode: code6(),
          isApproved: m.approved,
          isActive: true,
          addressLine: "",
          city: m.city,
          state: m.state,
          zip: m.zip,
          country: "United States",
          referralEarnings: referrer ? Math.floor(rnd() * 500) / 10 : 0,
          referredById: referrer ? referrer.id : null,
          hasVehicle: rnd() > 0.7,
        },
      })
    );
  }

  // ---- bookings + transactions ----
  const demo = members.find((m) => m.name === "Demo Android")!;
  const activeStations = stations.filter((s) => s.status === "active");
  const payStatuses = ["pending", "paid", "paid", "failed"];
  let counter = 0;
  for (let i = 0; i < 32; i++) {
    const member = rnd() > 0.4 ? demo : pick(members);
    const station = pick(activeStations);
    const qty = rnd() > 0.5 ? 10 : 1;
    const price = qty * station.pricePerKg;
    const day = 1 + Math.floor(rnd() * 27);
    const scheduledAt = new Date(2023, 3 + Math.floor(rnd() * 6), day, 9 + Math.floor(rnd() * 8), 30);
    const bookingNo = `2024${String(1000000000000 + counter++ * 7777)}`.slice(0, 18);
    const paymentStatus = pick(payStatuses);
    const booking = await prisma.booking.create({
      data: {
        bookingNo,
        memberId: member.id,
        stationId: station.id,
        fuelQtyKg: qty,
        price,
        scheduledAt,
        paymentStatus,
      },
    });
    if (paymentStatus === "paid") {
      await prisma.transaction.create({
        data: { bookingId: booking.id, amount: price, status: "success", method: pick(["card", "wallet"]), reference: `TXN${code6()}` },
      });
    }
  }

  // ---- fractional ownership signups (real observed data) ----
  await prisma.fractionalSignup.createMany({
    data: [
      { name: "Chris McWhinney", email: "chris@mreh2.com", phone: "9374791994", address: "530 N. Main St. Dayton Ohio 45405 United States", createdAt: new Date("2022-04-06T14:02:07") },
      { name: "Benjamin Babian", email: "bjbabian@gmail.com", phone: "9374087103", address: "1019 S. Fountain Ave Springfield OH 45506 United States", createdAt: new Date("2022-04-04T02:08:39") },
    ],
  });

  // ---- car interest (waitlist) ----
  await prisma.carInterest.createMany({
    data: [
      { name: "Kris Mcinney", email: "hydrogenchris@gmail.com", phone: "9378329840", city: "Dayton" },
      { name: "Tim Glockner", email: "timglockner@glockner.com", phone: "2395551188", city: "Naples" },
      { name: "Donald Knoth", email: "deknoth@gmail.com", phone: "6235559090", city: "Sun City West" },
      { name: "Kimby Royalty", email: "kimby@mreh2.com", phone: "9375551020", city: "Dayton" },
    ],
  });

  // ---- car financing application (real observed shape) ----
  await prisma.carApplication.create({
    data: {
      name: "Ankit Chaudhary",
      phone: "04568745698",
      email: "ankit.chaudhary@ogrelogic.com",
      address: "Sector 63, Noida, UP, India 201301",
      maritalStatus: "Single",
      working: true,
      company: "Ogre Logic",
      position: "Developer",
      department: "Engineering",
      homeStatus: "own",
      hasCurrentLoan: false,
      monthlyIncome: 45454,
      loanBank: "HDFC",
      loanMonthsLeft: 34,
      loanMonthlyAmt: 43234,
      loanType: "finance",
      loanAmount: 2332443,
      loanTerms: "3 years",
      preferredPayment: "monthly",
    },
  });

  // ---- content pages ----
  await prisma.content.createMany({
    data: [
      { title: "About Emerald H2", slug: "about", body: "Emerald H2 is building a self-funding green hydrogen fueling network, powered by Millennium Reign Energy's automatic hydrogen generating stations.", status: "published" },
      { title: "Product Story", slug: "product-story", body: "Scalable hydrogen fueling appliances that dynamically match supply with demand — from the Model 200 to megawatt-class electrolyzers.", status: "published" },
      { title: "Community Micro Grids", slug: "community-micro-grids", body: "Linked micro data centers produce green hydrogen from solar and wind, trucked to Emerald H2 stations.", status: "draft" },
    ],
  });

  // ---- news / media ----
  await prisma.newsMedia.createMany({
    data: [
      { title: "MRE fuels the future with hydrogen power", slug: "mre-fuels-the-future", excerpt: "Millennium Reign Energy's automatic stations can charge a vehicle in as little as eight minutes.", body: "Full press coverage of MRE's hydrogen generating stations.", type: "press", status: "published" },
      { title: "Ohio Hydrogen Triangle takes shape", slug: "ohio-hydrogen-triangle", excerpt: "Fueling stations planned across Dayton, Portsmouth and Columbus.", body: "Emerald H2 outlines its Ohio rollout.", type: "news", status: "published" },
    ],
  });

  // ---- donations ----
  await prisma.donation.createMany({
    data: [
      { name: "Chris McWhinney", email: "chris@mreh2.com", amount: 25, status: "received" },
      { name: "Benjamin Babian", email: "bjbabian@gmail.com", amount: 25, status: "acknowledged" },
      { name: "Kris Mcinney", email: "hydrogenchris@gmail.com", amount: 50, status: "received" },
    ],
  });

  // ---- forum categories ----
  await prisma.forumCategory.createMany({
    data: [
      { name: "General Discussion", description: "Talk about anything Emerald H2.", sortOrder: 1 },
      { name: "Station Safety", description: "Safe fueling practices and reporting.", sortOrder: 2 },
      { name: "Fractional Ownership", description: "Questions about co-owning a station.", sortOrder: 3 },
      { name: "Fuel Cell Vehicles", description: "Owning and driving hydrogen cars.", sortOrder: 4 },
    ],
  });

  // ---- web training ----
  await prisma.webTraining.createMany({
    data: [
      { title: "How to locate a station", body: "Use the app map to find active (green) stations within your range.", sortOrder: 1 },
      { title: "How to reserve fuel", body: "Enter your remaining miles, pick a station, and book — this locks the station door for you.", sortOrder: 2 },
      { title: "Safe fueling walkthrough", body: "Step-by-step safe operation of an Emerald H2 station.", videoUrl: "", sortOrder: 3 },
    ],
  });

  // ---- app training screens ----
  await prisma.trainingScreen.createMany({
    data: [
      { title: "Welcome to Emerald H2", body: "Get started fueling smarter with hydrogen.", sortOrder: 1 },
      { title: "First-time instructions", body: "Download the PDF instructions and complete the safety test before operating a station for the first time.", sortOrder: 2 },
      { title: "Booking & the door lock", body: "When you book, the station door locks so your reserved fuel is held until you arrive.", sortOrder: 3 },
    ],
  });

  // ---- mail templates ----
  await prisma.mailTemplate.createMany({
    data: [
      { name: "Welcome", subject: "Welcome to Emerald H2", body: "Thanks for joining the Emerald H2 hydrogen fueling network!" },
      { name: "Account Approved", subject: "Your Emerald H2 membership is approved", body: "You can now complete the safety training and start booking fuel." },
      { name: "Station Fully Subscribed", subject: "Station update", body: "That station is fully subscribed right now — we'll notify you as capacity opens up." },
    ],
  });

  const counts = {
    members: await prisma.member.count(),
    stations: await prisma.station.count(),
    bookings: await prisma.booking.count(),
    questions: await prisma.question.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
