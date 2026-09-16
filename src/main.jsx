import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,useLocation,useNavigate,useParams,Link,Routes,Route,Navigate} from 'react-router-dom';
import {ArrowUpRight,ArrowRight,Menu,X,Search,Mail,MapPin,Clock,Check,ChevronLeft,ChevronRight,Instagram,Linkedin,Github,Dribbble,ExternalLink,LogOut,Plus,Trash2,Edit3,Image as ImageIcon,Eye,EyeOff,LockKeyhole,ShieldCheck,User,Settings,Palette,ChevronDown,GripVertical,Sun,Moon} from 'lucide-react';
import './styles.css';

const img=(name)=>name.startsWith('moota-images/')?`/${name}`:`/images/${name}`;
const seedProjects=[
 {id:'1',slug:'moota-payment-platform',title:'Moota',category:'Fintech',type:'UI/UX',year:'2024',description:'A calmer command center for teams managing payments and cash flow.',cover:img('moota-image.png'),client:'Moota',role:'Lead Product Designer',duration:'6 months',tools:['Figma','FigJam','React'],gallery:[img('moota-image.png'),img('moota-images/moota-image-1.png'),img('moota-images/moota-image-2.png')],featured:true},
 {id:'2',slug:'rumah-yatim-digital',title:'Rumah Yatim',category:'Mobile',type:'UI/UX',year:'2023',description:'Making everyday giving more transparent, accessible, and human.',cover:img('RY.png'),client:'Rumah Yatim',role:'Product Designer',duration:'4 months',tools:['Figma','Research'],gallery:[img('RY.png'),img('dakwah-unisba-logo.png')]},
 {id:'3',slug:'traksee-logistics',title:'Traksee',category:'SaaS',type:'Web',year:'2023',description:'Real-time fleet visibility for modern logistics operators.',cover:img('traksee-ilustration.png'),client:'Traksee',role:'UX/UI Designer',duration:'3 months',tools:['Figma','Prototyping'],gallery:[img('traksee-ilustration.png')]},
 {id:'4',slug:'bargo-brand-system',title:'Bargo',category:'Branding',type:'Branding',year:'2022',description:'A warm, confident identity for a new generation of builders.',cover:img('bargo-image.png'),client:'Bargo',role:'Brand Designer',duration:'2 months',tools:['Illustrator','Figma'],gallery:[img('bargo-image.png'),img('logo-bargo.png')]}
];
const seedArticles=[
 {id:'1',slug:'how-to-design-better-dashboards',title:'How to design dashboards people actually use',excerpt:'A practical field guide to hierarchy, context, and momentum in complex products.',category:'Product Design',tags:['UX','Dashboards'],date:'2024-08-18',read:'7 min',cover:img('moota-image.png'),content:['The best dashboard is not the one with the most charts. It is the one that helps someone make a confident decision in the next thirty seconds.','Start by understanding the questions your users ask every morning. Then create a visual hierarchy that answers those questions in order.','Good design creates momentum: clear defaults, useful empty states, and just enough detail to act.']},
 {id:'2',slug:'design-systems-that-scale',title:'Design systems that scale with your team',excerpt:'Principles for building a shared language without slowing down delivery.',category:'UI/UX',tags:['Systems','Collaboration'],date:'2024-07-09',read:'6 min',cover:img('moota-images/moota-image-2.png'),content:['A design system is a product your team uses to build products. Treat it with the same care: clear owners, feedback loops, and a roadmap.','Start small with the primitives that create the most friction. Document decisions, not just components.']},
 {id:'3',slug:'from-brief-to-breakthrough',title:'From brief to breakthrough: a product discovery ritual',excerpt:'How a focused week of discovery turns fuzzy ambition into a sharp direction.',category:'Career',tags:['Process','Research'],date:'2024-05-22',read:'5 min',cover:img('RY.png'),content:['Discovery is where teams earn the right to move fast. A focused week can align a room around the customer, the constraint, and the opportunity.','Make the work visible and invite the right voices early.']},
 {id:'4',slug:'the-case-for-quiet-interfaces',title:'The case for quiet interfaces',excerpt:'Less noise is not less personality. It is more room for the important stuff.',category:'UI/UX',tags:['Visual Design'],date:'2024-03-12',read:'4 min',cover:img('traksee-ilustration.png'),content:['The strongest interfaces create a sense of ease. They use contrast, rhythm, and restraint to help users feel capable.']}
];
const categories=['All','UI/UX','Web','Mobile','SaaS','Fintech','Branding'];
const articleCategories=['All','UI/UX','Product Design','Career','Technology'];
const defaultPublicMenu=[{id:'about',label:'About',path:'/about',enabled:true},{id:'projects',label:'Projects',path:'/projects',enabled:true},{id:'articles',label:'Articles',path:'/articles',enabled:true},{id:'contact',label:'Contact',path:'/contact',enabled:true}];
const readPublicMenu=()=>{try{const value=JSON.parse(localStorage.getItem('public-menu'));return Array.isArray(value)?value:defaultPublicMenu}catch{return defaultPublicMenu}};
const defaultFavicon='/images/favicon.ico';
const readFavicon=()=>localStorage.getItem('site-favicon')||defaultFavicon;
const applyFavicon=()=>{let link=document.head.querySelector('link[data-site-favicon]');if(!link){link=document.createElement('link');link.rel='icon';link.dataset.siteFavicon='true';document.head.appendChild(link)}link.href=readFavicon()};
const defaultLogo='';
const readLogo=()=>localStorage.getItem('site-logo')||defaultLogo;
const defaultSocialLinks=[{id:'linkedin',label:'LinkedIn',url:'https://linkedin.com',icon:'Linkedin',enabled:true},{id:'github',label:'GitHub',url:'https://github.com',icon:'Github',enabled:true},{id:'dribbble',label:'Dribbble',url:'https://dribbble.com',icon:'Dribbble',enabled:true},{id:'custom-social',label:'Custom social media',url:'',icon:'ExternalLink',enabled:false,customIcon:''}];
const socialIcons={Linkedin,Github,Dribbble,Instagram,ExternalLink};
const readSocialLinks=()=>{try{const value=JSON.parse(localStorage.getItem('social-links'));return Array.isArray(value)?value:defaultSocialLinks}catch{return defaultSocialLinks}};
const defaultSEOSettings={title:'Fahmi — Product Designer',description:'Fahmi is a product designer creating clear, thoughtful digital experiences.',keywords:'product design, UX, UI/UX, digital products',image:'/images/fahmi.png'};
const readSEOSettings=()=>{try{return {...defaultSEOSettings,...JSON.parse(localStorage.getItem('site-seo'))}}catch{return defaultSEOSettings}};
const ADMIN_EMAIL='ffaisalfahmi@gmail.com';
const INITIAL_ADMIN_PASSWORD='P4$sword123!@';
const readAdminPassword=()=>{if(localStorage.getItem('admin-password-version')!=='active'){localStorage.setItem('admin-password',INITIAL_ADMIN_PASSWORD);localStorage.setItem('admin-password-version','active')}return localStorage.getItem('admin-password')||INITIAL_ADMIN_PASSWORD};

