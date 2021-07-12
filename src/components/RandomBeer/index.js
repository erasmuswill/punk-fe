import { Button } from "antd";
import { useState } from "react";
import { useRandomBeer } from "../../api";
import BeerDrawer from "../BeerDrawer";
import "./RandomBeer.scss";

export default function RandomBeer() {
  const {
    beer: { name, image_url, description, id } = {},
    loading,
    isValidating,
    mutate,
  } = useRandomBeer();
  const [modalId, setModalId] = useState(null);
  return (
    <div className="random-beer">
      <div className="title-block">
        <h3>{name}</h3>
        <img height="100" src={image_url} alt={`Label for ${name}`} />
      </div>
      <div className="label-block">{description}</div>
      <div className="cta-block">
        <Button
          type="primary"
          loading={loading || isValidating}
          onClick={() => mutate()}
        >
          Random beer
        </Button>
        <Button
          type="default"
          loading={loading || isValidating}
          onClick={() => setModalId(id)}
        >
          More details
        </Button>
      </div>
      <BeerDrawer id={modalId} close={() => setModalId(null)} />
    </div>
  );
}
