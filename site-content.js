// EDIT YOUR CONTENT HERE.
// SITE: name, introduction, contact links and resume.
// PROJECTS: project titles, roles, dates, summaries and case studies.
// EXPERIENCE: leadership, research and memberships.
// PUBLICATIONS: add publication entries when ready.
// Image paths are relative to index.html. Keep IDs stable to preserve links.

window.RESUME_IMG = "assets/resume.png";
window.RESUME_PDF_B64 = null;
window.EMBEDDED_IMAGES = {};

const SITE = {
  "name": "Jihu Lee",
  "initials": "JL",
  "intro": "Environmental Engineering Honors student at UT Austin exploring how water, air, and energy systems can work better together. I build models, turn complex data into useful decisions, and bring people together to move projects forward.",
  "heroPhoto": "assets/jihu-lee-portrait.png",
  "heroCaption": "Portrait of Jihu Lee in his Republic of Korea Army uniform.",
  "facts": [
    [
      "Education",
      "Environmental Engineering Honors · May 2028"
    ],
    [
      "University",
      "The University of Texas at Austin"
    ],
    [
      "GPA",
      "3.98 / 4.00"
    ],
    [
      "Focus",
      "Water reuse · Clean energy · Air quality"
    ]
  ],
  "contactLine": "Seeking Summer 2027 opportunities in water systems, clean energy, and environmental engineering. Let’s connect.",
  "email": "jihu.lee16@utexas.edu",
  "linkedin": "https://www.linkedin.com/in/jihulee1",
  "resume": "assets/Jihu_Lee_Resume.pdf",
  "resumeImage": "assets/resume.png"
};

