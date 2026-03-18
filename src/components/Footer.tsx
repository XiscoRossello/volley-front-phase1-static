function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <small>© {year} Athletics Sports Club · Static React Phase (Mock Data)</small>
      </div>
    </footer>
  );
}

export default Footer;
