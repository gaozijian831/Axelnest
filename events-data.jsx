// Shared events dataset — US figure skating competitions 2026
// Each event has a slug → event.html?e=<slug> renders the detail page.

const US_EVENTS = [
  {
    slug: 'skate-america',
    code: '24 OCT',
    dateShort: '10.24',
    dateFull: 'October 24–26, 2026',
    city: 'Allen, TX',
    venue: 'Credit Union of Texas Event Center',
    event: 'Skate America',
    series: 'ISU Grand Prix — Opening Event',
    note: 'Short Program · Free Skate',
    disciplines: ['Men', 'Women', 'Pairs', 'Ice Dance'],
    tv: 'NBC / Peacock',
    description:
      'The United States opens the ISU Grand Prix circuit with Skate America — the longest-running event in the series. Reigning champions return to defend titles across all four disciplines.',
  },
  {
    slug: 'us-international-classic',
    code: '18 SEP',
    dateShort: '09.18',
    dateFull: 'September 18–20, 2026',
    city: 'Lake Placid, NY',
    venue: 'Olympic Center',
    event: 'U.S. International Classic',
    series: 'ISU Challenger Series',
    note: 'Senior & Junior Divisions',
    disciplines: ['Men', 'Women', 'Pairs', 'Ice Dance'],
    tv: 'USFS Fan Zone',
    description:
      'An early-season proving ground at the historic home of the 1980 Winter Games. Skaters debut new programs and test technical layouts before the Grand Prix opens.',
  },
  {
    slug: 'us-championships',
    code: '22 JAN',
    dateShort: '01.22',
    dateFull: 'January 22–31, 2027',
    city: 'St. Louis, MO',
    venue: 'Enterprise Center',
    event: 'U.S. Figure Skating Championships',
    series: 'National Championship',
    note: 'All Levels · Novice through Senior',
    disciplines: ['Men', 'Women', 'Pairs', 'Ice Dance'],
    tv: 'NBC / Peacock / USA Network',
    description:
      'The crown jewel of the domestic calendar. National champions are crowned and the Team USA roster for the World Championships is named on the final night.',
  },
  {
    slug: 'four-continents',
    code: '09 FEB',
    dateShort: '02.09',
    dateFull: 'February 9–14, 2027',
    city: 'Colorado Springs, CO',
    venue: 'Broadmoor World Arena',
    event: 'Four Continents Championships',
    series: 'ISU Championship',
    note: 'International · Non-European Federations',
    disciplines: ['Men', 'Women', 'Pairs', 'Ice Dance'],
    tv: 'Peacock',
    description:
      'A Championship-tier event contested by skaters from the Americas, Asia, Africa, and Oceania. Colorado Springs — home of the U.S. Olympic Training Center — hosts at altitude.',
  },
];

Object.assign(window, { US_EVENTS });
