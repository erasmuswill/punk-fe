import { Button } from "antd";
import { useRandomBeer } from "../../api";
import "./RandomBeer.scss";

export default function RandomBeer() {
  const {
    beer: { name, image_url, description } = {},
    loading,
    isValidating,
    mutate,
  } = useRandomBeer();
  return (
    <div className="random-beer">
      <div className="title-block">
        <h3>{name}</h3>
        <img height="100" src={image_url} alt={`Label for ${name}`} />
      </div>
      <div className="label-block">{description}</div>
      <div className="cta-block">
        <Button
          type="default"
          loading={loading || isValidating}
          onClick={() => mutate()}
        >
          Random beer
        </Button>
      </div>
    </div>
  );
}
