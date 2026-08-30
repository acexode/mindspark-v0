import type { Topic } from "../lib/content/schema";
import { makeTopic, SS_LEVELS, STANDARD_SEC_CURRICULA, type NewSubjectDraft } from "./lib/topic-builder";

/** Extra WAEC/NECO/JAMB topics to append to existing subject trees. */
export const EXISTING_SUBJECT_EXPANSIONS: Record<string, { description?: string; topics: Topic[] }> = {
  mathematics: {
    description:
      "Number, sets, algebra, commercial arithmetic, geometry, trigonometry, transformations, mensuration, longitude and latitude, statistics and probability for the Nigerian senior secondary curriculum, aligned to WAEC, NECO and JAMB.",
    topics: [
      makeTopic("sec.mathematics", "sets", "Sets", 11, "Set language, Venn diagrams and applications used throughout WAEC and JAMB quantitative reasoning.", ["JSS3", "SS1"], [
        { slug: "set-language", name: "Set Language", summary: "Elements, subsets, union, intersection, complement and the empty set.", objectives: ["Define a set and use roster and set-builder notation", "Identify subsets, the universal set and the empty set", "Find union, intersection and complement of sets"] },
        { slug: "venn-diagrams", name: "Venn Diagrams", summary: "Two- and three-set diagrams, and how regions map to set operations.", prerequisites: ["sec.mathematics.sets.set-language"], objectives: ["Draw and shade two-set and three-set Venn diagrams", "Translate worded survey data into a Venn diagram", "Read n(A ∪ B) and n(A ∩ B) from a completed diagram"] },
        { slug: "applications-of-sets", name: "Applications of Sets", summary: "Survey and word problems that WAEC sets on two and three overlapping groups.", prerequisites: ["sec.mathematics.sets.venn-diagrams"], objectives: ["Solve two-set word problems using n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", "Solve three-set problems by filling regions from the inside out", "Interpret 'only A' and 'neither' in exam wording"] },
      ]),
      makeTopic("sec.mathematics", "commercial-arithmetic", "Commercial Arithmetic", 12, "Percentages, profit and loss, interest and hire purchase — the money calculations on every WAEC paper.", ["SS1", "SS2"], [
        { slug: "percentages-and-profit", name: "Percentages, Profit and Loss", summary: "Percentage change, profit, loss, discount and VAT in market contexts.", objectives: ["Convert between percentages, fractions and decimals", "Calculate profit, loss and percentage profit or loss", "Find selling price after discount or VAT"] },
        { slug: "simple-and-compound-interest", name: "Simple and Compound Interest", summary: "I = PRT/100 and compound growth over successive years.", prerequisites: ["sec.mathematics.commercial-arithmetic.percentages-and-profit"], objectives: ["Calculate simple interest and the amount after a given time", "Calculate compound interest year by year or with A = P(1 + r/100)^n", "Compare simple and compound interest on the same principal"] },
        { slug: "hire-purchase", name: "Hire Purchase", summary: "Deposits, instalments and the extra cost of buying on hire purchase.", prerequisites: ["sec.mathematics.commercial-arithmetic.simple-and-compound-interest"], objectives: ["Find the hire-purchase price from deposit and instalments", "Calculate the extra cost compared with the cash price", "Solve exam problems involving a deposit and equal monthly payments"] },
      ]),
      makeTopic("sec.mathematics", "transformations", "Geometric Transformations", 13, "Reflection, rotation, translation and enlargement on the coordinate plane.", ["SS2"], [
        { slug: "reflection-and-rotation", name: "Reflection and Rotation", summary: "Images of points and shapes under reflection in the axes and rotation about the origin.", objectives: ["Reflect a point in the x-axis, y-axis and the line y = x", "Rotate a point 90° and 180° about the origin", "Describe a single transformation that maps one shape onto another"] },
        { slug: "translation-and-enlargement", name: "Translation and Enlargement", summary: "Column-vector translations and enlargements from a centre with a given scale factor.", prerequisites: ["sec.mathematics.transformations.reflection-and-rotation"], objectives: ["Translate a shape by a column vector", "Enlarge a shape from a centre with a positive or fractional scale factor", "Find a scale factor from corresponding lengths"] },
      ]),
      makeTopic("sec.mathematics", "earth-geometry", "Earth Geometry", 14, "Longitude, latitude and distances on the Earth's surface — a standing WAEC topic.", ["SS2", "SS3"], [
        { slug: "longitude-and-latitude", name: "Longitude and Latitude", summary: "Locating a place on the globe and reading parallels and meridians.", objectives: ["Define latitude, longitude, equator, Greenwich meridian and the poles", "State the coordinates of a place from a sketch of the globe", "Distinguish parallels of latitude from meridians of longitude"] },
        { slug: "distances-on-the-earth", name: "Distances on the Earth", summary: "Nautical-mile distances along a meridian or the equator, and time differences.", prerequisites: ["sec.mathematics.earth-geometry.longitude-and-latitude"], objectives: ["Calculate the distance between two places on the same meridian", "Calculate the distance between two places on the equator", "Relate 15° of longitude to one hour of time difference"] },
      ]),
    ],
  },

  english: {
    description:
      "Grammar, lexis and structure, comprehension, summary, essay writing, oral English and registers for the Nigerian senior secondary curriculum, aligned to WAEC, NECO and JAMB.",
    topics: [
      makeTopic("sec.english", "lexis-and-structure", "Lexis and Structure", 11, "The objective paper: nearest in meaning, opposite in meaning, sentence completion and error identification.", SS_LEVELS, [
        { slug: "nearest-and-opposite", name: "Nearest and Opposite in Meaning", summary: "Choosing the option closest to, or opposite in meaning to, a word in context.", objectives: ["Choose the option nearest in meaning to a word in a sentence", "Choose the option opposite in meaning to a word in a sentence", "Use context, not the isolated dictionary sense, to decide"] },
        { slug: "sentence-completion", name: "Sentence Completion", summary: "Filling gaps with the word or phrase that is grammatically and idiomatically correct.", prerequisites: ["sec.english.tenses-and-concord.subject-verb-concord"], objectives: ["Complete a sentence with the correct tense, preposition or conjunction", "Choose the idiomatically correct collocation", "Reject options that are grammatical but unidiomatic"] },
        { slug: "error-identification", name: "Error Identification", summary: "Spotting the underlined part that makes a sentence unacceptable.", prerequisites: ["sec.english.lexis-and-structure.sentence-completion"], objectives: ["Identify the error in an underlined sentence", "Name the common error types WAEC tests: concord, tense, article, preposition", "Correct the sentence once the error is found"] },
      ]),
      makeTopic("sec.english", "further-writing", "Further Writing", 12, "Reports, minutes and descriptive essays that sit beside letters and articles on Paper 1.", ["SS2", "SS3"], [
        { slug: "reports-and-minutes", name: "Reports and Minutes", summary: "School and club reports, and the formal record of a meeting.", objectives: ["State the features of a school or incident report", "Write minutes with attendance, matters arising and AOB", "Use formal, impersonal language in official writing"] },
        { slug: "descriptive-essays", name: "Descriptive Essays", summary: "Describing a person, place, object or event so a reader can see it.", objectives: ["Plan a descriptive essay around a clear dominant impression", "Use sensory detail and precise nouns rather than vague adjectives", "Avoid slipping into a narrative when the task is description"] },
      ]),
      makeTopic("sec.english", "further-oral", "Further Oral English", 13, "Rhyme, emphatic stress and weak forms — the remaining Oral English objectives.", ["SS2", "SS3"], [
        { slug: "rhyme-and-emphatic-stress", name: "Rhyme and Emphatic Stress", summary: "Words that rhyme, and shifting stress to change the meaning of a sentence.", objectives: ["Pick the option that rhymes with a given word", "Identify the syllable that carries emphatic stress", "Explain how emphatic stress changes the implied contrast"] },
        { slug: "weak-forms-and-linking", name: "Weak Forms and Linking", summary: "How function words reduce in connected speech.", prerequisites: ["sec.english.oral-english.word-stress"], objectives: ["Give the weak form of common function words (and, of, to, can)", "Explain why WAEC tests weak forms in connected speech", "Mark likely linking between a final consonant and a following vowel"] },
      ]),
    ],
  },

  physics: {
    description:
      "Measurement, motion, forces, energy, heat, fluids, waves, light, electricity, magnetism, circular motion, gravitation and modern physics for the Nigerian senior secondary curriculum, aligned to WAEC, NECO and JAMB.",
    topics: [
      makeTopic("sec.physics", "pressure-and-fluids", "Pressure and Fluids", 11, "Pressure in solids and liquids, atmospheric pressure, upthrust and Archimedes' principle.", ["SS1", "SS2"], [
        { slug: "pressure", name: "Pressure", summary: "P = F/A, liquid pressure ρgh, and everyday applications such as hydraulic presses.", objectives: ["Define pressure and state its SI unit", "Calculate pressure using P = F/A and liquid pressure P = ρgh", "Explain hydraulic machines using Pascal's principle"] },
        { slug: "upthrust-and-archimedes", name: "Upthrust and Archimedes", summary: "Why objects float or sink, and how to find relative density.", prerequisites: ["sec.physics.pressure-and-fluids.pressure"], objectives: ["State Archimedes' principle and the law of flotation", "Calculate upthrust as the weight of fluid displaced", "Find relative density from apparent loss of weight"] },
      ]),
      makeTopic("sec.physics", "circular-motion-and-gravitation", "Circular Motion and Gravitation", 12, "Motion in a circle, centripetal force, Newton's law of gravitation and satellites.", ["SS2", "SS3"], [
        { slug: "circular-motion", name: "Circular Motion", summary: "Angular speed, centripetal acceleration and the force that keeps a body in a circle.", objectives: ["Define angular speed and relate it to linear speed by v = ωr", "State that centripetal acceleration is v²/r towards the centre", "Solve problems on a vehicle rounding a level bend"] },
        { slug: "gravitation", name: "Gravitation", summary: "Newton's law of universal gravitation, g, and orbital motion.", prerequisites: ["sec.physics.circular-motion-and-gravitation.circular-motion"], objectives: ["State Newton's law of gravitation and write F = Gm₁m₂/r²", "Relate g to the mass and radius of the Earth", "Explain why a satellite stays in orbit"] },
      ]),
      makeTopic("sec.physics", "elasticity", "Elasticity", 13, "Hooke's law, elastic limit and the energy stored in a stretched spring.", ["SS2"], [
        { slug: "hookes-law", name: "Hooke's Law", summary: "Extension is proportional to load up to the elastic limit.", objectives: ["State Hooke's law and write F = ke", "Sketch a load-extension graph and mark the elastic limit", "Calculate the force constant of a spring"] },
        { slug: "elastic-energy", name: "Elastic Energy", summary: "Energy stored in a stretched spring and series/parallel combinations.", prerequisites: ["sec.physics.elasticity.hookes-law"], objectives: ["Calculate elastic potential energy as ½ke² or ½Fe", "Find the effective constant of two springs in series or parallel", "Interpret the area under a load-extension graph"] },
      ]),
    ],
  },

  biology: {
    description:
      "Cells, classification, nutrition, transport, respiration, excretion, support and movement, reproduction, genetics, ecology, coordination, health and evolution for the Nigerian senior secondary curriculum, aligned to WAEC, NECO and JAMB.",
    topics: [
      makeTopic("sec.biology", "support-and-movement", "Support and Movement", 12, "Skeletons, joints and muscles in mammals, and support in plants.", ["SS1", "SS2"], [
        { slug: "mammalian-skeleton", name: "The Mammalian Skeleton", summary: "Axial and appendicular skeleton, and the functions of bone.", objectives: ["Distinguish the axial skeleton from the appendicular skeleton", "Name the main bones of the skull, vertebral column, pectoral and pelvic girdles", "State the functions of the skeleton: support, protection, movement, blood-cell formation"] },
        { slug: "joints-and-muscles", name: "Joints and Muscles", summary: "Types of joints and how antagonistic muscles produce movement.", prerequisites: ["sec.biology.support-and-movement.mammalian-skeleton"], objectives: ["Classify joints as immovable, slightly movable or freely movable", "Describe a synovial joint and name its parts", "Explain movement at the elbow using biceps and triceps"] },
      ]),
      makeTopic("sec.biology", "health-and-disease", "Health and Disease", 13, "Pathogens, vectors, immunity and public-health measures on the WAEC syllabus.", ["SS2", "SS3"], [
        { slug: "pathogens-and-vectors", name: "Pathogens and Vectors", summary: "How bacteria, viruses, protozoa and fungi cause disease, and the animals that spread them.", objectives: ["Distinguish a pathogen from a vector", "Give the pathogen and vector of malaria, cholera and sleeping sickness", "Explain how each of those diseases can be controlled"] },
        { slug: "immunity-and-public-health", name: "Immunity and Public Health", summary: "Natural and artificial immunity, vaccination and community health.", prerequisites: ["sec.biology.health-and-disease.pathogens-and-vectors"], objectives: ["Distinguish active from passive immunity, and natural from artificial", "Explain how vaccination produces immunity", "Outline public-health measures used in Nigeria (immunisation, sanitation, health education)"] },
      ]),
      makeTopic("sec.biology", "soil-science", "Soil Science", 14, "Soil composition, types and conservation — the agricultural biology strand of the syllabus.", ["SS1", "SS2"], [
        { slug: "soil-composition", name: "Soil Composition", summary: "Mineral particles, organic matter, air, water and living organisms in soil.", objectives: ["List the components of soil and state the role of each", "Compare sandy, clay and loamy soils", "Describe a simple experiment to separate soil components"] },
        { slug: "soil-conservation", name: "Soil Conservation", summary: "Erosion, leaching and the practices that keep Nigerian farmland productive.", prerequisites: ["sec.biology.soil-science.soil-composition"], objectives: ["Explain water and wind erosion and leaching", "Describe contour ridging, cover cropping, terracing and afforestation", "Give reasons why soil conservation matters for Nigerian agriculture"] },
      ]),
    ],
  },

  chemistry: {
    description:
      "Particulate nature of matter, atomic structure, bonding, stoichiometry, acids and bases, energy changes, rates, organic chemistry, air, water and industrial chemistry for the Nigerian senior secondary curriculum, aligned to WAEC, NECO and JAMB.",
    topics: [
      makeTopic("sec.chemistry", "energy-changes", "Energy Changes", 12, "Exothermic and endothermic reactions, enthalpy and simple bond-energy calculations.", ["SS2"], [
        { slug: "exothermic-and-endothermic", name: "Exothermic and Endothermic Reactions", summary: "Heat given out or taken in, and how energy-profile diagrams show it.", objectives: ["Define exothermic and endothermic reactions with everyday examples", "Sketch energy-profile diagrams and mark ΔH", "State that ΔH is negative for exothermic changes"] },
        { slug: "enthalpy-and-bond-energy", name: "Enthalpy and Bond Energy", summary: "Using average bond energies to estimate ΔH for a reaction.", prerequisites: ["sec.chemistry.energy-changes.exothermic-and-endothermic"], objectives: ["Define enthalpy change and standard conditions", "Calculate ΔH from bond energies: bonds broken minus bonds formed", "Interpret a given set of thermochemical data"] },
      ]),
      makeTopic("sec.chemistry", "air-and-water", "Air and Water", 13, "The composition of air, oxygen, and the treatment of water for a town supply.", ["SS1", "SS2"], [
        { slug: "air-and-oxygen", name: "Air and Oxygen", summary: "Percentage composition of air, and laboratory preparation of oxygen.", objectives: ["State the approximate percentage composition of dry air", "Describe the laboratory preparation and test for oxygen", "List uses of oxygen and of the noble gases"] },
        { slug: "water-treatment", name: "Water and Water Treatment", summary: "Hardness of water and the stages of municipal water treatment.", prerequisites: ["sec.chemistry.air-and-water.air-and-oxygen"], objectives: ["Distinguish temporary from permanent hardness", "Describe how hardness is removed", "Outline screening, coagulation, filtration, chlorination and fluoridation"] },
      ]),
      makeTopic("sec.chemistry", "carbon-and-industry", "Carbon and Industrial Chemistry", 14, "Allotropes of carbon, petroleum, and chemical industries that matter in Nigeria.", ["SS2", "SS3"], [
        { slug: "carbon-and-allotropes", name: "Carbon and its Allotropes", summary: "Diamond, graphite and amorphous carbon, and why their properties differ.", objectives: ["Define allotropy and name the allotropes of carbon", "Relate the structure of diamond and graphite to their properties", "State uses of diamond, graphite and charcoal"] },
        { slug: "petroleum-and-industry", name: "Petroleum and Industry", summary: "Fractional distillation of crude oil and major chemical industries in Nigeria.", prerequisites: ["sec.chemistry.organic-chemistry.alkanes"], objectives: ["Describe fractional distillation of crude oil and name the main fractions", "State uses of petrol, kerosene, diesel and bitumen", "Name important Nigerian chemical industries (petroleum, cement, fertiliser, soap)"] },
      ]),
    ],
  },

  economics: {
    description:
      "Scarcity, demand and supply, production, markets, money, national income, population, development, international trade and the Nigerian economy, aligned to WAEC, NECO and JAMB.",
    topics: [
      makeTopic("sec.economics", "population-and-labour", "Population and Labour", 8, "Size, structure and problems of population, and the labour market.", ["SS2", "SS3"], [
        { slug: "population", name: "Population", summary: "Census, birth and death rates, age structure and the Malthusian debate.", objectives: ["Define population, census, birth rate, death rate and natural increase", "Draw and interpret a population pyramid", "Explain over-population, under-population and optimum population"] },
        { slug: "unemployment-and-labour", name: "Unemployment and Labour", summary: "Types of unemployment and how wages are determined.", prerequisites: ["sec.economics.population-and-labour.population"], objectives: ["Define labour force and unemployment", "Distinguish frictional, structural, seasonal, cyclical and residual unemployment", "Explain factors that determine wages"] },
      ]),
      makeTopic("sec.economics", "development-and-planning", "Development and Planning", 9, "Growth versus development, and how Nigeria plans its economy.", ["SS3"], [
        { slug: "growth-and-development", name: "Growth and Development", summary: "Why a rising GDP is not the same as development.", objectives: ["Distinguish economic growth from economic development", "List indicators of development (HDI, literacy, life expectancy, per capita income)", "Outline obstacles to development in Nigeria"] },
        { slug: "economic-planning", name: "Economic Planning", summary: "Why countries plan, and Nigeria's development plans.", prerequisites: ["sec.economics.development-and-planning.growth-and-development"], objectives: ["Define economic planning and state its objectives", "Distinguish a development plan from a rolling plan", "Give reasons why some Nigerian plans have failed"] },
      ]),
      makeTopic("sec.economics", "agriculture-and-industry", "Agriculture and Industry", 10, "The roles of agriculture and industrialisation in the Nigerian economy.", ["SS2", "SS3"], [
        { slug: "agricultural-economics", name: "Agricultural Economics", summary: "Systems of agriculture, problems and government policies in Nigeria.", objectives: ["Distinguish subsistence from commercial agriculture", "State the contributions of agriculture to the Nigerian economy", "Explain problems of Nigerian agriculture and the policies meant to solve them"] },
        { slug: "industrialisation", name: "Industrialisation", summary: "Types of industry, location factors and industrialisation strategy.", prerequisites: ["sec.economics.agriculture-and-industry.agricultural-economics"], objectives: ["Classify industry as extractive, manufacturing or constructive", "Explain factors that influence the location of industry", "Discuss import substitution and export promotion as strategies"] },
      ]),
    ],
  },

  government: {
    description:
      "Political concepts, forms and organs of government, constitutions, citizenship, parties, public administration, Nigerian political history and foreign policy, aligned to WAEC, NECO and JAMB.",
    topics: [
      makeTopic("sec.government", "citizenship-and-rights", "Citizenship and Rights", 9, "Who a citizen is, how citizenship is acquired, and the rights the 1999 Constitution protects.", ["SS1", "SS2"], [
        { slug: "citizenship", name: "Citizenship", summary: "Acquisition, loss and duties of citizenship in Nigeria.", objectives: ["Define a citizen and distinguish a citizen from an alien", "Explain citizenship by birth, registration and naturalisation", "State the duties of a Nigerian citizen"] },
        { slug: "fundamental-human-rights", name: "Fundamental Human Rights", summary: "Chapter IV rights, limitations, and how they are enforced.", prerequisites: ["sec.government.citizenship-and-rights.citizenship"], objectives: ["List the fundamental human rights in the 1999 Constitution", "Explain how rights may be limited in a democracy", "Describe how a citizen can seek redress when rights are violated"] },
      ]),
      makeTopic("sec.government", "nigerian-politics", "Nigerian Politics since Independence", 10, "Military rule, the return to democracy, and public corporations.", ["SS2", "SS3"], [
        { slug: "military-rule-and-democracy", name: "Military Rule and Democracy", summary: "Why the military intervened, and how Nigeria returned to civilian rule.", objectives: ["Give reasons for military intervention in Nigerian politics", "State features and weaknesses of military rule", "Outline the transition programmes that restored democratic rule"] },
        { slug: "public-corporations", name: "Public Corporations", summary: "Why governments create corporations, and the case for privatisation.", prerequisites: ["sec.government.public-administration.the-civil-service"], objectives: ["Define a public corporation and give Nigerian examples", "State reasons for establishing public corporations", "Discuss problems of public corporations and the argument for privatisation"] },
      ]),
      makeTopic("sec.government", "political-ideologies", "Political Ideologies", 11, "The belief systems that shape parties and policy — a standard JAMB topic.", ["SS2"], [
        { slug: "capitalism-and-socialism", name: "Capitalism and Socialism", summary: "Private ownership versus public ownership as organising ideas.", objectives: ["State the main features of capitalism and of socialism", "Compare how each system answers the basic economic questions", "Give criticisms of each ideology"] },
        { slug: "other-ideologies", name: "Communalism, Fascism and Welfarism", summary: "African communalism, fascism and the welfare state.", prerequisites: ["sec.government.political-ideologies.capitalism-and-socialism"], objectives: ["Explain communalism as practised in traditional African societies", "State the features of fascism", "Define welfarism and give examples of welfare policies"] },
      ]),
    ],
  },

  "undergrad-cs": {
    description:
      "Programming, data structures, algorithms, discrete mathematics, operating systems, networks, databases and software engineering for a first-year undergraduate Computer Science programme.",
    topics: [
      makeTopic("ug.computer-science", "computer-systems", "Computer Systems", 6, "How software shares a machine, and how machines share a network.", ["Year1"], [
        { slug: "operating-systems", name: "Operating Systems", summary: "Processes, scheduling, memory and the job of an OS.", objectives: ["State the functions of an operating system", "Distinguish a process from a thread and explain ready/running/waiting", "Explain why CPU scheduling and virtual memory exist"] },
        { slug: "computer-networks", name: "Computer Networks", summary: "Layered models, IP addressing and reliable delivery.", objectives: ["Compare the OSI and TCP/IP models", "Explain IP addresses, ports and the difference between TCP and UDP", "Describe a simple request/response on the web"] },
      ]),
      makeTopic("ug.computer-science", "software-engineering", "Software Engineering", 7, "How non-trivial software is planned, built and checked.", ["Year1", "Year2"], [
        { slug: "software-process", name: "Software Process", summary: "Lifecycle models and why process exists on a team project.", objectives: ["Describe waterfall, iterative and agile process models", "State typical activities: requirements, design, implementation, testing, maintenance", "Choose a model for a given project constraint"] },
        { slug: "testing-and-debugging", name: "Testing and Debugging", summary: "Unit, integration and system tests, and a disciplined way to find faults.", prerequisites: ["ug.computer-science.software-engineering.software-process"], objectives: ["Distinguish faults, failures and errors", "Write a small unit-test example and explain coverage", "Outline a systematic debugging procedure"] },
      ]),
    ],
  },
};