const PROJECTS = [
  {
    "id": "offshore-wind-hydrogen",
    "title": "Offshore Wind, Green Hydrogen & Battery Optimization",
    "kind": "Project Lead",
    "when": "Sep 2026–Present",
    "summary": "Developing a Python time-series model to size battery power and capacity that protect a wind-powered PEM electrolyzer during low wind and rapid power changes.",
    "cover": "images/project-one/system-boundary.jpg",
    "coverFit": "contain",
    "meta": [
      [
        "Role",
        "Project Lead"
      ],
      [
        "Tools",
        "Python, Pandas, SciPy"
      ],
      [
        "Stage",
        "Building the model"
      ]
    ],
    "intro": "I am developing a Python time-series model to find the minimum battery power and energy capacity needed to keep a wind-powered PEM electrolyzer within defined operating limits. The focus is on buffering short-term variability, with longer low-wind periods handled through an explicit shutdown and restart strategy.",
    "question": "For a site-specific wind power profile and set PEM protection requirements, what is the minimum battery power (MW) and capacity (MWh) needed to keep the electrolyzer within safe operating limits?",
    "heroPhoto": {
      "src": "images/project-one/system-boundary.jpg",
      "fit": "contain",
      "caption": "My system boundary. Offshore wind powers the PEM electrolyzer directly, with no grid connection. The battery charges from extra wind and discharges to the electrolyzer when wind falls short."
    },
    "chapters": [
      {
        "heading": "See it in motion",
        "text": "A two-day wind profile run through these rules. Drag the battery size to see how shutdowns and too-fast power changes go down as the battery grows. The wind data here is made up to show the logic; it isn’t a result from my model.",
        "widget": "wind-sim"
      },
      {
        "heading": "Why the electrolyzer needs protecting",
        "text": [
          "Green hydrogen made with wind power can cut emissions compared with fossil-based hydrogen, but wind doesn’t hold steady. It surges, dies off, and can swing hard in minutes.",
          "A PEM electrolyzer has to stay above a minimum load or shut down, and frequent shutdowns, restarts and sudden power swings wear it out faster. My goal is to keep it in its safe operating window with as little battery as possible."
        ],
        "formulaTitle": "Energy Balance Equation",
        "formula": "P<sub>avail,w</sub>(t) + P<sub>B</sub><sup>dis</sup>(t)<br>= P<sub>PEM</sub><sup>safe</sup>(t) + P<sub>B</sub><sup>ch</sup>(t) + P<sub>curt</sub>(t)",
        "terms": [
          [
            "P<sub>avail,w</sub>(t)",
            "Wind power available after conversion losses (97.7% efficiency)"
          ],
          [
            "P<sub>B</sub><sup>dis</sup>(t)",
            "Power the battery discharges to the electrolyzer"
          ],
          [
            "P<sub>PEM</sub><sup>safe</sup>(t)",
            "Power the electrolyzer receives within its safe operating window"
          ],
          [
            "P<sub>B</sub><sup>ch</sup>(t)",
            "Power used to charge the battery"
          ],
          [
            "P<sub>curt</sub>(t)",
            "Extra wind power that can’t be used or stored (curtailed)"
          ]
        ]
      },
      {
        "heading": "When the battery steps in",
        "text": "These are the constraints the model checks at every time step. Each one is a scenario that could happen between the wind and the electrolyzer.",
        "cards": [
          {
            "tone": "pem",
            "tag": "Electrolyzer",
            "title": "Safe operating window",
            "text": "The electrolyzer is sized at 90% of the wind farm’s rating, 13.5 MW for a 15 MW farm. Below 10% of that, 1.35 MW, it can’t run safely.",
            "formula": "0.1 × P<sub>PEM</sub><sup>cap</sup> ≤ P<sub>PEM</sub><sup>safe</sup>(t) ≤ P<sub>PEM</sub><sup>cap</sup> = 0.9 × P<sub>w</sub><sup>rated</sup>"
          },
          {
            "tone": "bess",
            "tag": "Battery",
            "title": "Battery limits",
            "text": "The battery stays between 10% and 90% charged and starts at 50%. Charging and discharging each lose about 5%, for 90% round-trip efficiency.",
            "formula": "E(t+1) = E(t) + η<sub>ch</sub>P<sub>ch</sub>Δt − P<sub>dis</sub>Δt / η<sub>dis</sub><br><span>0.1 ≤ SOC(t) = E(t) / E<sub>B</sub> ≤ 0.9</span>"
          },
          {
            "tone": "charge",
            "tag": "Battery charges",
            "title": "Wind above electrolyzer capacity",
            "text": "The electrolyzer runs at full capacity and the extra wind charges the battery. Whatever the battery can’t take is curtailed.",
            "formula": "P<sub>B</sub><sup>ch</sup>(t) = min(P<sub>avail,w</sub>(t) − P<sub>PEM</sub><sup>cap</sup>, P<sub>B,max</sub><sup>ch</sup>, (E<sub>max</sub> − E(t))/(η<sub>ch</sub>Δt))<br><span>when available wind exceeds electrolyzer capacity</span>"
          },
          {
            "tone": "discharge",
            "tag": "Battery discharges",
            "title": "Wind below safe operating load",
            "text": "Without help, the electrolyzer would shut down. The battery discharges to cover the gap and hold it at its safe load.",
            "formula": "P<sub>B</sub><sup>dis</sup>(t) = P<sub>PEM</sub><sup>safe</sup>(t) − P<sub>avail,w</sub>(t)<br><span>when P<sub>avail,w</sub>(t) &lt; 0.1 × P<sub>PEM</sub><sup>cap</sup></span>"
          },
          {
            "tone": "ramp",
            "tag": "Battery smooths",
            "title": "Power changing too fast",
            "text": "If the wind jumps or drops faster than the electrolyzer’s ramp limit, its power changes only as fast as allowed. The battery absorbs the extra on a rise and fills the gap on a drop.",
            "formula": "−R<sub>down,max</sub>Δt ≤ P<sub>PEM</sub>(t) − P<sub>PEM</sub>(t − Δt) ≤ R<sub>up,max</sub>Δt"
          },
          {
            "tone": "shut",
            "tag": "Restart rule",
            "title": "After a shutdown",
            "text": "If the electrolyzer does shut down, it restarts only once wind is back above the safe load and the battery has recharged to 50%. That reserve keeps it from shutting down again right away.",
            "formula": "restart when P<sub>avail,w</sub>(t) ≥ 0.1 × P<sub>PEM</sub><sup>cap</sup> and SOC(t) ≥ 0.5"
          }
        ]
      },
      {
        "heading": "Scenarios I’m still working through",
        "list": [
          "Wind hovering right at the minimum load. If it dips below 10 times in 15 hours, when should the electrolyzer ride it out instead of shutting down each time?",
          "A storm pushing wind past the turbines’ cut-out speed, so power drops from full to zero almost instantly.",
          "A calm that lasts longer than any short-duration battery can cover.",
          "How strict the ramp limit should be, since a tighter limit protects the electrolyzer but needs a bigger battery."
        ],
        "after": "Next, I’ll run SciPy optimization on a real offshore wind time series to find the minimum battery power and energy that meet these protection targets."
      }
    ]
  },
  {
    "id": "semiconductor-water-reuse",
    "title": "Semiconductor Fab Water Reuse & Optimization",
    "kind": "Personal Project",
    "when": "Aug 2026–Present",
    "summary": "Built a 30,000 m³/day water-balance model with five segregated streams, designed a dual-pass RO reclaim train in WAVE, and developed an initial water-allocation model in PuLP.",
    "cover": "assets/fab-water-system.svg",
    "coverFit": "contain",
    "meta": [
      [
        "Role",
        "Independent project"
      ],
      [
        "Design basis",
        "30,000 m³/day · Assumed fab demand"
      ],
      [
        "Tools",
        "Python · Pandas · NumPy · WAVE · PuLP"
      ],
      [
        "Current stage",
        "Water balance + RO design; LP validation"
      ]
    ],
    "intro": "I am building a water reuse model for an advanced logic fab, starting with an assumed total end-use demand of 30,000 m³/day. My Python model separates five wastewater streams, tracks recovery and discharge, and checks mass balance. I then designed a dual-pass RO train for rinse-water reclaim in DuPont WAVE and used those outputs in an initial PuLP allocation model.",
    "question": "How much water can each segregated stream recover, what quality can treatment deliver, and where can that recovered water replace freshwater?",
    "heroPhoto": {
      "src": "assets/fab-water-system.svg",
      "fit": "contain",
      "caption": "Model structure from my project notes and Python inputs: 72% process/UPW, 18% cooling, and 10% scrubbers/facilities. Five wastewater streams remain separate through capture and treatment. All flows describe a design scenario, rather than measured facility data."
    },
    "chapters": [
      {
        "heading": "Step 1 · Build and close the water balance",
        "text": "I split the assumed daily demand into 21,600 m³ of process/UPW water, 5,400 m³ of cooling water, and 3,000 m³ of scrubber/facilities water. Within those uses, the code tracks clean rinse, HF/acid, copper-bearing, cooling, and utility wastewater separately. Each stream has its own capture fraction, water-quality inputs, and discharge-treatment requirements.",
        "widget": "fab-baseline",
        "after": "Running the supplied Step 1 script reproduces 39.2% volumetric recovery and closes the mass balance. Its discharge screen returns False: some streams still exceed the model’s assumed limits. Recovery, suitable reuse, and compliant discharge are separate checks."
      },
      {
        "heading": "Step 2 · Replace assumptions with a WAVE design",
        "text": "I designed a dual-pass RO system for the UPW-rinse reclaim stream. The WAVE design reports 67.5% system recovery, compared with the 75% recovery used in my first Python model. At the reported design point, it produces 8,674 m³/day of permeate at 1.498 mg/L TDS from 12,852 m³/day of captured rinse-water feed.",
        "cards": [
          {
            "tone": "bess",
            "tag": "Dual-pass RO",
            "title": "67.5% system recovery",
            "text": "The second pass improves product quality while reducing net water recovery. This changed the water-balance inputs I carried into the allocation stage."
          },
          {
            "tone": "pem",
            "tag": "WAVE design output",
            "title": "1.498 mg/L permeate TDS",
            "text": "The modeled feed is 358 mg/L TDS, equivalent to about 99.582% removal. This is reclaimed feed for further purification; final UPW polishing remains downstream."
          },
          {
            "tone": "ramp",
            "tag": "Development status",
            "title": "One design, five streams",
            "text": "The rinse stream has WAVE design outputs. Treatment performance for the other four streams is still estimated and needs stream-specific design and validation."
          }
        ],
        "photos": [
          {
            "src": "assets/fab-notes-9-1.png",
            "fit": "contain",
            "caption": "Feed-water chemistry setup recorded in my project notes, page 9. This is an input-stage screenshot; the values above use the later design point reported in my notes and Step 3 code."
          }
        ]
      },
      {
        "heading": "Explore the fab water balance",
        "text": "Change the capture fraction for any of the five streams, then compare the original Step 1 assumptions with the later WAVE-based inputs. The results show potential water recovery before end-use allocation and full quality validation.",
        "widget": "water-balance"
      },
      {
        "heading": "Explore cooling water from multiple sources",
        "text": "Keep the cooling-water explorer and choose how much makeup comes from rinse reclaim, treated HF/acid or copper streams, scrubber/facilities reclaim, and the tower’s own treated blowdown. Freshwater fills the remaining demand. Source budgets come from the fab scenario above.",
        "widget": "cooling-sources"
      },
      {
        "heading": "Step 3 · Allocate water with PuLP",
        "text": "My initial linear program routes treated sources to process-water feed, cooling, and utility uses. It combines freshwater cost with a treatment-energy term and uses linear flow and blended-TDS constraints. The 2 mg/L process-feed limit in this stage represents RO-permeate feed quality before final polishing, rather than finished UPW.",
        "formulaTitle": "The allocation problem",
        "formula": "Minimize Σ<sub>d</sub> c<sub>fresh</sub>F<sub>d</sub> + c<sub>energy</sub>e<sub>RO</sub>Σ<sub>s,d</sub>x<sub>s,d</sub>",
        "formulaNote": "x is recovered water routed from source s to use d; F is freshwater; eRO is specific treatment energy. Tariffs and several treatment inputs remain scenario assumptions.",
        "list": [
          "Meet each end-use flow demand and check blended TDS against the chosen feed-quality limit.",
          "Next validation: enforce each recovered source’s finite supply and represent incoming-water purification before the process-feed quality check.",
          "Reconcile energy inputs and contaminant loads before reporting an optimized freshwater saving."
        ],
        "after": "The project is progressing from a closed water balance and a WAVE-designed rinse train toward a validated allocation model. The 85% recycling figure in my notes is a target to investigate, rather than an achieved result."
      },
      {
        "heading": "From my project notebook",
        "photos": [
          {
            "src": "assets/fab-notes-1-1.jpeg",
            "fit": "contain",
            "caption": "System boundary from my project notes. The original sketch uses the first-pass 75% RO recovery assumption."
          },
          {
            "src": "assets/fab-notes-1-2.png",
            "fit": "contain",
            "caption": "Reuse and discharge follow separate treatment objectives: reclaim quality for return to the fab, and contaminant removal for discharge."
          }
        ]
      }
    ],
    "links": [
      [
        "Read my project notes",
        "assets/Fab_Water_Reuse_Project_Notes.pdf"
      ],
      [
        "Python water balance",
        "assets/step_1_waterbalancemodel.py"
      ],
      [
        "PuLP allocation prototype",
        "assets/step_3_optimization_model.py"
      ]
    ]
  },
  {
    "id": "ut-austin-solar-storage",
    "title": "UT Austin Solar Energy & Storage",
    "kind": "Project Lead",
    "when": "Aug 2022–Oct 2024",
    "summary": "Evaluated rooftop solar, battery storage, and EV charging for campus buildings and garages, combining usable-area screening with hourly energy modeling.",
    "cover": "assets/solar-campus.svg",
    "coverFit": "contain",
    "meta": [
      [
        "Role",
        "Project lead"
      ],
      [
        "Collaboration",
        "Prof. Sergio Castellanos"
      ],
      [
        "Scope",
        "9 buildings · 6 garages"
      ],
      [
        "Tools",
        "REopt · QGIS · Python · MATLAB"
      ]
    ],
    "intro": "I led a study of where rooftop solar and battery storage could add value at UT Austin. I assessed usable rooftop space, analyzed hourly electricity demand, and evaluated solar, storage, and EV charging scenarios. The study produced design proposals and modeled economic outcomes.",
    "question": "Which campus buildings and garages offer the strongest case for rooftop solar and battery storage when usable area, hourly demand, and economics are considered together?",
    "heroPhoto": {
      "src": "assets/solar-campus.svg",
      "fit": "contain",
      "caption": "Rooftop PV, battery storage, and EV charging: the connected systems evaluated in my campus feasibility study."
    },
    "links": [
      [
        "Read the research report",
        "assets/UT_Austin_Solar_Research_Report.pdf"
      ],
      [
        "View the RESET Lab project",
        "https://www.reset-lab.com/projects/assessing-the-role-of-solarstorage-in-ut-austin-campus"
      ]
    ],
    "chapters": [
      {
        "heading": "My contribution",
        "text": "I developed three proposals integrating rooftop PV, battery storage, and EV charging. My work connected site screening with time-series analysis and system design, using QGIS, Python/Pandas, MATLAB, AutoCAD, and PVWatts alongside REopt.",
        "steps": [
          [
            "Screen the sites",
            "Compare rooftop area and shading; refine the usable area instead of assuming every square foot can hold PV."
          ],
          [
            "Build demand profiles",
            "Organize an 8,760-hour load year and model seasonal EV charging demand for garage scenarios."
          ],
          [
            "Optimize the system",
            "Use REopt to compare PV size, battery power, battery energy capacity, and modeled financial savings."
          ],
          [
            "Check the assumptions",
            "Use Solar Pathfinder observations and PV Studio 2 at East Campus Garage as a shading and yield cross-check."
          ]
        ]
      },
      {
        "heading": "Selected modeled results",
        "text": "These are study outputs, based on the report’s roof-area assessments, historical load data, and financial assumptions. The building and garage cases use different demand assumptions; these values are not installed capacity or realized savings.",
        "widget": "solar-results"
      },
      {
        "heading": "From rooftop to energy model",
        "text": "At East Campus Garage, I compared the REopt recommendation with a PV Studio 2 layout informed by a Solar Pathfinder shading survey. The report notes uncertainty in PV Studio 2’s financial calculations, so the cross-check is most useful for understanding layout, shading, and energy yield.",
        "photos": [
          {
            "src": "assets/solar-13.jpeg",
            "fit": "contain",
            "caption": "Solar Pathfinder shading observation at East Campus Garage. Research report, Figure 9, page 13."
          },
          {
            "src": "assets/solar-18.png",
            "fit": "contain",
            "caption": "Modeled monthly solar generation and garage demand with assumed EV charging. Research report, Figure 11, page 18."
          }
        ]
      },
      {
        "heading": "What I learned",
        "cards": [
          {
            "tone": "pem",
            "tag": "Engineering judgment",
            "title": "Roof area changes the answer",
            "text": "More conservative usable-area estimates reduced PV sizes and changed the optimal storage requirements. Site constraints belong in the model from the beginning."
          },
          {
            "tone": "bess",
            "tag": "Teamwork",
            "title": "Bring different perspectives together",
            "text": "Working with researchers and campus partners taught me to ask clearer questions, communicate assumptions, and connect data work to a shared engineering decision."
          }
        ],
        "after": "Future validation would refine rooftop measurements and EV charging profiles, then revisit the results using updated loads, technology costs, and tariffs."
      }
    ]
  },
  {
    "id": "air-quality-giga-texas",
    "title": "Air Quality Around Tesla Giga Texas",
    "kind": "Data Analyst Assistant",
    "when": "Aug 2022–May 2023",
    "summary": "Built a Python pipeline that converted 200+ TCEQ permit tables into structured CSV datasets for research on facility air emissions.",
    "cover": "images/project-four/site-map.jpg",
    "meta": [
      [
        "Role",
        "Data Analyst Assistant"
      ],
      [
        "Tools",
        "Python, CSV datasets"
      ],
      [
        "Data",
        "200+ TCEQ regulatory tables"
      ]
    ],
    "intro": "I built an automated Python pipeline to extract and organize 200+ regulatory tables from TCEQ permit PDFs. The datasets organize pollutants, emission points, and short- and long-term permit values so the research team could analyze them consistently. Permit values describe authorized emissions and calculations; they are not measurements of ambient air quality.",
    "heroPhoto": {
      "src": "images/project-four/site-map.jpg",
      "fit": "contain",
      "caption": "Site location map from the permit filing for Tesla Giga Texas at 1 Tesla Road, Austin, Travis County (TCEQ customer number CN604905919, regulated entity number RN111073623). The red outline is the approximate facility boundary and the dashed line is a 3,000 ft buffer, with nearby schools marked. The nearest off-plant receptor is 300 ft from the project’s 13 emission points."
    },
    "chapters": [
      {
        "heading": "From PDF to dataset",
        "text": "Each filing mixes emission summaries, calculation sheets and compliance checklists, with merged headers and numbers in scientific notation. The pipeline turns them into one consistent format.",
        "steps": [
          [
            "Find the tables",
            "Locate emission summaries, calculation sheets and checklists in each permit PDF."
          ],
          [
            "Extract",
            "Pull rows and columns out of the PDF into Python."
          ],
          [
            "Clean and label",
            "Fix merged headers, scientific notation, and blank or redacted cells."
          ],
          [
            "Structure",
            "Organize by emission point, pollutant, short-term (lb/hr) and long-term (tons/yr) values."
          ],
          [
            "Export",
            "Save structured CSV datasets ready for analysis."
          ]
        ],
        "widget": "pdf-csv"
      },
      {
        "heading": "The data I analyzed",
        "text": "One example: a filing for the cell materials process at Giga Texas. It reports emissions from 13 dust collector stacks and an ammonia scrubber, and checks each chemical against its short-term and long-term limits.",
        "widget": "aq-data"
      },
      {
        "heading": "Results and what I learned",
        "text": "The result: 200+ regulatory tables turned into structured CSV datasets that the research team could analyze directly, instead of copying numbers out of PDFs by hand.",
        "cards": [
          {
            "tone": "pem",
            "tag": "Teamwork",
            "title": "Building what the team actually needs",
            "text": "I met regularly with a PhD student and a professor to understand what data they needed and how they planned to use it, then shaped the datasets around their answers."
          },
          {
            "tone": "bess",
            "tag": "Communication",
            "title": "Reaching out early",
            "text": "Asking questions and reaching out as soon as something was unclear kept the work on track. On a team, communication matters as much as the code."
          }
        ]
      }
    ]
  }
];

