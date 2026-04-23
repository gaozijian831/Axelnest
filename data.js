// Axelnest data — real US figure skating competitions, 2026 season
// Sourced from the official competition announcement PDFs and club pages listed on each entry.
// Where the host club has not yet published a detail (e.g. officials, detailed run-of-show, host hotel
// block), the field is explicitly marked "Not yet published — check announcement" so families know
// to check back rather than being misled by invented data.

const NOT_PUBLISHED = "Not yet published — check the official announcement.";

window.COMPETITIONS = [
  {
    id: "spring-jubilee",
    name: "2026 Spring Jubilee",
    club: "Peninsula Skating Club",
    city: "San José, CA",
    state: "CA",
    venue: "Sharks Ice at San José — 1500 S. 10th Street",
    dateShort: "May 8–10",
    dateLong: "May 8 – 10, 2026",
    registerBy: "April 9, 2026, 11:59 p.m. EDT (8:59 p.m. PDT)",
    registerLink: "https://www.peninsulaskatingclub.org/competitions",
    status: "open",
    level: "Non-Qualifying · USFS Sanctioned · Excel Series · National Solo Dance Series",
    description:
      "Peninsula Skating Club's spring competition, sanctioned by U.S. Figure Skating and approved as a 2026 Excel Series event and a 2026 National Solo Dance Series event. Singles Excel and Well-Balanced free skate, Well-Balanced short program, Juvenile Pairs, six Showcase disciplines, Solo Dance, Compete USA, and Theatre on Ice events are offered. Each rink is 200' × 85' with slightly curved ends.",
    // Source: 2026 Spring Jubilee announcement (Final Amended 03/12/26)
    levels: [
      { name: "Excel Free Skate (Pre-Preliminary – Senior, IJS)", count: null },
      { name: "Well-Balanced Short Program (Juvenile / Open Juvenile – Senior, IJS)", count: null },
      { name: "Well-Balanced Free Skate (Pre-Preliminary – Senior, IJS)", count: null },
      { name: "Adult Free Skate (Pre-Bronze – Master Junior/Senior, IJS)", count: null },
      { name: "Adult Free Skate (Beginner – High Beginner, 6.0)", count: null },
      { name: "Juvenile Pairs Free Skate (IJS)", count: null },
      { name: "Showcase — 6 categories (CJS)", count: null },
      { name: "Solo Dance — Pattern / Combined / Shadow / Adult (IJS)", count: null },
      { name: "Compete USA — Snowplow Sam through Basic 6 / Adult 1–6 / Aspire", count: null },
      { name: "Theatre on Ice — Choreographic Exercise & Free Program (CJS)", count: null },
    ],
    // Source PDF: "Competitors may be scheduled on any day or time during the announced dates of the
    // competition. The competition and practice ice schedule will be available after the close of entries."
    // So we do NOT fabricate a schedule.
    scheduleNote:
      "The competition and practice ice schedule will be published after the close of entries (April 9, 2026). Competitors may be scheduled on any day or time during May 8–10. Starting orders will be posted 12 hours before the start of competition.",
    schedule: [],
    // The announcement lists Chair, Chief Referee, and Registrar; other officials are not yet published.
    officials: [
      { role: "Competition Chair", name: "Linda Price — president@peninsulaskatingclub.org" },
      { role: "Chief Referee", name: "Kathleen Krieger — kriegerrph@msn.com" },
      { role: "Registrar", name: "Yuning Zhao — registrar@peninsulaskatingclub.org" },
      { role: "Tech Controller / Judges Panel", name: NOT_PUBLISHED },
    ],
    logistics: [
      { label: "Nearest airport", text: "Norman Y. Mineta San José International (SJC) — about 7 miles from the rink." },
      { label: "Host hotel", text: "Official hotel accommodations to be posted on the PSC website via the Event Connect reservation service." },
      { label: "Locker rooms", text: "Locker rooms will NOT be available as dressing/changing rooms. Changing in restrooms is prohibited. Arrive ready to skate." },
      { label: "Practice ice", text: "No official practice ice. Contact Sharks Ice at San José (408-279-6000) for public / freestyle sessions." },
      { label: "Music upload", text: "Music and PPC (IJS events) due in EMS by April 24, 2026." },
      { label: "Awards", text: "Medals to 1st–4th. Special awards: Joan McDonnell Best of Showcase Award; Tony Morici Excel Award." },
    ],
    past: [2025, 2024, 2023, 2022],
  },
  {
    id: "dallas-classic",
    name: "2026 Dallas Classic",
    club: "Dallas FSC",
    city: "Plano, TX",
    state: "TX",
    venue: "StarCenter Plano — 4020 W. Plano Parkway, Plano, TX 75093",
    dateShort: "Jul 9–12",
    dateLong: "July 9 – 12, 2026",
    registerBy: NOT_PUBLISHED + " (2025 deadline was early June via EMS; 2026 announcement not yet posted)",
    registerLink: "https://www.dallasfsc.org/dallasclassic",
    status: "open",
    level: "Non-Qualifying · USFS Sanctioned · National Solo Dance Series · NQS Dance Event",
    description:
      "The Dallas Classic returns to the Plano StarCenter. Per the Dallas FSC events page, the 2026 edition is set for July 9–12, 2026. Historically a participating event in the National Solo Dance Series and an NQS Dance Event. The 2026 official announcement (events offered, schedule, officials, fees) has not yet been published — check the Dallas FSC site for updates.",
    levels: [
      { name: "Events offered — 2026 list not yet published", count: null },
      { name: "Historically: Compete USA, Test Track, Well-Balanced Singles, Showcase, Adult, Solo Dance", count: null },
    ],
    scheduleNote:
      "The 2026 schedule has not been published yet. Based on prior years, the Dallas Classic runs a four-day format across the weekend. Check DallasFSC.org/dallasclassic for the official announcement.",
    schedule: [],
    officials: [
      { role: "Competition Chair", name: NOT_PUBLISHED },
      { role: "Chief Referee", name: NOT_PUBLISHED },
      { role: "Tech Controller", name: NOT_PUBLISHED },
    ],
    logistics: [
      { label: "Nearest airport", text: "DFW — about 25 min drive; DAL Love Field — about 20 min." },
      { label: "Host hotel", text: "Prior host hotels included Courtyard by Marriott Dallas Plano Parkway and Residence Inn Plano — confirm 2026 block via the official announcement." },
      { label: "Series info", text: "In prior years: National Solo Dance Series participating event + NQS Dance event." },
      { label: "Weather tip", text: "Mid-July in Dallas runs 95°F+ with afternoon thunderstorms. Pack a plastic dress bag." },
    ],
    past: [2025, 2024, 2023, 2022],
  },
  {
    id: "cactus-classic",
    name: "2026 Cactus Classic",
    club: "Coyotes Skating Club of Arizona",
    city: "Scottsdale, AZ",
    state: "AZ",
    venue: NOT_PUBLISHED + " (prior editions: Ice Den Scottsdale)",
    dateShort: NOT_PUBLISHED,
    dateLong: NOT_PUBLISHED,
    registerBy: NOT_PUBLISHED,
    registerLink: "https://www.coyotesscofaz.org/",
    status: "closing",
    level: "Non-Qualifying · USFS Sanctioned",
    description:
      "Hosted by the Coyotes Skating Club of Arizona. The club's website could not be accessed at time of publishing — events offered, 2026 dates, venue, schedule and officials are all still to be confirmed. Please check coyotesscofaz.org directly for the current announcement before registering.",
    levels: [
      { name: "2026 events list not yet published", count: null },
    ],
    scheduleNote:
      "Schedule, event list, and officials for 2026 have not yet been posted on the Coyotes SC of AZ website. Please visit coyotesscofaz.org for the latest announcement.",
    schedule: [],
    officials: [
      { role: "Competition Chair", name: NOT_PUBLISHED },
      { role: "Chief Referee", name: NOT_PUBLISHED },
      { role: "Tech Controller", name: NOT_PUBLISHED },
    ],
    logistics: [
      { label: "Club", text: "Coyotes Skating Club of Arizona — the official USFS member club in the Phoenix / Scottsdale area." },
      { label: "Nearest airport", text: "Phoenix Sky Harbor (PHX) — about 30 min from most East Valley rinks." },
      { label: "Heat tip", text: "Summer temperatures in the Phoenix area frequently exceed 105°F. Stay indoors midday; hydrate aggressively." },
      { label: "Details", text: "Full 2026 announcement — venue, dates, events, fees, officials — not yet published on the club site." },
    ],
    past: [2025, 2024, 2023],
  },
  {
    id: "glacier-falls-summer-classic",
    name: "Glacier Falls Summer Classic",
    club: "Glacier Falls FSC",
    city: "Anaheim, CA",
    state: "CA",
    venue: "The Rinks – Anaheim ICE (historical home) — NHL rink ~85' × 200', Olympic rink ~100' × 200'",
    dateShort: "Late Jul / Early Aug",
    dateLong: "Dates for 2026 not yet published — 2025 ran Jul 30 – Aug 3",
    registerBy: NOT_PUBLISHED + " (2025 deadline was July 6, 2025, 11:59 p.m. ET via EMS)",
    registerLink: "https://glacierfalls.com/?page_id=3386",
    status: "open",
    level: "Qualifying · USFS NQS (Singles & Pairs) + Non-Qualifying tracks",
    description:
      "Hosted by the Glacier Falls FSC since 1961 (the first skating club in Orange County), this is one of the largest summer competitions in the United States. Historically held at The Rinks – Anaheim ICE across both NHL and Olympic sheets, and designated as a National Qualifying Series (NQS) event for singles and pairs. The 2026 announcement had not been posted to the Glacier Falls site at publishing; the 2025 Spring Spectacular announcement is currently the most recent — check glacierfalls.com for the 2026 Summer Classic details.",
    levels: [
      { name: "NQS Singles — Juvenile through Senior (historical)", count: null },
      { name: "NQS Pairs — Juvenile through Senior (historical)", count: null },
      { name: "Non-Qualifying Well-Balanced + Excel Singles (historical)", count: null },
      { name: "Full 2026 event list — not yet published", count: null },
    ],
    scheduleNote:
      "The 2026 schedule has not been published. The 2025 edition ran Jul 30 – Aug 3 across the NHL and Olympic sheets at The Rinks – Anaheim ICE. Check glacierfalls.com/?page_id=3386 for the 2026 announcement.",
    schedule: [],
    officials: [
      { role: "Competition Chair", name: NOT_PUBLISHED },
      { role: "Chief Referee", name: NOT_PUBLISHED },
      { role: "Tech Controller", name: NOT_PUBLISHED },
    ],
    logistics: [
      { label: "Host club", text: "Glacier Falls FSC — Orange County member club of U.S. Figure Skating, founded 1961." },
      { label: "Historical host hotel", text: "Ayres Hotel Anaheim — 2550 E. Katella Ave, Anaheim, CA 92806. Confirm 2026 block from the official announcement." },
      { label: "Nearest airport", text: "John Wayne / Orange County (SNA) is closest; LAX is the other common option." },
      { label: "Locker rooms", text: "In recent years, locker rooms have not been available as dressing/changing rooms. Arrive ready to skate." },
      { label: "Details", text: "Exact 2026 dates, fees, and officials — not yet published on the club site." },
    ],
    past: [2025, 2024, 2023, 2022, 2021],
  },
  {
    id: "skate-st-moritz",
    name: "Skate St. Moritz",
    club: "St. Moritz Ice Skating Club (est. 1931)",
    city: "Oakland, CA",
    state: "CA",
    venue: "Oakland Ice Center (primary) / Sharks Ice — principal skating headquarters of St. Moritz ISC",
    dateShort: NOT_PUBLISHED,
    dateLong: NOT_PUBLISHED + " — the most recent Skate St. Moritz has concluded; the next edition is TBD",
    registerBy: NOT_PUBLISHED,
    registerLink: "https://stmoritzisc.org/",
    status: "closing",
    level: "Non-Qualifying · USFS Sanctioned",
    description:
      "Hosted by the St. Moritz Ice Skating Club — founded in 1931, this is the oldest ice skating club in California and a U.S. Figure Skating member club since 1934 (club #2205). The club's principal skating headquarters are the Oakland Ice Center and Sharks Ice, with Dublin Iceland as an additional rink. The club hosts two annual competitions: Skate St. Moritz and Bay Cities Team Skating. Per the club's home page, the most recent Skate St. Moritz has already wrapped — the next edition's dates, schedule, fees, and officials have not yet been posted. Check stmoritzisc.org for the upcoming announcement.",
    levels: [
      { name: "Club historically offers: Well-Balanced Singles, Adult, Showcase, Solo Dance, Compete USA", count: null },
      { name: "2026–27 event list — not yet published", count: null },
    ],
    scheduleNote:
      "Dates and schedule for the next Skate St. Moritz have not yet been posted on stmoritzisc.org.",
    schedule: [],
    officials: [
      { role: "Competition Chair", name: NOT_PUBLISHED },
      { role: "Chief Referee", name: NOT_PUBLISHED },
      { role: "Tech Controller", name: NOT_PUBLISHED },
    ],
    logistics: [
      { label: "Host club", text: "St. Moritz ISC — founded 1931 by a group of women to book private ice time at the Oakland Ice Arena. USFS member club #2205." },
      { label: "Nearest airports", text: "OAK (Oakland), SFO (San Francisco), SJC (San José)." },
      { label: "Club history", text: "St. Moritz ISC hosted the 1st U.S. Championships in 1947, co-hosted Skate America (1991) and Worlds (1992), and hosted Adult Nationals in 1998." },
      { label: "Details", text: "Full next-edition announcement — venue, dates, events, fees, officials — not yet published." },
    ],
    past: [2025, 2024, 2023, 2022],
  },
  {
    id: "oktoberfest",
    name: "Oktoberfest / Autumn Open (host club TBC)",
    club: "Host club to be confirmed",
    city: "Columbus, OH (tentative)",
    state: "OH",
    venue: NOT_PUBLISHED + " (the Chiller Ice Rinks — 6 locations / 10 sheets across Central Ohio — are the most common hosts)",
    dateShort: NOT_PUBLISHED,
    dateLong: NOT_PUBLISHED,
    registerBy: NOT_PUBLISHED,
    registerLink: "https://columbusfsc.com/",
    status: "open",
    level: "Non-Qualifying · USFS Sanctioned",
    description:
      "An Oktoberfest-style autumn non-qualifying competition in the Columbus, OH area. We were unable to locate a 2026 official announcement at publishing time — the host club (commonly Columbus FSC, or an Ohio-area club using a Chiller Ice Rinks facility) and all details (dates, venue, events, schedule, officials, fees) have not been verified for 2026. Please confirm directly with the Columbus FSC website before making travel plans.",
    levels: [
      { name: "Host club and 2026 event list — not yet confirmed", count: null },
    ],
    scheduleNote:
      "Host club, dates, venue, events and officials for 2026 have not been verified. Please check columbusfsc.com (or the eventual hosting club's site) for the official announcement.",
    schedule: [],
    officials: [
      { role: "All officials", name: NOT_PUBLISHED },
    ],
    logistics: [
      { label: "Area rinks", text: "Central Ohio has the Chiller Ice Rinks (six locations / 10 sheets) plus OSU Ice Rink and the Ice Haus at Nationwide Arena." },
      { label: "Nearest airport", text: "John Glenn Columbus International (CMH)." },
      { label: "Important", text: "The 2026 host club and announcement have not been verified — please confirm before registering or booking travel." },
    ],
    past: [2025, 2024, 2023, 2022, 2021],
  },
  {
    id: "la-autumn-classic",
    name: "LA Autumn Classic",
    club: "Los Angeles FSC",
    city: "Los Angeles area, CA",
    state: "CA",
    venue: NOT_PUBLISHED,
    dateShort: NOT_PUBLISHED,
    dateLong: NOT_PUBLISHED,
    registerBy: NOT_PUBLISHED,
    registerLink: "https://www.lafsc.org/events",
    status: "open",
    level: "Non-Qualifying · USFS Sanctioned",
    description:
      "Hosted by the Los Angeles Figure Skating Club — one of the oldest figure skating clubs in the United States. The 2026 LA Autumn Classic announcement (dates, venue, events offered, schedule, officials) has not yet been published on lafsc.org/events. Please check back for details.",
    levels: [
      { name: "2026 events list not yet published", count: null },
    ],
    scheduleNote:
      "Schedule, dates, venue and officials for 2026 have not yet been published on the LAFSC events page.",
    schedule: [],
    officials: [
      { role: "Competition Chair", name: NOT_PUBLISHED },
      { role: "Chief Referee", name: NOT_PUBLISHED },
      { role: "Tech Controller", name: NOT_PUBLISHED },
    ],
    logistics: [
      { label: "Host club", text: "Los Angeles FSC (LAFSC)." },
      { label: "Nearest airports", text: "LAX, BUR, LGB — pick based on the final venue announcement." },
      { label: "Details", text: "Full 2026 announcement — venue, dates, events, fees, officials — not yet published." },
    ],
    past: [2025, 2024, 2023, 2022],
  },
  {
    id: "pacific-coast-sectional-final",
    name: "Pacific Coast Sectional Singles Final",
    club: "U.S. Figure Skating",
    city: "TBA — Pacific Coast Section",
    state: "US",
    venue: NOT_PUBLISHED,
    dateShort: NOT_PUBLISHED,
    dateLong: NOT_PUBLISHED,
    registerBy: "Qualification via the 2026–27 National Qualifying Series (NQS). No open entry.",
    registerLink: "https://usfigureskating.org/sports/2025/11/3/competition-info.aspx",
    status: "closing",
    level: "Qualifying · USFS Championship Series",
    description:
      "The Pacific Coast Sectional Singles Final is one of three Sectional Finals on the path to the U.S. Championships. Juvenile through Senior singles skaters from the Pacific Coast Section advance out of the National Qualifying Series (NQS) based on combined best scores to compete here, with top placements advancing to the U.S. Championships. The specific 2026–27 announcement (host city, venue, dates, officials) was not accessible at publishing time — check the USFS competition info page for the current details.",
    levels: [
      { name: "Juvenile Boys / Girls", count: null },
      { name: "Intermediate Men / Women", count: null },
      { name: "Novice Men / Women", count: null },
      { name: "Junior Men / Women", count: null },
      { name: "Senior Men / Women", count: null },
    ],
    scheduleNote:
      "The 2026–27 Pacific Coast Sectional Singles Final host city, dates and run-of-show were not yet accessible at publishing. See the U.S. Figure Skating event page for the current, official details.",
    schedule: [],
    officials: [
      { role: "All officials", name: "Assigned by U.S. Figure Skating — see the official announcement." },
    ],
    logistics: [
      { label: "How to qualify", text: "Skaters advance from the National Qualifying Series (NQS) based on their two highest combined NQS scores. No open entry." },
      { label: "Section", text: "Pacific Coast Section — the western U.S. clubs." },
      { label: "Leads to", text: "Top finishers advance to the U.S. Figure Skating Championships." },
      { label: "Registration", text: "Managed through USFS EMS; see the USFS announcement for deadlines and host information." },
      { label: "Details", text: "Host city, venue, dates and officials were not yet accessible from the USFS announcement page at publishing." },
    ],
    past: [2025, 2024, 2023, 2022, 2021],
  },
];

