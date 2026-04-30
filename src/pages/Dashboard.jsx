import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Database, Plus, LogOut, LayoutGrid, Clock, 
  ChevronRight, BarChart3, Database as DbIcon, 
  Settings, User as UserIcon, HelpCircle,
  ChevronLeft, Menu
} from 'lucide-react';

// Design Tokens
const T = {
  bg: "#050508",
  surface: "#0a0a10",
  card: "#0f0f18",
  cardHover: "#13131e",
  border: "#1c1c2e",
  cyan: "#00e5ff",
  cyanDim: "#00e5ff12",
  purple: "#9b6dff",
  purpleDim: "#9b6dff12",
  text: "#f0f0fa",
  textSoft: "#9090b8",
  textMuted: "#55557a",
  fontDisplay: "'Space Grotesk', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const res = await axios.get('/api/datasets');
        setDatasets(res.data);
      } catch (err) {
        console.error("Failed to fetch datasets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarWidth = isCollapsed ? 80 : 260;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: T.fontDisplay }}>
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed', left: 0, top: 0, bottom: 0,
          background: T.surface, borderRight: `1px solid ${T.border}`,
          padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: 32,
          zIndex: 100, overflow: 'hidden'
        }}
      >
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', position: 'relative' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${T.cyan}, ${T.purple})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.fontMono, fontWeight: 700, color: '#000'
          }}>MF</div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.5, whiteSpace: 'nowrap' }}
            >
              ModelForge
            </motion.span>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <NavItem 
            icon={<LayoutGrid size={20}/>} 
            label="Dashboard" 
            active={location.pathname === '/dashboard'} 
            isCollapsed={isCollapsed}
            onClick={() => navigate('/dashboard')}
          />
          <NavItem 
            icon={<BarChart3 size={20}/>} 
            label="My Models" 
            isCollapsed={isCollapsed}
            onClick={() => navigate('/dashboard')} 
          />
          <NavItem 
            icon={<DbIcon size={20}/>} 
            label="Datasets" 
            isCollapsed={isCollapsed}
            onClick={() => navigate('/dashboard')}
          />
          <NavItem 
            icon={<Settings size={20}/>} 
            label="Settings" 
            isCollapsed={isCollapsed}
            onClick={() => navigate('/dashboard')}
          />
        </nav>

        {/* User & Footer */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            padding: 12, background: T.card, borderRadius: 12, border: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden'
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: T.cyanDim, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.cyan }}>
              <UserIcon size={16} />
            </div>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email?.split('@')[0]}
                </div>
                <div style={{ fontSize: 10, color: T.textMuted }}>Pro Member</div>
              </motion.div>
            )}
          </div>
          
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            color: T.textMuted, background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: 14, transition: '0.2s', whiteSpace: 'nowrap'
          }} onMouseEnter={e => e.currentTarget.style.color = '#ff4757'}>
            <LogOut size={20} /> {!isCollapsed && "Logout"}
          </button>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            position: 'absolute', right: -12, top: 70, 
            width: 24, height: 24, borderRadius: '50%',
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 110, boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
          }}
        >
          {isCollapsed ? <Menu size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        animate={{ marginLeft: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ padding: '40px 48px' }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Welcome Back</h1>
            <p style={{ color: T.textSoft, fontSize: 15 }}>You have {datasets.length} active ML projects in your workspace.</p>
          </div>
          <button 
            onClick={() => navigate('/pipeline')}
            style={{
              background: T.cyan, color: '#000', border: 'none', padding: '12px 24px',
              borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', boxShadow: `0 0 20px ${T.cyan}40`, transition: '0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={18} /> New Project
          </button>
        </header>

        {loading ? (
          <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader"></div>
          </div>
        ) : datasets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: T.card, border: `1px solid ${T.border}`, borderRadius: 24,
              padding: '80px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}
          >
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: T.cyanDim, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.cyan, marginBottom: 24 }}>
              <Database size={40} />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Your Workspace is Empty</h3>
            <p style={{ color: T.textMuted, maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Start by uploading a dataset. We'll automatically analyze it and help you build production-ready ML models.
            </p>
            <button 
              onClick={() => navigate('/pipeline')}
              style={{
                background: 'transparent', border: `1px solid ${T.cyan}`, color: T.cyan,
                padding: '12px 32px', borderRadius: 12, fontWeight: 600, cursor: 'pointer'
              }}
            >
              Upload Your First CSV
            </button>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            <AnimatePresence>
              {datasets.map((ds, index) => (
                <ProjectCard 
                  key={ds.id} 
                  ds={ds} 
                  index={index} 
                  onClick={() => navigate(`/eda/${ds.id}`)} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.main>

      <style>{`
        .loader {
          width: 40px; height: 40px; border: 3px solid ${T.cyanDim};
          border-top-color: ${T.cyan}; border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function NavItem({ icon, label, active = false, isCollapsed, onClick }) {
  return (
    <div 
      onClick={onClick}
      title={isCollapsed ? label : ""}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
        borderRadius: 12, cursor: 'pointer', transition: '0.2s',
        background: active ? T.cyanDim : 'transparent',
        color: active ? T.cyan : T.textSoft,
        fontWeight: active ? 600 : 400,
        justifyContent: isCollapsed ? 'center' : 'flex-start'
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.background = T.border + "40";
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>
      {!isCollapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: 14, whiteSpace: 'nowrap' }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}

function ProjectCard({ ds, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, borderColor: T.cyan + '60' }}
      onClick={onClick}
      style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 20,
        padding: 24, cursor: 'pointer', transition: 'border-color 0.3s'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: T.purpleDim, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.purple }}>
          <BarChart3 size={22} />
        </div>
        <div style={{ color: T.textMuted }}><ChevronRight size={18} /></div>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {ds.file_name}
      </h3>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.textMuted, fontSize: 12, marginBottom: 24 }}>
        <Clock size={12} />
        {new Date(ds.upload_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: '#ffffff03', padding: '10px 12px', borderRadius: 10, border: '1px solid #ffffff05' }}>
          <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Rows</div>
          <div style={{ fontFamily: T.fontMono, fontSize: 14, fontWeight: 600, color: T.cyan }}>{ds.number_of_rows?.toLocaleString()}</div>
        </div>
        <div style={{ background: '#ffffff03', padding: '10px 12px', borderRadius: 10, border: '1px solid #ffffff05' }}>
          <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Features</div>
          <div style={{ fontFamily: T.fontMono, fontSize: 14, fontWeight: 600, color: T.purple }}>{ds.number_of_columns}</div>
        </div>
      </div>
    </motion.div>
  );
}
