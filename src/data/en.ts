// English copy: a faithful translation of sk.ts, key for key. No claims beyond the Slovak original.
import type { Content } from './sk'
import type { LegalPage, Service } from './site'

const services: Service[] = [
  {
    id: 'projektove-riadenie',
    slug: 'project-management',
    navLabel: 'Project management',
    cardTitle: 'Project / programme management',
    cardText:
      'We prepare documentation for funding calls, project proposals and public procurement. We set up project management, take on expert oversight and keep the documentation in order throughout delivery.',
    icon: 'project',
    illustration: 'lock',
    heroTitle: 'We prepare your project so that it is defensible, manageable and deliverable',
    heroText:
      'We help organisations prepare projects from the initial idea through to managing them during delivery. We provide expert groundwork, management and documentation.',
    blocks: [
      {
        kind: 'text',
        title: 'A project starts with good preparation',
        body: 'A project does not start with procurement or with signing a contract. It starts with good preparation. We help clients properly define the objective, scope, benefits, governance model and the groundwork the project will be built on.',
        listTitle: 'What we provide',
        list: [
          'Preparation of documentation for funding calls',
          'expert documentation for public procurement',
          'project management under Act No. 401/2023',
          'project documentation during delivery',
        ],
      },
      {
        kind: 'text',
        title: 'How we help clients',
        body: 'We step in where an organisation needs to prepare a project before procurement, add methodological guidance, gain external expert capacity or stabilise management during delivery. We also provide an outsourced project manager or PMO support.',
      },
    ],
    ctaTitle: 'Do you need to prepare a project or stabilise how it is managed?',
  },
  {
    id: 'kyberneticka-bezpecnost',
    slug: 'cybersecurity',
    navLabel: 'Cybersecurity',
    cardTitle: 'Cybersecurity',
    cardText:
      'We help organisations prepare for an audit, review the state of their processes, complete their documentation, manage corrective actions and secure cybersecurity manager (MKB) expertise through outsourcing or ongoing support.',
    icon: 'security',
    illustration: 'shield',
    heroTitle: 'We prepare your organisation for an audit and strengthen cybersecurity management',
    heroText:
      'We support organisations in preparing for an audit, setting up processes, completing documentation and securing expert capacity in cybersecurity.',
    blocks: [
      {
        kind: 'text',
        title: 'Security as a management discipline',
        body: 'Cybersecurity reaches into processes, documentation, assets, risks, business continuity and responsibilities within the organisation. Security needs to be handled systematically, demonstrably and sustainably over the long term.',
        listTitle: 'What we provide',
        list: [
          'Cybersecurity audit preparation',
          'process validation',
          'documentation',
          'guidance during the audit',
          'outsourced cybersecurity manager (MKB)',
          'risk analyses and BCM',
        ],
      },
      {
        kind: 'text',
        title: 'How we help clients',
        body: 'First, we assess the current state of the organisation, identify gaps and prepare a plan of steps. We then help with documentation, processes, evidence, coordination and communication so that the organisation holds up not only in the audit but also in real-world operation.',
      },
    ],
    ctaTitle: 'Do you need to prepare your organisation for an audit or secure cybersecurity manager (MKB) capacity?',
  },
  {
    id: 'gdpr-a-dpo',
    slug: 'gdpr-and-dpo',
    navLabel: 'GDPR and DPO',
    cardTitle: 'GDPR and outsourced DPO',
    cardText:
      'We help set up personal data protection, GDPR documentation, processes and responsibilities. We also provide an external data protection officer or senior support for an internal DPO.',
    icon: 'gdpr',
    illustration: 'document',
    heroTitle: 'GDPR and outsourced DPO for the public and commercial sectors',
    heroText:
      'We help organisations set up personal data protection so that it is professionally sound, practical and sustainable over the long term. We provide GDPR services as well as an outsourced data protection officer.',
    blocks: [
      {
        kind: 'text',
        title: 'Personal data protection as a managed agenda',
        body: 'GDPR today is not just about formal documentation. It reaches into the organisation’s processes, internal rules, responsibilities, the operation of its information systems and everyday work with data.',
        listTitle: 'What we provide',
        list: [
          'Outsourced DPO',
          'support for an internal DPO',
          'gap assessment',
          'GDPR documentation and records',
          'process setup',
          'support with data subject rights, incidents and DPIAs',
        ],
      },
      {
        kind: 'text',
        title: 'How we help clients',
        body: 'First, we identify the state of compliance and the priorities. We then help set up documentation, processes, roles and ongoing oversight so that personal data protection works in practice and does not remain a mere formal obligation.',
      },
    ],
    ctaTitle: 'Do you need to handle your GDPR agenda or provide an external data protection officer?',
  },
  {
    id: 'analyza-a-data',
    slug: 'analysis-and-data',
    navLabel: 'Analytics and data',
    cardTitle: 'Analytical services',
    cardText:
      'We analyse processes, the organisation’s needs and the functionality of information systems. The client gains a basis for an informed decision, a change or the procurement of a solution.',
    icon: 'analytics',
    illustration: 'chart',
    heroTitle: 'Analysis that helps you decide. Data that helps you manage.',
    heroText:
      'We help organisations understand their processes, needs and information systems so that analysis becomes the foundation for real change.',
    blocks: [
      {
        kind: 'text',
        title: 'Analytical services',
        body: 'We analyse the organisation’s processes and identify the weak points, inefficiencies and barriers that stand in the way of it working better. We also assess the functionality of information systems and evaluate whether they truly support the organisation’s needs.',
      },
      {
        kind: 'link',
        title: 'Data governance - data management',
        body: 'We help set up a basic framework for working with data, responsibilities, data roles and principles that support data quality and its use in decision-making, reporting and further development.',
        service: 'data-governance',
      },
    ],
    ctaTitle: 'Do you need a process analysis, analytical groundwork or the introduction of data management?',
  },
  {
    id: 'data-governance',
    slug: 'data-governance',
    navLabel: 'Data governance',
    cardTitle: 'Data governance and data management',
    cardText:
      'We help introduce data management, rules for working with data, responsibilities and data principles that support running the organisation and the further development of its IT.',
    icon: 'data',
    illustration: 'database',
    heroTitle: 'We set up data governance so that it supports reliable data and its real value',
    heroText:
      'We help organisations understand their processes, needs and information systems so that analysis becomes the foundation for real change.',
    blocks: [
      {
        kind: 'text',
        title: 'Data needs clear rules and ownership',
        body: 'Data does not deliver value on its own. Value arises only when data is properly managed, available, of good quality and understood. We help clients set principles for working with data, define roles and responsibilities and create an environment in which data is a trustworthy foundation for decision-making.',
        listTitle: 'What we provide',
        list: [
          'Introduction of data management',
          'design of a governance model',
          'definition of roles (e.g. data owner, data steward)',
          'principles for working with data',
          'support for data quality',
          'design of a framework for reporting and decision-making',
        ],
      },
    ],
    ctaTitle:
      'Do you need to introduce data governance or improve data quality? We will help you set up data governance that brings order to your data and supports decision-making.',
  },
  {
    id: 'realizacia-it',
    slug: 'it-delivery',
    navLabel: 'IT delivery',
    cardTitle: 'Delivery of IT projects',
    cardText:
      'We deliver solutions in asset management, data warehousing, websites and corporate identity. We connect expert design with practical delivery.',
    icon: 'delivery',
    illustration: 'screen',
    heroTitle: 'From design to delivery',
    heroText:
      'We help clients not only with preparation and management but also with the practical implementation of selected IT solutions.',
    blocks: [
      {
        kind: 'text',
        title: 'Solutions with operational and managerial benefits',
        body: 'DANAU connects expert design, management and implementation so that the result does not stay at the level of a concept but becomes a working part of the organisation.',
        listTitle: 'What we deliver',
        list: ['Asset management', 'data warehouse', 'websites', 'corporate identity'],
      },
    ],
    ctaTitle: 'Do you need a solution delivered, not just a proposal prepared?',
  },
]

