/* ============================================================
   Rink database + Albers USA projection calibrated to the
   reference US map image (assets/us-map.png, 1536x1024).

   The projection is a simplified Albers USA:
     - Lower 48: Albers conic equal-area (parallels 29.5°N, 45.5°N, center 96°W)
     - Alaska:   smaller Albers, translated to bottom-left inset
     - Hawaii:   smaller Albers, translated to inset next to Alaska

   Calibration anchors used (measured on the image):
     - Seattle, WA        (47.606, -122.332) ≈ (12.0%, 8.5%)
     - Miami, FL          (25.762,  -80.192) ≈ (83.4%, 59.8%)
     - San Diego, CA      (32.716, -117.161) ≈ (11.2%, 41.8%)
     - New York, NY       (40.713,  -74.006) ≈ (86.8%, 23.2%)
     - International Falls,MN (48.6, -93.4) ≈ (52.5%, 7.8%)
   ============================================================ */

(function () {
  // --- Albers conic equal-area (lower 48) ---
  // Standard parallels 29.5 and 45.5, reference latitude 37.5, central meridian -96.
  const DEG = Math.PI / 180;
  const phi0 = 37.5 * DEG;
  const phi1 = 29.5 * DEG;
  const phi2 = 45.5 * DEG;
  const lng0 = -96 * DEG;
  const n = 0.5 * (Math.sin(phi1) + Math.sin(phi2));
  const C = Math.cos(phi1) * Math.cos(phi1) + 2 * n * Math.sin(phi1);
  const rho0 = Math.sqrt(C - 2 * n * Math.sin(phi0)) / n;

  function albersRaw(lng, lat) {
    const phi = lat * DEG;
    const lam = lng * DEG - lng0;
    const rho = Math.sqrt(C - 2 * n * Math.sin(phi)) / n;
    const theta = n * lam;
    return [rho * Math.sin(theta), rho0 - rho * Math.cos(theta)];
  }

  /* Calibration derived via least-squares fit across 14 anchor cities
     (Seattle, SF, LA, San Diego, Denver, Chicago, Dallas, Houston,
      Minneapolis, Intl Falls, Boston, NYC, Miami, Brownsville). */
  const kx = 131.1454;
  const bx = 50.4722;
  const ky = -188.8713;
  const by = 49.7104;

  function project48(lng, lat) {
    const [rx, ry] = albersRaw(lng, lat);
    return { x: kx * rx + bx, y: ky * ry + by };
  }

  // Alaska inset: use same Albers but smaller scale, anchored at bottom-left.
  // Anchor: Anchorage (61.22, -149.9) ≈ (11.5%, 62.0%) in the image.
  // Use scale ~0.35 of mainland.
  function projectAK(lng, lat) {
    // Rotate-less simple Albers centered on -154, parallel 55, 65
    const phi = lat * DEG;
    const lam = (lng + 154) * DEG;
    const akn = 0.5 * (Math.sin(55 * DEG) + Math.sin(65 * DEG));
    const akC = Math.cos(55 * DEG) ** 2 + 2 * akn * Math.sin(55 * DEG);
    const akRho0 = Math.sqrt(akC - 2 * akn * Math.sin(60 * DEG)) / akn;
    const rho = Math.sqrt(akC - 2 * akn * Math.sin(phi)) / akn;
    const theta = akn * lam;
    const rx = rho * Math.sin(theta);
    const ry = akRho0 - rho * Math.cos(theta);
    // Scale and translate into bottom-left inset
    const scale = 20;
    const cx = 11.0, cy = 85.0; // center of Alaska inset on image
    return { x: cx + rx * scale, y: cy + ry * scale };
  }

  // Hawaii inset: simple linear for 4 islands around (21°N, -157°W)
  function projectHI(lng, lat) {
    const cx = 25.0, cy = 91.0;
    // 1° lng ≈ 0.85% x (east->right), 1° lat ≈ 1.2% y (up->up)
    const x = cx + (lng + 157) * 0.85;
    const y = cy - (lat - 21) * 1.2;
    return { x, y };
  }

  window.projectToMap = function (lng, lat, stateCode) {
    if (stateCode === "AK") return projectAK(lng, lat);
    if (stateCode === "HI") return projectHI(lng, lat);
    return project48(lng, lat);
  };
})();

/* ============================================================
   Known ticket / official-site URLs for major rinks.
   Keyed by a normalized "rink name" → URL. All other rinks fall
   back to a Google search for "<rink name> <city> tickets".
   ============================================================ */
