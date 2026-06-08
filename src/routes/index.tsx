import { createFileRoute } from "@tanstack/react-router";
import { SideNav } from "../components/SideNav";
import { ThemeToggle } from "../components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <>
      <ThemeToggle />
      <SideNav />

      <main className="container-fluid p-0">
        <section
          className="resume-section p-3 p-lg-5 d-flex d-column"
          id="about"
          aria-labelledby="about-heading"
        >
          <div className="about-inner my-auto">
            <h1 className="about-name" id="about-heading">
              Kotteeswari
              <span className="text-primary"> (Koti) </span>
            </h1>

            <ul className="about-details list-unstyled" aria-label="Contact details">
              <li className="about-detail">
                <i className="fa fa-map-marker about-detail-icon" aria-hidden="true"></i>
                <span>Brisbane, Australia</span>
              </li>
              <li className="about-detail">
                <i className="fa fa-phone about-detail-icon" aria-hidden="true"></i>
                <a
                  href="tel:+61493451162"
                  aria-label="Call Kotteeswari Ganesh at +61 493 451 162"
                >
                  +61 493 451 162
                </a>
              </li>
              <li className="about-detail">
                <i className="fa fa-envelope about-detail-icon" aria-hidden="true"></i>
                <a
                  href="mailto:Kotteeswarieasu@gmail.com"
                  aria-label="Email Kotteeswari Ganesh"
                >
                  Kotteeswarieasu@gmail.com
                </a>
              </li>
            </ul>

            <div className="about-bio-card">
              <p className="about-bio-lead">
                <strong>I have,</strong>
              </p>
              <ul className="about-bio">
                <li>
                  <span className="bullet-tick" aria-hidden="true">
                    <i className="fa fa-check"></i>
                  </span>
                  <span className="bullet-text">
                    One year of experience as a{" "}
                    <strong>Software Engineer</strong>
                  </span>
                </li>
                <li>
                  <span className="bullet-tick" aria-hidden="true">
                    <i className="fa fa-check"></i>
                  </span>
                  <span className="bullet-text">
                    Strong fundamentals in software engineering
                  </span>
                </li>
                <li>
                  <span className="bullet-tick" aria-hidden="true">
                    <i className="fa fa-check"></i>
                  </span>
                  <span className="bullet-text">
                    Always curious about how things work under the hood
                  </span>
                </li>
                <li>
                  <span className="bullet-tick" aria-hidden="true">
                    <i className="fa fa-check"></i>
                  </span>
                  <span className="bullet-text">
                    Hands-on experience with{" "}
                    <strong>HTML, CSS, Python, and basic JavaScript</strong>
                  </span>
                </li>
                <li>
                  <span className="bullet-tick" aria-hidden="true">
                    <i className="fa fa-check"></i>
                  </span>
                  <span className="bullet-text">
                    Worked on live projects and collaborated with
                    cross-functional teams
                  </span>
                </li>
                <li>
                  <span className="bullet-tick" aria-hidden="true">
                    <i className="fa fa-check"></i>
                  </span>
                  <span className="bullet-text">
                    Selected in Australia's{" "}
                    <strong>
                      MATES ballot (Subclass 403 - Mobility Arrangement for
                      Talented Early-professionals Scheme)
                    </strong>
                    , with full working rights in Australia
                  </span>
                </li>
              </ul>
            </div>

            <p className="about-cta">
              <strong>
                Actively seeking new opportunities in software engineering and
                backend development, let's connect.
              </strong>
            </p>

            <div className="about-actions">
              <a
                href="/static/docs/Kotteeswari_Ganesh_Resume.pdf"
                download
                className="download-button"
                target="_blank"
                rel="noopener"
                type="application/pdf"
                aria-label="Download Kotteeswari Ganesh's resume (PDF)"
              >
                Download Resume
              </a>

              <ul
                className="list-inline list-social-icons mb-0"
                aria-label="Social profiles"
              >
              <li className="list-inline-item">
                <a
                  href="https://www.linkedin.com/in/KotteeswariG"
                  target="_blank"
                  rel="noopener me"
                  aria-label="Kotteeswari Ganesh on LinkedIn"
                >
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-circle fa-stack-2x" aria-hidden="true"></i>
                    <i className="fa fa-linkedin fa-stack-1x fa-inverse" aria-hidden="true"></i>
                  </span>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://github.com/KotteeswariG"
                  target="_blank"
                  rel="noopener me"
                  aria-label="Kotteeswari Ganesh on GitHub"
                >
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-circle fa-stack-2x" aria-hidden="true"></i>
                    <i className="fa fa-github fa-stack-1x fa-inverse" aria-hidden="true"></i>
                  </span>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://x.com/KotteeswariG"
                  target="_blank"
                  rel="noopener me"
                  aria-label="Kotteeswari Ganesh on X (Twitter)"
                >
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-circle fa-stack-2x" aria-hidden="true"></i>
                    <i className="fa fa-twitter fa-stack-1x fa-inverse" aria-hidden="true"></i>
                  </span>
                </a>
              </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className="resume-section p-3 p-lg-5 d-flex flex-column"
          id="experience"
          aria-labelledby="experience-heading"
        >
          <div className="my-auto">
            <h2 className="mb-5" id="experience-heading">Experience</h2>

            <div className="experience-company">
              <div className="experience-company-main">
                <div>
                  <h3 className="experience-company-name mb-0">
                    Blinking Soft
                  </h3>
                  <p className="experience-location mb-0">
                    Coimbatore, Tamilnadu
                  </p>
                </div>
                <p className="experience-company-duration mb-0">1 yr 3 mos</p>
              </div>
            </div>

            <div className="experience-timeline">
              <div className="experience-role">
                <span className="experience-dot" aria-hidden="true"></span>
                <div className="experience-role-row">
                  <div className="experience-role-content">
                    <h3 className="mb-0">Junior Software Engineer</h3>
                    <p className="experience-meta mb-2">
                      June 2024 - May 2025
                    </p>
                    <p className="experience-description mb-0">
                      Worked on software development activities and contributed
                      to application features, bug fixing, and testing. Gained
                      practical experience in backend logic, team collaboration,
                      and maintaining project quality.
                    </p>
                  </div>
                  <p className="experience-role-type mb-0">
                    Full-time
                  </p>
                </div>
              </div>

              <div className="experience-role">
                <span className="experience-dot" aria-hidden="true"></span>
                <div className="experience-role-row">
                  <div className="experience-role-content">
                    <h3 className="mb-0">Software Engineer Intern</h3>
                    <p className="experience-meta mb-2">
                      April 2024 - June 2024
                    </p>
                    <p className="experience-description mb-0">
                      Worked as an intern and supported the team in basic
                      software development tasks. Learned to understand
                      requirements, write clean code, and coordinate with senior
                      team members during project work.
                    </p>
                  </div>
                  <p className="experience-role-type mb-0">
                    Internship
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="resume-section p-3 p-lg-5 d-flex flex-column"
          id="projects"
          aria-labelledby="projects-heading"
        >
          <div className="my-auto">
            <h2 className="mb-5" id="projects-heading">Projects</h2>

            <div className="row">
              <ProjectCard
                title="Capstone Project"
                href="https://github.com/KotteeswariG"
                description="Leveraged a locally-run LLM to comprehend Wikipedia articles and generate self-explaining short videos that help users quickly grasp the key ideas of an article."
                badges={[
                  { label: "Python", variant: "primary" },
                  { label: "Machine Learning", variant: "info" },
                  { label: "LLM", variant: "secondary" },
                  { label: "NLP", variant: "info" },
                ]}
              />

              <ProjectCard
                title="Portfolio Website"
                href="https://github.com/KotteeswariG/KotteeswariG-portfolio"
                description="Built a personal portfolio website using HTML, CSS, and JavaScript to showcase projects and skills with a responsive design."
                badges={[
                  { label: "HTML", variant: "primary" },
                  { label: "CSS", variant: "info" },
                  { label: "JavaScript", variant: "secondary" },
                ]}
              />

              <ProjectCard
                title="Task Manager"
                href="https://github.com/KotteeswariG"
                description="Developed a task manager with HTML, CSS, and JavaScript that lets users add, delete, and track daily tasks through a clean, responsive interface."
                badges={[
                  { label: "HTML", variant: "primary" },
                  { label: "CSS", variant: "info" },
                  { label: "Bootstrap", variant: "info" },
                  { label: "JavaScript", variant: "secondary" },
                ]}
              />

              <ProjectCard
                title="Weather App"
                href="https://github.com/KotteeswariG"
                description="Built a weather app in JavaScript that calls a public weather API to fetch real-time conditions and short-range forecasts based on the user's location."
                badges={[
                  { label: "JavaScript", variant: "primary" },
                  { label: "API", variant: "info" },
                  { label: "HTML", variant: "secondary" },
                  { label: "CSS", variant: "info" },
                ]}
              />
            </div>
          </div>
        </section>

        <section
          className="resume-section p-3 p-lg-5 d-flex flex-column"
          id="skills"
          aria-labelledby="skills-heading"
        >
          <div className="skills-inner">
            <h2 className="skills-title" id="skills-heading">Skills</h2>
            <p className="skills-subtitle">
              A concise overview of the languages, tools, and skills I work
              with.
            </p>

            <div className="skills-divider" aria-hidden="true"></div>

            <div className="skills-quad-grid">
              <section className="skills-section">
                <h3>Programming Languages</h3>
                <ul className="skills-list">
                  <li>Python</li>
                  <li>TypeScript</li>
                  <li>HTML</li>
                  <li>CSS</li>
                </ul>
              </section>

              <section className="skills-section">
                <h3>Frameworks &amp; Libraries</h3>
                <ul className="skills-list">
                  <li>Flask</li>
                  <li>FastAPI</li>
                  <li>Express.js</li>
                  <li>Streamlit</li>
                </ul>
              </section>

              <section className="skills-section">
                <h3>AWS &amp; Cloud Services</h3>
                <ul className="skills-list">
                  <li>AWS Lambda</li>
                  <li>S3</li>
                  <li>SES</li>
                  <li>SNS</li>
                  <li>Docker</li>
                </ul>
              </section>

              <section className="skills-section">
                <h3>Data &amp; Databases</h3>
                <ul className="skills-list">
                  <li>MySQL</li>
                  <li>Cosmos DB</li>
                  <li>Airflow</li>
                  <li>ETL</li>
                </ul>
              </section>
            </div>

            <div className="skills-divider" aria-hidden="true"></div>

            <div className="skills-trio-grid">
              <section className="skills-section">
                <h3>Tools &amp; Collaboration</h3>
                <ul className="skills-list">
                  <li>
                    <strong>Git &amp; GitLab:</strong> Version control and
                    collaboration on team repositories.
                  </li>
                  <li>
                    <strong>Jira:</strong> Task management and sprint tracking.
                  </li>
                  <li>
                    <strong>Confluence:</strong> Technical documentation and
                    knowledge sharing.
                  </li>
                  <li>
                    <strong>Code Review:</strong> Reviewing pull requests and
                    giving constructive feedback to teammates.
                  </li>
                </ul>
              </section>

              <section className="skills-section">
                <h3>Core Competencies</h3>
                <ul className="skills-list">
                  <li>
                    <strong>Backend development:</strong> One year's industry
                    experience as a Software Engineer.
                  </li>
                  <li>
                    <strong>Web development:</strong> Building responsive,
                    standards-compliant websites with HTML, CSS, and
                    TypeScript.
                  </li>
                  <li>
                    <strong>Python programming:</strong> Writing scripts,
                    automating tasks, and prototyping backend logic.
                  </li>
                  <li>
                    <strong>Version control:</strong> Day-to-day Git and GitLab
                    use across collaborative projects.
                  </li>
                </ul>
              </section>

              <section className="skills-section">
                <h3>Soft Skills</h3>
                <ul className="skills-list">
                  <li>
                    <strong>Problem-solving:</strong> Breaking down technical
                    challenges and working through them methodically.
                  </li>
                  <li>
                    <strong>Teamwork:</strong> Collaborating effectively within
                    cross-functional teams.
                  </li>
                  <li>
                    <strong>Communication:</strong> Clear written and verbal
                    communication when presenting work and ideas.
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </section>

        <section
          className="resume-section p-3 p-lg-5 d-flex flex-column"
          id="education"
          aria-labelledby="education-heading"
        >
          <div className="my-auto">
            <h2 className="mb-5" id="education-heading">Education</h2>

            <div className="resume-item d-flex flex-column flex-md-row mb-3">
              <div className="resume-content mr-auto">
                <h3 className="mb-0">Jaya Engineering College</h3>
                <div className="subheading mb-3">
                  Thiruninravur, Chennai, India
                </div>
                <div>Bachelor of Engineering (Computer Science)</div>
                <p>
                  GPA: 8.26 / 10 (Indian scale - equivalent to a Distinction
                  / WAM ~78 in the Australian system)
                </p>
              </div>
              <div className="resume-date text-md-right">
                <span className="text-primary">May 2020 – May 2024</span>
              </div>
            </div>

            <div className="resume-item d-flex flex-column flex-md-row mb-3">
              <div className="resume-content mr-auto">
                <h3 className="mb-0">
                  Government Trade Apprenticeship - Indian Railways
                </h3>
                <div className="subheading mb-1">Perambur, Chennai, India</div>
                <div>
                  Mechanical Fitter Trade - 2 year technical apprenticeship
                  in workshop practice and mechanical fitting.
                </div>
              </div>
              <div className="resume-date text-md-right">
                <span className="text-primary">April 2018 – April 2020</span>
              </div>
            </div>

            <div className="resume-item d-flex flex-column flex-md-row">
              <div className="resume-content mr-auto">
                <h3 className="mb-0">Immaculate Higher Secondary School</h3>
                <div className="subheading mb-3">Avadi, Chennai, India</div>
                <div>
                  Year 11 – Year 12, Senior Secondary Certificate (Computer
                  Science stream)
                </div>
              </div>
              <div className="resume-date text-md-right">
                <span className="text-primary">March 2016 – May 2018</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="resume-section p-3 p-lg-5 d-flex flex-column"
          id="interests"
          aria-labelledby="interests-heading"
        >
          <div className="my-auto">
            <h2 className="mb-5" id="interests-heading">Interests</h2>
            <p>
              Outside of my academic work, I’ve been exploring both fun and
              tech-related interests:
            </p>
            <ul className="portfolio-list">
              <li>
                Learning more about{" "}
                <strong>Data Structures and Algorithms (DSA)</strong> to sharpen
                my coding abilities.
              </li>
              <li>Learning and exploring new AI tools</li>
              <li>
                Experimenting with <strong>web development</strong> projects to
                improve my front-end and back-end skills.
              </li>
              <li>
                Watching new releases, especially Tamil and South-Indian
                cinema, plus <strong>sci-fi</strong> films.
              </li>
              <li>
                Relaxing with some <strong>gardening</strong> and trying out
                creative <strong>nail art</strong>.
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}

type Badge = {
  label: string;
  variant: "primary" | "info" | "secondary";
};

function ProjectCard({
  title,
  href,
  description,
  badges,
}: {
  title: string;
  href: string;
  description: string;
  badges: Badge[];
}) {
  return (
    <article className="col-md-4 mb-4">
      <div className="card project-card">
        <div className="card-body">
          <h3 className="card-title h5">
            {title}
            <a
              href={href}
              target="_blank"
              rel="noopener"
              className="float-right"
              aria-label={`${title} on GitHub`}
            >
              <i className="fa fa-github" aria-hidden="true"></i>
            </a>
          </h3>
          <p className="card-text">{description}</p>
          <ul className="list-inline mb-0" aria-label={`${title} technologies`}>
            {badges.map((b) => (
              <li key={b.label} className="list-inline-item">
                <span className={`badge badge-${b.variant}`}>{b.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
