
// You can use this code in a separate component that's imported in your pages.
import React from "react"
const { MDXEditor, codeBlockPlugin, headingsPlugin, listsPlugin, linkPlugin, quotePlugin, markdownShortcutPlugin } = await import("@mdxeditor/editor")
import "@mdxeditor/editor/style.css"
import { AdmonitionDirectiveDescriptor, BoldItalicUnderlineToggles, codeMirrorPlugin, diffSourcePlugin, directivesPlugin, frontmatterPlugin, imagePlugin, InsertTable, InsertThematicBreak, linkDialogPlugin, ListsToggle, Separator, StrikeThroughSupSubToggles, tablePlugin, thematicBreakPlugin, toolbarPlugin, UndoRedo } from "@mdxeditor/editor"

export const YoutubeDirectiveDescriptor = {
  name: "youtube",
  type: "leafDirective",
  testNode(node) {
    return node.name === "youtube"
  },
  attributes: ["id"],
  hasChildren: false,
  Editor: ({ mdastNode, lexicalNode, parentEditor }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <button
        onClick={() => {
          parentEditor.update(() => {
            lexicalNode.selectNext()
            lexicalNode.remove()
          })
        }}
      >
        delete
      </button>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${mdastNode.attributes.id}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    </div>
  )
}
const Editor = (props) => <div className="w-full h-full p-2 border rounded-md">
  <MDXEditor
    {...props}
    plugins={[
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <UndoRedo />
            <Separator />
            <BoldItalicUnderlineToggles />
            <Separator />
            <StrikeThroughSupSubToggles />
            <Separator />
            <ListsToggle />
            <Separator />
            <InsertTable />
            <InsertThematicBreak />

          </>
        )
      }),
      listsPlugin(),
      quotePlugin(),
      headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
      linkPlugin(),
      linkDialogPlugin(),
      imagePlugin({
        imageAutocompleteSuggestions: ["https://via.placeholder.com/150", "https://via.placeholder.com/150"],
        // eslint-disable-next-line require-await
        imageUploadHandler: async () => Promise.resolve("https://picsum.photos/200/300")
      }),
      tablePlugin(),
      thematicBreakPlugin(),
      frontmatterPlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
      codeMirrorPlugin({ codeBlockLanguages: { js: "JavaScript", css: "CSS", txt: "Plain Text", tsx: "TypeScript", "": "Unspecified" } }),
      directivesPlugin({ directiveDescriptors: [YoutubeDirectiveDescriptor, AdmonitionDirectiveDescriptor] }),
      diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
      markdownShortcutPlugin()
    ]}
  />
</div>

export default Editor