const accountingId = "sec.accounting";
const commerceId = "sec.commerce";
const marketingId = "sec.marketing";

export const NEW_SUBJECTS: NewSubjectDraft[] = [
  {
    dir: "accounting",
    subject: {
      id: accountingId,
      level: "secondary",
      name: "Accounting",
      shortName: "Acct",
      description:
        "Financial accounting for senior secondary: principles, books of original entry, ledger, control accounts, adjustments and final accounts, aligned to the WAEC/NECO Financial Accounting and JAMB syllabuses.",
      curricula: [...STANDARD_SEC_CURRICULA],
      classLevels: SS_LEVELS,
      accentColor: "#1a5c38",
      icon: "Calculator",
      provenance: {
        sources: [
          { id: "waec-financial-accounting-syllabus", title: "WAEC Financial Accounting Syllabus", type: "syllabus" },
          { id: "neco-financial-accounting-syllabus", title: "NECO Financial Accounting Syllabus", type: "syllabus" },
          { id: "jamb-principles-of-accounts-syllabus", title: "JAMB Principles of Accounts Syllabus", type: "syllabus" },
        ],
        reviewStatus: "published",
        verified: true,
      },
      topics: [
        makeTopic(accountingId, "introduction", "Introduction to Accounting", 1, "What accounting is for, the principles that govern it, and the documents that start every record.", ["SS1"], [
          { slug: "meaning-and-principles", name: "Meaning and Principles", summary: "Users of accounting information and the concepts that keep the books honest.", objectives: ["Define accounting and distinguish it from bookkeeping", "List internal and external users of accounting information", "State the business-entity, going-concern, matching, prudence and consistency concepts"] },
          { slug: "source-documents", name: "Source Documents", summary: "Invoices, receipts, credit notes, debit notes and how each starts an entry.", prerequisites: [`${accountingId}.introduction.meaning-and-principles`], objectives: ["Name the common source documents and the transaction each records", "Distinguish an invoice from a credit note and a debit note", "Trace a source document into the correct book of original entry"] },
          { slug: "accounting-equation", name: "The Accounting Equation", summary: "Assets = Capital + Liabilities, and how every transaction keeps it in balance.", prerequisites: [`${accountingId}.introduction.meaning-and-principles`], objectives: ["State the accounting equation and define asset, liability and capital", "Show the effect of a transaction on the equation", "Classify items as assets, liabilities, income or expenses"] },
        ]),
        makeTopic(accountingId, "double-entry", "Double Entry and the Ledger", 2, "Every debit has a credit. The ledger is where those entries live.", ["SS1"], [
          { slug: "double-entry-principle", name: "The Double-Entry Principle", summary: "Debit the receiver, credit the giver — applied to cash, goods and expenses.", prerequisites: [`${accountingId}.introduction.accounting-equation`], objectives: ["State the double-entry rule for assets, liabilities, income and expenses", "Record a simple transaction as a debit and a matching credit", "Explain why the trial balance agrees when double entry is complete"] },
          { slug: "ledger-accounts", name: "Ledger Accounts", summary: "T-accounts, balancing, and the personal, real and nominal classification.", prerequisites: [`${accountingId}.double-entry.double-entry-principle`], objectives: ["Open and post to a T-account", "Balance a ledger account and bring down the balance", "Classify accounts as personal, real or nominal"] },
          { slug: "trial-balance", name: "The Trial Balance", summary: "Listing debit and credit balances to test the arithmetic of the ledger.", prerequisites: [`${accountingId}.double-entry.ledger-accounts`], objectives: ["Extract a trial balance from a set of ledger balances", "State errors that a trial balance will not reveal", "Explain what an imbalance means and the first checks to make"] },
        ]),
        makeTopic(accountingId, "books-of-original-entry", "Books of Original Entry", 3, "Journals and cash books that feed the ledger.", ["SS1", "SS2"], [
          { slug: "journals", name: "The Journals", summary: "Sales, purchases, returns and the general journal.", prerequisites: [`${accountingId}.double-entry.ledger-accounts`], objectives: ["State the use of the sales, purchases, returns inwards and returns outwards journals", "Record a transaction in the appropriate journal", "Explain when the general journal is used, including opening entries"] },
          { slug: "cash-book", name: "The Cash Book", summary: "Two- and three-column cash books, and cash versus bank columns.", prerequisites: [`${accountingId}.books-of-original-entry.journals`], objectives: ["Record receipts and payments in a two-column cash book", "Use the discount columns of a three-column cash book", "Treat a contra entry between cash and bank"] },
          { slug: "petty-cash", name: "Petty Cash and the Imprest System", summary: "A float for small payments, restored at the end of each period.", prerequisites: [`${accountingId}.books-of-original-entry.cash-book`], objectives: ["Explain the imprest system of petty cash", "Record petty-cash payments and the reimbursement that restores the float", "Analyse petty-cash payments into expense columns"] },
        ]),
        makeTopic(accountingId, "control-and-errors", "Control Accounts and Errors", 4, "Checking the debtors and creditors ledgers, and putting mistakes right.", ["SS2"], [
          { slug: "control-accounts", name: "Control Accounts", summary: "Sales-ledger and purchases-ledger control accounts as a check on personal ledgers.", prerequisites: [`${accountingId}.double-entry.trial-balance`], objectives: ["State the purpose of sales-ledger and purchases-ledger control accounts", "Prepare a sales-ledger control account from given totals", "Interpret a debit balance in the purchases ledger or a credit balance in the sales ledger"] },
          { slug: "bank-reconciliation", name: "Bank Reconciliation", summary: "Why the cash-book bank balance differs from the bank statement, and how to agree them.", prerequisites: [`${accountingId}.books-of-original-entry.cash-book`], objectives: ["List items that cause the cash book and bank statement to differ", "Update the cash book for bank charges, standing orders and direct credits", "Prepare a bank reconciliation statement"] },
          { slug: "errors-and-suspense", name: "Errors and the Suspense Account", summary: "Errors of principle, omission, commission and the suspense account that holds a difference.", prerequisites: [`${accountingId}.double-entry.trial-balance`], objectives: ["Classify errors that do and do not affect the trial-balance agreement", "Correct errors using journal entries", "Use a suspense account to hold and then clear a trial-balance difference"] },
        ]),
        makeTopic(accountingId, "adjustments", "Year-End Adjustments", 5, "Accruals, prepayments, depreciation and irrecoverable debts before final accounts.", ["SS2", "SS3"], [
          { slug: "accruals-and-prepayments", name: "Accruals and Prepayments", summary: "Matching income and expenses to the period they belong to.", prerequisites: [`${accountingId}.double-entry.trial-balance`], objectives: ["Define an accrual and a prepayment", "Adjust expenses and income for amounts owing or paid in advance", "Show accruals and prepayments in the balance sheet"] },
          { slug: "depreciation", name: "Depreciation", summary: "Straight-line and reducing-balance methods, and the ledger entries.", prerequisites: [`${accountingId}.adjustments.accruals-and-prepayments`], objectives: ["Explain why non-current assets are depreciated", "Calculate depreciation using the straight-line and reducing-balance methods", "Record depreciation in the ledger and on the balance sheet"] },
          { slug: "bad-and-doubtful-debts", name: "Bad and Doubtful Debts", summary: "Writing off debts that will not be paid, and providing for those that might not.", prerequisites: [`${accountingId}.adjustments.accruals-and-prepayments`], objectives: ["Distinguish a bad debt from a provision for doubtful debts", "Record the write-off of a bad debt", "Account for an increase or decrease in the provision"] },
        ]),
        makeTopic(accountingId, "final-accounts", "Final Accounts of a Sole Trader", 6, "Trading account, profit and loss account, and the statement of financial position.", ["SS2", "SS3"], [
          { slug: "trading-account", name: "The Trading Account", summary: "Finding gross profit from sales, purchases and inventories.", prerequisites: [`${accountingId}.adjustments.accruals-and-prepayments`], objectives: ["Prepare a trading account and calculate cost of sales", "Treat carriage inwards, returns and closing inventory", "Interpret a fall or rise in the gross-profit margin"] },
          { slug: "profit-and-loss", name: "The Profit and Loss Account", summary: "From gross profit to net profit after operating expenses.", prerequisites: [`${accountingId}.final-accounts.trading-account`], objectives: ["Prepare a profit and loss account from a trial balance and adjustments", "Distinguish capital expenditure from revenue expenditure", "Explain the effect of an omitted accrual on net profit"] },
          { slug: "balance-sheet", name: "The Balance Sheet", summary: "A classified statement of financial position after the profit and loss account.", prerequisites: [`${accountingId}.final-accounts.profit-and-loss`], objectives: ["Prepare a classified balance sheet from closing ledger balances", "Show capital, net profit and drawings in the capital section", "Distinguish current from non-current assets and liabilities"] },
        ]),
        makeTopic(accountingId, "other-entities", "Partnerships and Incomplete Records", 7, "When there is more than one owner, or the books are incomplete.", ["SS3"], [
          { slug: "partnership-accounts", name: "Partnership Accounts", summary: "Appropriation of profit, current accounts, and the partnership agreement.", prerequisites: [`${accountingId}.final-accounts.balance-sheet`], objectives: ["State the provisions of the Partnership Act when there is no agreement", "Prepare an appropriation account for interest on capital, salaries and share of profit", "Show partners' current and capital accounts"] },
          { slug: "incomplete-records", name: "Incomplete Records", summary: "Building a statement of affairs and finding profit when double entry was never kept.", prerequisites: [`${accountingId}.final-accounts.balance-sheet`], objectives: ["Prepare opening and closing statements of affairs", "Calculate profit as closing capital + drawings − additional capital − opening capital", "Reconstruct a sales or purchases figure from control-account logic"] },
          { slug: "not-for-profit", name: "Not-for-Profit Organisations", summary: "Receipts and payments, income and expenditure, and the accumulated fund.", prerequisites: [`${accountingId}.final-accounts.profit-and-loss`], objectives: ["Distinguish a receipts-and-payments account from an income-and-expenditure account", "Calculate the accumulated fund", "Treat subscriptions in arrears and in advance"] },
        ]),
        makeTopic(accountingId, "interpretation", "Interpretation of Accounts", 8, "Ratios that turn a set of final accounts into a story about the business.", ["SS3"], [
          { slug: "accounting-ratios", name: "Accounting Ratios", summary: "Profitability, liquidity and efficiency ratios a WAEC candidate is expected to compute.", prerequisites: [`${accountingId}.final-accounts.balance-sheet`], objectives: ["Calculate gross-profit margin, net-profit margin and return on capital employed", "Calculate current ratio and acid-test ratio", "Interpret a change in a ratio in plain language"] },
          { slug: "manufacturing-accounts", name: "Manufacturing Accounts", summary: "Prime cost, factory overheads and the transfer to the trading account.", prerequisites: [`${accountingId}.final-accounts.trading-account`], objectives: ["Prepare a manufacturing account and identify prime cost", "Treat factory overheads and work in progress", "Explain why a manufacturer needs a manufacturing account as well as a trading account"] },
          { slug: "departmental-accounts", name: "Departmental Accounts", summary: "Splitting profit by department so management can see which section earns.", prerequisites: [`${accountingId}.final-accounts.profit-and-loss`], objectives: ["State reasons for keeping departmental accounts", "Apportion expenses between departments on a given basis", "Prepare a departmental trading and profit and loss account"] },
        ]),
      ],
    },
  },
  {
    dir: "commerce",
    subject: {
      id: commerceId,
      level: "secondary",
      name: "Commerce",
      shortName: "Comm",
      description:
        "Trade and the aids to trade — production, home and foreign trade, business units, finance, transport, insurance and the Nigerian commercial environment — aligned to WAEC, NECO and JAMB Commerce.",
      curricula: [...STANDARD_SEC_CURRICULA],
      classLevels: SS_LEVELS,
      accentColor: "#b45309",
      icon: "Storefront",
      provenance: {
        sources: [
          { id: "waec-commerce-syllabus", title: "WAEC Commerce Syllabus", type: "syllabus" },
          { id: "neco-commerce-syllabus", title: "NECO Commerce Syllabus", type: "syllabus" },
          { id: "jamb-commerce-syllabus", title: "JAMB Commerce Syllabus", type: "syllabus" },
        ],
        reviewStatus: "published",
        verified: true,
      },
      topics: [
        makeTopic(commerceId, "introduction", "Introduction to Commerce", 1, "What commerce is, how it sits inside production, and the occupations it creates.", ["SS1"], [
          { slug: "meaning-and-scope", name: "Meaning and Scope", summary: "Commerce as trade plus the aids to trade, and why it matters in Nigeria.", objectives: ["Define commerce and distinguish it from trade and from industry", "Draw the structure of commerce: home trade, foreign trade and the aids to trade", "State the functions of commerce in an economy"] },
          { slug: "occupation", name: "Occupation", summary: "Industrial, commercial and service occupations, and factors that influence choice of occupation.", prerequisites: [`${commerceId}.introduction.meaning-and-scope`], objectives: ["Classify occupations as industrial, commercial or services", "Give Nigerian examples of each class of occupation", "Explain factors that influence a person's choice of occupation"] },
          { slug: "production", name: "Production", summary: "Primary, secondary and tertiary production, and the factors of production.", prerequisites: [`${commerceId}.introduction.meaning-and-scope`], objectives: ["Define production and state when production is complete", "Distinguish primary, secondary and tertiary production with examples", "Name the factors of production and the reward of each"] },
        ]),
        makeTopic(commerceId, "home-trade", "Home Trade", 2, "Wholesale and retail trade inside Nigeria, and the documents that move with the goods.", ["SS1", "SS2"], [
          { slug: "wholesale-trade", name: "Wholesale Trade", summary: "The wholesaler as the link between manufacturer and retailer.", prerequisites: [`${commerceId}.introduction.meaning-and-scope`], objectives: ["Define a wholesaler and state types of wholesaler", "Explain the services a wholesaler renders to the manufacturer and to the retailer", "Discuss reasons for the decline of the independent wholesaler"] },
          { slug: "retail-trade", name: "Retail Trade", summary: "Small shops, supermarkets, department stores, hawking and e-retailing.", prerequisites: [`${commerceId}.home-trade.wholesale-trade`], objectives: ["Define retailing and list types of retailer in Nigeria", "Compare a supermarket with a department store and a hawker", "State the recent trends in retailing, including e-commerce"] },
          { slug: "documents-of-trade", name: "Documents of Trade", summary: "Enquiry, quotation, order, invoice, delivery note, debit and credit notes, and receipt.", prerequisites: [`${commerceId}.home-trade.retail-trade`], objectives: ["List the documents used in a home-trade transaction in order", "State the purpose of an invoice, a delivery note and a credit note", "Interpret trade discount and cash discount on an invoice"] },
        ]),
        makeTopic(commerceId, "foreign-trade", "Foreign Trade", 3, "Import, export and entrepôt trade, procedures, and the documents and payments that make it work.", ["SS2", "SS3"], [
          { slug: "nature-of-foreign-trade", name: "Nature of Foreign Trade", summary: "Why countries trade, and the difference between visible and invisible trade.", prerequisites: [`${commerceId}.home-trade.wholesale-trade`], objectives: ["Define foreign trade and distinguish import, export and entrepôt trade", "Distinguish visible from invisible trade and define the balance of trade and of payments", "State advantages and disadvantages of foreign trade for Nigeria"] },
          { slug: "barriers-and-procedures", name: "Barriers and Procedures", summary: "Tariffs, quotas, customs, and the steps in importing and exporting.", prerequisites: [`${commerceId}.foreign-trade.nature-of-foreign-trade`], objectives: ["Explain tariffs, quotas, embargoes and foreign-exchange control", "Outline the procedure for importing goods into Nigeria", "Outline the procedure for exporting goods from Nigeria"] },
          { slug: "documents-and-payments", name: "Documents and Payments", summary: "Bill of lading, certificate of origin, letter of credit and other tools of foreign trade.", prerequisites: [`${commerceId}.foreign-trade.barriers-and-procedures`], objectives: ["State the purpose of a bill of lading, certificate of origin, consular invoice and insurance certificate", "Explain a letter of credit and a bill of exchange", "Identify incoterms such as FOB and CIF in outline"] },
        ]),
        makeTopic(commerceId, "aids-to-trade", "Aids to Trade", 4, "Transport, communication, warehousing, insurance, banking and advertising.", ["SS1", "SS2"], [
          { slug: "transport-and-communication", name: "Transport and Communication", summary: "How goods and messages move, and why each mode is chosen.", prerequisites: [`${commerceId}.introduction.meaning-and-scope`], objectives: ["State the functions of transport in commerce", "Compare road, rail, water, air and pipeline transport in Nigeria", "Explain how communication aids trade"] },
          { slug: "warehousing-and-insurance", name: "Warehousing and Insurance", summary: "Holding stock safely, and spreading risk so trade can continue.", prerequisites: [`${commerceId}.aids-to-trade.transport-and-communication`], objectives: ["State the functions and types of warehouses", "Define insurance and state the principles of insurance", "Distinguish life, fire, marine, motor and fidelity-guarantee insurance"] },
          { slug: "banking-and-advertising", name: "Banking and Advertising", summary: "How banks and advertisements oil the wheels of trade.", prerequisites: [`${commerceId}.aids-to-trade.warehousing-and-insurance`], objectives: ["State the commercial functions of the Central Bank and of commercial banks", "Explain a cheque, a standing order and a bank draft", "State the functions, types and media of advertising"] },
        ]),
        makeTopic(commerceId, "business-units", "Business Units", 5, "From the sole proprietor to the public corporation — who owns the firm and who bears the risk.", ["SS1", "SS2"], [
          { slug: "sole-proprietor-and-partnership", name: "Sole Proprietor and Partnership", summary: "The smallest units, their advantages, and why many Nigerian firms start here.", prerequisites: [`${commerceId}.introduction.occupation`], objectives: ["State the features, merits and demerits of a sole proprietorship", "State the features of a partnership and the contents of a partnership deed", "Explain unlimited liability and why it matters"] },
          { slug: "companies", name: "Limited Companies", summary: "Private and public companies, shares and the idea of limited liability.", prerequisites: [`${commerceId}.business-units.sole-proprietor-and-partnership`], objectives: ["Distinguish a private from a public limited company", "Explain limited liability, shares and debentures", "Outline how a company is formed (memorandum and articles)"] },
          { slug: "public-enterprises", name: "Public Enterprises and Cooperatives", summary: "Government-owned businesses and cooperative societies.", prerequisites: [`${commerceId}.business-units.companies`], objectives: ["State reasons for public enterprises and give Nigerian examples", "Explain privatisation and commercialisation", "State the features and types of cooperative societies"] },
        ]),
        makeTopic(commerceId, "finance-and-capital", "Finance and Capital", 6, "Where a business gets its money, and the institutions that supply it.", ["SS2", "SS3"], [
          { slug: "capital", name: "Business Capital", summary: "Fixed, circulating, owned and borrowed capital, and the capital market.", prerequisites: [`${commerceId}.business-units.companies`], objectives: ["Distinguish fixed from circulating capital, and owned from borrowed capital", "Calculate working capital", "State sources of short-term and long-term finance"] },
          { slug: "money-and-the-stock-exchange", name: "Money and the Stock Exchange", summary: "Functions of money, and how the Nigerian Exchange helps firms raise capital.", prerequisites: [`${commerceId}.finance-and-capital.capital`], objectives: ["State the functions and qualities of money", "Explain the functions of the stock exchange", "Distinguish a share from a debenture and a bull from a bear"] },
          { slug: "credit", name: "Credit", summary: "Trade credit, hire purchase, deferred payment and the risks of selling on credit.", prerequisites: [`${commerceId}.finance-and-capital.capital`], objectives: ["Define credit and state types of credit used in trade", "Compare hire purchase with deferred payment", "State advantages and risks of granting credit"] },
        ]),
        makeTopic(commerceId, "consumer-and-market", "The Consumer and the Market", 7, "Protecting the buyer, and the organised markets where commodities are traded.", ["SS2", "SS3"], [
          { slug: "consumer-protection", name: "Consumer Protection", summary: "Why the buyer needs protection, and the agencies that provide it in Nigeria.", prerequisites: [`${commerceId}.home-trade.retail-trade`], objectives: ["State reasons for consumer protection", "Name Nigerian consumer-protection agencies and their roles (FCCPC, SON, NAFDAC)", "Outline the rights of a consumer"] },
          { slug: "commodity-and-produce-markets", name: "Commodity and Produce Markets", summary: "Commodity exchanges, organised produce markets and the middlemen of Nigerian trade.", prerequisites: [`${commerceId}.foreign-trade.nature-of-foreign-trade`], objectives: ["Define a commodity market and give examples relevant to Nigeria", "Explain the functions of middlemen in produce trade", "State the aims of a commodity exchange"] },
          { slug: "e-commerce", name: "E-commerce", summary: "Buying and selling online, and what it changes for Nigerian traders.", prerequisites: [`${commerceId}.home-trade.retail-trade`], objectives: ["Define e-commerce and give Nigerian examples", "State advantages and disadvantages of e-commerce", "Outline the documents and payments used in online trade"] },
        ]),
        makeTopic(commerceId, "nigerian-environment", "The Nigerian Commercial Environment", 8, "The setting in which Nigerian businesses actually operate.", ["SS3"], [
          { slug: "business-environment", name: "The Business Environment", summary: "Political, legal, economic, socio-cultural and technological influences on a firm.", prerequisites: [`${commerceId}.introduction.meaning-and-scope`], objectives: ["List the components of the business environment", "Explain how government policy can help or hinder commerce", "Give Nigerian examples of environmental influence on a firm"] },
          { slug: "economic-groupings", name: "Economic Groupings", summary: "ECOWAS, the AU and other groupings that shape Nigerian trade.", prerequisites: [`${commerceId}.foreign-trade.nature-of-foreign-trade`], objectives: ["State the aims of ECOWAS and of the African Union in trade", "Explain how a customs union differs from a free-trade area", "Discuss benefits and problems of regional economic integration"] },
          { slug: "custom-and-excise", name: "Customs and Excise", summary: "The agencies that collect duty and police the border.", prerequisites: [`${commerceId}.foreign-trade.barriers-and-procedures`], objectives: ["State the functions of the Nigeria Customs Service", "Distinguish customs duty from excise duty", "Explain why smuggling harms legitimate commerce"] },
        ]),
      ],
    },
  },
  {
    dir: "marketing",
    subject: {
      id: marketingId,
      level: "secondary",
      name: "Marketing",
      shortName: "Mktg",
      description:
        "The marketing concept, mix, research, consumer behaviour, product, price, promotion, distribution and e-marketing, aligned to the WAEC Marketing syllabus and related Commerce/JAMB topics.",
      curricula: [...STANDARD_SEC_CURRICULA],
      classLevels: SS_LEVELS,
      accentColor: "#be185d",
      icon: "Megaphone",
      provenance: {
        sources: [
          { id: "waec-marketing-syllabus", title: "WAEC Marketing Syllabus", type: "syllabus" },
          { id: "neco-marketing-syllabus", title: "NECO Marketing Syllabus", type: "syllabus" },
        ],
        reviewStatus: "published",
        verified: true,
      },
      topics: [
        makeTopic(marketingId, "introduction", "Introduction to Marketing", 1, "What marketing is, how it differs from selling, and the ideas that guide a marketing-oriented firm.", ["SS1"], [
          { slug: "meaning-and-functions", name: "Meaning and Functions", summary: "Marketing as identifying, anticipating and satisfying customer needs profitably.", objectives: ["Define marketing and distinguish it from selling and from advertising", "State the functions of marketing", "Explain why every organisation, including a school or a church, markets"] },
          { slug: "marketing-concepts", name: "Marketing Concepts", summary: "Production, product, selling, marketing and societal-marketing orientations.", prerequisites: [`${marketingId}.introduction.meaning-and-functions`], objectives: ["Describe the production, product, selling, marketing and societal concepts", "Give a Nigerian example of a firm that still behaves as if 'a good product sells itself'", "Explain why the marketing concept puts the customer first"] },
          { slug: "marketing-mix", name: "The Marketing Mix", summary: "The 4Ps, and the extra 3Ps used for services.", prerequisites: [`${marketingId}.introduction.marketing-concepts`], objectives: ["Name the 4Ps and state the role of each", "Add people, process and physical evidence for a service", "Show how the mix must be consistent for a given target market"] },
        ]),
        makeTopic(marketingId, "market-and-consumer", "Markets and the Consumer", 2, "Who the customer is, how markets are split, and why people buy.", ["SS1", "SS2"], [
          { slug: "markets-and-segmentation", name: "Markets and Segmentation", summary: "Consumer, industrial and organisational markets, and how a firm carves out a segment.", prerequisites: [`${marketingId}.introduction.meaning-and-functions`], objectives: ["Distinguish consumer from industrial and organisational markets", "Define market segmentation, targeting and positioning", "Segment a market by geography, demography, psychography and behaviour"] },
          { slug: "consumer-behaviour", name: "Consumer Behaviour", summary: "The buyer-decision process and the factors that shape it.", prerequisites: [`${marketingId}.market-and-consumer.markets-and-segmentation`], objectives: ["Outline the consumer decision-making process", "Explain cultural, social, personal and psychological influences on buying", "Distinguish a high-involvement from a low-involvement purchase"] },
          { slug: "organisational-buying", name: "Organisational Buying", summary: "How firms and government departments buy, and why it differs from household buying.", prerequisites: [`${marketingId}.market-and-consumer.consumer-behaviour`], objectives: ["State features of organisational buying", "Name the buying roles in a decision-making unit", "Contrast a new-task buy with a modified or straight rebuy"] },
        ]),
        makeTopic(marketingId, "product", "Product", 3, "What the firm offers: levels of a product, classification, mix and life cycle.", ["SS1", "SS2"], [
          { slug: "product-levels-and-types", name: "Product Levels and Types", summary: "Core, actual and augmented product, and convenience, shopping and speciality goods.", prerequisites: [`${marketingId}.introduction.marketing-mix`], objectives: ["Explain the core, actual and augmented levels of a product", "Classify consumer goods as convenience, shopping or speciality", "Distinguish a product from a service"] },
          { slug: "product-mix-and-branding", name: "Product Mix and Branding", summary: "Width, length and depth of the mix, and why brands matter.", prerequisites: [`${marketingId}.product.product-levels-and-types`], objectives: ["Define product mix, line, width, length and depth", "State the functions of branding, packaging and labelling", "Give Nigerian examples of a family brand and of individual branding"] },
          { slug: "product-life-cycle", name: "The Product Life Cycle", summary: "Introduction, growth, maturity and decline, and the marketing decisions at each stage.", prerequisites: [`${marketingId}.product.product-mix-and-branding`], objectives: ["Sketch and label the product life cycle", "State typical marketing actions at each stage", "Explain why a firm extends a product's life"] },
        ]),
        makeTopic(marketingId, "price", "Price", 4, "How a price is set, and the tactics used to move it.", ["SS2"], [
          { slug: "pricing-objectives-and-methods", name: "Pricing Objectives and Methods", summary: "Cost-plus, break-even, going-rate and perceived-value pricing.", prerequisites: [`${marketingId}.introduction.marketing-mix`], objectives: ["State common pricing objectives (profit, market share, survival, image)", "Calculate a cost-plus price from unit cost and a mark-up", "Compare cost-plus, break-even, competition-based and value-based pricing"] },
          { slug: "pricing-tactics", name: "Pricing Tactics", summary: "Penetration, skimming, discounts, psychological pricing and price discrimination.", prerequisites: [`${marketingId}.price.pricing-objectives-and-methods`], objectives: ["Distinguish market-skimming from market-penetration pricing", "Explain cash, trade and quantity discounts", "Give an example of psychological pricing and of price discrimination"] },
          { slug: "price-changes", name: "Responding to Price Changes", summary: "What a firm does when a competitor cuts price, or costs rise.", prerequisites: [`${marketingId}.price.pricing-tactics`], objectives: ["List options when a competitor reduces price", "Explain why a firm might hold price when costs rise", "Discuss the risks of a price war"] },
        ]),
        makeTopic(marketingId, "promotion", "Promotion", 5, "The promotional mix: advertising, sales promotion, public relations, personal selling and direct marketing.", ["SS2", "SS3"], [
          { slug: "promotional-mix", name: "The Promotional Mix", summary: "The five tools and when each is the right one.", prerequisites: [`${marketingId}.introduction.marketing-mix`], objectives: ["Name the elements of the promotional mix", "State factors that influence the mix (budget, product type, stage of the life cycle)", "Distinguish above-the-line from below-the-line promotion"] },
          { slug: "advertising-and-sales-promotion", name: "Advertising and Sales Promotion", summary: "Paid media versus short-term incentives to buy.", prerequisites: [`${marketingId}.promotion.promotional-mix`], objectives: ["Define advertising and state its types and media in Nigeria", "Define sales promotion and give examples (coupons, samples, bonuses, merchandising)", "State merits and demerits of advertising"] },
          { slug: "public-relations-and-selling", name: "Public Relations and Personal Selling", summary: "Earned reputation, and the salesperson's role.", prerequisites: [`${marketingId}.promotion.advertising-and-sales-promotion`], objectives: ["Define public relations and give tools (press release, sponsorship, events)", "State the steps in the personal-selling process", "Compare personal selling with advertising for an industrial product"] },
        ]),
        makeTopic(marketingId, "place", "Place and Distribution", 6, "How the product reaches the customer, and who stands in between.", ["SS2", "SS3"], [
          { slug: "channels-of-distribution", name: "Channels of Distribution", summary: "Zero-, one- and two-level channels, and why middlemen exist.", prerequisites: [`${marketingId}.introduction.marketing-mix`], objectives: ["Define a channel of distribution and draw common channel diagrams", "State the functions of middlemen", "Choose a suitable channel for a given product"] },
          { slug: "retailing-and-wholesaling", name: "Retailing and Wholesaling", summary: "The last two links, seen from a marketer's point of view.", prerequisites: [`${marketingId}.place.channels-of-distribution`], objectives: ["State the marketing functions of retailers and wholesalers", "Explain intensive, selective and exclusive distribution", "Discuss the growth of supermarkets and online retail in Nigeria"] },
          { slug: "physical-distribution", name: "Physical Distribution", summary: "Order processing, warehousing, inventory and transport — the logistics of place.", prerequisites: [`${marketingId}.place.channels-of-distribution`], objectives: ["List the components of physical distribution", "Explain the trade-off between inventory cost and customer service", "State factors that influence the choice of transport"] },
        ]),
        makeTopic(marketingId, "research-and-environment", "Research and the Marketing Environment", 7, "Finding out before deciding, and the forces a marketer cannot control.", ["SS2", "SS3"], [
          { slug: "marketing-research", name: "Marketing Research", summary: "The research process, and primary versus secondary data.", prerequisites: [`${marketingId}.market-and-consumer.markets-and-segmentation`], objectives: ["Define marketing research and state its uses", "Outline the research process from problem definition to report", "Distinguish primary from secondary data, and qualitative from quantitative methods"] },
          { slug: "marketing-environment", name: "The Marketing Environment", summary: "Micro and macro forces that shape marketing decisions in Nigeria.", prerequisites: [`${marketingId}.introduction.marketing-concepts`], objectives: ["Distinguish the micro-environment from the macro-environment", "List PESTEL forces with a Nigerian example of each", "Explain how a firm responds to an uncontrollable environmental change"] },
          { slug: "marketing-information", name: "Marketing Information Systems", summary: "The standing system that feeds managers, not just one-off research.", prerequisites: [`${marketingId}.research-and-environment.marketing-research`], objectives: ["Define a marketing information system", "Name its components: internal records, intelligence, research and analysis", "Explain why a small Nigerian firm still needs information even without a research department"] },
        ]),
        makeTopic(marketingId, "further-marketing", "Further Marketing", 8, "Services, e-marketing and the sales force — the later topics on the WAEC paper.", ["SS3"], [
          { slug: "services-marketing", name: "Services Marketing", summary: "Intangibility, inseparability, variability, perishability, and the extra 3Ps.", prerequisites: [`${marketingId}.introduction.marketing-mix`], objectives: ["State the distinctive characteristics of a service", "Explain how a bank or an airline uses people, process and physical evidence", "Give examples of service quality from a customer's point of view"] },
          { slug: "e-marketing", name: "E-marketing", summary: "Websites, social media, search and mobile as marketing channels in Nigeria.", prerequisites: [`${marketingId}.promotion.promotional-mix`], objectives: ["Define e-marketing and list its tools", "State advantages and limitations of marketing online in Nigeria", "Outline ethical issues: privacy, false claims and unsolicited messages"] },
          { slug: "sales-management", name: "Sales Management", summary: "Recruiting, training, motivating and controlling a sales force.", prerequisites: [`${marketingId}.promotion.public-relations-and-selling`], objectives: ["State the functions of sales management", "Explain how a sales force can be organised (by product, territory or customer)", "Describe common methods of remunerating salespeople"] },
        ]),
      ],
    },
  },
];
