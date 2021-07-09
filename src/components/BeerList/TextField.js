import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createUseStyles } from "react-jss";
import { useTheme } from "react-criteria";
import { DatePicker, Input } from "antd";
import moment from 'moment';

const useStyles = createUseStyles({
  rootGutterBottom: {
    marginBottom: "1em",
  },

  field: (theme) => ({
    width: "100%",
    padding: "1em",
    fontSize: "1em",
    color: "inherit",
    borderRadius: "2px",
    backgroundColor: "transparent",
    border: `solid 1px ${theme.container.borderColor}`,
  }),

  label: {
    display: "block",
    marginBottom: ".5em",
  },
});

function Textfield(props) {
  const {
    value,
    label,
    type = "text",
    gutterBottom = false,
    onChange: onChangeProp,
    ...otherProps
  } = props;

  const classes = useStyles(useTheme());
  const id = React.useMemo(() => uuidv4(), []);
  const [selDate,setDate]=useState(null);

  const onChange = React.useCallback(
    (ev) => {
      if (typeof onChangeProp !== "function") return;
      if (type === "date") {onChangeProp(ev.format("MM-YYYY")); setDate(ev)}
      else onChangeProp(ev.target.value.replace(/[^a-zA-Z0-9-\s]/,''));
    },
    [onChangeProp]
  );

  const rootElementClassName = React.useMemo(() => {
    const classNames = [];

    if (gutterBottom === true) classNames.push(classes.rootGutterBottom);

    return classNames.join(" ");
  }, [classes, gutterBottom]);

  return (
    <div className={rootElementClassName}>
      {label != null && (
        <label htmlFor={id} className={classes.label}>
          {label}
        </label>
      )}

      {type !== "date" ? (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className={classes.field}
          {...otherProps}
        />
      ) : (
        <DatePicker
          id={id}
          type={type}
          value={selDate}
          onChange={onChange}
          className={classes.field}
          {...otherProps}
        />
      )}
    </div>
  );
}

export default React.memo(Textfield);
