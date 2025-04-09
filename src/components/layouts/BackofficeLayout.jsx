import BackofficeNav from "@/components/nav/BackofficeNav"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

const BackofficeLayout = ({ children }) => (
  <main className="flex flex-1 flex-col h-full">
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-1 h-full"
    >
      <ResizablePanel className="min-w-24" defaultSize={15} maxSize={20} minSize={10}>
        <BackofficeNav />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="h-full w-full">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </main>
)

export default BackofficeLayout