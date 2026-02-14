import { makeStyles, tokens } from "@fluentui/react-components";

export const useAuditCardStyles = makeStyles({
  cardBase: {
    margin: "auto",
    width: "720px",
    maxWidth: "100%",
    height: "fit-content",
    cursor: "default",
    transitionDuration: tokens.durationNormal,
    transitionProperty: "box-shadow, border-color, transform, background-color",
    transitionTimingFunction: tokens.curveEasyEase,
    
    ":hover": {
      boxShadow: tokens.shadow8,
      transform: "translateY(-2px)",
    },
    
    ":active": {
      transform: "translateY(0)",
    },
  },
  
  cardCreate: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    
    ":hover": {
      backgroundColor: tokens.colorPaletteGreenBackground1,
    },
  },
  
  cardUpdate: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    
    ":hover": {
      backgroundColor: tokens.colorPaletteYellowBackground1,
    },
  },
  
  cardDefault: {
    backgroundColor: tokens.colorPaletteBerryBackground2,
    
    ":hover": {
      backgroundColor: tokens.colorPaletteBerryBackground1,
    },
  },
  
  text: {
    margin: "0",
  },
  
  caption: {
    color: tokens.colorNeutralForeground3,
  },
});
