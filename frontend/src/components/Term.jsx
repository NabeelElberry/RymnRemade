import Tooltip from "@mui/material/Tooltip";
import { forwardRef, useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";

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
          title={`Term: ${name}\n Definition: ${defn}\n Alternate Definitions: ${alt_defns}\n Level: ${level}\n Date Created: ${created}\n Next Review: ${review}\n`}
        >
          <button ref={ref} onClick={handleTooltipOpen}>
            {name}
          </button>
        </Tooltip>
      </ClickAwayListener>
    );
  }
);

export default Term;
