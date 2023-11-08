import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  shortcuts: [
    {
      "blog-bg": "bg-#fff dark:bg-#333",
      "text-primary": "text-#1C1C1F dark:text-#f3f3f3",
      "text-date": "text-#6C6D7A dark:text-#6C6D7A text-12px",
    },
  ],
  theme: {
    colors: {
      hyperlink: "#5E6070",
      "hyperlink:dark": "#8B8C8D",
      "hyperlink:hover": "#E282FA",
      "hyperlink:dark:hover": "#EDA8FB",
      "table-border": "#d0d7de",
      "table-2n-row": "#f6f8fa",
    },
  },
  preflights: [
    {
      getCSS: ({ theme: { colors } }) => `
        *{box-sizing:border-box}
        html{font-family:serif;}
        pre{margin-left:-1rem;margin-right:-1rem;padding:1rem;overflow:auto;border-radius: 0.5rem;}
        a{color:${colors.hyperlink};transition-property:color;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:300ms;}
        a:hover{color:${colors["hyperlink:hover"]}}
        @media (prefers-color-scheme: dark){
          a{color:${colors["hyperlink:dark"]}}
          a:hover{color:${colors["hyperlink:dark:hover"]}}
        }
        img{max-width:100%;}
        table{width:max-content;max-width:100%;display:block;overflow:auto;border-spacing:0;border-collapse:collapse;}
        table th,table td{padding:0.375rem 0.825rem;border-width: 1px;border-style: solid;border-color:${colors["table-border"]};}
        table tr:nth-child(2n){background-color:${colors["table-2n-row"]}}
      `,
    },
  ],
  presets: [presetUno({ dark: "media" })],
});
