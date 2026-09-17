import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Mail, Menu, X, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import emailjs from '@emailjs/browser'
import './App.css'

const skills = [
  ['01', 'Programming', 'Turning tricky logic into clean, reliable systems.', ['C++', 'Java', 'Python']],
  ['02', 'Web development', 'Thoughtful interfaces that make useful tools feel good.', ['HTML', 'CSS', 'JavaScript', 'React']],
  ['03', 'Backend', 'Building APIs and services that keep products moving.', ['Node.js', 'Express', 'REST APIs']],
  ['04', 'Data', 'Designing databases with a practical eye for clarity.', ['MySQL', 'PostgreSQL', 'DBMS']],
  ['05', 'Tools', 'A calm, curious workflow from idea to shipped code.', ['Git', 'GitHub', 'VS Code']],
  ['06', 'Emerging tech', 'Exploring intelligent and connected experiences.', ['AI APIs', 'Chatbots', 'IoT']],
]
const fallbackProjects = [
  ['01', 'AI / Web app', 'AI Script Writer', 'A focused writing companion that turns rough ideas into structured, creative scripts with an AI-assisted workflow.', ['Python', 'Flask', 'AI API']],
  ['02', 'Database system', 'Student Dashboard', 'A database-driven management system demonstrating CRUD operations, indexing, hashing and useful reporting.', ['JavaScript', 'Node.js', 'MySQL']],
  ['03', 'IoT / Hardware', 'HOD Cabin Automation', 'A sensor-led system that automatically controls lights and fans, making everyday spaces more responsive.', ['Arduino', 'Sensors', 'C++']],
  ['04', 'Computer vision', 'Student Focus Assistant', 'A project concept exploring how a laptop camera can help students understand and improve attention.', ['Python', 'OpenCV', 'AI']],
]
const memories = [
  { number: '01', category: 'HACKATHON', title: 'Hackathon', caption: 'Building under pressure.', date: '2025', description: 'A day of ideas, deadlines and making something work together.', image: '/images/memories/hackathon.jpg', size: 'memory-large' },
  { number: '02', category: 'CODING EVENT', title: 'Coding event', caption: 'Learning by doing.', date: '2025', description: 'Showing up, solving problems and learning from every attempt.', image: '/images/memories/coding.jpg', size: 'memory-portrait' },
  { number: '03', category: 'TECH EVENT', title: 'Tech event', caption: 'Exploring the tech community.', date: '2025', description: 'Meeting curious people and seeing the wider world of technology.', image: '/images/memories/event.jpg', size: 'memory-small' },
  { number: '04', category: 'WORKSHOP', title: 'Workshop', caption: 'Always learning something new.', date: '2024', description: 'A hands-on session that turned a new idea into a practical lesson.', image: '/images/memories/workshop.jpg', size: 'memory-wide' },
  { number: '05', category: 'COLLEGE EVENT', title: 'College event', caption: 'Making memories along the way.', date: '2024', description: 'The people, places and small moments that make college memorable.', image: '/images/memories/college-event.jpg', size: 'memory-medium' },
  { number: '06', category: 'TEAM / PROJECT', title: 'Team / project', caption: 'Building together.', date: '2024', description: 'Good work gets better when it is built with good people.', image: '/images/memories/team-project.jpg', size: 'memory-medium' },
]
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }
function Reveal({ children, className = '' }) { return <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }}>{children}</motion.div> }
function Button({ children, dark = false, href = '#' }) { return <a className={`button ${dark ? 'button-dark' : ''}`} href={href}>{children}<ArrowUpRight size={16} strokeWidth={2.5} /></a> }

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactErrors, setContactErrors] = useState({})
  const [contactStatus, setContactStatus] = useState('idle')
  const [projects, setProjects] = useState(fallbackProjects)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState(null)
  const activeMemory = selectedMemory === null ? null : memories[selectedMemory]
  const changeMemory = (direction) => setSelectedMemory((selectedMemory + direction + memories.length) % memories.length)
     const visibleProjects = showAllProjects ? projects : projects.slice(0, 6)
    const updateContactField = (field, value) => setContactForm((current) => ({ ...current, [field]: value }))
    const validateContact = () => {
      const errors = {}
      if (contactForm.name.trim().length < 2) errors.name = 'Please enter at least 2 characters.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email.trim())) errors.email = 'Please enter a valid email.'
      if (contactForm.message.trim().length < 10) errors.message = 'Please enter at least 10 characters.'
      setContactErrors(errors)
      return Object.keys(errors).length === 0
    }
    const submitContact = async (event) => {
      event.preventDefault()
      if (!validateContact()) return
      setContactStatus('sending')
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_v3mgeem',
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_w7gkt7k',
          { name: contactForm.name.trim(), email: contactForm.email.trim(), message: contactForm.message.trim(), from_name: 'Om Satote Portfolio', from_email: contactForm.email.trim(), reply_to: contactForm.email.trim(), user_name: contactForm.name.trim(), user_email: contactForm.email.trim(), to_name: contactForm.name.trim(), to_email: contactForm.email.trim(), subject: 'Thank you for connecting with Om Satote' },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'HWV1j-uwpnUqjkDhc',
        )
        setContactForm({ name: '', email: '', message: '' })
        setContactErrors({})
        setContactStatus('success')
        window.setTimeout(() => setContactStatus('idle'), 3500)
      } catch (error) {
        console.error('EmailJS contact submission failed:', error)
        setContactStatus('error')
      }
    }
  useEffect(() => {
    fetch('https://api.github.com/users/omsatote/repos?sort=updated&per_page=100')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('GitHub repositories unavailable')))
      .then((repositories) => setProjects(repositories.map((repository, index) => [String(index + 1).padStart(2, '0'), repository.language || 'GitHub repository', repository.name, repository.description || 'A project from my developer journey.', repository.topics?.length ? repository.topics.slice(0, 4) : [repository.language || 'Code'], repository.html_url])))
      .catch(() => setProjects(fallbackProjects.map((project) => [...project, 'https://github.com/omsatote'])))
  }, [])
  return <div className="site-shell">
    <nav className="nav wrap"><a className="brand" href="#top">OM<span>•</span>SATOTE</a><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button><div className={`nav-links ${menuOpen ? 'open' : ''}`}>{['about', 'skills', 'projects', 'experience', 'education', 'contact'].map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}>{item}</a>)}<Button href="#contact">Let's talk</Button></div></nav>
    <main id="top">
      <section className="hero wrap"><div className="hero-copy"><div className="eyebrow"><span className="dot" /> Computer engineering · developer · creative builder</div><h1>OM<br /><em>SATOTE</em></h1><div className="hero-detail"><p className="hero-role">Computer Engineering Student<br />& Full-Stack Developer</p><p className="hero-intro">I build practical web applications, intelligent systems and creative digital experiences while continuously learning modern software technologies.</p></div><div className="hero-actions"><Button href="#projects">View my work</Button><Button dark href="#contact">Let's connect</Button></div><div className="location"><MapPin size={15} /> Nashik, Maharashtra <span>•</span> India</div></div><motion.div className="hero-art" aria-hidden="true" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}><motion.img className="art-photo" src="/profile.jpeg" alt="Om Satote" initial={{ opacity: 0, scale: .86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .2, ease: [0.22, 1, 0.36, 1] }} /></motion.div><div className="hero-stats"><div><strong>03<span>+</span></strong><small>Projects</small></div><div><strong>02<span>+</span></strong><small>Internships</small></div><div><strong>05<span>+</span></strong><small>Technologies</small></div><div><strong>∞</strong><small>Ideas</small></div></div></section>
      <div className="marquee"><div>MAKE IT USEFUL <span>✳</span> MAKE IT HUMAN <span>✳</span> MAKE IT MATTER <span>✳</span> MAKE IT USEFUL <span>✳</span></div></div>
      <section className="section wrap about" id="about"><Reveal><div className="section-kicker">01 / About me</div><h2>More than<br /><em>just code.</em></h2></Reveal><Reveal className="about-content"><p className="lead">I’m a Computer Engineering student passionate about software development, AI, web technologies, databases and building useful real-world projects.</p><div className="about-card"><div className="card-mark">OS<span>↗</span></div><div className="about-grid"><div><span>Who I am</span><p>A builder in progress, always asking better questions.</p></div><div><span>What I build</span><p>Web apps, systems and small ideas with a big purpose.</p></div><div><span>What I'm learning</span><p>DSA, AI, scalable backend systems and product thinking.</p></div><div><span>What I want</span><p>To work with people who care about the details.</p></div></div><div className="tag-row">{['C++', 'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'DBMS', 'Git', 'AI'].map((tag) => <span key={tag}>{tag}</span>)}</div></div></Reveal></section>
      <section className="section dark-section" id="skills"><div className="wrap"><Reveal><div className="section-kicker light">02 / Capabilities</div><h2>Things I<br /><em>build with.</em></h2></Reveal><div className="skill-grid">{skills.map(([number, title, text, tags], index) => <Reveal key={title}><article className={`skill-card ${index === 1 || index === 4 ? 'yellow' : ''}`}><div className="card-top"><span>{number}</span><ArrowUpRight /></div><h3>{title}</h3><p>{text}</p><div className="tag-row">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article></Reveal>)}</div></div></section>
      <section className="section wrap projects" id="projects"><Reveal><div className="section-kicker">03 / GitHub projects</div><div className="section-heading"><h2>Things I've<br /><em>built.</em></h2><p>Every public repository is a small record of what I was learning and building.</p></div></Reveal><div className="project-list">{visibleProjects.map(([number, category, title, text, tags, url], index) => <Reveal key={`${title}-${number}`}><a className={`project-card ${index % 2 ? 'offset' : ''}`} href={url || 'https://github.com/omsatote'} target="_blank" rel="noreferrer"><div className="project-number">{number}</div><div className="project-body"><span className="project-category">{category}</span><h3>{title}</h3><p>{text}</p><div className="tag-row">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div><span className="text-link">Open on GitHub <ArrowUpRight size={18} /></span></div><div className="project-shape" aria-hidden="true"><div /></div></a></Reveal>)}</div><div className="projects-toggle"><button className="button" type="button" onClick={() => setShowAllProjects(!showAllProjects)}>{showAllProjects ? 'Show fewer projects' : 'View all projects'} <ArrowUpRight size={16} /></button></div></section>
      <section className="section timeline-section" id="experience"><div className="wrap"><Reveal><div className="section-kicker">04 / The road so far</div><h2>Where I've<br /><em>learned.</em></h2></Reveal><div className="timeline"><Reveal><div className="timeline-item"><span className="timeline-date">2025 — now</span><div><span className="pill yellow-pill">Experience</span><h3>Software & Web Development</h3><p>Learning through internships, independent builds and the daily practice of turning a blank screen into something useful.</p></div></div></Reveal><Reveal><div className="timeline-item"><span className="timeline-date">2023 — now</span><div><span className="pill">Education</span><h3>B.Tech Computer Engineering</h3><p>Matoshree College of Engineering and Research Centre, Nashik. Exploring the foundations behind modern software.</p></div></div></Reveal><Reveal><div className="timeline-item"><span className="timeline-date">Always</span><div><span className="pill green-pill">Practice</span><h3>Hackathons, workshops & challenges</h3><p>Collecting the kind of problems that make me curious enough to stay up and solve them.</p></div></div></Reveal></div></div></section>
      <section className="section wrap memories-section" id="education"><Reveal><div className="section-kicker">05 / Wall of memories</div><div className="education-heading"><h2>Moments<br />that made<br /><em>the journey.</em></h2><p>Real moments, real people, and the small experiences that keep me moving forward.</p></div></Reveal><div className="memory-wall">{memories.map((memory, index) => <Reveal key={memory.number} className={`memory-reveal ${memory.size}`}><button className="memory-card" type="button" onClick={() => setSelectedMemory(index)}><div className="memory-image-wrap"><img src={memory.image} alt={memory.title} onError={(event) => { event.currentTarget.style.display = 'none' }} /><div className="memory-placeholder">{memory.category}<span>Photo coming soon</span></div><span className="memory-number">{memory.number} / {memory.category}</span><span className="memory-arrow"><ArrowUpRight size={18} /></span></div><div className="memory-caption"><span>{memory.caption}</span><ArrowUpRight size={16} /></div></button></Reveal>)}</div><div className="memory-footer"><p>Some moments are better remembered than explained.</p><a className="button" href="#contact">See the journey</a></div></section>
      {activeMemory && <motion.div className="memory-modal-backdrop" role="dialog" aria-modal="true" aria-label={activeMemory.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMemory(null)}><motion.div className="memory-modal" initial={{ opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: .96 }} onClick={(event) => event.stopPropagation()}><button className="memory-close" type="button" onClick={() => setSelectedMemory(null)} aria-label="Close memory"><X /></button><div className="modal-image"><img src={activeMemory.image} alt={activeMemory.title} onError={(event) => { event.currentTarget.style.display = 'none' }} /><div className="memory-placeholder">{activeMemory.category}<span>Upload your photo to see it here</span></div></div><div className="modal-copy"><span className="project-category">{activeMemory.number} / {activeMemory.category}</span><h3>{activeMemory.title}</h3><span className="modal-date">{activeMemory.date}</span><p>{activeMemory.description}</p></div><div className="modal-controls"><button type="button" onClick={() => changeMemory(-1)} aria-label="Previous memory"><ChevronLeft /></button><span>{String(selectedMemory + 1).padStart(2, '0')} / 06</span><button type="button" onClick={() => changeMemory(1)} aria-label="Next memory"><ChevronRight /></button></div></motion.div></motion.div>}
      <section className="wins"><div className="wrap"><Reveal><div className="section-kicker">06 / Small wins</div><h2>14 projects.<br /><em>Still building.</em></h2></Reveal><div className="wins-grid">{[
        ['14+', 'PROJECTS BUILT', 'From AI and web applications to IoT projects.'],
        ['02+', 'INTERNSHIPS', 'Real-world development experience.'],
        ['10+', 'CERTIFICATIONS', 'Continuous learning across technology and development.'],
        ['02+', 'HACKATHONS WON', 'Building innovative solutions under pressure.'],
        ['01', 'TECH COMMUNITY FOUNDED', 'Creating spaces for students to learn and collaborate.'],
        ['OPEN', 'SOURCE CONTRIBUTOR', 'Contributing, experimenting and learning in public.'],
      ].map(([number, label, description]) => <Reveal key={label}><div className="win"><motion.strong className="win-number" initial={{ opacity: 0, y: 20, scale: .9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .6, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }}>{number}</motion.strong><span>{label}</span><p>{description}</p></div></Reveal>)}</div><Reveal><p className="wins-statement">Not chasing numbers.<br />Chasing <em>progress.</em></p></Reveal></div></section>
      <section className="contact dark-section" id="contact"><div className="wrap contact-grid"><Reveal><div className="section-kicker light">07 / Say hello</div><h2>Let's build<br /><em>something.</em></h2><p>Have an idea, opportunity, internship or project? Let's connect.</p><div className="contact-links"><a href="mailto:om.satote@example.com"><Mail size={17} /> Email me <ArrowUpRight size={16} /></a><a href="https://linkedin.com" target="_blank" rel="noreferrer"><span>in</span> LinkedIn <ArrowUpRight size={16} /></a><a href="https://github.com" target="_blank" rel="noreferrer"><span>gh</span> GitHub <ArrowUpRight size={16} /></a></div></Reveal><Reveal><form onSubmit={submitContact} noValidate><label>Name<input value={contactForm.name} onChange={(event) => updateContactField('name', event.target.value)} placeholder="Your name" aria-invalid={!!contactErrors.name} />{contactErrors.name && <small className="form-error">{contactErrors.name}</small>}</label><label>Email<input value={contactForm.email} onChange={(event) => updateContactField('email', event.target.value)} type="email" placeholder="you@example.com" aria-invalid={!!contactErrors.email} />{contactErrors.email && <small className="form-error">{contactErrors.email}</small>}</label><label>Message<textarea value={contactForm.message} onChange={(event) => updateContactField('message', event.target.value)} placeholder="Tell me a little about it..." rows="4" aria-invalid={!!contactErrors.message} />{contactErrors.message && <small className="form-error">{contactErrors.message}</small>}</label>{contactStatus === 'success' && <p className="form-success" role="status">✓ MESSAGE SENT<br /><span>Thanks for reaching out. Check your inbox for a confirmation.</span></p>}{contactStatus === 'error' && <p className="form-error form-status" role="alert">Something went wrong. Please try again or email me directly.</p>}<button className="button" type="submit" disabled={contactStatus === 'sending'}>{contactStatus === 'sending' ? 'Sending...' : contactStatus === 'success' ? 'Message sent ✓' : 'Send message'} {contactStatus === 'sending' ? <span className="loading-dot" /> : <ArrowUpRight size={16} />}</button></form></Reveal></div></section>
    </main>
    <footer className="footer wrap"><div><a className="brand" href="#top">OM<span>•</span>SATOTE</a><p>Computer Engineering Student · Developer · Builder</p></div><div className="footer-right"><div className="footer-nav">{['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</div><p>© 2026 Om Satote. Built with curiosity & code.</p></div></footer>
  </div>
}
export default App
