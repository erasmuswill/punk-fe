import { useBeerList } from "../../api";
import InfiniteScroll from "react-infinite-scroll-component";
import Criteria from "react-criteria";
import "./BeerList.scss";
import { useState, Suspense } from "react";
import Textfield from "./TextField";
import { Empty, Spin, Typography } from "antd";
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
      <div className="all-beer-header">
        <Title level={3}>All beer</Title>
        <div className="beer-list-filters">
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
      </div>
      <div className="beer-list">
        {beers && beers.length ? (
          <InfiniteScroll
            dataLength={beers.length}
            next={loadMoreRows}
            hasMore={hasNextPage}
            loader={<Spin />}
          >
            {beers.map(({ id, ...beer }) => (
              <BeerItem {...beer} id={id} key={id} setModalId={setModalId} />
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

const SuspensefulBeerList = () => (
  <Suspense
    fallback={
      <>
        <Title level={3}>All beer</Title>
        <div className="beer-list-filters loading">
          <Spin />
        </div>
        <div className="beer-list">
          <BeerItem loading />
          <BeerItem loading />
          <BeerItem loading />
          <BeerItem loading />
          <BeerItem loading />
        </div>
      </>
    }
  >
    <BeerList />
  </Suspense>
);

export default SuspensefulBeerList;
