import "./ArticleList.css";

const ArticleList = ({ articles, loading }) => {
  if (loading) {
    return <div className="text-center py-5">Loading articles...</div>;
  }

  if (!articles.length) {
    return <div className="text-center py-5 text-muted">No articles found</div>;
  }

  return (
    <div className="row g-4">
      {articles.map((article) => (
        <div className="col-md-6 col-lg-4" key={article._id}>
          <div className="card article-card h-100">
            <div className="card-body d-flex flex-column">
              <h6 className="card-title">{article.title}</h6>

              <p className="card-text text-muted small">
                {article.description?.slice(0, 120)}...
              </p>

              <div className="mt-auto">
                <span className="badge bg-secondary me-2">
                  {article.sourceName}
                </span>
                <small className="text-muted">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </small>

                <div className="mt-3">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-primary w-100"
                  >
                    Read Article
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