const home: Content['home'] = {
  hero: {
    // a non-breaking space keeps 'IT project' together on one line
    title: 'IT project management, cybersecurity, GDPR and expert support',
    text: 'We help organisations prepare, manage and deliver change in IT, security, personal data protection, data and processes. We bring project management, cybersecurity, GDPR, analytics and the delivery of solutions together into one working whole.',
    primary: 'Contact',
    secondary: 'Our services',
  },
  partner: {
    title: 'A partner for the public and commercial sectors',
    lead: 'DANAU, s.r.o. is an expert partner for public authorities, state and public institutions, regulated organisations and commercial companies that need to handle a project, an audit or the modernisation of their environment, or to strengthen their internal capacity.',
    approach:
      'Our services are built on connecting expert content, methodology, management and practical delivery. We do not just help prepare a document.',
    outcome:
      'We help the client prepare a decision, set up a project, complete documentation, stabilise management and deliver a result that holds up in substance, in process and in operation.',
    labels: { lead: 'For whom', approach: 'Approach', outcome: 'Outcome' },
  },
  services: {
    title: 'Comprehensive solutions for your IT and security challenges',
    more: 'Learn more',
  },
  process: {
    title: 'How do we work?',
    challenge:
      'Organisations today often deal with projects and changes that go beyond a single field of expertise. A good intention or a technical solution alone is not enough.',
    need: 'Management, analysis, documentation, security, GDPR, quality and the ability to deliver a result all need to be connected.',
    solution:
      'DANAU steps in exactly where an organisation needs external know-how, expert capacity or a partner to take on a specific role. We help prepare a project, stabilise its management, get through an audit, complete documentation, set up security processes and the GDPR agenda, or deliver a selected IT solution.',
    labels: { challenge: 'Challenge', need: 'Need', solution: 'Solution' },
  },
  expertise: {
    title: 'Expertise and experience',
    lead: 'We build on a combination of practical experience and professional certifications in project management, cybersecurity, personal data protection, information security, enterprise architecture and IT service management.',
    listIntro: 'DANAU’s professional background includes competencies and certifications such as:',
    domains: [
      { area: 'Project management', certs: ['IPMA', 'PRINCE2'] },
      { area: 'Cybersecurity', certs: ['MKB'] },
      { area: 'Personal data protection', certs: ['DPO'] },
      { area: 'Information security', certs: ['Lead Auditor ISO/IEC 27001'] },
      { area: 'Enterprise architecture', certs: ['TOGAF'] },
      { area: 'IT service management', certs: ['ITIL'] },
    ],
  },
  clients: {
    title: 'Who do we work for?',
    items: [
      {
        title: 'Public authorities',
        text: 'Support with project preparation, public procurement, project documentation, cybersecurity, GDPR and change management.',
      },
      {
        title: 'State and public institutions',
        text: 'Methodological, analytical and delivery support in managing IT projects, security, personal data protection and the modernisation of the environment.',
      },
      {
        title: 'Local governments and their organisations',
        text: 'Practical help with introducing processes, systems, security measures, GDPR and data management.',
      },
      {
        title: 'Regulated organisations',
        text: 'Support with audit readiness, risk management and setting up the security and compliance environment.',
      },
      {
        title: 'Commercial organisations',
        text: 'Project management, security services, GDPR, analytics, data governance and the delivery of IT solutions with an emphasis on a working result.',
      },
    ],
  },
}

