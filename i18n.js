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
        ai: 'Automatisering',
        insights: 'Insights',
        contact: 'Contact',
        logoAria: 'ABshops',
        mobileOpen: 'Hoofdmenu openen',
        mobileClose: 'Menu sluiten',
        mobileDialogSr: 'Menu',
        mobileDialog: 'Hoofdnavigatie',
        mobileTrust:
            'Websites, Shopify-webshops en digitale workflows — Rotterdam.',
        mobileSubtitleWebsites: 'Premium bedrijfswebsites',
        mobileSubtitleWebshops: 'Shopify & e-commerce',
        mobileSubtitleAi: 'AI automatisering & agents',
        mobileSubtitleInsights: 'AI, ecommerce & digitale groei',
        mobileSubtitleContact: 'Start uw project'
    };
    DICT.en.nav = {
        home: 'Home',
        websites: 'Websites',
        webshops: 'Webshops',
        ai: 'Automation',
        insights: 'Insights',
        contact: 'Contact',
        logoAria: 'ABshops',
        mobileOpen: 'Open main menu',
        mobileClose: 'Close menu',
        mobileDialogSr: 'Menu',
        mobileDialog: 'Primary navigation',
        mobileTrust:
            'Websites, Shopify stores and digital workflows — Rotterdam.',
        mobileSubtitleWebsites: 'Premium corporate websites',
        mobileSubtitleWebshops: 'Shopify & e-commerce',
        mobileSubtitleAi: 'AI automation & agents',
        mobileSubtitleInsights: 'AI, ecommerce & digital growth',
        mobileSubtitleContact: 'Start your project'
    };

    DICT.nl.footer = {
        tagline: 'ABshops — digitale commerce studio uit Rotterdam.',
        navLabel: 'Navigatie',
        navAria: 'Footernavigatie',
        contactLabel: 'Contact',
        contactCity: 'Rotterdam, Nederland',
        contactStreet: 'Weena 70',
        tradeLine: 'ABshops is een handelsnaam van Ard Breure.',
        rights: '© 2026 ABshops. Alle rechten voorbehouden.'
    };
    DICT.en.footer = {
        tagline: 'ABshops — digital commerce studio based in Rotterdam.',
        navLabel: 'Navigation',
        navAria: 'Footer navigation',
        contactLabel: 'Contact',
        contactCity: 'Rotterdam, Netherlands',
        contactStreet: 'Weena 70',
        tradeLine: 'ABshops is a trade name of Ard Breure.',
        rights: '© 2026 ABshops. All rights reserved.'
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
        metaTitle: 'ABshops | Websites, Shopify & digitale workflows — Rotterdam',
        metaDesc:
            'ABshops uit Rotterdam: moderne websites, Shopify-webshops, SEO en workflows met slimme tooling voor ondernemers die online willen groeien. Website laten maken Rotterdam · Shopify specialist.',
        ogTitle: 'ABshops — Digitale commerce studio Rotterdam',
        ogDesc:
            'Websites, Shopify en ecommerce, SEO en praktische digitale inrichting — menselijk geleid, technisch strak.',
        heroEyebrow: 'Digitale commerce studio · Rotterdam',
        heroImgAlt:
            'Premium AI-assisted ecommerce workspace van ABshops voor websites, Shopify en digitale automatisering',
        heroTitle: 'Websites, Shopify-webshops<br> en slimme AI-workflows.',
        heroSubtitle:
            'Web, Shopify en automatisering met slimme tooling — menselijk geleid, technisch strak. Rotterdam · heel Nederland.',
        ctaPrimary: 'Plan een vrijblijvend gesprek',
        workflowEyebrow: 'HOE WIJ WERKEN',
        workflowLead: 'Van strategie en development tot AI-automatisering en groei.',
        workflowImgAlt:
            'Workflow infographic van ABshops met strategie, webdevelopment, AI automatisering en digitale groei',
        sectionExpertise: 'Vier duidelijke pijlers',
        svc1Title: 'Websites & platforms',
        svc1Text:
            'Modern webdesign en snelle, responsive sites — met SEO-vriendelijke structuur en Next.js / Vercel waar dat bij jouw traject past.',
        svc2Title: 'Shopify & ecommerce',
        svc2Text:
            'Shopify inrichten, catalogi en navigatie scherp zetten, conversie verbeteren en workflows rond affiliate of omnichannel helder trekken.',
        svc3Title: 'Automatisering & workflows',
        svc3Text:
            'Praktische workflows met ondersteunende automatisering — van content tot operations — altijd met menselijke regie en duidelijke kwaliteitsgrenzen.',
        svc4Title: 'Digitale bedrijfsinrichting',
        svc4Text:
            'Google Workspace en mail voor het team, domeinen en DNS, hosting en deployment — de technische basis zodat je site en shop betrouwbaar draaien.',
        feat1Title: 'Ecommerce-ervaring',
        feat1Text:
            'Van checkout-gedrag tot catalogilogica: we bouwen shops om verkocht te worden, niet alleen om live te staan.',
        feat2Title: 'Diepte in Shopify',
        feat2Text:
            'Themes, collections, navigatie en conversie-elementen — afgestemd op jouw assortiment en groei.',
        feat3Title: 'SEO in het fundament',
        feat3Text:
            'Structuur, interne links en performance worden onderdeel van het ontwerp, niet een lapmiddel achteraf.',
        feat4Title: 'Moderne deployment',
        feat4Text:
            'Heldere hosting- en releaseworkflows — onder andere Next.js en Vercel waar dat bij jouw site past.',
        feat5Title: 'Praktische slimme workflows',
        feat5Text:
            'Waar tooling repetitief werk kan ondersteunen, bouwen we dat gericht in — mét review door jouw team.',
        approachLabel: 'Hoe wij werken',
        approachTitle: 'Menselijk geleid. Slimme tooling waar het helpt.',
        step1Title: 'Intake & scherp ritme',
        step1Text:
            'We starten met jouw doelen, funnel en constraints — geen voorgeschreven pakket. Scope en mijlpalen leggen we vast voordat we bouwen.',
        step2Title: 'Ontwerp & stack-keuze',
        step2Text:
            'Design en techniek kiezen we passend bij vindbaarheid, onderhoud en groei — inclusief SEO-architectuur en performancebudget.',
        step3Title: 'Bouwen met controle',
        step3Text:
            'Ontwikkeling met previews en kwaliteitschecks. Waar workflows repetitief werk eerlijk reduceren, zetten we tooling gericht in — altijd met review waar nodig.',
        step4Title: 'Live, meten, bijsturen',
        step4Text:
            'Na launch volgen monitoring en gerichte verbeteringen: conversie, snelheid of automation — evidence-based, niet op gevoel.',
        credHeading: 'Werken met ABshops',
        cred1Title: 'Heldere scope en mijlpalen',
        cred1Text:
            'Je weet vooraf wat er geleverd wordt, waar feedbackmomenten zitten en wat livegang inhoudt — inclusief een korte overlap voor nazorg.',
        cred2Title: 'EU-first en privacybewust',
        cred2Text:
            'We kiezen configuraties en verwerkers die passen bij jouw risico — met name bij mail, analytics en workflows die klantdata raken.',
        cred3Title: 'Rechtstreeks met mensen die bouwen',
        cred3Text:
            'Geen eindeloze accountlagen: je spreekt met het team dat je traject uitvoert, van eerste gesprek tot doorlopende optimalisatie.',
        ctaTitle: 'Klaar om te starten?',
        ctaLead:
            'Vertel kort over je merk en je doelen — we plannen graag een vrijblijvend gesprek.',
        ctaBtn: 'Naar contact',
        featuresLabel: 'Waarom ABshops',
        trustLabel: 'Vanuit Rotterdam, voor ondernemers in Nederland',
        trustBody:
            'ABshops is een digitale commerce studio gericht op websites, Shopify-webshops, SEO en digitale bedrijfsinrichting. Geen brede full-service belofte — wel samenhang tussen het kanaal waar klanten je vinden en de techniek die dagelijks moet werken.',
        trustCta: 'Vraag een vrijblijvende intake aan',
        insightsTeaserEyebrow: 'Insights',
        insightsTeaserTitle: 'Praktische kennis voor digitale groei',
        insightsTeaserLead:
            'Korte, bedrijfsgerichte notities over AI-workflows, Shopify, websites en automatisering — geschreven vanuit het werk van een digitale commerce studio, geen technieuws-feed.',
        insightsTeaserLi1: 'AI & automatisering die je team echt tijd bespaart',
        insightsTeaserLi2: 'Ecommerce, Shopify en conversiegerichte web',
        insightsTeaserLi3: 'Moderne infrastructuur (o.a. hosting, tooling, samenwerking)',
        insightsTeaserCta: 'Naar Insights'
    };

    DICT.en.index = {
        metaTitle: 'ABshops | Websites, Shopify & digital workflows — Rotterdam',
        metaDesc:
            'ABshops from Rotterdam: modern websites, Shopify stores, SEO and workflows with careful tooling for teams that want to grow online.',
        ogTitle: 'ABshops — Digital commerce studio Rotterdam',
        ogDesc:
            'Websites, Shopify and ecommerce, SEO and practical digital setup — human-led, engineered well.',
        heroEyebrow: 'Digital commerce studio · Rotterdam',
        heroImgAlt:
            'Premium AI-assisted ecommerce workspace by ABshops for websites, Shopify and digital automation',
        heroTitle: 'Websites, Shopify stores<br> and pragmatic AI workflows.',
        heroSubtitle:
            'Web, Shopify and automation with careful tooling — human-led, engineered well. Rotterdam · across the Netherlands.',
        ctaPrimary: 'Schedule a no-obligation call',
        workflowEyebrow: 'HOW WE WORK',
        workflowLead: 'From strategy and development to AI automation and growth.',
        workflowImgAlt:
            'ABshops workflow infographic: strategy, web development, AI automation and digital growth',
        sectionExpertise: 'Four clear pillars',
        svc1Title: 'Websites & platforms',
        svc1Text:
            'Modern web design and fast responsive sites — SEO-friendly structure and Next.js / Vercel when it fits your project.',
        svc2Title: 'Shopify & ecommerce',
        svc2Text:
            'Shopify setup, sharp catalogs and navigation, conversion improvements and clearer affiliate or omnichannel workflows.',
        svc3Title: 'Automation & workflows',
        svc3Text:
            'Practical workflows with supporting automation — from content to operations — always with human guardrails.',
        svc4Title: 'Digital business infrastructure',
        svc4Text:
            'Google Workspace and team email, domains and DNS, hosting and deployment — the baseline so your site and shop stay reliable.',
        feat1Title: 'Ecommerce experience',
        feat1Text:
            'From checkout behaviour to catalog logic: we build stores to sell, not just to go live.',
        feat2Title: 'Shopify depth',
        feat2Text:
            'Themes, collections, navigation and conversion patterns — aligned with your assortment and roadmap.',
        feat3Title: 'SEO in the foundation',
        feat3Text:
            'Structure, internal linking and performance are designed in — not patched on later.',
        feat4Title: 'Modern deployment',
        feat4Text:
            'Clear hosting and release workflows — including Next.js and Vercel when it fits.',
        feat5Title: 'Practical smart workflows',
        feat5Text:
            'Where tooling can honestly reduce repetitive work, we wire it in — with review by your team.',
        approachLabel: 'How we work',
        approachTitle: 'Human-led. Tooling where it helps.',
        step1Title: 'Intake & clear rhythm',
        step1Text:
            'We begin with goals, funnel and constraints — no prefab package. Scope and milestones are set before build.',
        step2Title: 'Design & stack choices',
        step2Text:
            'Design and engineering choices match discoverability, maintenance and growth — including SEO architecture and performance budgets.',
        step3Title: 'Build with control',
        step3Text:
            'Development with previews and quality checks. Where workflows reduce repetitive work, we introduce tooling deliberately — with review where it matters.',
        step4Title: 'Launch, measure, iterate',
        step4Text:
            'After go-live we monitor and improve conversion, speed or automation — evidence-led.',
        credHeading: 'Working with ABshops',
        cred1Title: 'Clear scope and milestones',
        cred1Text:
            'You know what ships when, where feedback fits and what launch includes — plus a short overlap for handover.',
        cred2Title: 'EU-first and privacy-aware',
        cred2Text:
            'We choose configurations and processors that fit your risk profile — especially for mail, analytics and workflows touching customer data.',
        cred3Title: 'Directly with people who build',
        cred3Text:
            'No endless account maze: you speak with the team delivering the work, from first call through optimization.',
        ctaTitle: 'Ready to start?',
        ctaLead:
            'Tell us briefly about your brand and goals — we would love to schedule a no-obligation call.',
        ctaBtn: 'Contact',
        featuresLabel: 'Why ABshops',
        trustLabel: 'From Rotterdam, for Dutch founders',
        trustBody:
            'ABshops is a digital commerce studio focused on websites, Shopify, SEO and digital infrastructure — not a vague full-service promise. We connect how customers find you with the systems that must run every day.',
        trustCta: 'Request a no-obligation intake',
        insightsTeaserEyebrow: 'Insights',
        insightsTeaserTitle: 'Practical notes on digital growth',
        insightsTeaserLead:
            'Short, business-focused writing on AI workflows, Shopify, websites and automation — from the perspective of a digital commerce studio, not a tech news feed.',
        insightsTeaserLi1: 'AI & automation that saves your team real time',
        insightsTeaserLi2: 'Ecommerce, Shopify and conversion-focused web',
        insightsTeaserLi3: 'Modern infrastructure (hosting, tooling, collaboration)',
        insightsTeaserCta: 'Explore Insights'
    };

    /* ——— Contact ——— */
    DICT.nl.contact = {
        metaTitle: 'Contact ABshops Rotterdam | offerte website & Shopify',
        metaDesc:
            'Neem contact op met ABshops in Rotterdam: websites, Shopify-webshops, SEO, workflows en Google Workspace-instellingen. Mail info@abshops.nl.',
        ogTitle: 'Contact | ABshops Rotterdam',
        ogDesc: 'Weena 70 · info@abshops.nl · reactie op werkdagen meestal binnen één dag.',
        heroTitle: 'Laten we kennismaken',
        heroLead:
            'Vertel kort wat je wilt bereiken — nieuwe site, Shopify-shop, technische inrichting (Google Workspace, DNS) of een gerichte automatiserings-pilot. We lezen persoonlijk mee en plannen zo nodig een call om scope scherp te krijgen.',
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
        crossWebTitle: 'Websites & platforms',
        crossWebText: 'Webdesign, performance en SEO-vriendelijke structuur.',
        crossShopTitle: 'Shopify & ecommerce',
        crossShopText: 'Webshop inrichten, conversie en SEO voor shops.',
        crossAiTitle: 'Automatisering & workflows',
        crossAiText: 'Praktische workflows met menselijke regie.',
        crossInfraTitle: 'Digitale bedrijfsinrichting',
        crossInfraText: 'Google Workspace, domeinen, DNS en hosting.',
        infraTitle: 'Digitale bedrijfsinrichting',
        infraLead:
            'Naast sites en shops helpen we met de technische basis van je bedrijf — compact en zonder onnodige complexiteit:',
        infraLi1: 'Google Workspace: gebruikers, e-mail en basisinstellingen',
        infraLi2: 'Domeinen, DNS en verwijzing naar hosting of platforms',
        infraLi3: 'Hosting en deployment — onder andere voor statische sites en moderne frontends',
        infraLi4: 'Technische setup en checklist voor kleine teams die online serieus aan de slag willen',
        infraCtaPrefix: 'Wil je dit combineren met een site of shop?',
        infraCtaLink: 'Ga naar het formulier',
        bmTitle: 'Handelsnamen',
        bmText:
            'ABshops is de hoofdhandelsnaam voor digitale commerce-diensten en een bedrijfsonderdeel binnen de onderneming van Ard Breure. Breure Media is een aparte handelsnaam voor creatieve en media-uitgaven — buiten die context verschijnt die naam op deze site alleen subtiel in juridische teksten.',
        mailDirect: 'Mail direct',
        ctaCallTitle: 'Liever teruggebeld worden?',
        ctaCallLead: 'Geef in je mail twee tijdvakken die uitkomen — dan stemmen we af wat het beste past.',
        ctaCallBtn: 'Plan via e-mail'
    };

    DICT.en.contact = {
        metaTitle: 'Contact ABshops Rotterdam | website & Shopify quotes',
        metaDesc:
            'Contact ABshops in Rotterdam: websites, Shopify stores, SEO, workflows and Google Workspace setup. Email info@abshops.nl.',
        ogTitle: 'Contact | ABshops Rotterdam',
        ogDesc: 'Weena 70 · info@abshops.nl · we usually reply within one business day.',
        heroTitle: 'Let’s connect',
        heroLead:
            'Tell us briefly what you want to achieve — a new site, a Shopify project, technical setup (Google Workspace, DNS) or a focused automation pilot. We read every message and can schedule a call to align scope.',
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
        crossWebTitle: 'Websites & platforms',
        crossWebText: 'Design, engineering, performance and SEO foundations.',
        crossShopTitle: 'Shopify & ecommerce',
        crossShopText: 'Shop setup, conversion and ecommerce SEO.',
        crossAiTitle: 'Automation & workflows',
        crossAiText: 'Practical workflows with human oversight.',
        crossInfraTitle: 'Digital infrastructure',
        crossInfraText: 'Google Workspace, domains, DNS and hosting.',
        infraTitle: 'Digital business infrastructure',
        infraLead:
            'Beyond sites and shops we help with the technical baseline — lean and without needless complexity:',
        infraLi1: 'Google Workspace: users, email and baseline configuration',
        infraLi2: 'Domains, DNS and routing to hosting or platforms',
        infraLi3: 'Hosting and deployment — including static sites and modern frontends',
        infraLi4: 'Technical setup checklist for small teams going online seriously',
        infraCtaPrefix: 'Combine this with a site or shop?',
        infraCtaLink: 'Go to the form',
        bmTitle: 'Trade names',
        bmText:
            'ABshops is the primary trade name for digital commerce work and operates within Ard Breure’s business. Breure Media is a separate trade name for creative publishing — on this site it only appears subtly in legal copy.',
        mailDirect: 'Email us directly',
        ctaCallTitle: 'Prefer a callback?',
        ctaCallLead: 'Mention two time windows that work for you — we will align from there.',
        ctaCallBtn: 'Schedule via email'
    };

    /* ——— Websites page ——— */
    DICT.nl.websites = {
        metaTitle: 'Website laten maken Rotterdam | webdesign & SEO | ABshops',
        metaDesc:
            'Website laten maken en webdesign in Rotterdam door ABshops: snelle sites, SEO-vriendelijke structuur, Next.js/Vercel waar passend. Offerte op maat.',
        ogTitle: 'Webdesign & websites | ABshops Rotterdam',
        ogDesc:
            'Strak webdesign, performance en SEO als onderdeel van het traject — niet als los onderdeel.',
        heroTitle: 'Websites die vindbaar zijn én converteren',
        heroLead:
            'Van eerste schets tot livegang: ABshops bouwt moderne, responsieve sites voor ondernemers — met Rotterdam als thuisbasis en klanten door heel Nederland. Techniek en vindbaarheid horen bij elkaar.',
        heroCta: 'Vraag een gesprek aan',
        s1Title: 'Wat je krijgt',
        s1p1:
            'Geen generieke templates, maar een doorontworpen ervaring: heldere informatiearchitectuur, sterke typografie en rust in het ontwerp. Elk scherm wordt behandeld als onderdeel van een groter verhaal — zodat bezoekers snappen wie je bent en wat de volgende stap is.',
        s1p2:
            'We denken mee over contenthiërarchie, calls-to-action en microcopy, zodat je site niet alleen mooi is, maar ook richting geeft aan je funnel.',
        s2Title: 'Performance & techniek',
        s2p:
            'Snelheid is UX en SEO tegelijk. We optimaliseren assets, caching en kritieke rendering paths. Waar het past gebruiken we moderne stacks zoals Next.js op Vercel; waar eenvoud volstaat, houden we het bewust licht. Altijd: nette semantische markup, toegankelijkheid waar het kan, en een codebase die onderhoudbaar blijft.',
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
        crossShopTitle: 'Shopify & ecommerce',
        crossShopText: 'E-commerce met focus op conversie en schaalbare catalogi.',
        crossAiTitle: 'Automatisering & workflows',
        crossAiText: 'Praktische workflows naast je website.',
        crossInsightsTitle: 'Insights',
        crossInsightsText: 'Webdevelopment, performance en SEO vanuit de praktijk.',
        crossInfraTitle: 'Digitale bedrijfsinrichting',
        crossInfraText: 'Google Workspace, domeinen, DNS en hosting.',
        crossInsightsTitle: 'Insights',
        crossInsightsText: 'Praktische artikelen over web, SEO en moderne workflows.',
        crossContact: 'Vragen over planning, scope of samenwerking?',
        leadTitle: 'Plan je aanvraag — website',
        leadIntro:
            'Vul dit multi-stappen formulier in. Je gegevens worden alleen gebruikt om je aanvraag te beoordelen en persoonlijk contact op te nemen — conform je toestemming in de laatste stap.',
        ctaTitle: 'Plan een introductie',
        ctaLead: 'We bespreken graag je merk, doelgroep en technische wensen — vrijblijvend.',
        ctaBtn: 'Start je aanvraag',
        contactHeroAside: 'Liever eerst even sparren via mail?',
        contactHeroLink: 'Neem contact op'
    };

    DICT.en.websites = {
        metaTitle: 'Websites built for discovery | ABshops Rotterdam',
        metaDesc:
            'Website design and development by ABshops in Rotterdam: fast builds, SEO-minded structure, Next.js/Vercel when it fits.',
        ogTitle: 'Web design & websites | ABshops Rotterdam',
        ogDesc: 'Calm design, performance and SEO woven into the project.',
        heroTitle: 'Websites built to be found — and to convert',
        heroLead:
            'From first sketch to launch: ABshops builds modern responsive sites with Rotterdam as home base and clients across the Netherlands. Discoverability and engineering belong together.',
        heroCta: 'Request a conversation',
        s1Title: 'What you get',
        s1p1:
            'No generic templates — a crafted experience: clear information architecture, strong typography and calm design. Every screen is part of a bigger story so visitors understand who you are and what to do next.',
        s1p2:
            'We help shape hierarchy, calls-to-action and microcopy so your site is not only beautiful but actively guides your funnel.',
        s2Title: 'Performance & engineering',
        s2p:
            'Speed is UX and SEO together. We optimize assets, caching and critical rendering paths. Where it fits we use modern stacks such as Next.js on Vercel; where simplicity wins we keep things deliberately light. Always: semantic markup, accessibility where it matters and maintainable code.',
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
        crossShopTitle: 'Shopify & ecommerce',
        crossShopText: 'E-commerce focused on conversion and scalable catalogs.',
        crossAiTitle: 'Automation & workflows',
        crossAiText: 'Practical workflows alongside your website.',
        crossInsightsTitle: 'Insights',
        crossInsightsText: 'Web development, performance and SEO from the field.',
        crossInfraTitle: 'Digital infrastructure',
        crossInfraText: 'Google Workspace, domains, DNS and hosting.',
        crossInsightsTitle: 'Insights',
        crossInsightsText: 'Practical articles on web, SEO and modern workflows.',
        crossContact: 'Questions about scope, timing or collaboration?',
        leadTitle: 'Submit your request — website',
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
        metaTitle: 'Shopify specialist & webshop laten maken | ABshops Rotterdam',
        metaDesc:
            'Webshop laten maken op Shopify door ABshops: inrichting, collections, navigatie, conversie en SEO voor ecommerce. Rotterdam · heel Nederland.',
        ogTitle: 'Shopify webshops | ABshops',
        ogDesc:
            'Shopify specialist voor ondernemers: scherp ingerichte shops met focus op verkopen — niet op overbodige plugins.',
        heroTitle: 'Shopify-webshops met scherpe conversie',
        heroLead:
            'Als Shopify specialist helpt ABshops met webshops die klanten begrijpen: snelle UX, duidelijke navigatie en een checkout die vertrouwen uitstraalt — inclusief SEO voor categorieën en producten.',
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
        crossWebTitle: 'Websites & platforms',
        crossWebText: 'SEO-vriendelijke sites en campagnepagina’s naast je shop.',
        crossAiTitle: 'Automatisering & workflows',
        crossAiText: 'Supportflows en automatisering rondom orders.',
        crossInsightsTitle: 'Insights',
        crossInsightsText: 'Shopify, ecommerce SEO en digitale groei — praktisch uitgelegd.',
        crossContact: 'Vragen over groei, integraties of doorlooptijd?',
        leadTitle: 'Plan je aanvraag — Shopify-webshop',
        leadIntro:
            'Vertel ons over je assortiment, verkeer en ambities. We volgen hetzelfde professionele intake-proces als bij onze website-projecten, afgestemd op e-commerce.',
        ctaTitle: 'Jouw volgende groeistap',
        ctaLead: 'Vertel ons over je assortiment, kanalen en ambitie — we denken met je mee.',
        ctaBtn: 'Start je aanvraag',
        contactHeroAside: 'Liever eerst even sparren via mail?',
        contactHeroLink: 'Neem contact op'
    };

    DICT.en.webshops = {
        metaTitle: 'Shopify stores built to sell | ABshops Rotterdam',
        metaDesc:
            'Shopify ecommerce by ABshops: setup, collections, navigation, conversion and ecommerce SEO — Rotterdam and the Netherlands.',
        ogTitle: 'Shopify ecommerce | ABshops',
        ogDesc: 'Lean Shopify builds focused on selling — not plugin clutter.',
        heroTitle: 'Shopify stores shaped for conversion',
        heroLead:
            'ABshops helps founders launch and refine Shopify stores shoppers understand: fast UX, clear navigation and a trustworthy checkout — plus SEO for categories and products.',
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
        crossWebTitle: 'Websites & platforms',
        crossWebText: 'SEO-minded sites and landing pages alongside your shop.',
        crossAiTitle: 'Automation & workflows',
        crossAiText: 'Support flows and automation around orders.',
        crossInsightsTitle: 'Insights',
        crossInsightsText: 'Shopify, ecommerce SEO and digital growth — explained practically.',
        crossContact: 'Questions about growth, integrations or lead time?',
        leadTitle: 'Submit your request — Shopify store',
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
        metaTitle: 'Automatisering voor bedrijven | ABshops — workflows & agents',
        metaDesc:
            'Praktische automatisering en workflows voor bedrijven: ondersteuning bij agents, content en operations — menselijk geleid, privacybewust. Rotterdam.',
        ogTitle: 'Automatisering & workflows | ABshops',
        ogDesc:
            'Minder handwerk waar het veilig kan, mét controle en eigenaarschap bij jouw team.',
        heroTitle: 'Workflows die het werk dragelijker maken',
        heroLead:
            'ABshops ontwerpt en bouwt praktische automatisering die past bij je processen — van support tot content. Waar modellen of agents helpen, zetten we ze gericht in; waar mensen moeten oordelen, houden we review vast.',
        heroCta: 'Bespreek een concrete pilot',
        s1Title: 'Waar automatisering het verschil maakt',
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
            'Gegevens blijven bij jou waar dat hoort: we kijken naar retention, toegang en logging. Waar cloudmodellen nodig zijn, kiezen we configuraties die passen bij jouw risicoprofiel — en waar mogelijk combineren we met on-prem of EU-regio’s.',
        s3p2:
            'Je behoudt eigenaarschap over prompts, workflows en output — geen black box zonder overdracht.',
        s4Title: 'Implementatie die volgt',
        s4p:
            'Pilot → evalueren → uitbreiden. We meten wat telt: doorlooptijd, foutpercentages, tevredenheid en kosten per interactie. Zo wordt automatisering onderdeel van je bedrijfsvoering, geen eenmalige demo.',
        crossTitle: 'Combinatie met web en shop',
        crossWebTitle: 'Websites & platforms',
        crossWebText:
            'Publieke sites en landingspagina’s waar interne workflows naadloos op aansluiten.',
        crossShopTitle: 'Shopify & ecommerce',
        crossShopText:
            'Shop-UX, zoekfuncties en flows ná de koop — daar waar ondersteuning het verschil maakt.',
        crossInsightsTitle: 'Insights',
        crossInsightsText: 'AI-workflows, agents en automatisering voor teams — geen hype.',
        crossContact: 'Twijfel je tussen pilot, security of EU-data?',
        leadTitle: 'Plan je aanvraag — automatisering & workflows',
        leadIntro:
            'Beschrijf kort je proces, volumes en risico’s. We gebruiken dezelfde intake-flow om snel te bepalen of een pilot zinvol is — transparant en zonder marketingdruk.',
        ctaTitle: 'Ontdek wat haalbaar is',
        ctaLead: 'In een kort traject brengen we samen kansen en randvoorwaarden in kaart.',
        ctaBtn: 'Start je aanvraag',
        contactHeroAside: 'Liever eerst even sparren via mail?',
        contactHeroLink: 'Neem contact op'
    };

    DICT.en.ai = {
        metaTitle: 'Business automation | ABshops — workflows & agents',
        metaDesc:
            'Practical automation and workflows for teams: agents, content and operations — human-led and privacy-aware. Rotterdam.',
        ogTitle: 'Automation & workflows | ABshops',
        ogDesc: 'Less manual work where it is safe — with control and ownership on your side.',
        heroTitle: 'Workflows that make operations lighter',
        heroLead:
            'ABshops designs practical automation that fits your processes — from support to content. Where models or agents help we introduce them deliberately; where humans must judge we keep review in place.',
        heroCta: 'Discuss a focused pilot',
        s1Title: 'Where automation earns its place',
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
            'Pilot → evaluate → expand. We measure what matters: cycle time, error rates, satisfaction and cost per interaction — so automation becomes operations, not a one-off demo.',
        crossTitle: 'Combined with web and shop',
        crossWebTitle: 'Websites & platforms',
        crossWebText: 'Public sites and landing pages aligned with internal workflows.',
        crossShopTitle: 'Shopify & ecommerce',
        crossShopText: 'Shop UX, search and post-purchase flows — where support matters.',
        crossInsightsTitle: 'Insights',
        crossInsightsText: 'AI workflows, agents and automation for teams — no hype.',
        crossContact: 'Unsure about pilots, security or EU data residency?',
        leadTitle: 'Submit your request — automation & workflows',
        leadIntro:
            'Briefly describe process, volumes and risks. We use the same intake flow to see quickly whether a pilot makes sense — transparent and without hype.',
        ctaTitle: 'Discover what is feasible',
        ctaLead: 'In a short trajectory we map opportunities and constraints together.',
        ctaBtn: 'Start your request',
        contactHeroAside: 'Prefer to align by email first?',
        contactHeroLink: 'Contact'
    };

    /* ——— Insights hub ——— */
    DICT.nl.insights = {
        metaTitle: 'Insights | ABshops — AI, Shopify, websites & digitale groei',
        metaDesc:
            'Praktische insights voor ondernemers: AI-workflows, Shopify & ecommerce, webdevelopment en automatisering — geschreven door ABshops, digitale commerce studio Rotterdam.',
        ogTitle: 'Insights | ABshops',
        ogDesc:
            'Expertkennis voor digitale groei: AI voor bedrijven, Shopify, websites en automation — geen technieuws.',
        breadcrumbHome: 'Home',
        breadcrumbCurrent: 'Insights',
        heroTitle: 'Insights voor digitale commerce en slimme workflows',
        heroLead:
            'Korte, werkbare notities over AI voor teams, Shopify en ecommerce, moderne websites en automation — geschreven vanuit projectpraktijk. Gericht op Nederlandse ondernemers en MKB-teams die web en shop serieus inzetten.',
        topicsLabel: 'Thema’s',
        topicAiTitle: 'AI & automatisering',
        topicAiDesc:
            'Workflows, agents en tooling — met menselijke regie, privacybewust en geschikt voor echte operatie.',
        topicShopifyTitle: 'Shopify & ecommerce',
        topicShopifyDesc:
            'Catalogi, conversie, SEO en operationele workflows rond je shop.',
        topicWebTitle: 'Webdevelopment',
        topicWebDesc:
            'Performance, SEO-architectuur, moderne hosting en samenwerking in development.',
        scopeTitle: 'Waar we schrijfvoer voor verzamelen',
        scopeIntro:
            'Deze sectie groeit met artikelen die aansluiten op hoe ABshops werkt. Typische onderwerpen:',
        scopeLi1: 'AI-workflows en agents voor support, content en operations',
        scopeLi2: 'Shopify-automation en schaalbare ecommerce-processen',
        scopeLi3: 'Cursor en andere AI-development tooling waar het veilig kan',
        scopeLi4: 'Ecommerce SEO, interne links en product-/categorystructuur',
        scopeLi5: 'Google Workspace, Vercel en infrastructuurkeuzes voor kleine teams',
        bridgeTitle: 'Liever direct sparren?',
        bridgeLead:
            'Insights zijn geen vervanging voor een intake — ze helpen wel om taal en verwachtingen scherp te krijgen voordat je een traject start.',
        bridgeCta: 'Neem contact op',
        crossSvcTitle: 'Gerelateerde diensten',
        crossWebTitle: 'Websites',
        crossWebText: 'Webdesign, SEO en performance.',
        crossShopTitle: 'Webshops',
        crossShopText: 'Shopify-specialist voor groeiende shops.',
        crossAiTitle: 'Automatisering',
        crossAiText: 'Workflows en pilots met duidelijke grenzen.'
    };

    DICT.en.insights = {
        metaTitle: 'Insights | ABshops — AI, Shopify, websites & digital growth',
        metaDesc:
            'Practical insights for founders: AI workflows, Shopify & ecommerce, web development and automation — by ABshops, digital commerce studio Rotterdam.',
        ogTitle: 'Insights | ABshops',
        ogDesc:
            'Expert notes on digital growth: business AI, Shopify, websites and automation — not tech headlines.',
        breadcrumbHome: 'Home',
        breadcrumbCurrent: 'Insights',
        heroTitle: 'Insights for digital commerce and pragmatic workflows',
        heroLead:
            'Short, actionable notes on AI for teams, Shopify and ecommerce, modern websites and automation — grounded in delivery work. Written for Dutch SMBs and founders who rely on web and shop day to day.',
        topicsLabel: 'Topics',
        topicAiTitle: 'AI & automation',
        topicAiDesc:
            'Workflows, agents and tooling — human-led, privacy-aware and fit for real operations.',
        topicShopifyTitle: 'Shopify & ecommerce',
        topicShopifyDesc:
            'Catalogs, conversion, SEO and operational workflows around your store.',
        topicWebTitle: 'Web development',
        topicWebDesc:
            'Performance, SEO architecture, modern hosting and engineering collaboration.',
        scopeTitle: 'What we publish toward',
        scopeIntro:
            'This hub grows with articles aligned to how ABshops delivers work. Typical angles:',
        scopeLi1: 'AI workflows and agents for support, content and operations',
        scopeLi2: 'Shopify automation and scalable ecommerce processes',
        scopeLi3: 'Cursor and other AI dev tooling where it is safe and justified',
        scopeLi4: 'Ecommerce SEO, internal linking and product/category structure',
        scopeLi5: 'Google Workspace, Vercel and infrastructure choices for small teams',
        bridgeTitle: 'Prefer a conversation?',
        bridgeLead:
            'Insights do not replace an intake — they help align language and expectations before you start a project.',
        bridgeCta: 'Contact',
        crossSvcTitle: 'Related services',
        crossWebTitle: 'Websites',
        crossWebText: 'Web design, SEO and performance.',
        crossShopTitle: 'Webshops',
        crossShopText: 'Shopify expertise for growing stores.',
        crossAiTitle: 'Automation',
        crossAiText: 'Workflows and pilots with clear guardrails.'
    };

    /* ——— Insights: AI & automation ——— */
    DICT.nl.insightsAi = {
        metaTitle: 'AI & automatisering voor bedrijven | Insights ABshops',
        metaDesc:
            'Praktische AI-workflows, agents en automatisering voor MKB — menselijk geleid, gericht op Shopify, websites en operations. Geen AI-nieuws.',
        ogTitle: 'AI & automatisering | Insights ABshops',
        ogDesc:
            'Hoe teams AI en workflows praktisch inzetten — met regie, kwaliteit en privacy.',
        breadcrumbHub: 'Insights',
        breadcrumbCurrent: 'AI & automatisering',
        heroTitle: 'AI & automatisering voor teams die moeten leveren',
        heroLead:
            'Geen futuristische praat — wel patronen die we zien in echte trajecten: sneller itereren met review, standaardiseren van repetitief werk en agents alleen daar waar het proces dat dragelijk maakt.',
        s1Title: 'Waar AI het meeste waarde geeft',
        s1p:
            'Sterke use cases zijn vaak ondersteunend: conceptteksten die een mens finisht, tickets bundelen voor je servicedesk, interne Q&amp;A over je productdata of bulk-varianten van SEO-blauwdrukken controleren. Het verschil zit in grenzen: wat mag nooit zonder check, en waar mag het systeem voorstellen?',
        s2Title: 'Agents en tooling in de praktijk',
        s2p:
            'Van Cursor tot geïntegreerde LLM’s: tooling kiezen we op risico, retention van data en hoe makkelijk jouw team eigenaar blijft. EU-first en transparante logging zijn geen detail — vooral als klantdata of orderinformatie in de buurt komt.',
        s3Title: 'Samenhang met ecommerce en web',
        s3p:
            'Automation voor een Shopify-shop gaat vaak over content, klantvragen en Operations ná de koop. Websites profiteren van dezelfde discipline: minder handwerk in structuur en metadata, meer tijd voor inhoud die concurrentie aankan.',
        hubLink: 'Alle Insights',
        svcLink: 'Automatisering & workflows — diensten'
    };

    DICT.en.insightsAi = {
        metaTitle: 'AI & automation for businesses | ABshops Insights',
        metaDesc:
            'Practical AI workflows, agents and automation for SMBs — human-led, focused on Shopify, websites and operations. Not AI hype headlines.',
        ogTitle: 'AI & automation | ABshops Insights',
        ogDesc:
            'How teams adopt AI and workflows with ownership, quality and privacy.',
        breadcrumbHub: 'Insights',
        breadcrumbCurrent: 'AI & automation',
        heroTitle: 'AI & automation for teams that ship',
        heroLead:
            'No futurist keynote — patterns we see in delivery: faster iteration with review, standardizing repetitive work and agents only where the process can absorb it.',
        s1Title: 'Where AI earns its keep',
        s1p:
            'Strong use cases are usually supportive: draft copy a human finishes, triage for support, internal Q&amp;A over product data or reviewing SEO brief variants at scale. The difference is guardrails: what must never ship without a check, and where may the system propose?',
        s2Title: 'Agents and tooling in practice',
        s2p:
            'From Cursor to integrated LLMs: we choose tooling based on risk, data retention and whether your team keeps ownership. EU-first posture and clear logging matter — especially near customer or order data.',
        s3Title: 'How this connects to ecommerce and web',
        s3p:
            'Automation around Shopify often targets content, customer questions and post-purchase ops. Websites benefit from the same discipline: less manual structure and metadata work, more time for content that competes.',
        hubLink: 'All Insights',
        svcLink: 'Automation & workflows — services'
    };

    /* ——— Insights: Shopify & ecommerce ——— */
    DICT.nl.insightsShopify = {
        metaTitle: 'Shopify & ecommerce insights | ABshops',
        metaDesc:
            'Shopify, conversie en ecommerce SEO — praktische insights voor ondernemers die willen groeien met een schaalbare shop.',
        ogTitle: 'Shopify & ecommerce | Insights ABshops',
        ogDesc:
            'Thema’s rond catalogi, checkout, SEO en automation voor webshops.',
        breadcrumbHub: 'Insights',
        breadcrumbCurrent: 'Shopify & ecommerce',
        heroTitle: 'Shopify & ecommerce — schaalbaar verkopen',
        heroLead:
            'Artikelen hier focussen op wat je shop dagelijks beter maakt: navigatie en collections, checkout-rust, SEO voor categorieën en koppelingen met fulfillment — niet op gadget-plugins.',
        s1Title: 'Conversie en catalogilogica',
        s1p:
            'Het grootste werk zit vaak in heldere hiërarchie: welke collecties leiden waar, hoe varianten en filters samenwerken en waar je intern linkt vanuit content. Dat is het verschil tussen een shop die “live staat” en een shop die verkocht onder druk.',
        s2Title: 'Ecommerce SEO als systeem',
        s2p:
            'Technische basis, interne links en unieke waarde per pagina — vooral bij concurrentische niches. We schrijven over hoe je structuren bouwt die nog werken als je assortiment groeit.',
        s3Title: 'Automation naast je storefront',
        s3p:
            'Van orderflows tot contentupdates: waar repetitief werk eerlijk kan worden ondersteund (met review), frees je tijd voor merchandising en campagnes.',
        hubLink: 'Alle Insights',
        svcLink: 'Webshops — diensten'
    };

    DICT.en.insightsShopify = {
        metaTitle: 'Shopify & ecommerce insights | ABshops',
        metaDesc:
            'Shopify, conversion and ecommerce SEO — practical insights for founders scaling a serious store.',
        ogTitle: 'Shopify & ecommerce | ABshops Insights',
        ogDesc:
            'Catalogs, checkout, SEO and automation around ecommerce.',
        breadcrumbHub: 'Insights',
        breadcrumbCurrent: 'Shopify & ecommerce',
        heroTitle: 'Shopify & ecommerce — scalable selling',
        heroLead:
            'Notes focus on what improves your store day to day: navigation and collections, calm checkout, category SEO and fulfillment-aware workflows — not gadget plugins.',
        s1Title: 'Conversion and catalog logic',
        s1p:
            'Most leverage comes from clear hierarchy: how collections route shoppers, how variants and filters cooperate and where content internally links into the catalog. That split separates “live” stores from stores that sell under pressure.',
        s2Title: 'Ecommerce SEO as a system',
        s2p:
            'Technical foundations, internal linking and unique value per URL — especially in competitive niches. We write about structures that survive assortment growth.',
        s3Title: 'Automation beside your storefront',
        s3p:
            'From order flows to content updates: where repetitive work can be honestly supported (with review), you recover time for merchandising and campaigns.',
        hubLink: 'All Insights',
        svcLink: 'Webshops — services'
    };

    /* ——— Insights: Webdevelopment ——— */
    DICT.nl.insightsWeb = {
        metaTitle: 'Webdevelopment insights | ABshops — performance & SEO',
        metaDesc:
            'Moderne websites: performance, SEO, Vercel/Next.js en samenwerking — praktische webdevelopment-insights van ABshops Rotterdam.',
        ogTitle: 'Webdevelopment | Insights ABshops',
        ogDesc:
            'Techniek en vindbaarheid die bij elkaar horen — geschreven voor ondernemers en teams.',
        breadcrumbHub: 'Insights',
        breadcrumbCurrent: 'Webdevelopment',
        heroTitle: 'Webdevelopment dat vindbaarheid en snelheid vasthoudt',
        heroLead:
            'Van semantische structuur tot deployment: onderwerpen die passen bij premium sites en landingpages — inclusief tooling zoals Vercel waar dat klopt voor jouw risico en onderhoud.',
        s1Title: 'Performance is onderdeel van SEO en UX',
        s1p:
            'Core Web Vitals, asset-strategie en caching zijn geen “laatste stap”. We delen hoe je budgets vastlegt en hoe je voorkomt dat marketing en tech langs elkaar heen werken.',
        s2Title: 'Samenwerken met AI-development tooling',
        s2p:
            'Tools zoals Cursor kunnen prototyping en refactors versnellen — mits je review, tests en security niet uit het oog verliest. Insights hier beschrijven werkpatronen, geen tool-hype.',
        s3Title: 'Infrastructuur voor kleine teams',
        s3p:
            'Google Workspace, domeinen, DNS en hosting: keuzes die je site betrouwbaar houden terwijl je door groeit.',
        hubLink: 'Alle Insights',
        svcLink: 'Websites — diensten'
    };

    DICT.en.insightsWeb = {
        metaTitle: 'Web development insights | ABshops — performance & SEO',
        metaDesc:
            'Modern websites: performance, SEO, Vercel/Next.js and collaboration — practical notes from ABshops Rotterdam.',
        ogTitle: 'Web development | ABshops Insights',
        ogDesc:
            'Engineering and discoverability that belong together — for founders and teams.',
        breadcrumbHub: 'Insights',
        breadcrumbCurrent: 'Web development',
        heroTitle: 'Web development that keeps discoverability and speed',
        heroLead:
            'From semantic structure to deployment: topics aligned with premium sites and landing pages — including tooling such as Vercel when it fits your maintenance model.',
        s1Title: 'Performance is SEO and UX together',
        s1p:
            'Core Web Vitals, asset strategy and caching are not a “final polish”. We share how to set budgets and avoid marketing and engineering drifting apart.',
        s2Title: 'Working with AI-assisted development',
        s2p:
            'Tools like Cursor can speed prototyping and refactors — if review, tests and security stay non-negotiable. These notes describe workflows, not gadget hype.',
        s3Title: 'Infrastructure for small teams',
        s3p:
            'Google Workspace, domains, DNS and hosting: choices that keep your site reliable as you grow.',
        hubLink: 'All Insights',
        svcLink: 'Websites — services'
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
        var rawPath = window.location.pathname || '';
        var path = rawPath.replace(/\\/g, '/');
        var segs = path.split('/').filter(function (s) {
            return s.length > 0;
        });
        var ix = segs.indexOf('insights');
        if (ix !== -1) {
            var sub = segs[ix + 1];
            if (!sub || sub === 'index.html') return 'insights';
            if (sub === 'ai-automation') return 'insightsAi';
            if (sub === 'shopify-ecommerce') return 'insightsShopify';
            if (sub === 'webdevelopment') return 'insightsWeb';
            return 'insights';
        }
        var pathTail = segs.length ? segs[segs.length - 1] : '';
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
        return map[pathTail] || 'index';
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

            var suppressText = el.getAttribute('data-i18n-suppress-text') === 'true';
            if (!suppressText) {
                var useHtml = el.getAttribute('data-i18n-html') === 'true';
                if (useHtml) el.innerHTML = val;
                else el.textContent = val;
            }

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
                    var nameKey =
                        code === 'en'
                            ? 'lang.labelEn'
                            : code === 'nl'
                              ? 'lang.labelNl'
                              : null;
                    if (nameKey) {
                        if (btn.querySelector('[data-i18n]')) {
                            btn.removeAttribute('aria-label');
                        } else {
                            var aria = t(active, nameKey);
                            if (!aria && active !== DEFAULT_LANG) aria = t(DEFAULT_LANG, nameKey);
                            if (aria) btn.setAttribute('aria-label', aria);
                        }
                    }
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