window.RINK_LINKS = {
  "Sharks Ice at San Jose":            "https://www.sharksice.com/",
  "Solar4America Ice at Fremont":      "https://www.solar4americaice.com/fremont/",
  "Oakland Ice Center":                "https://www.oaklandice.com/",
  "Yerba Buena Ice Skating Center":    "https://skatebowl.com/",
  "Snoopy's Home Ice":                 "https://snoopyshomeice.com/",
  "Redwood Empire Ice Arena":          "https://snoopyshomeice.com/",
  "Toyota Sports Performance Center":  "https://www.toyotasportsperformancecenter.com/",
  "Pasadena Ice Skating Center":       "https://skatepasadena.com/",
  "Pickwick Ice Center":               "https://pickwickice.com/",
  "LA Kings Valley Ice Center":        "https://www.lakingsicecenters.com/",
  "Lakewood ICE":                      "https://www.therinks.com/lakewood-ice/",
  "Great Park Ice & FivePoint Arena":  "https://www.greatparkice.com/",
  "Anaheim ICE":                       "https://www.therinks.com/anaheim-ice/",
  "The Rinks — Lakewood ICE":          "https://www.therinks.com/lakewood-ice/",
  "The Rinks — Westminster":           "https://www.therinks.com/westminster-ice/",
  "The Rinks — Yorba Linda":           "https://www.therinks.com/yorba-linda-ice/",
  "Icetown Carlsbad":                  "https://icetowncarlsbad.com/",
  "San Diego Ice Arena":               "https://sandiegoicearena.com/",
  "UTC Ice Sports Center":             "https://www.utcicearena.com/",
  "Poway Ice Arena":                   "https://www.powayicearena.com/",
  "Culver Ice Arena":                  "https://culverice.com/",
  "Paramount Iceland":                 "https://paramounticeland.com/",
  "Kraken Community Iceplex":          "https://www.krakencommunityiceplex.com/",
  "Lynnwood Ice Center":               "https://www.lynnwoodwa.gov/Things-To-Do/Lynnwood-Ice-Center",
  "Sno-King Ice Arena":                "https://snokingicearenas.com/",
  "Kent Valley Ice Centre":            "https://kentvalleyice.com/",
  "Eagles Ice-A-Rena":                 "https://eaglesicearena.com/",
  "Sherwood Ice Arena":                "https://www.sherwoodicearena.com/",
  "Lloyd Center Ice Rink":             "https://www.lloydcentericerink.com/",
  "Winterhawks Skating Center":        "https://winterhawksskatingcenter.com/",
  "Mountain View Ice Arena":           "https://www.mtviewice.com/",
  "Ice Den Chandler":                  "https://icedenchandler.com/",
  "Ice Den Scottsdale":                "https://www.coyotesicedens.com/",
  "AZ Ice Peoria":                     "https://azicearenas.com/",
  "AZ Ice Gilbert":                    "https://azicearenas.com/",
  "Las Vegas Ice Center":              "https://www.lasvegasice.com/",
  "City National Arena (VGK)":         "https://www.citynationalarena.com/",
  "Lifeguard Arena":                   "https://www.lifeguardarenahenderson.com/",
  "Reno Ice":                          "https://www.renoice.com/",
  "Utah Olympic Oval":                 "https://utaholympiclegacy.org/location/utah-olympic-oval/",
  "Cottonwood Heights Recreation Ctr": "https://www.cottonwoodheights.utah.gov/recreation-center",
  "Acord Ice Arena":                   "https://www.acordicearena.com/",
  "Park City Ice Arena":               "https://www.parkcityicearena.com/",
  "Peaks Ice Arena":                   "https://www.peaksicearena.com/",
  "South Suburban Ice Arena":          "https://www.ssprd.org/southsuburbanicearena",
  "Edge Ice Arena":                    "https://edgeicearena.com/",
  "Apex Center Ice Arena":             "https://www.apexprd.org/apex-center",
  "World Arena Ice Hall":              "https://www.broadmoorworldarena.com/",
  "Ice Centre at the Promenade":       "https://www.ice-centre.com/",
  "Children's Health StarCenter Euless": "https://www.dallasstars.com/community/starcenters.html",
  "StarCenter Frisco":                 "https://www.dallasstars.com/community/starcenters.html",
  "StarCenter Plano":                  "https://www.dallasstars.com/community/starcenters.html",
  "StarCenter McKinney":               "https://www.dallasstars.com/community/starcenters.html",
  "StarCenter Farmers Branch":         "https://www.dallasstars.com/community/starcenters.html",
  "StarCenter Mansfield":              "https://www.dallasstars.com/community/starcenters.html",
  "Sugar Land Ice & Sports Center":    "https://www.sugarlandice.com/",
  "Aerodrome Ice Skating Complex":     "https://www.aerodromes.com/",
  "Chaparral Ice":                     "https://chaparralice.com/",
  "Parade Ice Garden":                 "https://www.minneapolisparks.org/parks-destinations/parks-lakes/parade-ice-garden/",
  "Braemar Arena":                     "https://www.braemararena.com/",
  "Schwan Super Rink":                 "https://www.nscsports.org/super-rink/",
  "TRIA Rink":                         "https://www.triarink.com/",
  "Ann Arbor Ice Cube":                "https://www.annarboricecube.com/",
  "Detroit Skating Club":              "https://www.dscclub.com/",
  "USA Hockey Arena":                  "https://www.usahockeyarena.com/",
  "McFetridge Sports Center":          "https://www.chicagoparkdistrict.com/parks-facilities/mcfetridge-sports-center",
  "Johnny's IceHouse West":            "https://www.johnnysicehouse.com/",
  "Seven Bridges Ice Arena":           "https://www.sevenbridgesicearena.com/",
  "Glacier Ice Arena":                 "https://www.glaciericearena.com/",
  "Pettit National Ice Center":        "https://www.thepettit.com/",
  "OhioHealth Chiller Dublin":         "https://thechiller.com/",
  "OhioHealth Chiller North":          "https://thechiller.com/",
  "OhioHealth Chiller Easton":         "https://thechiller.com/",
  "UPMC Lemieux Sports Complex":       "https://upmcicecomplex.com/",
  "RMU Island Sports Center":          "https://www.islandsportscenter.org/",
  "Penn Class of 1923 Arena":          "https://www.pennathletics.com/facilities/the-class-of-1923-arena/3",
  "Hershey Ice Skating Center":        "https://www.hersheyicecenter.com/",
  "Chelsea Piers Sky Rink":            "https://www.chelseapiers.com/skyrink/",
  "Prospect Park LeFrak Center":       "https://www.lefrakcenter.com/",
  "Aviator Sports & Events Center":    "https://www.aviatorsports.com/",
  "Playland Ice Casino":               "https://playland.com/ice-casino/",
  "Bill Gray's Regional Iceplex":      "https://www.rochestersport.com/",
  "Lake Placid Olympic Center":        "https://www.lakeplacidolympicsites.com/olympic-center/",
  "Buffalo RiverWorks":                "https://buffaloriverworks.com/",
  "HarborCenter (Sabres)":             "https://www.harborcenter.com/",
  "Codey Arena (South Mountain)":      "https://essexcountyparks.org/parks/south-mountain-recreation-complex/rinks",
  "Mennen Sports Arena":               "https://www.morrisparks.net/mennen-arena/",
  "American Dream Big Snow Ice":       "https://www.americandream.com/",
  "Prudential Center Practice Rink":   "https://www.prucenter.com/",
  "International Skating Center of CT":"https://www.iscofct.com/",
  "Champions Skating Center":          "https://www.championsskating.com/",
  "Skating Club of Boston":            "https://www.scboston.org/",
  "Boch Ice Center":                   "https://www.bochicecenter.com/",
  "Worcester Ice Center":              "https://www.worcesterice.com/",
  "Ellenton Ice & Sports Complex":     "https://ellentonice.com/",
  "AdventHealth Center Ice":           "https://www.adventhealthcenterice.com/",
  "RDV Sportsplex Ice Den":            "https://www.rdvsportsplex.com/",
  "Kendall Ice Arena":                 "https://www.kendallicearena.com/",
  "Panthers IceDen":                   "https://www.floridapanthersiceden.com/",
  "Clearwater Ice Arena":              "https://www.clearwatericearena.com/",
  "Hertz Arena Practice Rink":         "https://hertzarena.com/",
  "Extreme Ice Center":                "https://extremeicecenter.com/",
  "Pineville Ice House":               "https://www.pinevilleicehouse.com/",
  "Raleigh Iceplex":                   "https://www.raleighiceplex.com/",
  "Ford Ice Center Bellevue":          "https://www.fordicecenter.com/",
  "Ford Ice Center Antioch":           "https://www.fordicecenter.com/",
  "Centennial Sportsplex":             "https://www.nashville.gov/departments/parks/community-centers/centennial-sportsplex",
  "Mid-South Ice House":               "https://www.midsouthicehouse.com/",
  "Iceland Sports Complex":            "https://www.icelandsportscomplex.com/",
  "Indiana/World Skating Academy":     "https://www.indysa.org/",
  "Carmel Ice Skadium":                "https://www.carmeliceskadium.com/",
  "Creve Coeur Ice Arena":             "https://www.crevecoeurice.com/",
  "Kirkwood Ice Arena":                "https://www.kirkwoodmo.org/ice-arena",
  "Line Creek Community Center":       "https://www.parkvillemo.gov/",
  "Wichita Ice Center":                "https://wichitaicecenter.com/",
  "Tulsa Oilers Ice Center":           "https://www.tulsaoilers.com/",
  "Outpost Ice Arenas":                "https://www.outposticearenas.com/",
  "Troubh Ice Arena":                  "https://www.troubhicearena.com/",
  "Everett Arena":                     "https://www.concordnh.gov/1141/Everett-Arena",
  "Cairns Arena":                      "https://www.cairnsarena.com/",
  "Sullivan Arena":                    "https://sullivanarena.com/",
  "Ben Boeke Ice Arena":               "https://sullivanarena.com/ben-boeke-ice-arena/",
  "Dempsey Anderson Ice Arena":        "https://sullivanarena.com/dempsey-anderson-ice-arena/",
  "Ice Palace Hawaii":                 "https://icepalacehawaii.com/",
  "Pelham Civic Complex & Ice Arena":  "https://www.pelhamciviccomplex.com/",
  "MedStar Capitals Iceplex":          "https://www.medstarcapitalsiceplex.com/",
  "Rockville Ice Arena":               "https://www.rockvilleicearena.com/",
  "Cabin John Ice Rink":               "https://www.montgomeryparks.org/parks-and-trails/cabin-john-regional-park/ice-rink/",
  "Gardens Ice House":                 "https://www.thegardensicehouse.com/",
  "Fort Dupont Ice Arena":             "https://www.fdia.org/",
  "Protec Ponds Hockey Arena":         "https://www.protecponds.com/",
  "Ashburn Ice House":                 "https://www.ashburnice.com/",
  "SkateQuest Reston":                 "https://skatequest.com/",
  "Idaho IceWorld":                    "https://www.idahoiceworld.com/",
  "Cheyenne Ice & Events Center":      "https://www.cheyennecity.org/208/Ice-Events-Center",
  "Sun Valley Ice":                    "https://www.sunvalley.com/ice/",
};