const about: Content['about'] = {
  title: 'About us',
  text: 'We are an expert partner for organisations that need to properly prepare, manage and deliver projects, set up security and management processes or strengthen their internal expert capacity.',
  whatTitle: 'What do we do?',
  whatParts: [
    'We work at the intersection of ',
    { area: 'projektove-riadenie', text: 'project management' },
    ', ',
    { area: 'analyza-a-data', text: 'analytics' },
    ', ',
    { area: 'kyberneticka-bezpecnost', text: 'cybersecurity' },
    ', ',
    { area: 'gdpr-a-dpo', text: 'personal data protection' },
    ', ',
    { area: 'data-governance', text: 'data management' },
    ' and ',
    { area: 'realizacia-it', text: 'the delivery of IT solutions' },
    '.',
  ],
  whatEdge: 'Our advantage is the ability to connect these areas into one clear and manageable approach.',
  skillsTitle: 'Key expertise',
  skills: [
    { name: 'IPMA', area: 'Project management' },
    { name: 'PRINCE2', area: 'Project management' },
    { name: 'Lead Auditor ISO/IEC 27001', area: 'Information security' },
    { name: 'ITIL', area: 'IT service management' },
    { name: 'TOGAF', area: 'Enterprise architecture' },
    { name: 'MKB', area: 'Cybersecurity' },
    { name: 'Cybersecurity audit', area: 'Cybersecurity' },
    { name: 'Certified DPOs', area: 'Personal data protection' },
  ],
}

