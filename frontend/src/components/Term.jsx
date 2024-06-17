import Tooltip from "@mui/material/Tooltip";
import { forwardRef, useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Zoom from "@mui/material/Zoom";
const Term = forwardRef(
  ({ name, defn, alt_defns, level, created, review, onFocus }, ref) => {
    const [open, setOpen] = useState(false);
    const handleTooltipClose = () => {
      setOpen(false);
    };

    const handleTooltipOpen = () => {
      setOpen(true);
    };
    return (
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableTouchListener
          disableHoverListener
          TransitionComponent={Zoom}
          title={
            <div className="drop-shadow-lg text-tooltiptext">
              <u>Term:</u> {name}
              <br />
              <u>Definition:</u> {defn}
              <br />
              <u>Alternate Definitions:</u> {alt_defns ? alt_defns : "None"}
              <br />
              <u>Level:</u> {level}
              <br />
              <u>Date Created:</u> {created}
              <br />
              <u>Next Review:</u> {review}
            </div>
          }
          slotProps={{ tooltip: { style: { backgroundColor: "#BEAECD" } } }}
        >
          <button ref={ref} className="m-1" onClick={handleTooltipOpen}>
            {name}
          </button>
        </Tooltip>
      </ClickAwayListener>
    );
  }
);

export default Term;