const EXPERIENCE = [
  {
    "id": "drill-sergeant",
    "title": "Recruit Training Drill Sergeant",
    "kind": "Leadership",
    "when": "Nov 2024–May 2026",
    "summary": "Trained civilians into soldiers through five-to-six-week boot camps, and worked to build a culture where lower ranks could speak up and be heard.",
    "cover": "images/experience/drill-cover.jpg",
    "meta": [
      [
        "Organization",
        "Republic of Korea Army"
      ],
      [
        "Recruits trained",
        "200+"
      ],
      [
        "Training cycles",
        "8"
      ],
      [
        "Recognition",
        "Division Commander Commendation"
      ]
    ],
    "intro": "As a drill sergeant, I took civilians on their first day of boot camp and trained them, start to finish, into soldiers. I trained and commanded more than 200 recruits across eight training cycles, and led 20 drill sergeants through regular briefings and PRC-96K radio coordination.",
    "heroPhoto": {
      "src": "images/experience/drill-portrait.jpg",
      "fit": "photo",
      "caption": "On base during a winter training cycle."
    },
    "chapters": [
      {
        "heading": "What my job was",
        "text": "Boot camp ran five to six weeks. Civilians arrived with no military background, and drill sergeants taught them everything they needed, with clear verbal guidance to keep training safe and disciplined.",
        "steps": [
          [
            "Military culture",
            "Rank, discipline, and how to live and work as a unit."
          ],
          [
            "Weapons handling",
            "Handling a rifle safely and correctly on the range."
          ],
          [
            "Grenades",
            "Safe handling and throwing procedures."
          ],
          [
            "Military tactics",
            "Moving and working together as a team in the field."
          ]
        ],
        "photos": [
          {
            "src": "images/experience/drill-range.jpg",
            "caption": "Supervising recruits on weapons handling at the range."
          },
          {
            "src": "images/experience/drill-tactics.jpg",
            "caption": "Teaching military tactics in the field."
          },
          {
            "src": "images/experience/drill-sergeants.jpg",
            "caption": "With fellow drill sergeants."
          }
        ]
      },
      {
        "heading": "What I learned",
        "cards": [
          {
            "tone": "pem",
            "tag": "Rank",
            "title": "Following before leading",
            "text": "As a lower rank, I followed the orders of higher ranks. As I gained rank, I gained more control and responsibility, and learned what it takes to lead well."
          },
          {
            "tone": "bess",
            "tag": "Communication",
            "title": "Being vocal, and listening",
            "text": "In the field I had to be loud and clear. But I also held meetings to make sure lower-rank soldiers’ voices were heard, not just mine."
          },
          {
            "tone": "ramp",
            "tag": "Culture",
            "title": "Changing the environment",
            "text": "I had been in their shoes, so I knew what they needed. I worked to eliminate hazing and build a culture where people communicate openly and lower ranks can approach higher ranks."
          }
        ],
        "after": "I was awarded the Division Commander Commendation for inspiring leadership and decisive execution."
      }
    ]
  },
  {
    "id": "uab-president",
    "title": "President of CAEE Undergraduate Advisory Board",
    "kind": "Leadership",
    "when": "Sep 2023–May 2024 · Sep 2026–Present",
    "summary": "Leading the CAEE Undergraduate Advisory Board (UAB), and started the Peer Mentor Program, which is now its own student organization.",
    "cover": "images/experience/uab-logo.png",
    "coverFit": "logo",
    "logo": "images/experience/uab-logo.png",
    "meta": [
      [
        "Department",
        "Maseeh Department of Civil, Architectural and Environmental Engineering"
      ],
      [
        "Board",
        "17 members"
      ],
      [
        "Started",
        "Peer Mentor Program"
      ]
    ],
    "intro": "As president, I lead the CAEE Undergraduate Advisory Board (UAB), run meetings with its 17 members, and bring student feedback directly to the Department Chair.",
    "chapters": [
      {
        "heading": "Highlights",
        "photos": [
          {
            "src": "images/experience/uab-ceremony.jpg",
            "caption": "Naming ceremony for the Maseeh Department of Civil, Architectural and Environmental Engineering."
          },
          {
            "src": "images/experience/uab-banquet-wide.jpg",
            "caption": "Distinguished Alumni Banquet, 2026."
          }
        ]
      },
      {
        "heading": "What I do",
        "cards": [
          {
            "tone": "pem",
            "tag": "Leadership",
            "title": "Leading the advisory board",
            "text": "I run board meetings, bring student feedback to the Department Chair, and analyze student survey data with SQL to understand what students are interested in."
          },
          {
            "tone": "bess",
            "tag": "Initiative",
            "title": "Starting the Peer Mentor Program",
            "text": "I initiated the Peer Mentor Program under the board. It has since grown into its own student organization."
          },
          {
            "tone": "charge",
            "tag": "Events",
            "title": "Bringing students together",
            "text": "Coffee chats, meet and greets, an alumni panel, coding workshops and more. I also led the effort to expand course offerings."
          }
        ]
      }
    ]
  },
  {
    "id": "sase-member",
    "title": "Member of SASE",
    "kind": "Membership",
    "when": "August 2026–Present",
    "summary": "Participated in professional development workshops, connected with engineering and technology recruiters, and took part in service and social activities through SASE Texas.",
    "cover": "https://ugc.production.linktr.ee/YpdCtajRrms1BJfDMRmv_fXePR3elgSa8PhF1?io=true&size=avatar-v3_0",
    "coverFit": "logo",
    "logo": "https://ugc.production.linktr.ee/YpdCtajRrms1BJfDMRmv_fXePR3elgSa8PhF1?io=true&size=avatar-v3_0",
    "meta": [
      [
        "Organization",
        "Society of Asian Scientists and Engineers"
      ],
      [
        "Chapter",
        "SASE Texas · UT Austin"
      ],
      [
        "Role",
        "Member"
      ],
      [
        "Dates",
        "August 2026–Present"
      ]
    ],
    "intro": "As a member of the Society of Asian Scientists and Engineers (SASE) at UT Austin, I participated in workshops, networking events, and community activities with other students in STEM.",
    "links": [
      [
        "Visit SASE Texas",
        "https://www.sasetx.org/"
      ],
      [
        "SASE Texas on Instagram",
        "https://www.instagram.com/sasetexas/"
      ]
    ],
    "chapters": [
      {
        "heading": "How I participated",
        "list": [
          "Engaged in professional development workshops focused on technical skills and career readiness within STEM fields.",
          "Built connections with peers and industry professionals through networking events and recruiter sessions with engineering and technology companies.",
          "Participated in community service and social gatherings."
        ]
      },
      {
        "heading": "Community in action",
        "photos": [
          {
            "src": "images/experience/sase-group.jpg",
            "fit": "contain",
            "caption": "With fellow SASE Texas members during a community gathering on campus."
          },
          {
            "src": "images/experience/sase-community.jpg",
            "fit": "contain",
            "caption": "Taking part in a SASE Texas community activity."
          }
        ]
      }
    ]
  },
  {
    "id": "undergraduate-researcher",
    "title": "Undergraduate Researcher · RESET Lab",
    "kind": "Research",
    "when": "Aug 2022–May 2024",
    "summary": "Worked alongside 12 graduate researchers on energy storage and grid decarbonization, with training in offshore wind economics and natural-gas market modeling.",
    "cover": "https://images.squarespace-cdn.com/content/v1/607730b03831da6c19acc216/f6e69f5f-d738-4891-bb25-5c713e09df36/RESET-LAB-Logos_Color.png?format=1000w",
    "meta": [
      [
        "Lab",
        "Rapid Equitable Sustainable Energy Transition Lab"
      ],
      [
        "Team",
        "12 graduate researchers"
      ],
      [
        "Tools",
        "NREL JEDI, GPCM"
      ]
    ],
    "intro": "At the RESET Lab, I worked with a team of 12 graduate researchers studying energy storage and grid decarbonization. I trained in NREL’s JEDI economic impact model and the Gas Pipeline Competition Model (GPCM), building a broader understanding of how energy infrastructure, economics, and operations connect.",
    "chapters": [
      {
        "heading": "The lab’s research",
        "text": "The RESET Lab brings engineering, policy, and data science together to study equitable clean-energy transitions. Its themes include energy and equity, sustainable transportation, energy systems modeling, and clean technology deployment. My role centered on the energy storage and grid decarbonization work described below."
      },
      {
        "heading": "What I did",
        "cards": [
          {
            "tone": "bess",
            "tag": "JEDI training",
            "title": "Offshore wind economics",
            "text": "Trained in NREL’s Jobs and Economic Development Impact model to evaluate offshore-wind project costs and economic output."
          },
          {
            "tone": "charge",
            "tag": "GPCM training",
            "title": "Natural-gas systems",
            "text": "Completed Gas Pipeline Competition Model training, examining natural-gas pricing, pipeline capacity, and storage."
          }
        ]
      },
      {
        "heading": "Learning to work as a research team",
        "text": "Working with different lab members exposed me to different perspectives and ways of approaching a problem. I learned to ask questions, listen to feedback, and communicate my work clearly so I could contribute to a shared goal. That experience strengthened both my technical foundation and my ability to work with a team."
      }
    ],
    "coverFit": "logo",
    "logo": "https://images.squarespace-cdn.com/content/v1/607730b03831da6c19acc216/f6e69f5f-d738-4891-bb25-5c713e09df36/RESET-LAB-Logos_Color.png?format=1000w",
    "links": [
      [
        "Explore RESET Lab research",
        "https://www.reset-lab.com/research"
      ]
    ]
  }
];