const contactPage: Content['contactPage'] = {
  title: 'Contact',
  text: 'Looking for a partner for project preparation, public procurement support, project management, a cybersecurity audit, your GDPR agenda, analytical services, data management or the delivery of an IT solution? Write to us. We will get back to you and arrange an initial consultation.',
  formTitle: 'Write to us',
  success: 'Your message has been sent. We will get back to you as soon as possible.',
  failure: 'The message could not be sent. Please try again later.',
  consent: 'I agree to the processing of my personal data for the purpose of being contacted.',
  submit: 'Send message',
  sending: 'Sending…',
  hint: 'Fields marked * are required.',
  fields: {
    fullName: { label: 'Full name', placeholder: 'Enter your name' },
    organization: { label: 'Organisation', placeholder: 'Your organisation’s name' },
    email: { label: 'Email', placeholder: 'you@company.com' },
    phone: { label: 'Phone', placeholder: '+421' },
    message: { label: 'Message', placeholder: 'How can we help you?' },
  },
  errors: {
    fullName: 'Please enter your full name.',
    email: 'Please enter your email so that we can reply.',
    emailFormat: 'The email address is not valid, e.g. name@company.com.',
    message: 'Please tell us how we can help.',
    consent: 'We cannot contact you without your consent.',
  },
  newWindow: ' (opens in a new window)',
  writeUs: 'Alternatively, write to us at',
  preview: 'This is a design preview of the website; the form is not sent from it.',
}

const footer: Content['footer'] = {
  claim: 'An expert partner for public authorities, state institutions and commercial companies.',
  servicesTitle: 'Services',
  linksTitle: 'Quick links',
  contactTitle: 'Contact',
  copyright: `© ${new Date().getFullYear()} DANAU, s.r.o. All rights reserved.`,
}