function getRinkLink(rink) {
  if (window.RINK_LINKS[rink.name]) return window.RINK_LINKS[rink.name];
  // Fallback: Google "I'm feeling lucky"-style search that typically
  // lands users on the rink's website or ticketing page.
  const q = encodeURIComponent(rink.name + " " + rink.city + " tickets");
  return "https://www.google.com/search?q=" + q;
}
window.getRinkLink = getRinkLink;

/* ============================================================
   Rink database — major competition rinks, training centers,
   community rec centers, and local ice facilities across the US.
   Each entry: { name, city, state, lat, lng }
   ============================================================ */
window.RINK_DATABASE = [
  // ========== CALIFORNIA (expanded) ==========
  { name:"Sharks Ice at San Jose",            city:"San Jose",        state:"CA", lat:37.35, lng:-121.90 },
  { name:"Solar4America Ice at Fremont",      city:"Fremont",         state:"CA", lat:37.51, lng:-121.97 },
  { name:"Oakland Ice Center",                city:"Oakland",         state:"CA", lat:37.80, lng:-122.27 },
  { name:"Yerba Buena Ice Skating Center",    city:"San Francisco",   state:"CA", lat:37.78, lng:-122.41 },
  { name:"Redwood Empire Ice Arena",          city:"Santa Rosa",      state:"CA", lat:38.45, lng:-122.73 },
  { name:"Snoopy's Home Ice",                 city:"Santa Rosa",      state:"CA", lat:38.46, lng:-122.73 },
  { name:"Vacaville Ice Sports Center",       city:"Vacaville",       state:"CA", lat:38.36, lng:-121.98 },
  { name:"Sacramento Ice Arena (Skatetown)",  city:"Roseville",       state:"CA", lat:38.75, lng:-121.29 },
  { name:"Iceland of Berkeley (legacy)",      city:"Berkeley",        state:"CA", lat:37.87, lng:-122.27 },
  { name:"Oak Park Ice Arena",                city:"Stockton",        state:"CA", lat:37.96, lng:-121.29 },
  { name:"Modesto On Ice",                    city:"Modesto",         state:"CA", lat:37.64, lng:-120.99 },
  { name:"Gateway Ice Center",                city:"Fresno",          state:"CA", lat:36.75, lng:-119.77 },
  { name:"Icetown Riverside",                 city:"Riverside",       state:"CA", lat:33.95, lng:-117.40 },
  { name:"Toyota Sports Performance Center",  city:"El Segundo",      state:"CA", lat:33.92, lng:-118.40 },
  { name:"Pasadena Ice Skating Center",       city:"Pasadena",        state:"CA", lat:34.14, lng:-118.14 },
  { name:"Pickwick Ice Center",               city:"Burbank",         state:"CA", lat:34.19, lng:-118.33 },
  { name:"LA Kings Valley Ice Center",        city:"Panorama City",   state:"CA", lat:34.23, lng:-118.46 },
  { name:"Lakewood ICE",                      city:"Lakewood",        state:"CA", lat:33.85, lng:-118.13 },
  { name:"Great Park Ice & FivePoint Arena",  city:"Irvine",          state:"CA", lat:33.72, lng:-117.80 },
  { name:"Anaheim ICE",                       city:"Anaheim",         state:"CA", lat:33.83, lng:-117.91 },
  { name:"The Rinks — Lakewood ICE",          city:"Lakewood",        state:"CA", lat:33.84, lng:-118.14 },
  { name:"The Rinks — Westminster",           city:"Westminster",     state:"CA", lat:33.76, lng:-118.00 },
  { name:"The Rinks — Yorba Linda",           city:"Yorba Linda",     state:"CA", lat:33.89, lng:-117.81 },
  { name:"KHS Ice Arena",                     city:"Anaheim",         state:"CA", lat:33.83, lng:-117.91 },
  { name:"Ontario Center Ice Arena",          city:"Ontario",         state:"CA", lat:34.07, lng:-117.65 },
  { name:"Icetown Carlsbad",                  city:"Carlsbad",        state:"CA", lat:33.13, lng:-117.31 },
  { name:"San Diego Ice Arena",               city:"San Diego",       state:"CA", lat:32.91, lng:-117.12 },
  { name:"UTC Ice Sports Center",             city:"San Diego",       state:"CA", lat:32.87, lng:-117.21 },
  { name:"Poway Ice Arena",                   city:"Poway",           state:"CA", lat:32.96, lng:-117.03 },
  { name:"Mira Mesa Iceoplex Escondido",      city:"Escondido",       state:"CA", lat:33.13, lng:-117.07 },
  { name:"Culver Ice Arena",                  city:"Culver City",     state:"CA", lat:34.00, lng:-118.40 },
  { name:"Paramount Iceland",                 city:"Paramount",       state:"CA", lat:33.90, lng:-118.17 },
  { name:"Bakersfield Ice Sports Center",     city:"Bakersfield",     state:"CA", lat:35.37, lng:-119.02 },

  // ========== WASHINGTON ==========
  { name:"Kraken Community Iceplex",          city:"Seattle",         state:"WA", lat:47.67, lng:-122.30 },
  { name:"Lynnwood Ice Center",               city:"Lynnwood",        state:"WA", lat:47.82, lng:-122.31 },
  { name:"Olympicview Arena",                 city:"Mountlake Terrace",state:"WA",lat:47.79, lng:-122.30 },
  { name:"Sno-King Ice Arena",                city:"Renton",          state:"WA", lat:47.48, lng:-122.18 },
  { name:"Kent Valley Ice Centre",            city:"Kent",            state:"WA", lat:47.38, lng:-122.23 },
  { name:"Olympia Skating Club (Regency)",    city:"Lacey",           state:"WA", lat:47.04, lng:-122.82 },
  { name:"Castle Ice Arena",                  city:"Renton",          state:"WA", lat:47.47, lng:-122.11 },
  { name:"Eagles Ice-A-Rena",                 city:"Spokane",         state:"WA", lat:47.67, lng:-117.39 },
  { name:"Riverfront Park Ice Ribbon",        city:"Spokane",         state:"WA", lat:47.66, lng:-117.42 },

  // ========== OREGON ==========
  { name:"Sherwood Ice Arena",                city:"Sherwood",        state:"OR", lat:45.35, lng:-122.84 },
  { name:"Lloyd Center Ice Rink",             city:"Portland",        state:"OR", lat:45.53, lng:-122.65 },
  { name:"Winterhawks Skating Center",        city:"Beaverton",       state:"OR", lat:45.49, lng:-122.82 },
  { name:"Mountain View Ice Arena",           city:"Vancouver",       state:"WA", lat:45.65, lng:-122.57 },
  { name:"The Ice Chalet",                    city:"Salem",           state:"OR", lat:44.94, lng:-123.03 },
  { name:"The Rink Exchange",                 city:"Eugene",          state:"OR", lat:44.05, lng:-123.08 },

  // ========== ARIZONA ==========
  { name:"Ice Den Chandler",                  city:"Chandler",        state:"AZ", lat:33.30, lng:-111.94 },
  { name:"Ice Den Scottsdale",                city:"Scottsdale",      state:"AZ", lat:33.61, lng:-111.89 },
  { name:"AZ Ice Peoria",                     city:"Peoria",          state:"AZ", lat:33.58, lng:-112.24 },
  { name:"AZ Ice Gilbert",                    city:"Gilbert",         state:"AZ", lat:33.35, lng:-111.79 },
  { name:"Polar Ice Gilbert",                 city:"Gilbert",         state:"AZ", lat:33.35, lng:-111.79 },
  { name:"Mullett Arena Community Ice",       city:"Tempe",           state:"AZ", lat:33.42, lng:-111.93 },
  { name:"Oceanside Ice Arena",               city:"Tempe",           state:"AZ", lat:33.42, lng:-111.94 },
  { name:"Tucson Convention Center Ice",      city:"Tucson",          state:"AZ", lat:32.22, lng:-110.97 },
  { name:"Flagstaff Jay Lively Activity Ctr", city:"Flagstaff",       state:"AZ", lat:35.20, lng:-111.65 },

  // ========== NEVADA ==========
  { name:"Las Vegas Ice Center",              city:"Las Vegas",       state:"NV", lat:36.13, lng:-115.24 },
  { name:"City National Arena (VGK)",         city:"Summerlin",       state:"NV", lat:36.17, lng:-115.33 },
  { name:"SoBe Ice Arena at Fiesta",          city:"Henderson",       state:"NV", lat:36.03, lng:-114.98 },
  { name:"Lifeguard Arena",                   city:"Henderson",       state:"NV", lat:36.03, lng:-114.98 },
  { name:"Reno Ice",                          city:"Reno",            state:"NV", lat:39.54, lng:-119.74 },

  // ========== UTAH ==========
  { name:"Utah Olympic Oval",                 city:"Kearns",          state:"UT", lat:40.66, lng:-112.01 },
  { name:"Cottonwood Heights Recreation Ctr", city:"Cottonwood Heights",state:"UT",lat:40.62, lng:-111.81 },
  { name:"Acord Ice Arena",                   city:"West Valley City",state:"UT", lat:40.69, lng:-111.98 },
  { name:"Park City Ice Arena",               city:"Park City",       state:"UT", lat:40.69, lng:-111.51 },
  { name:"Salt Lake County Ice Center (Murray)",city:"Murray",        state:"UT", lat:40.66, lng:-111.89 },
  { name:"Weber County Ice Sheet",            city:"Ogden",           state:"UT", lat:41.23, lng:-111.96 },
  { name:"Peaks Ice Arena",                   city:"Provo",           state:"UT", lat:40.25, lng:-111.66 },

  // ========== COLORADO ==========
  { name:"South Suburban Ice Arena",          city:"Littleton",       state:"CO", lat:39.61, lng:-104.97 },
  { name:"Edge Ice Arena",                    city:"Littleton",       state:"CO", lat:39.60, lng:-104.96 },
  { name:"Family Sports Ice Arena",           city:"Centennial",      state:"CO", lat:39.59, lng:-104.92 },
  { name:"Apex Center Ice Arena",             city:"Arvada",          state:"CO", lat:39.85, lng:-105.11 },
  { name:"Foothills Ice Arena",               city:"Lakewood",        state:"CO", lat:39.71, lng:-105.11 },
  { name:"Arapahoe Skating Club @ Ice Ranch", city:"Littleton",       state:"CO", lat:39.57, lng:-104.97 },
  { name:"Ice Centre at the Promenade",       city:"Westminster",     state:"CO", lat:39.92, lng:-105.06 },
  { name:"DU Ritchie Center",                 city:"Denver",          state:"CO", lat:39.67, lng:-104.96 },
  { name:"World Arena Ice Hall",              city:"Colorado Springs",state:"CO", lat:38.78, lng:-104.80 },
  { name:"Sertich Ice Center",                city:"Colorado Springs",state:"CO", lat:38.84, lng:-104.82 },
  { name:"Breckenridge Ice Arena",            city:"Breckenridge",    state:"CO", lat:39.48, lng:-106.04 },
  { name:"Vail Recreation District Ice Rink", city:"Vail",            state:"CO", lat:39.64, lng:-106.37 },
  { name:"Howelsen Ice Arena",                city:"Steamboat Springs",state:"CO",lat:40.48, lng:-106.84 },

  // ========== TEXAS ==========
  { name:"Children's Health StarCenter Euless",city:"Euless",         state:"TX", lat:32.84, lng:-97.08 },
  { name:"StarCenter Frisco",                 city:"Frisco",          state:"TX", lat:33.16, lng:-96.82 },
  { name:"StarCenter Plano",                  city:"Plano",           state:"TX", lat:33.02, lng:-96.70 },
  { name:"StarCenter McKinney",               city:"McKinney",        state:"TX", lat:33.20, lng:-96.64 },
  { name:"StarCenter Farmers Branch",         city:"Farmers Branch",  state:"TX", lat:32.93, lng:-96.89 },
  { name:"StarCenter Mansfield",              city:"Mansfield",       state:"TX", lat:32.56, lng:-97.14 },
  { name:"Sugar Land Ice & Sports Center",    city:"Sugar Land",      state:"TX", lat:29.62, lng:-95.63 },
  { name:"Aerodrome Ice Skating Complex",     city:"Houston",         state:"TX", lat:29.76, lng:-95.37 },
  { name:"Space City Ice Station",            city:"Friendswood",     state:"TX", lat:29.53, lng:-95.19 },
  { name:"Discovery Green Ice Rink",          city:"Houston",         state:"TX", lat:29.75, lng:-95.36 },
  { name:"Northwoods Ice Center",             city:"San Antonio",     state:"TX", lat:29.57, lng:-98.51 },
  { name:"Ice & Golf Center @ North Star",    city:"San Antonio",     state:"TX", lat:29.53, lng:-98.47 },
  { name:"Crystal Ice Skating Center",        city:"Austin",          state:"TX", lat:30.27, lng:-97.74 },
  { name:"Chaparral Ice",                     city:"Austin",          state:"TX", lat:30.38, lng:-97.69 },
  { name:"El Paso Event Center Ice",          city:"El Paso",         state:"TX", lat:31.76, lng:-106.48 },

  // ========== MINNESOTA ==========
  { name:"Parade Ice Garden",                 city:"Minneapolis",     state:"MN", lat:44.97, lng:-93.28 },
  { name:"Braemar Arena",                     city:"Edina",           state:"MN", lat:44.86, lng:-93.37 },
  { name:"Bloomington Ice Garden",            city:"Bloomington",     state:"MN", lat:44.84, lng:-93.30 },
  { name:"Schwan Super Rink",                 city:"Blaine",          state:"MN", lat:45.17, lng:-93.23 },
  { name:"St. Louis Park Rec Center",         city:"St. Louis Park",  state:"MN", lat:44.94, lng:-93.38 },
  { name:"Minnetonka Ice Arena",              city:"Minnetonka",      state:"MN", lat:44.93, lng:-93.50 },
  { name:"TRIA Rink",                         city:"Saint Paul",      state:"MN", lat:44.95, lng:-93.09 },
  { name:"Biff Adams Arena",                  city:"Saint Paul",      state:"MN", lat:44.96, lng:-93.15 },
  { name:"Rochester Recreation Center",       city:"Rochester",       state:"MN", lat:44.02, lng:-92.46 },
  { name:"Duluth Heritage Sports Center",     city:"Duluth",          state:"MN", lat:46.77, lng:-92.10 },

  // ========== MICHIGAN ==========
  { name:"Ann Arbor Ice Cube",                city:"Ann Arbor",       state:"MI", lat:42.28, lng:-83.74 },
  { name:"Veterans Memorial Ice Arena",       city:"Ann Arbor",       state:"MI", lat:42.30, lng:-83.70 },
  { name:"Detroit Skating Club",              city:"Bloomfield Hills",state:"MI", lat:42.58, lng:-83.24 },
  { name:"Onyx Rochester Ice Arena",          city:"Rochester",       state:"MI", lat:42.68, lng:-83.13 },
  { name:"Kennedy Ice Arena",                 city:"Trenton",         state:"MI", lat:42.14, lng:-83.19 },
  { name:"Wings West Ice Arena",              city:"Kalamazoo",       state:"MI", lat:42.25, lng:-85.55 },
  { name:"Lansing Ice & Gymnastics Center",   city:"Lansing",         state:"MI", lat:42.73, lng:-84.55 },
  { name:"Suburban Ice Macomb",               city:"Macomb",          state:"MI", lat:42.66, lng:-82.92 },
  { name:"USA Hockey Arena",                  city:"Plymouth",        state:"MI", lat:42.37, lng:-83.47 },
  { name:"Patterson Ice Arena",               city:"Grand Rapids",    state:"MI", lat:42.92, lng:-85.58 },

  // ========== ILLINOIS ==========
  { name:"Centennial Ice Arena",              city:"Highland Park",   state:"IL", lat:42.18, lng:-87.80 },
  { name:"Centennial Ice Arena Wilmette",     city:"Wilmette",        state:"IL", lat:42.08, lng:-87.72 },
  { name:"McFetridge Sports Center",          city:"Chicago",         state:"IL", lat:41.96, lng:-87.70 },
  { name:"Johnny's IceHouse West",            city:"Chicago",         state:"IL", lat:41.88, lng:-87.66 },
  { name:"Seven Bridges Ice Arena",           city:"Woodridge",       state:"IL", lat:41.75, lng:-88.04 },
  { name:"Glacier Ice Arena",                 city:"Vernon Hills",    state:"IL", lat:42.23, lng:-87.95 },
  { name:"Twin Rinks Ice Pavilion",           city:"Buffalo Grove",   state:"IL", lat:42.15, lng:-87.96 },
  { name:"Northbrook Sports Center",          city:"Northbrook",      state:"IL", lat:42.12, lng:-87.84 },
  { name:"Skokie Skatium (Oakton Ice)",       city:"Skokie",          state:"IL", lat:42.03, lng:-87.75 },
  { name:"Nelson Ice Arena",                  city:"Rockford",        state:"IL", lat:42.27, lng:-89.09 },

  // ========== WISCONSIN ==========
  { name:"Pettit National Ice Center",        city:"Milwaukee",       state:"WI", lat:43.01, lng:-87.99 },
  { name:"Eble Ice Arena",                    city:"Brookfield",      state:"WI", lat:43.06, lng:-88.11 },
  { name:"Ozaukee Ice Center",                city:"Mequon",          state:"WI", lat:43.24, lng:-87.99 },
  { name:"Hartmeyer Ice Arena",               city:"Madison",         state:"WI", lat:43.11, lng:-89.38 },
  { name:"Bob Suter's Capitol Ice Arena",     city:"Middleton",       state:"WI", lat:43.10, lng:-89.51 },
  { name:"Appleton Family Ice Center",        city:"Appleton",        state:"WI", lat:44.26, lng:-88.41 },

  // ========== OHIO ==========
  { name:"Cleveland Skating Club",            city:"Shaker Heights",  state:"OH", lat:41.47, lng:-81.56 },
  { name:"Winterhurst Ice Rink",              city:"Lakewood",        state:"OH", lat:41.48, lng:-81.81 },
  { name:"Mentor Civic Ice Arena",            city:"Mentor",          state:"OH", lat:41.66, lng:-81.34 },
  { name:"OhioHealth Chiller Dublin",         city:"Dublin",          state:"OH", lat:40.10, lng:-83.11 },
  { name:"OhioHealth Chiller North",          city:"Lewis Center",    state:"OH", lat:40.20, lng:-83.00 },
  { name:"OhioHealth Chiller Easton",         city:"Columbus",        state:"OH", lat:40.05, lng:-82.91 },
  { name:"Northland Arena",                   city:"Columbus",        state:"OH", lat:40.09, lng:-82.94 },
  { name:"Cincinnati Gardens (legacy)",       city:"Cincinnati",      state:"OH", lat:39.18, lng:-84.46 },
  { name:"Sports Plus Ice Arena",             city:"Evendale",        state:"OH", lat:39.25, lng:-84.41 },
  { name:"Kettering Ice Arena",               city:"Kettering",       state:"OH", lat:39.69, lng:-84.17 },

  // ========== PENNSYLVANIA ==========
  { name:"UPMC Lemieux Sports Complex",       city:"Cranberry Twp.",  state:"PA", lat:40.68, lng:-80.11 },
  { name:"RMU Island Sports Center",          city:"Pittsburgh",      state:"PA", lat:40.47, lng:-80.05 },
  { name:"Penn Class of 1923 Arena",          city:"Philadelphia",    state:"PA", lat:39.95, lng:-75.21 },
  { name:"IceWorks Skating Complex",          city:"Aston",           state:"PA", lat:39.86, lng:-75.44 },
  { name:"Ice Line",                          city:"West Chester",    state:"PA", lat:39.96, lng:-75.62 },
  { name:"Hatfield Ice Arena",                city:"Hatfield",        state:"PA", lat:40.28, lng:-75.30 },
  { name:"Revolution Ice Centre",             city:"Pittston",        state:"PA", lat:41.32, lng:-75.79 },
  { name:"Hershey Ice Skating Center",        city:"Hershey",         state:"PA", lat:40.29, lng:-76.65 },
  { name:"Ice Center at Chestnut Hill",       city:"Philadelphia",    state:"PA", lat:40.08, lng:-75.21 },

  // ========== NEW YORK ==========
  { name:"Chelsea Piers Sky Rink",            city:"New York",        state:"NY", lat:40.75, lng:-74.01 },
  { name:"Prospect Park LeFrak Center",       city:"Brooklyn",        state:"NY", lat:40.66, lng:-73.97 },
  { name:"Riverbank State Park Ice",          city:"New York",        state:"NY", lat:40.83, lng:-73.95 },
  { name:"Aviator Sports & Events Center",    city:"Brooklyn",        state:"NY", lat:40.59, lng:-73.90 },
  { name:"Ice Hutch",                         city:"Mount Vernon",    state:"NY", lat:40.91, lng:-73.83 },
  { name:"Playland Ice Casino",               city:"Rye",             state:"NY", lat:40.97, lng:-73.67 },
  { name:"Iceland on the Hudson",             city:"Port Chester",    state:"NY", lat:40.99, lng:-73.66 },
  { name:"Nassau Coliseum Practice Rink",     city:"Uniondale",       state:"NY", lat:40.72, lng:-73.59 },
  { name:"Twin Rinks at Eisenhower Park",     city:"East Meadow",     state:"NY", lat:40.73, lng:-73.56 },
  { name:"Long Beach Ice Arena",              city:"Long Beach",      state:"NY", lat:40.59, lng:-73.66 },
  { name:"Bill Gray's Regional Iceplex",      city:"Rochester",       state:"NY", lat:43.12, lng:-77.62 },
  { name:"Lake Placid Olympic Center",        city:"Lake Placid",     state:"NY", lat:44.28, lng:-73.98 },
  { name:"Clinton Arena",                     city:"Clinton",         state:"NY", lat:43.05, lng:-75.38 },
  { name:"Empire Sports Academy",             city:"Henrietta",       state:"NY", lat:43.04, lng:-77.62 },
  { name:"Buffalo RiverWorks",                city:"Buffalo",         state:"NY", lat:42.88, lng:-78.87 },
  { name:"HarborCenter (Sabres)",             city:"Buffalo",         state:"NY", lat:42.87, lng:-78.87 },

  // ========== NEW JERSEY ==========
  { name:"Codey Arena (South Mountain)",      city:"West Orange",     state:"NJ", lat:40.76, lng:-74.26 },
  { name:"Mennen Sports Arena",               city:"Morristown",      state:"NJ", lat:40.80, lng:-74.47 },
  { name:"American Dream Big Snow Ice",       city:"East Rutherford", state:"NJ", lat:40.81, lng:-74.07 },
  { name:"Prudential Center Practice Rink",   city:"Newark",          state:"NJ", lat:40.73, lng:-74.17 },
  { name:"Protec Ponds Hockey Arena",         city:"Somerset",        state:"NJ", lat:40.51, lng:-74.51 },
  { name:"Union Sports Arena",                city:"Union",           state:"NJ", lat:40.69, lng:-74.26 },
  { name:"Ice Vault Arena",                   city:"Wayne",           state:"NJ", lat:40.93, lng:-74.26 },
  { name:"Flyers Skate Zone Voorhees",        city:"Voorhees",        state:"NJ", lat:39.86, lng:-74.98 },
  { name:"Winding River Skating Center",      city:"Toms River",      state:"NJ", lat:39.95, lng:-74.17 },

  // ========== CONNECTICUT ==========
  { name:"International Skating Center of CT",city:"Simsbury",        state:"CT", lat:41.88, lng:-72.81 },
  { name:"Champions Skating Center",          city:"Cromwell",        state:"CT", lat:41.60, lng:-72.66 },
  { name:"Yale's Ingalls Rink",               city:"New Haven",       state:"CT", lat:41.31, lng:-72.92 },
  { name:"Stamford Twin Rinks",               city:"Stamford",        state:"CT", lat:41.07, lng:-73.54 },
  { name:"Bolton Ice Palace",                 city:"Bolton",          state:"CT", lat:41.77, lng:-72.44 },

  // ========== MASSACHUSETTS ==========
  { name:"Skating Club of Boston",            city:"Norwood",         state:"MA", lat:42.18, lng:-71.19 },
  { name:"Simoni Skating Rink",               city:"Cambridge",       state:"MA", lat:42.38, lng:-71.12 },
  { name:"Harvard Murr Center (Bright-Landry)",city:"Allston",        state:"MA", lat:42.37, lng:-71.12 },
  { name:"Boch Ice Center",                   city:"Dedham",          state:"MA", lat:42.24, lng:-71.17 },
  { name:"Kasabuski Memorial Arena",          city:"Saugus",          state:"MA", lat:42.47, lng:-71.01 },
  { name:"North Shore Skating Academy",       city:"Danvers",         state:"MA", lat:42.57, lng:-70.94 },
  { name:"Worcester Ice Center",              city:"Worcester",       state:"MA", lat:42.26, lng:-71.81 },
  { name:"Navin Arena",                       city:"Marlborough",     state:"MA", lat:42.35, lng:-71.55 },

  // ========== FLORIDA ==========
  { name:"Ellenton Ice & Sports Complex",     city:"Ellenton",        state:"FL", lat:27.52, lng:-82.52 },
  { name:"AdventHealth Center Ice",           city:"Wesley Chapel",   state:"FL", lat:28.24, lng:-82.33 },
  { name:"RDV Sportsplex Ice Den",            city:"Maitland",        state:"FL", lat:28.64, lng:-81.37 },
  { name:"Orlando Ice Den (Wesley Chapel)",   city:"Wesley Chapel",   state:"FL", lat:28.25, lng:-82.35 },
  { name:"Florida Hospital Center Ice",       city:"Wesley Chapel",   state:"FL", lat:28.24, lng:-82.33 },
  { name:"Kendall Ice Arena",                 city:"Miami",           state:"FL", lat:25.64, lng:-80.40 },
  { name:"Panthers IceDen",                   city:"Coral Springs",   state:"FL", lat:26.27, lng:-80.25 },
  { name:"Iceland USA",                       city:"Miami",           state:"FL", lat:25.77, lng:-80.19 },
  { name:"Hertz Arena Practice Rink",         city:"Estero",          state:"FL", lat:26.42, lng:-81.83 },
  { name:"Clearwater Ice Arena",              city:"Clearwater",      state:"FL", lat:27.97, lng:-82.80 },
  { name:"Jacksonville Ice & Sportsplex",     city:"Jacksonville",    state:"FL", lat:30.17, lng:-81.59 },

  // ========== GEORGIA ==========
  { name:"Cooler Ice Center",                 city:"Alpharetta",      state:"GA", lat:34.07, lng:-84.27 },
  { name:"IceForum Duluth",                   city:"Duluth",          state:"GA", lat:34.00, lng:-84.15 },
  { name:"Atlanta IceForum",                  city:"Cumming",         state:"GA", lat:34.20, lng:-84.14 },
  { name:"Center Ice Arena",                  city:"Marietta",        state:"GA", lat:33.95, lng:-84.55 },
  { name:"Columbus Ice Rink",                 city:"Columbus",        state:"GA", lat:32.47, lng:-84.99 },

  // ========== NORTH CAROLINA ==========
  { name:"Extreme Ice Center",                city:"Indian Trail",    state:"NC", lat:35.08, lng:-80.67 },
  { name:"Pineville Ice House",               city:"Pineville",       state:"NC", lat:35.08, lng:-80.88 },
  { name:"Charlotte Ice Center at Bojangles", city:"Charlotte",       state:"NC", lat:35.21, lng:-80.80 },
  { name:"Raleigh Iceplex",                   city:"Raleigh",         state:"NC", lat:35.78, lng:-78.66 },
  { name:"Polar Ice House Cary",              city:"Cary",            state:"NC", lat:35.79, lng:-78.78 },
  { name:"Greensboro Ice House",              city:"Greensboro",      state:"NC", lat:36.07, lng:-79.79 },

  // ========== SOUTH CAROLINA ==========
  { name:"Pavilion Ice Rink (Columbia)",      city:"Columbia",        state:"SC", lat:34.00, lng:-81.03 },
  { name:"Carolina Ice Palace",               city:"North Charleston",state:"SC", lat:32.88, lng:-80.01 },
  { name:"Greenville Pavilion Ice",           city:"Taylors",         state:"SC", lat:34.92, lng:-82.32 },

  // ========== VIRGINIA ==========
  { name:"Prince William Ice Center",         city:"Dale City",       state:"VA", lat:38.64, lng:-77.35 },
  { name:"SkateQuest Reston",                 city:"Reston",          state:"VA", lat:38.94, lng:-77.34 },
  { name:"MedStar Capitals Iceplex",          city:"Arlington",       state:"VA", lat:38.89, lng:-77.11 },
  { name:"Kettler Capitals Iceplex",          city:"Arlington",       state:"VA", lat:38.89, lng:-77.11 },
  { name:"Ashburn Ice House",                 city:"Ashburn",         state:"VA", lat:39.04, lng:-77.48 },
  { name:"RVA Ice Plex",                      city:"Midlothian",      state:"VA", lat:37.50, lng:-77.65 },
  { name:"Hampton Roads Iceplex",             city:"Virginia Beach",  state:"VA", lat:36.82, lng:-76.02 },

  // ========== MARYLAND ==========
  { name:"Rockville Ice Arena",               city:"Rockville",       state:"MD", lat:39.08, lng:-77.14 },
  { name:"Cabin John Ice Rink",               city:"Bethesda",        state:"MD", lat:39.02, lng:-77.15 },
  { name:"Wheaton Ice Arena",                 city:"Wheaton",         state:"MD", lat:39.04, lng:-77.05 },
  { name:"Gardens Ice House",                 city:"Laurel",          state:"MD", lat:39.10, lng:-76.85 },
  { name:"Piney Orchard Ice Arena",           city:"Odenton",         state:"MD", lat:39.08, lng:-76.69 },
  { name:"Reisterstown Sportsplex",           city:"Reisterstown",    state:"MD", lat:39.47, lng:-76.82 },

  // ========== DC ==========
  { name:"Fort Dupont Ice Arena",             city:"Washington",      state:"DC", lat:38.87, lng:-76.95 },
  { name:"MedStar Capitals Iceplex (MCI)",    city:"Washington",      state:"DC", lat:38.90, lng:-77.02 },

  // ========== TENNESSEE ==========
  { name:"Ford Ice Center Bellevue",          city:"Nashville",       state:"TN", lat:36.08, lng:-86.92 },
  { name:"Ford Ice Center Antioch",           city:"Antioch",         state:"TN", lat:36.06, lng:-86.67 },
  { name:"Centennial Sportsplex",             city:"Nashville",       state:"TN", lat:36.15, lng:-86.81 },
  { name:"Mid-South Ice House",               city:"Memphis",         state:"TN", lat:35.15, lng:-89.79 },
  { name:"Icearium at Pigeon Forge",          city:"Pigeon Forge",    state:"TN", lat:35.80, lng:-83.55 },

  // ========== KENTUCKY ==========
  { name:"Iceland Sports Complex",            city:"Louisville",      state:"KY", lat:38.17, lng:-85.58 },
  { name:"Frost Ice Arena",                   city:"Lexington",       state:"KY", lat:38.04, lng:-84.50 },

  // ========== INDIANA ==========
  { name:"Indiana/World Skating Academy",     city:"Indianapolis",    state:"IN", lat:39.77, lng:-86.15 },
  { name:"Carmel Ice Skadium",                city:"Carmel",          state:"IN", lat:39.98, lng:-86.13 },
  { name:"Fuel Tank at Indiana Farmers",      city:"Indianapolis",    state:"IN", lat:39.76, lng:-86.16 },
  { name:"Fishers Ice at IceLab",             city:"Fishers",         state:"IN", lat:39.96, lng:-86.01 },
  { name:"Perry Park Ice Arena",              city:"Indianapolis",    state:"IN", lat:39.67, lng:-86.14 },

  // ========== MISSOURI ==========
  { name:"Creve Coeur Ice Arena",             city:"Creve Coeur",     state:"MO", lat:38.66, lng:-90.44 },
  { name:"Kirkwood Ice Arena",                city:"Kirkwood",        state:"MO", lat:38.58, lng:-90.41 },
  { name:"Affton Ice Rink",                   city:"Affton",          state:"MO", lat:38.55, lng:-90.33 },
  { name:"Hardee's Iceplex",                  city:"Chesterfield",    state:"MO", lat:38.65, lng:-90.57 },
  { name:"Line Creek Community Center",       city:"Kansas City",     state:"MO", lat:39.21, lng:-94.61 },
  { name:"Pepsi Ice Midwest",                 city:"Kansas City",     state:"MO", lat:39.24, lng:-94.57 },

  // ========== KANSAS ==========
  { name:"Wichita Ice Center",                city:"Wichita",         state:"KS", lat:37.69, lng:-97.34 },
  { name:"Pepsi Ice Arena (Silverstein)",     city:"Overland Park",   state:"KS", lat:38.96, lng:-94.67 },
  { name:"Scheels Overland Park Soccer Ice",  city:"Overland Park",   state:"KS", lat:38.89, lng:-94.69 },

  // ========== OKLAHOMA ==========
  { name:"Arctic Edge Ice Arena Edmond",      city:"Edmond",          state:"OK", lat:35.65, lng:-97.47 },
  { name:"Oklahoma City Blazers Ice Centre",  city:"Oklahoma City",   state:"OK", lat:35.47, lng:-97.51 },
  { name:"Tulsa Oilers Ice Center",           city:"Tulsa",           state:"OK", lat:36.11, lng:-95.89 },

  // ========== ARKANSAS ==========
  { name:"Arkansas Skatium",                  city:"Little Rock",     state:"AR", lat:34.75, lng:-92.34 },

  // ========== LOUISIANA ==========
  { name:"Airline Skate Center",              city:"Metairie",        state:"LA", lat:29.98, lng:-90.15 },
  { name:"Baton Rouge Airline Skate",         city:"Baton Rouge",     state:"LA", lat:30.45, lng:-91.14 },

  // ========== ALABAMA ==========
  { name:"Pelham Civic Complex & Ice Arena",  city:"Pelham",          state:"AL", lat:33.29, lng:-86.80 },
  { name:"Birmingham Iceplex",                city:"Birmingham",      state:"AL", lat:33.52, lng:-86.80 },
  { name:"Huntsville Iceplex",                city:"Huntsville",      state:"AL", lat:34.73, lng:-86.59 },

  // ========== MISSISSIPPI ==========
  { name:"Mississippi Coast Coliseum Ice",    city:"Biloxi",          state:"MS", lat:30.41, lng:-88.93 },

  // ========== NEBRASKA ==========
  { name:"Moylan Iceplex (UNO Baxter)",       city:"Omaha",           state:"NE", lat:41.26, lng:-96.01 },
  { name:"Tranquility Ice (Hockey Club Omaha)",city:"Omaha",          state:"NE", lat:41.33, lng:-96.14 },
  { name:"Lincoln Ice Box",                   city:"Lincoln",         state:"NE", lat:40.81, lng:-96.70 },

  // ========== IOWA ==========
  { name:"Metro Ice Sports Facility",         city:"Urbandale",       state:"IA", lat:41.62, lng:-93.71 },
  { name:"Young Arena",                       city:"Waterloo",        state:"IA", lat:42.49, lng:-92.34 },
  { name:"Cedar Rapids Ice Arena",            city:"Cedar Rapids",    state:"IA", lat:41.98, lng:-91.66 },
  { name:"Iowa Heartland Iceplex",            city:"Ankeny",          state:"IA", lat:41.73, lng:-93.60 },

  // ========== NORTH DAKOTA ==========
  { name:"Fargo Scheels Arena Ice",           city:"Fargo",           state:"ND", lat:46.87, lng:-96.86 },
  { name:"Ralph Engelstad Arena (Olympic)",   city:"Grand Forks",     state:"ND", lat:47.92, lng:-97.07 },
  { name:"VFW Sports Center",                 city:"Bismarck",        state:"ND", lat:46.80, lng:-100.78 },

  // ========== SOUTH DAKOTA ==========
  { name:"Rushmore Plaza Civic Center Ice",   city:"Rapid City",      state:"SD", lat:44.08, lng:-103.22 },
  { name:"Sioux Falls Scheels IcePlex",       city:"Sioux Falls",     state:"SD", lat:43.54, lng:-96.73 },

  // ========== MONTANA ==========
  { name:"Helena Ice Arena",                  city:"Helena",          state:"MT", lat:46.59, lng:-112.04 },
  { name:"Bozeman Haynes Pavilion",           city:"Bozeman",         state:"MT", lat:45.68, lng:-111.04 },
  { name:"Missoula Glacier Ice Rink",         city:"Missoula",        state:"MT", lat:46.87, lng:-114.01 },
  { name:"Billings Centennial Arena",         city:"Billings",        state:"MT", lat:45.79, lng:-108.55 },

  // ========== IDAHO ==========
  { name:"Idaho IceWorld",                    city:"Boise",           state:"ID", lat:43.55, lng:-116.27 },
  { name:"Sun Valley Ice",                    city:"Sun Valley",      state:"ID", lat:43.70, lng:-114.36 },

  // ========== WYOMING ==========
  { name:"Cheyenne Ice & Events Center",      city:"Cheyenne",        state:"WY", lat:41.15, lng:-104.80 },
  { name:"Jackson Hole Ice Rink",             city:"Jackson",         state:"WY", lat:43.47, lng:-110.76 },

  // ========== NEW MEXICO ==========
  { name:"Outpost Ice Arenas",                city:"Albuquerque",     state:"NM", lat:35.11, lng:-106.58 },
  { name:"Chavez County Ice Complex",         city:"Roswell",         state:"NM", lat:33.39, lng:-104.52 },
  { name:"Santa Fe Genoveva Chavez Rec Ctr",  city:"Santa Fe",        state:"NM", lat:35.63, lng:-105.98 },

  // ========== MAINE ==========
  { name:"Troubh Ice Arena",                  city:"Portland",        state:"ME", lat:43.66, lng:-70.25 },
  { name:"Colby College Alfond Rink",         city:"Waterville",      state:"ME", lat:44.56, lng:-69.66 },
  { name:"Bangor Civic Center Ice",           city:"Bangor",          state:"ME", lat:44.80, lng:-68.78 },

  // ========== NEW HAMPSHIRE ==========
  { name:"JFK Memorial Coliseum",             city:"Manchester",      state:"NH", lat:42.99, lng:-71.45 },
  { name:"Everett Arena",                     city:"Concord",         state:"NH", lat:43.22, lng:-71.54 },
  { name:"Tri-Town Ice Arena",                city:"Hooksett",        state:"NH", lat:43.06, lng:-71.44 },

  // ========== VERMONT ==========
  { name:"Cairns Arena",                      city:"South Burlington",state:"VT", lat:44.46, lng:-73.18 },
  { name:"Gutterson Fieldhouse",              city:"Burlington",      state:"VT", lat:44.47, lng:-73.20 },
  { name:"Central Vermont Memorial Arena",    city:"Montpelier",      state:"VT", lat:44.26, lng:-72.58 },

  // ========== RHODE ISLAND ==========
  { name:"Brown University Meehan Arena",     city:"Providence",      state:"RI", lat:41.83, lng:-71.40 },
  { name:"Smithfield Municipal Ice Rink",     city:"Smithfield",      state:"RI", lat:41.86, lng:-71.55 },

  // ========== DELAWARE ==========
  { name:"Pond Ice Arena",                    city:"Newark",          state:"DE", lat:39.70, lng:-75.75 },
  { name:"University of Delaware Ice Arena",  city:"Newark",          state:"DE", lat:39.68, lng:-75.75 },

  // ========== WEST VIRGINIA ==========
  { name:"Wheeling Park Ice Rink",            city:"Wheeling",        state:"WV", lat:40.07, lng:-80.72 },
  { name:"South Charleston Memorial Ice Ctr", city:"South Charleston",state:"WV", lat:38.37, lng:-81.69 },

  // ========== ALASKA ==========
  { name:"Sullivan Arena",                    city:"Anchorage",       state:"AK", lat:61.22, lng:-149.85 },
  { name:"Ben Boeke Ice Arena",               city:"Anchorage",       state:"AK", lat:61.22, lng:-149.86 },
  { name:"Dempsey Anderson Ice Arena",        city:"Anchorage",       state:"AK", lat:61.19, lng:-149.89 },
  { name:"Fairbanks Big Dipper Ice Arena",    city:"Fairbanks",       state:"AK", lat:64.84, lng:-147.74 },
  { name:"Juneau Treadwell Ice Arena",        city:"Juneau",          state:"AK", lat:58.38, lng:-134.54 },

  // ========== HAWAII ==========
  { name:"Ice Palace Hawaii",                 city:"Honolulu",        state:"HI", lat:21.38, lng:-157.93 },
];

