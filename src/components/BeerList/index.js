import { useBeerList } from "../../api";
import InfiniteScroll from "react-infinite-scroll-component";
import Criteria from "react-criteria";
import "./BeerList.scss";
import { useState } from "react";
import Textfield from "./TextField";
import { Empty, Typography } from "antd";
import BeerDrawer from "../BeerDrawer";
import BeerItem from "../BeerItem";
const { Title } = Typography;

function BeerList() {
  const [modalId, setModalId] = useState(null);
  const [filter, setFilter] = useState([]);
  const { beers, isLoadingMore, size, setSize, hasNextPage } = useBeerList(
    filter.map(({ type, value }) => ({
      [type]: value.replaceAll(" ", "_"),
    }))
  );
  const loadMoreRows = isLoadingMore ? () => {} : () => setSize(size + 1);
  return (
    <>
      <Title level={3}>All beer</Title>
      <div className="beer-list-filters">
        <Title level={4}>Filters</Title>
        <Criteria
          data={filter}
          onChange={setFilter}
          criteria={{
            abv_gt: {
              label: "ABV Greater Than",
              addable: !filter.filter(({ type }) => type === "abv_gt").length,
              component: {
                component: Textfield,
                props: {
                  min: 0.1,
                  max: 100,
                  type: "number",
                  autoFocus: true,
                  placeholder: "Enter maximum ABV",
                },
              },
            },
            abv_lt: {
              label: "ABV Lower Than",
              addable: !filter.filter(({ type }) => type === "abv_lt").length,
              component: {
                component: Textfield,
                props: {
                  min: 0.1,
                  max: 100,
                  type: "number",
                  autoFocus: true,
                  placeholder: "Enter minimum ABV",
                },
              },
            },
            brewed_before: {
              label: "Brewed before",
              addable: !filter.filter(({ type }) => type === "brewed_before")
                .length,
              component: {
                component: Textfield,
                addable: false,
                props: {
                  type: "date",
                  picker: "month",
                  autoFocus: true,
                  placeholder: "Enter maximum first brew date",
                },
              },
            },
            beer_name: {
              label: "Beer Name",
              addable: !filter.filter(({ type }) => type === "beer_name")
                .length,
              component: {
                component: Textfield,
                addable: false,
                props: {
                  autoFocus: true,
                  placeholder: "Enter a term to find beer",
                },
              },
            },
          }}
        />
      </div>
      <div className="beer-list">
        {beers && beers.length ? (
          <InfiniteScroll
            dataLength={beers.length}
            next={loadMoreRows}
            hasMore={hasNextPage}
            loader={<h4>Loading...</h4>}
            endMessage={
              beers.length > 20 && (
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              )
            }
          >
            {beers.map((beer) => (
              <BeerItem {...beer} setModalId={setModalId} />
            ))}
          </InfiniteScroll>
        ) : (
          <Empty />
        )}
      </div>
      <BeerDrawer id={modalId} close={() => setModalId(null)} />
    </>
  );
}
export default BeerList;
