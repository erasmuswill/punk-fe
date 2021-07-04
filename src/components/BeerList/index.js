import { useBeerList } from "../../api";
import InfiniteScroll from "react-infinite-scroll-component";
import "./BeerList.scss";

function BeerList() {
  const {
    beers,
    isLoadingMore,
    isLoadingInitialData,
    size,
    setSize,
    isValidating,
    hasNextPage,
  } = useBeerList();
  const loadMoreRows = isLoadingMore ? () => {} : () => setSize(size + 1);
  return (
    <div className="beer-list">
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
              <img height="100" src={image_url} />
            </div>
            <div className="name"><h3>{name}</h3></div>
            <span className="abv">{abv}%</span>
            <div className="description">{description}</div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
export default BeerList;
