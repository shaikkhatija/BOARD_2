import axios from 'axios';

const defaultMetrics = [
  {
    id: 'rev',
    title: 'Total Revenues',
    value: '$2,129,430',
    rawNumber: 2129430,
    changePercent: '+2.5%',
    isPositive: true,
    bgColor: '#DDEFE0', // Soft pastel green from Figma
    iconName: 'revenue',
  },
  {
    id: 'trx',
    title: 'Total Transactions',
    value: '1,520',
    rawNumber: 1520,
    changePercent: '+1.7%',
    isPositive: true,
    bgColor: '#F4ECDD', // Soft pastel sand/cream from Figma
    iconName: 'transaction',
  },
  {
    id: 'lik',
    title: 'Total Likes',
    value: '9,721',
    rawNumber: 9721,
    changePercent: '+4.3%',
    isPositive: true,
    bgColor: '#EFDADA', // Soft pastel rose from Figma
    iconName: 'likes',
  },
  {
    id: 'usr',
    title: 'Total Users',
    value: '892',
    rawNumber: 892,
    changePercent: '+8.9%',
    isPositive: true,
    bgColor: '#DEE0EF', // Soft pastel lavender from Figma
    iconName: 'users',
  },
];

const defaultActivities = {
  'May - June 2021': [
    { week: 'Week 1', guest: 500, user: 400 },
    { week: 'Week 2', guest: 350, user: 450 },
    { week: 'Week 3', guest: 200, user: 300 },
    { week: 'Week 4', guest: 400, user: 350 },
  ],
  'July - August 2021': [
    { week: 'Week 1', guest: 420, user: 380 },
    { week: 'Week 2', guest: 280, user: 490 },
    { week: 'Week 3', guest: 310, user: 420 },
    { week: 'Week 4', guest: 480, user: 410 },
  ],
  'Sept - Oct 2021': [
    { week: 'Week 1', guest: 460, user: 430 },
    { week: 'Week 2', guest: 390, user: 510 },
    { week: 'Week 3', guest: 250, user: 340 },
    { week: 'Week 4', guest: 430, user: 490 },
  ],
};

const defaultTopProducts = {
  'May - June 2021': [
    { name: 'Basic Tees', percentage: 55, color: '#98D89E', salesValue: '$1,171,186' },
    { name: 'Custom Short Pants', percentage: 31, color: '#F6DC7D', salesValue: '$660,123' },
    { name: 'Super Hoodies', percentage: 14, color: '#EE8484', salesValue: '$298,121' },
  ],
  'July - August 2021': [
    { name: 'Basic Tees', percentage: 48, color: '#98D89E', salesValue: '$1,022,126' },
    { name: 'Custom Short Pants', percentage: 37, color: '#F6DC7D', salesValue: '$787,889' },
    { name: 'Super Hoodies', percentage: 15, color: '#EE8484', salesValue: '$319,415' },
  ],
  'Sept - Oct 2021': [
    { name: 'Basic Tees', percentage: 40, color: '#98D89E', salesValue: '$851,772' },
    { name: 'Custom Short Pants', percentage: 28, color: '#F6DC7D', salesValue: '$596,240' },
    { name: 'Super Hoodies', percentage: 32, color: '#EE8484', salesValue: '$681,418' },
  ],
};

const defaultSchedules = [
  {
    id: 'sch-1',
    title: 'Meeting with suppliers from Kuta Bali',
    time: '14.00-15.00',
    location: 'at Sunset Road, Kuta, Bali',
    color: '#9BDD7C', // Green accent
    completed: false,
  },
  {
    id: 'sch-2',
    title: 'Check operation at Giga Factory 1',
    time: '18.00-20.00',
    location: 'at Central Jakarta',
    color: '#6972C3', // Blue/purple accent
    completed: false,
  },
];

/**
 * Fetch dashboard data using Axios with fallback & public API enrichment
 */
export async function fetchDashboardData() {
  try {
    const publicUserRes = await axios.get('https://jsonplaceholder.typicode.com/users', {
      timeout: 3500,
    }).catch(() => null);

    let activeUserCount = 892;
    if (publicUserRes && Array.isArray(publicUserRes.data)) {
      activeUserCount = 890 + publicUserRes.data.length;
    }

    const updatedMetrics = defaultMetrics.map((m) => {
      if (m.id === 'usr') {
        return {
          ...m,
          value: activeUserCount.toLocaleString(),
          rawNumber: activeUserCount,
        };
      }
      return m;
    });

    return {
      metrics: updatedMetrics,
      activities: defaultActivities,
      topProducts: defaultTopProducts,
      schedules: defaultSchedules,
      lastUpdated: new Date().toLocaleTimeString(),
    };
  } catch {
    return {
      metrics: defaultMetrics,
      activities: defaultActivities,
      topProducts: defaultTopProducts,
      schedules: defaultSchedules,
      lastUpdated: new Date().toLocaleTimeString(),
    };
  }
}
