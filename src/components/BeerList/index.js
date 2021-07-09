import { useBeerList } from "../../api";
import InfiniteScroll from "react-infinite-scroll-component";
import Criteria from "react-criteria";
import ReadMoreReact from "read-more-react";
import "./BeerList.scss";
import { useState } from "react";
import Textfield from "./TextField";
import { Empty } from "antd";
import Title from "antd/lib/typography/Title";

function BeerList() {
  const [filter, setFilter] = useState([]);
  const {
    beers,
    isLoadingMore,
    size,
    setSize,
    hasNextPage,
  } = useBeerList(
    filter.map(({ type, value }) => ({
      [type]: value.replaceAll(" ", "_"),
    }))
  );
  const loadMoreRows = isLoadingMore ? () => {} : () => setSize(size + 1);
  return (
    <>
      <div className="beer-list-filters">
        <Title level={2}>Filters</Title>
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
              addable: !filter.filter(({ type }) => type === "beer_name").length,
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
            {beers.map(({ abv, name, description, image_url }) => (
              <div className="beer-item">
                <div className="image">
                  <img height="100" src={image_url} alt={`Label for ${name}`} />
                </div>
                <div className="name">
                  <h3>{name}</h3>
                </div>
                <span className="abv">{abv}%</span>
                <div className="description">
                  <ReadMoreReact
                    text={description}
                    min={300}
                    ideal={310}
                    max={320}
                  />
                </div>
              </div>
            ))}
          </InfiniteScroll>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}
export default BeerList;
