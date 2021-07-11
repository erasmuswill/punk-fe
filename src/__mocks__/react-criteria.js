export default ({ onChange }) => {
  const trigger = () => {
    onChange([
      {
        value: "01-2021",
        type: "brewed_before",
      },
      {
        value: "blonde",
        type: "beer_name",
      },
    ]);
  };
  return (
    <div>
      <button onClick={trigger}>Add filter</button>
    </div>
  );
};
