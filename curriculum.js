// The People’s Academy curriculum (starter)
// 3 unique tracks with different modules and question pools.

window.PEOPLES_ACADEMY = {
  title: "The People’s Academy",
  tracks: {
    llc: {
      title: "Operator Track (Small LLC - Mixed)",
      certTitle: "P&L Operator Certified (LLC)",
      modules: [
        { id:"A1", title:"P&L as a Command Tool",
          pages: [
            {t:"P&L as your scoreboard", b:"Operators use P&L to decide where to focus effort next. It’s a narrative of value creation, efficiency, and discipline."},
            {t:"Revenue quality", b:"Mixed-model LLCs must separate repeatable revenue from spiky revenue and identify mix shifts that quietly compress margin."},
            {t:"Margin stack", b:"Gross margin = delivery efficiency. Operating profit = whether your model sustains overhead and still wins."},
          ]
        },
        { id:"A2", title:"Revenue Engines and Pricing Power",
          pages: [
            {t:"Drivers", b:"Revenue changes due to price, volume, and mix. If you can’t name which driver moved, you’re guessing."},
            {t:"Discounting", b:"Discounting can be strategic, but repeated discounting often signals unclear value or weak positioning."},
            {t:"Unit economics", b:"Know margin by offer line. Total revenue can hide bad work."},
          ]
        },
      ],
      kcCount: 5,
      examCount: 7
    },

    nonprofit: {
      title: "Steward Track (501(c)(3) - Event Heavy + Some Grants)",
      certTitle: "P&L Steward Certified (501(c)(3))",
      modules: [
        { id:"B1", title:"Nonprofit P&L: Mission and Math",
          pages: [
            {t:"Statement of Activities", b:"Nonprofits tell the story of resources in service of mission. Surplus supports stability and mission continuity."},
            {t:"Restricted vs unrestricted", b:"Restrictions are rules attached to dollars. Violating them is both a compliance and trust failure."},
            {t:"Expense categories", b:"Program vs admin vs fundraising is about truth and stewardship, not optics."},
          ]
        },
        { id:"B2", title:"Fundraising Reliability: Events + Sponsorships + Grants",
          pages: [
            {t:"Hope revenue", b:"If your plan requires perfect turnout or a miracle donor, it’s hope revenue."},
            {t:"Event P&L fundamentals", b:"Know fixed costs, variable costs, and sponsorship targets before you commit."},
            {t:"Grants as stabilizers", b:"Grants can strengthen programs and capacity, but avoid building a model that collapses when a grant ends."},
          ]
        },
      ],
      kcCount: 5,
      examCount: 7
    },

    board: {
      title: "Governor Track (Board Oversight - Nonprofit + Small Private)",
      certTitle: "P&L Governor Certified (Board Oversight)",
      modules: [
        { id:"C1", title:"Board-Level Financial Oversight",
          pages: [
            {t:"Oversight vs execution", b:"Boards demand clarity and guardrails. Management runs the machine. Ask for trends, assumptions, and corrective actions."},
            {t:"Red flags", b:"Repeated surprises, weak controls, missing documentation, or unexplained cash gaps warrant escalation."},
            {t:"Board dashboard", b:"Require consistent metrics: margin trend, cash runway, concentration risk, pipeline health, and variance drivers."},
          ]
        },
        { id:"C2", title:"Controls and Fraud Awareness",
          pages: [
            {t:"Separation of duties", b:"No single person should request, approve, pay, and reconcile. This reduces opportunity for fraud."},
            {t:"Fraud triangle", b:"Pressure + opportunity + rationalization. Boards reduce opportunity through controls and culture."},
            {t:"Vendor integrity", b:"Watch for sole-source convenience, weak documentation, and recurring emergency buys."},
          ]
        },
      ],
      kcCount: 5,
      examCount: 7
    }
  },

  // Question banks (starter). Expand later.
  // KC pulls from module-specific questions. Exam pulls from track-wide questions.
  questions: [
    // LLC KC (A1)
    {id:"llc-A1-1", track:"llc", module:"A1", prompt:"Which best reflects delivery efficiency?", choices:["Revenue","Gross margin","Cash balance","Headcount"], ans:1, exp:"Gross margin reflects efficiency after direct delivery costs."},
    {id:"llc-A1-2", track:"llc", module:"A1", prompt:"True/False: Profit and cash are the same.", choices:["True","False"], ans:1, exp:"You can be profitable and still run out of cash."},
    {id:"llc-A2-1", track:"llc", module:"A2", prompt:"Revenue changes due to:", choices:["Price, volume, mix","Only marketing","Only headcount","Only seasonality"], ans:0, exp:"Price, volume, and mix are the core drivers."},

    // LLC Exam (no module)
    {id:"llc-E-1", track:"llc", prompt:"Revenue grew but operating profit fell. Best first diagnosis?", choices:["Ignore it","Check margin + overhead + mix shift","Cut all spend immediately","Blame sales"], ans:1, exp:"Profit falling during growth often indicates compression or overhead expansion."},

    // Nonprofit KC (B1/B2)
    {id:"np-B1-1", track:"nonprofit", module:"B1", prompt:"Restricted funds means:", choices:["Free to use anywhere","Only usable per donor/grant rules","Only cash donations","Only sponsorships"], ans:1, exp:"Restricted dollars have usage rules."},
    {id:"np-B2-1", track:"nonprofit", module:"B2", prompt:"Hope revenue is:", choices:["Guaranteed revenue","Revenue dependent on perfect turnout or miracle donors","Grant revenue","Membership revenue"], ans:1, exp:"Hope revenue is assumed without reliable mechanism."},
    {id:"np-E-1", track:"nonprofit", prompt:"Why is surplus healthy for a nonprofit?", choices:["It’s greedy","It builds reserves for mission continuity","It avoids reporting","It increases taxes"], ans:1, exp:"Reserves prevent mission whiplash."},

    // Board KC (C1/C2)
    {id:"bd-C1-1", track:"board", module:"C1", prompt:"Board role is primarily:", choices:["Run daily operations","Oversight, questions, guardrails","Do payroll","Approve every purchase"], ans:1, exp:"Boards govern; managers execute."},
    {id:"bd-C2-1", track:"board", module:"C2", prompt:"Separation of duties prevents:", choices:["Any spending","One person controlling request→approve→pay→reconcile","Budgeting","Reporting"], ans:1, exp:"It reduces opportunity for fraud."},
    {id:"bd-E-1", track:"board", prompt:"Margins drop 3 months straight. Best board question?", choices:["Who caused it?","What assumptions changed and what corrective actions exist?","Ignore until next year","Board takes over ops"], ans:1, exp:"Boards interrogate assumptions + corrective actions, not people-hunts."},
  ]
};
