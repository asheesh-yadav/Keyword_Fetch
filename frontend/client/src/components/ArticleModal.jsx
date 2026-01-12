import "./ArticleModal.css";

const ArticleModal = ({ article, onClose }) => {
  if (!article) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(article.url);
    alert("Article link copied");
  };

  const handleExport = () => {
    const csv = `Title,Description,Source,Published At,URL
"${article.title}","${article.description || ""}","${article.sourceName}","${article.publishedAt}","${article.url}"`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "article.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="article-overlay">
      <div className="article-modal-box">

        {/* HEADER */}
        <div className="modal-header-new">
          <h3>{article.title}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* META */}
        <p className="modal-meta">
          📰 {article.sourceName} • 📅{" "}
          {new Date(article.publishedAt).toLocaleString()}
        </p>

        {/* CONTENT */}
        <div className="modal-content-new">
          <p>{article.description}</p>

          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="read-link"
          >
            🔗 Read original article
          </a>
        </div>

        {/* FOOTER */}
        <div className="modal-footer-new">

          <div className="left-actions">
            <button onClick={handleCopy} className="btn-outline">
              📋 Copy link
            </button>

            <button onClick={handleExport} className="btn-primary">
              ⬇ Export CSV
            </button>
          </div>

          <button onClick={onClose} className="btn-close-new">
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default ArticleModal;
