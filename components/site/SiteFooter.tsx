export function SiteFooter({ labName, footerNote }: { labName: string; footerNote: string }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>{labName}</p>
        <span>{footerNote}</span>
      </div>
    </footer>
  );
}
