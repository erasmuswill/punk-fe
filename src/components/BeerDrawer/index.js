import {
  Descriptions,
  Drawer,
  Tooltip as Tooltip2,
  Row,
  Col,
  Button,
  Statistic,
  Table,
  List,
} from "antd";
import Skeleton from "react-loading-skeleton";
import { Suspense } from "react";
import Title from "antd/lib/typography/Title";
import { useState } from "react";
import { useBeer } from "../../api";
import "./BeerDrawer.scss";

function Tooltip({ children, ...props }) {
  return (
    <Tooltip2 overlayClassName="tooltip-overlay" {...props}>
      <span className="has-tooltip">{children}</span>
    </Tooltip2>
  );
}

function BeerDrawer({
  id,
  showIngredients,
  setShowIngredients,
  showMethod,
  setShowMethod,
}) {
  const { beer } = useBeer(id);
  if (!beer) return null;
  const {
    name,
    tagline,
    first_brewed,
    abv,
    ibu,
    target_fg,
    target_og,
    ebc,
    srm,
    ph,
    attenuation_level,
    volume,
    boil_volume,
    method: { mash_temp, twist, fermentation },
    ingredients: { hops, malt, yeast },
    food_pairing,
    brewers_tips,
  } = beer;
  return (
    <>
      <Title level={3}>{name}</Title>
      <Title level={4}>{tagline}</Title>
      <Row justify="space-between">
        <Col>
          <Statistic title="ABV" value={abv} />
        </Col>
        <Col>
          <Statistic title="IBU" value={ibu} />
        </Col>
        <Col>
          <Statistic title="OG" value={target_og} />
        </Col>
        <Col>
          <Statistic title="First Brewed" value={first_brewed} />
        </Col>
      </Row>
      <Descriptions title="Basics">
        <Descriptions.Item span={3}>
          Hover over the values for more details
        </Descriptions.Item>
        <Descriptions.Item label="Volume">
          <Tooltip title="Amount of wort at the end of the brewing process to be fermented">
            {volume.value} {volume.unit}
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="Boil Volume">
          <Tooltip
            title="Target amount of liquid to be collected through lautering and sparging
to then be boiled"
          >
            {boil_volume.value} {boil_volume.unit}
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="ABV">
          <Tooltip title="Alcohol by Volume">{abv}</Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="Target FG">
          <Tooltip title="Final Gravity; Measurement of relative density of the beer at end of fermentation">
            {target_fg}
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="Target OG">
          <Tooltip title="Original Gravity; Measurement of the relative density of the wort before fermentation">
            {target_og}
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="EBC">
          <Tooltip title="Measurement of colour used by european brewing convention">
            {ebc}
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="SRM">
          <Tooltip title="– Measurement of colour used by american society of brewing chemists">
            {srm}
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="pH">
          <Tooltip title="Power of Hydrogen; Measurement of acidity or alkalinity">
            {ph}
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="Attenuation level">
          <Tooltip title="Measurement of the percentage of sugars converted to alcohol and CO2">
            {attenuation_level}
          </Tooltip>
        </Descriptions.Item>
      </Descriptions>
      <Descriptions title="Food Pairings" />
      <List
        dataSource={food_pairing}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
      <Descriptions title="Brewer's Tips"></Descriptions>
      <span>{brewers_tips}</span>
      <Drawer
        title="Ingredients"
        width={400}
        onClose={() => setShowIngredients(false)}
        visible={showIngredients}
      >
        <Title level={3}>Malt</Title>
        <Table
          pagination={false}
          dataSource={malt.map(({ amount: { value, unit }, ...rest }) => ({
            amount: `${value} ${unit}`,
            ...rest,
          }))}
          columns={[
            {
              title: "Name",
              dataIndex: "name",
            },
            {
              title: "Amount",
              dataIndex: "amount",
            },
          ]}
        />
        <Title level={3}>Hops</Title>
        <Table
          pagination={false}
          dataSource={hops.map(({ amount: { value, unit }, ...rest }) => ({
            amount: `${value} ${unit}`,
            ...rest,
          }))}
          columns={[
            {
              title: "Name",
              dataIndex: "name",
            },
            {
              title: "Amount",
              dataIndex: "amount",
            },
            {
              title: "Add",
              dataIndex: "add",
            },
            {
              title: "Attribute",
              dataIndex: "attribute",
            },
          ]}
        />
        <Title level={3}>Yeast</Title>
        {yeast}
      </Drawer>
      <Drawer
        title="Method"
        width={400}
        onClose={() => setShowMethod(false)}
        visible={showMethod}
      >
        <Title level={3}>Mash temp</Title>
        <Table
          pagination={false}
          dataSource={mash_temp.map(({ temp: { value, unit }, ...rest }) => ({
            temp: `${value} ${unit}`,
            ...rest,
          }))}
          columns={[
            {
              title: "Temperature",
              dataIndex: "temp",
            },
            {
              title: "Duration",
              dataIndex: "duration",
            },
          ]}
        />
        <Title level={3}>Fermentation</Title>
        <Descriptions>
          <Descriptions.Item label="Temperature">
            {fermentation.temp.value} {fermentation.temp.unit}
          </Descriptions.Item>
        </Descriptions>
        {!!twist && (
          <>
            <Title level={3}>Twist</Title>
            {twist.split(",").map((v, i) => (
              <div key={i}>{v}</div>
            ))}
          </>
        )}
      </Drawer>
    </>
  );
}