function useSEO({title='Fahmi — Product Designer',description='Fahmi is a product designer creating clear, thoughtful digital experiences.',type='website',image='/images/fahmi.png'}={}){const settings=readSEOSettings();let articleSEO=null;if(type==='article'){try{const articles=JSON.parse(localStorage.getItem('articles'))||[];articleSEO=articles.find(article=>location.pathname.endsWith(article.slug))||null}catch{}}const resolvedTitle=articleSEO?.seoTitle||((title===defaultSEOSettings.title&&settings.title)?settings.title:title);const resolvedDescription=articleSEO?.seoDescription||((description===defaultSEOSettings.description&&settings.description)?settings.description:description);const resolvedImage=articleSEO?.seoImage||((image===defaultSEOSettings.image&&settings.image)?settings.image:image);const resolvedKeywords=articleSEO?.seoKeywords||settings.keywords;const resolvedImageUrl=new URL(resolvedImage,location.origin).href;const resolvedType=type==='article'?'article':'website';useEffect(()=>{document.title=resolvedTitle;applyFavicon(); const setMeta=(attribute,key,value)=>{let e=document.head.querySelector(`meta[${attribute}="${key}"]`);if(!e){e=document.createElement('meta');e.setAttribute(attribute,key);document.head.appendChild(e)}e.setAttribute('content',value)};setMeta('name','description',resolvedDescription);setMeta('name','keywords',resolvedKeywords);setMeta('property','og:title',resolvedTitle);setMeta('property','og:description',resolvedDescription);setMeta('property','og:image',resolvedImageUrl);setMeta('property','og:image:alt',resolvedTitle);setMeta('property','og:type',resolvedType);setMeta('property','og:url',location.href);setMeta('name','twitter:card','summary_large_image');setMeta('name','twitter:title',resolvedTitle);setMeta('name','twitter:description',resolvedDescription);setMeta('name','twitter:image',resolvedImageUrl);let old=document.getElementById('jsonld');if(old)old.remove();let s=document.createElement('script');s.id='jsonld';s.type='application/ld+json';s.textContent=JSON.stringify({"@context":'https://schema.org',"@type":type==='article'?'Article':'Person',name:'Fahmi',url:location.href,description:resolvedDescription,image:resolvedImageUrl});document.head.appendChild(s);return()=>s.remove()},[resolvedTitle,resolvedDescription,resolvedImageUrl,resolvedKeywords,resolvedType,type])}
function ThemeToggle(){const [light,setLight]=useState(()=>localStorage.getItem('theme')==='light');useEffect(()=>{document.documentElement.classList.toggle('light-mode',light);localStorage.setItem('theme',light?'light':'dark')},[light]);return <button type="button" onClick={()=>setLight(value=>!value)} aria-label={light?'Switch to dark mode':'Switch to light mode'} title={light?'Switch to dark mode':'Switch to light mode'} className="theme-toggle grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 hover:border-accent hover:text-white">{light?<Moon size={17}/>:<Sun size={17}/>}</button>}
function BrandMark({compact=false}){const logo=readLogo();return logo?<img src={logo} alt="Fahmi" className={compact?'h-9 w-9 rounded-xl object-contain':'h-10 w-10 rounded-2xl object-contain'}/>:<span className={compact?'grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-cyan text-ink':'grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-accent to-cyan text-lg text-ink'}>F</span>}
function Shell({ children, admin = false }) {
  const [open, setOpen] = useState(false);
  const publicMenu = readPublicMenu().filter((item) => item.enabled);
  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/85 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 font-semibold tracking-tight"
          >
            <BrandMark />
            <span>
              Fahmi<span className="text-accent">.</span>
            </span>
          </Link>
          {admin ? (
            <AdminNav />
          ) : (
            <>
              <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
                {publicMenu.map((item) => (
                  <Link
                    className="public-nav-link transition hover:text-white"
                    to={item.path}
                    key={item.id}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link
                  to="/contact"
                  className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-cyan md:inline-flex"
                >
                  Let's work together <ArrowUpRight size={16} />
                </Link>
                <button className="md:hidden" onClick={() => setOpen(!open)}>
                  {open ? <X /> : <Menu />}
                </button>
              </div>
            </>
          )}
        </div>
        {open && (
          <nav className="container flex flex-col gap-4 border-t border-white/10 py-5 md:hidden">
            {publicMenu.map((item) => (
              <Link
                className="public-nav-link"
                onClick={() => setOpen(false)}
                to={item.path}
                key={item.id}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        )}
      </header>
      <main>{children}</main>
      {!admin && <Footer />}
    </div>
  );
}
function Footer() {
  const links = readSocialLinks().filter((link) => link.enabled && link.url);
  return (
    <footer className="border-t border-white/10">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-2xl font-semibold">Have a good project in mind?</p>
          <Link
            to="/contact"
            className="mt-3 inline-flex items-center gap-2 text-accent"
          >
            Let's talk <ArrowRight size={17} />
          </Link>
        </div>
        <div className="text-sm text-slate-500 md:text-right">
          <p>© {new Date().getFullYear()} Fahmi. Designed with intent.</p>
          <div className="mt-3 flex gap-4 md:justify-end">
            {links.map((link) => {
              const Icon = socialIcons[link.icon] || ExternalLink;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="hover:text-accent"
                >
                  {link.customIcon ? (
                    <img
                      src={link.customIcon}
                      alt=""
                      className="h-[17px] w-[17px] object-contain"
                    />
                  ) : (
                    <Icon size={17} />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
function Button({ children, to, variant = "primary", ...p }) {
  let c =
    variant === "primary"
      ? "bg-white text-ink hover:bg-cyan"
      : "border border-white/15 text-white hover:border-accent hover:text-accent";
  return to ? (
    <Link
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${c}`}
      to={to}
    >
      {children}
    </Link>
  ) : (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${c}`}
      {...p}
    >
      {children}
    </button>
  );
}
function Home(){useSEO({title:'Fahmi — Product Designer'});return <Shell><section className="relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,124,255,.2),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(77,216,210,.1),transparent_30%)]"/><div className="container relative grid min-h-[680px] items-center gap-14 py-24 lg:grid-cols-[1.1fr_.9fr]"><div><p className="mb-7 flex items-center gap-2 text-sm uppercase tracking-[.22em] text-cyan"><span className="h-2 w-2 rounded-full bg-cyan"/> Available for select projects</p><h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-.05em] sm:text-7xl">I design digital products that <span className="text-accent">move people forward.</span></h1><p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">I'm Fahmi, a product designer focused on turning complex problems into clear, useful, and memorable experiences.</p><div className="mt-10 flex flex-wrap gap-3"><Button to="/projects">View my work <ArrowUpRight size={17}/></Button><Button to="/contact" variant="secondary">Let's talk <ArrowRight size={17}/></Button></div><div className="mt-14 flex gap-8 text-sm text-slate-500"><span><strong className="block text-2xl text-white">8+</strong> years designing</span><span><strong className="block text-2xl text-white">40</strong> products shipped</span><span><strong className="block text-2xl text-white">12</strong> happy teams</span></div></div><div className="relative mx-auto w-full max-w-md"><div className="absolute -inset-8 rounded-full bg-accent/10 blur-3xl"/><div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 p-3 shadow-glow"><img src={img('fahmi.png')} alt="Fahmi" className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"/><div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/15 bg-ink/80 p-4 backdrop-blur"><p className="text-sm text-slate-400">Currently designing at</p><p className="mt-1 font-medium">The intersection of people & technology</p></div></div></div></div></section><section className="border-y border-white/10 bg-white/[.03]"><div className="container grid gap-8 py-16 md:grid-cols-[1fr_1.4fr] md:items-center"><p className="text-sm uppercase tracking-[.2em] text-slate-500">A little about me</p><div><p className="text-2xl leading-relaxed text-slate-200 md:text-3xl">I partner with ambitious teams to make products simpler, more useful, and a joy to use.</p><Link className="mt-6 inline-flex items-center gap-2 text-accent" to="/about">More about me <ArrowRight size={17}/></Link></div></div></section><section className="container py-24"><div className="flex items-end justify-between"><div><p className="eyebrow">Selected work</p><h2 className="section-title">A few things I've made</h2></div><Link className="hidden items-center gap-2 text-sm text-accent sm:flex" to="/projects">View all projects <ArrowRight size={16}/></Link></div><div className="mt-10 grid gap-6 md:grid-cols-2">{seedProjects.slice(0,4).map(p=><ProjectCard key={p.id} project={p}/>)}</div></section><section className="container pb-28"><div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-accent/20 to-cyan/10 p-8 md:p-14"><p className="eyebrow">Let's create</p><h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">Good work starts with a good conversation.</h2><Button to="/contact" className="mt-8">Start a conversation <ArrowUpRight size={17}/></Button></div></section></Shell>}
function ProjectCard({project}){return <Link to={`/projects/${project.slug}`} className="group block"><div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.04]"><div className="aspect-[16/10] overflow-hidden bg-slate-800"><img loading="lazy" src={project.cover} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/></div><div className="p-5"><div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-500"><span>{project.category}</span><span>{project.year}</span></div><h3 className="mt-3 text-xl font-medium">{project.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{project.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm text-accent">View case study <ArrowUpRight size={15}/></span></div></div></Link>}
function About(){useSEO({title:'About — Fahmi'});return <Shell><PageIntro eyebrow="About me" title="Designing with clarity, curiosity, and care." text="I'm a product designer based in Johor, Indonesia. I work across strategy, UX, and visual design to help teams build things that matter."/><section className="container grid gap-14 pb-24 lg:grid-cols-[.8fr_1.2fr]"><img src={img('fahmi.png')} alt="Fahmi at work" className="aspect-[4/5] max-h-[560px] w-full rounded-3xl object-cover"/><div className="space-y-8 text-lg leading-8 text-slate-400"><p>I've spent the last eight years helping startups and established companies turn fuzzy ideas into confident product decisions. My favorite part is the messy middle: asking better questions, finding the signal, and making it tangible.</p><p>When I'm not pushing pixels, you'll find me reading about cities, sketching in cafés, or helping young designers find their voice.</p><div className="grid grid-cols-2 gap-4 pt-5"><Stat n="8+" l="Years experience"/><Stat n="40" l="Products shipped"/><Stat n="12" l="Countries worked with"/><Stat n="∞" l="Curiosity"/></div></div></section><section className="border-y border-white/10 bg-white/[.03]"><div className="container py-20"><p className="eyebrow">What I bring</p><div className="mt-8 grid gap-5 md:grid-cols-3">{[['01','Product thinking','Connecting user needs to business outcomes.'],['02','Systems mindset','Building foundations that help teams move faster.'],['03','Careful craft','Sweating the details that make an experience feel right.']].map(x=><div className="rounded-2xl border border-white/10 p-6" key={x[0]}><span className="text-accent">{x[0]}</span><h3 className="mt-7 text-xl">{x[1]}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{x[2]}</p></div>)}</div></div></section></Shell>}
function Stat({n,l}){return <div className="rounded-2xl border border-white/10 p-4"><p className="text-3xl font-semibold text-white">{n}</p><p className="mt-1 text-xs text-slate-500">{l}</p></div>}
function PageIntro({eyebrow,title,text}){return <div className="container py-24 md:py-32"><p className="eyebrow">{eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-.05em] md:text-7xl">{title}</h1>{text&&<p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">{text}</p>}</div>}
function Projects(){const [filter,setFilter]=useState('All');useSEO({title:'Projects — Fahmi'});const list=filter==='All'?seedProjects:seedProjects.filter(p=>[p.category,p.type].includes(filter));return <Shell><PageIntro eyebrow="Selected work" title="Projects built around real people and real outcomes." text="A selection of product, brand, and digital experiences I've helped bring to life."/><section className="container pb-24"><div className="mb-10 flex flex-wrap gap-2">{categories.map(c=><button key={c} onClick={()=>setFilter(c)} className={`rounded-full px-4 py-2 text-sm transition ${filter===c?'bg-white text-ink':'border border-white/10 text-slate-400 hover:border-white/40 hover:text-white'}`}>{c}</button>)}</div><div className="grid gap-6 md:grid-cols-2">{list.map(p=><ProjectCard key={p.id} project={p}/>)}</div></section></Shell>}
function ProjectDetail(){const {slug}=useParams();const p=seedProjects.find(x=>x.slug===slug);if(!p)return <NotFound/>;useSEO({title:`${p.title} — Fahmi`,description:p.description,type:'project',image:p.cover});const next=seedProjects[(seedProjects.indexOf(p)+1)%seedProjects.length];return <Shell><article className="container pb-24"><div className="py-16"><Link to="/projects" className="text-sm text-slate-500 hover:text-white">← Back to projects</Link><p className="eyebrow mt-14">{p.category} · {p.year}</p><h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-.05em] md:text-7xl">{p.title}</h1><p className="mt-6 max-w-2xl text-xl leading-8 text-slate-400">{p.description}</p></div><img src={p.cover} alt={p.title} className="max-h-[620px] w-full rounded-3xl object-cover"/><div className="mt-12 grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><aside className="grid h-fit grid-cols-2 gap-5 text-sm md:grid-cols-4 lg:block lg:space-y-6">{[['Client',p.client],['Role',p.role],['Duration',p.duration],['Tools',p.tools.join(', ')]].map(x=><div key={x[0]}><p className="text-slate-500">{x[0]}</p><p className="mt-1 text-slate-200">{x[1]}</p></div>)}</aside><div className="space-y-8 text-lg leading-8 text-slate-300"><SectionBlock title="Overview">{p.description} We worked closely with the team to turn a complex workflow into an experience that feels calm, fast, and easy to understand.</SectionBlock><SectionBlock title="The approach">We combined interviews, journey mapping, rapid prototyping, and weekly critique to make decisions visible and keep everyone aligned.</SectionBlock><div className="grid gap-5">{p.gallery.map((g,i)=><img key={g} loading="lazy" src={g} alt={`${p.title} screen ${i+1}`} className="max-h-[600px] w-full rounded-2xl object-cover"/>)}</div><SectionBlock title="Outcome">A stronger foundation for the product, clearer stories for customers, and a team that can keep shipping with confidence.</SectionBlock></div></div><Link to={`/projects/${next.slug}`} className="mt-20 flex items-center justify-between border-t border-white/10 pt-7 text-lg">Next project <ArrowRight className="text-accent"/></Link></article></Shell>}
function SectionBlock({title,children}){return <section><h2 className="mb-3 text-2xl font-medium text-white">{title}</h2><p>{children}</p></section>}
function Articles(){const {category:routeCategory}=useParams();const params=new URLSearchParams(useLocation().search);const initialCategory=routeCategory?routeCategory.replaceAll('-',' '):params.get('category')||'All';const [search,setSearch]=useState(params.get('search')||'');const [cat,setCat]=useState(initialCategory);const [visible,setVisible]=useState(4);useSEO({title:'Articles — Fahmi'});const filtered=seedArticles.filter(a=>(cat==='All'||a.category===cat)&&`${a.title} ${a.excerpt} ${a.content.join(' ')} ${a.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase()));useEffect(()=>setVisible(4),[search,cat]);return <Shell><PageIntro eyebrow="Notes & ideas" title="Writing about the work behind the work." text="Thoughts on product design, collaboration, and making digital things feel a little more human."/><section className="container pb-24"><div className="flex flex-col gap-4 border-b border-white/10 pb-7 md:flex-row"><label className="relative flex-1"><Search className="absolute left-4 top-3.5 text-slate-500" size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search articles..." className="field pl-11"/></label><div className="flex gap-2 overflow-auto">{articleCategories.map(c=><button key={c} onClick={()=>setCat(c)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${cat===c?'bg-white text-ink':'border border-white/10 text-slate-400'}`}>{c}</button>)}</div></div>{filtered.length?<><div className="mt-10 grid gap-8 md:grid-cols-2">{filtered.slice(0,visible).map(a=><ArticleCard key={a.id} article={a}/>)}</div>{visible<filtered.length&&<button onClick={()=>setVisible(v=>v+4)} className="mx-auto mt-10 flex rounded-full border border-white/15 px-5 py-3 text-sm hover:border-accent hover:text-accent">Load more articles <ArrowRight size={16}/></button>}</>:<Empty text="No articles match that search."/>}</section></Shell>}
function ArticleCard({article}){return <Link to={`/articles/${article.slug}`} className="group h-full"><div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]"><img loading="lazy" src={article.cover} alt="" className="aspect-[16/9] w-full shrink-0 object-cover transition duration-500 group-hover:scale-105"/><div className="flex flex-1 flex-col p-5"><div className="flex justify-between text-xs uppercase tracking-wider text-slate-500"><span>{article.category}</span><span>{article.read}</span></div><h2 className="mt-3 text-2xl font-medium">{article.title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{article.excerpt}</p><p className="mt-auto pt-5 text-sm text-accent">Read article →</p></div></div></Link>}
function ArticleDetail(){const {slug}=useParams();const a=seedArticles.find(x=>x.slug===slug);if(!a)return <NotFound/>;useSEO({title:`${a.title} — Fahmi`,description:a.excerpt,type:'article',image:a.cover});const related=[...seedArticles.filter(x=>x.id!==a.id&&x.category===a.category),...seedArticles.filter(x=>x.id!==a.id&&x.category!==a.category)].slice(0,2);return <Shell><article className="container max-w-4xl pb-24"><div className="py-16 text-center"><Link to="/articles" className="text-sm text-slate-500">← All articles</Link><p className="eyebrow mt-12">{a.category} · {a.date} · {a.read}</p><h1 className="mt-5 text-5xl font-semibold tracking-[-.05em] md:text-7xl">{a.title}</h1><p className="mx-auto mt-7 max-w-2xl text-xl leading-8 text-slate-400">{a.excerpt}</p></div><img src={a.cover} alt="" className="aspect-[16/8] w-full rounded-3xl object-cover"/><div className="prose-custom mx-auto mt-12 max-w-2xl">{a.content.map((p,i)=><p key={i}>{p}</p>)}</div><div className="mt-14 flex flex-wrap gap-2">{a.tags.map(t=><span key={t} className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">#{t}</span>)}</div><section className="mx-auto mt-16 max-w-2xl rounded-3xl border border-accent/30 bg-accent/10 p-7 md:p-9"><p className="eyebrow">Have a project in mind?</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Let's turn a good idea into something useful.</h2><p className="mt-3 max-w-xl leading-7 text-slate-300">Share what you are working on and let's find a clear, thoughtful way forward.</p><Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cyan">Start a conversation <ArrowUpRight size={16}/></Link></section><section className="mt-20 border-t border-white/10 pt-10"><p className="eyebrow">More articles</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Keep reading</h2><div className="mt-6 grid gap-5 md:grid-cols-2">{related.map(x=><ArticleCard article={x} key={x.id}/>)}</div><Link to="/articles" className="mt-8 inline-flex items-center gap-2 text-sm text-accent">View all articles <ArrowRight size={16}/></Link></section></article></Shell>}
function Contact(){const [sent,setSent]=useState(false);useSEO({title:'Contact — Fahmi'});return <Shell><PageIntro eyebrow="Contact" title="Let's make something useful." text="Have a project, a question, or just want to say hello? My inbox is always open."/><section className="container grid gap-14 pb-24 lg:grid-cols-[.75fr_1.25fr]"><div className="space-y-7"><div><p className="text-sm text-slate-500">Email</p><a href="mailto:ffaisalfahmi@gmail.com" className="mt-2 block text-xl text-accent">hello@fahmi.design</a></div><div><p className="text-sm text-slate-500">Based in</p><p className="mt-2 flex items-center gap-2 text-xl">Johor, Indonesia <MapPin size={18} className="text-cyan"/></p></div><div><p className="text-sm text-slate-500">Typical response</p><p className="mt-2 flex items-center gap-2 text-xl">Within 2 business days <Clock size={18} className="text-cyan"/></p></div></div><form onSubmit={e=>{e.preventDefault();setSent(true)}} className="space-y-5 rounded-3xl border border-white/10 bg-white/[.03] p-6 md:p-8">{sent?<div className="py-14 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cyan text-ink"><Check/></span><h2 className="mt-5 text-2xl">Message received!</h2><p className="mt-2 text-slate-400">Thanks for reaching out. I'll be in touch soon.</p></div>:<><div className="grid gap-5 md:grid-cols-2"><label>Name<input required className="field mt-2" placeholder="Your name"/></label><label>Email<input required type="email" className="field mt-2" placeholder="you@company.com"/></label></div><label>Subject<input required className="field mt-2" placeholder="What can I help with?"/></label><label>Message<textarea required rows="6" className="field mt-2" placeholder="Tell me a little about your project..."/></label><button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-ink hover:bg-cyan">Send message <ArrowUpRight size={17}/></button></>}</form></section></Shell>}
function NotFound(){return <Shell><div className="container py-40 text-center"><p className="eyebrow">404</p><h1 className="mt-5 text-5xl font-semibold">This page wandered off.</h1><p className="mt-4 text-slate-400">Let's get you back somewhere useful.</p><Button to="/" className="mt-8">Back home</Button></div></Shell>}
function AdminNav(){const [open,setOpen]=useState(false);const nav=useNavigate();const logout=()=>{localStorage.removeItem('admin-auth');nav('/admin/login')};return <nav className="hidden items-center gap-5 text-sm text-slate-400 md:flex"><Link to="/admin">Dashboard</Link><Link to="/admin/articles">Articles</Link><Link to="/admin/projects">Projects</Link><Link to="/admin/categories">Categories</Link><Link to="/admin/media">Media</Link><div className="relative"><button onClick={()=>setOpen(!open)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 hover:border-white/30 hover:text-white"><span className="grid h-6 w-6 place-items-center rounded-full bg-accent/20 text-accent"><User size={14}/></span><span>Account</span><ChevronDown size={14}/></button>{open&&<div className="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-white/10 bg-[#111936] p-2 shadow-2xl"><Link to="/admin/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/10 hover:text-white"><Settings size={16}/> Settings</Link><Link to="/admin/appearance" className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/10 hover:text-white"><Palette size={16}/> Appearance</Link><button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-red-300 hover:bg-white/10 hover:text-red-200"><LogOut size={16}/> Logout</button></div>}</div><Link to="/" className="text-accent">View site ↗</Link></nav>}
function AdminLayout({children}){const nav=useNavigate();const logout=()=>{localStorage.removeItem('admin-auth');nav('/admin/login')};return <Shell admin><div className="container flex items-center justify-end gap-4 border-b border-white/10 py-3 text-sm"><span className="text-slate-500">Local CMS preview</span><button onClick={logout} className="inline-flex items-center gap-1 text-slate-300 hover:text-white"><LogOut size={15}/> Logout</button></div><div className="container py-12">{children}</div></Shell>}
function RequireAuth({children}){return localStorage.getItem('admin-auth')?<>{children}</>:<Navigate to="/admin/login" replace/>}
function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (
      email.trim().toLowerCase() !== ADMIN_EMAIL ||
      password !== readAdminPassword()
    ) {
      setError("Incorrect email or password.");
      return;
    }
    localStorage.setItem("admin-auth", "1");
    localStorage.setItem("admin-email", ADMIN_EMAIL);
    nav("/admin");
  };
  return (
    <div className="relative grid min-h-screen overflow-hidden bg-ink px-5 py-10 text-white md:grid-cols-2 md:px-10 lg:px-20">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-cyan/10 blur-3xl" />
      <div className="relative hidden flex-col justify-between py-6 md:flex">
        <div>
          <Link
            to="/"
            className="flex items-center gap-3 font-semibold tracking-tight"
          >
            <BrandMark />
            <span>
              Fahmi<span className="text-accent">.</span>
            </span>
          </Link>
          <div className="mt-24 max-w-lg">
            <p className="eyebrow">Content studio</p>
            <h1 className="mt-5 text-5xl font-semibold leading-tight tracking-[-.05em] lg:text-7xl">
              Build a portfolio that keeps moving.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-slate-400">
              Manage projects, publish articles, and keep your story fresh from
              one focused workspace.
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Fahmi Design
        </p>
      </div>
      <div className="relative flex items-center justify-center">
        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[.05] p-7 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <div className="mb-8 flex items-center justify-between md:hidden">
            <Link to="/" className="flex items-center gap-3 font-semibold">
              <BrandMark compact />{" "}
              Fahmi<span className="text-accent">.</span>
            </Link>
            <span className="text-xs text-slate-500">CMS</span>
          </div>
          <div className="mb-8">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
              <LockKeyhole size={22} />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-slate-400">
              Sign in to your content studio.
            </p>
          </div>
          <div className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-2 block">
                Email address
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="admin-password">Password</label>
                <button
                  type="button"
                  className="text-xs text-accent hover:text-cyan"
                  onClick={() =>
                    setError(
                      "Password reset is available after Supabase is connected.",
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm text-red-200"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 font-semibold text-ink hover:bg-cyan"
            >
              <span>Sign in to CMS</span>
              <ArrowRight size={17} />
            </button>
          </div>
          <div className="mt-7 flex items-start gap-3 border-t border-white/10 pt-6 text-xs leading-5 text-slate-500">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-cyan" />
            <span>
              Your session is protected. Authentication is stored only in this
              browser preview.
            </span>
          </div>
          <p className="mt-5 text-center text-xs text-slate-600">
            Supabase-ready authentication layer
          </p>
        </form>
      </div>
    </div>
  );
}
const getStore = (key, seed) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v || seed;
  } catch {
    return seed;
  }
};
function Admin() {
  return (
    <AdminLayout>
      <AdminHeader
        title="Good morning, Fahmi."
        text="Here's what's happening across your portfolio."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Projects", seedProjects.length],
          ["Articles", seedArticles.length],
          ["Published", seedArticles.length],
          ["Views", "12.8k"],
        ].map((x) => (
          <Stat key={x[0]} n={x[1]} l={x[0]} />
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 p-6">
          <p className="eyebrow">Quick actions</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button to="/admin/articles">Manage articles</Button>
            <Button to="/admin/projects" variant="secondary">
              Manage projects
            </Button>
            <Button to="/admin/settings" variant="secondary">
              Account settings
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 p-6">
          <p className="eyebrow">Service status</p>
          <p className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan" /> Local mock data
            active
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Connect Supabase by setting VITE_SUPABASE_URL and
            VITE_SUPABASE_ANON_KEY.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
function AdminSettings() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [seo, setSeo] = useState(readSEOSettings);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const savePassword = (e) => {
    e.preventDefault();
    setError("");
    if (current !== localStorage.getItem("admin-password")) {
      setError("Current password is incorrect.");
      return;
    }
    if (next.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    localStorage.setItem("admin-password", next);
    setCurrent("");
    setNext("");
    setConfirm("");
    setMessage("Password updated successfully.");
  };
  const saveSEO = (e) => {
    e.preventDefault();
    localStorage.setItem("site-seo", JSON.stringify(seo));
    setMessage("Default SEO settings saved.");
  };
  const updateSEO = (key, value) =>
    setSeo((current) => ({ ...current, [key]: value }));
  return (
    <AdminLayout>
      <AdminHeader
        title="Account settings"
        text="Manage your account and default website SEO."
      />
      <div className="mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-white/10 pb-6">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/15 text-accent">
              <LockKeyhole size={20} />
            </div>
            <div>
              <h2 className="text-xl font-medium">Change password</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Update the password used for this local CMS preview.
              </p>
            </div>
          </div>
          <form onSubmit={savePassword} className="mt-7 space-y-5">
            <div>
              <label htmlFor="current-password" className="mb-2 block">
                Current password
              </label>
              <input
                id="current-password"
                type="password"
                required
                className="field"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="new-password" className="mb-2 block">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                minLength="6"
                required
                className="field"
                value={next}
                onChange={(e) => setNext(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-2 block">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                minLength="6"
                required
                className="field"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-200">
                {error}
              </p>
            )}
            <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cyan">
              Update password
            </button>
          </form>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-white/10 pb-6">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan/15 text-cyan">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-xl font-medium">Default SEO</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                These values apply to pages without custom SEO settings.
              </p>
            </div>
          </div>
          <form onSubmit={saveSEO} className="mt-7 space-y-5">
            <div>
              <label htmlFor="seo-title" className="mb-2 block">
                Default meta title
              </label>
              <input
                id="seo-title"
                required
                className="field"
                value={seo.title}
                onChange={(e) => updateSEO("title", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="seo-description" className="mb-2 block">
                Default meta description
              </label>
              <textarea
                id="seo-description"
                required
                rows="4"
                className="field"
                value={seo.description}
                onChange={(e) => updateSEO("description", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="seo-keywords" className="mb-2 block">
                Default keywords
              </label>
              <input
                id="seo-keywords"
                className="field"
                value={seo.keywords}
                onChange={(e) => updateSEO("keywords", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="seo-image" className="mb-2 block">
                Default social image URL
              </label>
              <input
                id="seo-image"
                className="field"
                value={seo.image}
                onChange={(e) => updateSEO("image", e.target.value)}
              />
            </div>
            <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cyan">
              Save SEO settings
            </button>
            {message && (
              <p role="status" className="text-sm text-cyan">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
function AdminAppearance() {
  const [items, setItems] = useState(readPublicMenu);
  const [favicon, setFavicon] = useState(readFavicon);
  const [logo, setLogo] = useState(readLogo);
  const [socials, setSocials] = useState(readSocialLinks);
  const [message, setMessage] = useState("");
  const update = (id, key, value) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    );
  const updateSocial = (id, key, value) =>
    setSocials((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    );
  const chooseLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  };
  const saveLogo = (e) => {
    e.preventDefault();
    if (logo) localStorage.setItem("site-logo", logo);
    else localStorage.removeItem("site-logo");
    setMessage("Logo berhasil disimpan.");
  };
  const resetLogo = () => {
    localStorage.removeItem("site-logo");
    setLogo(defaultLogo);
    setMessage("Logo dikembalikan ke default.");
  };
  const addSocial = () =>
    setSocials((current) => [
      ...current,
      {
        id: `social-${Date.now()}`,
        label: "New social media",
        url: "",
        icon: "ExternalLink",
        enabled: true,
        customIcon: "",
      },
    ]);
  const removeSocial = (id) =>
    setSocials((current) => current.filter((item) => item.id !== id));
  const chooseSocialIcon = (id, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateSocial(id, "customIcon", reader.result);
    reader.readAsDataURL(file);
  };
  const move = (index, direction) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };
  const saveMenu = (e) => {
    e.preventDefault();
    localStorage.setItem("public-menu", JSON.stringify(items));
    setMessage("Menu frontend berhasil disimpan.");
  };
  const saveFavicon = (e) => {
    e.preventDefault();
    if (favicon === defaultFavicon) localStorage.removeItem("site-favicon");
    else localStorage.setItem("site-favicon", favicon);
    applyFavicon();
    setMessage("Favicon berhasil disimpan.");
  };
  const saveSocials = (e) => {
    e.preventDefault();
    localStorage.setItem("social-links", JSON.stringify(socials));
    setMessage("Social media berhasil disimpan.");
  };
  const chooseFavicon = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFavicon(reader.result);
    reader.readAsDataURL(file);
  };
  const resetFavicon = () => {
    localStorage.removeItem("site-favicon");
    setFavicon(defaultFavicon);
    applyFavicon();
    setMessage("Favicon dikembalikan ke default.");
  };
  return (
    <AdminLayout>
      <AdminHeader
        title="Appearance"
        text="Atur menu navigasi, favicon, dan social media website publik."
      />
      <div className="mt-10 max-w-3xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-white/10 pb-6">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan/15 text-cyan">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-xl font-medium">Public navigation</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Aktifkan, nonaktifkan, dan urutkan menu yang terlihat di header
                frontend.
              </p>
            </div>
          </div>
          <form onSubmit={saveMenu} className="mt-7 space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3"
              >
                <GripVertical size={18} className="shrink-0 text-slate-600" />
                <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_1fr]">
                  <input
                    aria-label={`${item.id} label`}
                    className="field"
                    value={item.label}
                    onChange={(e) => update(item.id, "label", e.target.value)}
                  />
                  <input
                    aria-label={`${item.id} path`}
                    className="field"
                    value={item.path}
                    onChange={(e) => update(item.id, "path", e.target.value)}
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(e) =>
                      update(item.id, "enabled", e.target.checked)
                    }
                  />{" "}
                  Show
                </label>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    aria-label={`Move ${item.label} up`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${item.label} down`}
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                    className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-4 pt-5">
              <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cyan">
                Save menu
              </button>
              {message && (
                <p role="status" className="text-sm text-cyan">
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-white/10 pb-6">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/15 text-accent">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-xl font-medium">Favicon</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Pilih gambar yang akan tampil di tab browser. Gunakan PNG, ICO,
                atau SVG.
              </p>
            </div>
          </div>
          <form
            onSubmit={saveFavicon}
            className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center"
          >
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white">
              <img
                src={favicon}
                alt="Favicon preview"
                className="h-full w-full object-contain p-3"
              />
            </div>
            <div className="flex-1">
              <input
                id="favicon-upload"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/x-icon,.ico"
                onChange={chooseFavicon}
                className="field"
              />
              <p className="mt-2 text-xs text-slate-500">
                File disimpan di browser ini sebagai local preview.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cyan">
                Save favicon
              </button>
              <button
                type="button"
                onClick={resetFavicon}
                className="rounded-full border border-white/15 px-5 py-3 text-sm text-slate-300 hover:border-accent hover:text-accent"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-white/10 pb-6">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/15 text-accent">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-xl font-medium">Web logo</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Upload logo yang tampil di header website dan halaman login admin.
              </p>
            </div>
          </div>
          <form onSubmit={saveLogo} className="mt-7 flex flex-wrap items-center gap-5">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white p-3">
              {logo ? <img src={logo} alt="Logo preview" className="h-full w-full object-contain" /> : <BrandMark />}
            </div>
            <div className="flex-1">
              <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={chooseLogo} className="field" />
              <p className="mt-2 text-xs text-slate-500">Gunakan PNG, JPG, SVG, atau WEBP. Disimpan di browser ini sebagai local preview.</p>
            </div>
            <div className="flex gap-3">
              <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cyan">Save logo</button>
              <button type="button" onClick={resetLogo} className="rounded-full border border-white/15 px-5 py-3 text-sm text-slate-300 hover:border-accent hover:text-accent">Reset</button>
            </div>
          </form>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-white/10 pb-6">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/15 text-accent">
              <ExternalLink size={20} />
            </div>
            <div>
              <h2 className="text-xl font-medium">Social media</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Atur URL, label, ikon, dan visibilitas link social media di footer.
              </p>
            </div>
          </div>
          <form onSubmit={saveSocials} className="mt-7 space-y-4">
            {socials.map((social) => {
              const Icon = socialIcons[social.icon] || ExternalLink;
              return (
                <div
                  key={social.id}
                  className="rounded-2xl border border-white/10 bg-white/[.03] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent">
                      {social.customIcon ? (
                        <img src={social.customIcon} alt="" className="h-5 w-5 object-contain" />
                      ) : (
                        <Icon size={17} />
                      )}
                    </span>
                    <input
                      className="field"
                      value={social.label}
                      onChange={(e) =>
                        updateSocial(social.id, "label", e.target.value)
                      }
                      placeholder="Label"
                    />
                    <label className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
                      <input
                        type="checkbox"
                        checked={social.enabled}
                        onChange={(e) =>
                          updateSocial(social.id, "enabled", e.target.checked)
                        }
                      />{" "}
                      Show
                    </label>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_150px]">
                    <input
                      type="url"
                      className="field"
                      value={social.url}
                      onChange={(e) =>
                        updateSocial(social.id, "url", e.target.value)
                      }
                      placeholder="https://..."
                    />
                    <select
                      className="field"
                      value={social.icon}
                      onChange={(e) =>
                        updateSocial(social.id, "icon", e.target.value)
                      }
                    >
                      <option>Linkedin</option>
                      <option>Github</option>
                      <option>Dribbble</option>
                      <option>Instagram</option>
                      <option>ExternalLink</option>
                    </select>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <label className="cursor-pointer text-xs text-accent hover:text-cyan">
                      {social.customIcon ? "Ganti custom icon" : "Upload custom icon"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        onChange={(e) => chooseSocialIcon(social.id, e)}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSocial(social.id)}
                      className="text-xs text-red-300 hover:text-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={addSocial}
                className="rounded-full border border-white/15 px-5 py-3 text-sm text-slate-300 hover:border-accent hover:text-accent"
              >
                Add social media
              </button>
              <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cyan">
                Save social media
              </button>
              {message && (
                <p role="status" className="text-sm text-cyan">
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
function AdminHeader({ title, text, action }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">Admin studio</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{title}</h1>
        {text && <p className="mt-2 text-slate-400">{text}</p>}
      </div>
      {action}
    </div>
  );
}
function AdminArticles() {
  const [items, setItems] = useState(() => getStore("articles", seedArticles));
  const [q, setQ] = useState("");
  const remove = (id) => {
    const x = items.filter((a) => a.id !== id);
    setItems(x);
    localStorage.setItem("articles", JSON.stringify(x));
  };
  return (
    <AdminLayout>
      <AdminHeader
        title="Articles"
        text="Create, edit, and publish your writing."
        action={
          <Button to="/admin/articles/create">
            <Plus size={16} /> New article
          </Button>
        }
      />
      <div className="mt-8 flex items-center gap-3">
        <Search size={18} className="text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="field"
          placeholder="Search articles"
        />
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[.04] text-slate-500">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items
              .filter((a) => a.title.toLowerCase().includes(q.toLowerCase()))
              .map((a) => (
                <tr className="border-t border-white/10" key={a.id}>
                  <td className="p-4 font-medium">{a.title}</td>
                  <td className="p-4 text-slate-400">{a.category}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-cyan/15 px-2 py-1 text-xs text-cyan">
                      Published
                    </span>
                  </td>
                  <td className="flex gap-3 p-4">
                    <Link
                      to={`/admin/articles/${a.id}/edit`}
                      className="text-accent"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button
                      onClick={() => remove(a.id)}
                      className="text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
function ArticleEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const existing = getStore("articles", seedArticles).find((a) => a.id === id);
  const [form, setForm] = useState(
    existing || {
      title: "",
      slug: "",
      excerpt: "",
      category: "UI/UX",
      date: new Date().toISOString().slice(0, 16),
      read: "5",
      tags: [],
      cover: "/images/fahmi.png",
      status: "Draft",
      author: "Fahmi",
      featured: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      seoImage: "",
      content: [""],
    },
  );
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const chooseCover = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, cover: reader.result }));
    reader.readAsDataURL(file);
  };
  const save = (e) => {
    e.preventDefault();
    const items = getStore("articles", seedArticles);
    const next = {
      ...form,
      id: id || String(Date.now()),
      tags:
        typeof form.tags === "string"
          ? form.tags
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean)
          : form.tags,
      content:
        typeof form.content === "string"
          ? form.content.split("\n").filter(Boolean)
          : form.content,
    };
    localStorage.setItem(
      "articles",
      JSON.stringify(
        id ? items.map((x) => (x.id === id ? next : x)) : [next, ...items],
      ),
    );
    nav("/admin/articles");
  };
  return (
    <AdminLayout>
      <AdminHeader
        title={id ? "Edit article" : "Create post"}
        text="Create and optimize your article from one focused workspace."
      />
      <form
        onSubmit={save}
        className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <Edit3 size={17} className="text-accent" />
            <div>
              <h2 className="font-medium">Konten utama</h2>
              <p className="text-xs text-slate-500">
                Tulis dan susun artikel kamu.
              </p>
            </div>
          </div>
          <div className="space-y-5 p-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label>
                Judul artikel<span className="text-red-300">*</span>
                <input
                  required
                  className="field mt-2"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Masukkan judul artikel..."
                />
              </label>
              <label>
                Slug URL<span className="text-red-300">*</span>
                <input
                  required
                  className="field mt-2"
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  placeholder="judul-artikel"
                />
              </label>
            </div>
            <label>
              Ringkasan / Excerpt
              <textarea
                rows="3"
                className="field mt-2"
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                placeholder="Ringkasan singkat untuk kartu artikel..."
              />
            </label>
            <label>
              Isi artikel<span className="text-red-300">*</span>
              <div className="mt-2 overflow-hidden rounded-xl border border-white/15">
                <div className="flex flex-wrap gap-4 border-b border-white/15 bg-white/[.03] px-4 py-3 text-sm text-slate-400">
                  <button
                    type="button"
                    className="font-semibold hover:text-white"
                  >
                    B
                  </button>
                  <button type="button" className="italic hover:text-white">
                    I
                  </button>
                  <button type="button" className="underline hover:text-white">
                    U
                  </button>
                  <span className="text-slate-600">|</span>
                  <span>Link</span>
                  <span>H1</span>
                  <span>Quote</span>
                  <span>List</span>
                  <span>Image</span>
                </div>
                <textarea
                  required
                  rows="14"
                  className="field rounded-none border-0 bg-transparent"
                  value={
                    Array.isArray(form.content)
                      ? form.content.join("\n")
                      : form.content
                  }
                  onChange={(e) => update("content", e.target.value)}
                  placeholder="Tulis isi artikel di sini..."
                />
              </div>
            </label>
          </div>
        </section>
        <aside className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <ImageIcon size={17} className="text-accent" />
              <h2 className="font-medium">Visual</h2>
            </div>
            <label className="mt-5 block">
              Foto utama<span className="text-red-300">*</span>
              <div className="mt-2 overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/[.03]">
                <img
                  src={form.cover}
                  alt="Cover preview"
                  className="h-32 w-full object-cover"
                />
                <div className="flex items-center justify-between gap-3 border-t border-white/10 p-3">
                  <span className="truncate text-xs text-slate-400">
                    Cover image
                  </span>
                  <label
                    htmlFor="cover-upload"
                    className="cursor-pointer text-xs text-accent hover:text-cyan"
                  >
                    Pilih gambar
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={chooseCover}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </label>
            <input
              className="field mt-3"
              value={
                typeof form.cover === "string" && form.cover.startsWith("data:")
                  ? ""
                  : form.cover
              }
              onChange={(e) => update("cover", e.target.value)}
              placeholder="Atau masukkan URL gambar"
            />
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Settings size={17} className="text-accent" />
              <h2 className="font-medium">Publikasi</h2>
            </div>
            <label className="mt-5 block">
              Status
              <select
                className="field mt-2"
                value={form.status || "Draft"}
                onChange={(e) => update("status", e.target.value)}
              >
                <option>Draft</option>
                <option>Published</option>
                <option>Archived</option>
              </select>
            </label>
            <label className="mt-4 block">
              Penulis
              <input
                className="field mt-2"
                value={form.author || ""}
                onChange={(e) => update("author", e.target.value)}
                placeholder="Nama penulis"
              />
            </label>
            <label className="mt-4 block">
              Tanggal terbit
              <input
                type="datetime-local"
                className="field mt-2"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </label>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(e) => update("featured", e.target.checked)}
              />{" "}
              Ditampilkan pada featured
            </label>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Palette size={17} className="text-accent" />
              <h2 className="font-medium">Klasifikasi</h2>
            </div>
            <label className="mt-5 block">
              Kategori
              <select
                className="field mt-2"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {articleCategories
                  .filter((x) => x !== "All")
                  .map((x) => (
                    <option key={x}>{x}</option>
                  ))}
              </select>
            </label>
            <label className="mt-4 block">
              Tags
              <input
                className="field mt-2"
                value={
                  Array.isArray(form.tags) ? form.tags.join(", ") : form.tags
                }
                onChange={(e) => update("tags", e.target.value)}
                placeholder="design, ux, product"
              />
            </label>
            <label className="mt-4 block">
              Estimasi baca
              <div className="mt-2 flex">
                <input
                  type="number"
                  min="1"
                  className="field rounded-r-none"
                  value={String(form.read).replace(/\D/g, "")}
                  onChange={(e) => update("read", `${e.target.value} min`)}
                />
                <span className="grid place-items-center rounded-r-xl border border-l-0 border-white/15 px-3 text-xs text-slate-500">
                  Menit
                </span>
              </div>
            </label>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Search size={17} className="text-accent" />
              <h2 className="font-medium">SEO & Metadata</h2>
            </div>
            <div className="mt-5 space-y-4">
              <label>
                SEO title
                <input
                  className="field mt-2"
                  value={form.seoTitle || ""}
                  onChange={(e) => update("seoTitle", e.target.value)}
                  placeholder="Kosongkan untuk memakai default"
                />
              </label>
              <label>
                SEO description
                <textarea
                  rows="3"
                  className="field mt-2"
                  value={form.seoDescription || ""}
                  onChange={(e) => update("seoDescription", e.target.value)}
                  placeholder="Deskripsi untuk mesin pencari"
                />
              </label>
              <label>
                Meta keywords
                <input
                  className="field mt-2"
                  value={form.seoKeywords || ""}
                  onChange={(e) => update("seoKeywords", e.target.value)}
                  placeholder="keyword, lainnya"
                />
              </label>
              <label>
                Social image URL
                <input
                  className="field mt-2"
                  value={form.seoImage || ""}
                  onChange={(e) => update("seoImage", e.target.value)}
                  placeholder="/images/share.jpg"
                />
              </label>
            </div>
          </section>
        </aside>
        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <Button>{id ? "Save changes" : "Create"}</Button>
          {!id && (
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setForm((f) => ({ ...f, status: "Draft" }));
              }}
            >
              Create & create another
            </Button>
          )}
          <Button to="/admin/articles" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
function AdminProjects(){const [items,setItems]=useState(()=>getStore('projects',seedProjects));const remove=id=>{const x=items.filter(p=>p.id!==id);setItems(x);localStorage.setItem('projects',JSON.stringify(x))};return <AdminLayout><AdminHeader title="Projects" text="Keep your case studies fresh." action={<Button to="/admin/projects/create"><Plus size={16}/> New project</Button>}/><div className="mt-8 grid gap-4 md:grid-cols-2">{items.map(p=><div className="flex items-center gap-4 rounded-2xl border border-white/10 p-4" key={p.id}><img src={p.cover} className="h-20 w-24 rounded-xl object-cover"/><div className="min-w-0 flex-1"><p className="font-medium">{p.title}</p><p className="mt-1 text-sm text-slate-500">{p.category} · {p.year}</p></div><Link to={`/admin/projects/${p.id}/edit`} className="text-accent"><Edit3 size={16}/></Link><button onClick={()=>remove(p.id)} className="text-red-300"><Trash2 size={16}/></button></div>)}</div></AdminLayout>}
function ProjectEditor(){const {id}=useParams();const nav=useNavigate();const existing=getStore('projects',seedProjects).find(p=>p.id===id);const [form,setForm]=useState(existing||{title:'',slug:'',category:'UI/UX',year:String(new Date().getFullYear()),description:'',cover:'/images/fahmi.png',client:'',role:'',duration:'',tools:[]});const update=(k,v)=>setForm(f=>({...f,[k]:v}));const save=e=>{e.preventDefault();const items=getStore('projects',seedProjects);const next={...form,id:id||String(Date.now()),tools:typeof form.tools==='string'?form.tools.split(',').map(x=>x.trim()).filter(Boolean):form.tools,gallery:existing?.gallery||[form.cover]};localStorage.setItem('projects',JSON.stringify(id?items.map(x=>x.id===id?next:x):[next,...items]));nav('/admin/projects')};return <AdminLayout><AdminHeader title={id?'Edit project':'New project'} text="Changes are saved to local mock storage."/><form onSubmit={save} className="mt-8 max-w-3xl space-y-5"><input required className="field" value={form.title} onChange={e=>update('title',e.target.value)} placeholder="Project title"/><input required className="field" value={form.slug} onChange={e=>update('slug',e.target.value)} placeholder="slug"/><textarea required rows="4" className="field" value={form.description} onChange={e=>update('description',e.target.value)} placeholder="Short description"/><div className="grid gap-5 md:grid-cols-2"><input className="field" value={form.category} onChange={e=>update('category',e.target.value)} placeholder="Category"/><input className="field" value={form.year} onChange={e=>update('year',e.target.value)} placeholder="Year"/></div><div className="grid gap-5 md:grid-cols-2"><input className="field" value={form.client} onChange={e=>update('client',e.target.value)} placeholder="Client"/><input className="field" value={form.role} onChange={e=>update('role',e.target.value)} placeholder="Role"/></div><input className="field" value={form.cover} onChange={e=>update('cover',e.target.value)} placeholder="Cover image URL"/><input className="field" value={Array.isArray(form.tools)?form.tools.join(', '):form.tools} onChange={e=>update('tools',e.target.value)} placeholder="Tools, comma separated"/><div className="flex gap-3"><Button>Save project</Button><Button to="/admin/projects" variant="secondary">Cancel</Button></div></form></AdminLayout>}
function AdminCategories(){const [cats,setCats]=useState(['UI/UX','Product Design','Web Development','Fintech','SaaS','Mobile App']);const [name,setName]=useState('');return <AdminLayout><AdminHeader title="Categories" text="Organize your articles and projects."/><div className="mt-8 flex gap-3"><input value={name} onChange={e=>setName(e.target.value)} className="field max-w-sm" placeholder="New category"/><Button onClick={()=>{if(name){setCats([...cats,name]);setName('')}}}><Plus size={16}/> Add</Button></div><div className="mt-6 flex flex-wrap gap-3">{cats.map(c=><span key={c} className="rounded-full border border-white/10 px-4 py-2 text-sm">{c}</span>)}</div></AdminLayout>}
function AdminMedia(){const [files,setFiles]=useState([]);return <AdminLayout><AdminHeader title="Media library" text="Upload and manage visual assets."/><label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 p-12 text-center hover:border-accent"><ImageIcon className="text-accent"/><span className="mt-3">Choose images to upload</span><span className="mt-1 text-sm text-slate-500">JPG, PNG, WEBP, SVG · max 10MB</span><input type="file" multiple accept="image/*" className="hidden" onChange={e=>setFiles(Array.from(e.target.files||[]))}/></label>{files.length>0&&<div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{files.map(f=><div key={f.name} className="rounded-xl border border-white/10 p-3 text-sm"><p className="truncate">{f.name}</p><p className="mt-1 text-xs text-slate-500">Ready for Supabase Storage</p></div>)}</div>}</AdminLayout>}
function Empty({text}){return <div className="py-20 text-center text-slate-500">{text}</div>}
function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/projects" element={<Projects/>}/><Route path="/projects/:slug" element={<ProjectDetail/>}/><Route path="/articles" element={<Articles/>}/><Route path="/articles/category/:category" element={<Articles/>}/><Route path="/articles/:slug" element={<ArticleDetail/>}/><Route path="/contact" element={<Contact/>}/><Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin" element={<RequireAuth><Admin/></RequireAuth>}/><Route path="/admin/articles" element={<RequireAuth><AdminArticles/></RequireAuth>}/><Route path="/admin/articles/create" element={<RequireAuth><ArticleEditor/></RequireAuth>}/><Route path="/admin/articles/:id/edit" element={<RequireAuth><ArticleEditor/></RequireAuth>}/><Route path="/admin/projects" element={<RequireAuth><AdminProjects/></RequireAuth>}/><Route path="/admin/projects/create" element={<RequireAuth><ProjectEditor/></RequireAuth>}/><Route path="/admin/projects/:id/edit" element={<RequireAuth><ProjectEditor/></RequireAuth>}/><Route path="/admin/categories" element={<RequireAuth><AdminCategories/></RequireAuth>}/><Route path="/admin/media" element={<RequireAuth><AdminMedia/></RequireAuth>}/><Route path="/admin/settings" element={<RequireAuth><AdminSettings/></RequireAuth>}/><Route path="/admin/appearance" element={<RequireAuth><AdminAppearance/></RequireAuth>}/><Route path="*" element={<NotFound/>}/></Routes>}
createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