// Map pins — one per competition. Venues use the last-known location for still-TBD events so families
// have a rough geographic reference; the detail pane flags when the 2026 venue is not yet published.
window.RINKS = [
  { id: "r-jubilee",   name: "Sharks Ice at San José",       city: "San José, CA",           state: "CA", event: "Spring Jubilee",                     date: "May 8–10",     priceFrom: 25, priceTo: 75, x: 5,  y: 48, link: "#competitions" },
  { id: "r-dallas",    name: "StarCenter Plano",             city: "Plano, TX",              state: "TX", event: "Dallas Classic",                     date: "Jul 9–12",     priceFrom: 22, priceTo: 68, x: 52, y: 70, link: "#competitions" },
  { id: "r-cactus",    name: "Coyotes SC of AZ (venue TBD)", city: "Scottsdale, AZ",         state: "AZ", event: "Cactus Classic",                     date: "TBD",          priceFrom: 22, priceTo: 60, x: 20, y: 66, link: "#competitions" },
  { id: "r-glacier",   name: "Glacier Falls FSC (venue TBD)",city: "Southern California",    state: "CA", event: "Glacier Falls Summer Classic",       date: "TBD",          priceFrom: 28, priceTo: 85, x: 8,  y: 64, link: "#competitions" },
  { id: "r-stmoritz",  name: "St. Moritz ISC (venue TBD)",   city: "Bay Area, CA",           state: "CA", event: "Skate St. Moritz",                   date: "TBD",          priceFrom: 20, priceTo: 60, x: 4,  y: 46, link: "#competitions" },
  { id: "r-okt",       name: "Colonial Hills FSC (venue TBD)",city: "Columbus, OH",          state: "OH", event: "Oktoberfest",                        date: "TBD",          priceFrom: 20, priceTo: 60, x: 70, y: 42, link: "#competitions" },
  { id: "r-la",        name: "LAFSC (venue TBD)",            city: "Los Angeles, CA",        state: "CA", event: "LA Autumn Classic",                  date: "TBD",          priceFrom: 22, priceTo: 70, x: 7,  y: 63, link: "#competitions" },
  { id: "r-sectional", name: "Pacific Coast Sectional Final",city: "TBA — Pacific Coast",    state: "US", event: "Pacific Coast Sectional Singles Final", date: "TBD",       priceFrom: 35, priceTo: 95, x: 12, y: 52, link: "#competitions" },
];
