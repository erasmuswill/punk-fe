import ReadMoreReact from "read-more-react";
import "./BeerItem.scss";

function BeerItem({ abv, name, description, image_url, id, setModalId }) {
  if (!abv || !name || !description || !image_url || !id || !setModalId)
    return null;
  return (
    <div className="beer-item" key={id} onClick={() => setModalId(id)}>
      <div className="image">
        <img height="100" src={image_url} alt={`Label for ${name}`} />
      </div>
      <div className="name">
        <h3>{name}</h3>
      </div>
      <span className="abv">{abv}% alcohol</span>
      <div className="description">
        <ReadMoreReact text={description} min={300} ideal={310} max={320} />
      </div>
    </div>
  );
}

export default BeerItem;