// Bibliographic details use publication and university records.
// Personal contributions reflect Jihu's description of his work across these studies.
const PUBLICATIONS = [
  {
    "id": "student-designed-escape-rooms-2022",
    "title": "Expanding Participation through Student-Designed Escape Rooms",
    "authors": "Sandra B. Nite, Michele Roberts, Rachael Jones, and Jihu Lee",
    "venue": "2022 IEEE Frontiers in Education Conference (FIE)",
    "year": "2022",
    "type": "Conference paper",
    "role": "Co-author",
    "url": "https://ieeexplore.ieee.org/document/9962491",
    "doi": "10.1109/FIE56618.2022.9962491",
    "summary": "Examined a summer STEM camp where secondary-school students first solved an instructor-created escape room and then designed their own for other teams. The research explored hands-on learning, collaborative problem-solving, creativity, and student engagement with STEM.",
    "citation": "Nite, S. B., Roberts, M., Jones, R., & Lee, J. (2022). Expanding participation through student-designed escape rooms. In 2022 IEEE Frontiers in Education Conference (FIE). https://doi.org/10.1109/FIE56618.2022.9962491",
    "sources": [
      [
        "Texas A&M research summary",
        "https://hprc.tamu.edu/aces/aces_news.html"
      ],
      [
        "Conference proceedings record",
        "https://www.proceedings.com/content/066/066650webtoc.pdf"
      ]
    ]
  },
  {
    "id": "secondary-stem-career-interest-2021",
    "title": "Secondary Student Influences for Interest in STEM Careers",
    "authors": "Sandra Nite and Ji Hu Lee",
    "venue": "Southwest Educational Research Association · 44th Annual Meeting",
    "year": "2021",
    "type": "Conference presentation",
    "role": "Co-author",
    "url": "https://scholarworks.uttyler.edu/sera2021/conference/instruction/16/",
    "summary": "Analyzed a survey of 50 secondary-school students in Texas to understand influences on their interest in STEM subjects and careers. The study highlighted family encouragement, school experiences, confidence in STEM subjects, teacher support, and special STEM projects.",
    "citation": "Nite, S., & Lee, J. H. (2021, February 4). Secondary student influences for interest in STEM careers [Conference presentation]. Southwest Educational Research Association, 44th Annual Meeting. https://scholarworks.uttyler.edu/sera2021/conference/instruction/16/",
    "sources": []
  }
];

const PUBLICATION_RESEARCH = {
  "intro": "Co-authored education research on students’ interest in STEM careers and their experiences with collaborative, hands-on learning.",
  "roleSummary": "Across these research projects, I combined data analysis with student outreach, survey collection, event organization, and discussions with professors.",
  "contributions": [
    {
      "title": "Data analysis",
      "text": "Organized and analyzed survey responses and student feedback to identify patterns in STEM interests and learning experiences."
    },
    {
      "title": "Student outreach & surveys",
      "text": "Reached out to students, communicated research activities, and supported survey collection and participation."
    },
    {
      "title": "Event organization",
      "text": "Helped coordinate student-facing STEM events and learning activities, supporting communication and participation."
    },
    {
      "title": "Faculty collaboration",
      "text": "Discussed research questions, student feedback, and findings with professors and co-authors to develop shared interpretations."
    }
  ]
};
