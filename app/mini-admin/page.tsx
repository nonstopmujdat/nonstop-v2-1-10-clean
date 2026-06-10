import Link from 'next/link';

export default function MiniAdminPage() {
  return (
    <main className="nn-container">
      <div className="nn-header-area flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="nn-title">NONSTOP Mini Admin</h1>
          <span className="nn-subtitle">V2.1.25C - Core Command Center</span>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="nn-link" style={{ fontSize: '1rem' }}>Ana Sayfa</Link>
          <Link href="/operator" className="nn-link" style={{ fontSize: '1rem' }}>Maç Merkezi</Link>
          <Link href="/live" className="nn-link" style={{ fontSize: '1rem' }}>Canlı Skor</Link>
          <Link href="/dashboard" className="nn-link" style={{ fontSize: '1rem' }}>Dashboard</Link>
        </div>
      </div>

      <div className="nn-grid nn-grid-cols-6 mb-8">
        <div className="nn-stat-box"><span className="nn-stat-label">Organizasyon</span><span className="nn-stat-value">1</span></div>
        <div className="nn-stat-box"><span className="nn-stat-label">Takım</span><span className="nn-stat-value highlight-cyan">2</span></div>
        <div className="nn-stat-box"><span className="nn-stat-label">Oyuncu</span><span className="nn-stat-value highlight-orange">13</span></div>
        <div className="nn-stat-box"><span className="nn-stat-label">Operatör</span><span className="nn-stat-value">0</span></div>
        <div className="nn-stat-box"><span className="nn-stat-label">Maç</span><span className="nn-stat-value">2</span></div>
        <div className="nn-stat-box" style={{borderRight: 'none'}}><span className="nn-stat-label">Statü</span><span className="nn-stat-value" style={{color: '#22c55e', textShadow: '0 0 10px rgba(34, 197, 94, 0.4)'}}>ON</span></div>
      </div>

      <section className="nn-grid nn-grid-cols-2">
        <Link className="nn-card" href="/competitions#create-competition">
          <h2>🏆 Lig Yönetimi</h2>
          <p>İl, sezon, kategori, A/B seviyesi ve lig adı seçilerek yeni lig oluşturulur.</p>
        </Link>
        <Link className="nn-card" href="/competitions#create-competition">
          <h2>🏅 Turnuva Yönetimi</h2>
          <p>Turnuva adı, kategori ve tarih aralığıyla turnuva organizasyonu oluşturulur.</p>
        </Link>
        <Link className="nn-card" href="/competitions#add-team">
          <h2>👥 Organizasyona Takım Ekle</h2>
          <p>Lig veya turnuva seçilir, takımlar organizasyona bağlanır veya pasifleştirilir.</p>
        </Link>
        <Link className="nn-card" href="/competitions#create-match">
          <h2>📅 Resmi Maç Oluştur</h2>
          <p>Organizasyon, salon, tarih, saat, ev sahibi ve misafir seçilerek maç oluşturulur.</p>
        </Link>
        <Link className="nn-card" href="/mini-admin/teams">
          <h2>🏀 Takım Ekle</h2>
          <p>Kulüp, il, kategori ve sezon seçerek yeni takım oluştur.</p>
        </Link>
        <Link className="nn-card" href="/mini-admin/players">
          <h2>👤 Oyuncu Ekle</h2>
          <p>Takıma oyuncu ekle, forma no ve lisans no kaydet.</p>
        </Link>
        <Link className="nn-card" href="/mini-admin/operators">
          <h2>🎯 Operatör Ekle</h2>
          <p>Operatörü email ile kaydet. HOME/AWAY/BOTH görev bilgisi ileride maç atamasında kullanılacak.</p>
        </Link>
        <Link className="nn-card" href="/mini-admin/reports">
          <h2>📄 PDF Raporlar</h2>
          <p>Maç istatistik raporu ve saha üzeri şut/atış haritası PDF çıktısı al.</p>
        </Link>
        <Link className="nn-card" href="/competitions#matches">
          <h2>📋 Oluşturulan Maçlar</h2>
          <p>Planlanan maçlar ve operatör maç kuyruğu kontrol edilir.</p>
        </Link>
        <Link className="nn-card" href="/operator" style={{ borderColor: 'var(--nn-orange)', boxShadow: '0 0 15px rgba(255, 87, 34, 0.1)' }}>
          <h2 style={{ color: 'var(--nn-orange)' }}>🏀 Maç Merkezi</h2>
          <p>Mevcut il seç → salon seç → resmi maçlar → supervisor özel/hazırlık → operatör akışı burada korunur.</p>
        </Link>
        
        {/* NEW LINKS ADDED FOR TEAM DASHBOARD & SHOT CHART */}
        <Link href="/mini-admin/team-dashboard" className="nn-card">
          <h2>📊 Takım Analizi</h2>
          <p>Takım istatistikleri, MVP liderleri ve detaylı analizleri görüntüle.</p>
        </Link>
        <Link href="/mini-admin/shot-chart" className="nn-card">
          <h2>🏀 Şut Haritası</h2>
          <p>Oyuncuların saha içi şut dağılımlarını ve yüzdelerini incele.</p>
        </Link>
      </section>
    </main>
  );
}
