/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mrdeveloper.in',
  generateRobotsTxt: true, // (optional)
  robotsTxtOptions: {
    policies: [
          { userAgent: '*', allow: '/' }, 
    ],
  },
};
