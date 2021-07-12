import { Button, Tooltip, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRandomBeer } from "../../api";
import BeerDrawer from "../BeerDrawer";
import BeerItem from "../BeerItem";

const { Title } = Typography;

export default function RandomBeer() {
  const { beer = {}, loading, isValidating, mutate } = useRandomBeer();
  const [modalId, setModalId] = useState(null);
  return (
    <>
      <Title level={3} style={{ display: "inline", marginRight: "8px" }}>
        I'm feeling lucky
      </Title>
      <Tooltip title="Get new random beer">
        <Button
          icon={
            <ReloadOutlined
              spin={isValidating}
              disabled={loading || isValidating}
              onClick={() => mutate()}
            />
          }
        >
          New random beer
        </Button>
      </Tooltip>
      <BeerItem {...beer} setModalId={setModalId} />
      <BeerDrawer id={modalId} close={() => setModalId(null)} />
    </>
  );
}
