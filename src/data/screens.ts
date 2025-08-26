export type Data = {
  id: number;
  image: any;
  title: string;
  text: string;
};

export const data: Data[] = [
  {
    id: 1,
    image: require('../assets/image1.png'),
    title: 'Live Precious Metal Prices',
    text: 'Track real-time prices of gold, silver, platinum, and palladium with live market data and instant updates.',
  },
  {
    id: 2,
    image: require('../assets/image2.png'),
    title: 'Market Insights & Trends',
    text: 'Get comprehensive market analysis, price charts, and trend indicators for all major precious metals.',
  },
  {
    id: 3,
    image: require('../assets/image3.png'),
    title: 'Portfolio Management',
    text: 'Monitor your precious metal investments with detailed tracking, alerts, and performance analytics.',
  },
];
