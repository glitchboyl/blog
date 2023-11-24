import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  shortcuts: [
    {
      "blog-bg": "bg-#fff dark:bg-#212129 transition-colors-300",
      "text-primary": "text-#1C1C1F dark:text-#F7F7FC transition-color-300",
      "text-date":
        "text-#A9AAB8 dark:text-#4C4C4C text-12px transition-color-300",
    },
  ],
  theme: {
    colors: {
      hyperlink: "#6C6D7A",
      "hyperlink:dark": "#B0B0B8",
      "hyperlink:hover": "#E282FA",
      "hyperlink:dark:hover": "#EDA8FB",
      "inline-code-block": "#FEEBFF",
      "inline-code-block:dark": "#12001A",
      "table-border": "#d0d7de",
      "table-border:dark": "#30363d",
      "table-2n-row": "#f6f8fa",
      "table-2n-row:dark": "#161b22",
    },
  },
  preflights: [
    {
      getCSS: ({ theme: { colors } }) => `
        *{box-sizing:border-box;}
        html{font-family:serif;}
        pre{margin-left:-1rem;margin-right:-1rem;padding:1rem;overflow:auto;border-radius:0.5rem;}
        blockquote{margin-left:-1rem;margin-right:-1rem;padding-left:1rem;padding-right:1rem;border-left:3px solid;border-color:#A9AAB8;opacity:.75;}
        :not(pre)>code{padding:0.2em 0.2em 0.1em;border-radius:0.4rem;white-space:normal;background-color:${colors["inline-code-block"]};}
        a{color:${colors.hyperlink};transition-property:color;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:300ms;}
        a:hover{color:${colors["hyperlink:hover"]}}
        img{max-width:100%;}
        table{width:max-content;max-width:100%;display:block;overflow:auto;border-spacing:0;border-collapse:collapse;}
        table th,table td{padding:0.375rem 0.825rem;border-width:1px;border-style:solid;border-color:${colors["table-border"]};}
        table tr:nth-child(2n){background-color:${colors["table-2n-row"]}}
        @media (prefers-color-scheme: dark){
          a{color:${colors["hyperlink:dark"]}}
          a:hover{color:${colors["hyperlink:dark:hover"]}}
          :not(pre)>code{background-color:${colors["inline-code-block:dark"]}}
          table th,table td{border-color:${colors["table-border:dark"]};}
          table tr:nth-child(2n){background-color:${colors["table-2n-row:dark"]}}
        }
      `,
    },
  ],
  presets: [
    presetUno({
      dark: "media",
    }),
  ],
});