/* Project every rink to map percentages using Albers USA */
(function projectAll() {
  const events = [
    "Spring Classic","Winter Invitational","Championship Series","Open Competition",
    "Regional Qualifier","Freestyle Festival","Skate Fest","Golden Edge Open",
    "Silver Blade Invitational","Crystal Cup","Ice Gala","Showcase Series",
    "Adult Skate Classic","Artistic Open","Compulsory Moves Test","Theatre on Ice"
  ];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  window.RINKS = window.RINK_DATABASE.map((r, i) => {
    const pt = window.projectToMap(r.lng, r.lat, r.state);
    const id = "r-" + i + "-" + r.state.toLowerCase();
    const h = hash(id + r.name);
    const evIdx = h % events.length;
    const mIdx = (h >> 8) % 10 + 1;
    const day1 = (h >> 12) % 25 + 1;
    const day2 = day1 + 2;
    const priceFrom = 18 + ((h >> 16) % 20);
    const priceTo = priceFrom + 30 + ((h >> 20) % 40);
    return {
      id,
      name: r.name,
      city: r.city + ", " + r.state,
      state: r.state,
      event: r.city + " " + events[evIdx],
      date: months[mIdx] + " " + day1 + "–" + day2,
      priceFrom, priceTo,
      x: pt.x,
      y: pt.y,
      link: window.getRinkLink(r)
    };
  });
})();
