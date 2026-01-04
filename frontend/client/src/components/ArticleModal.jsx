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
    <div className="modal fade show article-modal" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title">{article.title}</h6>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <p className="text-muted small mb-2">
              {article.sourceName} •{" "}
              {new Date(article.publishedAt).toLocaleString()}
            </p>

            <p>{article.description}</p>

            <a href={article.url} target="_blank" rel="noreferrer">
              Read original article
            </a>
          </div>

          <div className="modal-footer d-flex justify-content-between">
            <div>
              <button
                className="btn btn-outline-secondary btn-sm me-2"
                onClick={handleCopy}
              >
                Copy Link
              </button>

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handleExport}
              >
                Export CSV
              </button>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