const privacy: LegalPage = {
  title: 'Personal data protection',
  intro:
    'On this page you will find what personal data DANAU, s.r.o. processes in business communication, project cooperation and the operation of its website, for what purpose, for how long, and what rights you have.',
  updated: 'Last updated: 16 October 2026. This is a translation; if the versions differ, the Slovak version prevails.',
  sections: [
    {
      title: 'Controller and contact',
      paragraphs: [
        'The controller is DANAU, s.r.o., registered office Doležalova 15/C, 821 04 Bratislava, Slovakia, Company ID (IČO) 54 908 159, registered in the Commercial Register of the Bratislava III Municipal Court, Section Sro, File No. 164139/B.',
        'For questions about personal data protection and to exercise your rights, you can contact us at info@danau.sk or by phone at +421 948 222 666.',
      ],
    },
    {
      title: 'What data we process and why',
      paragraphs: [
        'We mainly process identification and contact details that you provide to us in an enquiry, during project preparation, in contractual communication or in ongoing cooperation. We always tie the scope of the data to a specific purpose:',
      ],
      list: [
        'Contact form, email and phone – we process your full name, organisation, email address, phone number and the content of your message to reply to you and arrange an initial consultation. The legal basis is your consent (Art. 6(1)(a) GDPR) and, where the enquiry leads towards a contract, steps taken before entering into it (Art. 6(1)(b) GDPR).',
        'Offers and contractual cooperation – we process the identification and contact details of contact persons to prepare an offer, perform a contract and communicate about it (Art. 6(1)(b) GDPR) and to meet our legal obligations, for example in accounting (Art. 6(1)(c) GDPR).',
        'Website analytics – only with your consent, we use Google Analytics 4 (Art. 6(1)(a) GDPR). See the Cookie policy for details.',
        'Website operation and security – when you visit the website, the server may record technical data such as your IP address, the time of access and the address visited, to keep the website available and protected against misuse (legitimate interest, Art. 6(1)(f) GDPR).',
      ],
    },
    {
      title: 'Who receives the data',
      paragraphs: [
        'We make personal data available only to the extent necessary: to providers who host our website and email for us as processors and, for website analytics, to Google Ireland Limited. We also disclose data to public authorities where the law requires us to.',
      ],
    },
    {
      title: 'Transfers outside the European Union',
      paragraphs: [
        'Google may also process Google Analytics data in the USA. Google LLC is certified under the EU–US Data Privacy Framework, which is covered by the European Commission’s adequacy decision.',
      ],
    },
    {
      title: 'How long we keep the data',
      paragraphs: [
        'We keep data from enquiries while we deal with them and the communication that follows. If no cooperation results, we delete the data once it is no longer needed for the purpose for which it was collected, or when you withdraw your consent.',
        'We keep data from contractual cooperation for the duration of the contract and afterwards for as long as the law requires, for example accounting records for 10 years under Act No. 431/2002 Coll. on Accounting.',
        'Data in Google Analytics is kept for at most 14 months, and analytics cookies expire after at most 2 years.',
      ],
    },
    {
      title: 'Your rights',
      paragraphs: ['In connection with the processing of your personal data, you have the right:'],
      list: [
        'to request access to your personal data (Art. 15 GDPR),',
        'to request its rectification (Art. 16 GDPR) or erasure (Art. 17 GDPR),',
        'to request restriction of processing (Art. 18 GDPR),',
        'to data portability (Art. 20 GDPR),',
        'to object to processing based on legitimate interest (Art. 21 GDPR),',
        'to withdraw your consent at any time, without affecting the lawfulness of processing before its withdrawal (Art. 7(3) GDPR).',
      ],
      after: [
        'If you believe that we are handling your data incorrectly, you can contact us directly, and you also have the right to lodge a complaint with the Office for Personal Data Protection of the Slovak Republic, Hraničná 12, 820 07 Bratislava 27, www.dataprotection.gov.sk.',
      ],
    },
    {
      title: 'Whether you must provide data',
      paragraphs: [
        'Providing data in the contact form is voluntary. Without your name and email address, however, we cannot reply to you. We do not carry out automated individual decision-making or profiling.',
      ],
    },
  ],
}

const cookies: LegalPage = {
  title: 'Cookies',
  intro:
    'On this page you will find which cookies and similar technologies the danau.sk website uses, what for, and how you can change your consent at any time.',
  updated: 'Last updated: 16 October 2026. This is a translation; if the versions differ, the Slovak version prevails.',
  sections: [
    {
      title: 'What cookies are',
      paragraphs: [
        'Cookies are small files stored in the browser that the website remembers between visits. The browser’s local storage (localStorage) works in a similar way.',
      ],
    },
    {
      title: 'Which cookies we use',
      paragraphs: ['The danau.sk website uses only these items:'],
      cookies: {
        labels: { provider: 'Provider', expiry: 'Expiry' },
        groups: [
          {
            title: 'Essential',
            note: 'Always active',
            consent: false,
            items: [
              {
                name: 'danau-consent-v1',
                provider: 'danau.sk',
                purpose: 'Stores your choice in the cookie bar (local storage).',
                expiry: 'Until you change your choice or clear your browser data',
              },
            ],
          },
          {
            title: 'Analytics',
            note: 'Only with your consent',
            consent: true,
            items: [
              {
                name: '_ga',
                provider: 'Google',
                purpose: 'Distinguishes visitors for aggregate traffic statistics.',
                expiry: '2 years',
              },
              {
                name: '_ga_0RPSMNFFCV',
                provider: 'Google',
                purpose: 'Keeps the state of the visit for traffic statistics.',
                expiry: '2 years',
              },
            ],
          },
        ],
      },
      after: [
        'The essential item needs no consent, because without it the website could not respect your choice. We do not use advertising or social media cookies. Fonts and other website files are loaded from our own server.',
      ],
    },
    {
      title: 'Analytics cookies (Google Analytics)',
      paragraphs: [
        'We measure traffic with Google Analytics 4 by Google Ireland Limited, and only with your consent. Without consent, Google Analytics is not loaded and no analytics cookies are stored.',
        'Once you consent, the cookies _ga and _ga_* are stored for up to 2 years. We evaluate the data in aggregate; advertising features, Google signals and ad personalisation are switched off. Google Analytics 4 does not store IP addresses. More about data processing is on the Personal data protection page.',
      ],
    },
    {
      title: 'How you can change your consent',
      paragraphs: [
        'You can change or withdraw your consent at any time with the button below or the “Cookie settings” link in the website footer. When you withdraw it, we delete the analytics cookies.',
        'You can also restrict or delete cookies in your browser. After you change the settings, some of the website’s behaviour may change or be limited depending on the features available.',
      ],
      consentButton: true,
    },
  ],
}

