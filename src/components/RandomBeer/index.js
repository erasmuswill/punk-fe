import { Button, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useState, Suspense } from "react";
import { useRandomBeer } from "../../api";
import BeerDrawer from "../BeerDrawer";
import BeerItem from "../BeerItem";

const { Title } = Typography;

function RandomBeer() {
  const { beer = {}, loading, isValidating, mutate } = useRandomBeer();
  const [modalId, setModalId] = useState(null);
  return (
    <>
      <Title level={3}>I'm feeling lucky</Title>
      <BeerItem {...beer} setModalId={setModalId} />
      <Button
        type="primary"
        disabled={loading || isValidating}
        onClick={() => mutate()}
        icon={<ReloadOutlined spin={isValidating} />}
      >
        New random beer
      </Button>
      <BeerDrawer id={modalId} close={() => setModalId(null)} />
    </>
  );
}

const SuspensefulBeerDrawer = (props) => (
  <Suspense
    fallback={
      <>
        <Title level={3}>I'm feeling lucky</Title>
        <BeerItem loading />
        <Button loading disabled icon={<ReloadOutlined spin />}>
          New random beer
        </Button>
      </>
    }
  >
    <RandomBeer {...props} />
  </Suspense>
);

export default SuspensefulBeerDrawer;
