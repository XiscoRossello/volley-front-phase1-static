// Static footer. The year is computed at render time so it stays current
// without needing an update once a year.

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <small>© {year} Athletics Sports Club · Phase 2 (Dynamic React + REST API)</small>
      </div>
    </footer>
  );
}

export default Footer;