const ui: Content['ui'] = {
  country: 'Slovakia',
  company: {
    ico: 'Company ID (IČO)',
    dic: 'Tax ID (DIČ)',
    icDph: 'VAT ID',
    register: 'Registered in the Commercial Register of the Bratislava III Municipal Court, Section Sro, File No. 164139/B',
  },
  cookieBar: {
    label: 'Cookie consent',
    text: 'With your consent, we use analytics cookies (Google Analytics) to understand how the website is used. Without it, they are not loaded.',
    more: 'More about cookies',
    accept: 'Accept',
    reject: 'Reject',
    settings: 'Cookie settings',
  },
  skip: 'Skip to content',
  brandLabel: 'Danau – home',
  mainNav: 'Main navigation',
  mobileNav: 'Mobile navigation',
  openMenu: 'Open main navigation',
  closeMenu: 'Close main navigation',
  nav: { home: 'Home', services: 'Services', about: 'About us', contact: 'Contact' },
  allServices: 'All services',
  language: 'Language',
  backToServices: 'Back to services',
  moreServices: 'More services',
  ctaAction: 'Get in touch',
  seat: 'Registered office',
  notFound: {
    title: 'This page does not exist yet.',
    text: 'The address you opened is not on this website. Continue to the home page or to the overview of our services.',
    home: 'Open the home page',
    services: 'Our services',
  },
}

const meta: Content['meta'] = {
  locale: 'en_GB',
  home: {
    title: 'IT project management, cybersecurity and GDPR | Danau',
    description:
      'We help organisations prepare, manage and deliver change in IT, security, personal data protection, data and processes. DANAU, s.r.o., Bratislava.',
  },
  about: {
    title: 'About us – expert partner for IT, security and GDPR | Danau',
    description:
      'We are an expert partner for organisations that need to properly prepare, manage and deliver projects or strengthen their internal expert capacity.',
  },
  contact: {
    title: 'Contact – Danau, Doležalova 15/C, Bratislava',
    description:
      'Write to us at info@danau.sk or call +421 948 222 666. We will get back to you and arrange an initial consultation. DANAU, s.r.o., Bratislava.',
  },
  privacy: { title: 'Personal data protection | Danau' },
  cookies: { title: 'Cookie policy | Danau' },
  services: {
    'projektove-riadenie': { title: 'IT project and programme management | Danau' },
    'kyberneticka-bezpecnost': { title: 'Cybersecurity and audit preparation | Danau' },
    'gdpr-a-dpo': {
      title: 'GDPR and outsourced data protection officer | Danau',
      description:
        'We help set up personal data protection, GDPR documentation, processes and responsibilities, and provide an external data protection officer or support for an internal DPO.',
    },
    'analyza-a-data': { title: 'Process analysis and analytical services | Danau' },
    'data-governance': {
      title: 'Data governance and data management | Danau',
      description:
        'We help introduce data management, rules for working with data, responsibilities and data principles that support running the organisation and the further development of its IT.',
    },
    'realizacia-it': { title: 'Delivery of IT projects and solutions | Danau' },
  },
  breadcrumbHome: 'Home',
  imageAlt: 'Danau – IT project management, cybersecurity, GDPR and expert support',
  notFound: { title: 'Page not found | Danau', description: 'The page you are looking for does not exist on danau.sk.' },
}

export const en: Content = { services, home, about, contactPage, footer, privacy, cookies, ui, meta }
