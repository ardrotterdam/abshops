/**
 * ABshops lightweight i18n (nl / en). Vanilla JS, localStorage, no external APIs.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'abshops-lang';
    var DEFAULT_LANG = 'nl';
    var SUPPORTED = { nl: true, en: true };
    var TRANSITION_MS = 260;

    /** @type {{ nl: Record<string, unknown>, en: Record<string, unknown> }} */
    var DICT = {
        nl: {},
        en: {}
    };

    /* ——— Shared navigation, footer, chrome ——— */
    DICT.nl.nav = {
        home: 'Home',
        websites: 'Websites',
        webshops: 'Webshops',
        ai: 'AI-oplossingen',
        contact: 'Contact',
        logoAria: 'ABshops — Breure Media',
        mobileOpen: 'Hoofdmenu openen',
        mobileClose: 'Menu sluiten',
        mobileDialog: 'Hoofdnavigatie',
        mobileTrust:
            'Premium websites, webshops en AI-oplossingen vanuit Rotterdam.'
    };
    DICT.en.nav = {
        home: 'Home',
        websites: 'Websites',
        webshops: 'Webshops',
        ai: 'AI solutions',
        contact: 'Contact',
        logoAria: 'ABshops — Breure Media',
        mobileOpen: 'Open main menu',
        mobileClose: 'Close menu',
        mobileDialog: 'Primary navigation',
        mobileTrust:
            'Premium websites, webshops and AI solutions from Rotterdam.'
    };

    DICT.nl.footer = {
        tagline: 'Breure Media · Premium digital solutions',
        rights: '© 2026 ABshops / Breure Media. Alle rechten voorbehouden.'
    };
    DICT.en.footer = {
        tagline: 'Breure Media · Premium digital solutions',
        rights: '© 2026 ABshops / Breure Media. All rights reserved.'
    };

    DICT.nl.lang = {
        groupAria: 'Taal',
        labelNl: 'Nederlands',
        labelEn: 'English'
    };
    DICT.en.lang = {
        groupAria: 'Language',
        labelNl: 'Nederlands',
        labelEn: 'English'
    };

    /* ——— Lead form (multi-step) ——— */
    DICT.nl.lead = {
        steps: ['Contact', 'Organisatie', 'Project', 'Afronden'],
        progressAria: 'Stappen voortgang',
        validationHint: 'Controleer de gemarkeerde velden.',
        back: 'Vorige stap',
        next: 'Volgende',
        submit: 'Verstuur aanvraag',
        selectChoose: 'Kies een optie',
        selectBudget: 'Kies een bandbreedte',
        selectTimeline: 'Kies een optie',
        errName: 'Vul je naam in.',
        errCompany: 'Vul je bedrijfsnaam in.',
        errEmail: 'Vul een geldig e-mailadres in.',
        errPhone: 'Vul een telefoonnummer in.',
        errChoose: 'Maak een keuze.',
        errConsent: 'Bevestig dit om door te gaan.',
        labelName: 'Naam *',
        labelCompany: 'Bedrijf *',
        labelEmail: 'E-mail *',
        labelPhone: 'Telefoon *',
        labelBusiness: 'Soort bedrijf / organisatie *',
        legendWebsite: 'Heb je nu al een website? *',
        yes: 'Ja',
        no: 'Nee',
        labelBudget: 'Budgetindicatie *',
        labelTimeline: 'Gewenste timing *',
        goalsLegend: 'Waar wil je mee vooruit? *',
        goalsHint: 'Eén of meer opties',
        labelNotes: 'Extra context',
        notesHintWeb: 'Optioneel — links, concurrenten, referenties',
        notesHintShop: 'Optioneel — platform, kanalen, volumes',
        notesHintAi: 'Optioneel — systemen, volumes, compliance',
        consent: 'Ik ga akkoord dat ABshops mijn gegevens gebruikt om contact op te nemen over deze aanvraag. *',
        bizZzp: 'ZZP / freelancer',
        bizMkb: 'MKB (tot ca. 50 fte)',
        bizMid: 'Middelgroot (50–250 fte)',
        bizCorp: 'Corporate / enterprise',
        bizNp: 'Non-profit / overheid',
        bizOther: 'Anders',
        budTbd: 'Nog te bepalen / in gesprek',
        bud5k: 'Tot circa € 5.000',
        bud515: '€ 5.000 – € 15.000',
        bud1540: '€ 15.000 – € 40.000',
        bud40100: '€ 40.000 – € 100.000',
        bud100: '€ 100.000+',
        timeAsap: 'Zo snel mogelijk',
        time12: 'Binnen 1–2 maanden',
        time36: 'Binnen 3–6 maanden',
        timeFlex: 'Geen harde deadline',
        timeExplore: 'Alleen oriënteren',
        goalStrat: 'Strategie & positioning',
        goalLeads: 'Leads & conversie',
        goalSeo: 'Vindbaarheid (SEO)',
        goalPerf: 'Performance & techniek',
        goalEcoWeb: 'E-commerce / shop-laag',
        goalEcoShop: 'E-commerce / omzetgroei',
        goalEcoAi: 'E-commerce / operations',
        goalAi: 'AI / automatisering',
        goalAiSupport: 'AI / automatisering / support',
        trustWeb1: 'Reactie binnen één werkdag',
        trustWeb2: 'Vrijblijvend en vertrouwelijk',
        trustWeb3: 'Direct team, geen ticketrij',
        trustShop1: 'Persoonlijke follow-up',
        trustShop2: 'Geen verplichtingen tot je het zelf wilt',
        trustShop3: 'Heldere scope-voorbereiding',
        trustAi1: 'EU-first, privacy bewust',
        trustAi2: 'Mens in the loop waar nodig',
        trustAi3: 'Concrete vervolgstap binnen één werkdag',
        intakeLabel: 'Intake',
        phNotesWeb: 'Alles wat helpt om je vraag scherp te krijgen…',
        phNotesShop: 'Bijv. SKU-range, marktplaatsen, huidige stack…',
        phNotesAi: 'Bijv. CRM, helpdesk, gewenste KPI’s, data-locatie…'
    };

    DICT.en.lead = {
        steps: ['Contact', 'Organization', 'Project', 'Review'],
        progressAria: 'Step progress',
        validationHint: 'Please check the highlighted fields.',
        back: 'Back',
        next: 'Next',
        submit: 'Submit request',
        selectChoose: 'Choose an option',
        selectBudget: 'Choose a range',
        selectTimeline: 'Choose an option',
        errName: 'Enter your name.',
        errCompany: 'Enter your company name.',
        errEmail: 'Enter a valid email address.',
        errPhone: 'Enter a phone number.',
        errChoose: 'Make a selection.',
        errConsent: 'Confirm this to continue.',
        labelName: 'Name *',
        labelCompany: 'Company *',
        labelEmail: 'Email *',
        labelPhone: 'Phone *',
        labelBusiness: 'Type of business / organization *',
        legendWebsite: 'Do you already have a website? *',
        yes: 'Yes',
        no: 'No',
        labelBudget: 'Budget indication *',
        labelTimeline: 'Preferred timing *',
        goalsLegend: 'What do you want to move forward on? *',
        goalsHint: 'One or more options',
        labelNotes: 'Additional context',
        notesHintWeb: 'Optional — links, competitors, references',
        notesHintShop: 'Optional — platform, channels, volumes',
        notesHintAi: 'Optional — systems, volumes, compliance',
        consent: 'I agree that ABshops may use my details to contact me about this request. *',
        bizZzp: 'Freelancer / sole trader',
        bizMkb: 'SMB (up to ~50 FTE)',
        bizMid: 'Mid-market (50–250 FTE)',
        bizCorp: 'Corporate / enterprise',
        bizNp: 'Non-profit / government',
        bizOther: 'Other',
        budTbd: 'To be determined / discuss',
        bud5k: 'Up to approx. €5,000',
        bud515: '€5,000 – €15,000',
        bud1540: '€15,000 – €40,000',
        bud40100: '€40,000 – €100,000',
        bud100: '€100,000+',
        timeAsap: 'As soon as possible',
        time12: 'Within 1–2 months',
        time36: 'Within 3–6 months',
        timeFlex: 'No fixed deadline',
        timeExplore: 'Exploring only',
        goalStrat: 'Strategy & positioning',
        goalLeads: 'Leads & conversion',
        goalSeo: 'Discoverability (SEO)',
        goalPerf: 'Performance & engineering',
        goalEcoWeb: 'E-commerce / shop layer',
        goalEcoShop: 'E-commerce / revenue growth',
        goalEcoAi: 'E-commerce / operations',
        goalAi: 'AI / automation',
        goalAiSupport: 'AI / automation / support',
        trustWeb1: 'Reply within one business day',
        trustWeb2: 'Non-binding and confidential',
        trustWeb3: 'Direct team, no ticket queue',
        trustShop1: 'Personal follow-up',
        trustShop2: 'No obligations until you want them',
        trustShop3: 'Clear scope preparation',
        trustAi1: 'EU-first, privacy-conscious',
        trustAi2: 'Human in the loop where needed',
        trustAi3: 'Concrete next step within one business day',
        intakeLabel: 'Intake',
        phNotesWeb: 'Anything that helps sharpen your question…',
        phNotesShop: 'E.g. SKU range, marketplaces, current stack…',
        phNotesAi: 'E.g. CRM, helpdesk, KPIs, data residency…'
    };

    /* ——— Index ——— */
    DICT.nl.index = {
        metaTitle: 'ABshops | Premium websites, webshops & AI-oplossingen — Breure Media',
        metaDesc:
            'ABshops (Breure Media): premium websites, webshops en AI-oplossingen vanuit Rotterdam. Snel, veilig en schaalbaar — voor ondernemers die digitale groei serieus nemen.',
        ogTitle: 'ABshops — Premium websites, webshops & AI',
        ogDesc:
            'Digitale excellentie voor groeiende merken. Websites, webshops en AI-oplossingen met focus op conversie en performance.',
        heroEyebrow: 'Breure Media · Rotterdam',
        heroTitle: 'Digitale excellentie.<br>Geleverd.',
        heroSubtitle:
            'Premium websites, webshops en AI-oplossingen voor ondernemers die verder denken — onderdeel van Breure Media, Rotterdam.',
        ctaPrimary: 'Start je project',
        sectionExpertise: 'Expertise',
        svc1Title: 'Premium websites',
        svc1Text:
            'Van eerste idee tot schaalbaar platform: merk, UX en techniek in één lijn — inclusief fundament voor vindbaarheid.',
        svc2Title: 'Webshops & e-commerce',
        svc2Text:
            'Checkout die converteert, snelle laadtijden en een koopervaring die vertrouwen uitstraalt — gebouwd om te verkopen.',
        svc3Title: 'SEO & groei',
        svc3Text:
            'Organisch verkeer is onderdeel van het ontwerp: structuur, content en performance die zoekmachines én gebruikers waarderen.',
        svc4Title: 'AI-oplossingen',
        svc4Text:
            'Praktische automatisering en slimme flows — altijd met controle, kwaliteit en jouw merk voorop.',
        feat1Title: 'Snel',
        feat1Text: 'Geoptimaliseerd voor performance. Elke milliseconde telt.',
        feat2Title: 'Veilig',
        feat2Text: 'Enterprise-grade beveiliging. Standaard, geen optie.',
        feat3Title: 'Schaalbaar',
        feat3Text: 'Groei mee met je ambities. Zonder compromissen.',
        approachLabel: 'Werkwijze',
        approachTitle: 'Van idee tot impact',
        step1Title: 'Discovery',
        step1Text: 'We beginnen met luisteren. Jouw doelen, uitdagingen en ambities vormen het fundament.',
        step2Title: 'Strategy',
        step2Text: 'Data-gedreven planning. We vertalen inzichten naar een concrete roadmap.',
        step3Title: 'Execution',
        step3Text:
            'Ontwikkeling met oog voor detail. Clean code, modern design, getest op alle devices.',
        step4Title: 'Growth',
        step4Text: 'Lancering is het begin. We optimaliseren, meten en verbeteren continu.',
        statYears: 'Jaar ervaring',
        statQuality: 'Focus op kwaliteit',
        statRegion: 'Rotterdam & omgeving',
        statsHeading: 'ABshops in cijfers',
        ctaTitle: 'Klaar om te starten?',
        ctaLead:
            'Vertel kort over je merk en je doelen — we plannen graag een vrijblijvend gesprek.',
        ctaBtn: 'Naar contact',
        featuresLabel: 'Waarom ABshops',
        trustLabel: 'Rotterdam & Europa',
        trustBody:
            'ABshops (Breure Media) is een digitale agency uit Rotterdam: premium website- en webshopontwikkeling, AI-automatisering, SEO en digitale strategie — voor ondernemers in Nederland en Europa die kwaliteit boven shortcuts kiezen.',
        trustCta: 'Vraag een vrijblijvende intake aan'
    };

    DICT.en.index = {
        metaTitle: 'ABshops | Premium websites, webshops & AI solutions — Breure Media',
        metaDesc:
            'ABshops (Breure Media): premium websites, webshops and AI solutions from Rotterdam. Fast, secure and scalable — for founders who take digital growth seriously.',
        ogTitle: 'ABshops — Premium websites, webshops & AI',
        ogDesc:
            'Digital excellence for growing brands. Websites, webshops and AI solutions focused on conversion and performance.',
        heroEyebrow: 'Breure Media · Rotterdam',
        heroTitle: 'Digital excellence.<br>Delivered.',
        heroSubtitle:
            'Premium websites, webshops and AI solutions for entrepreneurs who think ahead — part of Breure Media, Rotterdam.',
        ctaPrimary: 'Start your project',
        sectionExpertise: 'Expertise',
        svc1Title: 'Premium websites',
        svc1Text:
            'From first idea to scalable platform: brand, UX and engineering aligned — including a solid SEO foundation.',
        svc2Title: 'Webshops & e-commerce',
        svc2Text:
            'Checkout that converts, fast load times and a shopping experience that earns trust — built to sell.',
        svc3Title: 'SEO & growth',
        svc3Text:
            'Organic traffic is part of the design: structure, content and performance that search engines and users value.',
        svc4Title: 'AI solutions',
        svc4Text:
            'Practical automation and smart flows — always with control, quality and your brand first.',
        feat1Title: 'Fast',
        feat1Text: 'Optimized for performance. Every millisecond counts.',
        feat2Title: 'Secure',
        feat2Text: 'Enterprise-grade security. Standard, not an add-on.',
        feat3Title: 'Scalable',
        feat3Text: 'Grow with your ambitions. Without compromise.',
        approachLabel: 'Approach',
        approachTitle: 'From idea to impact',
        step1Title: 'Discovery',
        step1Text: 'We start by listening. Your goals, challenges and ambitions form the foundation.',
        step2Title: 'Strategy',
        step2Text: 'Data-informed planning. We turn insights into a concrete roadmap.',
        step3Title: 'Execution',
        step3Text: 'Development with attention to detail. Clean code, modern design, tested on every device.',
        step4Title: 'Growth',
        step4Text: 'Launch is the beginning. We optimize, measure and improve continuously.',
        statYears: 'Years of experience',
        statQuality: 'Commitment to quality',
        statRegion: 'Rotterdam & region',
        statsHeading: 'ABshops at a glance',
        ctaTitle: 'Ready to start?',
        ctaLead: 'Tell us briefly about your brand and goals — we would love to schedule a no-obligation call.',
        ctaBtn: 'Contact',
        featuresLabel: 'Why ABshops',
        trustLabel: 'Rotterdam & Europe',
        trustBody:
            'ABshops (Breure Media) is a Rotterdam-based digital agency: premium website and webshop development, AI automation, SEO and digital strategy — for founders in the Netherlands and Europe who value quality over shortcuts.',
        trustCta: 'Request a no-obligation intake'
    };

    /* ——— Contact ——— */
    DICT.nl.contact = {
        metaTitle: 'Contact & offerte | ABshops — Breure Media Rotterdam',
        metaDesc:
            'Neem contact op met ABshops (Breure Media) in Rotterdam: websites, webshops en AI-oplossingen. Mail info@abshops.nl of plan een vrijblijvend gesprek.',
        ogTitle: 'Contact | ABshops',
        ogDesc: 'Rotterdam · info@abshops.nl · Weena 70. We reageren persoonlijk en snel op je bericht.',
        heroTitle: 'Laten we kennismaken',
        heroLead:
            'Vertel kort wat je wilt bereiken — nieuwe site, migratie van een shop of een eerste AI-pilot. We lezen persoonlijk mee en plannen zo nodig een call om scope en verwachtingen scherp te krijgen.',
        directTitle: 'Direct contact',
        dtEmail: 'E-mail',
        dtAddress: 'Adres',
        dtReply: 'Reactietijd',
        dtReplyText: 'Werkdagen reageren we doorgaans binnen één werkdag op serieuze aanvragen.',
        addressBlock: 'Weena 70<br>Rotterdam<br>Nederland',
        firstMsgTitle: 'Wat helpt in je eerste bericht',
        firstMsgIntro: 'Hoe concreter je startvraag, hoe gerichter we meedenken. Dit werkt goed in je mail:',
        li1: 'Je bedrijf en doelgroep in één zin',
        li2: 'Link naar je huidige site of shop (als die er is)',
        li3: 'Wat je wilt bereiken binnen 3–6 maanden',
        li4: 'Of er een gewenste launchdatum is',
        formSectionTitle: 'Bericht sturen',
        formIntro:
            'Vul het formulier hieronder in. Na het versturen zie je een bevestigingspagina; we reageren doorgaans binnen één werkdag.',
        labelName: 'Naam *',
        labelEmail: 'E-mail *',
        labelPhone: 'Telefoon',
        labelSubject: 'Onderwerp',
        labelMessage: 'Bericht *',
        phMessage: 'Waar kunnen we je mee helpen?',
        consent:
            'Ik ga akkoord dat ABshops mijn gegevens gebruikt om contact met mij op te nemen over dit bericht. *',
        submit: 'Verstuur bericht',
        servicesTitle: 'Diensten',
        servicesIntro: 'Wil je eerst lezen wat we precies leveren? Bekijk onze servicepagina’s:',
        crossWebTitle: 'Premium websites',
        crossWebText: 'Design, techniek, performance en SEO-fundering.',
        crossShopTitle: 'Webshops',
        crossShopText: 'Conversie, checkout en schaalbare e-commerce.',
        crossAiTitle: 'AI-oplossingen',
        crossAiText: 'Automatisering en workflows met controle.',
        bmTitle: 'Breure Media',
        bmText:
            'ABshops opereert onder de vlag van Breure Media — een compact team met focus op kwaliteit boven volume. Geen account circus: je praat met mensen die het werk ook daadwerkelijk uitvoeren.',
        mailDirect: 'Mail direct',
        ctaCallTitle: 'Liever teruggebeld worden?',
        ctaCallLead: 'Geef in je mail twee tijdvakken die uitkomen — dan stemmen we af wat het beste past.',
        ctaCallBtn: 'Plan via e-mail'
    };

    DICT.en.contact = {
        metaTitle: 'Contact & quote | ABshops — Breure Media Rotterdam',
        metaDesc:
            'Contact ABshops (Breure Media) in Rotterdam: websites, webshops and AI solutions. Email info@abshops.nl or schedule a no-obligation conversation.',
        ogTitle: 'Contact | ABshops',
        ogDesc: 'Rotterdam · info@abshops.nl · Weena 70. We reply personally and quickly.',
        heroTitle: 'Let’s connect',
        heroLead:
            'Tell us briefly what you want to achieve — a new site, a shop migration or a first AI pilot. We read every message and can schedule a call to align scope and expectations.',
        directTitle: 'Direct contact',
        dtEmail: 'Email',
        dtAddress: 'Address',
        dtReply: 'Response time',
        dtReplyText: 'On business days we usually reply within one business day to serious enquiries.',
        addressBlock: 'Weena 70<br>Rotterdam<br>Netherlands',
        firstMsgTitle: 'What helps in your first message',
        firstMsgIntro: 'The more concrete your question, the sharper our thinking. This works well:',
        li1: 'Your company and audience in one sentence',
        li2: 'Link to your current site or shop (if any)',
        li3: 'What you want to achieve within 3–6 months',
        li4: 'Whether you have a preferred launch date',
        formSectionTitle: 'Send a message',
        formIntro:
            'Fill in the form below. After submitting you will see a confirmation page; we usually reply within one business day.',
        labelName: 'Name *',
        labelEmail: 'Email *',
        labelPhone: 'Phone',
        labelSubject: 'Subject',
        labelMessage: 'Message *',
        phMessage: 'How can we help?',
        consent:
            'I agree that ABshops may use my details to contact me about this message. *',
        submit: 'Send message',
        servicesTitle: 'Services',
        servicesIntro: 'Want to read what we deliver first? Explore our service pages:',
        crossWebTitle: 'Premium websites',
        crossWebText: 'Design, engineering, performance and SEO foundations.',
        crossShopTitle: 'Webshops',
        crossShopText: 'Conversion, checkout and scalable e-commerce.',
        crossAiTitle: 'AI solutions',
        crossAiText: 'Automation and workflows with control.',
        bmTitle: 'Breure Media',
        bmText:
            'ABshops operates under Breure Media — a compact team focused on quality over volume. No account maze: you speak with people who actually do the work.',
        mailDirect: 'Email us directly',
        ctaCallTitle: 'Prefer a callback?',
        ctaCallLead: 'Mention two time windows that work for you — we will align from there.',
        ctaCallBtn: 'Schedule via email'
    };

    /* ——— Websites page ——— */
    DICT.nl.websites = {
        metaTitle: 'Premium websites laten bouwen | ABshops — Breure Media',
        metaDesc:
            'Premium websites door ABshops (Breure Media): strategie, design, snelle performance en SEO-vriendelijke techniek. Rotterdam.',
        ogTitle: 'Premium websites | ABshops',
        ogDesc:
            'Merkbouwende sites met focus op conversie, snelheid en vindbaarheid. Ontdek hoe we jouw digitale presence neerzetten.',
        heroTitle: 'Premium websites die werken',
        heroLead:
            'Jouw site is vaak het eerste wat klanten zien. Wij bouwen strakke, snelle en flexibele platforms die je merk ondersteunen — van positioning tot meetbare conversie.',
        heroCta: 'Vraag een gesprek aan',
        s1Title: 'Wat je krijgt',
        s1p1:
            'Geen generieke templates, maar een doorontworpen ervaring: heldere informatiearchitectuur, sterke typografie en rust in het ontwerp. Elk scherm wordt behandeld als onderdeel van een groter verhaal — zodat bezoekers snappen wie je bent en wat de volgende stap is.',
        s1p2:
            'We denken mee over contenthiërarchie, calls-to-action en microcopy, zodat je site niet alleen mooi is, maar ook richting geeft aan je funnel.',
        s2Title: 'Performance & techniek',
        s2p:
            'Snelheid is UX en SEO tegelijk. We optimaliseren assets, caching en kritieke rendering paths waar dat nodig is. Technisch leggen we een solide basis: toegankelijkheid meenemen waar het kan, nette semantische markup en een codebase die onderhoudbaar blijft als je door groeit.',
        s2li1: 'Snelle laadtijden en stabiele Core Web Vitals als uitgangspunt',
        s2li2: 'Responsive layouts voor desktop, tablet en mobiel',
        s2li3: 'Beveiliging en updates als vast onderdeel van het plaatje — geen bijzaak',
        s3Title: 'Vindbaarheid & SEO',
        s3p1:
            'Een premium website verdient organisch verkeer. Daarom bouwen we met zoekmachines in gedachten: logische URL-structuren, nette metadata, interne links en pagina’s die antwoord geven op echte zoekvragen.',
        s3p2:
            'SEO is geen losstaand trucje maar samenhang met je contentstrategie — we helpen je die lijn te trekken, zodat groei duurzaam is en niet afhankelijk van een enkele tactiek.',
        s4Title: 'Samenwerking',
        s4p:
            'Transparante planning, vaste momenten om feedback te verzamelen en een duidelijke launch-checklist. Je weet waar je aan toe bent: scope, mijlpalen en wat er ná live nog gebeurt (meten, bijsturen, uitbreiden).',
        crossTitle: 'Ook interessant',
        crossShopTitle: 'Webshops',
        crossShopText: 'E-commerce met focus op conversie en schaalbare catalogi.',
        crossAiTitle: 'AI-oplossingen',
        crossAiText: 'Automatisering en slimme workflows naast je website.',
        crossContact: 'Vragen over planning, scope of samenwerking?',
        leadTitle: 'Plan je aanvraag — premium website',
        leadIntro:
            'Vul dit multi-stappen formulier in. Je gegevens worden alleen gebruikt om je aanvraag te beoordelen en persoonlijk contact op te nemen — conform je toestemming in de laatste stap.',
        ctaTitle: 'Plan een introductie',
        ctaLead: 'We bespreken graag je merk, doelgroep en technische wensen — vrijblijvend.',
        ctaBtn: 'Start je aanvraag',
        contactHeroAside: 'Liever eerst even sparren via mail?',
        contactHeroLink: 'Neem contact op'
    };

    DICT.en.websites = {
        metaTitle: 'Premium websites built for results | ABshops — Breure Media',
        metaDesc:
            'Premium websites by ABshops (Breure Media): strategy, design, fast performance and SEO-friendly engineering. Rotterdam.',
        ogTitle: 'Premium websites | ABshops',
        ogDesc: 'Brand-led sites focused on conversion, speed and discoverability.',
        heroTitle: 'Premium websites that perform',
        heroLead:
            'Your site is often the first thing customers see. We build crisp, fast and flexible platforms that support your brand — from positioning to measurable conversion.',
        heroCta: 'Request a conversation',
        s1Title: 'What you get',
        s1p1:
            'No generic templates — a crafted experience: clear information architecture, strong typography and calm design. Every screen is part of a bigger story so visitors understand who you are and what to do next.',
        s1p2:
            'We help shape hierarchy, calls-to-action and microcopy so your site is not only beautiful but actively guides your funnel.',
        s2Title: 'Performance & engineering',
        s2p:
            'Speed is UX and SEO at once. We optimize assets, caching and critical rendering paths where needed. Technically we lay a solid foundation: accessibility where it matters, clean semantic markup and maintainable code as you grow.',
        s2li1: 'Fast load times with stable Core Web Vitals as the baseline',
        s2li2: 'Responsive layouts for desktop, tablet and mobile',
        s2li3: 'Security and updates as part of the package — not an afterthought',
        s3Title: 'Discoverability & SEO',
        s3p1:
            'A premium website deserves organic traffic. We build with search in mind: logical URLs, solid metadata, internal linking and pages that answer real queries.',
        s3p2:
            'SEO is not a gimmick — it aligns with your content strategy so growth is sustainable rather than tied to a single tactic.',
        s4Title: 'Collaboration',
        s4p:
            'Transparent planning, structured feedback moments and a clear launch checklist. You always know the scope, milestones and what happens after go-live (measure, iterate, extend).',
        crossTitle: 'Also explore',
        crossShopTitle: 'Webshops',
        crossShopText: 'E-commerce focused on conversion and scalable catalogs.',
        crossAiTitle: 'AI solutions',
        crossAiText: 'Automation and smart workflows alongside your website.',
        crossContact: 'Questions about scope, timing or collaboration?',
        leadTitle: 'Submit your request — premium website',
        leadIntro:
            'Complete this multi-step form. Your details are used only to review your request and contact you personally — as confirmed by your consent in the final step.',
        ctaTitle: 'Book an introduction',
        ctaLead: 'We would love to discuss your brand, audience and technical needs — no obligation.',
        ctaBtn: 'Start your request',
        contactHeroAside: 'Prefer to align by email first?',
        contactHeroLink: 'Contact'
    };

    /* ——— Webshops ——— */
    DICT.nl.webshops = {
        metaTitle: 'Premium webshops & e-commerce | ABshops — Breure Media',
        metaDesc:
            'Premium webshops en e-commerce door ABshops (Breure Media): conversie, checkout, performance en schaalbare catalogi.',
        ogTitle: 'Premium webshops & e-commerce | ABshops',
        ogDesc: 'Verkoop online met een store die snel is, vertrouwen uitstraalt en meegroeit met je assortiment.',
        heroTitle: 'Webshops die verkopen',
        heroLead:
            'E-commerce draait om vertrouwen, snelheid en een checkout zonder frictie. ABshops ontwerpt en realiseert premium webshops die zijn gebouwd om omzet te maken — met ruimte om uit te breiden naarmate je assortiment groeit.',
        heroCta: 'Laten we je store bespreken',
        s1Title: 'Customer journey die klopt',
        s1p1:
            'Van eerste klik tot betaling: elke stap moet duidelijk zijn. We optimaliseren productlistingpages, filters en zoekgedrag zodat klanten snel vinden wat ze zoeken. Op mobiel — waar het grootste deel van het verkeer zit — voelt de shop net zo solide als op desktop.',
        s1p2:
            'Onder water houden we rekening met voorraad, varianten en seizoenscampagnes, zodat je merkconsistent blijft onder druk.',
        s2Title: 'Checkout & conversie',
        s2p:
            'Het grootste verlies zit vaak in de laatste meters. We bouwen een checkout die rust uitstraalt: duidelijke verzend- en betaalopties, foutmeldingen die helpen in plaats van frustreren, en vertrouwenssignalen op het juiste moment.',
        s2li1: 'Minder stappen waar het kan, zonder compliance te vergeten',
        s2li2: 'A/B-gerechte componenten waar je later op wilt optimaliseren',
        s2li3: 'Performance onder load: black friday hoort geen verrassing te zijn',
        s3Title: 'Integraties & operatie',
        s3p:
            'Je webshop is het middelpunt van fulfillment, voorraad en klantcontact. We denken mee over koppelingen met ERP, fulfilmentpartners, e-mailmarketing en analytics — zodat data niet vastzit in silo’s maar jouw team verder helpt.',
        s4Title: 'E-commerce SEO',
        s4p:
            'Organisch verkeer voor categorieën en producten vraagt structuur: duplicate content vermijden, sterke interne links en pagina’s die echt waarde bieden naast je listings. We zetten de technische basis neer en geven richting voor content die het verschil maakt in competitive niches.',
        crossTitle: 'Meer van ABshops',
        crossWebTitle: 'Premium websites',
        crossWebText: 'Corporate sites en campagnes naast je shop.',
        crossAiTitle: 'AI-oplossingen',
        crossAiText: 'Supportflows en automatisering rondom orders.',
        crossContact: 'Vragen over groei, integraties of doorlooptijd?',
        leadTitle: 'Plan je aanvraag — premium webshop',
        leadIntro:
            'Vertel ons over je assortiment, verkeer en ambities. We volgen hetzelfde professionele intake-proces als bij onze website-projecten, afgestemd op e-commerce.',
        ctaTitle: 'Jouw volgende groeistap',
        ctaLead: 'Vertel ons over je assortiment, kanalen en ambitie — we denken met je mee.',
        ctaBtn: 'Start je aanvraag',
        contactHeroAside: 'Liever eerst even sparren via mail?',
        contactHeroLink: 'Neem contact op'
    };

    DICT.en.webshops = {
        metaTitle: 'Premium webshops & e-commerce | ABshops — Breure Media',
        metaDesc:
            'Premium webshops and e-commerce by ABshops (Breure Media): conversion, checkout, performance and scalable catalogs.',
        ogTitle: 'Premium webshops & e-commerce | ABshops',
        ogDesc: 'Sell online with a store that is fast, trustworthy and grows with your catalog.',
        heroTitle: 'Webshops built to sell',
        heroLead:
            'E-commerce is trust, speed and a frictionless checkout. ABshops designs and builds premium stores focused on revenue — with room to expand as your assortment grows.',
        heroCta: 'Let’s discuss your store',
        s1Title: 'A customer journey that fits',
        s1p1:
            'From first click to payment: every step must be clear. We optimize PLPs, filters and search so shoppers find what they need quickly. On mobile — where most traffic lives — the store feels as solid as desktop.',
        s1p2:
            'Under the hood we account for stock, variants and seasonal campaigns so your brand stays consistent under pressure.',
        s2Title: 'Checkout & conversion',
        s2p:
            'The biggest drop-offs are often at the finish line. We build a calm checkout: clear shipping and payment options, helpful error states and trust signals at the right moments.',
        s2li1: 'Fewer steps where possible without skipping compliance',
        s2li2: 'Components ready for experimentation and optimization',
        s2li3: 'Performance under load — peak days should not be a surprise',
        s3Title: 'Integrations & operations',
        s3p:
            'Your shop sits at the center of fulfillment, inventory and customer contact. We think through ERP links, fulfillment partners, email and analytics so data helps your team instead of siloing.',
        s4Title: 'E-commerce SEO',
        s4p:
            'Organic traffic for categories and products needs structure: avoid duplication, strengthen internal linking and build pages that add value beyond listings. We set the technical foundation and guide content that wins in competitive niches.',
        crossTitle: 'More from ABshops',
        crossWebTitle: 'Premium websites',
        crossWebText: 'Corporate sites and campaigns alongside your shop.',
        crossAiTitle: 'AI solutions',
        crossAiText: 'Support flows and automation around orders.',
        crossContact: 'Questions about growth, integrations or lead time?',
        leadTitle: 'Submit your request — premium webshop',
        leadIntro:
            'Tell us about assortment, traffic and ambitions. We follow the same professional intake as our website projects, tailored to e-commerce.',
        ctaTitle: 'Your next growth step',
        ctaLead: 'Tell us about assortment, channels and ambition — we will think along.',
        ctaBtn: 'Start your request',
        contactHeroAside: 'Prefer to align by email first?',
        contactHeroLink: 'Contact'
    };

    /* ——— AI ——— */
    DICT.nl.ai = {
        metaTitle: 'AI-oplossingen & automatisering | ABshops — Breure Media',
        metaDesc:
            'AI-oplossingen voor bedrijven door ABshops (Breure Media): slimme automatisering, assistenten en workflows — veilig, meetbaar en merkconsistent.',
        ogTitle: 'AI-oplossingen voor organisaties | ABshops',
        ogDesc: 'Praktische AI: minder handwerk, betere antwoorden, schaalbare processen — met menselijke controle.',
        heroTitle: 'AI die het werk ondersteunt',
        heroLead:
            'AI is pas waardevol als het past bij je processen, data en merk. ABshops ontwerpt en implementeert oplossingen die repetitieve taken verminderen, teams ondersteunen en schaal geven — altijd met heldere grenzen en kwaliteitscontrole.',
        heroCta: 'Spreek AI voor jouw organisatie door',
        s1Title: 'Waar AI het verschil maakt',
        s1p1:
            'Denk aan klantvragen die eerst categorisch worden ingedeeld, concept-antwoorden voor je servicedesk, interne kennisbanken die doorzoekbaar worden met natuurlijke taal, of contentworkflows die sneller itereren — mét human review waar het moet.',
        s1p2:
            'We starten bij het probleem, niet bij het model: wat kost nu tijd, waar gaan fouten verloren, en waar verwacht je een hogere standaard?',
        s2Title: 'Use cases die we vaak zien',
        s2li1:
            '<strong>Support &amp; sales:</strong> snellere eerste reactie, consistente tone-of-voice, escalatie naar mensen waar nodig',
        s2li2:
            '<strong>Operations:</strong> documenten verwerken, samenvatten, structureren — gekoppeld aan je eigen systemen',
        s2li3:
            '<strong>Marketing &amp; product:</strong> bulk-varianten van teksten controleren, SEO-blauwdrukken, experimentatie versnellen',
        s3Title: 'Privacy, security & eigenaarschap',
        s3p1:
            'Gegevens blijven bij jou waar dat hoort: we kijken naar retention, toegang en logging. Waar cloud-AI nodig is, kiezen we configuraties die passen bij jouw risicoprofiel — en waar mogelijk combineren we met on-prem of EU-regio’s.',
        s3p2:
            'Je behoudt eigenaarschap over prompts, workflows en output — geen black box zonder overdracht.',
        s4Title: 'Implementatie die volgt',
        s4p:
            'Pilot → evalueren → uitbreiden. We meten wat telt: doorlooptijd, foutpercentages, tevredenheid en kosten per interactie. Zo wordt AI een onderdeel van je bedrijfsvoering, geen eenmalige demo.',
        crossTitle: 'Combinatie met web',
        crossWebTitle: 'Premium websites',
        crossWebText: 'AI-features ingebed in je publieke site waar het zinvol is.',
        crossShopTitle: 'Webshops',
        crossShopText: 'Productadvies, zoekhulp en post-sale flows die converteren.',
        crossContact: 'Twijfel je tussen pilot, security of EU-data?',
        leadTitle: 'Plan je aanvraag — AI & automatisering',
        leadIntro:
            'Beschrijf kort je proces, volumes en risico’s. We gebruiken dezelfde intake-flow om snel te bepalen of een pilot zinvol is — transparant en zonder marketingdruk.',
        ctaTitle: 'Ontdek wat haalbaar is',
        ctaLead: 'In een kort traject brengen we samen kansen en randvoorwaarden in kaart.',
        ctaBtn: 'Start je aanvraag',
        contactHeroAside: 'Liever eerst even sparren via mail?',
        contactHeroLink: 'Neem contact op'
    };

    DICT.en.ai = {
        metaTitle: 'AI solutions & automation | ABshops — Breure Media',
        metaDesc:
            'AI solutions for organizations by ABshops (Breure Media): smart automation, assistants and workflows — safe, measurable and on-brand.',
        ogTitle: 'AI solutions for organizations | ABshops',
        ogDesc: 'Practical AI: less manual work, better answers, scalable processes — with human control.',
        heroTitle: 'AI that supports the work',
        heroLead:
            'AI is valuable when it fits your processes, data and brand. ABshops designs and implements solutions that reduce repetitive work, support teams and scale — with clear boundaries and quality control.',
        heroCta: 'Explore AI for your organization',
        s1Title: 'Where AI moves the needle',
        s1p1:
            'Think triaging customer questions, draft replies for support, searchable internal knowledge bases in natural language, or faster content workflows — with human review where it matters.',
        s1p2:
            'We start from the problem, not the model: what costs time today, where do mistakes slip through, and where do you expect a higher bar?',
        s2Title: 'Use cases we often see',
        s2li1:
            '<strong>Support &amp; sales:</strong> faster first response, consistent tone of voice, escalation to humans when needed',
        s2li2:
            '<strong>Operations:</strong> process documents, summarize and structure — connected to your systems',
        s2li3:
            '<strong>Marketing &amp; product:</strong> review copy variants at scale, SEO briefs, faster experimentation',
        s3Title: 'Privacy, security & ownership',
        s3p1:
            'Data stays where it belongs: we look at retention, access and logging. Where cloud AI is needed we choose configurations that match your risk profile — and combine with on-prem or EU regions when possible.',
        s3p2:
            'You keep ownership of prompts, workflows and output — no opaque black box without handover.',
        s4Title: 'Implementation that sticks',
        s4p:
            'Pilot → evaluate → expand. We measure what matters: cycle time, error rates, satisfaction and cost per interaction — so AI becomes operations, not a one-off demo.',
        crossTitle: 'Combined with web',
        crossWebTitle: 'Premium websites',
        crossWebText: 'Embed AI features in your public site where it makes sense.',
        crossShopTitle: 'Webshops',
        crossShopText: 'Product guidance, search assist and post-sale flows that convert.',
        crossContact: 'Unsure about pilots, security or EU data residency?',
        leadTitle: 'Submit your request — AI & automation',
        leadIntro:
            'Briefly describe process, volumes and risks. We use the same intake flow to see quickly whether a pilot makes sense — transparent and without hype.',
        ctaTitle: 'Discover what is feasible',
        ctaLead: 'In a short trajectory we map opportunities and constraints together.',
        ctaBtn: 'Start your request',
        contactHeroAside: 'Prefer to align by email first?',
        contactHeroLink: 'Contact'
    };

    /* ——— Bedankt ——— */
    DICT.nl.bedankt = {
        metaTitle: 'Bedankt voor uw aanvraag | ABshops',
        metaDesc: 'Bedankt voor uw aanvraag bij ABshops. We nemen zo snel mogelijk contact met u op.',
        ogTitle: 'Bedankt | ABshops',
        ogDesc: 'Uw aanvraag is ontvangen.',
        heroTitle: 'Bedankt',
        heroLead: 'Bedankt voor uw aanvraag. Ik neem zo snel mogelijk contact met u op.',
        btnHome: 'Terug naar home',
        btnContact: 'Contact',
        nextTitle: 'Volgende stappen',
        nextBody:
            'Uw bericht is verstuurd. Controleer zo nodig uw spammap als u niets van ons hoort. Voor dringende vragen kunt u ook direct mailen naar <a href="mailto:info@abshops.nl">info@abshops.nl</a>.'
    };

    DICT.en.bedankt = {
        metaTitle: 'Thank you for your request | ABshops',
        metaDesc: 'Thank you for contacting ABshops. We will get back to you as soon as possible.',
        ogTitle: 'Thank you | ABshops',
        ogDesc: 'Your request has been received.',
        heroTitle: 'Thank you',
        heroLead: 'Thank you for your request. I will get back to you as soon as possible.',
        btnHome: 'Back to home',
        btnContact: 'Contact',
        nextTitle: 'Next steps',
        nextBody:
            'Your message has been sent. Please check your spam folder if you do not hear from us. For urgent questions you can also email <a href="mailto:info@abshops.nl">info@abshops.nl</a> directly.'
    };

    function detectPageId() {
        var body = document.body;
        if (body && body.getAttribute('data-i18n-page')) {
            return body.getAttribute('data-i18n-page');
        }
        var path = (window.location.pathname || '').split('/').pop() || 'index.html';
        var map = {
            '': 'index',
            index: 'index',
            'index.html': 'index',
            'contact.html': 'contact',
            'websites.html': 'websites',
            'webshops.html': 'webshops',
            'ai-oplossingen.html': 'ai',
            'bedankt.html': 'bedankt'
        };
        return map[path] || 'index';
    }

    function getRaw(lang, path) {
        var parts = path.split('.');
        /** @type {unknown} */
        var cur = DICT[lang];
        for (var i = 0; i < parts.length; i++) {
            if (cur == null || typeof cur !== 'object') return undefined;
            cur = /** @type {Record<string, unknown>} */ (cur)[parts[i]];
        }
        return cur;
    }

    function getPreferredLang() {
        try {
            var s = localStorage.getItem(STORAGE_KEY);
            if (s && SUPPORTED[s]) return s;
        } catch (e) {
            /* ignore */
        }
        return DEFAULT_LANG;
    }

    function setStoredLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            /* ignore */
        }
    }

    /**
     * @param {string} lang
     * @param {string} path dot-separated key, e.g. nav.home or index.heroTitle
     */
    function t(lang, path) {
        var v = getRaw(lang, path);
        if (v !== undefined && v !== null) return String(v);
        if (lang !== DEFAULT_LANG) return t(DEFAULT_LANG, path);
        return '';
    }

    function injectHreflang() {
        if (document.querySelector('link[data-abshops-hreflang]')) return;
        var url = window.location.href.replace(/#.*$/, '');
        ['nl', 'en'].forEach(function (code) {
            var link = document.createElement('link');
            link.setAttribute('rel', 'alternate');
            link.setAttribute('hreflang', code);
            link.setAttribute('href', url);
            link.setAttribute('data-abshops-hreflang', code);
            document.head.appendChild(link);
        });
        var xdef = document.createElement('link');
        xdef.setAttribute('rel', 'alternate');
        xdef.setAttribute('hreflang', 'x-default');
        xdef.setAttribute('href', url);
        xdef.setAttribute('data-abshops-hreflang', 'x-default');
        document.head.appendChild(xdef);
    }

    function applyMetaSeo(lang, pageId) {
        var prefix = pageId + '.';
        var title = t(lang, prefix + 'metaTitle');
        if (title) document.title = title;

        var desc = t(lang, prefix + 'metaDesc');
        var md = document.querySelector('meta[name="description"]');
        if (md && desc) md.setAttribute('content', desc);

        var ogTitle = t(lang, prefix + 'ogTitle');
        var ogT = document.querySelector('meta[property="og:title"]');
        if (ogT && ogTitle) ogT.setAttribute('content', ogTitle);

        var ogDesc = t(lang, prefix + 'ogDesc');
        var ogD = document.querySelector('meta[property="og:description"]');
        if (ogD && ogDesc) ogD.setAttribute('content', ogDesc);

        var twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle && ogTitle) twTitle.setAttribute('content', ogTitle);
        var twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc && ogDesc) twDesc.setAttribute('content', ogDesc);

        var ogLoc = document.querySelector('meta[property="og:locale"]');
        if (ogLoc) {
            ogLoc.setAttribute('content', lang === 'en' ? 'en_US' : 'nl_NL');
            var altNl = document.querySelector('meta[property="og:locale:alternate"][content="nl_NL"]');
            var altEn = document.querySelector('meta[property="og:locale:alternate"][content="en_US"]');
            if (!altNl) {
                altNl = document.createElement('meta');
                altNl.setAttribute('property', 'og:locale:alternate');
                altNl.setAttribute('content', 'nl_NL');
                document.head.appendChild(altNl);
            }
            if (!altEn) {
                altEn = document.createElement('meta');
                altEn.setAttribute('property', 'og:locale:alternate');
                altEn.setAttribute('content', 'en_US');
                document.head.appendChild(altEn);
            }
        }

        document.documentElement.lang = lang === 'en' ? 'en' : 'nl';
    }

    function applyBindings(lang) {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (!key) return;
            var val = t(lang, key);
            if (!val && lang !== DEFAULT_LANG) val = t(DEFAULT_LANG, key);
            if (!val) return;

            var useHtml = el.getAttribute('data-i18n-html') === 'true';
            if (useHtml) el.innerHTML = val;
            else el.textContent = val;

            var attrs = el.getAttribute('data-i18n-attr');
            if (attrs) {
                attrs.split(/\s+/).forEach(function (a) {
                    var name = a.trim();
                    if (!name) return;
                    el.setAttribute(name, val);
                });
            }

            var phKey = el.getAttribute('data-i18n-placeholder');
            if (phKey && 'placeholder' in el) {
                var pv = t(lang, phKey);
                if (pv) el.placeholder = pv;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]:not([data-i18n])').forEach(function (el) {
            var phKey = el.getAttribute('data-i18n-placeholder');
            if (!phKey || !('placeholder' in el)) return;
            var pv = t(lang, phKey);
            if (pv) el.placeholder = pv;
        });
    }

    function bindLangSwitch() {
        var roots = document.querySelectorAll('.lang-switch');
        if (!roots.length) return;

        function syncButtons(active) {
            roots.forEach(function (root) {
                root.querySelectorAll('.lang-switch-btn').forEach(function (btn) {
                    var code = btn.getAttribute('data-lang');
                    var isOn = code === active;
                    btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
                    btn.classList.toggle('is-active', isOn);
                });
                var grpAria = t(active, 'lang.groupAria');
                if (grpAria) root.setAttribute('aria-label', grpAria);
            });
        }

        roots.forEach(function (root) {
            root.querySelectorAll('.lang-switch-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var next = btn.getAttribute('data-lang');
                    if (!next || !SUPPORTED[next]) return;
                    if (next === getPreferredLang()) return;
                    applyLanguage(next);
                });
            });
        });

        syncButtons(getPreferredLang());
        document.addEventListener('abshops:i18n-applied', function (ev) {
            /** @type {{ detail?: { lang?: string }}} */
            var e = ev;
            if (e.detail && e.detail.lang) syncButtons(e.detail.lang);
        });
    }

    var firstApply = true;

    /**
     * @param {string} lang
     * @param {{ silent?: boolean }} [opts]
     */
    function applyLanguage(lang, opts) {
        if (!SUPPORTED[lang]) lang = DEFAULT_LANG;
        var silent = opts && opts.silent;

        function inner() {
            setStoredLang(lang);
            var pageId = detectPageId();
            injectHreflang();
            applyMetaSeo(lang, pageId);
            applyBindings(lang);

            document.dispatchEvent(
                new CustomEvent('abshops:i18n-applied', {
                    detail: { lang: lang, pageId: pageId }
                })
            );
            document.body.classList.remove('i18n-switching');
        }

        if (silent || firstApply) {
            firstApply = false;
            inner();
            return;
        }

        document.body.classList.add('i18n-switching');
        window.setTimeout(inner, TRANSITION_MS);
    }

    function init() {
        injectHreflang();
        applyLanguage(getPreferredLang(), { silent: true });
        bindLangSwitch();
    }

    window.ABshopsI18n = {
        STORAGE_KEY: STORAGE_KEY,
        DEFAULT_LANG: DEFAULT_LANG,
        supported: SUPPORTED,
        dict: DICT,
        detectPageId: detectPageId,
        getLang: getPreferredLang,
        setLang: function (lang) {
            applyLanguage(lang);
        },
        t: function (path) {
            return t(getPreferredLang(), path);
        },
        apply: init,
        /** For lead-form.js */
        leadSteps: function (lang) {
            var raw = getRaw(lang, 'lead.steps');
            if (Array.isArray(raw)) return raw.map(String);
            return ['Contact', 'Organization', 'Project', 'Review'];
        },
        leadString: function (lang, key) {
            return t(lang, 'lead.' + key);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
