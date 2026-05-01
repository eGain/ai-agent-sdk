import { defineConfig } from 'vitepress'
import pkg from '../../package.json'

const base = process.env.VITEPRESS_BASE ?? '/'

export default defineConfig({
  title: 'AiAgentSdk',
  description: 'TypeScript SDK for eGain\'s AI Agent platform',
  base,
  outDir: '../../docs',
  // Examples nav targets are reserved; pages live under repo usage-examples/ until migrated
  ignoreDeadLinks: [/^\/examples(?:\/|$)/],
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#B91D8F' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api-generated/README' },
      { text: 'Examples', link: '/examples/' },
      {
        text: `v${pkg.version}`,
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Contributing', link: '/contributing' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Connection Lifecycle', link: '/guide/connection-lifecycle' },
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Message Flow', link: '/guide/message-flow' },
            { text: 'Events', link: '/guide/events' },
            { text: 'Portal Initialization', link: '/guide/portal-initialization' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Context Management', link: '/guide/context-management' },
            { text: 'Transcript', link: '/guide/transcript' },
            { text: 'Message Queue', link: '/guide/message-queue' },
            { text: 'Caching', link: '/guide/caching' },
            { text: 'Error Handling', link: '/guide/error-handling' },
            { text: 'Logging', link: '/guide/logging' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Platform Connectors', link: '/guide/platform-connectors' },
            { text: 'Custom Message Handlers', link: '/api-generated/classes/BaseMessageHandler' },
            { text: 'API Helper', link: '/api-generated/classes/ApiHelper' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Basic Usage', link: '/examples/basic-usage' },
            { text: 'Browser (ESM)', link: '/examples/browser-esm' },
            { text: 'Browser (UMD)', link: '/examples/browser-umd' },
            { text: 'Node.js', link: '/examples/node' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/egain/ai-agent-sdk' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 eGain'
    },

    editLink: {
      pattern: 'https://github.com/egain/ai-agent-sdk/edit/main/ai-agent-sdk/docs-src/:path',
      text: 'Edit this page on GitHub'
    }
  },

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