function SuspensefulBeerDrawer(props) {
  const [showIngredients, setShowIngredients] = useState(false);
  const [showMethod, setShowMethod] = useState(false);
  return (
    <Drawer
      className="beer-drawer"
      width={window.innerWidth > 600 ? 520 : window.innerWidth - 40}
      onClose={props.close}
      visible={!!props.id && props.id !== 0}
      footer={
        <Row justify="space-around">
          <Col>
            <Button onClick={() => setShowIngredients(true)}>
              Show Ingredients
            </Button>
          </Col>
          <Col>
            <Button onClick={() => setShowMethod(true)}>Show Method</Button>
          </Col>
        </Row>
      }
    >
      <Suspense
        fallback={
          <>
            <Title level={3}>
              <Skeleton />
            </Title>
            <Title level={4}>
              <Skeleton />
            </Title>
            <Row justify="space-between">
              <Col>
                <Statistic loading title="ABV" />
              </Col>
              <Col>
                <Statistic loading title="IBU" />
              </Col>
              <Col>
                <Statistic loading title="OG" />
              </Col>
              <Col>
                <Statistic loading title="First Brewed" />
              </Col>
            </Row>
            <Descriptions title="Basics">
              <Descriptions.Item span={3}>
                Hover over the values for more details
              </Descriptions.Item>
              <Descriptions.Item label="Volume">
                <Tooltip title="Amount of wort at the end of the brewing process to be fermented">
                  <Skeleton width={60} />
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Boil Volume">
                <Tooltip
                  title="Target amount of liquid to be collected through lautering and sparging
to then be boiled"
                >
                  <Skeleton width={60} />
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="ABV">
                <Tooltip title="Alcohol by Volume">
                  <Skeleton width={60} />
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Target FG">
                <Tooltip title="Final Gravity; Measurement of relative density of the beer at end of fermentation">
                  <Skeleton width={60} />{" "}
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Target OG">
                <Tooltip title="Original Gravity; Measurement of the relative density of the wort before fermentation">
                  <Skeleton width={60} />{" "}
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="EBC">
                <Tooltip title="Measurement of colour used by european brewing convention">
                  <Skeleton width={60} />{" "}
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="SRM">
                <Tooltip title="– Measurement of colour used by american society of brewing chemists">
                  <Skeleton width={60} />{" "}
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="pH">
                <Tooltip title="Power of Hydrogen; Measurement of acidity or alkalinity">
                  <Skeleton width={60} />{" "}
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Attenuation level">
                <Tooltip title="Measurement of the percentage of sugars converted to alcohol and CO2">
                  <Skeleton width={60} />{" "}
                </Tooltip>
              </Descriptions.Item>
            </Descriptions>
            <Descriptions title="Food Pairings" />
            <List
              dataSource={[1, 1]}
              renderItem={() => (
                <List.Item>
                  <Skeleton width={250} />
                </List.Item>
              )}
            />
            <Descriptions title="Brewer's Tips"></Descriptions>
            <span>
              <Skeleton count={2} />
            </span>
          </>
        }
      >
        <BeerDrawer
          {...props}
          showIngredients={showIngredients}
          setShowIngredients={setShowIngredients}
          showMethod={showMethod}
          setShowMethod={setShowMethod}
        />
      </Suspense>
    </Drawer>
  );
}

export default SuspensefulBeerDrawer;
