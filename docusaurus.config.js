
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'K3s',
  tagline: '',
  url: 'https://rancher.com/docs/k3s/latest/en',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'k3s-io', // Usually your GitHub org/user name.
  projectName: 'k3s-docs', // Usually your repo name.
  trailingSlash: false,
  themeConfig: {
    colorMode: {
      // "light" | "dark"
      defaultMode: "light",

      // Hides the switch in the navbar
      // Useful if you want to support a single color mode
      disableSwitch: false,
    },
    navbar: {
      title: "",
      logo: {
        alt: 'logo',
        src: 'img/k3s-horizontal-color.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'introduction',
          position: 'right',
          label: 'Docs',
          className: 'navbar__docs',
        },
        {
          href: 'https://github.com/k3s-io/k3s/',
          label: 'GitHub',
          position: 'right',
          className: 'navbar__github btn btn-secondary icon-github',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} SUSE Rancher. All Rights Reserved.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/', // Serve the docs at the site's root
          /* other docs plugin options */
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true,
          editUrl: 'https://github.com/k3s-io/k3s/docs/edit/main/',
        },
        blog: false, // Optional: disable the blog plugin
        // ...
        theme: {
          customCss: [require.resolve("./src/css/custom.css")],
        },
      },
    ],
  ], 
};
