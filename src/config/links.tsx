export type Link = {
  name: string;
  url: string;
};

export const links = {
  "Prisma Client": {
    CRUD: [
      { name: "create", url: "https://www.prisma.io/docs/orm/prisma-client/queries/crud#create" },
      { name: "createMany", url: "https://www.prisma.io/docs/orm/prisma-client/queries/crud#create-multiple-records" },
      { name: "findUnique", url: "https://www.prisma.io/docs/orm/prisma-client/queries/crud#get-record-by-id-or-unique-identifier" },
      { name: "findMany", url: "https://www.prisma.io/docs/orm/prisma-client/queries/crud#get-all-records" },
      { name: "update", url: "https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-a-single-record" },
      { name: "updateMany", url: "https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-multiple-records" },
      { name: "upsert", url: "https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-or-create-records" },
      { name: "delete", url: "https://www.prisma.io/docs/orm/prisma-client/queries/crud#delete-a-single-record" },
      { name: "deleteMany", url: "https://www.prisma.io/docs/orm/prisma-client/queries/crud#delete-multiple-records" },
    ],
    "Relation queries": [
      { name: "include", url: "https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#include-a-relation" },
      { name: "select", url: "https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#select-specific-fields-of-included-relations" },
      { name: "Nested writes", url: "https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes" },
    ],
    "Relation filter": [
      { name: "some", url: "https://www.prisma.io/docs/orm/reference/prisma-client-reference#some" },
      { name: "none", url: "https://www.prisma.io/docs/orm/reference/prisma-client-reference#none" },
      { name: "is", url: "https://www.prisma.io/docs/orm/reference/prisma-client-reference#is" },
      { name: "isNot", url: "https://www.prisma.io/docs/orm/reference/prisma-client-reference#isnot" },
    ],
  },
  React: {
    Hooks: [
      { name: "rules", url: "https://ja.react.dev/reference/rules/rules-of-hooks" },
      { name: "useState", url: "https://ja.react.dev/reference/react/hooks#state-hooks" },
      { name: "useRef", url: "https://ja.react.dev/reference/react/hooks#ref-hooks" },
      { name: "useEffect", url: "https://ja.react.dev/reference/react/hooks#effect-hooks" },
      { name: "useContext", url: "https://ja.react.dev/reference/react/hooks#context-hooks" },
    ],
    Other: [
      { name: "JSXのルール", url: "https://ja.react.dev/learn/writing-markup-with-jsx#the-rules-of-jsx" },
      { name: "JSX 反復処理", url: "https://typescriptbook.jp/reference/jsx#%E3%83%AB%E3%83%BC%E3%83%97%E5%8F%8D%E5%BE%A9%E5%87%A6%E7%90%86" },
      { name: "リストのレンダー", url: "https://ja.react.dev/learn/rendering-lists" },
    ],
  },
  便利ツール: [
    { name: "正規表現チェッカー", url: "https://www-creators.com/tool/regex-checker" },
    { name: "codic", url: "https://codic.jp/engine" },
    { name: "paiza.io", url: "https://paiza.io/ja/projects/new" },
    { name: "JSXコンバータ(html to jsx)", url: "https://transform.tools/html-to-jsx" },
  ],
  Todo: [
    { name: "Todo", url: "" },
    { name: "Todo", url: "" },
  ],
}