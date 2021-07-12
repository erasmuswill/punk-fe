import ReadMoreReact from "read-more-react";
import Skeleton from "react-loading-skeleton";
import "./BeerItem.scss";

function BeerItem({
  abv,
  name,
  description,
  image_url,
  id,
  setModalId = () => {},
  loading,
}) {
  if (
    !loading &&
    (!abv || !name || !description || !image_url || !id || !setModalId)
  )
    return null;
  return (
    <div className={"beer-item"} key={id} onClick={() => setModalId(id)}>
      <div className="image">
        {loading ? (
          <Skeleton height={100} width={50} />
        ) : (
          <img
            height="100"
            src={loading ? "https://images.punkapi.com/v2/keg.png" : image_url}
            alt={`Label for ${name}`}
          />
        )}
      </div>
      <div className="name">
        <h3>{loading ? <Skeleton /> : name}</h3>
      </div>
      <span className="abv">{loading ? <Skeleton /> : `${abv}% alcohol`}</span>
      <div className="description">
        {loading ? (
          <Skeleton count={2} />
        ) : (
          <ReadMoreReact text={description} min={300} ideal={310} max={320} />
        )}
      </div>
    </div>
  );
}

export default BeerItem;
