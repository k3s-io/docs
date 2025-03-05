
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'K3s',
  tagline: '',
  url: 'https://docs.k3s.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'k3s-io', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  trailingSlash: false,
  markdown: {
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      "@easyops-cn/docusaurus-search-local",
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        docsRouteBasePath: "/",
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        indexBlog: true,
        ignoreFiles: [/release-notes\/.*/],
      }),
    ],
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh", "kr", "ja"],
    localeConfigs: {
      en: {
        label: "English",
      },
      zh: {
        label: "简体中文",
      },
      kr: {
        label: "한국어",
      },
      ja: {
        label: "日本語"
      }
    },
  },
  themeConfig: {
    colorMode: {
      // "light" | "dark"
      defaultMode: "light",
      // Use user preference instead of default mode
      respectPrefersColorScheme: true,

      // Hides the switch in the navbar
      // Useful if you want to support a single color mode
      disableSwitch: false,
    },
    navbar: {
      title: "",
      logo: {
        alt: 'logo',
        src: 'img/k3s-logo-light.svg',
        srcDark: 'img/k3s-logo-dark.svg',
      },
      items: [
        { 
          type: 'search',
          position: 'right',
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          to: 'blog', 
          label: 'Blog', 
          position: 'right',
          className: 'navbar__icon navbar__blog',
        },
        {
          to: 'https://github.com/k3s-io/k3s/',
          label: 'GitHub',
          position: 'right',
          className: 'navbar__icon navbar__github',
        },
      ],
    },
    // algolia: {
    //   appId: 'LLOD7N3LJA',
    //   apiKey: '4637c26b2ca6b8aeaf99a3ee421fb35c',
    //   indexName: 'k3s',
    // },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} K3s Project Authors. All rights reserved. <br>The Linux Foundation has registered trademarks
      and uses trademarks. For a list of trademarks of The Linux Foundation, 
      please see our <a href="https://www.linuxfoundation.org/trademark-usage"> Trademark Usage</a> page.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          /* other docs plugin options */
          routeBasePath: '/', // Serve the docs at the site's root
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true,
          editUrl: 'https://github.com/k3s-io/docs/edit/main/',
        },
        blog: {
          blogTitle: 'k3s blog',
          showReadingTime: false,
          blogSidebarTitle: 'All our posts',
          blogSidebarCount: 'ALL',
        },
        // ...
        theme: {
          customCss: [require.resolve("./src/css/custom.css")],
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          { from: '/installation/ha', to: '/datastore/ha' },
          { from: '/installation/ha-embedded', to: '/datastore/ha-embedded' },
          { from: '/installation/datastore', to: '/datastore' },
          { from: '/installation/disable-flags', to: '/installation/server-roles' },
          { from: '/backup-restore/backup-restore', to: '/datastore/backup-restore' },
          { from: '/reference/agent-config', to: '/cli/agent' },
          { from: '/reference/server-config', to: '/cli/server' },
	        { from: '/installation/network-options', to: '/networking/basic-network-options' },
	        { from: '/security/self-assessment', to: '/security/self-assessment-1.23' },
        ],
      },
    ],
  ], 
};
